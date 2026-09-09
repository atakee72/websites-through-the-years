# GraphOL-server-example face — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Promote `GraphOL-server-example` to the wing's 14th walkable card — three frozen states of its GraphQL Playground, wired together with static links so the exhibit answers a query without a line of JavaScript.

**Architecture:** Run the Apollo server, capture its Playground three times in one sequence (query loaded → answered → schema drawer open) with the capture toolkit's two new flags, wrap three controls in plain anchors so the states link to each other, rewrite the hall card into a walkable tile with two specimens, and move the wing's counts.

**Tech Stack:** The existing toolkit (`.superpowers/sdd/lehrjahre/tools/capture_face.py`, `seal_check.sh`, `tools/venv/bin/python` with playwright + pillow), plain HTML, `python3 -m http.server 8765` for checks.

**Spec:** `docs/superpowers/specs/2026-09-08-graphol-face-design.md`

## Global Constraints

- Repo root is `/home/atakee/projects/eski-web-sayfalarim`; all relative paths are from there. Scratch goes in `/tmp/graphol-cycle8/` (`mkdir -p` it).
- **The face carries no script at all.** Every interaction is a static `<a>`. If a state cannot be reached without JavaScript, it is not wired.
- Sealed new artifact: zero external requests at view time, no live external links. After any hand-edit re-run `.superpowers/sdd/lehrjahre/tools/seal_check.sh lehrjahre/graphol` **and** `grep -rn "sourceMappingURL" lehrjahre/graphol` (must print nothing).
- Never reformat, prettify or lint a captured file. Captures are one long line — count with `grep -o … | wc -l`, never `grep -c`.
- Nothing is wired to a state that was not captured, and no state is shown that the app could not produce.
- Only these paths may change: `lehrjahre/graphol/**` (new), `assets/lehrjahre/graphol.png` (replaced), `lehrjahre.html`, `index.html`, `README.md`, `CLAUDE.md`. Every other face and archived exhibit stays byte-identical — check `git status --short` before each commit.
- The clone `.superpowers/sdd/lehrjahre/repos/GraphOL-server-example` is git-ignored scratch. Never `git add` from it; run `git diff --cached --name-only` before every commit.
- Commit messages simple, no Claude signature, no `Co-Authored-By`. Do NOT push — the owner previews first.
- Kill servers by PID (`ss -lptn 'sport = :PORT'` then `kill <pid>`). Never `pkill -f`.

**Already done during planning (do not redo):** the clone exists with `npm install` run; `capture_face.py` gained `--materialize-css` (writes CSSOM-only styled-components rules back into their `<style>` tags — without it the Playground freezes unstyled) and `--special` now accepts `key:<Key>` as well as a click selector. Both are in the git-ignored toolkit and were proven on a trial capture.

---

### Task 1: Capture the three states

**Files:**
- Create: `lehrjahre/graphol/{index,answered,schema}.html` and `lehrjahre/graphol/assets/*`

**Interfaces:**
- Produces three captured pages. Each contains exactly one occurrence of the play-button literal
  `<div class="sc-bwzfXH kJytub" title="Execute Query (Ctrl-Enter)"><svg height="35" viewbox="3.5,4.5,24,24" width="35"><path d="M 11 9 L 24 16 L 11 23 z"></path></svg></div>`;
  `index.html` and `answered.html` each contain one `<div class="sc-cJSrbW dcNxcw">Schema</div>`; `schema.html` contains one `<div class="sc-cJSrbW aBAlp">Schema</div>` (the active-tab variant). Task 2 wires exactly those literals.

- [ ] **Step 1: Confirm the clone**

```bash
mkdir -p /tmp/graphol-cycle8
cd /home/atakee/projects/eski-web-sayfalarim/.superpowers/sdd/lehrjahre/repos/GraphOL-server-example
git log --oneline -1        # expect one commit: "ReadMe file added"
ls node_modules >/dev/null && echo "deps present"   # else: npm install
```

- [ ] **Step 2: Start the Apollo server (port 4000, hardcoded in source — do not edit the source)**

```bash
cd /home/atakee/projects/eski-web-sayfalarim/.superpowers/sdd/lehrjahre/repos/GraphOL-server-example
nohup npm run start > /tmp/graphol-cycle8/dev.log 2>&1 &
until curl -s -o /dev/null -H "Accept: text/html" http://localhost:4000/; do sleep 1; done; echo READY
```

Expected: `🚀  Apollo server ready at: http://localhost:4000/` in the log. Note a plain `curl` without a browser-ish `Accept` header gets a 400 CSRF error — that is Apollo v4 behaviour, not a fault.

- [ ] **Step 3: Capture**

The query is the author's own first example, read straight from his notes file so nothing is retyped:

```bash
cd /home/atakee/projects/eski-web-sayfalarim
Q=$(python3 -c "
import urllib.parse
q=open('.superpowers/sdd/lehrjahre/repos/GraphOL-server-example/queryExamples.txt').read().split(chr(10)+chr(10))[0]
print(urllib.parse.quote(q))")
.superpowers/sdd/lehrjahre/tools/venv/bin/python .superpowers/sdd/lehrjahre/tools/capture_face.py \
  --base http://localhost:4000 --routes "/?query=$Q" \
  --special "/?query=$Q|key:Control+Enter|answered.html" \
  --special "/?query=$Q|text=\"Schema\"|schema.html" \
  --out lehrjahre/graphol --settle-ms 4000 --materialize-css \
  --backlink ../../lehrjahre.html --exhibit-title "GraphOL-server-example"
```

Expected: a `materialized css: 1 sheet(s), ~28000 chars` line, three `captured …` lines, and `done: 3 pages, 20 assets`. The specials run in sequence on the same page, which is why `schema.html` shows the drawer over the answer — that is intended.

- [ ] **Step 4: Verify the three states**

```bash
cd /home/atakee/projects/eski-web-sayfalarim
for f in index answered schema; do
  echo "-- $f"
  grep -o '<script' lehrjahre/graphol/$f.html | wc -l          # expect 0
  grep -o 'Mehmet Seven' lehrjahre/graphol/$f.html | wc -l     # index 0, answered/schema 1
  grep -o 'user_id' lehrjahre/graphol/$f.html | wc -l          # index 0, answered 0, schema 1
  grep -o 'Execute Query (Ctrl-Enter)' lehrjahre/graphol/$f.html | wc -l   # expect 1 each
  grep -o 'curator-bar' lehrjahre/graphol/$f.html | wc -l      # expect 1 each
done
# the styled-components CSS must have been written back into the page:
python3 -c "
import re, pathlib
for f in ['index','answered','schema']:
    s = pathlib.Path(f'lehrjahre/graphol/{f}.html').read_text()
    big = max(len(x) for x in re.findall(r'<style[^>]*>(.*?)</style>', s, re.S))
    print(f, 'largest style block:', big, 'OK' if big > 20000 else 'TOO SMALL — --materialize-css did not take')
"

grep -o 'localhost:4000' lehrjahre/graphol/index.html | wc -l  # >=1: the Playground's own URL bar, authentic
```

Do NOT grep the schema state for `type Comment`: the drawer renders every token
in its own `<span>`, so that literal never appears in the markup even though the
rendered text reads correctly. `user_id` is a schema-only field name and is the
reliable marker (the captured query never asks for it, so it cannot leak into
the other two states).

If `answered.html` has no "Mehmet Seven", the `Control+Enter` special did not fire — stop and report; Tasks 2 and 3 depend on it.

- [ ] **Step 5: Render check — every panel must actually have height**

Greps prove text is present; they cannot see a panel collapsed to zero height.
The schema drawer is a separate CodeMirror instance and is the one at risk.

```bash
cd /home/atakee/projects/eski-web-sayfalarim
nohup python3 -m http.server 8765 > /tmp/graphol-cycle8/http.log 2>&1 &
until curl -s -o /dev/null http://localhost:8765/; do sleep 1; done
```

```python
from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b = p.chromium.launch(); pg = b.new_page(viewport={"width": 1440, "height": 900})
    for f in ["index", "answered", "schema"]:
        pg.goto(f"http://localhost:8765/lehrjahre/graphol/{f}.html", wait_until="networkidle")
        pg.wait_for_timeout(1000)
        h = pg.evaluate("() => Array.from(document.querySelectorAll('.CodeMirror'))"
                        ".map(el => Math.round(el.getBoundingClientRect().height))")
        print(f, h)
    b.close()
```

Expected: `index` and `answered` → `[746, 0, 754]`; `schema` → `[746, 0, 754, 759]`.
The editor and response panes must be ~750 tall, and **the schema state must have
a fourth CodeMirror taller than 300** — that is the drawer. The lone `0` is the
collapsed tracing panel, which is collapsed in the live app too. Kill the server
by PID afterwards.

If the fourth number is 0, the materialized CSS is incomplete — stop and report;
do not proceed to Task 2 on a capture whose drawer is invisible.

- [ ] **Step 6: Seal check**

```bash
cd /home/atakee/projects/eski-web-sayfalarim
.superpowers/sdd/lehrjahre/tools/seal_check.sh lehrjahre/graphol
grep -rn "sourceMappingURL" lehrjahre/graphol    # expect no output
ls lehrjahre/graphol/assets | wc -l              # expect 20 (see note)
```

Expected: `SEALED: lehrjahre/graphol`. The assets include the Playground's CDN
stylesheet and the Google Fonts `woff2` files, all now local. Three trial
captures each produced exactly 20, but that count is font-subset dependent: if
it comes out a little different, judge the **seal**, not the number.

