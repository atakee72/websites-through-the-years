# Lehrjahre Hall Plaque Modals Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the 15 rich catalogue cards on `lehrjahre.html` into compact tiles whose full copy opens in a plaque modal, with JS-off degrading to today's inline page.

**Architecture:** Progressive enhancement in one page: plaque content stays as hidden-under-`.js` HTML inside each card; a shared `<dialog>` receives the card's plaque node (moved, not cloned) on open and returns it on close. All JS inline in `lehrjahre.html`, all CSS appended to the `/* lehrjahre */` block of `assets/museum.css`.

**Tech Stack:** Hand-written HTML/CSS + ~50 lines vanilla JS (native `<dialog>`). No build step, no libraries.

**Spec:** `docs/superpowers/specs/2026-08-30-lehrjahre-hall-plaque-modals-design.md`

## Global Constraints

- Shell page: **zero external requests** — `lehrjahre.html` loads only `assets/museum.css` (+ same-host images). Verify with `performance.getEntriesByType('resource')` → same-host only.
- Only `lehrjahre.html`, `assets/museum.css`, and one README line change. **No file under `lehrjahre/`, `assets/lehrjahre/`, or any archived exhibit folder is touched.**
- Existing card copy is **moved, never retyped** — every paragraph, screenshot tag, and charm line must survive byte-identical (em-dashes, `·`, `„"`, `~`, `😆` etc.). The only NEW text: the intro sentence and the 15 hooks, verbatim from this plan.
- JS off ⇒ all plaques render inline in their cards, no visible `Read the plaque` buttons, door links work.
- Walkable tiles: door link and screenshot-link into the exhibit stay on the tile; entering a face never requires the modal.
- Commits: simple messages, **no Claude signature / no Co-Authored-By**. Do NOT push — the user previews first.
- Serve for tests with `python3 -m http.server 8765` from repo root; browser checks via the toolkit venv `.superpowers/sdd/lehrjahre/tools/venv/bin/python` (playwright, bundled chromium).

`$SCRATCH` in this plan = `/tmp/claude-1000/-home-atakee-projects-eski-web-sayfalarim/48efd0d1-7db7-47bf-b550-98f7a8711c2b/scratchpad`

---

### Task 1: The modal mechanism (CSS + dialog + scripts), cards untouched

**Files:**
- Modify: `lehrjahre.html` (head-of-body script, shared dialog, wiring script, intro sentence)
- Modify: `assets/museum.css` (extend the `/* lehrjahre */` block, lines ~210–221)

**Interfaces:**
- Produces: class contract consumed by Task 2 — `.lj-hook` (tile one-liner), `.lj-plaque` (hidden detail block inside a card), `.lj-plaque-btn` (JS-only open button), `.lj-dialog` / `.lj-plaque-slot` / `.lj-close` (shared modal). Wiring behavior: button click opens; `h3` click opens; `.lj-shot` click opens **only when the shot contains no `<a>`**; close returns the plaque node into its card immediately before that card's `.lj-plaque-btn`.

- [ ] **Step 1: Add the `.js` flag script.** In `lehrjahre.html`, immediately after `<body>` insert:

```html
<script>document.documentElement.className='js';</script>
```

- [ ] **Step 2: Add the intro sentence.** In the intro section, the sentence `The rest are catalogue cards.` is followed by ` Where a card quotes…`. Change so the paragraph reads `…The rest are catalogue cards. Every card opens its plaque — click one. Where a card quotes something in monospace, it is quoted verbatim.` (exactly this new sentence, em-dash `—`).

- [ ] **Step 3: Add the shared dialog.** Immediately after the closing `</section>` of the catalogue section (the one containing `.lj-grid`), insert:

```html
<dialog class="lj-dialog" aria-label="Exhibit plaque">
  <button class="lj-close" type="button" aria-label="Close plaque">×</button>
  <div class="lj-plaque-slot"></div>
</dialog>
```

- [ ] **Step 4: Add the wiring script** immediately before `</body>` (after the existing footer):

