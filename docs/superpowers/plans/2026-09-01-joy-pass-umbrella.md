# Joy-Pass + Umbrella Rewrite Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Feed the starving movie-db face (capture its login-locked grid + one detail page with real TMDb data) and rewrite the stale CA-Projects umbrella card — the closing cycle of the wing-extension program.

**Architecture:** Re-clone the public movie-db repo, patch a scratch-side copy only (dummy Firebase env + ProtectedRoute bypass), run it so the app fetches real TMDb data with its own committed key, capture ALL six routes into scratch, then copy only the two NEW pages (grid + first movie's detail) with their assets into the existing face and hand-wire the dead "Movies" anchors. Hall: movie-db card gains a sentence/badge/shot; umbrella card gets its overdue rewrite. No walkable-count changes.

**Tech Stack:** Existing toolkit (capture_face.py + seal_check.sh, venv playwright); CRA/React 18 app from the public clone; hand-written museum HTML.

**Spec:** `docs/superpowers/specs/2026-09-01-joy-pass-umbrella-design.md`

## Global Constraints

- The existing six movie-db pages (`index/about/login/register` + their assets) stay **byte-identical except** the Movies-anchor wiring edit (`href="#"` → `href="movies.html"` on anchors whose `data-original` ends in `/movies`; the `data-original` stays).
- New pages sealed like all faces: zero external requests at view time, zero `<script>` tags, dead externals carry `data-original`, no `srcset`/`<noscript>`/`sourceMappingURL`.
- **Neither key enters the repo**: before every commit run `git grep -I b6bd7a -- .` and `grep -rI b6bd7a lehrjahre/` (TMDb) plus `git grep -I 98134c -- .` (NewsAPI) → all empty. The dummy Firebase values live only in the scratch clone and are never committed either.
- Only these paths change: `lehrjahre/movie-db/**`, `assets/lehrjahre/movie-db-2.png` (new), and in Task 2 only: `lehrjahre.html`, `README.md`.
- Commits: simple messages, **no Claude signature / no Co-Authored-By**. Do NOT push — user previews first.
- Kill dev servers by PID only (`ss -tlnp | grep 4021`); repo test server on 8765 (check; start in background only if absent).

`$VPY` = `.superpowers/sdd/lehrjahre/tools/venv/bin/python`
`$SCRATCH` = `/tmp/claude-1000/-home-atakee-projects-eski-web-sayfalarim/cycle6-scratch` (`mkdir -p` it; export the variable before use)
`$CLONE` = `.superpowers/sdd/lehrjahre/repos/movie-db` (created in Task 1)
Capture tool flags (argparse-verified): `--base --routes --out --backlink --exhibit-title --settle-ms --dead-pattern`.

---

### Task 1: Feed movie-db — capture grid + detail, wire the doors

**Files:**
- Create: `lehrjahre/movie-db/movies.html`, `lehrjahre/movie-db/movie-detail.html`, new files under `lehrjahre/movie-db/assets/`, `assets/lehrjahre/movie-db-2.png`
- Modify: `lehrjahre/movie-db/{index,about,login,register}.html` (Movies-anchor wiring ONLY)
- Test: `$SCRATCH/mdb_check.py`

**Interfaces:**
- Produces: `lehrjahre/movie-db/movies.html` (Task 2's plaque references the fed grid) and `assets/lehrjahre/movie-db-2.png` (Task 2's second plaque shot). Wiring contract: every anchor with `data-original` ending `/movies` on the four old pages points at `movies.html`.

- [ ] **Step 1: Clone (public repo) + install.**

```bash
git clone --depth 1 https://github.com/atakee72/movie-db .superpowers/sdd/lehrjahre/repos/movie-db
cd .superpowers/sdd/lehrjahre/repos/movie-db && npm install && cd -
```

- [ ] **Step 2: Scratch-side patches (never committed).**
  1. Dummy Firebase env — write `$CLONE/.env.local` (well-formed dummies; `getAuth` only format-checks the key):

```
REACT_APP_apiKey=AIzaSyDUMMYDUMMYDUMMYDUMMYDUMMYDUMMY123
REACT_APP_authDomain=museum-dummy.firebaseapp.com
REACT_APP_projectId=museum-dummy
REACT_APP_storageBucket=museum-dummy.appspot.com
REACT_APP_messagingSenderId=000000000000
REACT_APP_appId=1:000000000000:web:0000000000000000000000
```

  (Match the exact `REACT_APP_*` names `src/config/firebaseConfig.js` reads — open it and adjust names if they differ.)
  2. ProtectedRoute bypass — open the protected-route component (per inventory: `src/components/ProtectedRoute.js`, the one with the Turkish Option-1/2/3 comment) and make it render its protected content unconditionally (e.g. `return children;` or `return <Outlet />;` — match whichever pattern the file actually uses). Minimal edit, scratch clone only; paste the diff into your report.
  3. `echo ".env.local" check`: confirm the clone is inside the git-ignored `.superpowers/` tree (`git check-ignore .superpowers/sdd/lehrjahre/repos/movie-db` → prints the path) — nothing here can be committed by accident.

- [ ] **Step 3: Run + capture all six routes into scratch.**

```bash
(cd .superpowers/sdd/lehrjahre/repos/movie-db && PORT=4021 BROWSER=none npm start >/dev/null 2>&1 &)
# wait until it answers, then confirm the grid is FED before capturing:
curl -s -o /dev/null -w '%{http_code}\n' http://localhost:4021
```

Open `http://localhost:4021/movies` with venv playwright (headless, 6s settle) and confirm ≥10 movie cards render with poster images; note the FIRST card's `/movies/<id>` URL — that id is `$MID` below. Then:

```bash
$VPY .superpowers/sdd/lehrjahre/tools/capture_face.py \
  --base http://localhost:4021 \
  --routes / /login /register /about /movies /movies/$MID \
  --out $SCRATCH/mdb-fed \
  --backlink ../../lehrjahre.html \
  --exhibit-title "movie-db (Apr 2023)" \
  --settle-ms 6000
```

Kill 4021 by PID. Inspect `$SCRATCH/mdb-fed/`: note the filenames produced for `/movies` (expected `movies.html`) and for `/movies/$MID` (tool derives it from the path — whatever it is, that file is the detail page).

- [ ] **Step 4: Transplant the two new pages.**
  1. Copy `$SCRATCH/mdb-fed/movies.html` → `lehrjahre/movie-db/movies.html`; copy the detail file → `lehrjahre/movie-db/movie-detail.html`.
  2. Copy every asset file the two pages reference from `$SCRATCH/mdb-fed/assets/` into `lehrjahre/movie-db/assets/` (hashed names; skip files already present — identical hash means identical content, never overwrite an existing file with different content: if a name collides with different bytes, STOP and report).
  3. In `movies.html`: rewrite the grid's link to the captured detail page to `movie-detail.html` (it currently points at the tool's filename); confirm all OTHER movie-card links are dead (`href="#"` + `data-original`).
  4. In both new pages: the nav links to `/`, `/login`, `/register`, `/about` were captured in the same run, so they already read `index.html`/`login.html`/`register.html`/`about.html` — verify with grep; hand-fix any that came out dead.
  5. Wire the old pages: in `index.html`, `about.html`, `login.html`, `register.html`, replace `href="#"` with `href="movies.html"` ONLY on anchors whose `data-original` ends `/movies` (index.html has two: nav + "Find your favourite movie"). No other bytes change — verify with `git diff --stat` (4 files, minimal churn).