- [ ] **Step 7: Kill the servers and commit**

```bash
ss -lptn 'sport = :4000'; ss -lptn 'sport = :8765'   # read the pid, then: kill <pid>
cd /home/atakee/projects/eski-web-sayfalarim
git add lehrjahre/graphol
git diff --cached --name-only    # every path must start with lehrjahre/graphol/
git commit -m "GraphOL: playground captured in three states"
```

---

### Task 2: Wire the controls

**Files:**
- Modify: `lehrjahre/graphol/{index,answered,schema}.html`
- Test: `/tmp/graphol-cycle8/test_face.py` (scratch)

**Interfaces:**
- Produces an exhibit where Play goes to the answer and the Schema tab opens and closes the drawer, with JavaScript on **or** off. Task 3's plaque describes exactly this.

- [ ] **Step 1: Write the failing test**

Create `/tmp/graphol-cycle8/test_face.py`:

```python
import sys
from playwright.sync_api import sync_playwright

B = "http://localhost:8765/lehrjahre/graphol/"
fails = []
def check(name, got, want):
    if got != want:
        fails.append(f"{name}: got {got!r}, want {want!r}")

def walk(ctx, label):
    # Step 2 runs this before anything is wired, when the anchors do not exist
    # yet: catch the lookup failure so the baseline prints its fails instead of
    # dying with a traceback.
    try:
        _walk(ctx, label)
    except Exception as e:
        fails.append(f"{label}: {type(e).__name__} {str(e).splitlines()[0][:90]}")

def _walk(ctx, label):
    pg = ctx.new_page(); pg.set_viewport_size({"width": 1280, "height": 800})
    pg.goto(B + "index.html"); pg.wait_for_load_state()
    check(f"{label} index has no answer", "Mehmet Seven" in pg.inner_text("body"), False)
    # force=True skips only Playwright's click-stability wait. The page has an
    # infinite CSS animation (the Playground's "Polling Schema" dot), so that
    # wait never settles — while a real mouse click works fine, JS on or off.
    pg.locator('div[title="Execute Query (Ctrl-Enter)"]').click(force=True); pg.wait_for_load_state()
    check(f"{label} play lands", pg.url.split("/")[-1], "answered.html")
    check(f"{label} answer shown", "Mehmet Seven" in pg.inner_text("body"), True)
    # The Playground's CSS lives in the CSSOM; without --materialize-css the
    # capture freezes as one unstyled column and the answer slides to the far
    # left. Styled it sits in the right pane (x~866); unstyled, x~144.
    box = pg.get_by_text("Mehmet Seven").first.bounding_box()
    check(f"{label} answer is in the right pane", bool(box and box["x"] > 500), True)
    pg.locator('a[href="schema.html"]').click(force=True); pg.wait_for_load_state()
    check(f"{label} schema lands", pg.url.split("/")[-1], "schema.html")
    check(f"{label} schema shown", "type Comment" in pg.inner_text("body"), True)
    # the drawer is its own CodeMirror; it must have height, not just text
    dh = pg.evaluate("() => { const c = document.querySelectorAll('.CodeMirror');"
                     " return c.length ? Math.round(c[c.length-1].getBoundingClientRect().height) : 0; }")
    check(f"{label} drawer has height", dh > 300, True)
    # Both the Play button and the active Schema tab point at answered.html here,
    # so select the tab explicitly — .last would pass even if only Play were wired.
    tab = pg.locator('a[href="answered.html"]:not(:has(svg))')
    check(f"{label} schema tab is the wired one", tab.count(), 1)
    tab.click(force=True); pg.wait_for_load_state()
    check(f"{label} drawer closes", pg.url.split("/")[-1], "answered.html")
    pg.close()

with sync_playwright() as p:
    b = p.chromium.launch()
    walk(b.new_context(), "JS-on")
    walk(b.new_context(java_script_enabled=False), "JS-off")

    # index's Schema tab must stay inert: there is no capture of the drawer
    # over an unanswered pane, so nothing may link there from index.html.
    pg = b.new_page()
    pg.goto(B + "index.html"); pg.wait_for_load_state()
    check("index schema inert", pg.locator('a[href="schema.html"]').count(), 0)

    # seal + hygiene, with the page fully settled
    off, bad, errs = [], [], []
    for name in ["index.html", "answered.html", "schema.html"]:
        p2 = b.new_page()
        p2.on("request", lambda r: off.append(r.url) if "localhost:8765" not in r.url else None)
        p2.on("response", lambda r: bad.append(f"{r.status} {r.url[-40:]}") if r.status >= 400 else None)
        p2.on("console", lambda m: errs.append(m.text) if m.type == "error" else None)
        p2.goto(B + name, wait_until="networkidle"); p2.wait_for_timeout(1200)
        p2.close()
    if off: fails.append(f"offsite requests: {sorted(set(off))}")
    if bad: fails.append(f"bad responses: {bad}")
    if errs: fails.append(f"console errors: {errs}")
    b.close()

print("FAILS:", *fails, sep="\n  ") if fails else print("ALL CHECKS PASS")
sys.exit(1 if fails else 0)
```

