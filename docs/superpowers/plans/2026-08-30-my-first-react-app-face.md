# my-first-react-app Face Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Promote `my-first-react-app` (private CA-Projects repo, Project-3) to a sealed walkable face with a hall tile whose plaque shows two HTML-escaped JSX source specimens.

**Architecture:** Task 1 captures the running CRA app into `lehrjahre/my-first-react-app/` with the existing toolkit and produces the tile thumbnail. Task 2 adds the hall card (with specimens), the one CSS rule, the 8→9 count updates, the README provenance entry, and re-runs the full hall behavior test at the new counts.

**Tech Stack:** capture toolkit (`.superpowers/sdd/lehrjahre/tools/` — python venv, playwright, bs4, PIL), hand-written HTML/CSS.

**Spec:** `docs/superpowers/specs/2026-08-30-my-first-react-app-face-design.md`

## Global Constraints

- The face is a sealed NEW artifact: zero external requests, zero live external links, scripts stripped; `data-original` for any disabled external; never modernize. Re-verify seal after any change.
- Only these paths change — Task 1: create `lehrjahre/my-first-react-app/` and `assets/lehrjahre/my-first-react-app.png` (+ the git-ignored toolkit). Task 2: `lehrjahre.html`, `assets/museum.css`, `index.html`, `README.md`. **The 8 existing faces, all archived exhibit folders, and all existing hall-card copy (CA-Projects umbrella included) stay byte-identical.**
- Specimen text is verbatim from source, then HTML-escaped; the only permitted reformat is a uniform 4-space dedent of the App.js block. The double blank line stays.
- New text only as given verbatim in this plan (hook, plaque copy, charm, README bullet, "Nine of them are walkable", "9 walkable faces").
- Commits: simple messages, no Claude signature / no Co-Authored-By. Do NOT push — the user previews first.
- Servers: check `curl -sf -o /dev/null http://localhost:<port>/` before starting one; record the PID; kill by PID only (plus `fuser -k <port>/tcp` for the port if a child survives) — NEVER `pkill -f`/`pgrep -f`.
- Browser checks run via `.superpowers/sdd/lehrjahre/tools/venv/bin/python` from the repo root; `$SCRATCH` = `/home/atakee/.claude/jobs/ca66f0ba/tmp` (exists).

---

### Task 1: Capture the face + thumbnail

**Files:**
- Modify: `.superpowers/sdd/lehrjahre/tools/capture_face.py` (~line 231, curator-bar style — one addition)
- Create: `lehrjahre/my-first-react-app/` (index.html + assets/, via the tool)
- Create: `assets/lehrjahre/my-first-react-app.png` (640px-wide thumbnail)

**Interfaces:**
- Consumes: repo clone already at `.superpowers/sdd/lehrjahre/repos/CA-Projects-` (full history).
- Produces: `lehrjahre/my-first-react-app/index.html` — the door Task 2's card links to; the thumbnail path above.

- [ ] **Step 1: Patch the curator bar's z-index in the tool.** In `.superpowers/sdd/lehrjahre/tools/capture_face.py`, the injected bar's inline style (the f-string containing `class="curator-bar"`) lacks the stacking fix the shipped faces carry. Change

```python
f'<div class="curator-bar" style="background:#101418;color:#9aa4ae;'
```

to

```python
f'<div class="curator-bar" style="position:relative;z-index:2147483647;background:#101418;color:#9aa4ae;'
```

(This file is git-ignored — no commit for it; it keeps the toolkit consistent with the 2026-08-29 z-index convention.)

- [ ] **Step 2: Build and start the app** (first run ~1500 packages, a few minutes):

```bash
cd .superpowers/sdd/lehrjahre/repos/CA-Projects-/Project-3/my-first-react-app
npm install
PORT=4016 BROWSER=none nohup npm start > /home/atakee/.claude/jobs/ca66f0ba/tmp/cra.log 2>&1 &
echo $! > /home/atakee/.claude/jobs/ca66f0ba/tmp/cra.pid
```

Then wait for it (background-safe): `until curl -sf -o /dev/null http://localhost:4016/; do sleep 2; done` (run with a generous timeout). Expected in `cra.log`: "Compiled with warnings" — the 2 known unused-variable ESLint warnings are the app's own and are fine.

- [ ] **Step 3: Capture** (from the museum repo root):

