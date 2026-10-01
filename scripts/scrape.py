#!/usr/bin/env python3
"""
Scrape 5starlimooc.com into fully local Astro data.

 * Fetches every URL found in the XML sitemaps.
 * Extracts semantic content blocks (headings, paragraphs, lists, images,
   quotes, tables, buttons) into JSON files under src/content/pages/.
 * Downloads every referenced image into public/images/ (no hot-linking).
 * Downloads self-hosted webfonts into public/fonts/.
 * Rewrites all internal links to local routes.

Nothing loaded by the finished site points back at 5starlimooc.com.

Usage:
    python3 scripts/scrape.py            # everything (cached, idempotent)
    python3 scripts/scrape.py --pages    # page text only
    python3 scripts/scrape.py --images   # images only
    python3 scripts/scrape.py --fonts    # webfonts only
"""

import gzip
import io
import json
import os
import re
import sys
import time
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET
from concurrent.futures import ThreadPoolExecutor, as_completed
from html import unescape

from bs4 import BeautifulSoup, NavigableString, Tag

BASE = "https://5starlimooc.com"
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CONTENT_DIR = os.path.join(ROOT, "src", "content", "pages")
IMAGES_DIR = os.path.join(ROOT, "public", "images")
FONTS_DIR = os.path.join(ROOT, "public", "fonts")
CACHE_DIR = "/tmp/opencode/scrape-cache"

UA = (
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 "
    "(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
)
CHROME_UA = UA

# Pages we hand-build in Astro instead of rendering from scraped content.
HAND_BUILT = {
    "/",
    "/about-us/",
    "/contact/",
    "/blog/",
    "/services/",
    "/fleet/",
    "/cities/",
    "/locations/",
    "/gallery/",
    "/404-2/",
}

# ---------------------------------------------------------------- helpers ---


def fetch(url, tries=4, timeout=45, binary=False):
    """GET a URL with retries. Returns bytes or None."""
    last = None
    for attempt in range(tries):
        try:
            req = urllib.request.Request(
                url,
                headers={
                    "User-Agent": UA,
                    "Accept": "text/html,application/xhtml+xml,image/avif,image/webp,*/*;q=0.8",
                    "Accept-Language": "en-US,en;q=0.9",
                    "Accept-Encoding": "gzip, deflate",
                },
            )
            with urllib.request.urlopen(req, timeout=timeout) as resp:
                data = resp.read()
                enc = (resp.headers.get("Content-Encoding") or "").lower()
                if enc == "gzip":
                    data = gzip.GzipFile(fileobj=io.BytesIO(data)).read()
                elif enc == "deflate":
                    import zlib
                    try:
                        data = zlib.decompress(data)
                    except zlib.error:
                        data = zlib.decompress(data, -zlib.MAX_WBITS)
                if not binary and len(data) == 0:
                    raise ValueError("empty body")
                return data
        except Exception as exc:  # noqa: BLE001
            last = exc
            time.sleep(0.6 * (attempt + 1))
    print(f"    ! failed {url} -> {last}", file=sys.stderr)
    return None


def cache_path(url):
    safe = re.sub(r"[^a-zA-Z0-9._-]+", "_", url.replace(BASE, "").strip("/") or "home")
    return os.path.join(CACHE_DIR, safe[:150] + ".html")


def fetch_page(url):
    """Fetch and cache an HTML page."""
    os.makedirs(CACHE_DIR, exist_ok=True)
    cp = cache_path(url)
    if os.path.exists(cp) and os.path.getsize(cp) > 0:
        with open(cp, "rb") as fh:
            return fh.read()
    data = fetch(url, tries=6, timeout=60)
    if data:
        with open(cp, "wb") as fh:
            fh.write(data)
    return data


