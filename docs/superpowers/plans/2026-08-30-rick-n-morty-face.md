# rick-n-morty Face Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Promote `rick-n-morty` (CA-Projects, Project-3) to the wing's 10th walkable face with a baked-pantry character grid (60 characters stocked at capture, a random 20 served per visit), the search preserved broken, and a hall card whose specimen shows the commented-out fix.

**Architecture:** Run the CRA app locally, let it fetch its real page-1 grid, capture with the existing toolkit (scripts stripped, assets localized, curator bar). Then stock the pantry: one capture-time fetch of API pages 1–3 → 60 avatars into `lehrjahre/rick-n-morty/pantry/` + one curator-marked inline script appended to the captured `index.html` that shuffles and refills the 20 card slots per visit. Hall gains one card after my-first-react-app; walkable counts go 9 → 10.

**Tech Stack:** Existing toolkit (`.superpowers/sdd/lehrjahre/tools/`, venv python + playwright), CRA 5/React 18 app from the clone at `.superpowers/sdd/lehrjahre/repos/CA-Projects-/Project-3/rick-n-morty`, hand-written HTML/CSS/JS for the museum side.

**Spec:** `docs/superpowers/specs/2026-08-30-rick-n-morty-face-design.md`

## Global Constraints

- The face is a sealed NEW artifact: **zero external requests at view time**, zero live external links. The pantry is stocked once, at capture; the pantry script is the ONLY script on the face, inline, curator-marked, and never fetches.
- **The search stays broken.** The pantry must not wire it; the input stays inert.
- Only these paths change: create `lehrjahre/rick-n-morty/` and `assets/lehrjahre/rick-n-morty.png`; modify `lehrjahre.html` (new card, count word, one pantry sentence), `index.html` (two count sites), `README.md`. Everything else stays byte-identical — verify with `git status --porcelain`.
- Specimen text verbatim-then-escaped, no tidying (trailing spaces and indentation included).
- Seal recipe after every hand-edit to the face: `bash .superpowers/sdd/lehrjahre/tools/seal_check.sh lehrjahre/rick-n-morty` AND `grep -c sourceMappingURL lehrjahre/rick-n-morty/index.html` → 0.
- Commits: simple messages, **no Claude signature / no Co-Authored-By**. Do NOT push — user previews first.
- Serve tests with `python3 -m http.server 8765` from repo root (may already be running); toolkit venv python: `.superpowers/sdd/lehrjahre/tools/venv/bin/python` (alias `$VPY` below).

`$SCRATCH` = `/tmp/claude-1000/-home-atakee-projects-eski-web-sayfalarim/48efd0d1-7db7-47bf-b550-98f7a8711c2b/scratchpad` (create if absent)
`$CLONE` = `.superpowers/sdd/lehrjahre/repos/CA-Projects-/Project-3/rick-n-morty`

---

### Task 1: Capture the face, stock the pantry, seal it

**Files:**
- Create: `lehrjahre/rick-n-morty/index.html` (+ toolkit asset dir), `lehrjahre/rick-n-morty/pantry/*.jpeg` (60), `assets/lehrjahre/rick-n-morty.png`
- Test: `$SCRATCH/rnm_face_check.py`

**Interfaces:**
- Produces: door URL `lehrjahre/rick-n-morty/index.html` and thumbnail `assets/lehrjahre/rick-n-morty.png` — Task 2's card links exactly these. Captured DOM (from the app's source, `Cards.js`): 20 × `.flip-card`, each with `.flip-card-front img.image` and `.flip-card-back` holding `h1` (name), two `p`s (Location / Origin), a dead LEARN MORE button; search box is the page's only `input[type=text]`. First frozen character: "Rick Sanchez".

- [ ] **Step 1: Run the app.** In `$CLONE`: `npm install` (~1–2 min, no flags needed), then `PORT=4017 BROWSER=none npm start` in the background. Wait until `curl -s http://localhost:4017 | grep -q root` succeeds and give the API fetch a moment (the capture settle covers it).

- [ ] **Step 2: Capture.** From the repo root:

```bash
$VPY .superpowers/sdd/lehrjahre/tools/capture_face.py \
  --base http://localhost:4017 --out lehrjahre/rick-n-morty \
  --routes '/' --settle 4000 --backlink ../../lehrjahre.html
```

