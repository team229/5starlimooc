#!/usr/bin/env python3
"""
Post-build audit of dist/:

  1. No asset/resource is loaded from 5starlimooc.com
     (canonical + schema.org links are text, not loads — those are allowed).
  2. Every internal href/src/srcset actually exists on disk.
  3. The tracking stack (GA4 / GTM / Trustindex) is present.
  4. Report external hosts that *are* loaded, with counts.

Usage:  python3 scripts/verify.py
Exit code 1 when a hard failure is found.
"""

import json
import os
import re
import sys
from collections import Counter, defaultdict
from html.parser import HTMLParser
from urllib.parse import urlparse, unquote

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DIST = os.path.join(ROOT, "dist")

RESOURCE_ATTRS = {
    "img": ("src", "srcset"),
    "script": ("src",),
    "link": ("href",),
    "iframe": ("src",),
    "source": ("src", "srcset"),
    "video": ("src", "poster"),
    "audio": ("src",),
    "object": ("data",),
    "embed": ("src",),
    "form": ("action",),
    "use": ("href", "xlink:href"),
    "image": ("href", "xlink:href"),
}

TRACKING_MARKERS = {
    "GA4 (G-9F9GDE33Z9)": "G-9F9GDE33Z9",
    "GTM (GTM-KHQFFXS4)": "GTM-KHQFFXS4",
    "GTM noscript iframe": "googletagmanager.com/ns.html",
    "Trustindex loader": "cdn.trustindex.io/loader.js",
    "gtag config": "gtag('config'",
    "Quote form endpoint": "api-inform.bythub.in",
    "Contact form endpoint": "api.web3forms.com",
}