def local_path_for_image(url):
    """Map an absolute asset URL to a local /images/... path."""
    if url.startswith("//"):
        url = "https:" + url
    parsed = urllib.parse.urlparse(url)
    path = parsed.path
    if parsed.netloc.endswith("5starlimooc.com"):
        return "/images" + path if path.startswith("/wp-content") else "/images" + path
    # third-party assets (google avatars, trustindex, unsplash) -> namespaced copy
    if "lh3.googleusercontent.com" in parsed.netloc:
        name = re.sub(r"[^a-zA-Z0-9]+", "-", path).strip("-")
        return f"/images/ext/google-{name[:80]}.png"
    if "ui-avatars.com" in parsed.netloc:
        key = re.sub(r"[^a-zA-Z0-9]+", "-", urllib.parse.parse_qs(parsed.query).get("name", ["av"])[0])
        return f"/images/ext/avatar-{key[:60]}.png"
    if "trustindex" in parsed.netloc:
        return "/images/ext/trustindex" + path
    if "unsplash" in parsed.netloc:
        name = os.path.basename(path)
        return f"/images/ext/unsplash-{name}.jpg" if name else "/images/ext/unsplash.jpg"
    # generic fallback
    name = re.sub(r"[^a-zA-Z0-9._-]+", "-", os.path.basename(path)).strip("-") or "asset"
    host = re.sub(r"[^a-zA-Z0-9.-]+", "-", parsed.netloc)
    return f"/images/ext/{host}-{name}"


def absolutize(url, page_url):
    if not url:
        return None
    url = unescape(url.strip())
    if url.startswith("//"):
        url = "https:" + url
    if url.startswith("/"):
        return BASE + url
    if not url.startswith("http"):
        return urllib.parse.urljoin(page_url, url)
    return url


def local_route(url, page_url=None):
    """Rewrite an internal 5starlimooc.com URL to a local route."""
    if not url:
        return None
    raw = unescape(url.strip())
    if raw.startswith("//"):
        raw = "https:" + raw
    if raw.startswith("tel:") or raw.startswith("mailto:") or raw.startswith("#"):
        return raw
    if raw.startswith("/"):
        absu = BASE + raw
    elif raw.startswith("http"):
        absu = raw
    else:
        absu = urllib.parse.urljoin(page_url or BASE + "/", raw)
    parsed = urllib.parse.urlparse(absu)
    host = (parsed.netloc or "").lower()
    if host not in ("5starlimooc.com", "www.5starlimooc.com"):
        return raw  # external -> leave alone
    path = parsed.path or "/"
    if not path.startswith("/"):
        path = "/" + path
    if path.endswith("/index.html"):
        path = path[: -len("index.html")]
    if "." in os.path.basename(path):  # real file (pdf, image...)
        return path
    if path != "/" and not path.endswith("/"):
        path += "/"
    # known redirects on the original site
    if path in ("/locations/",):
        path = "/cities/"
    if path in ("/thankyou", "/thankyou/"):
        path = "/thankyou/"
    if path in ("/contact-us/", "/contactus/"):
        path = "/contact/"
    # slugs linked in original content that 404 on the original site —
    # point them at the closest live page instead of reproducing dead links
    dead = {
        "/24-hour-limo-service/": "/services/",
        "/airport-car-service/": "/services/airport-limo-service/",
        "/bachelor-party-limo-rental/": "/services/bachelor-party-limo-service/",
        "/limousine-service-for-wedding/": "/services/wedding-limo-service/",
        "/services-limos/": "/services/",
        "/wine-tour-limo-rental/": "/services/wine-tour-limo-service/",
    }
    if path in dead:
        path = dead[path]
    if path in ("/privacy-policy/", "/terms-of-service/", "/sitemap/"):
        return path  # we create these locally
    return path


# ------------------------------------------------------------ link tables ---


def collect_urls():
    urls, seen = [], set()

    def add(u):
        u = u.rstrip("/")
        if not u:
            u = BASE
        if u not in seen:
            seen.add(u)
            urls.append(u + "/")

    for sm in ("page-sitemap1.xml", "post-sitemap1.xml"):
        data = fetch(f"{BASE}/{sm}")
        if not data:
            continue
        root = ET.fromstring(data)
        for loc in root.iter("{http://www.sitemaps.org/schemas/sitemap/0.9}loc"):
            add(loc.text.strip())
    # pages that exist but are not in the sitemap (discovered via in-content links)
    # NOTE: /24-hour-limo-service/, /airport-car-service/,
    # /bachelor-party-limo-rental/, /limousine-service-for-wedding/,
    # /services-limos/ and /wine-tour-limo-rental/ are also linked in content
    # but return 404 on the original site — they are remapped to live pages
    # in local_route() instead of being scraped.
    for extra in (
        "/thankyou/",
        "/chrysler-300-limo-rental/",
        "/escalade-limo-rental/",
        "/hollywood-tour/",
        "/hummer-limo-rental/",
        "/mercedes-sprinter-limo-bus/",
        "/party-bus-rental/",
        "/prom-limo-rental/",
        "/quinceanera-limo-rental/",
        "/stretch-suv-limo-rentals/",
    ):
        add(BASE + extra)
    return urls