- [ ] **Step 2: Run it and watch it fail**

```bash
mkdir -p /tmp/graphol-cycle8
cd /home/atakee/projects/eski-web-sayfalarim
nohup python3 -m http.server 8765 > /tmp/graphol-cycle8/http.log 2>&1 &
until curl -s -o /dev/null http://localhost:8765/; do sleep 1; done
.superpowers/sdd/lehrjahre/tools/venv/bin/python /tmp/graphol-cycle8/test_face.py
```

Expected: FAILS — clicking Play goes nowhere; the states are three islands.

- [ ] **Step 3: Wire the three controls**

Each control is wrapped in an anchor with `style="display:contents"`, which adds no box of its own, so the Playground's flex layout is untouched and the click still navigates (verified during planning, JS on and off). Run this with `python3`, not the Edit tool:

```python
import pathlib

PLAY = ('<div class="sc-bwzfXH kJytub" title="Execute Query (Ctrl-Enter)">'
        '<svg height="35" viewbox="3.5,4.5,24,24" width="35">'
        '<path d="M 11 9 L 24 16 L 11 23 z"></path></svg></div>')
TAB_IDLE   = '<div class="sc-cJSrbW dcNxcw">Schema</div>'
TAB_ACTIVE = '<div class="sc-cJSrbW aBAlp">Schema</div>'
NOTE = ("<!-- Museum addition: this control is dead HTML in a frozen page, so the "
        "curator wrapped it in a plain link to the state the click actually produced "
        "on capture day. No script; it works with JavaScript off. -->")

def wrap(el, href):
    return f'{NOTE}<a href="{href}" style="display:contents">{el}</a>'

plan = {
    # index: Play reaches the answer. Its Schema tab stays INERT on purpose —
    # no capture exists of the drawer over an unanswered pane.
    "index.html":    [(PLAY, "answered.html")],
    # answered: Play re-runs and returns the same answer; Schema opens the drawer.
    "answered.html": [(PLAY, "answered.html"), (TAB_IDLE, "schema.html")],
    # schema: the active tab closes the drawer, back to the answer beneath it.
    "schema.html":   [(PLAY, "answered.html"), (TAB_ACTIVE, "answered.html")],
}

base = pathlib.Path("/home/atakee/projects/eski-web-sayfalarim/lehrjahre/graphol")
for fname, items in plan.items():
    p = base / fname
    s = p.read_text()
    for el, href in items:
        assert s.count(el) == 1, f"{fname}: expected exactly one {el[:50]}…"
        s = s.replace(el, wrap(el, href))
    p.write_text(s)
    print(fname, "wired:", len(items))
```

- [ ] **Step 4: Run the test again**

```bash
cd /home/atakee/projects/eski-web-sayfalarim
.superpowers/sdd/lehrjahre/tools/venv/bin/python /tmp/graphol-cycle8/test_face.py
```

Expected: `ALL CHECKS PASS`.

- [ ] **Step 5: Re-seal and confirm no script crept in**

```bash
cd /home/atakee/projects/eski-web-sayfalarim
.superpowers/sdd/lehrjahre/tools/seal_check.sh lehrjahre/graphol
grep -rn "sourceMappingURL" lehrjahre/graphol                       # no output
grep -o '<script' lehrjahre/graphol/*.html | wc -l                  # expect 0
grep -o 'onclick=\|javascript:' lehrjahre/graphol/*.html | wc -l    # expect 0
grep -o 'display:contents' lehrjahre/graphol/*.html | wc -l         # expect 5
```

- [ ] **Step 6: Kill the server and commit**

```bash
ss -lptn 'sport = :8765'   # read the pid, then: kill <pid>
cd /home/atakee/projects/eski-web-sayfalarim
git add lehrjahre/graphol
git diff --cached --name-only    # only the three lehrjahre/graphol/*.html files
git commit -m "GraphOL: play and schema wired between the frozen states"
```

---

### Task 3: Thumbnail and hall card

**Files:**
- Replace: `assets/lehrjahre/graphol.png` (640×360)
- Modify: `lehrjahre.html` (the card at lines 273–286)
- Test: `/tmp/graphol-cycle8/test_hall.py` (scratch)

- [ ] **Step 1: Shoot the thumbnail from the answered state**

```bash
mkdir -p /tmp/graphol-cycle8
cd /home/atakee/projects/eski-web-sayfalarim
nohup python3 -m http.server 8765 > /tmp/graphol-cycle8/http.log 2>&1 &
until curl -s -o /dev/null http://localhost:8765/; do sleep 1; done
```

