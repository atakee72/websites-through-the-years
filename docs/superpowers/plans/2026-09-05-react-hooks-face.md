# React-Hooks-with-TypeScript face — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Promote `React-Hooks-with-TypeScript` to the wing's 13th walkable
face — a frozen-fed capture whose five demonstrable hooks are given their
motion back by one marked curator script.

**Architecture:** Capture the running CRA app's rendered DOM with the
existing toolkit into `lehrjahre/react-hooks/`, append one inline
curator script that may only rewrite the text of nodes the page already
rendered, rewrite the existing hall card from `catalogue only` into a
walkable tile with a door and a specimen, and update the walkable count
everywhere it is written.

**Tech Stack:** Existing museum toolkit
(`.superpowers/sdd/lehrjahre/tools/capture_face.py`, `seal_check.sh`,
`tools/venv/bin/python` with playwright + pillow), plain HTML/CSS/JS,
`python3 -m http.server 8765` for local checks.

**Spec:** `docs/superpowers/specs/2026-09-05-react-hooks-face-design.md`
(read its "Revision" section — it corrects the approved draft on five
points of fact).

## Global Constraints

- Repo root is `/home/atakee/projects/eski-web-sayfalarim`. All relative
  paths below are from there. Scratch files go in `/tmp/react-hooks-cycle7/`
  (`mkdir -p` it); nothing outside the repo is committed.
- The face is a **sealed new artifact**: zero external requests at view
  time, zero live external links, dead externals carry `data-original`.
  After any hand-edit re-run `.superpowers/sdd/lehrjahre/tools/seal_check.sh
  lehrjahre/react-hooks` **and** `grep -rn "sourceMappingURL"
  lehrjahre/react-hooks` (must print nothing).
- The curator script is the face's ONLY script: inline, at the end of
  `<body>`, headed by a comment naming it a museum addition and its date.
  It creates no nodes, stores no data, and makes no requests.
- Do not modernize, reformat or lint anything captured. The captured
  `index.html` is one long line — count things with `grep -o … | wc -l`,
  never `grep -c`.
- Only these paths may change: `lehrjahre/react-hooks/**` (new),
  `assets/lehrjahre/react-hooks.png` (replaced), `lehrjahre.html`,
  `index.html`, `README.md`. Every other face and archived exhibit stays
  byte-identical — check with `git status --short` before each commit.
- The private clone at
  `.superpowers/sdd/lehrjahre/repos/React-Hooks-with-TypeScript` is
  git-ignored scratch. Never `git add` anything from it. Before each commit
  run `git diff --cached --name-only` and confirm every path is in the list
  above.
- Commit messages: simple, no Claude signature, no `Co-Authored-By` footer.
- Do NOT push. The user previews and gives the go-ahead.
- Kill any server you start, by PID (`ss -lptn 'sport = :PORT'` then
  `kill <pid>`). Never `pkill -f`.

---

### Task 1: Capture the face

**Files:**
- Create: `lehrjahre/react-hooks/index.html` and
  `lehrjahre/react-hooks/assets/*` (written by the capture tool)
- Read: `.superpowers/sdd/lehrjahre/tools/capture_face.py`

**Interfaces:**
- Consumes: nothing.
- Produces: `lehrjahre/react-hooks/index.html`, a single-line captured DOM
  whose `#root` contains, in order, `<h1>Custom Hook</h1>`, the useMemo
  block with **ten** user cards, `<h1>useRef</h1><input/>`,
  `<h1>useReducer</h1><div><div>100</div><div><button>Increment</button><button>Decrement</button></div></div>`,
  `<h1>useState</h1><div><div><button>Add to array</button>[]</div><br/><div><button>Set name</button>null</div></div>`,
  `<h1>useEffect</h1><div>N</div>` (N = whatever second the capture froze),
  `<h1>useContext</h1><div>First: Jane</div><div>Last: Smith</div><button>Change context</button>`.
  Task 2's script addresses every section through those `<h1>` labels.

- [ ] **Step 1: Verify the clone and its dependencies**

The repo was cloned and `npm install` run during planning. Confirm:

```bash
cd /home/atakee/projects/eski-web-sayfalarim/.superpowers/sdd/lehrjahre/repos/React-Hooks-with-TypeScript
git log --oneline -1          # expect: 2076ba5 Finished custom hook, added useMemo
ls node_modules >/dev/null && echo "deps present"
```