# -------------------------------------------------------- block extraction ---

SKIP_TAGS = {
    "script", "style", "noscript", "svg", "iframe", "form", "input", "button",
    "select", "textarea", "option", "link", "meta", "object", "embed", "video",
    "audio", "source", "canvas", "map", "area", "base", "col", "template",
}
BLOCK_SEMANTIC = {"h1", "h2", "h3", "h4", "h5", "h6", "p", "ul", "ol",
                  "blockquote", "table", "pre", "hr", "img", "figure"}
SKIP_CLASS_RE = re.compile(
    r"(screen-reader|ast-pagination|sfsi|breadcrumb|wp-block-preformatted|"
    r"addtoany|post-navigation|nav-links|elementor-nav-menu|"
    r"elementor-button-wrapper|wp-block-button)",
    re.I,
)
SKIP_CLASS_TOKENS = {
    "share", "sharedaddy", "sfsi", "addtoany", "breadcrumb", "nav-links",
    "elementor-nav-menu", "elementor-button-wrapper", "wp-block-button",
    "screen-reader-text", "ast-pagination", "post-navigation",
}


def has_skip_class(cls: str) -> bool:
    """True when a class attribute marks boilerplate (sharing widgets etc.).

    Token based: matching on raw substrings produced false positives such as
    ``ast-container`` / ``post-123`` hitting ``st-`` patterns.
    """
    for tok in (cls or "").split():
        t = tok.lower()
        if t in SKIP_CLASS_TOKENS:
            return True
        if t.startswith(("sfsi", "addtoany", "wp-block-preformatted")):
            return True
        if "screen-reader" in t or "breadcrumb" in t or "pagination" in t:
            return True
    return False


def clean_text(s):
    return re.sub(r"\s+", " ", s or "").strip()


def rewrite_markup(html, page_url):
    """Rewrite href/src/srcset inside a markup fragment to local paths."""
    html = re.sub(
        r'href=(["\'])(https?://(?:www\.)?5starlimooc\.com[^"\']*)\1',
        lambda m: f'href={m.group(1)}{local_route(m.group(2), page_url)}{m.group(1)}',
        html,
    )
    html = re.sub(
        r'href=(["\'])(https?://(?:www\.)?5starlimooc\.com/index\.php/[^"\']*)\1',
        lambda m: f'href={m.group(1)}{local_route(re.sub(r"/index\.php/", "/", m.group(2), count=1), page_url)}{m.group(1)}',
        html,
    )
    html = re.sub(
        r'href=(["\'])(/(?!images/)[^"\']*)\1',
        lambda m: f'href={m.group(1)}{local_route(re.sub(r"^/index\.php/", "/", m.group(2)), page_url)}{m.group(1)}',
        html,
    )
    html = re.sub(
        r'src=(["\'])(https?://[^"\']+)\1',
        lambda m: f'src={m.group(1)}{local_path_for_image(absolutize(m.group(2), page_url))}{m.group(1)}',
        html,
    )
    return html


def inline_markup(tag, page_url):
    """Serialise inline children (strong/em/a/br/u/s/sub/sup/span) only."""
    out = []
    for child in tag.children:
        if isinstance(child, NavigableString):
            out.append(str(child))
        elif isinstance(child, Tag):
            name = child.name
            if name in ("strong", "b", "em", "i", "u", "s", "sub", "sup", "br", "span", "small", "mark", "code"):
                inner = inline_markup(child, page_url)
                if name == "br":
                    out.append("<br>")
                elif name in ("span", "code"):
                    out.append(inner)
                else:
                    out.append(f"<{name}>{inner}</{name}>")
            elif name == "a":
                href = local_route(child.get("href", ""), page_url)
                inner = inline_markup(child, page_url) or clean_text(child.get_text())
                out.append(f'<a href="{href}">{inner}</a>')
            elif name == "img":
                src = child.get("data-src") or child.get("src")
                if src and not src.startswith("data:"):
                    p = local_path_for_image(absolutize(src, page_url))
                    out.append(f'<img src="{p}" alt="{escape_attr(child.get("alt", ""))}">')
            else:
                out.append(inline_markup(child, page_url))
    return "".join(out)