```bash
.superpowers/sdd/lehrjahre/tools/venv/bin/python .superpowers/sdd/lehrjahre/tools/capture_face.py \
  --base http://localhost:4016 --routes / \
  --out lehrjahre/my-first-react-app \
  --backlink ../../lehrjahre.html \
  --exhibit-title "my-first-react-app (Jan 2023)" \
  --settle-ms 1500
```

Expected: `captured / -> index.html`, assets localized under `lehrjahre/my-first-react-app/assets/`. (Route `/` maps to `index.html`; bar depth 0 keeps the backlink verbatim.)

- [ ] **Step 4: Stop the dev server by PID:**

```bash
kill "$(cat /home/atakee/.claude/jobs/ca66f0ba/tmp/cra.pid)"; sleep 2
fuser -k 4016/tcp 2>/dev/null || true
```

- [ ] **Step 5: Seal checks:**

```bash
bash .superpowers/sdd/lehrjahre/tools/seal_check.sh lehrjahre/my-first-react-app
grep -rn 'sourceMappingURL' lehrjahre/my-first-react-app || echo "no sourcemaps"
```

Expected: `SEALED: lehrjahre/my-first-react-app` and `no sourcemaps`. Any hit = fix before proceeding (strip the comment / dead-link the URL with `data-original`).

- [ ] **Step 6: Face behavior check + screenshot.** Ensure a museum server: `curl -sf -o /dev/null http://localhost:8765/ || { python3 -m http.server 8765 & echo $! > $SCRATCH/server.pid; }` from repo root. Write `$SCRATCH/face_check.py`:

```python
from playwright.sync_api import sync_playwright
BASE = 'http://localhost:8765/lehrjahre/my-first-react-app/index.html'
with sync_playwright() as p:
    b = p.chromium.launch()
    pg = b.new_page(viewport={'width': 1280, 'height': 900})
    errs, crashes = [], []
    pg.on('console', lambda m: errs.append((m.text, (m.location or {}).get('url', ''))) if m.type == 'error' else None)
    pg.on('pageerror', lambda e: crashes.append(str(e)))
    pg.goto(BASE, wait_until='networkidle')
    body = pg.inner_text('body')
    assert 'Hey, Ercan is learning React! :)))' in body
    assert 'copyright @atakee' in body
    assert 'sdf' in body and 'asdf' in body            # the NavBar rendered
    bar = pg.locator('.curator-bar')
    assert bar.count() == 1 and bar.is_visible()
    assert bar.locator('a').get_attribute('href') == '../../lehrjahre.html'
    assert pg.locator('script').count() == 0            # scripts stripped
    ext = pg.evaluate("performance.getEntriesByType('resource').map(r=>r.name).filter(n=>!n.startsWith(location.origin))")
    assert ext == [], ext
    real = [t for t, u in errs if 'favicon' not in t and 'favicon' not in u]
    assert real == [], real
    assert crashes == [], crashes
    pg.screenshot(path='face-myfirst.png')
    print('FACE OK')
    b.close()
```

Run: `cd $SCRATCH && /home/atakee/projects/eski-web-sayfalarim/.superpowers/sdd/lehrjahre/tools/venv/bin/python face_check.py`
Expected: `FACE OK`, screenshot `$SCRATCH/face-myfirst.png`.

- [ ] **Step 7: Thumbnail** (640px wide, like the other tile shots):

```bash
cd $SCRATCH && /home/atakee/projects/eski-web-sayfalarim/.superpowers/sdd/lehrjahre/tools/venv/bin/python - <<'EOF'
from PIL import Image
im = Image.open('face-myfirst.png')
w = 640
im.resize((w, round(im.height * w / im.width))).save(
    '/home/atakee/projects/eski-web-sayfalarim/assets/lehrjahre/my-first-react-app.png')
print('thumb ok')
EOF
```

- [ ] **Step 8: Scope check + commit** (from repo root):

```bash
git status --porcelain | grep -v -E '^(\?\?|.M| M) (lehrjahre/my-first-react-app/|assets/lehrjahre/my-first-react-app\.png)'
```

Expected: empty. Then:

```bash
git add lehrjahre/my-first-react-app assets/lehrjahre/my-first-react-app.png
git commit -m "Lehrjahre: my-first-react-app captured as walkable face"
```

(If you started the 8765 server, kill it via `kill $(cat $SCRATCH/server.pid)`.)

---

### Task 2: Hall card with JSX specimens, counts, README

**Files:**
- Modify: `lehrjahre.html` (new card after CA-Projects; one word in the intro)
- Modify: `assets/museum.css` (one rule in the `/* lehrjahre */` block)
- Modify: `index.html` (chip text)
- Modify: `README.md` (one provenance bullet)
- Test: `$SCRATCH/hall_check2.py`

