# The Lehrjahre Wing Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Exhibit the bootcamp-era repos (CODAC Berlin 2022–2023) as frozen, hermetically sealed "HTML faces" behind a plaque-style hall page `lehrjahre.html`, integrated into the museum.

**Architecture:** A reusable Python/playwright capture tool freezes each locally-running app's rendered DOM per route, strips framework scripts, localizes every render asset, and seals all external references. Six curated faces + two rescue attempts land in `lehrjahre/<slug>/`; a hall page with 15 catalogue cards is the wing's front door; the landing page, timeline, navs, README and CLAUDE.md are updated.

**Tech Stack:** Python 3 + playwright (sync API, verified working) + BeautifulSoup + Pillow in a venv; `gh` for private-repo clones; `python3 -m http.server` / each repo's own dev server for capture sources; playwright-cli for previews.

**Spec:** `docs/superpowers/specs/2026-08-25-lehrjahre-wing-design.md` — read it first; this plan implements it.

## Global Constraints

- **Hermetic seal** on every `lehrjahre/<slug>/` folder: ZERO external requests, ZERO live external links. Verify per folder: no `src="http`, `href="http`, `src="//`, `href="//`, `url(http`, `url(//` anywhere; no `srcset=` left; `performance.getEntriesByType('resource')` all same-host at preview.
- **Repos stay private and untouched**: all clones and patches happen in throwaway scratch dirs under the session scratchpad; no repo links, no source code, no file trees, no commit SHAs in the museum. Quoting commit *messages* on cards is allowed.
- **No secrets, no PII**: env values used at capture time never enter this repo; portfolio contact data masked with █ blocks (Task 8).
- **Existing exhibits untouched**; shell edits follow existing patterns (shop.html is the shell-page skeleton reference and its nav pattern is the precedent).
- **Faces are new artifacts, not recovered originals** — stripping scripts/rewriting links is legitimate curation, stated in README provenance.
- Dead external images stay authentically dead: point at intentionally absent `assets/lost-external-image.<ext>` + original URL in `data-original` (blog-exhibit precedent). Never substitute placeholders.
- Commit messages: simple, no Claude signature/footer. **Push only on user go-ahead** — the plan ends at a user preview gate.
- CSS class names in museum.css use the `lj-` prefix (`.catalog`/`.item` are taken by the shop).
- Capture ports: gonewiththetailwind 4002, finance-logger 4010, dogsnfilms 4003, admin-dashboard 4004, mahalle-v1 4013, mahalle-v2 4014, movie-db 4001, portefeuille 4015. Museum preview: 8765.
- Workspace (git-ignored via `.superpowers/sdd/.gitignore`): `.superpowers/sdd/lehrjahre/` — inventory shots live here; tools go in `.superpowers/sdd/lehrjahre/tools/`. Scratch clones go under the session scratchpad, NOT the repo.

---

### Task 1: Capture toolkit

**Files:**
- Create: `.superpowers/sdd/lehrjahre/tools/capture_face.py` (git-ignored workspace — no repo commit; the deliverable is the tested tool)
- Create: `.superpowers/sdd/lehrjahre/tools/seal_check.sh`
- Create: venv at `.superpowers/sdd/lehrjahre/tools/venv/`

**Interfaces:**
- Produces: `venv/bin/python capture_face.py --base URL --out DIR --routes R... [--follow-prefix P]... [--dead-pattern REGEX]... [--settle-ms N] [--keep-scripts] [--backlink REL --exhibit-title T] [--special 'ROUTE|CLICK_SELECTOR|OUTFILE']...` — captures each route to `DIR/<route>.html` (`/`→`index.html`, `/a/b`→`a/b.html`), assets under `DIR/assets/`. Also `seal_check.sh DIR` → exits 0 printing `SEALED: DIR` or 1 listing leaks. All later face tasks consume exactly these.

- [ ] **Step 1: Create the venv**

```bash
cd /home/atakee/projects/eski-web-sayfalarim/.superpowers/sdd/lehrjahre/tools 2>/dev/null || mkdir -p /home/atakee/projects/eski-web-sayfalarim/.superpowers/sdd/lehrjahre/tools
cd /home/atakee/projects/eski-web-sayfalarim/.superpowers/sdd/lehrjahre/tools
python3 -m venv --system-site-packages venv
venv/bin/pip install beautifulsoup4 pillow
venv/bin/python -c "from playwright.sync_api import sync_playwright; import bs4, PIL; print('deps OK')"
```
Expected: `deps OK` (playwright comes from system site-packages — verified working in this environment; browsers already in `~/.cache/ms-playwright/`).

- [ ] **Step 2: Write `capture_face.py`**