def escape_attr(s):
    return s.replace('"', "&quot;").replace("<", "").replace(">", "")


def img_src(tag):
    for attr in ("data-src", "data-lazy-src", "src"):
        v = tag.get(attr)
        if v and not v.startswith("data:"):
            return v
    srcset = tag.get("srcset") or tag.get("data-srcset")
    if srcset:
        parts = [p.strip().split(" ")[0] for p in srcset.split(",") if p.strip()]
        parts = [p for p in parts if p and not p.startswith("data:")]
        if parts:
            return parts[-1]
    return None


def is_boilerplate(tag):
    """True when an ancestor marks this markup as boilerplate.

    Stops at <body>: WordPress/Astra put widget classes (``sfsi_*`` etc.) on
    the body element, which would otherwise taint every node on the page.
    """
    for parent in tag.parents:
        if not isinstance(parent, Tag):
            continue
        if parent.name in ("html", "body"):
            break
        if has_skip_class(" ".join(parent.get("class", []))):
            return True
        pid = parent.get("id", "") or ""
        if pid in ("sfsi_floater", "masthead", "colophon"):
            return True
    return False


def extract_blocks(root, page_url):
    """Flatten an entry-content tree into semantic blocks."""
    blocks = []

    def emit(block):
        prev = blocks[-1] if blocks else None
        if prev and prev.get("type") == block.get("type") and prev.get("text") == block.get("text"):
            return
        if block.get("type") == "p" and not block.get("html"):
            return
        blocks.append(block)

    def has_semantic_descendant(tag):
        for d in tag.descendants:
            if isinstance(d, Tag) and d.name in BLOCK_SEMANTIC:
                return True
        return False

    def walk(node):
        for child in node.children:
            if isinstance(child, NavigableString):
                continue
            if not isinstance(child, Tag):
                continue
            name = child.name
            if name in SKIP_TAGS:
                continue
            if is_boilerplate(child):
                continue
            cls = " ".join(child.get("class", []))
            if has_skip_class(cls):
                continue

            if name == "img":
                src = img_src(child)
                if src and not src.startswith("data:"):
                    emit({
                        "type": "img",
                        "src": local_path_for_image(absolutize(src, page_url)),
                        "alt": clean_text(child.get("alt", "")),
                    })
                continue

            if name in ("h1", "h2", "h3", "h4", "h5", "h6"):
                text = clean_text(child.get_text(" ", strip=True))
                if text:
                    emit({"type": name, "text": unescape(text)})
                continue

            if name == "p":
                # ignore paragraphs that are purely captions/labels inside <figure>
                html = inline_markup(child, page_url)
                text = clean_text(child.get_text(" ", strip=True))
                if text:
                    emit({"type": "p", "text": unescape(text), "html": rewrite_markup(html, page_url)})
                continue

            if name in ("ul", "ol"):
                items = []
                for li in child.find_all("li", recursive=False):
                    txt = clean_text(li.get_text(" ", strip=True))
                    if txt:
                        items.append(unescape(txt))
                if items:
                    emit({"type": "ul" if name == "ul" else "ol", "items": items})
                continue

            if name == "blockquote":
                text = clean_text(child.get_text(" ", strip=True))
                if text:
                    emit({"type": "quote", "text": unescape(text)})
                continue

            if name == "table":
                rows = []
                for tr in child.find_all("tr"):
                    cells = [clean_text(c.get_text(" ", strip=True)) for c in tr.find_all(["th", "td"])]
                    if any(cells):
                        rows.append(cells)
                if rows:
                    emit({"type": "table", "rows": rows})
                continue

            if name == "figure":
                img = child.find("img")
                cap = child.find("figcaption")
                if img:
                    src = img_src(img)
                    if src:
                        emit({
                            "type": "img",
                            "src": local_path_for_image(absolutize(src, page_url)),
                            "alt": clean_text(img.get("alt", "")),
                            "caption": clean_text(cap.get_text()) if cap else "",
                        })
                    if cap and not img:
                        emit({"type": "p", "text": clean_text(cap.get_text()), "html": clean_text(cap.get_text())})
                    continue

            if name == "a" and re.search(r"btn|button", cls, re.I):
                text = clean_text(child.get_text(" ", strip=True))
                if text:
                    emit({
                        "type": "link",
                        "text": unescape(text),
                        "href": local_route(child.get("href", ""), page_url),
                    })
                continue

            if name in ("div", "section", "article", "main", "aside", "header", "footer",
                        "span", "center", "details", "summary", "dl", "dd", "dt", "address",
                        "figcaption", "label", "li", "cite", "time"):
                if name in ("header", "footer") and child.find_parent(id="primary") is None:
                    pass
                if not has_semantic_descendant(child):
                    text = clean_text(child.get_text(" ", strip=True))
                    if text and len(text) > 1:
                        html = inline_markup(child, page_url)
                        emit({
                            "type": "p",
                            "text": unescape(text),
                            "html": rewrite_markup(html, page_url) or unescape(text),
                        })
                    continue
                walk(child)
                continue

            # unknown wrapper -> keep descending
            if has_semantic_descendant(child) or child.find_all(recursive=False):
                walk(child)
            else:
                text = clean_text(child.get_text(" ", strip=True))
                if text:
                    emit({"type": "p", "text": unescape(text), "html": unescape(text)})

    walk(root)

    # drop trivial noise
    cleaned = []
    for b in blocks:
        t = b.get("text") or b.get("alt") or ""
        if b["type"] == "p" and (not t or t in ("Read More", "READ MORE", "→")):
            continue
        if b["type"] in ("h5", "h6") and not t:
            continue
        cleaned.append(b)
    return cleaned