- [ ] **Step 5: Seal + key proof.**

```bash
bash .superpowers/sdd/lehrjahre/tools/seal_check.sh lehrjahre/movie-db
grep -rn sourceMappingURL lehrjahre/movie-db/ || echo "no sourcemaps"
grep -c '<script' lehrjahre/movie-db/movies.html lehrjahre/movie-db/movie-detail.html   # 0 each
grep -rI b6bd7a lehrjahre/ || echo "no tmdb key"
git grep -I b6bd7a -- . || echo "no tmdb key tracked"
```

Expected: `SEALED`, `no sourcemaps`, `0` `0`, `no tmdb key`, `no tmdb key tracked`.

- [ ] **Step 6: Test.** Write `$SCRATCH/mdb_check.py`, run with `$VPY` from `$SCRATCH` (repo on 8765):

```python
from playwright.sync_api import sync_playwright

F = 'http://localhost:8765/lehrjahre/movie-db/'

with sync_playwright() as p:
    b = p.chromium.launch()
    pg = b.new_page(viewport={'width': 1280, 'height': 900})
    errs = []
    pg.on('console', lambda m: errs.append(m.text) if m.type == 'error' else None)
    pg.on('pageerror', lambda e: errs.append(str(e)))

    # fed grid: >=10 cards, posters load locally, zero external requests
    pg.goto(F + 'movies.html', wait_until='networkidle')
    assert pg.locator('.curator-bar').count() == 1
    imgs = pg.eval_on_selector_all('img',
        "els => ({n: els.length, ok: els.filter(i=>i.complete&&i.naturalWidth>0).length,"
        " ext: els.filter(i=>i.src.startsWith('http')&&!i.src.startsWith(location.origin)).length})")
    assert imgs['n'] >= 10 and imgs['ext'] == 0, imgs
    assert imgs['ok'] >= 10, imgs  # posters actually shipped
    ext = pg.evaluate("performance.getEntriesByType('resource').map(r=>r.name)"
                      ".filter(n=>!n.startsWith(location.origin))")
    assert ext == [], ext
    pg.screenshot(path='mdb-grid.png')

    # grid -> detail (the one wired card) and detail is sealed too
    with pg.expect_navigation():
        pg.click('a[href="movie-detail.html"]')
    assert pg.url.endswith('movie-detail.html')
    pg.wait_for_load_state('networkidle')
    ext = pg.evaluate("performance.getEntriesByType('resource').map(r=>r.name)"
                      ".filter(n=>!n.startsWith(location.origin))")
    assert ext == [], ext
    pg.screenshot(path='mdb-detail.png')

    # old pages: Movies anchor now navigates; pages otherwise unchanged
    pg.goto(F + 'index.html', wait_until='networkidle')
    with pg.expect_navigation():
        pg.click('a[href="movies.html"]')
    assert pg.url.endswith('movies.html')

    real = [e for e in errs if 'favicon' not in e and 'Failed to load resource' not in e]
    assert real == [], real
    print('MDB OK')
    b.close()
```

