#!/usr/bin/env python3
"""Capture the Trustindex Google-reviews widget markup + its CSS + assets
locally so the tracking loader still works without hot-linking anything."""

import os
import re
import sys
import urllib.request

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from scrape import ROOT, fetch, local_path_for_image, absolutize  # noqa: E402

PAGE = "https://5starlimooc.com/"
WIDGET_OUT = os.path.join(ROOT, "src", "data", "trustindex-widget.html")
CSS_OUT = os.path.join(ROOT, "public", "css", "trustindex-google-widget.css")


def main():
    data = fetch(PAGE, tries=4)
    if not data:
        print("homepage fetch failed", file=sys.stderr)
        sys.exit(1)
    html = data.decode("utf-8", "replace")

    m = re.search(r'<pre class="ti-widget">.*?</pre>', html, re.S)
    if not m:
        print("widget markup not found", file=sys.stderr)
        sys.exit(1)
    widget = m.group(0)

    # 1. localise every asset URL inside the widget — download first so the
    #    local filename is guaranteed to exist (Google rotates avatar URLs,
    #    so a re-captured widget may reference new files)
    for remote in sorted(set(re.findall(r'(?:\bsrc|\bdata-src)="(https?://[^"]+)"', widget))):
        rel = local_path_for_image(absolutize(remote, PAGE))
        dest = os.path.join(ROOT, "public", rel.lstrip("/"))
        if os.path.exists(dest) and os.path.getsize(dest) > 0:
            continue
        blob = fetch(remote, tries=3, binary=True)
        if blob:
            os.makedirs(os.path.dirname(dest), exist_ok=True)
            with open(dest, "wb") as fh:
                fh.write(blob)
            print(f"    widget asset {rel} ({len(blob)} bytes)")
        else:
            print(f"    ! widget asset failed: {remote}", file=sys.stderr)

    def repl(match):
        url = match.group(2)
        return f'{match.group(1)}{local_path_for_image(absolutize(url, PAGE))}"'

    widget = re.sub(r'(\b(?:src|data-src)=")(https?://[^"]+)"', repl, widget)
    # drop srcset/sizes entirely: the localised src above is the only file we
    # ship, so generated density variants would 404 (the live loader swaps in
    # fresh CDN markup for real visitors anyway)
    widget = re.sub(r'\s+srcset="[^"]*"', "", widget)
    widget = re.sub(r'\s+sizes="[^"]*"', "", widget)

    os.makedirs(os.path.dirname(WIDGET_OUT), exist_ok=True)
    with open(WIDGET_OUT, "w", encoding="utf-8") as fh:
        fh.write(widget)
    print(f"widget markup -> {os.path.relpath(WIDGET_OUT, ROOT)} ({len(widget)} bytes)")

    # 2. the widget stylesheet lives on the site -> download it
    css_match = re.search(r'<link[^>]+href="(https?://[^"]*trustindex-google-widget\.css[^"]*)"', html)
    if css_match:
        url = css_match.group(1)
        css = fetch(url, tries=3, binary=True)
        if css:
            os.makedirs(os.path.dirname(CSS_OUT), exist_ok=True)
            text = css.decode("utf-8", "replace")
            # rewrite any absolute asset references inside the css too
            text = re.sub(
                r'url\(\s*[\'"]?(https?://[^\'")]+)[\'"]?\s*\)',
                lambda mm: f'url({local_path_for_image(absolutize(mm.group(1), PAGE))})',
                text,
            )
            with open(CSS_OUT, "w", encoding="utf-8") as fh:
                fh.write(text)
            print(f"widget css    -> {os.path.relpath(CSS_OUT, ROOT)} ({len(text)} bytes)")

    # 3. download every asset the widget stylesheet points at
    #    (widget <img> assets were already fetched in step 1)
    urls = set(re.findall(r'url\((/images/[^)]+)\)', open(CSS_OUT).read())) if os.path.exists(CSS_OUT) else set()
    ok = 0
    for rel in sorted(urls):
        if rel.startswith("/images/wp-content"):
            remote = "https://5starlimooc.com" + rel[len("/images"):]
        elif rel.startswith("/images/ext/trustindex/"):
            remote = "https://cdn.trustindex.io" + rel[len("/images/ext/trustindex"):]
        else:
            remote = None
        dest = os.path.join(ROOT, "public", rel.lstrip("/"))
        if os.path.exists(dest) and os.path.getsize(dest) > 0:
            ok += 1
            continue
        if not remote:
            continue
        blob = fetch(remote, tries=3, binary=True)
        if blob:
            os.makedirs(os.path.dirname(dest), exist_ok=True)
            with open(dest, "wb") as fh:
                fh.write(blob)
            ok += 1
    print(f"{ok} widget assets present locally")


if __name__ == "__main__":
    main()