Then stop the dev server **by PID only** (find it with `ss -tlnp | grep 4017`; never `pkill -f`). Sanity: `grep -c 'flip-card' lehrjahre/rick-n-morty/index.html` → ≥ 40 (20 cards × front+inner classes), and `grep -c 'Rick Sanchez' lehrjahre/rick-n-morty/index.html` → ≥ 1. If the grid is empty (API didn't answer), re-run capture with `--settle 8000`.

- [ ] **Step 3: Stock the pantry.** Write `$SCRATCH/stock_pantry.py`:

```python
import json, pathlib, sys, time, urllib.request

out = pathlib.Path('lehrjahre/rick-n-morty/pantry')
out.mkdir(parents=True, exist_ok=True)
chars = []
for page in (1, 2, 3):
    with urllib.request.urlopen(
            f'https://rickandmortyapi.com/api/character?page={page}', timeout=30) as r:
        results = json.load(r)['results']
    for c in results:
        chars.append({'id': c['id'], 'name': c['name'],
                      'location': c['location']['name'],
                      'origin': c['origin']['name'],
                      'img': f"pantry/{c['id']}.jpeg"})
        dest = out / f"{c['id']}.jpeg"
        if not dest.exists():
            with urllib.request.urlopen(c['image'], timeout=30) as im:
                dest.write_bytes(im.read())
            time.sleep(0.25)
    time.sleep(1)
stash = json.dumps(chars, ensure_ascii=False).replace('</', '<\\/')
pathlib.Path(sys.argv[1]).write_text(stash, encoding='utf-8')
print(len(chars), 'characters stocked,',
      len(list(out.glob('*.jpeg'))), 'avatars on disk')
```

Run from repo root: `$VPY $SCRATCH/stock_pantry.py $SCRATCH/pantry.json`
Expected: `60 characters stocked, 60 avatars on disk` (this is the exhibit's ONE network moment; everything after is local).

- [ ] **Step 4: Inject the pantry script.** Write `$SCRATCH/inject_pantry.py`:

```python
import pathlib, sys

stash = pathlib.Path(sys.argv[1]).read_text(encoding='utf-8')
page_path = pathlib.Path('lehrjahre/rick-n-morty/index.html')
page = page_path.read_text(encoding='utf-8')
assert page.count('</body>') == 1

script = """<script>
/* Museum pantry — a curator addition, stocked once at capture time
   (2026-08-30, 60 characters) from the public Rick and Morty API.
   The exhibit makes no network requests. The search stays broken. */
(function () {
  var PANTRY = %s;
  var cards = document.querySelectorAll('.flip-card');
  if (!cards.length || PANTRY.length < cards.length) return;
  var stock = PANTRY.slice();
  for (var i = stock.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var t = stock[i]; stock[i] = stock[j]; stock[j] = t;
  }
  cards.forEach(function (card, i) {
    var c = stock[i];
    var img = card.querySelector('.flip-card-front img');
    if (img) { img.src = c.img; img.alt = c.id; }
    var back = card.querySelector('.flip-card-back');
    if (!back) return;
    var h1 = back.querySelector('h1');
    if (h1) { h1.textContent = c.name; h1.appendChild(document.createElement('br')); }
    var ps = back.querySelectorAll('p');
    if (ps[0] && ps[0].lastChild && ps[0].lastChild.nodeType === 3) { ps[0].lastChild.nodeValue = ' ' + c.location; }
    if (ps[1] && ps[1].lastChild && ps[1].lastChild.nodeType === 3) { ps[1].lastChild.nodeValue = c.origin; }
  });
})();
</scr""" + """ipt>
"""

page = page.replace('</body>', script % stash + '</body>')
page_path.write_text(page, encoding='utf-8')
print('pantry injected')
```

Run: `$VPY $SCRATCH/inject_pantry.py $SCRATCH/pantry.json`
(The pantry rebuilds card content with `textContent`/`nodeValue` only — no `innerHTML` with data. `ps[0]`/`ps[1]` are Location/Origin; their last text node carries the value, leading space on Location only, matching the JSX `<b>Location:</b> <br /> {…}` vs `<b>Origin: </b><br />{…}`.)

- [ ] **Step 5: Seal.**

```bash
bash .superpowers/sdd/lehrjahre/tools/seal_check.sh lehrjahre/rick-n-morty
grep -c sourceMappingURL lehrjahre/rick-n-morty/index.html
```

Expected: `SEALED: lehrjahre/rick-n-morty` and `0`.

- [ ] **Step 6: Write the behavior test** to `$SCRATCH/rnm_face_check.py`:

```python
from playwright.sync_api import sync_playwright

BASE = 'http://localhost:8765/lehrjahre/rick-n-morty/index.html'

def names(pg):
    return pg.eval_on_selector_all(
        '.flip-card-back h1', 'els => els.map(e => e.textContent.trim())')

with sync_playwright() as p:
    b = p.chromium.launch()
    pg = b.new_page(viewport={'width': 1280, 'height': 900})
    errs = []
    pg.on('console', lambda m: errs.append(m.text) if m.type == 'error' else None)
    pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.goto(BASE, wait_until='networkidle')

    assert pg.locator('.flip-card').count() == 20
    assert pg.locator('.curator-bar').count() == 1
    n1 = names(pg)
    assert len(n1) == 20 and all(n1)

    # seal: same-host resources only; all avatars actually load
    ext = pg.evaluate("performance.getEntriesByType('resource').map(r=>r.name)"
                      ".filter(n=>!n.startsWith(location.origin))")
    assert ext == [], ext
    assert pg.eval_on_selector_all(
        '.flip-card img', 'els => els.every(i => i.complete && i.naturalWidth > 0)')

    # the search stays broken: typing changes nothing
    pg.fill('input[type=text]', 'Rick')
    pg.wait_for_timeout(400)
    assert names(pg) == n1

    # pantry: a fresh visit serves a different twenty
    pg.reload(wait_until='networkidle')
    n2 = names(pg)
    if n2 == n1:  # probability ~0; one retry allowed
        pg.reload(wait_until='networkidle')
        n2 = names(pg)
    assert n2 != n1, 'pantry served the same twenty twice'
    assert pg.eval_on_selector_all(
        '.flip-card img', 'els => els.every(i => i.complete && i.naturalWidth > 0)')

    real = [e for e in errs if 'favicon' not in e]
    assert real == [], real
    pg.screenshot(path='rnm-face-a.png')
    pg.reload(wait_until='networkidle')
    pg.screenshot(path='rnm-face-b.png')

    # JS off: the pure frozen capture (API page 1, Rick first), images intact
    ctx = b.new_context(java_script_enabled=False)
    pn = ctx.new_page()
    pn.goto(BASE)
    frozen = pn.eval_on_selector_all(
        '.flip-card-back h1', 'els => els.map(e => e.textContent.trim())')
    assert len(frozen) == 20 and frozen[0] == 'Rick Sanchez', frozen[:3]

    print('FACE OK')
    b.close()
```

- [ ] **Step 7: Run it** (server on 8765 from repo root):

```bash
cd $SCRATCH && /home/atakee/projects/eski-web-sayfalarim/.superpowers/sdd/lehrjahre/tools/venv/bin/python rnm_face_check.py
```

Expected: `FACE OK`; screenshots `rnm-face-a.png` / `rnm-face-b.png` show two different grids.

- [ ] **Step 8: Thumbnail.** 640px-wide PNG from the fresh capture, like the other tiles:

```bash
$VPY - <<'EOF'
from PIL import Image
im = Image.open('/tmp/claude-1000/-home-atakee-projects-eski-web-sayfalarim/48efd0d1-7db7-47bf-b550-98f7a8711c2b/scratchpad/rnm-face-a.png')
im.thumbnail((640, 10000))
im.save('assets/lehrjahre/rick-n-morty.png')
print(im.size)
EOF
```

- [ ] **Step 9: Scope check + commit**

```bash
git status --porcelain | grep -v -E '^\?\? (lehrjahre/rick-n-morty/|assets/lehrjahre/rick-n-morty\.png)'
```

Expected: empty (only new face files + thumbnail). Then:

```bash
git add lehrjahre/rick-n-morty assets/lehrjahre/rick-n-morty.png
git commit -m "Lehrjahre: rick-n-morty captured as walkable face with baked pantry"
```

---

### Task 2: Hall card, counts 9 → 10, pantry sentence, README

**Files:**
- Modify: `lehrjahre.html` (new card after the my-first-react-app card ~line 116; count at line 40; one sentence in "How these were captured" ~line 395+), `index.html:387` and `index.html:392`, `README.md` (`### 7.` section)
- Test: `$SCRATCH/hall_check17.py` (the cycle-2 hall test with counts bumped — full script below)

**Interfaces:**
- Consumes: Task 1's door URL `lehrjahre/rick-n-morty/index.html` and thumbnail `assets/lehrjahre/rick-n-morty.png`; the hall's cycle-1 card pattern (badge → h3+date → linked shot → hook → `.lj-plaque` → `.lj-plaque-btn` → `.lj-door`) and cycle-2's specimen classes (`.specimen-label`, `pre.specimen`).

- [ ] **Step 1: Insert the new card** in `lehrjahre.html`, immediately after the my-first-react-app card's closing `</div>` (the card ending with the door `lehrjahre/my-first-react-app/index.html`, ~line 116) and before the MaHalle v1 card. Exact markup (specimen escaped from `$CLONE/src/App.js` lines 39–48, verbatim incl. trailing spaces):

```html
    <div class="lj-card">
      <span class="lj-badge">walkable · pantry-fed</span>
      <h3>rick-n-morty <span class="lj-date">Jan 2023</span></h3>
      <div class="lj-shot"><a href="lehrjahre/rick-n-morty/index.html"><img src="assets/lehrjahre/rick-n-morty.png" alt="Rick and Morty character grid with a search box" loading="lazy"></a></div>
      <p class="lj-hook">The search box searches — into the console, and no further.</p>
      <div class="lj-plaque">
        <p>My second React app fetched twenty Rick and Morty characters from
        the public API every time it started. The museum could not freeze a
        network, so it stocked a pantry instead: sixty characters fetched
        once, on capture day, and stored inside the page. Each visit the
        exhibit serves a different twenty. Nothing is requested; the pantry
        never empties.</p>
        <div class="specimen-label">Specimen — App.js, the broken search</div>
        <pre class="specimen"><code>   const filterCharacters = ()=&gt; {
    const filteredCharacters = characters.filter((character)=&gt; { 
      return character.name.toUpperCase().includes(inputValue.toUpperCase())})
      console.log('filteredCharacters :&gt;&gt; ', filteredCharacters);
   }
   filterCharacters();

//    if (filteredCharacters.length != 0) {
//     characters = filteredCharacters;
//  }</code></pre>
        <p>Typing in the search box computed the filtered list, logged it to
        the console — and stopped. The two lines that would have put it on
        screen sit commented out, directly underneath. They have been one
        keystroke from working since January 2023. In the frozen face even
        the console is silent, so the search now does exactly what it always
        appeared to do: nothing.</p>
        <p class="lj-charm">Every log label in the source ends in :&gt;&gt; — "filteredCharacters :&gt;&gt;" was the only place the search results ever appeared.</p>
      </div>
      <button class="lj-plaque-btn" type="button">Read the plaque →</button>
      <p class="lj-door"><a class="go" href="lehrjahre/rick-n-morty/index.html">Enter the exhibit →</a></p>
    </div>
```

- [ ] **Step 2: Specimen fidelity check** (unescaped specimen must equal the source bytes):

```bash
python3 - <<'EOF'
import hashlib, html, pathlib, re
page = pathlib.Path('lehrjahre.html').read_text(encoding='utf-8')
m = re.search(r'App\.js, the broken search</div>\s*<pre class="specimen"><code>(.*?)</code></pre>',
              page, re.S)
src = html.unescape(m.group(1)) + '\n'
print(hashlib.md5(src.encode()).hexdigest())
EOF
```

Expected: `54247f8af37ca5004795f626b665dc57` (= `sed -n '39,48p' $CLONE/src/App.js | md5sum`). Any other value → the specimen was tidied or mis-escaped; fix the specimen, not the source.

- [ ] **Step 3: Counts.** Exactly three living sites (verified by grep on 2026-08-30):
  - `lehrjahre.html:40`: `Nine of them are walkable` → `Ten of them are walkable`
  - `index.html:387`: `Nine of them are walkable` → `Ten of them are walkable`
  - `index.html:392`: `<span class="chip">9 walkable faces</span>` → `<span class="chip">10 walkable faces</span>`

  README line 297 ("Walkable count: nine.") is a dated provenance entry — leave it. Re-run `grep -rn -i "nine of them\|9 walkable" *.html` afterwards → no hits.

- [ ] **Step 4: Pantry sentence.** In `lehrjahre.html`'s "How these were captured" section, after the sentence ending `Broken images are original breakage, not the museum's.` insert:

```
Where a face is marked pantry-fed, the museum stocked it at capture time —
data fetched once, stored in the page, served by a few curator lines; the
exhibit still makes no requests.
```

- [ ] **Step 5: README provenance.** In `README.md`, `### 7. The Lehrjahre wing`, after the Alexa-redaction bullet add:

```markdown
- 2026-08-30: second promoted sub-exhibit — `lehrjahre/rick-n-morty/`
  (CA-Projects, Project-3), captured live and fed: the grid holds the
  twenty characters the app really fetched. First pantry-fed face: sixty
  characters (data + avatars) were fetched once at capture time from the
  public Rick and Morty API into `pantry/`, and a curator-marked inline
  script — the face's only script — serves a random twenty per visit. No
  network requests ever leave the exhibit; with JS off the frozen page-1
  grid shows. The broken search was left broken (the fix in `App.js` is
  commented out in the original; the hall plaque exhibits it as a
  specimen). Walkable count: ten.
```

- [ ] **Step 6: Hall behavior test.** Write `$SCRATCH/hall_check17.py`:

```python
from playwright.sync_api import sync_playwright

BASE = 'http://localhost:8765/lehrjahre.html'

with sync_playwright() as p:
    b = p.chromium.launch()
    pg = b.new_page(viewport={'width': 1280, 'height': 900})
    errs = []
    pg.on('console', lambda m: errs.append(m.text) if m.type == 'error' else None)
    pg.goto(BASE, wait_until='networkidle')

    assert pg.locator('.lj-grid .lj-card').count() == 17
    assert pg.locator('.lj-plaque').count() == 17
    assert pg.locator('.lj-plaque-btn').count() == 17
    assert pg.locator('.lj-hook').count() == 17
    assert 'Ten of them are walkable' in pg.inner_text('body')

    # the new card: open its plaque via button, specimen is escaped text
    card = pg.locator('.lj-card', has_text='rick-n-morty').first
    card.locator('.lj-plaque-btn').click()
    assert pg.locator('.lj-dialog[open]').count() == 1
    dtext = pg.inner_text('.lj-dialog')
    assert 'filterCharacters' in dtext and 'characters = filteredCharacters' in dtext
    assert pg.locator('.lj-dialog .specimen').count() == 1
    pg.keyboard.press('Escape')
    assert pg.locator('.lj-dialog[open]').count() == 0
    assert card.locator('.lj-plaque').count() == 1

    # door navigates into the face
    with pg.expect_navigation():
        card.locator('.lj-door a').click()
    assert pg.url.endswith('lehrjahre/rick-n-morty/index.html')
    pg.goto(BASE, wait_until='networkidle')

    ext = pg.evaluate("performance.getEntriesByType('resource').map(r=>r.name)"
                      ".filter(n=>!n.startsWith(location.origin))")
    assert ext == [], ext
    real = [e for e in errs if 'favicon' not in e]
    assert real == [], real

    pg.screenshot(path='hall17-desktop.png', full_page=True)
    pg.locator('.lj-card', has_text='rick-n-morty').first.locator('.lj-plaque-btn').click()
    pg.screenshot(path='hall17-plaque.png')
    pg.keyboard.press('Escape')
    pm = b.new_page(viewport={'width': 390, 'height': 844})
    pm.goto(BASE, wait_until='networkidle')
    pm.screenshot(path='hall17-mobile.png', full_page=True)

    # JS off: plaques inline, buttons hidden
    ctx = b.new_context(java_script_enabled=False)
    pn = ctx.new_page()
    pn.goto(BASE)
    assert pn.eval_on_selector_all('.lj-plaque',
        "els => els.length === 17 && els.every(e => getComputedStyle(e).display !== 'none')")
    assert pn.eval_on_selector_all('.lj-plaque-btn',
        "els => els.every(e => getComputedStyle(e).display === 'none')")

    print('HALL OK')
    b.close()
```

- [ ] **Step 7: Run it**

```bash
cd $SCRATCH && /home/atakee/projects/eski-web-sayfalarim/.superpowers/sdd/lehrjahre/tools/venv/bin/python hall_check17.py
```

Expected: `HALL OK` + three screenshots for the preview.

- [ ] **Step 8: Scope check + commit**

```bash
git status --porcelain | grep -v -E '^(.M| M) (lehrjahre\.html|index\.html|README\.md)$'
```

Expected: empty. Then:

```bash
git add lehrjahre.html index.html README.md
git commit -m "Lehrjahre hall: rick-n-morty card with broken-search specimen; walkable count 10"
```

---

## After the tasks (controller, not a subagent)

- Show the user: `rnm-face-a.png` vs `rnm-face-b.png` (two visits, two grids), `hall17-plaque.png`, plus the live preview URLs on 8765. User corrects copy, then explicit push go-ahead.
- After approved push: Pages build `built`, live hall + face 200, live face grep shows no external URLs, SPN save hall + face.