```python
#!/usr/bin/env python3
"""Freeze a locally running web app into a hermetically sealed HTML face.

Museum rules implemented here:
- capture rendered DOM per route (post-JS), strip framework scripts
- localize every successfully-loaded render asset (img/css/font) into assets/
- external refs that can't be localized -> intentionally absent local path
  + data-original (authentic broken look, zero external requests)
- internal <a> links -> relative .html files; everything else -> href="#"
  + data-original
- inject a curator back-link bar at the top of each page
"""
import argparse, hashlib, os, re, sys, time
from pathlib import Path
from urllib.parse import urljoin, urlparse, unquote, parse_qs
from bs4 import BeautifulSoup, Comment
from playwright.sync_api import sync_playwright

CT_EXT = {"text/css": ".css", "font/woff2": ".woff2", "font/woff": ".woff",
          "application/font-woff": ".woff", "font/ttf": ".ttf",
          "image/png": ".png", "image/jpeg": ".jpg", "image/webp": ".webp",
          "image/gif": ".gif", "image/svg+xml": ".svg", "image/x-icon": ".ico",
          "image/vnd.microsoft.icon": ".ico", "image/avif": ".avif",
          "text/javascript": ".js", "application/javascript": ".js"}
ASSET_CT = tuple(CT_EXT)

def norm(base, page_url, ref):
    """Resolve ref absolute; return (abs_url, is_external_to_base)."""
    absu = urljoin(page_url, ref)
    p, b = urlparse(absu), urlparse(base)
    return absu, not (p.scheme == b.scheme and p.netloc == b.netloc)

def route_file(route):
    r = unquote(urlparse(route).path).strip("/")
    return "index.html" if not r else (r + ".html" if not r.endswith(".html") else r)

def asset_name(url, ctype):
    p = urlparse(url)
    base = os.path.basename(p.path) or "asset"
    base = re.sub(r"[^A-Za-z0-9._-]", "-", unquote(base))[:60]
    h = hashlib.sha1(url.encode()).hexdigest()[:10]
    ext = os.path.splitext(base)[1]
    if not ext and ctype:
        ext = CT_EXT.get(ctype.split(";")[0].strip(), "")
        base += ext
    return f"{h}-{base}"

class Capture:
    def __init__(self, a):
        self.a = a
        self.out = Path(a.out); (self.out / "assets").mkdir(parents=True, exist_ok=True)
        self.bodies = {}      # abs_url -> (bytes, ctype)
        self.saved = {}       # abs_url -> assets/<name> (rel to out root)
        self.pages = {}       # route -> filename
        self.dead = [re.compile(p) for p in (a.dead_pattern or [])]

    def is_dead(self, url):
        return any(rx.search(url) for rx in self.dead)

    def save_asset(self, url, body, ctype):
        if url in self.saved: return self.saved[url]
        name = asset_name(url, ctype)
        (self.out / "assets" / name).write_bytes(body)
        rel = f"assets/{name}"
        self.saved[url] = rel
        if ctype and ctype.startswith("text/css"):
            self.process_css(self.out / "assets" / name, url)
        return rel

    def fetch_direct(self, url):
        """Fetch an asset the browser didn't load (lazy imgs, css url() refs)."""
        import urllib.request
        try:
            req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
            with urllib.request.urlopen(req, timeout=30) as r:
                return r.read(), r.headers.get("Content-Type", "")
        except Exception:
            return None, None

    def localize(self, url):
        """Return local rel path (from out root) or None if unlocalizable."""
        if url in self.saved: return self.saved[url]
        if self.is_dead(url): return None
        if url in self.bodies:
            body, ct = self.bodies[url]
            return self.save_asset(url, body, ct)
        body, ct = self.fetch_direct(url)
        if body is not None and (not ct or ct.split(";")[0].strip() in ASSET_CT
                                 or urlparse(url).netloc == urlparse(self.a.base).netloc):
            return self.save_asset(url, body, ct)
        return None

    CSS_URL = re.compile(r"url\(\s*['\"]?([^'\")]+)['\"]?\s*\)")
    def process_css(self, path, css_url):
        text = path.read_text(errors="replace")
        def sub(m):
            ref = m.group(1).strip()
            if ref.startswith("data:") or ref.startswith("#"): return m.group(0)
            absu = urljoin(css_url, ref)
            local = self.localize(absu)
            # css lives in assets/, siblings are plain basenames
            return f"url({os.path.basename(local)})" if local else "url(lost-external-asset)"
        path.write_text(self.CSS_URL.sub(sub, text))

    def inline_css_text(self, text, page_url, prefix):
        def sub(m):
            ref = m.group(1).strip()
            if ref.startswith("data:") or ref.startswith("#"): return m.group(0)
            absu = urljoin(page_url, ref)
            local = self.localize(absu)
            return f"url({prefix}{local})" if local else "url(assets/lost-external-asset)"
        return self.CSS_URL.sub(sub, text)

    def dead_ref(self, tag, attr, url):
        ext = os.path.splitext(urlparse(url).path)[1] or ".jpg"
        # for /_next/image?url=... keep the human-readable original
        q = parse_qs(urlparse(url).query)
        orig = q["url"][0] if "url" in q else url
        tag["data-original"] = orig
        tag[attr] = f"{self.prefix}assets/lost-external-image{ext}"

    def process_html(self, html, route, page_url, fname):
        soup = BeautifulSoup(html, "html.parser")
        depth = fname.count("/")
        self.prefix = "../" * depth  # from page file to out root

        # scripts
        for s in soup.find_all("script"):
            if self.a.keep_scripts and (not s.get("src") or
                    not norm(self.a.base, page_url, s["src"])[1]):
                if s.get("src"):
                    local = self.localize(norm(self.a.base, page_url, s["src"])[0])
                    if local: s["src"] = self.prefix + local
                    else: s.decompose()
                continue
            s.decompose()
        for l in soup.find_all("link"):
            rel = " ".join(l.get("rel", []) or [])
            if rel in ("preload", "modulepreload", "prefetch", "preconnect",
                       "dns-prefetch"):
                l.decompose()
        for b in soup.find_all("base"): b.decompose()
        for f in soup.find_all("iframe"):
            f.replace_with(Comment(f" iframe removed by curator; original src: {f.get('src','?')} "))

        # asset-bearing attributes
        for tag, attr in [(t, a) for a in ("src", "poster")
                          for t in soup.find_all(attrs={a: True})] + \
                         [(t, "href") for t in soup.find_all("link", href=True)]:
            url = tag.get(attr)
            if not url or url.startswith(("data:", "#")): continue
            absu, _ext = norm(self.a.base, page_url, url)
            local = self.localize(absu)
            if local: tag[attr] = self.prefix + local
            else: self.dead_ref(tag, attr, absu)
            for junk in ("srcset", "sizes", "imagesrcset", "integrity", "crossorigin"):
                if tag.has_attr(junk): del tag[junk]
        for t in soup.find_all(attrs={"srcset": True}): del t["srcset"]

        # inline styles
        for st in soup.find_all("style"):
            if st.string: st.string.replace_with(
                self.inline_css_text(st.string, page_url, self.prefix))
        for t in soup.find_all(style=True):
            if "url(" in t["style"]:
                t["style"] = self.inline_css_text(t["style"], page_url, self.prefix)

        # links
        for a_ in soup.find_all("a", href=True):
            href = a_["href"]
            if href.startswith("#"): continue
            absu, external = norm(self.a.base, page_url, href)
            path = urlparse(absu).path
            if not external and path in self.pages:
                target = self.pages[path]
                a_["href"] = os.path.relpath(target, os.path.dirname(fname) or ".")
            else:
                a_["data-original"] = absu
                a_["href"] = "#"

        # curator bar
        if self.a.backlink and soup.body:
            bar = BeautifulSoup(
                f'<div class="curator-bar" style="background:#101418;color:#9aa4ae;'
                f'font:13px/1.6 ui-monospace,monospace;padding:.45rem 1rem;'
                f'border-bottom:1px solid #2c3640;">'
                f'<a href="{"../" * depth}{self.a.backlink}" style="color:#ffb454;'
                f'text-decoration:none;">← The Lehrjahre wing</a>'
                f' · {self.a.exhibit_title} — frozen capture; nothing here is live.'
                f'</div>', "html.parser")
            soup.body.insert(0, bar)

        (self.out / fname).parent.mkdir(parents=True, exist_ok=True)
        (self.out / fname).write_text(str(soup))
        print(f"  captured {route} -> {fname}")

    def run(self):
        a = self.a
        queue = list(a.routes)
        specials = [s.split("|") for s in (a.special or [])]
        with sync_playwright() as p:
            browser = p.chromium.launch()
            page = browser.new_page(viewport={"width": 1280, "height": 900})
            pending = []
            page.on("response", lambda r: pending.append(r))
            snapshots = []       # (route, page_url, html, fname)
            seen = set()
            while queue:
                route = queue.pop(0)
                if route in seen: continue
                seen.add(route)
                url = a.base.rstrip("/") + route
                pending.clear()
                try:
                    page.goto(url, wait_until="load", timeout=90000)
                    try: page.wait_for_load_state("networkidle", timeout=15000)
                    except Exception: pass
                except Exception as e:
                    print(f"  !! goto failed {route}: {e}"); continue
                time.sleep((a.settle_ms or 500) / 1000)
                for r in list(pending):
                    try:
                        ct = (r.headers.get("content-type") or "").split(";")[0].strip()
                        if r.ok and (ct in ASSET_CT or
                                     urlparse(r.url).netloc == urlparse(a.base).netloc):
                            self.bodies.setdefault(r.url, (r.body(), ct))
                    except Exception: pass
                # discover crawlable links
                for href in page.eval_on_selector_all(
                        "a[href]", "els => els.map(e => e.getAttribute('href'))"):
                    if not href: continue
                    absu, ext = norm(a.base, url, href)
                    path = urlparse(absu).path
                    if not ext and any(path.startswith(pre) for pre in (a.follow_prefix or [])) \
                            and path not in seen and path not in queue:
                        queue.append(path)
                fname = route_file(route)
                self.pages[urlparse(url).path] = fname
                snapshots.append((route, url, page.content(), fname))
                # specials for this route
                for (sr, selector, outfile) in specials:
                    if sr != route: continue
                    try:
                        page.click(selector, timeout=10000); time.sleep(1.0)
                        for r in list(pending):
                            try:
                                ct = (r.headers.get("content-type") or "").split(";")[0].strip()
                                if r.ok and ct in ASSET_CT:
                                    self.bodies.setdefault(r.url, (r.body(), ct))
                            except Exception: pass
                        self.pages["/__special__" + outfile] = outfile
                        snapshots.append((route + " [+" + selector + "]",
                                          url, page.content(), outfile))
                    except Exception as e:
                        print(f"  !! special failed {selector}: {e}")
            browser.close()
        for route, page_url, html, fname in snapshots:
            self.process_html(html, route, page_url, fname)
        print(f"done: {len(snapshots)} pages, {len(self.saved)} assets -> {self.out}")

if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("--base", required=True)
    ap.add_argument("--out", required=True)
    ap.add_argument("--routes", nargs="+", required=True)
    ap.add_argument("--follow-prefix", action="append")
    ap.add_argument("--dead-pattern", action="append")
    ap.add_argument("--settle-ms", type=int, default=500)
    ap.add_argument("--keep-scripts", action="store_true")
    ap.add_argument("--backlink", default="")
    ap.add_argument("--exhibit-title", default="a Lehrjahre exhibit")
    ap.add_argument("--special", action="append",
                    help="ROUTE|CLICK_SELECTOR|OUTFILE — extra capture after a click")
    Capture(ap.parse_args()).run()
```

- [ ] **Step 3: Write `seal_check.sh`**

```bash
#!/bin/bash
# usage: seal_check.sh <face-dir> — exit 0 = sealed, 1 = leaks listed
d="$1"; fail=0
grep -rEn 'src="https?:|href="https?:|src="//|href="//' "$d" --include='*.html' && fail=1
grep -rEn "url\(['\"]?(https?:)?//" "$d" && fail=1
grep -rln 'srcset=' "$d" && fail=1
if [ $fail -eq 0 ]; then echo "SEALED: $d"; else echo "LEAKS in $d"; exit 1; fi
```
`chmod +x seal_check.sh`.

- [ ] **Step 4: Build a fixture site and test the tool**

In the scratchpad, create `fixture/index.html`:

```html
<!DOCTYPE html><html><head>
<link href="https://fonts.googleapis.com/css2?family=Nunito&display=swap" rel="stylesheet">
<script src="https://example.com/evil.js"></script>
<style>body { background-image: url(https://example.invalid/bg.png); }</style>
</head><body>
<img src="local.png"><img src="https://example.invalid/dead.jpg" srcset="x 1x">
<a href="/page2">page two</a> <a href="https://example.com/out">out</a>
<script>console.log("inline")</script>
</body></html>
```
plus `fixture/page2.html` (`<html><body><a href="/">home</a></body></html>`) and any small PNG as `fixture/local.png`. Serve: `python3 -m http.server 4999 -d fixture &`. Run:

```bash
venv/bin/python capture_face.py --base http://localhost:4999 --out /tmp/claude-1000/-home-atakee-projects-eski-web-sayfalarim/*/scratchpad/face-test \
  --routes / --follow-prefix /page2 --backlink ../../lehrjahre.html --exhibit-title "fixture"
```

- [ ] **Step 5: Verify the fixture capture**

Assert all of: `face-test/index.html` and `face-test/page2.html` exist (crawl worked); no `<script>` in either; Google Fonts CSS + its woff2 are in `face-test/assets/` and the `<link>` points there; the two dead example.invalid refs point at `assets/lost-external-image.*` with `data-original`; the internal link reads `page2.html`, the external one `href="#" data-original=...`; the curator bar is first in `<body>`; `./seal_check.sh face-test` prints `SEALED`. Kill the fixture server. Fix the tool until all assertions hold.

- [ ] **Step 6: No commit** — the toolkit is git-ignored workspace. Report the fixture-test results as the task's evidence.

---

### Task 2: The two static faces — gonewiththetailwind & finance-logger

**Files:**
- Create: `lehrjahre/gonewiththetailwind/` (captured), `lehrjahre/finance-logger/` (copied + sealed)