# ------------------------------------------------------------ page parsing --

TITLE_SUFFIX = re.compile(r"\s*[-|–]\s*5 Star Limousine.*$", re.I)


def parse_page(url, html):
    soup = BeautifulSoup(html, "lxml")

    def meta(*names):
        for n in names:
            tag = soup.find("meta", attrs={"property": n}) or soup.find("meta", attrs={"name": n})
            if tag and tag.get("content"):
                return tag["content"].strip()
        return ""

    title = meta("og:title") or (soup.title.get_text(strip=True) if soup.title else "")
    title = TITLE_SUFFIX.sub("", unescape(title)).strip()
    desc = meta("og:description", "description")
    canonical = ""
    link = soup.find("link", rel="canonical")
    if link:
        canonical = link.get("href", "")

    # ---- content root
    main = soup.find("main") or soup.find(id="primary") or soup.body
    content = None
    if main:
        content = main.find(class_=re.compile(r"\bentry-content\b"))
    if content is None and main:
        content = main.find("article") or main
    if content is None:
        content = soup

    blocks = extract_blocks(content, url)

    # ---- h1 (page heading)
    h1 = ""
    for tag in content.find_all(["h1", "h2"]):
        candidate = clean_text(tag.get_text(" ", strip=True))
        if candidate:
            h1 = unescape(candidate)
            break
    if not h1:
        h1 = title

    # ---- eyebrow/badge above the heading
    eyebrow = ""
    if h1:
        for tag in content.find_all(["h1", "h2", "h3", "div", "span"]):
            if clean_text(tag.get_text(" ", strip=True)) != h1:
                continue
            prev = tag.find_previous(["div", "span", "p"])
            if prev:
                txt = clean_text(prev.get_text(" ", strip=True))
                if 0 < len(txt) <= 60 and txt != h1:
                    eyebrow = unescape(txt)
            break

    # first H1/H2 block gets removed from blocks if it duplicates page heading
    blocks = [b for b in blocks if not (b["type"] in ("h1", "h2") and b.get("text") == h1)]

    # ---- images used by the page
    images = set()
    for img in soup.find_all("img"):
        src = img_src(img)
        if src and not src.startswith("data:"):
            images.add(absolutize(src, url))
    og = meta("og:image")
    if og:
        images.add(og)

    # ---- CSS background images
    for style in soup.find_all("style"):
        for m in re.findall(r"url\(['\"]?(https?://[^)'\"]+|/[^)'\"]+)['\"]?\)", style.get_text()):
            images.add(absolutize(m, url))

    # ---- featured / hero image
    featured = ""
    fg = soup.find("link", rel="image_src")
    if fg:
        featured = fg.get("href", "")
    if not featured:
        featured = meta("og:image")
    if featured and "5starlimooc.com" not in featured and not featured.startswith("/"):
        featured = ""
    if featured:
        featured = local_path_for_image(absolutize(featured, url))

    # ---- publication date
    date = meta("article:published_time", "article:modified_time", "date")
    if not date:
        ld = soup.find("script", type="application/ld+json")
        if ld:
            m = re.search(r'"datePublished"\s*:\s*"([^"]+)"', ld.string or "")
            if m:
                date = m.group(1)
    if not date:
        tm = soup.find("time")
        if tm:
            date = tm.get("datetime", "") or clean_text(tm.get_text())

    # ---- breadcrumb-ish classification
    path = urllib.parse.urlparse(url).path
    if not path.endswith("/"):
        path += "/"
    kind = "page"
    if path.startswith("/blog/"):
        kind = "post"
    elif path.startswith("/services/"):
        kind = "service"
    elif path.startswith("/fleet/"):
        kind = "fleet"
    elif re.match(r"^/limo-party-bus-rentals-service-.+-ca/$", path):
        kind = "city"

    return {
        "path": path,
        "title": title,
        "description": unescape(desc),
        "eyebrow": eyebrow,
        "h1": h1,
        "date": date[:10] if date else "",
        "kind": kind,
        "featured": featured,
        "blocks": blocks,
        "images": sorted(images),
        "canonical": canonical,
    }


