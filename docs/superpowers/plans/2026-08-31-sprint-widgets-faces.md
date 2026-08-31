# Sprint Widgets Faces Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Exhibit the three Sprint-2 vanilla-JS widgets as three small sealed faces — chuck-norris (40-joke baked pantry), fisheries (frozen, dead NOAA photos expected), news-tr (frozen-fed capture-day headlines, key never committed) — under one hall card with three doors; walkable count 11 → 12.

**Architecture:** Each widget is served from a local static server and captured with `capture_face.py` (scripts stripped, Bootstrap-CDN CSS and images localized, curator bar). chuck-norris then gets a curator-marked pantry script (rick-n-morty recipe, textContent). news-tr is captured from a scratch-side COPY whose hardcoded API key is swapped in from the environment — the key never touches the repo. One card, three `.lj-door` lines (plus one CSS rule so stacked doors don't spread).

**Tech Stack:** Existing toolkit (`.superpowers/sdd/lehrjahre/tools/`, venv python + playwright); vanilla-JS sources from the clone; hand-written museum HTML/CSS.

**Spec:** `docs/superpowers/specs/2026-08-31-sprint-widgets-faces-design.md`

## Global Constraints

- Sealed NEW artifacts ×3: zero external requests at view time; zero live external links; dead externals carry `data-original`. Seal after any hand-edit: `bash .superpowers/sdd/lehrjahre/tools/seal_check.sh lehrjahre/<face>` → `SEALED` + `grep -rn sourceMappingURL lehrjahre/<face>/` → nothing.
- **The NewsAPI key appears NOWHERE in the museum repo** — not in code, commits, specimens, README, reports, or scratch files inside the repo. It is read programmatically from the private clone or env, used only against a scratch-side copy, and never echoed. Before every commit touching news-tr: `git grep -I 98134c -- .` (tracked+staged) AND `grep -rI 98134c lehrjahre/` → both empty.
- chuck-norris pantry script: curator-marked, textContent-only, fetches nothing, the ONLY script on that face. fisheries and news-tr faces: zero `<script>` tags.
- Only these paths change: `lehrjahre/chuck-norris/**`, `lehrjahre/fisheries/**`, `lehrjahre/news-tr/**` (new), `assets/lehrjahre/sprint-widgets.png` + `sprint-widgets-2.png` (new), and in Task 4 only: `lehrjahre.html`, `index.html`, `assets/museum.css`, `README.md`.
- Commits: simple messages, **no Claude signature / no Co-Authored-By**. Do NOT push — user previews first.
- Serve repo on 8765 for tests (check if running); kill widget dev servers by PID only (`ss -tlnp | grep <port>`), never `pkill -f`.

`$VPY` = `.superpowers/sdd/lehrjahre/tools/venv/bin/python`
`$SCRATCH` = `/tmp/claude-1000/-home-atakee-projects-eski-web-sayfalarim/7eaa4ca0-c678-4550-9f5a-b30442fa5a16/tmp`
`$P2` = `.superpowers/sdd/lehrjahre/repos/CA-Projects-/Project-2/Sprint-2`
Capture tool flags (argparse-verified): `--base --routes --out --backlink --exhibit-title --settle-ms --dead-pattern`.

---

### Task 1: chuck-norris face (capture + joke pantry)

**Files:**
- Create: `lehrjahre/chuck-norris/` (via tool + pantry), `assets/lehrjahre/sprint-widgets.png`
- Test: `$SCRATCH/chuck_check.py`

**Interfaces:**
- Produces: door URL `lehrjahre/chuck-norris/index.html`; tile thumbnail `assets/lehrjahre/sprint-widgets.png`. The joke container is `document.getElementById('card-container')` (from the source's createCard).

- [ ] **Step 1: Serve + capture.** From repo root:

```bash
(cd ".superpowers/sdd/lehrjahre/repos/CA-Projects-/Project-2/Sprint-2/Extra with Ajax/ChuckNorris" && python3 -m http.server 4018 >/dev/null 2>&1 &)
sleep 1; curl -s -o /dev/null -w '%{http_code}\n' http://localhost:4018/index.html   # 200
$VPY .superpowers/sdd/lehrjahre/tools/capture_face.py \
  --base http://localhost:4018 --routes / \
  --out lehrjahre/chuck-norris \
  --backlink ../../lehrjahre.html \
  --exhibit-title "Daily Wisdom by Chuck Norris (2022)" \
  --settle-ms 4000
```

Kill the 4018 server by PID. Sanity: `grep -o 'card-container' lehrjahre/chuck-norris/index.html | wc -l` ≥ 1 and the page contains a nonempty joke (`grep -c 'Chuck' lehrjahre/chuck-norris/index.html` ≥ 1 is NOT guaranteed — check visually that the container div has text; if empty, re-capture with `--settle-ms 8000`).

- [ ] **Step 2: Stock 40 jokes.** Write `$SCRATCH/stock_jokes.py`:

```python
import json, pathlib, sys, time, urllib.request

UA = {'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 '
                    '(KHTML, like Gecko) Chrome/126.0 Safari/537.36'}
jokes, seen, tries = [], set(), 0
while len(jokes) < 40 and tries < 150:
    tries += 1
    try:
        with urllib.request.urlopen(urllib.request.Request(
                'https://api.chucknorris.io/jokes/random', headers=UA), timeout=30) as r:
            v = json.load(r)['value']
    except Exception:
        time.sleep(2)
        continue
    if v not in seen:
        seen.add(v)
        jokes.append(v)
    time.sleep(0.4)
assert len(jokes) == 40, f'only {len(jokes)} jokes after {tries} tries'
pathlib.Path(sys.argv[1]).write_text(
    json.dumps(jokes, ensure_ascii=False).replace('</', '<\\/'), encoding='utf-8')
print(len(jokes), 'jokes stocked')
```

Run: `$VPY $SCRATCH/stock_jokes.py $SCRATCH/jokes.json` → `40 jokes stocked`. (Capture-time network moment; nothing after fetches.)

- [ ] **Step 3: Inject the pantry.** Write `$SCRATCH/inject_jokes.py` and run `$VPY $SCRATCH/inject_jokes.py $SCRATCH/jokes.json`:

```python
import pathlib, sys

stash = pathlib.Path(sys.argv[1]).read_text(encoding='utf-8')
page_path = pathlib.Path('lehrjahre/chuck-norris/index.html')
page = page_path.read_text(encoding='utf-8')
assert page.count('</body>') == 1

script = """<script>
/* Museum pantry — a curator addition, stocked once at capture time
   (2026-08-31, 40 jokes) from the public keyless Chuck Norris API.
   The exhibit makes no network requests. Served with textContent —
   the original createCard used innerHTML and is retired to the plaque. */
(function () {
  var PANTRY = %s;
  var card = document.getElementById('card-container');
  if (!card || !PANTRY.length) return;
  card.textContent = PANTRY[Math.floor(Math.random() * PANTRY.length)];
})();
</scr""" + """ipt>
"""
page = page.replace('</body>', script % stash + '</body>')
page_path.write_text(page, encoding='utf-8')
print('pantry injected')
```

- [ ] **Step 4: Seal.** `bash .superpowers/sdd/lehrjahre/tools/seal_check.sh lehrjahre/chuck-norris` → `SEALED`; `grep -rn sourceMappingURL lehrjahre/chuck-norris/` → nothing; `grep -c '<script' lehrjahre/chuck-norris/index.html` → 1 (the pantry only).

- [ ] **Step 5: Test.** Write `$SCRATCH/chuck_check.py`, run with `$VPY` from `$SCRATCH` (repo on 8765):

```python
from playwright.sync_api import sync_playwright

B = 'http://localhost:8765/lehrjahre/chuck-norris/index.html'

with sync_playwright() as p:
    b = p.chromium.launch()
    pg = b.new_page(viewport={'width': 1280, 'height': 900})
    errs = []
    pg.on('console', lambda m: errs.append(m.text) if m.type == 'error' else None)
    pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.goto(B, wait_until='networkidle')

    assert pg.locator('.curator-bar').count() == 1
    ext = pg.evaluate("performance.getEntriesByType('resource').map(r=>r.name)"
                      ".filter(n=>!n.startsWith(location.origin))")
    assert ext == [], ext

    def joke():
        return pg.text_content('#card-container').strip()
    seen = {joke()}
    assert '' not in seen
    # no element injection possible: container has no child elements
    assert pg.eval_on_selector('#card-container', 'e => e.children.length') == 0
    for _ in range(5):
        if len(seen) >= 2:
            break
        pg.reload(wait_until='networkidle')
        seen.add(joke())
    assert len(seen) >= 2, 'pantry served the same joke on 6 visits'

    real = [e for e in errs if 'favicon' not in e]
    assert real == [], real
    pg.screenshot(path='chuck-a.png')

    ctx = b.new_context(java_script_enabled=False)
    pn = ctx.new_page()
    pn.goto(B)
    assert pn.text_content('#card-container').strip() != ''  # frozen capture-day joke
    print('CHUCK OK')
    b.close()
```

Expected: `CHUCK OK`.

- [ ] **Step 6: Thumbnail** (640px):

```bash
$VPY - <<'EOF'
from PIL import Image
im = Image.open('/tmp/claude-1000/-home-atakee-projects-eski-web-sayfalarim/7eaa4ca0-c678-4550-9f5a-b30442fa5a16/tmp/chuck-a.png')
im.thumbnail((640, 10000))
im.save('assets/lehrjahre/sprint-widgets.png')
print(im.size)
EOF
```

- [ ] **Step 7: Scope + commit.** `git status --porcelain | grep -v -E '^\?\? (lehrjahre/chuck-norris/|assets/lehrjahre/sprint-widgets\.png)'` → empty, then:

```bash
git add lehrjahre/chuck-norris assets/lehrjahre/sprint-widgets.png
git commit -m "Lehrjahre: Daily Wisdom by Chuck Norris captured with 40-joke pantry"
```

---

### Task 2: fisheries face (frozen; NOAA image reality check)

**Files:**
- Create: `lehrjahre/fisheries/` (via tool), `assets/lehrjahre/sprint-widgets-2.png`
- Test: `$SCRATCH/fish_check.py`

**Interfaces:**
- Produces: door URL `lehrjahre/fisheries/index.html`; plaque shot `assets/lehrjahre/sprint-widgets-2.png`. First species in the data: "Crimson Jobfish".

- [ ] **Step 1: Probe the NOAA image host** (decides the capture flags):

```bash
curl -sI --max-time 15 -o /dev/null -w '%{http_code}\n' "https://origin-east-01-drupal-fishwatch.woc.noaa.gov/sites/default/files/4_9.jpg" || echo DEAD
```

`200` → images alive, capture WITHOUT `--dead-pattern` (tool localizes them; expect a big but bounded download). Anything else (000/4xx/5xx/DEAD) → images dead, add `--dead-pattern woc.noaa.gov` so they become intended dead references with `data-original`. Record which branch ran.

- [ ] **Step 2: Serve + capture.**

```bash
(cd .superpowers/sdd/lehrjahre/repos/CA-Projects-/Project-2/Sprint-2/Fisheries_card_format && python3 -m http.server 4019 >/dev/null 2>&1 &)
sleep 1
$VPY .superpowers/sdd/lehrjahre/tools/capture_face.py \
  --base http://localhost:4019 --routes / \
  --out lehrjahre/fisheries \
  --backlink ../../lehrjahre.html \
  --exhibit-title "Fisheries browser (2022)" \
  --settle-ms 8000 \
  [--dead-pattern woc.noaa.gov   # only if Step 1 said dead]
```

Kill 4019 by PID. Sanity (single-line DOM — count occurrences, not lines): `grep -o 'Crimson Jobfish' lehrjahre/fisheries/index.html | wc -l` ≥ 1; species card count `grep -o 'Species Name\|card-img-top' lehrjahre/fisheries/index.html | wc -l` printed for the report.

- [ ] **Step 3: Seal.** `seal_check.sh lehrjahre/fisheries` → `SEALED`; sourcemap grep → nothing; `grep -c '<script' lehrjahre/fisheries/index.html` → 0.

- [ ] **Step 4: Test.** `$SCRATCH/fish_check.py`:

```python
from playwright.sync_api import sync_playwright

B = 'http://localhost:8765/lehrjahre/fisheries/index.html'

with sync_playwright() as p:
    b = p.chromium.launch()
    pg = b.new_page(viewport={'width': 1280, 'height': 900})
    pg.goto(B, wait_until='networkidle')
    assert pg.locator('.curator-bar').count() == 1
    body = pg.inner_text('body')
    assert 'Crimson Jobfish' in body
    ext = pg.evaluate("performance.getEntriesByType('resource').map(r=>r.name)"
                      ".filter(n=>!n.startsWith(location.origin))")
    assert ext == [], ext
    # images: either all local-loaded, or all dead-by-design (no live NOAA refs either way)
    stats = pg.eval_on_selector_all('img',
        "els => ({total: els.length,"
        " loaded: els.filter(i=>i.complete&&i.naturalWidth>0).length,"
        " extsrc: els.filter(i=>i.src.includes('noaa.gov')||i.src.startsWith('http')&&!i.src.startsWith(location.origin)).length})")
    assert stats['extsrc'] == 0, stats
    print('img stats:', stats)
    pg.screenshot(path='fish.png')
    print('FISH OK')
    b.close()
```

Expected: `FISH OK` + the img stats line in the report (loaded==total if NOAA lived; loaded≈0 if dead — both acceptable, must match Step 1's branch).

- [ ] **Step 5: Plaque shot** (640px): same PIL recipe as Task 1 Step 6 but open `fish.png` → save `assets/lehrjahre/sprint-widgets-2.png`.

- [ ] **Step 6: Scope + commit.** Scope grep (allowed: `lehrjahre/fisheries/`, `assets/lehrjahre/sprint-widgets-2.png`) → empty, then:

```bash
git add lehrjahre/fisheries assets/lehrjahre/sprint-widgets-2.png
git commit -m "Lehrjahre: fisheries browser captured as frozen face"
```

---

### Task 3: news-tr face (frozen-fed; key contingency)

**Files:**
- Create: `lehrjahre/news-tr/` (via tool, from a scratch-side patched copy)
- Test: `$SCRATCH/news_check.py`

**Interfaces:**
- Produces: door URL `lehrjahre/news-tr/index.html`.
- **Key protocol (binding):** the key is read programmatically, never echoed, never written inside the repo. All patched copies live in `$SCRATCH`.

- [ ] **Step 1: Extract and probe the committed key** (from the private clone; do not print it):

```bash
KEY=$(grep -oP '(?<=apiKey = ")[0-9a-f]{32}' ".superpowers/sdd/lehrjahre/repos/CA-Projects-/Project-2/Sprint-2/Extra with Ajax/News_api_TR/main.js")
test -n "$KEY" && echo "key extracted (not shown)"
curl -s --max-time 20 "https://newsapi.org/v2/top-headlines?country=tr&pageSize=5&apiKey=$KEY" -o $SCRATCH/news_probe.json -w '%{http_code}\n'
python3 -c "import json;d=json.load(open('$SCRATCH/news_probe.json'));print(d.get('status'), d.get('totalResults', d.get('code')))"
```

Branches:
- HTTP 200 + `ok` with totalResults > 0 → **key alive**: proceed, and note for the final report: *the committed key still works, i.e. it was never rotated — the user must rotate it after this capture*.
- 200/ok but totalResults == 0 → key alive, endpoint empty (NewsAPI thinned `country=` data): proceed; the widget will render its empty state — capture that honestly, and flag it for the user preview.
- 401/426/429 or `error` → **STOP THIS TASK**: report status BLOCKED with the API's error code (never the key) so the controller can ask the user for a fresh key; do not improvise.

- [ ] **Step 2: Scratch copy + key injection.**

```bash
cp -r ".superpowers/sdd/lehrjahre/repos/CA-Projects-/Project-2/Sprint-2/Extra with Ajax/News_api_TR" $SCRATCH/news-widget
python3 - "$KEY" <<'EOF'
import pathlib, re, sys
p = pathlib.Path('/tmp/claude-1000/-home-atakee-projects-eski-web-sayfalarim/7eaa4ca0-c678-4550-9f5a-b30442fa5a16/tmp/news-widget/main.js')
t = p.read_text(encoding='utf-8')
t2 = re.sub(r'(?<=apiKey = ")[0-9a-f]{32}', sys.argv[1], t)
p.write_text(t2, encoding='utf-8')
print('key set in scratch copy')
EOF
```

(If Step 1 used the committed key this is a no-op rewrite; if the controller later supplies a fresh key, re-run Step 2 with `KEY=<fresh>` — same path either way.)

- [ ] **Step 3: Serve scratch copy + capture.**

```bash
(cd $SCRATCH/news-widget && python3 -m http.server 4020 >/dev/null 2>&1 &)
sleep 1
$VPY .superpowers/sdd/lehrjahre/tools/capture_face.py \
  --base http://localhost:4020 --routes / \
  --out lehrjahre/news-tr \
  --backlink ../../lehrjahre.html \
  --exhibit-title "Daily News From Turkey (2022)" \
  --settle-ms 8000
```

Kill 4020 by PID.

- [ ] **Step 4: Key-absence proof + seal.**

```bash
grep -rI "$KEY" lehrjahre/ && echo "KEY LEAKED - STOP" || echo "no key in faces"
git grep -I 98134c -- . || echo "no key prefix tracked"
bash .superpowers/sdd/lehrjahre/tools/seal_check.sh lehrjahre/news-tr
grep -rn sourceMappingURL lehrjahre/news-tr/ || echo "no sourcemaps"
grep -c '<script' lehrjahre/news-tr/index.html   # expect 0
```

Expected: `no key in faces`, `no key prefix tracked`, `SEALED`, `no sourcemaps`, `0`. A key leak is a hard stop — remove before any commit.

- [ ] **Step 5: Test.** Write `$SCRATCH/news_check.py` and run with `$VPY` from `$SCRATCH`:

```python
from playwright.sync_api import sync_playwright

B = 'http://localhost:8765/lehrjahre/news-tr/index.html'

with sync_playwright() as p:
    b = p.chromium.launch()
    pg = b.new_page(viewport={'width': 1280, 'height': 900})
    errs = []
    pg.on('console', lambda m: errs.append(m.text) if m.type == 'error' else None)
    pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.goto(B, wait_until='networkidle')

    assert pg.locator('.curator-bar').count() == 1
    assert pg.locator('script').count() == 0  # frozen: no scripts at all
    ext = pg.evaluate("performance.getEntriesByType('resource').map(r=>r.name)"
                      ".filter(n=>!n.startsWith(location.origin))")
    assert ext == [], ext
    extsrc = pg.eval_on_selector_all('img',
        "els => els.filter(i => i.src.startsWith('http') && !i.src.startsWith(location.origin)).length")
    assert extsrc == 0, extsrc
    body = pg.inner_text('body')
    assert len(body) >= 200, len(body)  # headlines present (skip this assert on the empty-state branch; note it instead)

    real = [e for e in errs if 'favicon' not in e and 'Failed to load resource' not in e]
    assert real == [], real
    pg.screenshot(path='news.png')
    print('NEWS OK')
    b.close()
```

Expected: `NEWS OK`. On the empty-state branch, drop the length assert, confirm no errors, and record the emptiness in the report.

- [ ] **Step 6: Scope + commit.**

```bash
git add lehrjahre/news-tr
git commit -m "Lehrjahre: Daily News From Turkey captured as frozen front page"
```

---

### Task 4: Hall card (three doors), counts 11 → 12, CSS rule, README

**Files:**
- Modify: `lehrjahre.html` (new card after the Yet Another Company Website card; count word), `index.html` (count + chip), `assets/museum.css` (one rule), `README.md`
- Test: `$SCRATCH/hall_check19.py`

**Interfaces:**
- Consumes: door URLs `lehrjahre/chuck-norris/index.html`, `lehrjahre/fisheries/index.html`, `lehrjahre/news-tr/index.html`; thumbnails `assets/lehrjahre/sprint-widgets.png` (tile) and `sprint-widgets-2.png` (in-plaque); specimen source `$P2/Extra with Ajax/ChuckNorris/main.js` lines 22–26, md5 `22c38800f32b4657646a67be06dd32b9`.

- [ ] **Step 1: CSS rule.** In `assets/museum.css`, append inside the `/* lehrjahre */` block:

```css
.lj-door + .lj-door { margin-top: 0; }
```

- [ ] **Step 2: Insert the card.** Unique anchor: the line `<p class="lj-door"><a class="go" href="lehrjahre/yet-another-company-website/home.html">Enter the exhibit →</a></p>` occurs once inside the Yet Another Company Website card (it also appears once as that card's shot link — anchor on the `.lj-door` line specifically); the new card goes after that card's closing `</div>`, before MaHalle v1. Markup:

```html
    <div class="lj-card">
      <span class="lj-badge">walkable · three doors</span>
      <h3>The sprint widgets <span class="lj-date">Dec 2022</span></h3>
      <div class="lj-shot"><a href="lehrjahre/chuck-norris/index.html"><img src="assets/lehrjahre/sprint-widgets.png" alt="Daily Wisdom by Chuck Norris, one joke in a card" loading="lazy"></a></div>
      <p class="lj-hook">Chuck Norris wisdom, a fisheries browser, Turkish news — one sprint, three doors.</p>
      <div class="lj-plaque">
        <p>Sprint exercises: each of these was an afternoon, a fetch call,
        and a div to put the result in. The museum gives them three small
        doors. Behind the first, Chuck Norris dispenses wisdom from a pantry
        of forty jokes stocked on capture day — a different one each visit.
        Behind the second, a browser of NOAA fish species whose photos sank
        with the government image server that hosted them — names, biology
        and habitat swim on. Behind the third, the Turkish headlines of
        capture day, kept like a newspaper on the day the presses stopped.</p>
        <div class="lj-shot"><img src="assets/lehrjahre/sprint-widgets-2.png" alt="The fisheries browser, species cards" loading="lazy"></div>
        <div class="specimen-label">Specimen — ChuckNorris/main.js, createCard</div>
        <pre class="specimen"><code>function createCard(wisdom) {
    const cardContainer = document.getElementById("card-container");
    cardContainer.innerHTML = "";
    cardContainer.innerHTML = wisdom.value;
}</code></pre>
        <p>Empty the container, then fill it — belt and braces, in two
        consecutive lines. The pantry that serves the jokes now is curator
        code and uses textContent; Chuck's original createCard is retired to
        this plaque.</p>
        <p class="lj-charm">Two of the three titles promise dailiness — "Daily Wisdom by Chuck Norris", "Daily News From Turkey" — from pages that never saw a second day.</p>
      </div>
      <button class="lj-plaque-btn" type="button">Read the plaque →</button>
      <p class="lj-door"><a class="go" href="lehrjahre/chuck-norris/index.html">Daily Wisdom by Chuck Norris →</a></p>
      <p class="lj-door"><a class="go" href="lehrjahre/fisheries/index.html">The fisheries browser →</a></p>
      <p class="lj-door"><a class="go" href="lehrjahre/news-tr/index.html">Daily News From Turkey →</a></p>
    </div>
```

**Adjust the plaque to reality:** if Task 2 found the NOAA images ALIVE, replace the fisheries sentence with "Behind the second, a browser of NOAA fish species, photos and all — the census of an American ocean, mirrored." If Task 3 shipped the empty state, replace the news sentence with "Behind the third, the day NewsAPI had no headlines left for Turkey — an empty front page, kept honestly." (Controller passes the actual outcomes in the dispatch.)

- [ ] **Step 2b: Teach the modal about multiple doors.** The hall's inline wiring script clones only the first `.lj-door` into the dialog. In `lehrjahre.html` (~line 460), replace exactly:

```javascript
    var door = card.querySelector('.lj-door');
    if (door) slot.appendChild(door.cloneNode(true));
```

with:

```javascript
    card.querySelectorAll('.lj-door').forEach(function (d) { slot.appendChild(d.cloneNode(true)); });
```

(Behavior for every existing single-door card is unchanged.)

- [ ] **Step 3: Specimen fidelity.** Same md5 recipe as prior cycles, anchored on `ChuckNorris/main.js, createCard</div>`; expected `22c38800f32b4657646a67be06dd32b9` (= `sed -n '22,26p' "$P2/Extra with Ajax/ChuckNorris/main.js" | md5sum`).

- [ ] **Step 4: Counts.** `Eleven of them are walkable` → `Twelve of them are walkable` (lehrjahre.html AND index.html); `<span class="chip">11 walkable faces</span>` → `12 walkable faces` (index.html). Then `grep -rn -i "eleven of them\|11 walkable" *.html` → no hits.

- [ ] **Step 5: README.** In `### 7.`, after the Yet Another Company Website bullet:

```markdown
- 2026-08-31: the sprint widgets — three small faces behind one card:
  `lehrjahre/chuck-norris/` (40 jokes stocked at capture from the keyless
  public API; a curator-marked pantry script — the face's only script —
  serves one per visit with `textContent`), `lehrjahre/fisheries/`
  (frozen render of the hardcoded NOAA species data; photo fate as found
  at capture, dead links kept in `data-original`), and `lehrjahre/news-tr/`
  (capture-day Turkish headlines, fetched once with the owner's own API
  key — used at capture only, never committed; the exhibit holds no key
  and makes no requests). Walkable count: twelve.
```

(If fisheries images were alive or news shipped empty, adjust the parenthetical facts to match — the README never states anything false.)

- [ ] **Step 6: Hall test.** `$SCRATCH/hall_check19.py` — the cycle-4 hall test with: counts 19 (cards/plaques/buttons/hooks), `'Twelve of them are walkable'`, card locator `.lj-card:has(a[href="lehrjahre/chuck-norris/index.html"])`, dialog text asserts `'createCard' in dtext` and `'cardContainer.innerHTML' in dtext`, `.lj-dialog .specimen` count 1, **all three doors present in the open dialog** (`pg.locator('.lj-dialog .lj-door').count() == 3` — the wiring clones every `.lj-door`; verify, and if it clones only the first, that is a FINDING to fix in the hall wiring script, not to paper over), Escape-close returns plaque, door №2 navigates to `lehrjahre/fisheries/index.html`, zero external resources, JS-off degrade (19 inline plaques, buttons hidden), desktop/plaque/mobile screenshots `hall19-*.png`. Expected: `HALL OK`.

- [ ] **Step 7: Scope + commit.**

```bash
git status --porcelain | grep -v -E '^(.M| M) (lehrjahre\.html|index\.html|assets/museum\.css|README\.md)$'
```

→ empty, then:

```bash
git add lehrjahre.html index.html assets/museum.css README.md
git commit -m "Lehrjahre hall: sprint widgets card, three doors; walkable count 12"
```

---

## After the tasks (controller, not a subagent)

- Surface to the user: the key finding from Task 3 Step 1 (un-rotated key → rotate now; or dead key → good news, rotation happened), screenshots (`chuck-a.png`, `fish.png`, `news.png`, `hall19-plaque.png`), preview URLs on 8765. User corrects copy, then explicit push go-ahead.
- After approved push: Pages `built`, hall + three faces 200, SPN save hall + three doors.