If `node_modules` is missing, run `npm install` (takes ~2 min, ~1461
packages, deprecation warnings are expected and fine).

- [ ] **Step 2: Start the dev server**

```bash
mkdir -p /tmp/react-hooks-cycle7
cd /home/atakee/projects/eski-web-sayfalarim/.superpowers/sdd/lehrjahre/repos/React-Hooks-with-TypeScript
PORT=4005 BROWSER=none nohup npm start > /tmp/react-hooks-cycle7/dev.log 2>&1 &
until curl -s -o /dev/null http://localhost:4005/; do sleep 1; done; echo READY
```

Expected: READY within ~60s; `grep -E "Compiled|Failed" /tmp/react-hooks-cycle7/dev.log`
shows "Compiled successfully".

- [ ] **Step 3: Capture**

```bash
cd /home/atakee/projects/eski-web-sayfalarim
.superpowers/sdd/lehrjahre/tools/venv/bin/python \
  .superpowers/sdd/lehrjahre/tools/capture_face.py \
  --base http://localhost:4005 \
  --routes / \
  --out lehrjahre/react-hooks \
  --settle-ms 4000 \
  --backlink ../../lehrjahre.html \
  --exhibit-title "React-Hooks-with-TypeScript"
```

Expected: `captured / -> index.html` and `done: 1 pages, 3 assets`
(favicon, apple-touch icon, manifest — the API returns text only).

- [ ] **Step 4: Verify the capture's contents**

```bash
cd /home/atakee/projects/eski-web-sayfalarim
grep -o '<p><strong>Id</strong>' lehrjahre/react-hooks/index.html | wc -l   # expect 10
grep -o '<script' lehrjahre/react-hooks/index.html | wc -l                  # expect 0
grep -o '<noscript' lehrjahre/react-hooks/index.html | wc -l                # expect 0
grep -o 'jsonplaceholder' lehrjahre/react-hooks/index.html | wc -l          # expect 0
grep -o '<h1>useEffect</h1><div>[0-9]*</div>' lehrjahre/react-hooks/index.html
grep -o 'Antonette' lehrjahre/react-hooks/index.html | wc -l                # expect 2
grep -o 'curator-bar' lehrjahre/react-hooks/index.html | wc -l              # expect 1
```

Antonette is expected **twice**: once as the useMemo section's label
("Antonette's email:") and once as user 2's Username field. Verified against a
planning capture — one hit means the memo section did not render.

If the useEffect grep prints nothing, the section did not render — stop and
report; the whole of Task 2 depends on that exact shape.

- [ ] **Step 5: Seal check**

```bash
cd /home/atakee/projects/eski-web-sayfalarim
.superpowers/sdd/lehrjahre/tools/seal_check.sh lehrjahre/react-hooks
grep -rn "sourceMappingURL" lehrjahre/react-hooks    # expect no output
```

Expected: the seal script reports clean (no unsealed `src`/`href`/`action`,
no `url()`, no `srcset`, no `<noscript>`).

- [ ] **Step 6: Kill the dev server**

```bash
ss -lptn 'sport = :4005'    # read the pid
kill <pid>
ss -lptn 'sport = :4005'    # expect no LISTEN row
```

- [ ] **Step 7: Commit**

```bash
cd /home/atakee/projects/eski-web-sayfalarim
git add lehrjahre/react-hooks
git diff --cached --name-only    # every path must start with lehrjahre/react-hooks/
git commit -m "React-Hooks: face captured"
```

---

### Task 2: The curator's clock

**Files:**
- Modify: `lehrjahre/react-hooks/index.html` (append one inline script
  immediately before `</body>`)
- Test: `/tmp/react-hooks-cycle7/test_face.py` (scratch, not committed)

**Interfaces:**
- Consumes: the captured DOM shape from Task 1.
- Produces: a face on which the useEffect counter ticks, and the
  `Increment` / `Decrement` / `Add to array` / `Set name` / `Change context`
  buttons answer. Task 3's plaque copy describes exactly this behaviour.

- [ ] **Step 1: Write the failing test**

Create `/tmp/react-hooks-cycle7/test_face.py`:

```python
import re, pathlib, sys
from playwright.sync_api import sync_playwright

FACE = pathlib.Path("/home/atakee/projects/eski-web-sayfalarim/lehrjahre/react-hooks/index.html")
URL = "http://localhost:8765/lehrjahre/react-hooks/index.html"

html = FACE.read_text()
frozen_tick = int(re.search(r"<h1>useEffect</h1><div>(\d+)</div>", html).group(1))

READ = """(label) => {
  const h = [...document.querySelectorAll('#root h1')]
    .find(x => x.textContent.trim() === label);
  return h ? h.nextElementSibling.textContent : null;
}"""
COUNT_ELEMENTS = "() => document.querySelectorAll('*').length"
CLICK = """(label) => {
  const btns = [...document.querySelectorAll('#root button')]
    .filter(b => b.textContent.trim() === label);
  if (btns.length !== 1) throw new Error('expected 1 button ' + label + ', got ' + btns.length);
  btns[0].click();
}"""
CONTEXT = """() => {
  const h = [...document.querySelectorAll('#root h1')]
    .find(x => x.textContent.trim() === 'useContext');
  return h.nextElementSibling.textContent + ' / ' +
         h.nextElementSibling.nextElementSibling.textContent;
}"""

fails = []
def check(name, got, want):
    if got != want:
        fails.append(f"{name}: got {got!r}, want {want!r}")

with sync_playwright() as p:
    b = p.chromium.launch()

    # --- JS on ---
    pg = b.new_page()
    errors, bad_status, offsite = [], [], []
    pg.on("console", lambda m: errors.append(m.text) if m.type == "error" else None)
    pg.on("response", lambda r: bad_status.append(f"{r.status} {r.url}") if r.status >= 400 else None)
    pg.on("request", lambda r: offsite.append(r.url) if "localhost:8765" not in r.url else None)
    pg.goto(URL, wait_until="networkidle")

    before = pg.evaluate(COUNT_ELEMENTS)

    # the clock
    t1 = int(pg.evaluate(READ, "useEffect"))
    pg.wait_for_timeout(3000)
    t2 = int(pg.evaluate(READ, "useEffect"))
    if not (2 <= t2 - t1 <= 4):
        fails.append(f"clock: advanced {t2 - t1} in 3s")
    if t1 < frozen_tick:
        fails.append(f"clock: started at {t1}, below frozen {frozen_tick}")

    # useReducer
    check("reducer start", pg.evaluate(READ, "useReducer").startswith("100"), True)
    pg.evaluate(CLICK, "Increment")
    check("reducer +10", pg.evaluate(READ, "useReducer").startswith("110"), True)
    pg.evaluate(CLICK, "Decrement")
    check("reducer -5", pg.evaluate(READ, "useReducer").startswith("105"), True)

    # useState
    check("state start", pg.evaluate(READ, "useState"), "Add to array[]Set namenull")
    pg.evaluate(CLICK, "Add to array")
    pg.evaluate(CLICK, "Add to array")
    pg.evaluate(CLICK, "Set name")
    check("state after", pg.evaluate(READ, "useState"), 'Add to array[1,2]Set name"Jack"')

    # useContext — one-way, exactly like the original
    check("context start", pg.evaluate(CONTEXT), "First: Jane / Last: Smith")
    pg.evaluate(CLICK, "Change context")
    check("context after", pg.evaluate(CONTEXT), "First: Josie / Last: Paris")
    pg.evaluate(CLICK, "Change context")
    check("context stays", pg.evaluate(CONTEXT), "First: Josie / Last: Paris")

    # nothing was built
    check("element count unchanged", pg.evaluate(COUNT_ELEMENTS), before)

    if errors: fails.append(f"console errors: {errors}")
    if bad_status: fails.append(f"bad responses: {bad_status}")
    if offsite: fails.append(f"offsite requests: {offsite}")

    # --- JS off: the pure artifact, numbers standing still ---
    # page.evaluate does not run with JavaScript disabled, so read through
    # locators only.
    ctx = b.new_context(java_script_enabled=False)
    pg2 = ctx.new_page()
    pg2.goto(URL)
    tick_off = pg2.locator("xpath=//h1[normalize-space(text())='useEffect']/following-sibling::*[1]")
    check("js-off tick frozen", tick_off.inner_text().strip(), str(frozen_tick))
    pg2.wait_for_timeout(2500)
    check("js-off tick still frozen", tick_off.inner_text().strip(), str(frozen_tick))
    b.close()

print("FAILS:", *fails, sep="\n  ") if fails else print("ALL CHECKS PASS")
sys.exit(1 if fails else 0)
```

- [ ] **Step 2: Run it and watch it fail**