# ----------------------------------------------------------- image assets ---

IMAGE_EXTS = (".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg", ".ico", ".avif")


def download_image(url):
    """Download one image. Returns 'ok' | 'skip' | 'fail'."""
    if not url:
        return "skip"
    url = absolutize(url, BASE + "/")
    if url.startswith("//"):
        url = "https:" + url
    rel = local_path_for_image(url)
    if not rel.lower().endswith(IMAGE_EXTS):
        return "skip"  # fonts, css, ...
    dest = os.path.join(ROOT, "public", rel.lstrip("/"))
    if os.path.exists(dest) and os.path.getsize(dest) > 0:
        return "ok"

    # ask for a fixed format so the local extension matches the bytes
    req_url = url
    host = urllib.parse.urlparse(url).netloc
    if "unsplash" in host and "fm=" not in url:
        req_url += ("&" if "?" in url else "?") + "fm=jpg"
    accept = "image/png,image/*;q=0.8" if rel.endswith(".png") else "image/avif,image/webp,image/*;q=0.8"
    try:
        rq = urllib.request.Request(req_url, headers={
            "User-Agent": UA,
            "Accept": accept,
            "Referer": BASE + "/",
        })
        with urllib.request.urlopen(rq, timeout=60) as resp:
            data = resp.read()
    except Exception as exc:  # noqa: BLE001
        print(f"    ! image failed: {url} -> {exc}", file=sys.stderr)
        return "fail"
    if not data or len(data) < 60:
        print(f"    ! image empty: {url}", file=sys.stderr)
        return "fail"
    os.makedirs(os.path.dirname(dest), exist_ok=True)
    with open(dest, "wb") as fh:
        fh.write(data)
    return "ok"


# ----------------------------------------------------------------- fonts ----

FONT_CSS_URL = (
    "https://fonts.googleapis.com/css2"
    "?family=Montserrat:wght@400;500;600;700;800"
    "&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400"
    "&family=Cinzel:wght@400..700"
    "&family=Playfair+Display:ital,wght@0,400..700;1,400..700"
    "&family=Lato:ital,wght@0,400;0,700;0,900;1,400"
    "&display=swap"
)


