# Yet Another Company Website Face Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Promote the bootcamp restaurant site ("Yet Another Company Website", CA-Projects Project-1) to the wing's 11th walkable face — copied as-is with its working reservation→confirmation flow, fonts localized, maps embed deadened, and one marked XSS patch — plus its hall card.

**Architecture:** No capture tool: the site was always plain HTML. Copy the nine files verbatim into `lehrjahre/yet-another-company-website/`, then museum-treat by hand: localize the two Google-Fonts stylesheets (Montserrat-300, Material Symbols Outlined) into `local-fonts/`, deaden the contact-page Google-Maps iframe (`data-original`), switch `confirmation-page.js`'s eight raw `innerHTML` writes to `textContent` (marked curator security patch), and inject the standard curator bar on all five pages. Hall gains one card after rick-n-morty; counts go 10 → 11.

**Tech Stack:** Hand-edited HTML/CSS/vanilla JS; toolkit venv python + playwright for checks only.

**Spec:** `docs/superpowers/specs/2026-08-31-yet-another-company-website-face-design.md`

## Global Constraints

- Sealed NEW artifact: **zero external requests at view time on every page, including the confirmation page after a form submit**; zero live external links; the dead maps embed keeps its original URL in `data-original`.
- The ONLY content edits to the app's files: font-link rewrites, the maps-iframe deadening, the marked `.textContent` patch, the curator bars. Lorem ipsum, the fake email, the unused `schöner-regenwald-1.jpg`, misspellings — all ship untouched.
- The form flow must keep working: relative GET `action="confirmation-page.html"`, `confirmation-page.js` loaded.
- Only these paths change: create `lehrjahre/yet-another-company-website/**` and `assets/lehrjahre/yet-another-company-website.png`; modify `lehrjahre.html`, `index.html`, `README.md` (Task 2 only). Verify with `git status --porcelain`.
- Seal after any hand-edit: `bash .superpowers/sdd/lehrjahre/tools/seal_check.sh lehrjahre/yet-another-company-website` → `SEALED`, and `grep -rc sourceMappingURL lehrjahre/yet-another-company-website/*.html lehrjahre/yet-another-company-website/*.js lehrjahre/yet-another-company-website/local-fonts/*.css | grep -v ':0$'` → empty.
- Commits: simple messages, **no Claude signature / no Co-Authored-By**. Do NOT push — user previews first.
- Serve tests with `python3 -m http.server 8765` from repo root (check if already running); venv python `$VPY` = `.superpowers/sdd/lehrjahre/tools/venv/bin/python`.