```bash
mkdir -p /tmp/react-hooks-cycle7
cd /home/atakee/projects/eski-web-sayfalarim
python3 -m http.server 8765 > /tmp/react-hooks-cycle7/http.log 2>&1 &
.superpowers/sdd/lehrjahre/tools/venv/bin/python /tmp/react-hooks-cycle7/test_face.py
```

Expected: FAILS — the clock does not advance and every button is inert.

- [ ] **Step 3: Append the curator script**

Append this immediately before `</body>` in
`lehrjahre/react-hooks/index.html`. Use a python rewrite, not the Edit tool
(Edit strips trailing whitespace):

```python
import pathlib
p = pathlib.Path("/home/atakee/projects/eski-web-sayfalarim/lehrjahre/react-hooks/index.html")
s = p.read_text()
script = '''
<script>
/* Museum addition — the curator's clock, wired 2026-09-05.
   Freezing this page stripped its scripts, which stopped every hook on a
   page whose whole subject is hooks. These lines are allowed to do exactly
   one thing: rewrite the text of a node the page had already rendered.
   They build nothing, hold no data, and make no requests. useRef is absent
   from the list because its input never did anything visible in 2023
   either. */
(function () {
  var root = document.getElementById("root");
  if (!root) return;

  function section(label) {
    var hs = root.getElementsByTagName("h1");
    for (var i = 0; i < hs.length; i++) {
      if (hs[i].textContent.trim() === label) return hs[i];
    }
    return null;
  }

  /* useEffect — picks up at the second the capture froze and keeps going */
  var effect = section("useEffect");
  if (effect && effect.nextElementSibling) {
    var tick = effect.nextElementSibling;
    var ticked = parseInt(tick.textContent, 10);
    if (!isNaN(ticked)) {
      window.setInterval(function () {
        tick.textContent = String(++ticked);
      }, 1000);
    }
  }

  /* useReducer — Increment adds 10, Decrement takes 5, from the frozen 100 */
  var reducer = section("useReducer");
  if (reducer && reducer.nextElementSibling) {
    var box = reducer.nextElementSibling;
    var out = box.firstElementChild;
    if (!out) return;
    var counter = parseInt(out.textContent, 10);
    var rbtns = box.getElementsByTagName("button");
    for (var r = 0; r < rbtns.length; r++) {
      (function (btn) {
        var step = btn.textContent.trim() === "Increment" ? 10 : -5;
        btn.onclick = function () {
          counter += step;
          out.textContent = String(counter);
        };
      })(rbtns[r]);
    }
  }

  /* useState — the same JSON.stringify text the app used to print */
  var state = section("useState");
  if (state && state.nextElementSibling) {
    var arr = [];
    var sbtns = state.nextElementSibling.getElementsByTagName("button");
    for (var s2 = 0; s2 < sbtns.length; s2++) {
      (function (btn) {
        var slot = btn.parentNode.lastChild;
        if (!slot || slot.nodeType !== 3) return;   /* only ever a text node */
        if (btn.textContent.trim() === "Add to array") {
          btn.onclick = function () {
            arr.push(arr.length + 1);
            slot.nodeValue = JSON.stringify(arr);
          };
        } else {
          btn.onclick = function () {
            slot.nodeValue = JSON.stringify("Jack");
          };
        }
      })(sbtns[s2]);
    }
  }

  /* useContext — one-way, because the original had no way back */
  var ctx = section("useContext");
  if (ctx) {
    var first = ctx.nextElementSibling;
    var last = first && first.nextElementSibling;
    var cbtn = last && last.nextElementSibling;
    if (cbtn && cbtn.tagName === "BUTTON") {
      cbtn.onclick = function () {
        first.textContent = "First: Josie";
        last.textContent = "Last: Paris";
      };
    }
  }
})();
</script>
'''
assert s.count("</body>") == 1
p.write_text(s.replace("</body>", script + "</body>"))
```

- [ ] **Step 4: Run the test again**

```bash
cd /home/atakee/projects/eski-web-sayfalarim
.superpowers/sdd/lehrjahre/tools/venv/bin/python /tmp/react-hooks-cycle7/test_face.py
```

Expected: `ALL CHECKS PASS`.

- [ ] **Step 5: Re-seal and confirm the script is the only one**