**Interfaces:**
- Consumes: Task 1's `capture_face.py` + `seal_check.sh` (exact CLI above).
- Produces: entry pages `lehrjahre/gonewiththetailwind/index.html`, `lehrjahre/finance-logger/index.html` (Task 9's doors).

- [ ] **Step 1: GoneWithTheTailwind — clone & serve**

```bash
S=/tmp/claude-1000/-home-atakee-projects-eski-web-sayfalarim/*/scratchpad; cd $S
gh repo clone atakee72/GoneWithTheTailwind---A-blogger-frontpage-with-Tailwind gwtt -- --depth 1
python3 -m http.server 4002 -d gwtt &
```

- [ ] **Step 2: Capture with scripts kept**

The page's only JS is the local 12-line hamburger toggle (`index.js`) — museum-safe. The Tailwind-CDN JIT `<style>` output is captured inline with the DOM, so the toggle's `.hidden` rule survives; the CDN `<script>` itself is external and gets stripped even with `--keep-scripts`.

```bash
cd /home/atakee/projects/eski-web-sayfalarim/.superpowers/sdd/lehrjahre/tools
venv/bin/python capture_face.py --base http://localhost:4002 \
  --out /home/atakee/projects/eski-web-sayfalarim/lehrjahre/gonewiththetailwind \
  --routes / --keep-scripts --settle-ms 1500 \
  --backlink lehrjahre.html --exhibit-title "GoneWithTheTailwind (2023)"
```
Then kill the 4002 server. Verify: `./seal_check.sh ../../../../lehrjahre/gonewiththetailwind` → SEALED. Note: the pinned unpkg Tailwind v2 stylesheet and Google Fonts must appear localized in `assets/`; the never-committed `styles.css` 404 stays a same-host dead ref (authentic).

- [ ] **Step 3: Playwright check of the frozen face**

Serve repo root on 8765, open `http://localhost:8765/lehrjahre/gonewiththetailwind/index.html` with playwright-cli: page renders styled (Tailwind CSS present), hamburger toggle works at 390px viewport, `performance.getEntriesByType('resource').filter(r=>!r.name.startsWith(location.origin)).length === 0`.

- [ ] **Step 4: Finance_Logger — copy `public/` as-is, then seal by hand**

```bash
cd $S && gh repo clone atakee72/Finance_Logger flog -- --depth 1
cp -r flog/public /home/atakee/projects/eski-web-sayfalarim/lehrjahre/finance-logger
```
This face keeps its own compiled local JS (the form works, hermetically — it makes no network calls). Manual seal edits on the copy (never the clone): in `styles.css`, replace the dead Discord background URL with `url(lost-discord-background.png)` (intentionally absent) and add a CSS comment above it: `/* original hotlink, long dead — kept as data: <the-original-cdn.discordapp.com-URL> */`. Grep the whole folder for `http` and `//` in src/href/url() — fix anything found the same way. Add the curator bar (same div as capture_face.py injects, with `href="../../lehrjahre.html"`, title `Finance_Logger (2023)`) as the first element of `<body>` in `index.html`.

- [ ] **Step 5: Verify finance-logger**

`./seal_check.sh` → SEALED. Playwright on 8765: form adds an entry to the list when submitted (fill Type=Invoice, To/From=Test, Details=Consulting, Amount=150 → list gains one item); console shows only the intended dead background + favicon 404s (same-host); zero external resource entries.

- [ ] **Step 6: Commit**

```bash
git add lehrjahre/gonewiththetailwind lehrjahre/finance-logger
git commit -m "Lehrjahre wing: first two faces, GoneWithTheTailwind and Finance_Logger"
```

---

### Task 3: Face — dogsnfilms (full crawl)

**Files:**
- Create: `lehrjahre/dogsnfilms/` (~61 pages + assets)

**Interfaces:**
- Consumes: Task 1 toolkit. Produces: `lehrjahre/dogsnfilms/index.html` door.

- [ ] **Step 1: Clone, install, run**

```bash
cd $S && gh repo clone atakee72/dogsNfilms-catalog-app dnf -- --depth 1
cd dnf && npm install && npx next dev -p 4003 &
```
Wait until `curl -s -o /dev/null -w '%{http_code}' http://localhost:4003/` prints 200.

- [ ] **Step 2: Crawl-capture all routes**

```bash
venv/bin/python capture_face.py --base http://localhost:4003 \
  --out /home/atakee/projects/eski-web-sayfalarim/lehrjahre/dogsnfilms \
  --routes / /films-catalog /dogs-catalog \
  --follow-prefix /films-catalog/ --follow-prefix /dogs-catalog/ \
  --dead-pattern 'shelterbuddy' --settle-ms 2000 \
  --backlink lehrjahre.html --exhibit-title "dogsNfilms catalog (2023)"
```
Expected: ~61 pages (1 home + 2 catalogs + 10 films + ~49 dogs — the exact dog count is whatever the crawl finds; log it). Film posters and carousel images localized into `assets/`; every dog photo → `lost-external-image.*` + `data-original` (they go through `/_next/image?url=...shelterbuddy...`, which the dead-pattern matches on the full URL). Kill the dev server.

- [ ] **Step 3: Verify**

`seal_check.sh` → SEALED. Playwright on 8765: home shows the carousel's static state with a localized image; films catalog → click a poster → detail page loads (posters localized); dogs catalog shows broken-image icons + intact text; a dog detail page renders name/stats; "Back to catalog" links navigate between the frozen pages. Zero external resource entries on all five checked pages. Spot-check one filename with a space or non-ASCII char survives URL-encoding (museum precedent: never rename).

- [ ] **Step 4: Commit**

```bash
git add lehrjahre/dogsnfilms
git commit -m "Lehrjahre wing: dogsNfilms face — films fed, dog photos authentically dead"
```

---

### Task 4: Face — admin-dashboard

**Files:**
- Create: `lehrjahre/admin-dashboard/` (7 pages)

**Interfaces:** Consumes Task 1 toolkit. Produces door `lehrjahre/admin-dashboard/home.html` (NOT index.html — the hall's door points at home, per spec; `/`'s boilerplate is captured as `index.html` and linked from the card note).

- [ ] **Step 1: Clone, install, run**

```bash
cd $S && gh repo clone atakee72/admin-dashboard-with-next.js-and-sass adash -- --depth 1
cd adash && npm install && npx next dev -p 4004 &
```
First compile per route is slow (~15–25 s): after the server is up, warm each route with `curl --max-time 60` before capturing.

- [ ] **Step 2: Capture**

```bash
venv/bin/python capture_face.py --base http://localhost:4004 \
  --out /home/atakee/projects/eski-web-sayfalarim/lehrjahre/admin-dashboard \
  --routes /home /list /single /login /new_user /new_product / \
  --settle-ms 2500 \
  --backlink lehrjahre.html --exhibit-title "admin dashboard (2023)"
```
Pexels avatars, the `/single` hero photo, the icon-library placeholder and the Inter font (next/font serves it same-origin under `/_next/`) all localize. Kill server.

- [ ] **Step 3: Verify**

SEALED; playwright: `home.html` shows widgets + charts as static SVG/DOM (Recharts renders SVG — it survives script-stripping), `list.html` shows the GoT DataGrid rows with localized avatars, `single.html` shows Jane Doe of OrasiBurasi, `login.html` shows `dsfgsdfgs`. Sidebar links navigate between the frozen pages. Zero external resources.

- [ ] **Step 4: Commit**

```bash
git add lehrjahre/admin-dashboard
git commit -m "Lehrjahre wing: admin-dashboard face"
```

---

### Task 5: Face — mahalle-v1 (+ modal special)

**Files:**
- Create: `lehrjahre/mahalle-v1/` (`index.html`, `login.html`, `register.html`, `landingPage.html`, `index-modal.html`)

**Interfaces:** Consumes Task 1 toolkit incl. `--special`. Produces door `lehrjahre/mahalle-v1/index.html`.

- [ ] **Step 1: Clone, install client, run client only**

```bash
cd $S && gh repo clone atakee72/Fullstack-Community-WebApp mh1 -- --depth 1
cd mh1/client && npm install && PORT=4013 BROWSER=none npm start &
```
No backend, no Mongo — the empty-forum state is the authentic capture (spec §7).

- [ ] **Step 2: Capture with the modal special**

```bash
venv/bin/python capture_face.py --base http://localhost:4013 \
  --out /home/atakee/projects/eski-web-sayfalarim/lehrjahre/mahalle-v1 \
  --routes / /login /register /landingPage \
  --settle-ms 12000 \
  --special '/|text=Start a debate|index-modal.html' \
  --backlink lehrjahre.html --exhibit-title "MaHalle v1 (2023)"
```
(`--settle-ms 12000` lets the `localhost:5000` API call fail and the page settle in its caught-error empty state. If the click selector fails, inspect the button's actual text/selector via playwright-cli and adjust — the modal capture is a spec requirement, not optional.) Kill server.

- [ ] **Step 3: Link the modal capture in-page**

The frozen tabs/buttons no longer script. In `index.html`, find the "Start a debate" button element and wrap/replace it with a plain link: `<a href="index-modal.html">` around the button markup (keep its classes so it looks identical). In `index-modal.html`, make the modal's close ("×"/Cancel) element an `<a href="index.html">` the same way. This is curator wiring, same category as the back-link bar.

- [ ] **Step 4: Verify**

SEALED; playwright: home renders logo + tabs + empty Discussions list; `landingPage.html` shows the authentic rotated-headings bug (screenshot it for the record); "Start a debate" click navigates to `index-modal.html` showing the open modal with tag pills + hobby selector; its close link returns. Zero external resources.

- [ ] **Step 5: Commit**

```bash
git add lehrjahre/mahalle-v1
git commit -m "Lehrjahre wing: MaHalle v1 face, debate modal included"
```

---

### Task 6: Face — mahalle-v2

**Files:**
- Create: `lehrjahre/mahalle-v2/` (8 pages: `index.html`, `register.html`, `dashboard.html`, `addTopic.html`, `userProfile.html`, `blog.html`, `shop.html`, `kalendar.html`)

**Interfaces:** Consumes Task 1 toolkit. Produces door `lehrjahre/mahalle-v2/index.html`.

- [ ] **Step 1: Clone, install, dummy env, run**

```bash
cd $S && gh repo clone atakee72/Community-Web-Forum-App-with-Next.js mh2 -- --depth 1
cd mh2
printf 'MONGODB_URI=mongodb://localhost:59999/none\nNEXTAUTH_SECRET=museum-capture-dummy\nNEXTAUTH_URL=http://localhost:4014\n' > .env.local
npm install && npx next dev -p 4014 &
```
(Dummy values only, in the scratch clone's untracked `.env.local`; nothing real, nothing committed anywhere.)

- [ ] **Step 2: Capture**

```bash
venv/bin/python capture_face.py --base http://localhost:4014 \
  --out /home/atakee/projects/eski-web-sayfalarim/lehrjahre/mahalle-v2 \
  --routes / /register /dashboard /addTopic /userProfile /blog /shop /kalendar \
  --settle-ms 12000 \
  --backlink lehrjahre.html --exhibit-title "maHalle v2 (2023–2024)"
```
`/dashboard` needs its ~10 s Mongoose buffering timeout to elapse before "No topics to display." appears — hence 12 s settle (applies to all routes; slow but correct). Kill server.

- [ ] **Step 3: Verify**

SEALED; playwright: login page shows the torn-paper maHalle logo (localized); dashboard shows the three tabs + "No topics to display."; blog/shop/kalendar each render their glorious single word; the "Footer" placeholder string is present on every page. Zero external resources.

- [ ] **Step 4: Commit**

```bash
git add lehrjahre/mahalle-v2
git commit -m "Lehrjahre wing: maHalle v2 face — one-word stub pages and all"
```

---

### Task 7: Rescue attempt — movie-db

**Files:**
- Create (on success): `lehrjahre/movie-db/`
- Either way: append the outcome to the progress ledger — Task 9 picks the matching card variant.

- [ ] **Step 1: Clone, patch Firebase config in the scratch clone only**

```bash
cd $S && gh repo clone atakee72/movie-db mdb -- --depth 1
cd mdb && cat src/config/firebaseConfig.js
```
Read the file; keep its exact export names and structure, replacing ONLY the config values with well-formed dummies:

```js
const firebaseConfig = {
  apiKey: "AIzaSyDUMMY-museum-capture-0000000000000",
  authDomain: "museum-dummy.firebaseapp.com",
  projectId: "museum-dummy",
  storageBucket: "museum-dummy.appspot.com",
  messagingSenderId: "000000000000",
  appId: "1:000000000000:web:0000000000000000000000",
};
```
A well-formed dummy passes `getAuth`'s format check at module-eval; real auth calls would fail later, which never happens in a capture. If the module instead reads `process.env.REACT_APP_*`, set those in a scratch `.env` with the same dummy values.

- [ ] **Step 2: Run and probe**

```bash
npm install && PORT=4001 BROWSER=none npm start &
```
Playwright-probe `/`: does `#root` render content now? If still blank, try wrapping the `getAuth` call in try/catch in the scratch clone. If it still won't mount after both, this rescue **fails**: kill the server, write `movie-db rescue: FAILED (<reason>)` to the ledger, skip to Step 5 (no commit, no face folder).

- [ ] **Step 3: Capture (success path)**

Probe which routes render (`/`, `/login`, `/register`, `/about`; protected ones likely redirect — capture whatever state they land in). The TMDb fetch uses the author's own committed key; if the grid populates, the posters localize automatically (scripts are stripped, so the key never enters the capture — verify with `grep -ri "api_key" lehrjahre/movie-db/` → empty). If TMDb fails, the starving state is the capture.

```bash
venv/bin/python capture_face.py --base http://localhost:4001 \
  --out /home/atakee/projects/eski-web-sayfalarim/lehrjahre/movie-db \
  --routes / /login /register /about --settle-ms 4000 \
  --backlink lehrjahre.html --exhibit-title "movie-db (2023) — revived with a dummy key"
```
Kill server.

- [ ] **Step 4: Verify + commit (success path)**

SEALED; `grep -ri "api_key\|apiKey" lehrjahre/movie-db/*.html` finds nothing; playwright walk; zero external resources.

```bash
git add lehrjahre/movie-db
git commit -m "Lehrjahre wing: movie-db face, woken with a dummy Firebase config"
```

- [ ] **Step 5: Record outcome**

Ledger line: `movie-db rescue: SUCCESS (TMDb fed|starving)` or `FAILED (<reason>)`.

---

### Task 8: Rescue attempt — portefeuille (USER GATE)

**Files:**
- Create (either branch): `lehrjahre/portefeuille/` — this face exists in both branches; only its fullness varies.

- [ ] **Step 1: Ask the user (controller does this, not a subagent)**

Ask: "Does your original Sanity project for the old portfolio still exist? If yes, give me the project ID + dataset (public identifiers, used only at capture time in a scratch clone)." Branch on the answer. **This is the plan's one intended mid-execution stop.**

- [ ] **Step 2: Clone + env (fed branch) or patch (shell branch)**

```bash
cd $S && gh repo clone atakee72/Developer-Portefeuille-of-Ercan-Atak pfl -- --depth 1
cd pfl
```
**Fed branch:** `printf 'NEXT_PUBLIC_SANITY_PROJECT_ID=<id>\nNEXT_PUBLIC_SANITY_DATASET=<dataset>\n' > .env.local` (scratch clone only).
**Shell branch:** in `src/app/page.jsx` (locate the two `sanityFetch(...)` awaits), wrap each in the scratch clone:

```js
let posts = [];
try { posts = await sanityFetch(/* original args unchanged */); } catch (e) { posts = []; }
let testimonials = [];
try { testimonials = await sanityFetch(/* original args unchanged */); } catch (e) { testimonials = []; }
```
(Match the file's actual variable names — read it first; the patch is mechanical: guard the two awaits, default to `[]`.) Also set dummy env (`NEXT_PUBLIC_SANITY_PROJECT_ID=museumdummy`, `NEXT_PUBLIC_SANITY_DATASET=production`) so the client constructor doesn't throw.

- [ ] **Step 3: Run + capture**

```bash
npm install && npx next dev -p 4015 &
```
Fed branch routes: `/` plus 1–2 blog `/[slug]` routes — discover slugs from the rendered home's links: use `--follow-prefix /` is too broad; instead capture `/` first, read its blog-post hrefs from the capture, then re-run with `--routes / <slug1> <slug2>`. Shell branch: `--routes /` only. Both:

```bash
venv/bin/python capture_face.py --base http://localhost:4015 \
  --out /home/atakee/projects/eski-web-sayfalarim/lehrjahre/portefeuille \
  --routes <as above> --settle-ms 4000 \
  --backlink lehrjahre.html --exhibit-title "Developer-Portefeuille (2023–2024)"
```
Do NOT capture `/studio` (CMS admin, not visitor content). Kill server.

- [ ] **Step 4: Mask the PII (both branches)**

The footer hardcodes email, a phone number, and "12049 Berlin, Germany". In every captured page, python-replace each value with a same-length █ block, `assert count == 1` per value per file (Impressum precedent — grep the captures first for the exact strings), and insert `<!-- Kontaktdaten vom Kurator redigiert (museum redaction) -->` before `</head>`. Mask email too by default — the user rules on it at preview. Re-grep to confirm zero occurrences remain.

- [ ] **Step 5: Verify + commit**

SEALED (Sanity CDN image URLs must have been localized on the fed branch — check `cdn.sanity.io` appears nowhere in src/href); PII grep clean; playwright: MyAccordion hover images present (static: all three panels visible), `<h1p>` intact in the DOM (charm — do not fix). Ledger: `portefeuille rescue: FED` or `SHELL`.

```bash
git add lehrjahre/portefeuille
git commit -m "Lehrjahre wing: portefeuille face, contact data redacted"
```

---

### Task 9: Thumbnails + the hall page + CSS

**Files:**
- Create: `assets/lehrjahre/` (card thumbnails), `assets/lehrjahre-wing.png`, `lehrjahre.html`
- Modify: `assets/museum.css` (append `/* lehrjahre */` block)

**Interfaces:**
- Consumes: face folders from Tasks 2–8 (door hrefs below) + rescue outcomes from the ledger (pick card variants).
- Produces: `lehrjahre.html` — the wing door Task 10 links to.

- [ ] **Step 1: Generate thumbnails**

From `.superpowers/sdd/lehrjahre/` shots, downscale to 640px wide into `assets/lehrjahre/`:

```bash
cd /home/atakee/projects/eski-web-sayfalarim
mkdir -p assets/lehrjahre
T=.superpowers/sdd/lehrjahre; V=$T/tools/venv/bin/python
thumb() { $V - "$1" "$2" <<'EOF'
import sys; from PIL import Image
im = Image.open(sys.argv[1]); im.thumbnail((640, 4000)); im.save(sys.argv[2], optimize=True)
EOF
}
thumb $T/shots-CA-Projects--myfirst-1-home.png assets/lehrjahre/ca-projects.png
thumb $T/shots-CA-Projects--rnm-2-search-nofilter-bug.png assets/lehrjahre/ca-projects-2.png
thumb $T/shots-Fullstack-Community-WebApp-1-home.png assets/lehrjahre/mahalle-v1.png
thumb $T/shots-GoneWithTheTailwind-1.png assets/lehrjahre/gonewiththetailwind.png
thumb $T/shots-GraphOL-server-example-2-query-result.png assets/lehrjahre/graphol.png
thumb $T/shots-React-Hooks-with-TypeScript-1.png assets/lehrjahre/react-hooks.png
thumb $T/shots-movie-db-1-blank-crash.png assets/lehrjahre/movie-db.png
thumb $T/shots-admin-dashboard-with-next.js-and-sass-1-home.png assets/lehrjahre/admin-dashboard.png
thumb $T/shots-Finance_Logger-2.png assets/lehrjahre/finance-logger.png
thumb "$T/shots-Community-Web-Forum-App-with-Next.js-1-home.png" assets/lehrjahre/mahalle-v2.png
thumb $T/shots-mongodb-crud-1-home-crash.png assets/lehrjahre/mongodb-crud.png
thumb $T/shots-mongodb-crud-2-addtopic.png assets/lehrjahre/mongodb-crud-2.png
thumb $T/shots-dogsNfilms-catalog-app-3-films-catalog.png assets/lehrjahre/dogsnfilms.png
thumb $T/shots-Developer-Portefeuille-of-Ercan-Atak-1-home-crash.png assets/lehrjahre/portefeuille.png
thumb $T/shots-translation-office-ai-assistant-1-live.png assets/lehrjahre/translation-office.png
cp "$T/shots-Community-Web-Forum-App-with-Next.js-1-home.png" assets/lehrjahre-wing.png
```
Variant overrides: if movie-db rescue SUCCEEDED, replace `movie-db.png` with a fresh 1280-wide playwright screenshot of the frozen face's home, downscaled the same way. If portefeuille came back FED, likewise replace `portefeuille.png` with a shot of the captured (masked) home.

- [ ] **Step 2: Append the CSS block to `assets/museum.css`**

```css
/* lehrjahre */
.lj-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.2rem; margin-top: 1.2rem; }
.lj-card { background: var(--panel); border: 1px solid var(--line); border-radius: 6px; padding: 1rem; display: flex; flex-direction: column; gap: .6rem; }
.lj-card h3 { font-size: 1.02rem; font-weight: normal; }
.lj-card h3 .lj-date { color: var(--muted); font-size: .8rem; margin-left: .4rem; white-space: nowrap; }
.lj-shot img { width: 100%; height: auto; border: 1px solid var(--line); border-radius: 3px; display: block; }
.lj-badge { align-self: flex-start; font: 11px/1.5 ui-monospace, "Cascadia Mono", Consolas, monospace; letter-spacing: .06em; text-transform: uppercase; color: var(--amber); border: 1px solid var(--amber); border-radius: 3px; padding: .05rem .45rem; }
.lj-badge.quiet { color: var(--muted); border-color: var(--line); }
.lj-card p { font-size: .92rem; }
.lj-charm { color: var(--muted); font-size: .85rem; font-style: italic; }
.lj-door { margin-top: auto; }
.lj-card.lj-epilogue { border-style: dashed; }
```

- [ ] **Step 3: Write `lehrjahre.html`**

Full page (adjust ONLY the two rescue cards to the ledgered variants — both variants are given inline; delete the one that doesn't apply):

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>The Lehrjahre wing · websites through the years</title>
<meta name="description" content="The bootcamp years, 2022–2023: fifteen repositories of amateur, naive, sometimes childish attempts to build something — exhibited as frozen HTML faces.">
<link rel="stylesheet" href="assets/museum.css">
</head>
<body>

<div class="wrap">

<nav class="top">
  <a href="index.html">← The museum</a>
  <a href="guestbook.html">Sign the guestbook</a>
  <a href="links.html">The links page</a>
  <a href="shop.html">The museum shop</a>
  <a href="restoration-lab.html">The restoration lab</a>
</nav>

<header class="plaquehead">
  <span class="year">2022 – 2023</span>
  <h1>The Lehrjahre</h1>
  <p class="host">CODAC Berlin · Full-Stack Web Development</p>
</header>

<section>
  <h2>Missing developer knowledge</h2>
  <p>That phrase is carved into <a href="plaques/translator.html">the translator
  plaque</a>: it is why a WordPress template defeated me in 2019. In 2022 I went
  after the missing knowledge properly — a coding bootcamp in Berlin — and these
  fifteen repositories are the surviving school notebooks. None of them was ever
  a website with an address; they lived on localhost and in private repos, and
  this wing is the first time any of them has been seen in public.</p>
  <p>They are amateur, naive, sometimes childish attempts to build something,
  and they are shown exactly as they stopped: placeholder text shipped, buttons
  that do nothing, sections that render a single word. Six of them are walkable
  — captured as frozen pages, every asset local, nothing live. The rest are
  catalogue cards. Where a card quotes something in monospace, it is quoted
  verbatim.</p>
</section>

<section>
  <h2>The catalogue</h2>
  <div class="lj-grid">

    <div class="lj-card">
      <span class="lj-badge quiet">catalogue only</span>
      <h3>CA-Projects <span class="lj-date">2022 – 2023</span></h3>
      <div class="lj-shot"><img src="assets/lehrjahre/ca-projects.png" alt="my-first-react-app: 'Hey, Ercan is learning React!'" loading="lazy"></div>
      <p>The earliest surviving folder: a restaurant site named, in its own
      header, "Yet Another Company Website"; a pile of sprint exercises (Chuck
      Norris wisdom, a fisheries browser, Turkish news); and my two first React
      apps. One greets you with <b>"Hey, Ercan is learning React! :)))"</b>. The
      other browses Rick and Morty characters with a search box that searches —
      into the console, and no further: the line that would update the screen is
      commented out.</p>
      <div class="lj-shot"><img src="assets/lehrjahre/ca-projects-2.png" alt="rick-n-morty: 'Rick' typed in search, grid unchanged" loading="lazy"></div>
      <p class="lj-charm">Nav links labelled "sdf" and "asdf" — placeholder text I never came back for.</p>
    </div>

    <div class="lj-card">
      <span class="lj-badge">walkable</span>
      <h3>MaHalle v1 <span class="lj-date">Feb – Aug 2023</span></h3>
      <div class="lj-shot"><a href="lehrjahre/mahalle-v1/index.html"><img src="assets/lehrjahre/mahalle-v1.png" alt="MaHalle v1 forum home, Discussions tab" loading="lazy"></a></div>
      <p>My first big thing: a MERN forum for the neighbourhood — <i>Mahalle</i>,
      Turkish for exactly that, punning on German <i>meine Halle</i>.
      Discussions, announcements, recommendations; register, log in, start a
      debate. The backend didn't come along to the museum, so the forum stands
      eternally empty: search box ready, nobody home. The landing page's
      sideways-rotated headings are an original bug, preserved.</p>
      <p class="lj-charm">Commit message: "Adding forum posts works! :) But there are a lot more to do! Go to work! :))"</p>
      <p class="lj-door"><a class="go" href="lehrjahre/mahalle-v1/index.html">Enter the exhibit →</a></p>
    </div>

    <div class="lj-card">
      <span class="lj-badge quiet">no face — it was a terminal</span>
      <h3>ChatGPT-Interface <span class="lj-date">Mar 2023</span></h3>
      <p>Twenty-three lines of Node that let you chat with GPT-3.5 in a console
      window. March 2023: everyone was building one of these. No browser was
      ever involved, so there is nothing to walk through — this card is the
      whole exhibit.</p>
      <p class="lj-charm">The commit message says it best: "the script file is working, one can have a chat in the console window."</p>
    </div>

    <div class="lj-card">
      <span class="lj-badge">walkable</span>
      <h3>GoneWithTheTailwind <span class="lj-date">Mar 2023</span></h3>
      <div class="lj-shot"><a href="lehrjahre/gonewiththetailwind/index.html"><img src="assets/lehrjahre/gonewiththetailwind.png" alt="Ninja Blogger, a Tailwind blog front page" loading="lazy"></a></div>
      <p>A blog front page for ninjas — "Tips for Ninjas / For Ninjas" — that
      was never a blog. A Tailwind styling exercise with three fake posts whose
      images have nothing to do with their titles. The "Most Popular" section
      is an empty comment in the source; the "Load more" button loads nothing.
      Both preserved.</p>
      <p class="lj-charm">The entire git history: "Initial commit, but everything's done :))"</p>
      <p class="lj-door"><a class="go" href="lehrjahre/gonewiththetailwind/index.html">Enter the exhibit →</a></p>
    </div>

    <div class="lj-card">
      <span class="lj-badge quiet">catalogue only</span>
      <h3>GraphOL-server-example <span class="lj-date">Mar 2023</span></h3>
      <div class="lj-shot"><img src="assets/lehrjahre/graphol.png" alt="GraphQL Playground answering a users query" loading="lazy"></div>
      <p>My first GraphQL server — the typo in the name shipped, and stuck. Two
      Turkish-named users, three posts, four comments, all hardcoded; its only
      face was the query playground, photographed here mid-answer.</p>
      <p class="lj-charm">The fake data gives up halfway through: the last comments are "foo bar" and "foo bar baz".</p>
    </div>

    <div class="lj-card">
      <span class="lj-badge quiet">dead on arrival</span>
      <h3>GraphQL-Booklist <span class="lj-date">Mar 2023</span></h3>
      <p>A book-catalogue API, caught mid-refactor from <code>require</code> to
      <code>import</code> and never run again. Three separate errors stand
      between it and starting; behind them, every query resolver is commented
      out anyway. No frontend was ever committed. Some exercises end
      mid-sentence.</p>
      <p class="lj-charm">Last words: "Modified the app.js file with import statements instead of require.."</p>
    </div>

    <div class="lj-card">
      <span class="lj-badge quiet">catalogue only</span>
      <h3>React-Hooks-with-TypeScript <span class="lj-date">Apr 2023</span></h3>
      <div class="lj-shot"><img src="assets/lehrjahre/react-hooks.png" alt="Hooks cheat sheet with fetched user cards" loading="lazy"></div>
      <p>One page, six hooks, one component each — my React cheat sheet. It
      fetched eight fake users from a placeholder API and filtered for the one
      named Antonette, to prove useMemo worked. A commented-out map component
      records the ambition that got shelved: the users' coordinates are printed
      as raw numbers instead.</p>
      <p class="lj-charm">A comment in the custom hook: '"Payload" instead of "User[]" to make it genuinely generic :-]'</p>
    </div>

    <!-- movie-db: keep ONE of the two variants, per the rescue ledger -->
    <div class="lj-card"><!-- VARIANT A: rescue succeeded -->
      <span class="lj-badge">walkable · revived</span>
      <h3>movie-db <span class="lj-date">Apr 2023</span></h3>
      <div class="lj-shot"><a href="lehrjahre/movie-db/index.html"><img src="assets/lehrjahre/movie-db.png" alt="movie-db home" loading="lazy"></a></div>
      <p>A movie browser with watchlists and Firebase accounts. Without its
      keys it woke up to a blank white screen — the museum lent it a dummy
      config so it would open its eyes. The accounts were never real; nothing
      here can log in.</p>
      <p class="lj-charm">The footer credit is a ternary joke: @copyright ? @copyright : " " 😆</p>
      <p class="lj-door"><a class="go" href="lehrjahre/movie-db/index.html">Enter the exhibit →</a></p>
    </div>
    <div class="lj-card"><!-- VARIANT B: rescue failed -->
      <span class="lj-badge quiet">rescue failed</span>
      <h3>movie-db <span class="lj-date">Apr 2023</span></h3>
      <div class="lj-shot"><img src="assets/lehrjahre/movie-db.png" alt="movie-db: a blank white page — the crash itself" loading="lazy"></div>
      <p>A movie browser with watchlists and Firebase accounts. It crashes
      before the first pixel: Firebase demands its keys at the door, and the
      keys are gone. The museum tried a dummy config; it wasn't fooled. The
      blank white capture above is the honest exhibit.</p>
      <p class="lj-charm">The footer credit — which you cannot see — is a ternary joke: @copyright ? @copyright : " " 😆</p>
    </div>

    <div class="lj-card">
      <span class="lj-badge">walkable</span>
      <h3>admin-dashboard <span class="lj-date">May 2023</span></h3>
      <div class="lj-shot"><a href="lehrjahre/admin-dashboard/home.html"><img src="assets/lehrjahre/admin-dashboard.png" alt="Admin dashboard with widgets and revenue chart" loading="lazy"></a></div>
      <p>An admin dashboard for nothing: hardcoded numbers, Game-of-Thrones
      users, a revenue chart for a business that doesn't exist. Every stat
      reads 100, up 20%. Total sales made today: $420. The front door is
      unmodified boilerplate, so the museum's door drops you at /home, where
      the sidebar logo reads <i>atakeedmin</i>.</p>
      <p class="lj-charm">The login page's title is literal keyboard mash — dsfgsdfgs — and one user lives in the country of "OrasiBurasi", Turkish for "somewhere or other".</p>
      <p class="lj-door"><a class="go" href="lehrjahre/admin-dashboard/home.html">Enter the exhibit →</a></p>
    </div>

    <div class="lj-card">
      <span class="lj-badge">walkable · still works</span>
      <h3>Finance_Logger <span class="lj-date">May 2023</span></h3>
      <div class="lj-shot"><a href="lehrjahre/finance-logger/index.html"><img src="assets/lehrjahre/finance-logger.png" alt="Finance Logger with one invoice entry" loading="lazy"></a></div>
      <p>A one-page invoice logger in hand-compiled TypeScript — and the one
      exhibit in this wing that still functions: type an entry and it appends
      to the list, until you reload and it forgets everything. The background
      image died with the Discord link it was hotlinked from; its filename was
      the AI image prompt that generated it.</p>
      <p class="lj-charm">The entire git history is one commit: "Port changed".</p>
      <p class="lj-door"><a class="go" href="lehrjahre/finance-logger/index.html">Enter the exhibit →</a></p>
    </div>

    <div class="lj-card">
      <span class="lj-badge">walkable</span>
      <h3>MaHalle v2 <span class="lj-date">Jul 2023 – Mar 2024</span></h3>
      <div class="lj-shot"><a href="lehrjahre/mahalle-v2/index.html"><img src="assets/lehrjahre/mahalle-v2.png" alt="maHalle v2 login with torn-paper logo" loading="lazy"></a></div>
      <p>The second MaHalle: <i>Ein Kiez-Gesichterbuch</i> — a literal German
      "face-book", for the neighbourhood. Eighty commits over eight months, my
      longest project of the era. Login, register, profile and add-topic are
      fully dressed; Blog, Shop and Kalendar are doors painted on walls — each
      page renders exactly one word. Walk in and count them.</p>
      <p class="lj-charm">The footer component renders the word "Footer". On every page.</p>
      <p class="lj-door"><a class="go" href="lehrjahre/mahalle-v2/index.html">Enter the exhibit →</a></p>
    </div>

    <div class="lj-card">
      <span class="lj-badge quiet">catalogue only</span>
      <h3>mongodb-crud <span class="lj-date">Sep 2023</span></h3>
      <div class="lj-shot"><img src="assets/lehrjahre/mongodb-crud.png" alt="Next.js error overlay on the topics list" loading="lazy"></div>
      <p>A CRUD exercise wearing my own name as its brand — the navbar just
      says ATAKEE. The list page crashes without its database, and would crash
      on any port but 3000 regardless: the tutorial's hardcoded URLs came along
      verbatim. The add-topic form renders beautifully, for topics that can
      never arrive.</p>
      <div class="lj-shot"><img src="assets/lehrjahre/mongodb-crud-2.png" alt="The add-topic form under the ATAKEE navbar" loading="lazy"></div>
      <p class="lj-charm">Sole commit: "mostly completed".</p>
    </div>

    <!-- portefeuille: keep ONE of the two variants, per the rescue ledger -->
    <div class="lj-card"><!-- VARIANT A: FED (Sanity project alive) -->
      <span class="lj-badge">walkable · fed by its own CMS</span>
      <h3>Developer-Portefeuille <span class="lj-date">Oct 2023 – Feb 2024</span></h3>
      <div class="lj-shot"><a href="lehrjahre/portefeuille/index.html"><img src="assets/lehrjahre/portefeuille.png" alt="The 2023 developer portfolio" loading="lazy"></a></div>
      <p>My first developer portfolio — the direct ancestor of the site at
      ercan-atak.de today. A hover-to-expand showcase of projects from this
      very wing ("Home~made Facebook for my Neighbours"), a blog fed by its
      original CMS, and About/Work sections that are honest empty placeholders.
      Contact details in the footer are redacted by the curator.</p>
      <p class="lj-charm">One project card uses the tag &lt;h1p&gt; — not a real HTML element; every browser politely rendered it anyway.</p>
      <p class="lj-door"><a class="go" href="lehrjahre/portefeuille/index.html">Enter the exhibit →</a></p>
    </div>
    <div class="lj-card"><!-- VARIANT B: SHELL (CMS gone) -->
      <span class="lj-badge">walkable · the CMS is gone</span>
      <h3>Developer-Portefeuille <span class="lj-date">Oct 2023 – Feb 2024</span></h3>
      <div class="lj-shot"><a href="lehrjahre/portefeuille/index.html"><img src="assets/lehrjahre/portefeuille.png" alt="The 2023 developer portfolio" loading="lazy"></a></div>
      <p>My first developer portfolio — the direct ancestor of the site at
      ercan-atak.de today. A hover-to-expand showcase of projects from this
      very wing ("Home~made Facebook for my Neighbours"), and About/Work
      sections that are honest empty placeholders. Its blog and testimonials
      lived in a headless CMS that no longer exists, so those rooms stand
      empty. Contact details in the footer are redacted by the curator.</p>
      <p class="lj-charm">One project card uses the tag &lt;h1p&gt; — not a real HTML element; every browser politely rendered it anyway.</p>
      <p class="lj-door"><a class="go" href="lehrjahre/portefeuille/index.html">Enter the exhibit →</a></p>
    </div>

    <div class="lj-card">
      <span class="lj-badge">walkable</span>
      <h3>dogsNfilms <span class="lj-date">Dec 2023</span></h3>
      <div class="lj-shot"><a href="lehrjahre/dogsnfilms/index.html"><img src="assets/lehrjahre/dogsnfilms.png" alt="The films catalogue, posters intact" loading="lazy"></a></div>
      <p>Dogs and classic films: my two favourite unrelated things, as one
      catalogue. The film posters still shine; the forty-nine shelter dogs lost
      their photos when the shelter's image server died — the museum keeps them
      broken, names and kennel numbers intact. Adopt a broken image.</p>
      <p class="lj-charm">The footer of every page says, in full: "Copyrighted".</p>
      <p class="lj-door"><a class="go" href="lehrjahre/dogsnfilms/index.html">Enter the exhibit →</a></p>
    </div>

    <div class="lj-card lj-epilogue">
      <span class="lj-badge quiet">epilogue · 2026</span>
      <h3>translation-office-ai-assistant <span class="lj-date">2026</span></h3>
      <div class="lj-shot"><img src="assets/lehrjahre/translation-office.png" alt="AI receptionist, Live Call tab, status Ready" loading="lazy"></div>
      <p>Not a Lehrjahr — a postscript. An AI receptionist for a translation
      office, built years later with the knowledge this wing was for: voice
      calls, chat, a call log, text-to-speech. Photographed keyless, all four
      tabs politely reporting "Ready". The Lehrjahre never really end.</p>
      <p class="lj-charm">A code comment narrates its own bug fix in full sentences — the era of AI pair-programming had begun.</p>
    </div>

  </div>
</section>

<section>
  <h2>How these were captured</h2>
  <p>Each walkable face is the rendered page as a browser saw it on localhost
  in 2026, frozen: scripts removed, every image and font stored locally,
  outside links disabled with their originals kept in
  <code>data-original</code>. Broken images are original breakage, not the
  museum's. Details in the <a href="restoration-lab.html">restoration lab</a>
  and the repository's provenance notes.</p>
</section>

<p class="doorway">
  <a class="enter" href="index.html">← Back to the museum</a>
</p>

<footer><a href="index.html">websites through the years</a> — a personal museum of the early web</footer>

</div>
</body>
</html>
```

- [ ] **Step 4: Verify**

Serve 8765; playwright desktop (1280) + mobile (390) screenshots; every door resolves (no 404s — check each `lj-door` href with curl); every thumbnail loads; zero external resource entries; nav wraps sanely at 390px. Byte-check the typographic characters (— · … "OrasiBurasi" 😆 &lt;h1p&gt;).

- [ ] **Step 5: Commit**

```bash
git add lehrjahre.html assets/lehrjahre assets/lehrjahre-wing.png assets/museum.css
git commit -m "Lehrjahre wing: hall page with the full catalogue"
```

---

### Task 10: Museum integration — landing, timeline, navs, plaque

**Files:**
- Modify: `index.html` (nav ~line 202, era sections ~line 371, timeline ~line 412)
- Modify: `guestbook.html`, `links.html`, `shop.html`, `restoration-lab.html` (nav.top)
- Modify: `plaques/translator.html` (one link)

- [ ] **Step 1: index.html nav**

In `<nav class="top">`, insert after the shop link:
```html
    <a href="lehrjahre.html">The Lehrjahre wing</a>
```
Order becomes: guestbook · links · shop · **wing** · lab · curator's note.

- [ ] **Step 2: index.html era section**

Insert between the translator `</section>` (after the Wayback link ~line 371) and `<h2 class="eralabel">Lost &amp; found · 2002</h2>`:

```html
  <h2 class="eralabel">The Lehrjahre · 2022 – 2023</h2>

  <section class="era">
    <div class="shot">
      <div class="browser">
        <div class="bar"><span>maHalle: Ein Kiez-Gesichterbuch - localhost:3000</span><span class="btns">_ □ ✕</span></div>
        <a href="lehrjahre.html"><img src="assets/lehrjahre-wing.png" alt="Screenshot of the maHalle community forum login page" loading="lazy"></a>
      </div>
    </div>
    <div class="meta">
      <span class="year">2022 – 2023</span>
      <h2><a href="lehrjahre.html">The Lehrjahre wing · the bootcamp years</a></h2>
      <p>Not websites — school notebooks. In 2022 I finally went after the
      <i>missing developer knowledge</i> that had defeated me in 2019: a coding
      bootcamp in Berlin, and fifteen repositories of amateur, naive, sometimes
      childish attempts to build something. Six of them are walkable; all of
      them are on display.</p>
      <div class="chips">
        <span class="chip">CODAC Berlin</span>
        <span class="chip">15 repos</span>
        <span class="chip">6 walkable faces</span>
      </div>
      <p class="quirk">Every exhibit in this wing ran on localhost. This is the first time any of them has been seen in public.</p>
      <a class="go" href="lehrjahre.html">Enter the wing →</a>
    </div>
  </section>

```
(If a rescue changed the walkable count — movie-db success makes it 7, portefeuille always ships — set the chip and the sentence to the true count from the ledger: base 6 = the curated faces incl. portefeuille… **count rule:** walkable faces = number of `lj-door` cards on the final hall page; use that number in both places.)

- [ ] **Step 3: index.html timeline**

After the 2019 line (`…a WordPress template moves in, and wins.`), insert:
```html
      <li><span class="y">2022</span>A coding bootcamp in Berlin — the <i>missing developer knowledge</i>, addressed at last. <a href="lehrjahre.html">The Lehrjahre</a> begin.</li>
```
After the 2023 flavor line (`ercan-atak.de goes dark…`), insert:
```html
      <li><span class="y">2023</span>The repo flood: forums, dashboards, catalogues, half-finished everything. MaHalle is born twice.</li>
      <li class="flavor"><span class="y">2024</span>MaHalle v2's last commit: "Upgrade dependencies." The Lehrjahre end as they lived — quietly, mid-refactor.</li>
```

- [ ] **Step 4: Sister navs**

Add `<a href="lehrjahre.html">The Lehrjahre wing</a>` to `nav.top` in `guestbook.html`, `links.html`, `shop.html`, `restoration-lab.html` — in each, placed immediately before the restoration-lab link (or before the last item if the lab link is absent because it's the self page; the pattern is "museum + all sisters except self", wing after shop).

- [ ] **Step 5: Translator plaque forward-link**

In `plaques/translator.html`, change
`is the seed of everything in the museum's next wing.` to
`is the seed of everything in <a href="../lehrjahre.html">the museum's next wing</a>.`

- [ ] **Step 6: Verify + commit**

Playwright: landing shows the new era section between translator and Lost &amp; found; all five navs contain the wing link and no self-links broke; timeline reads chronologically; plaque link resolves.

```bash
git add index.html guestbook.html links.html shop.html restoration-lab.html plaques/translator.html
git commit -m "Landing, timeline, navs and translator plaque open onto the Lehrjahre wing"
```

---

### Task 11: Docs — README + CLAUDE.md

**Files:**
- Modify: `README.md` (new section after the translator-site section)
- Modify: `CLAUDE.md` (intro sentence, folder lists)

- [ ] **Step 1: README section**

Add after the ercan-atak.de section, adjusting the two rescue sentences to the ledgered outcomes:

```markdown
### 7. The Lehrjahre wing — bootcamp-era apps as frozen faces (2022–2023)

Not recovered websites: none of these fifteen repos was ever public. They are
the CODAC Berlin bootcamp years (2022–2023), exhibited as "HTML faces" —
each app run locally from its private repo, every route's rendered DOM frozen
with a playwright-driven capture tool, then sealed into `lehrjahre/<slug>/`.
The hall page is `lehrjahre.html`.

Provenance / restoration notes — these captures are new artifacts, shaped by
the curator (unlike the recovered sites, which are untouchable):

- Framework/hydration scripts stripped — a face is frozen DOM, not a running
  app. Exceptions: Finance_Logger keeps its own local, network-free JS (the
  form still works); GoneWithTheTailwind keeps its 12-line menu toggle.
- All render assets (images, fonts, CSS — incl. Tailwind-CDN JIT output and
  Google Fonts) localized into each face's `assets/`. Zero external requests,
  zero live external links; originals kept in `data-original` (the blogs'
  hermetic-seal treatment).
- Authentically dead images stay dead: dogsNfilms' 49 shelter-CDN dog photos
  and Finance_Logger's expired Discord background point at intentionally
  absent paths.
- Internal links rewritten to relative `.html` files so multi-page faces are
  walkable; a curator bar at the top of each page links back to the wing.
- MaHalle v1's "Start a debate" modal captured as a second page and wired
  with plain links (curator addition).
- movie-db was revived at capture time with a dummy Firebase config in a
  throwaway clone [or: could not be revived; its card shows the crash].
- The old developer portfolio was captured fed by its original Sanity CMS
  [or: as its static shell; the CMS is gone]. Its footer contact data
  (email, phone, address) is masked with █ blocks — the museum declines to
  republish it.
- The repos themselves remain private and unmodified; all patches happened
  in throwaway clones.
```

- [ ] **Step 2: CLAUDE.md**

- Intro sentence: after "plus a one-page GeoCities found object," add "plus the Lehrjahre wing (`lehrjahre/` — bootcamp-era apps 2022–2023, captured as frozen HTML faces; new artifacts, but treat as sealed exhibits: don't modernize, don't unseal),".
- Archived-folders list: append `` `lehrjahre/*/` `` to the parenthetical list of artifact folders.
- Shell list: add `lehrjahre.html` after `shop.html`'s entry.
- In the "Blog exhibits: hermetic seal" section title or body, add one line: "The same seal applies to every `lehrjahre/<slug>/` face — re-verify with the same greps after any change."

- [ ] **Step 3: Commit**

```bash
git add README.md CLAUDE.md
git commit -m "Docs: Lehrjahre wing provenance and rules"
```

---

### Task 12: Whole-wing verification (then STOP for user preview)

**Files:** none created — verification only. Fix-and-commit anything found.

- [ ] **Step 1: Seal sweep**

```bash
for d in lehrjahre/*/; do .superpowers/sdd/lehrjahre/tools/seal_check.sh "$d" || echo "FAIL $d"; done
grep -rn "atakee@gmail\|Jansastr\|12049 Berlin\|12045 Berlin" lehrjahre/ && echo "PII LEAK" || echo "PII clean"
grep -rin "api_key\|apikey" lehrjahre/*/*.html && echo "KEY LEAK" || echo "keys clean"
```
All SEALED, PII clean, keys clean.

- [ ] **Step 2: Link crawl**

Serve 8765; from the hall page, collect every `href` (python: walk `lehrjahre.html` + each face's pages with html.parser, `curl -s -o /dev/null -w '%{http_code}'` each same-host target URL-encoded). Zero 404s except intentionally absent `lost-external-*` assets.

- [ ] **Step 3: Browser sweep**

playwright-cli: hall page + one page per face, desktop and 390px; console clean except intentional dead-asset 404s (all same-host); `performance.getEntriesByType('resource')` same-host-only on every checked page.

- [ ] **Step 4: STOP — user preview gate**

Report to the user: wing is complete locally on 8765; ask them to walk the hall and the faces and correct card copy, charm notes, the epilogue card, the email masking, and the CODAC host-line wording. **Do not push.** After user approval: push, check Pages build (`gh api repos/atakee72/websites-through-the-years/pages/builds/latest --jq .status`), spot-check live, SPN-save `lehrjahre.html` + each face's entry page.
```

## Self-Review (done at writing time)

1. **Spec coverage:** hall (T9), 6 faces (T2–T6), rescues + gates + fallbacks (T7, T8), PII masking (T8), cards for all 15 incl. epilogue + CA sub-entries (T9), landing/timeline/navs/plaque (T10), README/CLAUDE.md (T11), seal + verification + preview gate + Wayback (T12), no-repo-links and new-artifact framing (Global Constraints + hall copy). ✔
2. **Placeholder scan:** rescue-dependent texts carry both variants inline with a selection rule; no TBDs. ✔
3. **Consistency:** door hrefs in T9 match T2–T8 output paths (`admin-dashboard/home.html` deliberate); capture CLI in T2–T8 matches T1's interface; count rule for the landing chips defined. ✔