def build_fonts():
    os.makedirs(FONTS_DIR, exist_ok=True)
    req = urllib.request.Request(
        FONT_CSS_URL,
        headers={
            "User-Agent": (
                "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 "
                "(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
            )
        },
    )
    try:
        with urllib.request.urlopen(req, timeout=45) as resp:
            css = resp.read().decode("utf-8", "replace")
    except Exception as exc:  # noqa: BLE001
        print(f"    ! fonts css failed: {exc}", file=sys.stderr)
        return

    # keep only latin / latin-ext subsets to stay lean
    chunks = re.split(r"(?=/\*)", css)
    kept = []
    urls = {}
    for chunk in chunks:
        m = re.search(r"/\*\s*([a-z-]+)\s*\*/", chunk)
        subset = m.group(1) if m else ""
        if subset and subset not in ("latin", "latin-ext"):
            continue
        for u in re.findall(r"url\((https://[^)]+\.woff2)\)", chunk):
            name = u.rsplit("/", 1)[-1]
            name = re.sub(r"[^a-zA-Z0-9._-]", "_", name)
            urls[u] = name
            chunk = chunk.replace(u, f"./{name}")
        if "@font-face" in chunk:
            kept.append(chunk)
    out = "".join(kept)
    with open(os.path.join(FONTS_DIR, "fonts.css"), "w", encoding="utf-8") as fh:
        fh.write("/* Self-hosted webfonts (downloaded locally — no external font requests) */\n")
        fh.write(out)

    def grab(item):
        u, name = item
        dest = os.path.join(FONTS_DIR, name)
        if os.path.exists(dest) and os.path.getsize(dest) > 0:
            return
        data = fetch(u, tries=3, timeout=60, binary=True)
        if data:
            with open(dest, "wb") as fh:
                fh.write(data)

    with ThreadPoolExecutor(max_workers=8) as pool:
        list(pool.map(grab, urls.items()))
    print(f"    fonts: {len(urls)} woff2 files + fonts.css")


# ------------------------------------------------------------------ main ----


def main():
    os.makedirs(CONTENT_DIR, exist_ok=True)
    os.makedirs(os.path.join(ROOT, "public", "images"), exist_ok=True)

    only = sys.argv[1] if len(sys.argv) > 1 else ""

    if only in ("", "--fonts"):
        print("• fonts")
        build_fonts()

    urls = collect_urls()
    print(f"• {len(urls)} URLs discovered")

    all_images = set()
    pages = []

    if only in ("", "--pages"):
        print("• pages")
        with ThreadPoolExecutor(max_workers=4) as pool:
            futures = {pool.submit(fetch_page, u): u for u in urls}
            results = {}
            for fut in as_completed(futures):
                u = futures[fut]
                data = fut.result()
                if data:
                    results[u] = data
        for u in urls:
            data = results.get(u)
            if not data:
                print(f"    ! empty: {u}", file=sys.stderr)
                continue
            try:
                page = parse_page(u, data)
            except Exception as exc:  # noqa: BLE001
                print(f"    ! parse {u}: {exc}", file=sys.stderr)
                continue
            pages.append(page)
            all_images.update(page["images"])

        # deterministic output order
        pages.sort(key=lambda p: p["path"])
        for page in pages:
            slug = page["path"].strip("/") or "index"
            slug = slug.replace("/", "__")
            with open(os.path.join(CONTENT_DIR, slug + ".json"), "w", encoding="utf-8") as fh:
                json.dump(page, fh, indent=1, ensure_ascii=False)
        print(f"    {len(pages)} page records written")

    if only in ("", "--images"):
        # gather images from every stored record (so --images alone still works)
        if not all_images:
            for fn in sorted(os.listdir(CONTENT_DIR)):
                if fn.endswith(".json"):
                    with open(os.path.join(CONTENT_DIR, fn), encoding="utf-8") as fh:
                        rec = json.load(fh)
                    all_images.update(rec.get("images", []))
                    if rec.get("featured"):
                        all_images.add(rec["featured"])
        print(f"• images ({len(all_images)} referenced)")
        counts = {"ok": 0, "skip": 0, "fail": 0}
        with ThreadPoolExecutor(max_workers=8) as pool:
            futures = {pool.submit(download_image, u): u for u in sorted(all_images)}
            for fut in as_completed(futures):
                counts[fut.result()] += 1
        print(f"    {counts['ok']} downloaded, {counts['skip']} not images, {counts['fail']} failed")

    print("done")


if __name__ == "__main__":
    main()