```bash
cd /home/atakee/projects/eski-web-sayfalarim
.superpowers/sdd/lehrjahre/tools/seal_check.sh lehrjahre/react-hooks
grep -rn "sourceMappingURL" lehrjahre/react-hooks              # no output
grep -o '<script' lehrjahre/react-hooks/index.html | wc -l     # expect 1
grep -o 'fetch\|XMLHttpRequest\|localStorage' lehrjahre/react-hooks/index.html | wc -l   # expect 0
```

- [ ] **Step 6: Kill the http server and commit**

```bash
ss -lptn 'sport = :8765'   # read the pid
kill <pid>
cd /home/atakee/projects/eski-web-sayfalarim
git add lehrjahre/react-hooks/index.html
git diff --cached --name-only    # only lehrjahre/react-hooks/index.html
git commit -m "React-Hooks: curator script keeps five hooks answering"
```

---

### Task 3: Thumbnail and hall card

**Files:**
- Replace: `assets/lehrjahre/react-hooks.png` (640×360)
- Modify: `lehrjahre.html` (the card at lines 302–316)
- Test: `/tmp/react-hooks-cycle7/test_hall.py` (scratch)

**Interfaces:**
- Consumes: `lehrjahre/react-hooks/index.html` from Tasks 1–2.
- Produces: a walkable card whose door is
  `lehrjahre/react-hooks/index.html`; Task 4 only touches counts and README.

- [ ] **Step 1: Shoot the new thumbnail**

```bash
mkdir -p /tmp/react-hooks-cycle7
cd /home/atakee/projects/eski-web-sayfalarim
python3 -m http.server 8765 > /tmp/react-hooks-cycle7/http.log 2>&1 &
```

Then run with `.superpowers/sdd/lehrjahre/tools/venv/bin/python`:

```python
from playwright.sync_api import sync_playwright
from PIL import Image

with sync_playwright() as p:
    b = p.chromium.launch()
    pg = b.new_page(viewport={"width": 1280, "height": 720})
    pg.goto("http://localhost:8765/lehrjahre/react-hooks/index.html")
    pg.wait_for_timeout(2000)
    pg.screenshot(path="/tmp/react-hooks-cycle7/face-full.png")
    b.close()

im = Image.open("/tmp/react-hooks-cycle7/face-full.png").convert("RGB")
im = im.resize((640, 360), Image.LANCZOS)
im.save("/home/atakee/projects/eski-web-sayfalarim/assets/lehrjahre/react-hooks.png")
print(Image.open("/home/atakee/projects/eski-web-sayfalarim/assets/lehrjahre/react-hooks.png").size)
```

Expected: `(640, 360)`, matching every other thumbnail in that folder.

- [ ] **Step 2: Rewrite the card**

In `lehrjahre.html`, replace exactly this block:

```html
    <div class="lj-card">
      <span class="lj-badge quiet">catalogue only</span>
      <h3>React-Hooks-with-TypeScript <span class="lj-date">Apr 2023</span></h3>
      <div class="lj-shot"><img src="assets/lehrjahre/react-hooks.png" alt="Hooks cheat sheet with fetched user cards" loading="lazy"></div>
      <p class="lj-hook">One page, six hooks — my React cheat sheet.</p>
      <div class="lj-plaque">
        <p>One page, six hooks, one component each — my React cheat sheet. It
        fetched eight fake users from a placeholder API and filtered for the one
        named Antonette, to prove useMemo worked. A commented-out map component
        records the ambition that got shelved: the users' coordinates are printed
        as raw numbers instead.</p>
        <p class="lj-charm">A comment in the custom hook: '"Payload" instead of "User[]" to make it genuinely generic :-]'</p>
      </div>
      <button class="lj-plaque-btn" type="button">Read the plaque →</button>
    </div>
```

with:

```html
    <div class="lj-card">
      <span class="lj-badge">walkable · still ticking</span>
      <h3>React-Hooks-with-TypeScript <span class="lj-date">Apr 2023</span></h3>
      <div class="lj-shot"><a href="lehrjahre/react-hooks/index.html"><img src="assets/lehrjahre/react-hooks.png" alt="Hooks cheat sheet with fetched user cards" loading="lazy"></a></div>
      <p class="lj-hook">Six hooks pinned to one page; one of them still beats.</p>
      <div class="lj-plaque">
        <p>One page, six hooks, one component each — my React cheat sheet. It
        fetched ten fake users from a placeholder API and filtered for the one
        named Antonette, to prove useMemo worked. A commented-out map component
        records the ambition that got shelved: the users' coordinates are printed
        as raw numbers instead.</p>
        <div class="specimen-label">Specimen — CustomHookComponent.tsx, the map that never opened</div>
        <pre class="specimen"><code>{/* &lt;MapContainer style={{ height: "400px" }}&gt;
  &lt;TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" /&gt;
  &lt;Marker
    position={[
      Number(user!.address.geo.lat),
      Number(user!.address.geo.lng),
    ]}
  &gt;
    &lt;Popup&gt;A pretty CSS3 popup.&lt;/Popup&gt;
  &lt;/Marker&gt;
&lt;/MapContainer&gt; */}</code></pre>
        <p>Freezing a page about hooks stops every hook on it. So the curator
        wrote a handful of lines, allowed to change only text the page had
        already written: the useEffect counter picks up where the capture left
        it and goes on ticking, once a second. The reducer still adds ten and
        takes five, the array still grows, and the context still changes its
        mind about whose name it holds — once, which is all it ever did.
        Nothing is rebuilt; the numbers are simply allowed to move again.</p>
        <p class="lj-charm">A comment in the custom hook: '"Payload" instead of "User[]" to make it genuinely generic :-]'</p>
      </div>
      <button class="lj-plaque-btn" type="button">Read the plaque →</button>
      <p class="lj-door"><a class="go" href="lehrjahre/react-hooks/index.html">Enter the exhibit →</a></p>
    </div>
```

- [ ] **Step 3: Gate the specimen against the source bytes**

The specimen is lines 67–77 of `CustomHookComponent.tsx`, dedented by their
common 16-space indent and HTML-escaped. Prove the round trip:

```python
import hashlib, html, pathlib, re

hall = pathlib.Path("/home/atakee/projects/eski-web-sayfalarim/lehrjahre.html").read_text()
block = re.search(
    r'Specimen — CustomHookComponent\.tsx.*?<pre class="specimen"><code>(.*?)</code></pre>',
    hall, re.S).group(1)
restored = "".join(" " * 16 + line + "\n" for line in html.unescape(block).split("\n"))
print(hashlib.md5(restored.encode()).hexdigest())
```

Expected: `172e9bfb69d6de3691f7c30d81f20cbe` — the md5 of
`sed -n '67,77p' src/components/CustomHookComponent.tsx` in the clone. If it
differs, the specimen was mangled (most likely trailing whitespace stripped
by the Edit tool) — restore it with a python rewrite and re-run.

- [ ] **Step 4: Write and run the hall test**

Create `/tmp/react-hooks-cycle7/test_hall.py`:

```python
import sys
from playwright.sync_api import sync_playwright

URL = "http://localhost:8765/lehrjahre.html"
# Address the card by its door href — the h3 also contains the date span, so
# matching on heading text is fragile, and other cards quote exhibit titles.
CARD = '.lj-card:has(a[href="lehrjahre/react-hooks/index.html"])'
fails = []
def check(name, got, want):
    if got != want:
        fails.append(f"{name}: got {got!r}, want {want!r}")

with sync_playwright() as p:
    b = p.chromium.launch()
    pg = b.new_page()
    errors, offsite = [], []
    pg.on("console", lambda m: errors.append(m.text) if m.type == "error" else None)
    pg.on("request", lambda r: offsite.append(r.url) if "localhost:8765" not in r.url else None)
    pg.goto(URL, wait_until="networkidle")

    # 19 = 18 plain cards + the epilogue card (class="lj-card lj-epilogue").
    # Count the plaques BEFORE opening one: the hall's wiring MOVES a plaque
    # into the dialog rather than cloning it, and moves it back on close.
    check("cards", pg.locator(".lj-card").count(), 19)
    check("plaques", pg.locator(".lj-plaque").count(), 19)
    check("plaque buttons", pg.locator(".lj-plaque-btn").count(), 19)
    check("react-hooks cards matched", pg.locator(CARD).count(), 1)
    card = pg.locator(CARD)
    check("react-hooks doors", card.locator(".lj-door").count(), 1)
    check("badge", card.locator(".lj-badge").inner_text().strip().lower(), "walkable · still ticking")
    check("heading", card.locator("h3").inner_text().strip(),
          "React-Hooks-with-TypeScript Apr 2023")

    # the plaque modal carries the specimen as text, not markup
    card.locator(".lj-plaque-btn").click()
    dialog = pg.locator("dialog.lj-dialog")
    check("dialog open", dialog.is_visible(), True)
    body = dialog.inner_text()
    check("specimen text present", "MapContainer" in body, True)
    check("specimen not live", dialog.locator("mapcontainer").count(), 0)
    check("door in modal", dialog.locator('a.go[href="lehrjahre/react-hooks/index.html"]').count(), 1)
    pg.keyboard.press("Escape")

    if errors: fails.append(f"console errors: {errors}")
    if offsite: fails.append(f"offsite requests: {offsite}")

    # the door actually goes somewhere
    pg.goto(URL)
    pg.locator(CARD + " .lj-door a").click()
    pg.wait_for_load_state()
    check("door lands", "lehrjahre/react-hooks/index.html" in pg.url, True)

    # JS off: every plaque is inline, no dialog needed
    ctx = b.new_context(java_script_enabled=False)
    pg2 = ctx.new_page()
    pg2.goto(URL)
    check("js-off plaque visible", pg2.locator(CARD + " .lj-plaque").is_visible(), True)
    b.close()

print("FAILS:", *fails, sep="\n  ") if fails else print("ALL CHECKS PASS")
sys.exit(1 if fails else 0)
```