- [ ] **Step 7: Plaque shot.** 640px PNG from `mdb-grid.png`:

```bash
$VPY - <<EOF
from PIL import Image
im = Image.open('$SCRATCH/mdb-grid.png')
im.thumbnail((640, 10000))
im.save('assets/lehrjahre/movie-db-2.png')
print(im.size)
EOF
```

- [ ] **Step 8: Scope + commit.**

```bash
git status --porcelain | grep -v -E '^(\?\? (lehrjahre/movie-db/|assets/lehrjahre/movie-db-2\.png)|.M lehrjahre/movie-db/(index|about|login|register)\.html| M lehrjahre/movie-db/(index|about|login|register)\.html)'
```

Expected: empty. Then:

```bash
git add lehrjahre/movie-db assets/lehrjahre/movie-db-2.png
git commit -m "movie-db: fed grid and detail page captured; Movies door wired"
```

---

### Task 2: Hall updates — movie-db card fed, umbrella rewritten; README

**Files:**
- Modify: `lehrjahre.html` (movie-db card ~line 319; CA-Projects umbrella card ~line 50), `README.md` (`### 7.` bullet)
- Test: `$SCRATCH/hall_check_c6.py`

**Interfaces:**
- Consumes: `lehrjahre/movie-db/movies.html` and `assets/lehrjahre/movie-db-2.png` from Task 1.

