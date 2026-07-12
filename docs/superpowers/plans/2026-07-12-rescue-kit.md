# Website Rescue Kit Implementation Plan (sub-project D, second half)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Package the museum's recovery tooling as a small open-source repo `website-rescue-kit` (Wayback recovery crawler + live-Blogger rescue crawler + README), then cross-link it from the museum.

**Architecture:** A new sibling repo at `/home/atakee/projects/website-rescue-kit` with two self-contained Python 3 stdlib scripts (no dependencies, no packaging) and a README teaching both methods. The museum repo gains two cross-links after the kit is public.

**Tech Stack:** Python 3 (stdlib only), git, `gh` CLI.

## Decisions (from design dialogue — user gate below can still veto)

- Shape: **new public repo** `atakee72/website-rescue-kit` (option 1; user said "let's do D" on that recommendation).
- License: MIT. Author line: "Ercan Atak (@atakee72)".
- Scripts output **original bytes** — no transcoding (the museum's UTF-8 transcode was a GitHub-Pages-specific step; README explains this).
- De-Googling/hermetic sealing is documented as a pointer to the museum's restoration lab, not implemented as a flag (YAGNI — the crawler localizes assets; the seal was hand-finished).

## Global Constraints

- Kit repo root: `/home/atakee/projects/website-rescue-kit` (created by Task 1). Museum repo: `/home/atakee/projects/eski-web-sayfalarim` — untouched until Task 6.
- Nothing is pushed and no GitHub repo is created before the user review gate (end of Task 4). Repo creation + push happen only in Task 5, after explicit user approval.
- No email address may appear in any kit file (attribution is by name + GitHub handle only).
- Scripts: Python 3 stdlib only; ~1 request/second politeness with retry/backoff; resumable.
- Commit messages: simple one-liners, NO Claude signature, NO Co-Authored-By footer.
- Museum's archived exhibit folders are never touched.
- Tasks 2 and 3 commit into the same fresh repo: run them sequentially, or if
  parallelized, each committer retries after 2 s on an index.lock failure.

---

### Task 1: Scaffold the kit repo (local only)

**Files:**
- Create: `/home/atakee/projects/website-rescue-kit/.gitignore`, `/home/atakee/projects/website-rescue-kit/LICENSE`

**Interfaces:**
- Consumes: nothing.
- Produces: an initialized git repo (branch `main`) that Tasks 2–4 commit into.

- [ ] **Step 1: Initialize**

```bash
mkdir -p /home/atakee/projects/website-rescue-kit
cd /home/atakee/projects/website-rescue-kit
git init -b main
```

- [ ] **Step 2: Write `.gitignore`**

```
__pycache__/
*.pyc
rescued-*/
```

- [ ] **Step 3: Write `LICENSE` (MIT)**

```
MIT License

Copyright (c) 2026 Ercan Atak (@atakee72)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

- [ ] **Step 4: Commit**

```bash
git add .gitignore LICENSE
git commit -m "Scaffold: gitignore and MIT license"
```

---

### Task 2: `rescue-wayback.py`

**Files:**
- Create: `/home/atakee/projects/website-rescue-kit/rescue-wayback.py`

**Interfaces:**
- Consumes: Task 1's repo.
- Produces: CLI `python3 rescue-wayback.py <anchor-timestamp> <root-url> <dest-dir> [max-new-files]` — referenced verbatim by Task 4's README.

- [ ] **Step 1: Write the script**

```python
#!/usr/bin/env python3
"""Recover a dead website from the Wayback Machine.

The anchor-capture method:
  1. Find one good snapshot of the site's front page on https://web.archive.org
     and note its 14-digit timestamp (it's in the snapshot URL).
  2. This crawler fetches every page RAW — the archive's `id_` flag returns the
     original bytes, without the Wayback toolbar or rewritten links — follows
     internal links, and for each URL receives the capture nearest in time to
     your anchor. That keeps the whole site era-coherent instead of mixing
     2001 pages with 2009 ones.
  3. It is polite (~1 request/second, retry with backoff — archive.org drops
     connections when hammered) and resumable: files already on disk are
     skipped but still parsed for links.

Files are saved byte-for-byte as archived (original encodings preserved).

Usage:
  python3 rescue-wayback.py 20040130074500 http://members.fortunecity.com/atakee1/ ./rescued-site
  python3 rescue-wayback.py <timestamp> <root-url> <dest> [max-new-files]
"""
import os, re, sys, time, urllib.parse, urllib.request

if len(sys.argv) < 4:
    sys.exit(__doc__)
TS, ROOT, DEST = sys.argv[1], sys.argv[2], sys.argv[3]
MAX = int(sys.argv[4]) if len(sys.argv) > 4 else 0  # 0 = no limit
HOST = urllib.parse.urlparse(ROOT).hostname
UA = {"User-Agent": "Mozilla/5.0 (website-rescue-kit; personal archive recovery)"}
PAGE_EXT = re.compile(r"\.(html?|shtml?|asp|php)$", re.I)
LINK_RE = re.compile(r"""(?:href|src|background)\s*=\s*["']?([^"'>\s]+)""", re.I)


def quote(u):
    # non-ASCII in old URLs (e.g. Turkish "ç") must be percent-encoded
    return urllib.parse.quote(u, safe=":/%?&=~")


def fetch(url, tries=4):
    err = "?"
    for i in range(tries):
        try:
            req = urllib.request.Request(
                quote(f"https://web.archive.org/web/{TS}id_/{url}"), headers=UA)
            with urllib.request.urlopen(req, timeout=60) as r:
                return r.read()
        except Exception as e:
            err = str(e)[:80]
            time.sleep(4 * (i + 1))
    print(f"  FAIL {err} {url}", flush=True)
    return None


def local_path(url):
    p = urllib.parse.unquote(urllib.parse.urlparse(url).path)
    if p.endswith("/") or p == "":
        p += "index.html"
    return os.path.join(DEST, p.lstrip("/"))


def is_page(url):
    p = urllib.parse.urlparse(url).path
    return p.endswith("/") or p == "" or bool(PAGE_EXT.search(p))


seen, queued, saved = set(), set(), 0
queue = [ROOT]
queued.add(ROOT)
while queue:
    url = queue.pop(0).split("#")[0]
    if url in seen:
        continue
    seen.add(url)
    if urllib.parse.urlparse(url).hostname != HOST:
        continue
    out = local_path(url)
    if os.path.exists(out):
        with open(out, "rb") as f:  # resumable: reuse, still parse for links
            data = f.read()
    else:
        data = fetch(url)
        if data is None:
            continue
        os.makedirs(os.path.dirname(out), exist_ok=True)
        with open(out, "wb") as f:
            f.write(data)
        saved += 1
        print(f"OK {out} (queue={len(queue)})", flush=True)
        if MAX and saved >= MAX:
            print(f"=== stopped at max {MAX} new files ===")
            break
        time.sleep(1.1)
    if is_page(url):
        text = data.decode("latin-1", errors="replace")
        for m in LINK_RE.finditer(text):
            raw = m.group(1)
            if raw.startswith(("mailto:", "javascript:", "#", "data:")):
                continue
            u = urllib.parse.urljoin(url, raw).split("#")[0]
            if urllib.parse.urlparse(u).hostname == HOST and u not in seen and u not in queued:
                queued.add(u)
                queue.append(u)

print(f"=== DONE: {saved} new files, {len(seen)} URLs visited ===")
```

- [ ] **Step 2: Syntax check**

Run: `cd /home/atakee/projects/website-rescue-kit && python3 -m py_compile rescue-wayback.py && echo ok`
Expected: `ok`

- [ ] **Step 3: Live smoke test (3 files, then stops)**

Run: `cd /home/atakee/projects/website-rescue-kit && python3 rescue-wayback.py 20040130074500 http://members.fortunecity.com/atakee1/ ./rescued-smoke 3`
Expected: three `OK ./rescued-smoke/atakee1/...` lines (the first being `atakee1/index.html` — the site lived under that path), then `=== stopped at max 3 new files ===`. Network flakiness → retries are normal; a single FAIL line is acceptable as long as files land.

Run: `ls rescued-smoke/atakee1/ && rm -rf rescued-smoke`
Expected: `index.html` plus 1–2 more entries; then cleaned up (the dir is gitignored anyway).

- [ ] **Step 4: Commit**

```bash
git add rescue-wayback.py
git commit -m "Add Wayback Machine recovery crawler"
```

---

### Task 3: `rescue-blogger.py`

**Files:**
- Create: `/home/atakee/projects/website-rescue-kit/rescue-blogger.py`

**Interfaces:**
- Consumes: Task 1's repo.
- Produces: CLI `python3 rescue-blogger.py <blog-url> <dest-dir>` — referenced verbatim by Task 4's README.

- [ ] **Step 1: Write the script** (this is the museum's battle-tested crawler with a fuller docstring; change nothing else)

```python
#!/usr/bin/env python3
"""Rescue a live Blogger blog into a self-contained static copy.

Crawls the blog directly (posts, year/month archives, label pages, and the
"older posts" pagination chains), localizes Google-CDN assets (images, theme
graphics, web fonts) into a local `blog-assets/` folder, strips Blogger's
JS-injected chrome, and rewrites internal links to relative local paths.

Notes from the field:
  - Blogger's dead image-proxy URLs (blogger_img_proxy) 404 even on the live
    blog; they get a single try so the crawl doesn't stall.
  - Pagination URLs (?updated-max=...) become content-addressed local pages
    under paged/.
  - This produces a faithful static copy, not yet a hermetically sealed one:
    outbound links and leftover cross-references need a manual pass if you
    want zero external requests. See the restoration lab of
    https://atakee72.github.io/websites-through-the-years/ for that story.

Usage:
  python3 rescue-blogger.py https://yourblog.blogspot.com ./rescued-blog
"""
import re, os, sys, time, hashlib, urllib.parse, urllib.request

if len(sys.argv) != 3:
    sys.exit(__doc__)
BLOG = sys.argv[1].rstrip("/")
DEST = sys.argv[2]
HOST = urllib.parse.urlparse(BLOG).hostname
UA = {"User-Agent": "Mozilla/5.0 (website-rescue-kit; personal blog backup by author)"}

# posts, month archives (/2013/08/), classic archive pages, static /p/ pages
PAGE_OK = re.compile(r"^/(\d{4}/(\d{2}/([^/]+\.html)?)?|\d{4}_\d{2}_\d{2}_archive\.html|p/[^/]+\.html|search/label/[^/?]+|search)?$")
ASSET_HOSTS = re.compile(r"(^|\.)(bp\.blogspot\.com|googleusercontent\.com|blogblog\.com)$")
SCRIPT_RE = re.compile(r"<script\b.*?</script>\s*", re.I | re.S)

os.makedirs(os.path.join(DEST, "blog-assets"), exist_ok=True)

def fetch(url, binary=False, tries=3):
    err = "?"
    for i in range(tries):
        try:
            req = urllib.request.Request(url, headers=UA)
            with urllib.request.urlopen(req, timeout=30) as r:
                data = r.read()
                return data if binary else data.decode("utf-8", errors="replace")
        except Exception as e:
            err = str(e)[:80]
            time.sleep(3 * (i + 1))
    print(f"  FETCH-FAIL {err} {url}", flush=True)
    return None

def page_key(url):
    pu = urllib.parse.urlparse(url)
    q = pu.query if "updated-max" in pu.query else ""
    return pu.path + ("?" + q if q else "")

def page_path(url):
    pu = urllib.parse.urlparse(url)
    p, q = pu.path, pu.query
    if "updated-max" in q:  # pagination: content-addressed local page
        return f"paged/{hashlib.md5((p + '?' + q).encode()).hexdigest()[:10]}/index.html"
    if p in ("", "/"): return "index.html"
    if p.endswith("/"): return p.lstrip("/") + "index.html"  # month archives
    if re.match(r"^/search/label/[^/?]+$", p):
        return urllib.parse.unquote(p).lstrip("/") + "/index.html"
    if p == "/search": return "index.html"  # bare search -> home
    return urllib.parse.unquote(p).lstrip("/")

assets = {}  # remote url -> local relative path
def localize_asset(url):
    if url in assets: return assets[url]
    base = os.path.basename(urllib.parse.urlparse(url).path) or "asset"
    base = re.sub(r"[^A-Za-z0-9._-]", "_", base)[-60:]
    name = hashlib.md5(url.encode()).hexdigest()[:8] + "-" + base
    local = f"blog-assets/{name}"
    # blogger_img_proxy entries are dead even on the live blog: single try
    data = fetch(url, binary=True, tries=1 if "blogger_img_proxy" in url else 3)
    if data is None:
        assets[url] = url  # leave remote on failure
        return url
    with open(os.path.join(DEST, local), "wb") as f:
        f.write(data)
    assets[url] = local
    return local

def depth_prefix(relpath):
    return "../" * relpath.count("/")

seen, queue, saved = set(), ["/"], 0
while queue:
    key = queue.pop(0)
    if key in seen: continue
    seen.add(key)
    path = key.split("?")[0]
    if not PAGE_OK.match(path): continue
    html = fetch(BLOG + key)
    if html is None: continue
    rel = page_path(BLOG + key)
    pfx = depth_prefix(rel)

    # queue internal links before rewriting
    for m in re.finditer(r'(?:href|src)=["\']([^"\']+)["\']', html):
        u = urllib.parse.urljoin(BLOG + key, m.group(1).split("#")[0])
        pu = urllib.parse.urlparse(u)
        if pu.hostname == HOST and PAGE_OK.match(pu.path):
            k = page_key(u)
            if k not in seen:
                queue.append(k)

    # strip all scripts (Blogger widgets, cookie banner, navbar are JS-injected)
    html = SCRIPT_RE.sub("", html)
    html = re.sub(r"<noscript>.*?</noscript>\s*", "", html, flags=re.I | re.S)

    # srcset/sizes would override the localized src with Google CDN URLs
    html = re.sub(r"""\s(?:srcset|sizes)=["'][^"']*["']""", "", html)

    # localize CDN assets in src/href/background/meta-content and inline css url(...)
    def sub_attr(m):
        attr, url = m.group(1), m.group(2)
        pu = urllib.parse.urlparse(url)
        if pu.hostname == HOST and pu.path.endswith("favicon.ico"):
            loc = localize_asset(url)
            if loc.startswith("http"): return m.group(0)
            return f'{attr}="{pfx}{loc}"'
        if pu.hostname and ASSET_HOSTS.search(pu.hostname):
            loc = localize_asset(url)
            if loc.startswith("http"): return m.group(0)  # download failed: keep original
            return f'{attr}="{pfx}{loc}"'
        return m.group(0)
    html = re.sub(r'(src|href|background|content)=["\']([^"\']+)["\']', sub_attr, html)
    def sub_css(m):
        url = m.group(1).strip("'\" ")
        pu = urllib.parse.urlparse(url)
        if pu.hostname and ASSET_HOSTS.search(pu.hostname):
            loc = localize_asset(url)
            if loc.startswith("http"): return m.group(0)
            return f"url({pfx}{loc})"
        return m.group(0)
    html = re.sub(r"url\(([^)]+)\)", sub_css, html)

    # rewrite internal blog links to relative local paths
    def sub_link(m):
        attr, url = m.group(1), m.group(2)
        pu = urllib.parse.urlparse(url.split("#")[0])
        if pu.hostname == HOST and PAGE_OK.match(pu.path):
            tgt = page_path(url)
            return f'{attr}="{pfx}{tgt}"'
        return m.group(0)
    html = re.sub(r'(href)=["\'](https?://[^"\']+?)["\']', sub_link, html)

    out = os.path.join(DEST, rel)
    os.makedirs(os.path.dirname(out) or DEST, exist_ok=True)
    with open(out, "w", encoding="utf-8") as f:
        f.write(html)
    saved += 1
    print(f"OK {rel} (queue={len(queue)})", flush=True)
    time.sleep(0.8)

print(f"=== DONE: {saved} pages, {len(assets)} assets ===")
```

- [ ] **Step 2: Syntax check**

Run: `cd /home/atakee/projects/website-rescue-kit && python3 -m py_compile rescue-blogger.py && echo ok`
Expected: `ok`
(No live crawl in this task — the script is byte-for-byte the crawler that produced the museum's two blog exhibits, plus a docstring and argv guard; a full crawl against a live blog is not an appropriate smoke test.)

- [ ] **Step 3: Verify the battle-tested landmarks survived transcription**

The Step 1 block is authoritative (it is the museum's proven crawler plus a
docstring and an argv guard). Spot-check the load-bearing details:

Run: `grep -c "blogger_img_proxy" rescue-blogger.py; grep -c "updated-max" rescue-blogger.py; grep -c "srcset" rescue-blogger.py; grep -c 'paged/' rescue-blogger.py`
Expected: `3` (docstring + comment + single-try logic), `3` (docstring + page_key + page_path), `2` (comment + strip regex), `2` (docstring + content-addressed pagination path).

- [ ] **Step 4: Commit**

```bash
git add rescue-blogger.py
git commit -m "Add live-Blogger rescue crawler"
```

---

### Task 4: Kit `README.md`

**Files:**
- Create: `/home/atakee/projects/website-rescue-kit/README.md`

**Interfaces:**
- Consumes: the two CLIs exactly as defined in Tasks 2–3.
- Produces: the kit's public face; Task 6's museum links point at the repo.

- [ ] **Step 1: Write the README**

```markdown
# website-rescue-kit

Two small, dependency-free Python scripts for rescuing websites — the dead
ones and the not-yet-dead ones. Extracted from building
[websites through the years](https://atakee72.github.io/websites-through-the-years/),
a museum of five sites recovered this way; the method is narrated in its
[restoration lab](https://atakee72.github.io/websites-through-the-years/restoration-lab.html).

## Your site is dead (host gone) → `rescue-wayback.py`

If the [Wayback Machine](https://web.archive.org) photographed your site
while it lived, it can come back.

1. Find one good capture of your front page on web.archive.org and copy the
   14-digit timestamp from the snapshot URL — this is your **anchor**.
2. Run:

```bash
python3 rescue-wayback.py 20040130074500 http://members.fortunecity.com/atakee1/ ./rescued-site
```

The crawler fetches original bytes (the archive's `id_` flag — no Wayback
toolbar, no rewritten links), follows internal links, and takes each URL's
capture nearest to your anchor, so the whole site stays era-coherent. It is
polite (~1 req/s with backoff) and resumable — re-run it after an
interruption and it continues. An optional fourth argument caps how many new
files to fetch (handy for a test run).

What it can't do: recover pages the archive never captured (they're gone),
or un-inject the ads your free host baked into the HTML — that part is
hand-surgery; see the restoration lab for what it looks like.

## Your site is alive but hostage (Blogger) → `rescue-blogger.py`

Free platforms don't last forever (ask GeoCities, or FortuneCity). This
crawls a live Blogger blog into a static copy you own:

```bash
python3 rescue-blogger.py https://yourblog.blogspot.com ./rescued-blog
```

It captures posts, year/month archives, label pages and the "older posts"
pagination chains; downloads images, theme graphics and web fonts out of
Google's CDNs into a local `blog-assets/` folder; strips Blogger's
JS-injected chrome; and rewrites internal links to relative paths. The
result opens from a plain folder or any static host.

What it doesn't do by itself: disarm outbound links and every last Google
reference (a "hermetic seal"). That final pass is deliberate manual work —
the [restoration lab](https://atakee72.github.io/websites-through-the-years/restoration-lab.html)
documents it. Also grab a [Google Takeout](https://takeout.google.com)
export of your blog as the lossless canonical backup; mind that its
settings CSV contains a mail-to-Blogger posting address — treat it as a
secret.

## Notes that will save you an evening

- **Wayback rate limits are real.** The scripts sleep between requests and
  retry with backoff; if you hammer archive.org it will drop your
  connections.
- **Old URLs contain old encodings.** A Turkish "ç" in a 2002 filename is
  windows-1254 percent-encoding, not UTF-8; the scripts quote URLs safely.
- **Don't transcode unless your host makes you.** Files come back
  byte-for-byte in their original encodings. GitHub Pages, for one, forces a
  `charset=utf-8` header that overrides `<meta>` tags — if you host there,
  transcode once, deliberately, and keep the original bytes in git history.
- **Commit the raw crawl first, clean up second.** Your git history then
  documents every restoration decision — that's the provenance.

## License

MIT — © 2026 Ercan Atak ([@atakee72](https://github.com/atakee72))
```

- [ ] **Step 2: Sanity checks**

Run: `cd /home/atakee/projects/website-rescue-kit && grep -c "rescue-wayback.py\|rescue-blogger.py" README.md`
Expected: ≥ 4 (both CLIs shown as in Tasks 2–3).
Run: `! grep -riq "gmail\|@foreigntrade" README.md LICENSE rescue-*.py && echo clean`
Expected: `clean` (no email addresses anywhere).

- [ ] **Step 3: Commit**

```bash
git add README.md
git commit -m "Add README: both rescue methods and field notes"
```

- [ ] **Step 4: STOP — user review gate (no repo creation, no push)**

Report to the user: the kit is ready for local review at
`/home/atakee/projects/website-rescue-kit` (README + two scripts + license).
The user confirms (a) the repo name `website-rescue-kit`, (b) MIT + the
attribution line, (c) the README text. Only after approval proceed to Task 5.

---

### Task 5: Publish the kit (AFTER user approval only)

**Files:**
- None changed; repo-side actions.

**Interfaces:**
- Consumes: approved kit from Tasks 1–4.
- Produces: public URL `https://github.com/atakee72/website-rescue-kit`, consumed by Task 6.

- [ ] **Step 1: Create the repo and push**

```bash
cd /home/atakee/projects/website-rescue-kit
gh repo create atakee72/website-rescue-kit --public --source=. --push \
  --description "Rescue your old websites: Wayback Machine recovery + live-Blogger rescue, dependency-free Python"
```

- [ ] **Step 2: Verify**

Run: `gh repo view atakee72/website-rescue-kit --json url,description --jq .url && curl -s -o /dev/null -w "%{http_code}\n" https://github.com/atakee72/website-rescue-kit`
Expected: the repo URL and `200`.

---

### Task 6: Museum cross-links

**Files:**
- Modify: `/home/atakee/projects/eski-web-sayfalarim/restoration-lab.html` (chapter 5 list)
- Modify: `/home/atakee/projects/eski-web-sayfalarim/README.md` (Curation layer section)

**Interfaces:**
- Consumes: the public kit URL from Task 5.
- Produces: museum → kit wiring; final state of sub-project D.

- [ ] **Step 1: Add the kit to the restoration lab's "Verify it yourself" chapter**

In `restoration-lab.html`, immediately after the `</ul>` that closes the
commit-permalink list in section "5 · Verify it yourself", insert:

```html
  <p>The crawlers behind all of this are open source:
  <a href="https://github.com/atakee72/website-rescue-kit">website-rescue-kit</a> —
  take them, your old sites might still be rescuable too.</p>
```

- [ ] **Step 2: Add one line to the museum README's "Curation layer" section**

Insert a new bullet immediately after this existing line (the section's last
bullet):

```markdown
- A timeline on the landing page connects the exhibits (1998–2026).
```

New bullet:

```markdown
- The recovery crawlers are published as
  [website-rescue-kit](https://github.com/atakee72/website-rescue-kit).
```

- [ ] **Step 3: Verify in browser**

```bash
playwright-cli open http://localhost:8765/restoration-lab.html
playwright-cli eval "document.querySelector('a[href=\"https://github.com/atakee72/website-rescue-kit\"]') !== null"
playwright-cli eval "performance.getEntriesByType('resource').map(r=>r.name).filter(n=>!n.startsWith(location.origin))"
playwright-cli close
```
Expected: `true`; `[]` (still zero external requests — the kit link is an `<a href>`, not a load). (Start the server with `python3 -m http.server 8765` from the museum root if not running.)

- [ ] **Step 4: Commit and push the museum**

```bash
cd /home/atakee/projects/eski-web-sayfalarim
git add restoration-lab.html README.md
git commit -m "Link the open-source rescue kit from lab and README"
git push
```
Then confirm the Pages build: `gh api repos/atakee72/websites-through-the-years/pages/builds/latest --jq .status` (poll until `built`) and `curl -s https://atakee72.github.io/websites-through-the-years/restoration-lab.html | grep -c website-rescue-kit` → ≥ 1.

Note: this is the one place a push happens without a fresh gate — the user
already approved publishing in Task 5, and these two links are direct
consequences of it. The lab page is an already-reviewed page; only the new
paragraph is new content.