```html
<script>
(function () {
  var dialog = document.querySelector('.lj-dialog');
  var slot = dialog.querySelector('.lj-plaque-slot');
  var opener = null; // control to refocus on close
  var home = null;   // card the open plaque belongs to

  function open(card, from) {
    var plaque = card.querySelector('.lj-plaque');
    if (!plaque) return;
    home = card; opener = from;
    var badge = card.querySelector('.lj-badge');
    var h3 = card.querySelector('h3');
    if (badge) slot.appendChild(badge.cloneNode(true));
    if (h3) slot.appendChild(h3.cloneNode(true));
    slot.appendChild(plaque); // moved, not cloned
    var door = card.querySelector('.lj-door');
    if (door) slot.appendChild(door.cloneNode(true));
    dialog.showModal();
  }

  dialog.addEventListener('close', function () {
    var plaque = slot.querySelector('.lj-plaque');
    if (home && plaque) home.insertBefore(plaque, home.querySelector('.lj-plaque-btn'));
    slot.textContent = '';
    home = null;
    if (opener) { opener.focus(); opener = null; }
  });
  dialog.addEventListener('click', function (e) {
    if (e.target === dialog) dialog.close(); // backdrop
  });
  dialog.querySelector('.lj-close').addEventListener('click', function () { dialog.close(); });

  document.querySelectorAll('.lj-grid .lj-card').forEach(function (card) {
    var btn = card.querySelector('.lj-plaque-btn');
    if (btn) btn.addEventListener('click', function () { open(card, btn); });
    var h3 = card.querySelector('h3');
    if (h3) h3.addEventListener('click', function () { open(card, btn || h3); });
    card.querySelectorAll('.lj-shot').forEach(function (shot) {
      if (!shot.querySelector('a') && !shot.closest('.lj-plaque')) {
        shot.addEventListener('click', function () { open(card, btn || h3); });
      }
    });
  });
})();
</script>
```

- [ ] **Step 5: Append CSS.** Inside the `/* lehrjahre */` block of `assets/museum.css`: change `.lj-grid`'s `minmax(300px, 1fr)` to `minmax(240px, 1fr)`, then append after `.lj-card.lj-epilogue { border-style: dashed; }`:

```css
.lj-hook { color: var(--muted); font-size: .88rem; }
.lj-plaque { display: flex; flex-direction: column; gap: .6rem; }
.js .lj-plaque { display: none; }
.lj-plaque-btn { display: none; }
.js .lj-plaque-btn { display: inline-block; align-self: flex-start; font: 11px/1.5 ui-monospace, "Cascadia Mono", Consolas, monospace; letter-spacing: .06em; text-transform: uppercase; color: var(--muted); background: none; border: 1px solid var(--line); border-radius: 3px; padding: .15rem .5rem; cursor: pointer; }
.js .lj-plaque-btn:hover { color: var(--amber); border-color: var(--amber); }
.js .lj-grid .lj-card h3 { cursor: pointer; }
.js .lj-grid .lj-card > .lj-shot:not(:has(a)) { cursor: pointer; }
.lj-dialog { background: var(--panel); color: inherit; border: 1px solid var(--line); border-radius: 6px; padding: 1.2rem; width: min(680px, calc(100vw - 2rem)); max-height: calc(100vh - 4rem); overflow-y: auto; }
.lj-dialog::backdrop { background: rgba(0, 0, 0, .6); }
.lj-dialog .lj-plaque, .lj-dialog .lj-plaque-slot { display: flex; flex-direction: column; gap: .6rem; }
.lj-dialog p { font-size: .92rem; }
.lj-close { float: right; margin: 0 0 .4rem .6rem; font-size: 1.05rem; line-height: 1; background: none; border: 1px solid var(--line); border-radius: 3px; color: var(--muted); padding: .2rem .5rem; cursor: pointer; }
.lj-close:hover { color: var(--amber); border-color: var(--amber); }
body:has(.lj-dialog[open]) { overflow: hidden; }
```

(All four CSS variables — `--panel`, `--line`, `--amber`, `--muted` — already exist; they are used by the current `.lj-*` rules.)

- [ ] **Step 6: Verify inert.** Serve (`python3 -m http.server 8765`, background) and run a quick check — no `.lj-plaque` exists yet, so the page must look and behave as before apart from the new intro sentence and slightly narrower tiles:

```bash
.superpowers/sdd/lehrjahre/tools/venv/bin/python - <<'EOF'
from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b = p.chromium.launch(); pg = b.new_page()
    errs = []
    pg.on('console', lambda m: errs.append(m.text) if m.type == 'error' else None)
    pg.goto('http://localhost:8765/lehrjahre.html', wait_until='networkidle')
    assert pg.locator('.lj-dialog').count() == 1
    assert pg.locator('dialog[open]').count() == 0
    assert 'Every card opens its plaque' in pg.inner_text('body')
    ext = pg.evaluate("performance.getEntriesByType('resource').map(r=>r.name).filter(n=>!n.startsWith(location.origin))")
    assert ext == [], ext
    real = [e for e in errs if 'favicon' not in e]
    assert real == [], real
    print('OK')
    b.close()
EOF
```