Then with `.superpowers/sdd/lehrjahre/tools/venv/bin/python`:

```python
from playwright.sync_api import sync_playwright
from PIL import Image

with sync_playwright() as p:
    b = p.chromium.launch()
    pg = b.new_page(viewport={"width": 1280, "height": 720})
    pg.goto("http://localhost:8765/lehrjahre/graphol/answered.html", wait_until="networkidle")
    pg.wait_for_timeout(1500)
    pg.screenshot(path="/tmp/graphol-cycle8/face-full.png")
    b.close()

im = Image.open("/tmp/graphol-cycle8/face-full.png").convert("RGB").resize((640, 360), Image.LANCZOS)
im.save("/home/atakee/projects/eski-web-sayfalarim/assets/lehrjahre/graphol.png")
print(Image.open("/home/atakee/projects/eski-web-sayfalarim/assets/lehrjahre/graphol.png").size)
```

Expected: `(640, 360)`, matching every other thumbnail in that folder.

- [ ] **Step 2: Rewrite the card**

In `lehrjahre.html`, replace exactly this block:

```html
    <div class="lj-card">
      <span class="lj-badge quiet">catalogue only</span>
      <h3>GraphOL-server-example <span class="lj-date">Mar 2023</span></h3>
      <div class="lj-shot"><img src="assets/lehrjahre/graphol.png" alt="GraphQL Playground answering a users query" loading="lazy"></div>
      <p class="lj-hook">My first GraphQL server; the typo in the name shipped.</p>
      <div class="lj-plaque">
        <p>My first GraphQL server — the typo in the name shipped, and stuck. Two
        Turkish-named users, three posts, four comments, all hardcoded; its only
        face was the query playground, photographed here mid-answer.</p>
        <p class="lj-charm">The fake data gives up halfway through: the last comments are "foo bar" and "foo bar baz".</p>
      </div>
      <button class="lj-plaque-btn" type="button">Read the plaque →</button>
    </div>
```

with:

```html
    <div class="lj-card">
      <span class="lj-badge">walkable · answered</span>
      <h3>GraphOL-server-example <span class="lj-date">Mar 2023</span></h3>
      <div class="lj-shot"><a href="lehrjahre/graphol/index.html"><img src="assets/lehrjahre/graphol.png" alt="GraphQL Playground answering a users query" loading="lazy"></a></div>
      <p class="lj-hook">A server with no website. Press Play and 2023 answers.</p>
      <div class="lj-plaque">
        <p>My first GraphQL server — the typo in the name shipped, and stuck. Two
        Turkish-named users, three posts, four comments, all hardcoded; its only
        face was the query playground, and it is the whole exhibit: a server
        that never had a website.</p>
        <p>The query waiting in the editor is his own, copied out of the notes
        file he kept while learning. Press Play and the answer comes back — not
        computed, but the one the server actually gave on capture day. The
        Schema tab opens the shape he had built: users with posts, posts with
        comments, everything pointing at everything else. Nothing here runs;
        three frozen pages simply link to each other, so the exhibit needs no
        JavaScript at all. One thing did survive the freeze on its own: in the
        corner a small light still pulses, labelled "Polling Schema" — an
        animation that needs no script, keeping watch over a server that
        stopped answering in 2023.</p>
        <div class="specimen-label">Specimen — src/data.ts, the whole cast</div>
        <pre class="specimen"><code>const comments = [
  { id: "1", text: "This is Ahmet's comment", post_id: "1", user_id: "2" },
  { id: "2", text: "Mehmet's comment", post_id: "1", user_id: "1" },
  { id: "3", text: "foo bar", post_id: "2", user_id: "2" },
  { id: "4", text: "foo bar baz", post_id: "3", user_id: "1" },
];</code></pre>
        <p>Beside the code he kept a second file, <code>theirResponses.txt</code>,
        where he pasted the answers the server gave him. It has fallen out of
        step: the saved replies are still in Turkish, from before he translated
        his own test data into English. The notes are older than the code, and
        neither was ever told about the other.</p>
        <div class="specimen-label">Specimen — theirResponses.txt, an answer to a question no longer asked</div>
        <pre class="specimen"><code>{
  "id": "1",
  "text": "Bu Ahmet'in yorumudur",
  "post_id": "1",
  "user": {
    "id": "2",
    "fullName": "Ahmet Günal"
  },
  "post": {
    "id": "1",
    "title": "Mehmet'in gönderisi"
  }
},</code></pre>
        <p class="lj-charm">The fake data gives up halfway through: the last comments are "foo bar" and "foo bar baz".</p>
      </div>
      <button class="lj-plaque-btn" type="button">Read the plaque →</button>
      <p class="lj-door"><a class="go" href="lehrjahre/graphol/index.html">Enter the exhibit →</a></p>
    </div>
```

- [ ] **Step 3: Gate both specimens against their sources**

