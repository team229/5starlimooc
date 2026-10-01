#!/usr/bin/env python3
"""
Extract the original site's self-contained Elementor "Custom HTML" widgets and
store them (sanitised + fully local) in the scraped page records.

The widgets carry their own <style> block and their own layout, so rendering
them verbatim gives a pixel-faithful replica of the original page body while
our Astro Header/Footer still wrap the page.

Sanitising performed:
  * <script>, <noscript>, <link rel=stylesheet>, <head>/<body>/<title> tags dropped
  * @import / Google Fonts dropped (the build self-hosts its fonts)
  * body/html CSS rules dropped (they would restyle the whole site)
  * the widget's duplicate fixed site header is removed (Astro renders one)
  * every remote image is downloaded into public/images/ and rewritten
  * every internal link is rewritten to the local route

Usage:
    python3 scripts/embed.py                 # all target pages
    python3 scripts/embed.py --check         # dry run, print widget summary
"""

import argparse
import json
import os
import re
import sys
import urllib.parse
import urllib.request

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from scrape import BASE, ROOT, UA, absolutize, download_image, local_path_for_image  # noqa: E402

CONTENT_DIR = os.path.join(ROOT, "src", "content", "pages")
CACHE_DIR = "/tmp/opencode/scrape-cache"

# Pages whose body is a bespoke HTML widget rather than theme content.
TARGET_PREFIXES = ("/services/", "/fleet/", "/about-us/", "/gallery/")
TARGET_SLUGS = (
    "black-car-service",
    "chrysler-300-limo-rental",
    "concert-limo-rental",
    "corporate-limo-service",
    "escalade-limo-rental",
    "executive-car-service-orange-county",
    "hollywood-tour",
    "hummer-limo-rental",
    "luxury-car-service",
    "luxury-suv-service",
    "luxury-transportation-services",
    "mercedes-sprinter-limo-bus",
    "party-bus-rental",
    "private-car-service-to-lax",
    "professional-limousine-service",
    "prom-limo-rental",
    "quinceanera-limo-rental",
    "shuttle-van-service",
    "stretch-suv-limo-rentals",
    "suv-limo-service",
)


# ---------------------------------------------------------------- fetching ---

def fetch(url):
    cp = os.path.join(CACHE_DIR, re.sub(r"[^a-zA-Z0-9]+", "_", url)[-150:])
    if os.path.exists(cp) and os.path.getsize(cp) > 0:
        with open(cp, "rb") as fh:
            return fh.read().decode("utf-8", "ignore")
    try:
        req = urllib.request.Request(url, headers={"User-Agent": UA, "Referer": BASE + "/"})
        with urllib.request.urlopen(req, timeout=60) as resp:
            data = resp.read()
    except Exception as exc:  # noqa: BLE001
        print("  ! fetch failed", url, exc)
        return ""
    os.makedirs(CACHE_DIR, exist_ok=True)
    with open(cp, "wb") as fh:
        fh.write(data)
    return data.decode("utf-8", "ignore")


def extract_widget_containers(html):
    """Return the inner HTML of every .elementor-widget-html container (depth aware)."""
    out = []
    for m in re.finditer(r'<div[^>]*class="[^"]*elementor-widget-html[^"]*"[^>]*>', html):
        start = html.find(">", m.start()) + 1
        depth = 1
        i = start
        while depth and i < len(html):
            nxt = re.compile(r"<div\b|</div>").search(html, i)
            if not nxt:
                break
            if nxt.group(0).startswith("</"):
                depth -= 1
                if depth == 0:
                    out.append(html[start:nxt.start()])
                    break
                i = nxt.end()
            else:
                depth += 1
                i = nxt.end()
        else:
            break
    return out


# ------------------------------------------------------------- sanitising ---

SCRIPT_RE = re.compile(r"<script\b[^>]*>.*?</script>", re.S | re.I)
NOSCRIPT_RE = re.compile(r"<noscript\b[^>]*>.*?</noscript>", re.S | re.I)
LINK_RE = re.compile(r"<link\b[^>]*>", re.I)
IMPORT_RE = re.compile(r"@import[^;]*;", re.I)
COMMENT_RE = re.compile(r"<!--.*?-->", re.S)


def strip_duplicate_header(fragment):
    """Drop the widget's own fixed site header (Astro already renders one)."""
    m = re.search(r'<div[^>]*class="[^"]*site-header[^"]*"[^>]*>', fragment)
    if not m:
        return fragment
    depth = 1
    i = m.end()
    while depth:
        nxt = re.compile(r"<div\b|</div>").search(fragment, i)
        if not nxt:
            break
        if nxt.group(0).startswith("</"):
            depth -= 1
            i = nxt.end()
            if depth == 0:
                return fragment[: m.start()] + fragment[i:]
        else:
            depth += 1
            i = nxt.end()
    return fragment


def drop_global_css_rules(css):
    """Remove body/html rules (they would restyle the whole document)."""
    out = []
    i = 0
    while i < len(css):
        open_brace = css.find("{", i)
        if open_brace == -1:
            out.append(css[i:])
            break
        sel = css[i:open_brace].strip()
        depth = 1
        j = open_brace + 1
        while depth and j < len(css):
            if css[j] == "{":
                depth += 1
            elif css[j] == "}":
                depth -= 1
            j += 1
        body = css[open_brace : j]
        bare = re.sub(r"\s+", "", sel).lower()
        if sel.startswith("@") or bare in ("body", "html", "body{}", ":root" ):
            if bare == ":root":
                out.append(body)  # keep the custom properties, drop nothing
            elif sel.startswith("@"):
                out.append(sel + body)
            # body/html rules dropped
        else:
            out.append(sel + body)
        i = j
    return "".join(out)