**Interfaces:**
- Consumes: Task 1's `lehrjahre/my-first-react-app/index.html` and `assets/lehrjahre/my-first-react-app.png`; cycle-1's card pattern and modal mechanism (`.lj-hook`/`.lj-plaque`/`.lj-plaque-btn`; every card carries the button); the lab's global `pre`/`code`/`.specimen`/`.specimen-label` styles.

- [ ] **Step 1: CSS rule.** In `assets/museum.css`, append to the end of the `/* lehrjahre */` block (after `body:has(.lj-dialog[open]) { overflow: hidden; }`):

```css
.lj-plaque .specimen { border-left-color: var(--amber); }
```

- [ ] **Step 2: Insert the new card.** In `lehrjahre.html`, find the END of the CA-Projects card. Its `<button>…</button>\n    </div>` tail is NOT unique (every card ends that way) — anchor on the card's unique charm line instead. The last four lines of the CA-Projects card are exactly:

```html
        <p class="lj-charm">Nav links labelled "sdf" and "asdf" — placeholder text I never came back for.</p>
      </div>
      <button class="lj-plaque-btn" type="button">Read the plaque →</button>
    </div>
```

Immediately after that final `</div>` (before the MaHalle v1 card), insert this card verbatim:

```html
    <div class="lj-card">
      <span class="lj-badge">walkable</span>
      <h3>my-first-react-app <span class="lj-date">Jan 2023</span></h3>
      <div class="lj-shot"><a href="lehrjahre/my-first-react-app/index.html"><img src="assets/lehrjahre/my-first-react-app.png" alt="Hey, Ercan is learning React! — the rendered page" loading="lazy"></a></div>
      <p class="lj-hook">Every block on this page is a hand-written React component.</p>
      <div class="lj-plaque">
        <p>My first React app, preserved mid-lesson. A NavBar whose five links
        read sdf, asdf, sdf; a Contact view that renders the words "Contact
        information"; a Footer that says "copyright @atakee" on green. None of
        it is a page in the old sense — every block is a component, written by
        hand, mounted one under the other so each had somewhere to stand.</p>
        <div class="specimen-label">Specimen — App.js, the styling lesson</div>
        <pre class="specimen"><code>&lt;div className="App"&gt;
  &lt;Contacts /&gt;
  &lt;h1 className='tomato'&gt;Hey, Ercan is learning React! :)))&lt;/h1&gt;
  &lt;h2 className='blue'&gt;this should appear blue&lt;/h2&gt;
  &lt;h3 className='blue' style={{color: "yellowgreen" }}&gt;inline style&lt;/h3&gt;
  &lt;h4 className='blue' style={myStyle}&gt;style object&lt;/h4&gt;


  &lt;MyComponent /&gt;
&lt;/div&gt;</code></pre>
        <p>One heading per styling technique — that was the entire lesson. In
        the stylesheet, the class named tomato is, of course, red. And the
        walkable page next door is exactly what this JSX became.</p>
        <div class="specimen-label">Specimen — NavBar.js, one whole component</div>
        <pre class="specimen"><code>import React from 'react'

function NavBar() {
  return (
    &lt;div style={{color: "purple", fontWeight:"bold"}}&gt;NavBar
        &lt;ul style={{display: "flex", flexDirection: "row", justifyContent: "space-evenly", backgroundColor:"lightblue"}}&gt;
            &lt;li&gt;sdf&lt;/li&gt;
            &lt;li&gt;sdf&lt;/li&gt;
            &lt;li&gt;asdf&lt;/li&gt;
            &lt;li&gt;sdf&lt;/li&gt;
            &lt;li&gt;asdf&lt;/li&gt;
        &lt;/ul&gt;
    &lt;/div&gt;
  )
}

export default NavBar</code></pre>
        <p class="lj-charm">The list of names in MyComponent is a constant called elephants. Two of the elephants are Monique.</p>
      </div>
      <button class="lj-plaque-btn" type="button">Read the plaque →</button>
      <p class="lj-door"><a class="go" href="lehrjahre/my-first-react-app/index.html">Enter the exhibit →</a></p>
    </div>
```

- [ ] **Step 3: Specimen fidelity check.** The two `<code>` blocks must equal the source after unescaping (App.js lines 16–25 dedented by exactly 4 spaces; NavBar.js whole file). Run from repo root:

```bash
.superpowers/sdd/lehrjahre/tools/venv/bin/python - <<'EOF'
import html, re, pathlib
page = pathlib.Path('lehrjahre.html').read_text()
blocks = re.findall(r'<pre class="specimen"><code>(.*?)</code></pre>', page, re.S)
assert len(blocks) == 2, len(blocks)
app_spec, nav_spec = (html.unescape(b) for b in blocks)
root = pathlib.Path('.superpowers/sdd/lehrjahre/repos/CA-Projects-/Project-3/my-first-react-app/src')
src = (root / 'App.js').read_text().splitlines()[15:25]
expected = '\n'.join(l[4:] if l.startswith('    ') else l for l in src)
assert app_spec == expected, 'App.js specimen differs from source'
nav_src = (root / 'components' / 'NavBar.js').read_text()
assert nav_spec in (nav_src, nav_src.rstrip('\n')), 'NavBar.js specimen differs from source'
print('SPECIMENS VERBATIM OK')
EOF
```

Expected: `SPECIMENS VERBATIM OK`. If a mismatch: fix the card's specimen to match the source, never the reverse.

- [ ] **Step 4: Count updates — all THREE sites.**
  - `lehrjahre.html` (intro, ~line 40): change `Eight of them are walkable` → `Nine of them are walkable` (one word; the rest of the sentence untouched).
  - `index.html` (~line 387, landing era copy `…childish attempts to build something. Eight of them are walkable; all of…`): change `Eight of them are walkable` → `Nine of them are walkable` (one word).
  - `index.html` (~line 392): change `<span class="chip">8 walkable faces</span>` → `<span class="chip">9 walkable faces</span>`.

  Afterwards `grep -rn 'Eight of them\|8 walkable' index.html lehrjahre.html` must return nothing.

- [ ] **Step 5: README bullet.** In `README.md`, `### 7. The Lehrjahre wing` section, immediately after the bullet ending `Shell change only — no face was touched.`, add:

```markdown
- 2026-08-30: first promoted sub-exhibit — `lehrjahre/my-first-react-app/`
  (from the private CA-Projects repo, Project-3), captured with the same
  toolkit: scripts stripped, assets localized, curator bar added, no edits
  to the app's output. Its hall plaque shows two HTML-escaped source
  specimens (`App.js`, `NavBar.js`) so visitors can compare the JSX with
  the rendered page. Walkable count: nine.
```

- [ ] **Step 6: Write the hall behavior test** to `$SCRATCH/hall_check2.py` (counts 16; the new card is `:nth-child(2)`, MaHalle v1 shifts to `:nth-child(3)`):