Specimen 1 is `src/data.ts` lines 15–20 verbatim (no dedent). Specimen 2 is `theirResponses.txt` lines 4–16, dedented by their common 6-space indent. Prove both round-trip:

```python
import hashlib, html, pathlib, re

hall = pathlib.Path("/home/atakee/projects/eski-web-sayfalarim/lehrjahre.html").read_text()

def block(label):
    return re.search(r'Specimen — ' + label + r'.*?<pre class="specimen"><code>(.*?)</code></pre>',
                     hall, re.S).group(1)

data_ts = "".join(line + "\n" for line in html.unescape(block(r'src/data\.ts')).split("\n"))
print("data.ts       ", hashlib.md5(data_ts.encode()).hexdigest(), "want 4de9c61b413b2583a9ba7f1ba4817101")

resp = "".join(" " * 6 + line + "\n" for line in html.unescape(block(r'theirResponses\.txt')).split("\n"))
print("theirResponses", hashlib.md5(resp.encode()).hexdigest(), "want ae0b22daf96d652648b4980410c206ce")
```

Both must match. If one does not, the specimen was mangled in transit (most likely trailing whitespace stripped) — repair it with a python rewrite, never by editing the gate.

- [ ] **Step 4: Write and run the hall test**

Create `/tmp/graphol-cycle8/test_hall.py`:

```python
import sys
from playwright.sync_api import sync_playwright

URL = "http://localhost:8765/lehrjahre.html"
# Address the card by its door href: the h3 also contains the date span, and
# other cards quote exhibit titles in their prose.
CARD = '.lj-card:has(a[href="lehrjahre/graphol/index.html"])'
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
    # Count plaques BEFORE opening one: the hall's wiring MOVES a plaque into
    # the dialog rather than cloning it, and moves it back on close.
    check("cards", pg.locator(".lj-card").count(), 19)
    check("plaques", pg.locator(".lj-plaque").count(), 19)
    check("plaque buttons", pg.locator(".lj-plaque-btn").count(), 19)
    check("doors", pg.locator(".lj-door").count(), 16)
    check("graphol card matched", pg.locator(CARD).count(), 1)

    card = pg.locator(CARD)
    check("badge", card.locator(".lj-badge").inner_text().strip().lower(), "walkable · answered")
    check("card doors", card.locator(".lj-door").count(), 1)

    card.locator(".lj-plaque-btn").click()
    dialog = pg.locator("dialog.lj-dialog")
    check("dialog open", dialog.is_visible(), True)
    body = dialog.inner_text()
    check("specimen 1 present", "foo bar baz" in body, True)
    check("specimen 2 present", "Bu Ahmet'in yorumudur" in body, True)
    check("specimens escaped", dialog.locator("pre.specimen").count(), 2)
    check("door in modal", dialog.locator('a.go[href="lehrjahre/graphol/index.html"]').count(), 1)
    pg.keyboard.press("Escape")

    if errors: fails.append(f"console errors: {errors}")
    if offsite: fails.append(f"offsite requests: {offsite}")

    pg.goto(URL)
    pg.locator(CARD + " .lj-door a").click()
    pg.wait_for_load_state()
    check("door lands", "lehrjahre/graphol/index.html" in pg.url, True)

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
.superpowers/sdd/lehrjahre/tools/venv/bin/python /tmp/graphol-cycle8/test_hall.py
```

Expected: `ALL CHECKS PASS`.

- [ ] **Step 5: Kill the server and commit**

```bash
ss -lptn 'sport = :8765'   # read the pid, then: kill <pid>
cd /home/atakee/projects/eski-web-sayfalarim
git status --short         # only lehrjahre.html and assets/lehrjahre/graphol.png
git add lehrjahre.html assets/lehrjahre/graphol.png
git commit -m "Lehrjahre hall: GraphOL card promoted to walkable"
```

---

### Task 4: Counts, provenance and toolkit note

**Files:**
- Modify: `lehrjahre.html`, `index.html`, `README.md`, `CLAUDE.md`

- [ ] **Step 1: Find every count site**

```bash
cd /home/atakee/projects/eski-web-sayfalarim
grep -rn "hirteen of the cards\|fifteen faces\|Ten of them\|10 of 15" *.html
```

Expected exactly four hits, on four separate lines: two in `lehrjahre.html`
("Thirteen of the cards below are" and, two lines later, "they open fifteen
faces" — the paragraph wraps), and two in `index.html` ("Ten of them" and the
`10 of 15 walkable` chip). **The grep is the authority** — if it finds more, fix
them all.

- [ ] **Step 2: Move the counts**

In `lehrjahre.html`: `Thirteen of the cards below are` → `Fourteen of the cards below are`, and `they open fifteen faces` → `they open sixteen faces`.