def rewrite_urls(fragment, page_url):
    """Download every remote image and rewrite src/url() to the local path."""
    seen = {}

    def localize(url):
        if not url or url.startswith(("data:", "#", "tel:", "mailto:", "javascript:")):
            return url
        if url.startswith("/"):
            return url
        absu = absolutize(url, page_url)
        if not absu:
            return url
        if absu in seen:
            return seen[absu]
        local = local_path_for_image(absu)
        if not any(absu.lower().split("?")[0].endswith(ext) for ext in
                   (".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg", ".avif")):
            # css background or extension-less asset — keep extension logic of scraper
            pass
        if absu.startswith(BASE) or any(h in absu for h in ("unsplash", "images.", "cdn.")):
            download_image(absu)
        seen[absu] = local
        return local

    def repl_src(m):
        return f'{m.group(1)}="{localize(m.group(2))}"'

    fragment = re.sub(r'(\bsrc)="([^"]+)"', repl_src, fragment)
    fragment = re.sub(r"(\bsrc)='([^']+)'", lambda m: f"{m.group(1)}='{localize(m.group(2))}'", fragment)

    def repl_css(m):
        return f"{m.group(1)}('{localize(m.group(2))}')"

    fragment = re.sub(r"(url\()\s*['\"]?([^'\")]+)['\"]?\s*\)", repl_css, fragment)

    # srcset: keep only local candidates
    def repl_srcset(m):
        parts = []
        for item in m.group(1).split(","):
            item = item.strip()
            if not item:
                continue
            u = item.split()[0]
            local = localize(u)
            rest = item[len(u):]
            parts.append(local + rest)
        return 'srcset="' + ", ".join(parts) + '"'

    fragment = re.sub(r'srcset="([^"]+)"', repl_srcset, fragment)
    return fragment


def rewrite_links(fragment):
    def repl(m):
        url = m.group(2)
        if url.startswith(("tel:", "mailto:", "#", "/", "data:")):
            return m.group(0)
        if "5starlimooc.com" not in url:
            return m.group(0)
        parsed = urllib.parse.urlparse(url)
        path = parsed.path or "/"
        if not path.endswith("/") and "." not in path.rsplit("/", 1)[-1]:
            path += "/"
        return f'{m.group(1)}="{path}"'

    return re.sub(r'(href)="([^"]+)"', repl, fragment)


def clean_widget(fragment, page_url, is_header_widget):
    fragment = COMMENT_RE.sub("", fragment)
    fragment = SCRIPT_RE.sub("", fragment)
    fragment = NOSCRIPT_RE.sub("", fragment)
    fragment = LINK_RE.sub("", fragment)
    if is_header_widget:
        fragment = strip_duplicate_header(fragment)
    # document scaffolding that is meaningless inside a <div>
    fragment = re.sub(r"<!DOCTYPE[^>]*>", "", fragment, flags=re.I)
    fragment = re.sub(r"</?head[^>]*>", "", fragment, flags=re.I)
    fragment = re.sub(r"<title[^>]*>.*?</title>", "", fragment, flags=re.I | re.S)
    fragment = re.sub(r"<body[^>]*>", "", fragment, flags=re.I)
    fragment = fragment.replace("</body>", "")

    # sanitise every <style> block
    def fix_style(m):
        css = IMPORT_RE.sub("", m.group(1))
        css = drop_global_css_rules(css)
        css = rewrite_urls(css, page_url)
        return "<style>" + css + "</style>"

    fragment = re.sub(r"<style\b[^>]*>(.*?)</style>", fix_style, fragment, flags=re.S | re.I)

    fragment = rewrite_urls(fragment, page_url)
    fragment = rewrite_links(fragment)
    return fragment


def is_header_widget(fragment):
    return "offer-strip" in fragment or 'class="site-header"' in fragment


# ------------------------------------------------------------------- main ---

def collect_targets():
    targets = []
    for name in sorted(os.listdir(CONTENT_DIR)):
        if not name.endswith(".json"):
            continue
        with open(os.path.join(CONTENT_DIR, name), encoding="utf-8") as fh:
            rec = json.load(fh)
        path = rec.get("path") or ""
        if path in ("/about-us/", "/gallery/") or path.startswith(TARGET_PREFIXES) or \
                path.strip("/") in TARGET_SLUGS:
            targets.append((name, rec))
    return targets


def process(check=False):
    targets = collect_targets()
    print(f"{len(targets)} target pages")
    kept = 0
    for name, rec in targets:
        path = rec["path"]
        html = fetch(BASE + path)
        if not html:
            print("  ! no html", path)
            continue
        body = html
        m = re.search(r'data-elementor-type="wp-(?:page|post)"', html)
        if m:
            start = html.rfind("<", 0, m.start())
            end = html.find("</article>", m.start())
            body = html[start:end if end > 0 else len(html)]
        widgets = extract_widget_containers(body)
        pieces = [clean_widget(w, BASE + path, is_header_widget(w)) for w in widgets]
        pieces = [p for p in pieces if re.sub(r"\s+", "", p)]
        embed = "\n".join(pieces)
        summary = ", ".join(str(len(re.sub(r"\s+", "", p))) for p in pieces)
        print(f"  {path:55s} widgets={len(pieces)} [{summary}]")
        if check:
            continue
        if not embed.strip():
            rec.pop("embed", None)
        else:
            rec["embed"] = embed
            kept += 1
        with open(os.path.join(CONTENT_DIR, name), "w", encoding="utf-8") as fh:
            json.dump(rec, fh, indent=2, ensure_ascii=False)
    print(f"embed stored for {kept} pages")


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("--check", action="store_true")
    args = ap.parse_args()
    process(check=args.check)