Expected: `OK`.

- [ ] **Step 7: Commit**

```bash
git add lehrjahre.html assets/museum.css
git commit -m "Lehrjahre hall: plaque-modal mechanism (dialog, wiring, styles)"
```

---

### Task 2: Restructure all 15 cards into tile + plaque; README line

**Files:**
- Modify: `lehrjahre.html` (the 15 `.lj-card` divs inside `.lj-grid`)
- Modify: `README.md` (one line in the `### 7. The Lehrjahre wing` section)
- Test: `$SCRATCH/hall_check.py` (below)

**Interfaces:**
- Consumes: Task 1's class contract (`.lj-hook`, `.lj-plaque`, `.lj-plaque-btn`; close re-inserts the plaque before the card's `.lj-plaque-btn`, so **every card must have the button**).

**The transformation (edit in place — MOVE the existing lines, do not retype them; the copy must stay byte-identical):**

Each card becomes, in this exact order:

1. `.lj-badge` — unchanged
2. `h3` + `.lj-date` — unchanged
3. the card's **first** `.lj-shot` — unchanged (walkable cards keep the `<a>` wrapper)
4. NEW `<p class="lj-hook">…</p>` — text verbatim from the table below
5. `<div class="lj-plaque">` wrapping, in original order: all copy `<p>`s, any **second** `.lj-shot`, and the `.lj-charm` line `</div>`
6. NEW `<button class="lj-plaque-btn" type="button">Read the plaque →</button>`
7. the `.lj-door` paragraph (walkable cards only) — unchanged, stays last

Cards with no screenshot (ChatGPT-Interface, GraphQL-Booklist) simply skip item 3. The epilogue card follows the same pattern (keeps `lj-epilogue` class). Do NOT add a door inside the plaque — the wiring script clones the tile's door into the modal at open time.

**Hook lines (verbatim, including final periods):**

| Card | `.lj-hook` text |
|---|---|
| CA-Projects | The earliest folder: sprint exercises and my two first React apps. |
| MaHalle v1 | A MERN forum for the neighbourhood, eternally empty. |
| ChatGPT-Interface | Twenty-three lines of Node; the chat happened in a console window. |
| GoneWithTheTailwind | A blog front page for ninjas that was never a blog. |
| GraphOL-server-example | My first GraphQL server; the typo in the name shipped. |
| GraphQL-Booklist | Caught mid-refactor and never run again. |
| React-Hooks-with-TypeScript | One page, six hooks — my React cheat sheet. |
| movie-db | Woke to a blank screen; the museum lent it a dummy config. |
| admin-dashboard | An admin dashboard for nothing; every stat reads 100. |
| Finance_Logger | The one exhibit that still functions — until you reload. |
| MaHalle v2 | Ein Kiez-Gesichterbuch; three doors painted on walls. |
| mongodb-crud | The navbar just says ATAKEE; the list page crashes on cue. |
| Developer-Portefeuille | The direct ancestor of ercan-atak.de, fed by its own CMS. |
| dogsNfilms | Adopt a broken image. |
| translation-office-ai-assistant | A postscript from 2026: the Lehrjahre never really end. |

**Worked example 1 — walkable card (MaHalle v1), after:**

```html
    <div class="lj-card">
      <span class="lj-badge">walkable</span>
      <h3>MaHalle v1 <span class="lj-date">Feb – Aug 2023</span></h3>
      <div class="lj-shot"><a href="lehrjahre/mahalle-v1/index.html"><img src="assets/lehrjahre/mahalle-v1.png" alt="MaHalle v1 forum home, Discussions tab" loading="lazy"></a></div>
      <p class="lj-hook">A MERN forum for the neighbourhood, eternally empty.</p>
      <div class="lj-plaque">
        <p>My first big thing: a MERN forum for the neighbourhood — <i>Mahalle</i>,
        Turkish for exactly that, punning on German <i>meine Halle</i>.
        Discussions, announcements, recommendations; register, log in, start a
        debate. The backend didn't come along to the museum, so the forum stands
        eternally empty: search box ready, nobody home. The landing page's
        sideways-rotated headings are an original bug, preserved.</p>
        <p class="lj-charm">Commit message: "Adding forum posts works! :) But there are a lot more to do! Go to work! :))"</p>
      </div>
      <button class="lj-plaque-btn" type="button">Read the plaque →</button>
      <p class="lj-door"><a class="go" href="lehrjahre/mahalle-v1/index.html">Enter the exhibit →</a></p>
    </div>
```