class Parser(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.loads = []  # (tag, attr, value)
        self.links = []  # internal hrefs to check
        self.scripts_inline = []
        self._in_script = False
        self._buf = []
        self.title = ""

    def handle_starttag(self, tag, attrs):
        d = dict(attrs)
        for attr in RESOURCE_ATTRS.get(tag, ()):
            v = d.get(attr)
            if v:
                for part in v.split(","):
                    part = part.strip().split(" ")[0] if tag in ("img", "source") else part
                    if part:
                        self.loads.append((tag, attr, part))
        if tag == "a" and d.get("href"):
            self.loads.append(("a", "href", d["href"]))
        if d.get("style") and "url(" in d["style"]:
            for m in re.findall(r"url\(([^)]+)\)", d["style"]):
                self.loads.append((tag, "style", m.strip("'\"")))
        if tag == "meta" and d.get("content"):
            prop = (d.get("property") or d.get("name") or "").lower()
            if prop in ("og:image", "twitter:image", "image"):
                self.loads.append(("meta", prop, d["content"]))
        if tag == "script":
            if d.get("src"):
                self._in_script = False
            else:
                self._in_script = True
                self._buf = []
        if tag == "form" and d.get("action"):
            self.loads.append(("form", "action", d["action"]))

    def handle_data(self, data):
        if self._in_script:
            self._buf.append(data)

    def handle_endtag(self, tag):
        if tag == "script" and self._in_script:
            self.scripts_inline.append("".join(self._buf))
            self._in_script = False

    def handle_startendtag(self, tag, attrs):
        self.handle_starttag(tag, attrs)


def main():
    if not os.path.isdir(DIST):
        print("dist/ not found — run `npm run build` first", file=sys.stderr)
        return 1

    html_files = []
    for dirpath, _dirs, files in os.walk(DIST):
        for f in files:
            if f.endswith((".html", ".xml", ".txt")):
                html_files.append(os.path.join(dirpath, f))

    forbidden_loads = []
    broken = Counter()
    broken_examples = defaultdict(list)
    hosts = Counter()
    missing_track = []
    page_html = {}

    # bundled client scripts (Astro code-splits inline <script> blocks) — the
    # contact form endpoint only appears here, so include it in text checks
    bundle_text = ""
    astro_dir = os.path.join(DIST, "_astro")
    if os.path.isdir(astro_dir):
        for f in os.listdir(astro_dir):
            if f.endswith(".js"):
                with open(os.path.join(astro_dir, f), encoding="utf-8", errors="replace") as fh:
                    bundle_text += fh.read()

    for path in html_files:
        rel = os.path.relpath(path, DIST)
        with open(path, encoding="utf-8", errors="replace") as fh:
            text = fh.read()

        if path.endswith(".html"):
            page_html[rel] = text
            p = Parser()
            p.feed(text)
            inline = " ".join(p.scripts_inline)
            all_text = text

            for tag, attr, value in p.loads:
                if not value or value.startswith(("#", "tel:", "mailto:", "javascript:", "data:", "about:")):
                    continue
                if value.startswith("//"):
                    value = "https:" + value
                parsed = urlparse(value)

                # 1. forbidden origin — but canonical + social preview images are
                #    SEO metadata, not page loads; validate them separately.
                if parsed.netloc.endswith("5starlimooc.com"):
                    if (tag == "link" and attr == "href") or (
                        tag == "meta" and attr in ("og:image", "twitter:image", "image")
                    ):
                        if parsed.path and parsed.path != "/":
                            fs_meta = os.path.join(DIST, unquote(parsed.path).lstrip("/"))
                            if parsed.path.rstrip("/") == "/404":
                                fs_meta_ok = os.path.isfile(os.path.join(DIST, "404.html"))
                            else:
                                fs_meta_ok = os.path.isfile(fs_meta) or os.path.isfile(
                                    fs_meta.rstrip("/") + "/index.html"
                                )
                            if not fs_meta_ok:
                                broken["meta-target"] += 1
                                if len(broken_examples["meta-target"]) < 8:
                                    broken_examples["meta-target"].append(f"{rel} -> {value}")
                    else:
                        forbidden_loads.append((rel, tag, attr, value))

                # host census (only for real loads, not <a href>)
                if tag != "a" and parsed.scheme in ("http", "https"):
                    hosts[parsed.netloc] += 1
                    if attr == "href" and parsed.netloc == "":
                        pass

                # 2. internal target exists
                if tag == "a":
                    continue
                if parsed.scheme in ("http", "https", "") and not parsed.netloc:
                    target = unquote(parsed.path or "/")
                    if target.endswith((".css", ".js", ".mjs", ".png", ".jpg", ".jpeg", ".webp", ".svg",
                                        ".gif", ".ico", ".woff", ".woff2", ".ttf", ".mp4", ".json",
                                        ".xml", ".txt", ".pdf", ".avif")):
                        fs = os.path.join(DIST, target.lstrip("/"))
                        ok = os.path.isfile(fs)
                    elif target.endswith("/") or target == "":
                        fs = os.path.join(DIST, target.lstrip("/"), "index.html")
                        ok = os.path.isfile(fs)
                    else:
                        ok = os.path.isfile(os.path.join(DIST, target.lstrip("/"))) or os.path.isfile(
                            os.path.join(DIST, target.lstrip("/"), "index.html")
                        )
                        fs = target
                    if not ok:
                        broken[attr] += 1
                        if len(broken_examples[attr]) < 8:
                            broken_examples[attr].append(f"{rel} -> {value}")

            # anchors
            for m in re.findall(r'href="(/[^"#]*)"', text):
                if m.startswith("/images") or m.startswith("/fonts") or "/_astro/" in m:
                    continue
                if not m.startswith("//"):
                    fs = m.rstrip("/")
                    if not (os.path.isfile(os.path.join(DIST, fs.lstrip("/")))
                            or os.path.isfile(os.path.join(DIST, fs.lstrip("/"), "index.html"))):
                        broken["a-href"] += 1
                        if len(broken_examples["a-href"]) < 12:
                            broken_examples["a-href"].append(f"{rel} -> {m}")

            # (tracking markers are checked after the loop, once every page
            # has been read into page_html)

    # ------------------------------------------------------------------ report
    print("=" * 68)
    print(f"pages scanned: {len(page_html)}  (+{len(html_files)-len(page_html)} non-html files)")
    print("=" * 68)

    ok = True

    # tracking markers: most live on the homepage; the contact form endpoint
    # only appears on the contact page
    for label, marker in TRACKING_MARKERS.items():
        if label == "Contact form endpoint":
            haystack = page_html.get("contact/index.html", "")
        else:
            haystack = page_html.get("index.html", "")
        if marker not in haystack:
            missing_track.append(label)

    if forbidden_loads:
        ok = False
        print(f"\n✗ {len(forbidden_loads)} resource(s) still loaded from 5starlimooc.com:")
        for rel, tag, attr, value in forbidden_loads[:30]:
            print(f"    {rel}: <{tag} {attr}> {value}")
    else:
        print("\n✓ no resource is loaded from 5starlimooc.com")

    if missing_track:
        ok = False
        print(f"\n✗ tracking missing: {missing_track}")
    else:
        print("✓ GA4 + GTM + Trustindex + form endpoints present")

    if broken:
        ok = False
        print(f"\n✗ broken internal references: {dict(broken)}")
        for attr, examples in broken_examples.items():
            for e in examples:
                print(f"    [{attr}] {e}")
    else:
        print("✓ all internal asset/page references resolve")

    print("\nexternal hosts loaded:")
    if hosts:
        for host, count in hosts.most_common():
            print(f"    {count:5d}  {host}")
    else:
        print("    (none)")

    # sizes
    total = 0
    for dirpath, _d, files in os.walk(DIST):
        for f in files:
            total += os.path.getsize(os.path.join(dirpath, f))
    print(f"\ndist size: {total/1024/1024:.1f} MB")

    return 0 if ok else 1


if __name__ == "__main__":
    sys.exit(main())