Run it:

```bash
cd /home/atakee/projects/eski-web-sayfalarim
.superpowers/sdd/lehrjahre/tools/venv/bin/python /tmp/react-hooks-cycle7/test_hall.py
```

Expected: `ALL CHECKS PASS`. `CARD` matches on the door href, so it depends
on Step 2 having been applied; if `react-hooks cards matched` fails, the card
rewrite did not land.

- [ ] **Step 5: Prove the hall still requests nothing external**

The specimen now contains the literal string
`https://{s}.tile.openstreetmap.org/...` as escaped text inside a `<pre>`.
It must stay text:

```bash
cd /home/atakee/projects/eski-web-sayfalarim
grep -n 'src="https\?:\|href="https\?://[^"]*tile' lehrjahre.html   # expect no tile hit
```

The `offsite` assertion in the hall test already proves the page loads
nothing external; confirm it reported none.

- [ ] **Step 6: Kill the server and commit**

```bash
ss -lptn 'sport = :8765'
kill <pid>
cd /home/atakee/projects/eski-web-sayfalarim
git status --short          # only lehrjahre.html and assets/lehrjahre/react-hooks.png
git add lehrjahre.html assets/lehrjahre/react-hooks.png
git commit -m "Lehrjahre hall: React-Hooks card promoted to walkable"
```

---

### Task 4: Counts and provenance

**Files:**
- Modify: `lehrjahre.html:40`, `index.html:387` and `:392`, `README.md`

**Interfaces:**
- Consumes: the finished card from Task 3.
- Produces: nothing later tasks depend on. This is the last task.

- [ ] **Step 1: Find every site that names the count**

```bash
cd /home/atakee/projects/eski-web-sayfalarim
grep -rn "welve of them\|12 walkable\|count: twelve" *.html README.md
```

Expected exactly three HTML hits (`lehrjahre.html:40`, `index.html:387`,
`index.html:392`) and one README hit (`Walkable count: twelve.` inside the
2026-08-31 bullet). **The grep is the authority** — if it finds more, fix
them all; the README's historical bullet keeps its own past-tense count.

- [ ] **Step 2: Update the two shell pages**

In `lehrjahre.html`: `Twelve of them are walkable` → `Thirteen of them are walkable`.

In `index.html`: `Twelve of them are walkable; all of` → `Thirteen of them are walkable; all of`,
and `<span class="chip">12 walkable faces</span>` → `<span class="chip">13 walkable faces</span>`.

Leave the README's 2026-08-31 bullet alone — it records what was true then.

- [ ] **Step 3: Add the README provenance bullet**

Append to the end of the `### 7.` provenance list in `README.md`, after the
2026-09-01 bullet that ends "…six sub-exhibits promoted out of it.":

```markdown
- 2026-09-05: `lehrjahre/react-hooks/` — the hooks cheat sheet, captured
  from its private repo (`React-Hooks-with-TypeScript`, last commit April
  2023) while it was fetching its ten placeholder users, so the users are
  frozen as they arrived: fed, but with no pantry behind them, because the
  API returns the same roster every time. Stripping the scripts stops every
  hook on a page about hooks, so the face carries one curator-marked script
  — its only one — under a single rule: it may rewrite the text of a node
  the page already rendered, and nothing else. Under that rule the
  `useEffect` counter resumes ticking from the second the capture froze,
  and the `useReducer`, `useState` and `useContext` buttons answer again,
  the context one-way as in the original. `useRef` needed nothing: its ref
  was never used. No node is created, no data stored, no request made; with
  JavaScript off the page is the still capture. The hall card's specimen is
  the commented-out `<MapContainer>` block from
  `src/components/CustomHookComponent.tsx`, dedented by its common indent
  and otherwise verbatim. Walkable count: thirteen.
```