`$SCRATCH` = `/tmp/claude-1000/-home-atakee-projects-eski-web-sayfalarim/7eaa4ca0-c678-4550-9f5a-b30442fa5a16/tmp` (this job's tmp dir; create files there)
`$SRC` = `.superpowers/sdd/lehrjahre/repos/CA-Projects-/Project-1`
`$FACE` = `lehrjahre/yet-another-company-website`

---

### Task 1: Build and seal the face

**Files:**
- Create: `$FACE/` (home.html, reservations.html, special.html, contact.html, confirmation-page.html, confirmation-page.js, styles.css, img/* — copied from `$SRC`; plus `local-fonts/`), `assets/lehrjahre/yet-another-company-website.png`
- Test: `$SCRATCH/yacw_face_check.py`

**Interfaces:**
- Produces: door URL `lehrjahre/yet-another-company-website/home.html` and thumbnail `assets/lehrjahre/yet-another-company-website.png` — Task 2's card links exactly these. Page inventory: 5 HTML pages, nav links between them, form on reservations.html, results rendered by confirmation-page.js into spans `.email .fname .sname .bday .sex .type .notes .treatment`.

- [ ] **Step 1: Copy verbatim.**

```bash
mkdir -p lehrjahre/yet-another-company-website
cp -r .superpowers/sdd/lehrjahre/repos/CA-Projects-/Project-1/. lehrjahre/yet-another-company-website/
ls lehrjahre/yet-another-company-website
```

Expected: the 5 html files, confirmation-page.js, styles.css, img/ (4 images incl. `schöner-regenwald-1.jpg`).

- [ ] **Step 2: Localize the fonts.** Write `$SCRATCH/fetch_fonts.py`:

```python
import pathlib, re, sys, urllib.request

UA = {'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 '
                    '(KHTML, like Gecko) Chrome/126.0 Safari/537.36'}
CSS = [
    ('montserrat', 'https://fonts.googleapis.com/css2?family=Montserrat:wght@300&display=swap'),
    ('material-symbols', 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@48,400,0,0'),
]
out = pathlib.Path(sys.argv[1])
out.mkdir(parents=True, exist_ok=True)
for name, url in CSS:
    css = urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=30).read().decode()
    for i, furl in enumerate(sorted(set(re.findall(r'url\((https://fonts\.gstatic\.com[^)]+)\)', css)))):
        fname = f"{name}-{i}.{furl.rsplit('.', 1)[-1]}"
        (out / fname).write_bytes(
            urllib.request.urlopen(urllib.request.Request(furl, headers=UA), timeout=30).read())
        css = css.replace(furl, fname)
    (out / f'{name}.css').write_text(css)
    print(name, 'ok,', len(re.findall(r'url\(', css)), 'font url(s) localized')
assert not re.search(r'https?:|//fonts', (out / 'montserrat.css').read_text() +
                     (out / 'material-symbols.css').read_text()), 'external URL left in css'
print('fonts local')
```

Run: `$VPY $SCRATCH/fetch_fonts.py lehrjahre/yet-another-company-website/local-fonts`
Expected: both `ok` lines + `fonts local`. (This fetch is the exhibit's one sanctioned network moment. The UA header matters — Google serves legacy formats to unknown agents.)

- [ ] **Step 3: Rewrite the font links on all five pages.** Write and run `$SCRATCH/rewrite_heads.py`:

```python
import pathlib

face = pathlib.Path('lehrjahre/yet-another-company-website')
OLD = [
    '<link rel="preconnect" href="https://fonts.googleapis.com">',
    '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>',
    '<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300&display=swap" rel="stylesheet">',
    '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@48,400,0,0" />',
]
NEW = [
    '',
    '',
    '<link href="local-fonts/montserrat.css" rel="stylesheet">',
    '<link rel="stylesheet" href="local-fonts/material-symbols.css" />',
]
for page in face.glob('*.html'):
    t = page.read_text(encoding='utf-8')
    n = 0
    for old, new in zip(OLD, NEW):
        assert old in t, (page.name, old)
        t = t.replace(old, new)
        n += 1
    page.write_text(t, encoding='utf-8')
    print(page.name, n, 'links rewritten')
```

Expected: each of the 5 pages prints `4 links rewritten`. (Every page carries exactly these 4 lines — verified against source 2026-08-31. If the assert fires naming a page, read that page's actual link line and adjust that OLD entry to its byte form — the source, not the script, is authoritative.)

- [ ] **Step 4: Deaden the maps embed.** In `$FACE/contact.html`, the iframe's src (one occurrence, starts `https://www.google.com/maps/embed?pb=`): change

`<iframe src="https://www.google.com/maps/embed?pb=…"` (the full URL)
→ `<iframe src="lost-google-maps-embed" data-original="https://www.google.com/maps/embed?pb=…"` (same full URL moved into `data-original`, byte-identical).

Everything else in the iframe tag stays. Verify: `grep -c 'data-original="https://www.google.com/maps/embed' lehrjahre/yet-another-company-website/contact.html` → 1, and `grep -c 'src="https' lehrjahre/yet-another-company-website/contact.html` → 0.

- [ ] **Step 5: The marked XSS patch.** In `$FACE/confirmation-page.js`: insert at the very top (before line 1):

```javascript
// Museum edit (2026-08-31): the original wrote the visitor's form values into
// the page with innerHTML; on a public site a crafted link could inject live
// markup that way. Every innerHTML below is now textContent. Nothing else
// changed — the rockets are original.
```

Then replace all 8 occurrences of `.innerHTML =` with `.textContent =` (the two template-literal lines included). Verify: `grep -c 'innerHTML' lehrjahre/yet-another-company-website/confirmation-page.js` → 2 (both in the comment), `grep -c 'textContent =' …/confirmation-page.js` → 8, `grep -c '🚀' …/confirmation-page.js` → 10 (unchanged — nine live logs plus the commented-out age line).

- [ ] **Step 6: Curator bars.** Insert on each of the 5 pages, immediately after the opening `<body>` tag (whatever attributes it has), this exact snippet (byte-identical bar style to the other faces):

```html
<div class="curator-bar" style="background:#101418;color:#9aa4ae;font:13px/1.6 ui-monospace,monospace;padding:.45rem 1rem;border-bottom:1px solid #2c3640;position:relative;z-index:2147483647;"><a href="../../lehrjahre.html" style="color:#ffb454;text-decoration:none;">← The Lehrjahre wing</a> · Yet Another Company Website (2022–2023) — frozen capture; nothing here is live.</div>
```

Verify: `grep -c 'curator-bar' lehrjahre/yet-another-company-website/*.html` → 1 per file.

- [ ] **Step 7: Seal.**

```bash
bash .superpowers/sdd/lehrjahre/tools/seal_check.sh lehrjahre/yet-another-company-website
grep -rn 'sourceMappingURL' lehrjahre/yet-another-company-website/ || echo "no sourcemaps"
grep -rn 'https\?://' lehrjahre/yet-another-company-website/*.html lehrjahre/yet-another-company-website/*.js lehrjahre/yet-another-company-website/*.css lehrjahre/yet-another-company-website/local-fonts/*.css | grep -v 'data-original' || echo "no live urls"
```

Expected: `SEALED`, `no sourcemaps`, `no live urls`.

- [ ] **Step 8: Behavior test.** Write `$SCRATCH/yacw_face_check.py`:

```python
from playwright.sync_api import sync_playwright

B = 'http://localhost:8765/lehrjahre/yet-another-company-website/'
PAGES = ['home.html', 'reservations.html', 'special.html', 'contact.html',
         'confirmation-page.html']

with sync_playwright() as p:
    b = p.chromium.launch()
    pg = b.new_page(viewport={'width': 1280, 'height': 900})
    errs = []
    pg.on('console', lambda m: errs.append(m.text) if m.type == 'error' else None)
    pg.on('pageerror', lambda e: errs.append(str(e)))

    # every page: curator bar, zero external resources
    for page in PAGES:
        pg.goto(B + page, wait_until='networkidle')
        assert pg.locator('.curator-bar').count() == 1, page
        ext = pg.evaluate("performance.getEntriesByType('resource').map(r=>r.name)"
                          ".filter(n=>!n.startsWith(location.origin))")
        assert ext == [], (page, ext)
        assert pg.eval_on_selector_all(
            'img', 'els => els.every(i => i.complete && i.naturalWidth > 0)'), page

    # crescent moon: Material Symbols loaded locally and applied
    pg.goto(B + 'home.html', wait_until='networkidle')
    assert pg.evaluate(
        "document.fonts.ready.then(() => document.fonts.check(\"20px 'Material Symbols Outlined'\"))")
    pg.screenshot(path='yacw-home.png')

    # the form flow works: book a table, confirmation reads it back
    pg.goto(B + 'reservations.html', wait_until='networkidle')
    pg.fill('input[name="fname"]', 'Ercan')
    pg.fill('input[name="sname"]', 'Museumsgast')
    pg.fill('input[name="email"]', 'gast@example.com')
    with pg.expect_navigation():
        pg.click('form [type="submit"], form button')
    assert 'confirmation-page.html?' in pg.url
    pg.wait_for_load_state('networkidle')
    body = pg.inner_text('body')
    assert 'Ercan' in body and 'Museumsgast' in body
    ext = pg.evaluate("performance.getEntriesByType('resource').map(r=>r.name)"
                      ".filter(n=>!n.startsWith(location.origin))")
    assert ext == [], ext
    pg.screenshot(path='yacw-confirmation.png')

    # XSS patch: payload renders as text, creates no element
    pg.goto(B + 'confirmation-page.html?fname=%3Cimg%20src%3Dx%20onerror%3Dwindow.__pwned%3D1%3E'
            '&sname=s&email=e&bday=2000-01-01&sex=m&travellerType=t&textArea=n&treatment=on',
            wait_until='networkidle')
    assert pg.evaluate('window.__pwned') is None
    assert pg.locator('.fname img').count() == 0
    assert '<img' in pg.inner_text('.fname')

    # the dead maps frame 404s by design; generic resource-load noise is not a defect here,
    # because every <img> and the icon font are asserted loaded explicitly above/below
    real = [e for e in errs if 'favicon' not in e
            and 'lost-google-maps-embed' not in e
            and 'Failed to load resource' not in e
            and 'ERR_' not in e]
    assert real == [], real
    print('FACE OK')
    b.close()
```

- [ ] **Step 9: Run it** (repo served on 8765):

```bash
cd $SCRATCH && /home/atakee/projects/eski-web-sayfalarim/.superpowers/sdd/lehrjahre/tools/venv/bin/python yacw_face_check.py
```

Expected: `FACE OK`. If a `fill()` selector fails, read the form's actual input names in `$FACE/reservations.html` and adjust the TEST selectors to them (the form is the artifact; never rename its fields). Names used above (`fname`, `sname`, `email`) come from the query string the original JS reads — verify against the form before running.

- [ ] **Step 10: Thumbnail.**

```bash
$VPY - <<'EOF'
from PIL import Image
im = Image.open('/tmp/claude-1000/-home-atakee-projects-eski-web-sayfalarim/7eaa4ca0-c678-4550-9f5a-b30442fa5a16/tmp/yacw-home.png')
im.thumbnail((640, 10000))
im.save('assets/lehrjahre/yet-another-company-website.png')
print(im.size)
EOF
```

- [ ] **Step 11: Scope check + commit**

```bash
git status --porcelain | grep -v -E '^\?\? (lehrjahre/yet-another-company-website/|assets/lehrjahre/yet-another-company-website\.png)'
```

Expected: empty. Then:

```bash
git add lehrjahre/yet-another-company-website assets/lehrjahre/yet-another-company-website.png
git commit -m "Lehrjahre: Yet Another Company Website copied as walkable face; fonts localized, maps embed deadened, marked textContent patch"
```

---

### Task 2: Hall card, counts 10 → 11, README

**Files:**
- Modify: `lehrjahre.html` (new card after the rick-n-morty card; count word), `index.html` (count word + chip), `README.md` (`### 7.` bullet)
- Test: `$SCRATCH/hall_check18.py`

**Interfaces:**
- Consumes: Task 1's door URL `lehrjahre/yet-another-company-website/home.html`, thumbnail `assets/lehrjahre/yet-another-company-website.png`; the hall's card pattern and specimen classes (`.specimen-label`, `pre.specimen`).

- [ ] **Step 1: Insert the new card** in `lehrjahre.html`. Unique anchor: the line `<p class="lj-door"><a class="go" href="lehrjahre/rick-n-morty/index.html">Enter the exhibit →</a></p>` occurs exactly once; the new card goes after that card's closing `</div>` (the very next `</div>` line), before the MaHalle v1 card. Exact markup (the specimen is `$SRC/confirmation-page.js` lines 1–12 verbatim — it contains no `<`/`>`/`&`, so escaped == verbatim):

```html
    <div class="lj-card">
      <span class="lj-badge">walkable · still works</span>
      <h3>Yet Another Company Website <span class="lj-date">Nov 2022</span></h3>
      <div class="lj-shot"><a href="lehrjahre/yet-another-company-website/home.html"><img src="assets/lehrjahre/yet-another-company-website.png" alt="Dark restaurant home page, crescent moon icon, header 'Yet Another Company Website'" loading="lazy"></a></div>
      <p class="lj-hook">A restaurant whose header admits it: Yet Another Company Website.</p>
      <div class="lj-plaque">
        <p>The first thing I built at the bootcamp: a restaurant site that
        never got a name — the header says "Yet Another Company Website", the
        browser tab still says "Project Kick-Off". Lorem ipsum stands in for
        every paragraph the restaurant never wrote. But the reservation form
        works: book a table and the confirmation page reads your booking back
        to you — the wing's only working two-page flow, alive since November
        2022.</p>
        <div class="specimen-label">Specimen — confirmation-page.js, the rockets</div>
        <pre class="specimen"><code>let params = (new URL(document.location)).searchParams;
console.log("🚀 ~ params:", params);

let email = params.get("email");
console.log("🚀 ~ email:", email);
const emailPlace = document.querySelector(".email")
emailPlace.innerHTML = email

let fname = params.get("fname");
console.log("🚀 ~ fname:", fname);
const fnamePlace = document.querySelector(".fname")
fnamePlace.innerHTML = fname</code></pre>
        <p>Every log in that file launches a little rocket — the 🚀 ~ prefix a
        VS Code extension stamped on the era. The museum kept the rockets and
        defused one booby trap: the original pasted your booking into the page
        as live HTML; the exhibit pastes it as text. Everything else is
        untouched.</p>
        <p class="lj-charm">The form's checkbox arrives pre-ticked: "I do NOT want any special treatment."</p>
      </div>
      <button class="lj-plaque-btn" type="button">Read the plaque →</button>
      <p class="lj-door"><a class="go" href="lehrjahre/yet-another-company-website/home.html">Enter the exhibit →</a></p>
    </div>
```

- [ ] **Step 2: Specimen fidelity check**:

```bash
python3 - <<'EOF'
import hashlib, html, pathlib, re
page = pathlib.Path('lehrjahre.html').read_text(encoding='utf-8')
m = re.search(r'confirmation-page\.js, the rockets</div>\s*<pre class="specimen"><code>(.*?)</code></pre>', page, re.S)
src = html.unescape(m.group(1)) + '\n'
print(hashlib.md5(src.encode()).hexdigest())
EOF
```

Expected: `f4e9a9e8073f323662ae4286c519b5d5` (= `sed -n '1,12p' $SRC/confirmation-page.js | md5sum`). Mismatch → fix the specimen in lehrjahre.html; never touch the source.

- [ ] **Step 3: Counts.** Three living sites (grep-verified):
  - `lehrjahre.html`: `Ten of them are walkable` → `Eleven of them are walkable`
  - `index.html`: `Ten of them are walkable` → `Eleven of them are walkable`
  - `index.html`: `<span class="chip">10 walkable faces</span>` → `<span class="chip">11 walkable faces</span>`

  Then `grep -rn -i "ten of them\|10 walkable" *.html` → no hits (dated README provenance entries stay).

- [ ] **Step 4: README provenance.** In `README.md` `### 7.`, after the rick-n-morty bullet add:

```markdown
- 2026-08-31: third promoted sub-exhibit — `lehrjahre/yet-another-company-website/`
  (CA-Projects, Project-1). Always plain HTML, so it was copied, not
  captured, and its reservation→confirmation form flow still works. Museum
  treatment: both Google-Fonts stylesheets (Montserrat, Material Symbols)
  localized into `local-fonts/`; the contact page's Google-Maps embed
  deadened with the original URL in `data-original`; and one marked
  security patch in `confirmation-page.js` — the original wrote the
  visitor's form values into the page with `innerHTML` (a reflected-XSS
  vector on a public origin), the exhibit writes them with `textContent`.
  The 🚀 console logs and everything else ship untouched. Walkable count:
  eleven.
```

- [ ] **Step 5: Hall behavior test.** Write `$SCRATCH/hall_check18.py`:

```python
from playwright.sync_api import sync_playwright

BASE = 'http://localhost:8765/lehrjahre.html'

with sync_playwright() as p:
    b = p.chromium.launch()
    pg = b.new_page(viewport={'width': 1280, 'height': 900})
    errs = []
    pg.on('console', lambda m: errs.append(m.text) if m.type == 'error' else None)
    pg.goto(BASE, wait_until='networkidle')

    assert pg.locator('.lj-grid .lj-card').count() == 18
    assert pg.locator('.lj-plaque').count() == 18
    assert pg.locator('.lj-plaque-btn').count() == 18
    assert pg.locator('.lj-hook').count() == 18
    assert 'Eleven of them are walkable' in pg.inner_text('body')

    # has_text would also match the CA-Projects umbrella card (it quotes the title) — key on the unique door href
    card = pg.locator('.lj-card:has(a[href="lehrjahre/yet-another-company-website/home.html"])')
    card.locator('.lj-plaque-btn').click()
    assert pg.locator('.lj-dialog[open]').count() == 1
    dtext = pg.inner_text('.lj-dialog')
    assert '🚀 ~ params:' in dtext and 'innerHTML = email' in dtext
    assert pg.locator('.lj-dialog .specimen').count() == 1
    pg.keyboard.press('Escape')
    assert pg.locator('.lj-dialog[open]').count() == 0
    assert card.locator('.lj-plaque').count() == 1

    with pg.expect_navigation():
        card.locator('.lj-door a').click()
    assert pg.url.endswith('lehrjahre/yet-another-company-website/home.html')
    pg.goto(BASE, wait_until='networkidle')

    ext = pg.evaluate("performance.getEntriesByType('resource').map(r=>r.name)"
                      ".filter(n=>!n.startsWith(location.origin))")
    assert ext == [], ext
    real = [e for e in errs if 'favicon' not in e]
    assert real == [], real

    pg.screenshot(path='hall18-desktop.png', full_page=True)
    pg.locator('.lj-card:has(a[href="lehrjahre/yet-another-company-website/home.html"])').locator('.lj-plaque-btn').click()
    pg.screenshot(path='hall18-plaque.png')
    pg.keyboard.press('Escape')
    pm = b.new_page(viewport={'width': 390, 'height': 844})
    pm.goto(BASE, wait_until='networkidle')
    pm.screenshot(path='hall18-mobile.png', full_page=True)

    ctx = b.new_context(java_script_enabled=False)
    pn = ctx.new_page()
    pn.goto(BASE)
    assert pn.eval_on_selector_all('.lj-plaque',
        "els => els.length === 18 && els.every(e => getComputedStyle(e).display !== 'none')")
    assert pn.eval_on_selector_all('.lj-plaque-btn',
        "els => els.every(e => getComputedStyle(e).display === 'none')")

    print('HALL OK')
    b.close()
```

- [ ] **Step 6: Run it**

```bash
cd $SCRATCH && /home/atakee/projects/eski-web-sayfalarim/.superpowers/sdd/lehrjahre/tools/venv/bin/python hall_check18.py
```

Expected: `HALL OK` + three screenshots.

- [ ] **Step 7: Scope check + commit**

```bash
git status --porcelain | grep -v -E '^(.M| M) (lehrjahre\.html|index\.html|README\.md)$'
```

Expected: empty. Then:

```bash
git add lehrjahre.html index.html README.md
git commit -m "Lehrjahre hall: Yet Another Company Website card with rocket-log specimen; walkable count 11"
```

---

## After the tasks (controller, not a subagent)

- Show the user: `yacw-home.png`, `yacw-confirmation.png` (the booking read back), `hall18-plaque.png`; live preview on 8765 — invite them to actually book a table. User corrects copy, then explicit push go-ahead.
- After approved push: Pages `built`, hall + all five face pages 200, SPN save hall + `home.html`.