- [ ] **Step 1: movie-db card.** Three exact edits:
  1. Badge: `<span class="lj-badge">walkable · revived</span>` (the movie-db card's, ~line 320 — it is the only `walkable · revived` badge) → `<span class="lj-badge">walkable · revived · fed</span>`
  2. In its plaque, extend the paragraph: `…The accounts were never real; nothing\n        here can log in.</p>` → `…The accounts were never real; nothing\n        here can log in. In 2026 the museum went further and carried the\n        movie hall door off its hinges: the grid behind the login now hangs\n        here too, fed with real posters on capture day.</p>`
  3. Immediately after that `</p>` insert:

```html
        <div class="lj-shot"><img src="assets/lehrjahre/movie-db-2.png" alt="The movie grid, fed: real posters on capture day" loading="lazy"></div>
```

- [ ] **Step 2: Umbrella rewrite.** In the CA-Projects card (~lines 55–65), replace the plaque's `<p>…</p>` AND the second-shot line — old block:

```html
        <p>The earliest surviving folder: a restaurant site named, in its own
        header, "Yet Another Company Website"; a pile of sprint exercises (Chuck
        Norris wisdom, a fisheries browser, Turkish news); and my two first React
        apps. One greets you with <b>"Hey, Ercan is learning React! :)))"</b>. The
        other browses Rick and Morty characters with a search box that searches —
        into the console, and no further: the line that would update the screen is
        commented out.</p>
        <div class="lj-shot"><img src="assets/lehrjahre/ca-projects-2.png" alt="rick-n-morty: 'Rick' typed in search, grid unchanged" loading="lazy"></div>
```

new block:

```html
        <p>The earliest surviving folder — and by now mostly a frame of empty
        hooks: the restaurant site, both first React apps and three sprint
        widgets that once lived only in this card hang in frames of their own
        across the hall. What remains uniquely here: Sprint-1's exercise pile
        ("Answers to The Exercises 19-28, if any :)"), a shopping list, a file
        honestly named deneme.html — Turkish for "trial" — and the folder's
        name itself, CA-Projects-, trailing hyphen shipped.</p>
```

(`assets/lehrjahre/ca-projects-2.png` stays on disk, just unreferenced. The charm line and everything else in the card stay.)

- [ ] **Step 3: README.** In `### 7.`, after the sprint-widgets bullet add:

```markdown
- 2026-09-01: closing pass. movie-db was fed: a scratch-side copy (dummy
  Firebase config + a curator bypass of the login gate, neither committed)
  let the app fetch real TMDb data with the key from its own source, and
  the museum captured `movies.html` (the grid, posters localized) and
  `movie-detail.html`, wiring the face's dead "Movies" links to them. No
  key ships in the exhibit. The seven other original faces were surveyed
  and left untouched — their emptiness and breakage are the exhibits. The
  CA-Projects umbrella plaque was rewritten to point at the five
  sub-exhibits promoted out of it.
```

- [ ] **Step 4: Hall test.** Write `$SCRATCH/hall_check_c6.py` and run with `$VPY` from `$SCRATCH`:

```python
from playwright.sync_api import sync_playwright

BASE = 'http://localhost:8765/lehrjahre.html'
MDB = '.lj-card:has(a[href="lehrjahre/movie-db/index.html"])'
UMB = '.lj-card:has(img[src="assets/lehrjahre/ca-projects.png"])'

with sync_playwright() as p:
    b = p.chromium.launch()
    pg = b.new_page(viewport={'width': 1280, 'height': 900})
    errs = []
    pg.on('console', lambda m: errs.append(m.text) if m.type == 'error' else None)
    pg.goto(BASE, wait_until='networkidle')

    # counts unchanged
    assert pg.locator('.lj-grid .lj-card').count() == 19
    assert 'Twelve of them are walkable' in pg.inner_text('body')

    # movie-db card: badge, new sentence, second shot in plaque
    card = pg.locator(MDB)
    assert 'walkable · revived · fed' in card.inner_text()
    card.locator('.lj-plaque-btn').click()
    dtext = pg.inner_text('.lj-dialog')
    assert 'carried the' in dtext and 'off its hinges' in dtext
    assert pg.locator('.lj-dialog img[src="assets/lehrjahre/movie-db-2.png"]').count() == 1
    pg.keyboard.press('Escape')
    assert card.locator('.lj-plaque').count() == 1

    # umbrella card: new copy in, rick-n-morty shot out, charm kept
    umb = pg.locator(UMB)
    umb.locator('.lj-plaque-btn').click()
    utext = pg.inner_text('.lj-dialog')
    assert 'frames of their own' in utext and 'trailing hyphen shipped' in utext
    assert 'sdf' in utext  # charm stayed
    assert pg.locator('.lj-dialog img[src="assets/lehrjahre/ca-projects-2.png"]').count() == 0
    pg.keyboard.press('Escape')

    ext = pg.evaluate("performance.getEntriesByType('resource').map(r=>r.name)"
                      ".filter(n=>!n.startsWith(location.origin))")
    assert ext == [], ext
    real = [e for e in errs if 'favicon' not in e]
    assert real == [], real

    pg.locator(MDB).locator('.lj-plaque-btn').click()
    pg.screenshot(path='hall-c6-mdb.png')
    pg.keyboard.press('Escape')
    pg.locator(UMB).locator('.lj-plaque-btn').click()
    pg.screenshot(path='hall-c6-umbrella.png')

    print('HALL OK')
    b.close()
```

- [ ] **Step 5: Scope + commit.**

```bash
git status --porcelain | grep -v -E '^(.M| M) (lehrjahre\.html|README\.md)$'
```

Expected: empty. Then:

```bash
git add lehrjahre.html README.md
git commit -m "Lehrjahre hall: movie-db card fed; CA-Projects umbrella rewritten"
```

---

## After the tasks (controller, not a subagent)

- Surface to the user: `mdb-grid.png`, `mdb-detail.png`, both hall plaque shots, preview URLs; remind about BOTH keys (NewsAPI rotation still pending; TMDb key sits in the public movie-db repo). User corrects copy, then explicit push go-ahead.
- After approved push: Pages `built`, live checks (movies.html 200 + no `b6bd7a` in live pages), SPN save hall + movies.html. Then delete the plan workspace — the wing-extension program is complete.