(The `<p>` lines are the existing lines moved into the wrapper; re-indenting by two spaces is allowed — whitespace-only changes are fine, character changes are not.)

**Worked example 2 — two-screenshot, non-walkable card (CA-Projects), after:**

```html
    <div class="lj-card">
      <span class="lj-badge quiet">catalogue only</span>
      <h3>CA-Projects <span class="lj-date">2022 – 2023</span></h3>
      <div class="lj-shot"><img src="assets/lehrjahre/ca-projects.png" alt="my-first-react-app: 'Hey, Ercan is learning React!'" loading="lazy"></div>
      <p class="lj-hook">The earliest folder: sprint exercises and my two first React apps.</p>
      <div class="lj-plaque">
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
      <button class="lj-plaque-btn" type="button">Read the plaque →</button>
    </div>
```

**Worked example 3 — no-screenshot card (ChatGPT-Interface), after:**

```html
    <div class="lj-card">
      <span class="lj-badge quiet">no face — it was a terminal</span>
      <h3>ChatGPT-Interface <span class="lj-date">Mar 2023</span></h3>
      <p class="lj-hook">Twenty-three lines of Node; the chat happened in a console window.</p>
      <div class="lj-plaque">
        <p>Twenty-three lines of Node that let you chat with GPT-3.5 in a console
        window. March 2023: everyone was building one of these. No browser was
        ever involved, so there is nothing to walk through — this card is the
        whole exhibit.</p>
        <p class="lj-charm">The commit message says it best: "the script file is working, one can have a chat in the console window."</p>
      </div>
      <button class="lj-plaque-btn" type="button">Read the plaque →</button>
    </div>
```

- [ ] **Step 1: Restructure all 15 cards** per the pattern and hook table above, in place, top to bottom. Special cases: mongodb-crud has two shots → second shot goes inside the plaque (same as CA-Projects). movie-db/admin-dashboard/Finance_Logger/MaHalle v2/Developer-Portefeuille/dogsNfilms/GoneWithTheTailwind are walkable → keep shot-link and door on the tile. Epilogue keeps `class="lj-card lj-epilogue"`.

- [ ] **Step 2: Copy-preservation check** (moved-not-retyped):

```bash
git diff lehrjahre.html | grep '^-' | grep -v '^---' | grep -oP '(?<=^-).*' | sed 's/^\s*//' | sort > $SCRATCH/removed.txt
git diff lehrjahre.html | grep '^+' | grep -v '^+++' | grep -oP '(?<=^\+).*' | sed 's/^\s*//' | sort > $SCRATCH/added.txt
comm -23 $SCRATCH/removed.txt $SCRATCH/added.txt
```

Expected: empty output (every removed line reappears, modulo leading whitespace, as an added line — nothing vanished). If lines appear, they were retyped or dropped: fix before proceeding.

- [ ] **Step 3: Write the behavior test** to `$SCRATCH/hall_check.py`:

```python
from playwright.sync_api import sync_playwright

BASE = 'http://localhost:8765/lehrjahre.html'

with sync_playwright() as p:
    b = p.chromium.launch()

    # --- JS on ---
    pg = b.new_page(viewport={'width': 1280, 'height': 900})
    errs = []
    pg.on('console', lambda m: errs.append(m.text) if m.type == 'error' else None)
    pg.goto(BASE, wait_until='networkidle')

    cards = pg.locator('.lj-grid .lj-card')
    assert cards.count() == 15, cards.count()
    assert pg.locator('.lj-plaque').count() == 15
    assert pg.locator('.lj-plaque-btn').count() == 15
    assert pg.locator('.lj-hook').count() == 15
    # plaques hidden under .js
    assert pg.eval_on_selector_all('.lj-plaque',
        "els => els.every(e => getComputedStyle(e).display === 'none')")

    # open via button (card 1 = CA-Projects), content moved into dialog
    pg.click('.lj-grid .lj-card:nth-child(1) .lj-plaque-btn')
    assert pg.locator('.lj-dialog[open]').count() == 1
    assert pg.locator('.lj-dialog .lj-plaque').count() == 1
    assert 'Hey, Ercan is learning React!' in pg.inner_text('.lj-dialog')
    # close via Escape -> plaque returns home, focus back on button
    pg.keyboard.press('Escape')
    assert pg.locator('.lj-dialog[open]').count() == 0
    assert pg.locator('.lj-grid .lj-card:nth-child(1) .lj-plaque').count() == 1
    assert pg.evaluate("document.activeElement.className") == 'lj-plaque-btn'

    # reopen same card via its screenshot (non-walkable => shot opens modal)
    pg.click('.lj-grid .lj-card:nth-child(1) .lj-shot')
    assert pg.locator('.lj-dialog[open]').count() == 1
    # close via backdrop
    pg.mouse.click(10, 10)
    assert pg.locator('.lj-dialog[open]').count() == 0

    # open a walkable card (2 = MaHalle v1) via title; modal shows cloned door
    pg.click('.lj-grid .lj-card:nth-child(2) h3')
    assert pg.locator('.lj-dialog[open] .lj-door').count() == 1
    pg.click('.lj-close')
    assert pg.locator('.lj-dialog[open]').count() == 0
    assert pg.locator('.lj-grid .lj-card:nth-child(2) .lj-plaque').count() == 1

    # walkable tile screenshot still navigates into the face (no modal)
    with pg.expect_navigation():
        pg.click('.lj-grid .lj-card:nth-child(2) .lj-shot a')
    assert pg.url.endswith('lehrjahre/mahalle-v1/index.html')
    pg.goto(BASE, wait_until='networkidle')

    # zero external requests, no console errors beyond favicon
    ext = pg.evaluate(
        "performance.getEntriesByType('resource').map(r=>r.name)"
        ".filter(n=>!n.startsWith(location.origin))")
    assert ext == [], ext
    real = [e for e in errs if 'favicon' not in e]
    assert real == [], real

    # screenshots for the user preview
    pg.screenshot(path='hall-desktop.png', full_page=True)
    pg.click('.lj-grid .lj-card:nth-child(1) .lj-plaque-btn')
    pg.screenshot(path='hall-plaque-open.png')
    pg.keyboard.press('Escape')
    pm = b.new_page(viewport={'width': 390, 'height': 844})
    pm.goto(BASE, wait_until='networkidle')
    pm.screenshot(path='hall-mobile.png', full_page=True)
    pm.click('.lj-grid .lj-card:nth-child(1) .lj-plaque-btn')
    pm.screenshot(path='hall-plaque-mobile.png')

    # --- JS off: degrades to inline plaques ---
    ctx = b.new_context(java_script_enabled=False)
    pn = ctx.new_page()
    pn.goto(BASE)
    assert pn.eval_on_selector_all('.lj-plaque',
        "els => els.length === 15 && els.every(e => getComputedStyle(e).display !== 'none')")
    assert pn.eval_on_selector_all('.lj-plaque-btn',
        "els => els.every(e => getComputedStyle(e).display === 'none')")
    assert 'sideways-rotated headings' in pn.inner_text('.lj-grid')  # full copy visible

    print('ALL OK')
    b.close()
```

- [ ] **Step 4: Run it** (server from Task 1 still on 8765; run from `$SCRATCH` so screenshots land there):

```bash
cd $SCRATCH && /home/atakee/projects/eski-web-sayfalarim/.superpowers/sdd/lehrjahre/tools/venv/bin/python hall_check.py
```

Expected: `ALL OK`. Screenshots `hall-desktop.png`, `hall-plaque-open.png`, `hall-mobile.png`, `hall-plaque-mobile.png` written for the user preview.

- [ ] **Step 5: README line.** In `README.md`, at the end of the `### 7. The Lehrjahre wing` section, add:

```markdown
- 2026-08-30: the hall's catalogue cards became compact tiles; each opens its
  full plaque in a modal (inline JS in `lehrjahre.html`; with JS disabled the
  plaques render inline as before). Shell change only — no face was touched.
```

- [ ] **Step 6: Confirm no exhibit files changed**

```bash
git status --porcelain | grep -v -E '^(.M| M) (lehrjahre\.html|assets/museum\.css|README\.md)$'
```

Expected: empty (only the three permitted files modified).

- [ ] **Step 7: Commit**

```bash
git add lehrjahre.html README.md
git commit -m "Lehrjahre hall: compact tiles with plaque modals"
```

---

## After the tasks (controller, not a subagent)

- Show the user the four screenshots and the tile hooks for correction; keep the 8765 server running for their live preview.
- Push only on the user's explicit go-ahead. After push: check Pages build (`gh api repos/atakee72/websites-through-the-years/pages/builds/latest --jq .status` → `built`), live hall 200, then SPN re-save `https://atakee72.github.io/websites-through-the-years/lehrjahre.html`.