- [ ] **Step 4: Verify**

```bash
cd /home/atakee/projects/eski-web-sayfalarim
grep -rn "Thirteen of them are walkable" lehrjahre.html index.html   # 2 hits
grep -n "13 walkable faces" index.html                               # 1 hit
grep -rn "welve of them\|12 walkable" *.html                         # no hits
grep -n "Walkable count: thirteen." README.md                        # 1 hit
```

- [ ] **Step 5: Re-run the hall test after the copy edits**

Task 3's test ran before these words changed. Re-run it so the last edit to
`lehrjahre.html` is covered too:

```bash
cd /home/atakee/projects/eski-web-sayfalarim
python3 -m http.server 8765 > /tmp/react-hooks-cycle7/http.log 2>&1 &
.superpowers/sdd/lehrjahre/tools/venv/bin/python /tmp/react-hooks-cycle7/test_hall.py
ss -lptn 'sport = :8765'   # then kill <pid>
```

Expected: `ALL CHECKS PASS`.

- [ ] **Step 6: Commit**

```bash
cd /home/atakee/projects/eski-web-sayfalarim
git status --short     # only lehrjahre.html, index.html, README.md
git add lehrjahre.html index.html README.md
git commit -m "Walkable count thirteen; React-Hooks provenance"
```

- [ ] **Step 7: Final sweep before handing back**

```bash
cd /home/atakee/projects/eski-web-sayfalarim
git status --short                 # clean
git log --oneline b772dd3..HEAD    # the cycle's commits, nothing else
git diff --stat b772dd3..HEAD      # only the paths named in Global Constraints
ss -lptn 'sport = :4005'; ss -lptn 'sport = :8765'   # no servers left running
```

Then take the preview screenshots the user reviews before any push:
serve on 8765 and capture, at 1280×900 and at 390×844, (a) the hall scrolled
to the React-Hooks tile, (b) the open plaque with the specimen visible, and
(c) the face itself twice, three seconds apart, so the moved counter is
visible. Save them under `/tmp/react-hooks-cycle7/preview/` and list the
paths in the final report. Kill the server afterwards.

**Do not push.** The user pushes after previewing.


---

## Audit (2026-09-06)

Checked against the real files, not against this plan's own prose:

- **Specimen gate verified by running it.** The escaped block in Task 3 Step 2
  round-trips through `html.unescape` + a 16-space re-indent to md5
  `172e9bfb69d6de3691f7c30d81f20cbe`, and the restored text is a true
  substring of `CustomHookComponent.tsx`. The gate will pass on correct work
  and fail on mangled work.
- **Task 3's `old` block matches `lehrjahre.html` byte-for-byte** (checked
  programmatically). The replace will apply.
- **Fixed: `Antonette` expected once, actually twice** — the useMemo label and
  the Username field. The plan would have failed a correct capture.
- **Fixed: `grep -c` used for the jsonplaceholder check**, against this plan's
  own constraint (the captured DOM is one line). Now `grep -o … | wc -l`.
- **Fixed: two unguarded assumptions in the curator script** — the useState
  text slot is now confirmed to be a text node before it is written to, and
  the reducer readout is guarded against a missing first child. Without those
  a shape change would silently write into an element.
- **Fixed: no test covered Task 4's copy edits.** The hall test now re-runs
  after them.
- **Noted, not changed:** the hall wiring MOVES a plaque into the dialog
  instead of cloning it, so plaque counts must be taken before opening one —
  the test already does, and now says so. `.lj-card` legitimately counts 19
  because the epilogue card carries a second class.
- **Checked and correct:** counts sites are exactly `lehrjahre.html:40`,
  `index.html:387`, `index.html:392` and README's provenance bullet (a
  repo-wide grep found nothing else); `.lj-date` is inline, so the heading
  assertion reads "React-Hooks-with-TypeScript Apr 2023"; the captured face
  contains no `<script>`, no `jsonplaceholder`, no `fetch`/`localStorage`
  string that the Task 2 Step 5 sweep could trip over; the door-href card
  selector matches exactly one card.