```python
from playwright.sync_api import sync_playwright, expect

BASE = 'http://localhost:8765/lehrjahre.html'
NC = '.lj-grid .lj-card:nth-child(2)'  # my-first-react-app

with sync_playwright() as p:
    b = p.chromium.launch()
    pg = b.new_page(viewport={'width': 1280, 'height': 900})
    errs, crashes = [], []
    pg.on('console', lambda m: errs.append((m.text, (m.location or {}).get('url', ''))) if m.type == 'error' else None)
    pg.on('pageerror', lambda e: crashes.append(str(e)))
    pg.goto(BASE, wait_until='networkidle')

    assert pg.locator('.lj-grid .lj-card').count() == 16
    for sel in ('.lj-plaque', '.lj-plaque-btn', '.lj-hook'):
        assert pg.locator(sel).count() == 16, sel
    assert pg.eval_on_selector_all('.lj-plaque',
        "els => els.every(e => getComputedStyle(e).display === 'none')")
    assert 'Nine of them are walkable' in pg.inner_text('body')

    # new card: open plaque, specimens visible as TEXT, not live markup
    assert 'my-first-react-app' in pg.inner_text(NC + ' h3')
    pg.click(NC + ' .lj-plaque-btn')
    assert pg.locator('.lj-dialog[open]').count() == 1
    dtext = pg.inner_text('.lj-dialog')
    assert 'Hey, Ercan is learning React! :)))' in dtext
    assert 'className' in dtext and 'export default NavBar' in dtext
    assert pg.locator('.lj-dialog .specimen').count() == 2
    assert pg.locator('.lj-dialog .specimen-label').count() == 2
    assert pg.locator('.lj-dialog h1').count() == 0   # escaped JSX must not become elements
    assert pg.locator('.lj-dialog li').count() == 0
    assert pg.locator('.lj-dialog[open] .lj-door').count() == 1
    pg.keyboard.press('Escape')
    expect(pg.locator('.lj-dialog[open]')).to_have_count(0)
    expect(pg.locator(NC + ' .lj-plaque')).to_have_count(1)
    pg.wait_for_function("document.activeElement && document.activeElement.className === 'lj-plaque-btn'")

    # CA-Projects (child 1) still opens via its unlinked screenshot; backdrop closes
    pg.click('.lj-grid .lj-card:nth-child(1) .lj-shot')
    assert pg.locator('.lj-dialog[open]').count() == 1
    pg.mouse.click(1270, 890)
    expect(pg.locator('.lj-dialog[open]')).to_have_count(0)

    # MaHalle v1 (now child 3): title opens, cloned door present, × closes
    pg.click('.lj-grid .lj-card:nth-child(3) h3')
    assert 'MaHalle v1' in pg.inner_text('.lj-dialog')
    assert pg.locator('.lj-dialog[open] .lj-door').count() == 1
    pg.click('.lj-close')
    expect(pg.locator('.lj-dialog[open]')).to_have_count(0)

    # new tile's screenshot navigates into the face (no modal)
    with pg.expect_navigation():
        pg.click(NC + ' .lj-shot a')
    assert pg.url.endswith('lehrjahre/my-first-react-app/index.html')
    pg.goto(BASE, wait_until='networkidle')

    ext = pg.evaluate("performance.getEntriesByType('resource').map(r=>r.name)"
                      ".filter(n=>!n.startsWith(location.origin))")
    assert ext == [], ext
    real = [t for t, u in errs if 'favicon' not in t and 'favicon' not in u]
    assert real == [], real
    assert crashes == [], crashes

    # screenshots for the user preview
    pg.screenshot(path='hall2-desktop.png', full_page=True)
    pg.click(NC + ' .lj-plaque-btn')
    pg.screenshot(path='hall2-plaque-specimens.png')
    pg.keyboard.press('Escape')
    pm = b.new_page(viewport={'width': 390, 'height': 844})
    pm.goto(BASE, wait_until='networkidle')
    pm.click(NC + ' .lj-plaque-btn')
    pm.screenshot(path='hall2-plaque-mobile.png')

    # landing: chip AND era copy both updated
    pg.goto('http://localhost:8765/index.html', wait_until='networkidle')
    landing = pg.inner_text('body')
    assert '9 walkable faces' in landing
    assert 'Nine of them are walkable' in landing
    assert 'Eight of them are walkable' not in landing

    # JS off: 16 inline plaques, hidden buttons
    ctx = b.new_context(java_script_enabled=False)
    pn = ctx.new_page()
    pn.goto(BASE)
    assert pn.eval_on_selector_all('.lj-plaque',
        "els => els.length === 16 && els.every(e => getComputedStyle(e).display !== 'none')")
    assert pn.eval_on_selector_all('.lj-plaque-btn',
        "els => els.every(e => getComputedStyle(e).display === 'none')")

    print('ALL OK')
    b.close()
```

- [ ] **Step 7: Run it.** Ensure a server (`curl -sf -o /dev/null http://localhost:8765/ || { python3 -m http.server 8765 & echo $! > $SCRATCH/server.pid; }` from repo root), then:

```bash
cd $SCRATCH && /home/atakee/projects/eski-web-sayfalarim/.superpowers/sdd/lehrjahre/tools/venv/bin/python hall_check2.py
```

Expected: `ALL OK`; screenshots `hall2-desktop.png`, `hall2-plaque-specimens.png`, `hall2-plaque-mobile.png` in `$SCRATCH`. (If you started the server, kill it by PID at task end.)

- [ ] **Step 8: Scope check + commit:**

```bash
git status --porcelain | grep -v -E '^(.M| M) (lehrjahre\.html|assets/museum\.css|index\.html|README\.md)$'
```

Expected: empty. Then:

```bash
git add lehrjahre.html assets/museum.css index.html README.md
git commit -m "Lehrjahre hall: my-first-react-app card with JSX specimens; walkable count 9"
```

---

## After the tasks (controller, not a subagent)

- Show the user the face + plaque screenshots and the draft copy (hook, plaque paragraphs, charm) for correction; keep/start a `python3 -m http.server 8765` (PID tracked) for live preview.
- Push only on the user's explicit go-ahead. After push: Pages build `built`, live hall + face 200, SPN save of `lehrjahre.html` AND `lehrjahre/my-first-react-app/index.html`.