In `index.html`: `Ten of them left a page you can still` → `Eleven of them left a page you can still`, and `<span class="chip">10 of 15 walkable</span>` → `<span class="chip">11 of 15 walkable</span>`.

Leave the README's dated provenance bullets alone — they are a log and record what was true on their date.

- [ ] **Step 3: Add the README provenance bullet**

Append to the end of the `### 7.` provenance list in `README.md`, after the 2026-09-05 bullet that ends "Walkable count: thirteen.":

```markdown
- 2026-09-08: `lehrjahre/graphol/` — the GraphQL server that never had a
  website. Its only face was the Apollo Playground it served at `/`, so the
  museum captured that, three times in one sequence: the editor holding the
  author's own `getAllUsers` query (read out of his `queryExamples.txt` and
  prefilled through the Playground's `?query=` parameter), then the same page
  after Ctrl+Enter with the server's real answer in the right pane, then the
  Schema drawer opened over it. Two toolkit additions made this possible and
  are noted in CLAUDE.md: `--materialize-css`, because the Playground styles
  itself with styled-components, which keeps its rules in the CSSOM and would
  otherwise have frozen to an unstyled page; and `key:` specials, because
  Ctrl+Enter is how a query is run. The exhibit carries **no script**: the
  Play button and the Schema tab are wrapped in plain links between the three
  frozen states, so it works with JavaScript off. The Schema tab on the first
  page is deliberately inert — there is no capture of the drawer over an
  unanswered pane, and the museum does not manufacture states. The Playground's
  own stylesheet and its Google Fonts are localized; the exhibit requests
  nothing. Hall specimens: the comments array from `src/data.ts`, and a slice
  of `theirResponses.txt` — the answers he pasted into his notes, still in the
  Turkish he later translated out of the code. Walkable count: fourteen; the
  wing now opens sixteen faces.
```

- [ ] **Step 4: Note the new flags in CLAUDE.md**

In the "App-freezing toolkit" bullet under "Recovery tooling", after the sentence ending "…injects the curator bar", add:

```
  `--materialize-css` writes CSSOM-only rules (styled-components and friends,
  which leave `<style>` tags empty in a serialized snapshot) back into the DOM
  before capture; `--special` accepts `key:<Key>` as well as a click selector,
  for apps driven by a keystroke.
```

Keep the surrounding wording and the mention of `--backlink` intact.

- [ ] **Step 5: Verify**

```bash
cd /home/atakee/projects/eski-web-sayfalarim
grep -n "Fourteen of the cards below are" lehrjahre.html      # 1 hit
grep -n "they open sixteen faces" lehrjahre.html              # 1 hit
grep -n "Eleven of them left a page" index.html               # 1 hit
grep -n "11 of 15 walkable" index.html                        # 1 hit
grep -rn "hirteen of the cards\|fifteen faces\|Ten of them\|10 of 15" *.html   # no hits
grep -n "Walkable count: fourteen" README.md                  # 1 hit
grep -n "materialize-css" CLAUDE.md                           # 1 hit
```

- [ ] **Step 6: Re-run the hall test after the copy edits**

Task 3's test ran before these words changed:

```bash
cd /home/atakee/projects/eski-web-sayfalarim
nohup python3 -m http.server 8765 > /tmp/graphol-cycle8/http.log 2>&1 &
until curl -s -o /dev/null http://localhost:8765/; do sleep 1; done
.superpowers/sdd/lehrjahre/tools/venv/bin/python /tmp/graphol-cycle8/test_hall.py
ss -lptn 'sport = :8765'   # then kill <pid>
```

Expected: `ALL CHECKS PASS`.

- [ ] **Step 7: Commit**

```bash
cd /home/atakee/projects/eski-web-sayfalarim
git status --short     # only lehrjahre.html, index.html, README.md, CLAUDE.md
git add lehrjahre.html index.html README.md CLAUDE.md
git commit -m "Walkable count fourteen; GraphOL provenance and toolkit note"
```

- [ ] **Step 8: Final sweep and preview shots**

```bash
cd /home/atakee/projects/eski-web-sayfalarim
git status --short                 # clean
git log --oneline 3e27479..HEAD    # this cycle's commits, nothing else
git diff --stat 3e27479..HEAD      # only the paths named in Global Constraints
ss -lptn 'sport = :4000'; ss -lptn 'sport = :8765'   # nothing listening
```

Then serve on 8765 and capture, at 1280×900 and 390×844: (a) the hall scrolled to the GraphOL tile, (b) its plaque open with both specimens visible, (c) each of the three exhibit states. Save under `/tmp/graphol-cycle8/preview/` with self-describing names, list the paths in the final report, and kill the server.

**Do not push.** The owner pushes after previewing.


---

## Audit (2026-09-09)

Checked against the real files and three trial captures, not against this plan's prose:

- **Fixed: the schema-state verification could never have passed.** Task 1 Step 4
  grepped `schema.html` for `type Comment`, but the drawer renders each token in
  its own `<span class="cm-atom">`, so the literal appears **zero** times.
  Replaced with `user_id`, a schema-only field the captured query never asks for
  (verified: schema 1, answered 0, index 0). The browser tests were never
  affected — they read `inner_text`, not markup.
- **Fixed: a test that would have passed on half-done work.** On `schema.html`
  both the Play button and the active Schema tab point at `answered.html`, so
  `.last.click()` proved nothing about the tab. The test now selects the tab
  explicitly (`a[href="answered.html"]:not(:has(svg))`) and asserts there is
  exactly one such anchor.
- **Fixed: the count-site grep was described as two lines; it is four.** The
  hall's sentence wraps, so "Thirteen of the cards below are" and "they open
  fifteen faces" are two lines apart.
- **Added:** a `curator-bar` presence check per state in Task 1.
- **Verified the riskiest assumption — styled-components class hashes are
  stable.** Task 2 keys on literals containing runtime-generated class names
  (`sc-bwzfXH kJytub`, `sc-cJSrbW dcNxcw`, `sc-cJSrbW aBAlp`). Across three
  separate capture runs in three separate browser sessions, each literal
  appeared exactly once, unchanged — the CDN version is pinned at 1.7.42, so the
  hashes are deterministic. And if that ever stops being true, the `assert
  s.count(el) == 1` in Task 2 fails loudly rather than silently wiring nothing.
- **Verified by running:** both specimen md5 gates already return their target
  hashes on the exact escaped blocks written into Task 3, and both restored
  texts are true substrings of their source files; Task 3's `old` block matches
  `lehrjahre.html` byte-for-byte; all four count strings exist where Task 4
  expects them; README's `### 7.` really does end with the 2026-09-05 bullet
  ("Walkable count: thirteen."); `CLAUDE.md` contains the sentence Task 4
  appends to; the hall currently has 15 doors, so the test's expected 16 is
  right; the capture contains no `onclick=`/`javascript:` (so Task 2's
  zero-expectation is sound) and `display:contents` will appear exactly 5 times
  (1 + 2 + 2).
- **Noted, not changed:** `index.html` keeps the Playground's own
  `http://localhost:4000/` URL bar. That is authentic — this whole wing ran on
  localhost — and it is inert text in a frozen page, not a link.


## Audit, second pass (2026-09-09)

Attacking what the first pass did not touch, and re-testing what that pass
itself introduced:

- **Fixed: nothing in the plan could tell whether `--materialize-css` worked.**
  This is the one failure that actually happened during planning — without the
  flag the Playground freezes to an unstyled column — and every check in the
  plan would still have passed. Task 1 now asserts the largest `<style>` block
  exceeds 20,000 characters (measured: 28,058 with the flag, 11,638 without),
  and Task 2's test now asserts the answer renders in the right-hand pane
  (measured: x≈866 styled, x≈144 unstyled — a threshold of 500 separates them
  cleanly).
- **Fixed: the baseline "watch it fail" run would have crashed, not failed.**
  Before wiring there is no `a[href="schema.html"]`, so the locator raises
  `TimeoutError` and the script dies with a traceback instead of printing its
  FAILS list — exactly the kind of thing that makes an implementer think the
  harness is broken. The walk is now wrapped so a lookup failure is recorded as
  a failing check.
- **Fixed: the asset count was written as a hard expectation.** Google Fonts
  serves unicode-range subsets, so 20 is not a law. Softened, with the seal
  named as the thing that actually matters.
- **Re-tested the selector the first audit introduced.** `a[href="answered.html"]:not(:has(svg))`
  is not obviously supported by Playwright's CSS engine — I had written it
  without running it. Verified against the wired trial: supported, and it
  matches exactly one element (the Schema tab), with `:has(svg)` matching
  exactly the other (the Play button).


## Fix round 1 — the schema drawer froze at zero height (2026-09-09)

Task 1's review rendered the pages instead of only grepping them and found the
Schema drawer present in the markup but **0px tall**: the exhibit's third state
showed an empty panel. Root cause was in the capture toolkit, not the
implementer's work: `--materialize-css` wrote the recovered rules *into the
app's own `<style>` node*, which replaces the sheet styled-components holds a
reference to, and it then skipped that node on later passes because it now had
text. Every rule the injector added afterwards — including the layout rules for
the drawer, mounted only when it opens — was therefore lost from the second and
third captures.

The materializer now writes into a separate museum-owned `<style
data-museum-css>` element, rebuilt from the full CSSOM on every pass and never
read back into itself, leaving the app's own style nodes untouched. Re-captured
and measured: the drawer renders at 759px, matching the live page exactly.

Both the plan and its tests gained a render check (Task 1 Step 5, and a drawer
assertion in Task 2's walk), because no grep can see a collapsed panel — the
same blind spot that let this reach review.
