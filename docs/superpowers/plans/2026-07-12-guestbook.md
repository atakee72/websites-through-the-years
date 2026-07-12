# Guestbook & Period-Authentic Touches Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a webmaster-moderated static guestbook, a landing-page hit counter (seeded 18 735), an 88×31 badge row, and a once-only dial-up gag, per `docs/superpowers/specs/2026-07-12-guestbook-design.md`.

**Architecture:** Hand-written static HTML/CSS/vanilla JS, no build step. `guestbook.html` (repo root) is styled by `assets/museum.css` (which gains guestbook + dial-up styles); the landing page `index.html` keeps its inline CSS and gains footer styles inline. Badges are local SVGs.

**Tech Stack:** Plain HTML/CSS/JS. Testing via `python3 -m http.server 8765` + `playwright-cli` (config auto-loaded from `.playwright/cli.config.json`, bundled chromium — the chrome channel is NOT installed).

## Global Constraints

- Repo root: `/home/atakee/projects/eski-web-sayfalarim`. Paths below are repo-relative.
- Do NOT modify anything under `atakee-fortunecity-2004/`, `dtm-ab-2002/`, `tbmm-kpk-2006/`, `thoughtful-thoughts-2011/`, `atakees-blog-2013/`, `backups/`, `plaques/`, or `restoration-lab.html`.
- Shell pages make **zero external requests**. External `<a href>` links are allowed.
- The string `atakee@gmail.com` must NEVER appear assembled in any committed file of this plan — the mailto is built at click time from parts (`'atakee' + '@' + 'gmail.com'`).
- Typographic characters in snippets (— · № → …) must be preserved exactly.
- Commit messages: simple one-liners, **no** Claude signature, **no** Co-Authored-By footer.
- Do NOT push in any task. Push happens only after the user reviews the guestbook page (review gate, end of plan).
- Test server: if not already running, start once with `python3 -m http.server 8765` from repo root (background).
- Playwright console logs land in `.playwright-cli/console-*.log` (gitignored); a favicon.ico 404 is pre-existing and expected on every page.

---

### Task 1: Guestbook + dial-up styles in `assets/museum.css`

**Files:**
- Modify: `assets/museum.css` (append at end of file)

**Interfaces:**
- Consumes: existing `:root` palette variables in the same file.
- Produces: class names used verbatim by Task 3: `gb-entry`, `gb-head`, `gb-loc`, `gb-sign`, `gb-note`, and the `#dialup` overlay (`term`, `bar`, `skip`). (Landing-footer styles are NOT here — index.html is inline-CSS by convention; Task 5 carries them.)

- [ ] **Step 1: Append this block to the end of `assets/museum.css`**

```css

/* guestbook */
.gb-entry {
  border: 1px solid var(--line); border-left: 4px solid var(--green);
  border-radius: 4px; background: var(--panel);
  padding: 1rem 1.25rem; margin-bottom: 1rem;
}
.gb-entry .gb-head {
  font: bold 13px 'Courier New', monospace;
  color: var(--amber); margin-bottom: .4rem;
}
.gb-entry .gb-head .gb-loc { color: var(--muted); font-weight: normal; }
.gb-entry p { margin: 0; }
.gb-sign { display: flex; flex-wrap: wrap; gap: .75rem; margin: 1rem 0; }
.gb-sign .enter { font-size: 14px; }
.gb-note { color: var(--muted); font-style: italic; font-size: .9rem; }

/* dial-up overlay (guestbook first visit) */
#dialup {
  position: fixed; inset: 0; z-index: 99;
  background: #000; color: #7dff7d;
  font: 15px/1.8 'Courier New', monospace;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer;
}
#dialup[hidden] { display: none; }
#dialup .term { width: min(34rem, 90vw); }
#dialup .bar { height: 14px; border: 1px solid #7dff7d; margin: .75rem 0; }
#dialup .bar i {
  display: block; height: 100%; width: 0; background: #7dff7d;
  animation: gb-conn 3.6s steps(24) forwards;
}
@keyframes gb-conn { to { width: 100%; } }
#dialup .skip { color: #4a7; font-size: 12px; }
```

- [ ] **Step 2: Sanity-check braces**

Run: `python3 -c "s=open('assets/museum.css').read(); assert s.count('{')==s.count('}'), 'brace mismatch'; print('ok')"`
Expected: `ok`

- [ ] **Step 3: Commit**

```bash
git add assets/museum.css
git commit -m "Add guestbook and dial-up styles to museum stylesheet"
```

---

### Task 2: Four 88×31 badges (`assets/badges/`)

**Files:**
- Create: `assets/badges/any-browser.svg`, `assets/badges/frontpage.svg`, `assets/badges/utf8.svg`, `assets/badges/archived.svg`

**Interfaces:**
- Consumes: nothing.
- Produces: the four file paths above, referenced verbatim by Task 5.

- [ ] **Step 1: Write `assets/badges/any-browser.svg`**

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="88" height="31" role="img" aria-label="Best viewed with any browser">
  <rect width="88" height="31" fill="#000"/>
  <rect x="0.5" y="0.5" width="87" height="30" fill="none" stroke="#7dff7d"/>
  <text x="44" y="13" text-anchor="middle" font-family="'Courier New',monospace" font-size="9" font-weight="bold" fill="#7dff7d">BEST VIEWED</text>
  <text x="44" y="24" text-anchor="middle" font-family="'Courier New',monospace" font-size="9" fill="#fff">with ANY browser</text>
</svg>
```

- [ ] **Step 2: Write `assets/badges/frontpage.svg`**

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="88" height="31" role="img" aria-label="Made with FrontPage — restored by hand">
  <rect width="88" height="31" fill="#000"/>
  <rect x="0.5" y="0.5" width="87" height="30" fill="none" stroke="#9aa4ae"/>
  <text x="44" y="12" text-anchor="middle" font-family="'Courier New',monospace" font-size="8" fill="#9aa4ae">MADE WITH FRONTPAGE</text>
  <line x1="8" y1="9.5" x2="80" y2="9.5" stroke="#d77" stroke-width="1"/>
  <text x="44" y="24" text-anchor="middle" font-family="'Courier New',monospace" font-size="9" font-weight="bold" fill="#ffb454">restored by hand</text>
</svg>
```

- [ ] **Step 3: Write `assets/badges/utf8.svg`**

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="88" height="31" role="img" aria-label="UTF-8 inside">
  <rect width="88" height="31" fill="#101418"/>
  <rect x="0.5" y="0.5" width="87" height="30" fill="none" stroke="#7dd97d"/>
  <text x="44" y="16" text-anchor="middle" font-family="'Courier New',monospace" font-size="13" font-weight="bold" fill="#fff">UTF-8</text>
  <text x="44" y="26" text-anchor="middle" font-family="Georgia,serif" font-size="9" font-style="italic" fill="#7dd97d">inside</text>
</svg>
```

- [ ] **Step 4: Write `assets/badges/archived.svg`**

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="88" height="31" role="img" aria-label="Archived forever">
  <rect width="88" height="31" fill="#000"/>
  <rect x="0.5" y="0.5" width="87" height="30" fill="none" stroke="#ffb454"/>
  <text x="44" y="14" text-anchor="middle" font-family="'Courier New',monospace" font-size="10" font-weight="bold" fill="#ffb454">ARCHIVED</text>
  <text x="44" y="25" text-anchor="middle" font-family="'Courier New',monospace" font-size="10" font-weight="bold" fill="#fff">4-EVER</text>
</svg>
```

- [ ] **Step 5: Verify structure and no external refs** (string checks on purpose — no XML parser needed for files we just authored)

Run: `python3 -c "import glob; fs=sorted(glob.glob('assets/badges/*.svg')); assert len(fs)==4, fs; [(lambda s: [s.strip().startswith('<svg '), s.strip().endswith('</svg>'), 'DOCTYPE' not in s, s.count('width=\"88\"')>=1])(open(f).read()) for f in fs]; print('4 ok')"`
Expected: `4 ok`
Run: `grep -o 'http[^" ]*' assets/badges/*.svg | grep -v 'www.w3.org/2000/svg' || echo "no external refs"`
Expected: `no external refs` (the `xmlns` namespace URI is an identifier, not a request; nothing else may reference http).

- [ ] **Step 6: Commit**

```bash
git add assets/badges/
git commit -m "Add 88x31 footer badges"
```

---

### Task 3: The guestbook page (`guestbook.html`)

**Files:**
- Create: `guestbook.html`

**Interfaces:**
- Consumes: Task 1's classes (`gb-entry`, `gb-head`, `gb-loc`, `gb-sign`, `gb-note`, `#dialup` with `term`/`bar`/`skip`) plus existing museum.css classes (`wrap`, `crumbs`, `plaquehead`, `year`, `host`, `doorway`, `enter`). Page sits at repo root: stylesheet `assets/museum.css`, links `index.html`.
- Produces: URL `guestbook.html`, linked by Task 5; localStorage keys `gb-dialup-done`.

**SECURITY NOTE (copy into any future entry-baking):** visitor message text must be HTML-escaped (`<` → `&lt;`, `>` → `&gt;`, `&` → `&amp;`, `"` → `&quot;`) before being baked into an entry block.

- [ ] **Step 1: Write the page**

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>The guestbook · websites through the years</title>
<meta name="description" content="Sign the museum's guestbook like it's 1999 — entries appear after the webmaster reviews them.">
<link rel="stylesheet" href="assets/museum.css">
</head>
<body>

<div id="dialup" hidden>
  <div class="term">
    <p>ATDT 0-800-GUESTBOOK<br>CONNECTING TO GUESTBOOK.EXE — 56,000 bps…</p>
    <div class="bar"><i></i></div>
    <p class="skip">click anywhere (or press Esc) to skip the nostalgia</p>
  </div>
</div>

<div class="wrap">

<nav class="crumbs"><a href="index.html">← back to the museum</a></nav>

<header class="plaquehead">
  <span class="year">since 1999 · reopened 2026</span>
  <h1>The guestbook</h1>
  <p class="host">sign like it's 1999 · moderated by the webmaster</p>
</header>

<section>
  <h2>Sign it</h2>
  <p>The 1999 homepage had a guestbook; its service died with the free-host
  era. This one works the way guestbooks really worked: you sign, the
  webmaster reads it, and your entry appears on this page — reviewed, dated
  and permanent.</p>
  <div class="gb-sign">
    <a class="enter" href="https://github.com/atakee72/websites-through-the-years/issues/new?template=guestbook.yml">Sign via GitHub →</a>
    <a class="enter" href="#" id="gb-mail">Sign by email →</a>
  </div>
  <p class="gb-note">Entries appear after the webmaster reviews them — as was
  always the way.</p>
</section>

<section>
  <h2>The entries</h2>
  <!-- Baking an entry: copy the block below, increment the №, fill in
       name/location/date, and HTML-escape the visitor's message text
       (& < > ") — visitor text is the only untrusted input in this museum. -->
  <article class="gb-entry">
    <div class="gb-head">№ 001 · Ercan (@t@kee) <span class="gb-loc">· the webmaster · 12 July 2026</span></div>
    <p>Twenty-seven years after the first entry landed in my FortuneCity
    guestbook, the book is open again. Sign it — it's good to have visitors.</p>
  </article>
</section>

<p class="doorway"><a class="enter" href="index.html">Back to the museum →</a></p>

<footer><a href="index.html">websites through the years</a> — a personal museum of the early web</footer>

</div>

<script>
(function () {
  // dial-up gag: once per visitor, skippable, honors reduced motion
  var ov = document.getElementById('dialup');
  var done = true;
  try { done = localStorage.getItem('gb-dialup-done') === '1'; } catch (e) {}
  var reduced = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  function finish() {
    if (ov.hidden) return;
    ov.hidden = true;
    try { localStorage.setItem('gb-dialup-done', '1'); } catch (e) {}
  }
  if (!done && !reduced) {
    ov.hidden = false;
    setTimeout(finish, 4200);
    ov.addEventListener('click', finish);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') finish(); });
  }
  // mail link assembled on click so the address never sits in the page source
  var mail = document.getElementById('gb-mail');
  if (mail) mail.addEventListener('click', function (e) {
    e.preventDefault();
    location.href = 'mailto:' + 'atakee' + '@' + 'gmail.com'
      + '?subject=' + encodeURIComponent('Guestbook entry')
      + '&body=' + encodeURIComponent('Name:\nLocation (optional):\nMessage:\n');
  });
})();
</script>

</body>
</html>
```

Note the `done = true` default before the try block: if localStorage is unavailable, the gag never shows (fail-quiet) rather than replaying forever.

- [ ] **Step 2: Verify in browser (fresh profile shows the gag once)**

```bash
curl -s localhost:8765 >/dev/null || (cd /home/atakee/projects/eski-web-sayfalarim && python3 -m http.server 8765 >/dev/null 2>&1 &)
playwright-cli open http://localhost:8765/guestbook.html
playwright-cli eval "localStorage.removeItem('gb-dialup-done')"
playwright-cli reload
playwright-cli snapshot
```
Expected: with the flag cleared, the dial-up overlay is visible first ("CONNECTING TO GUESTBOOK.EXE") — the browser profile may persist between sessions, so the explicit remove+reload is the deterministic first-visit path. Then test the click-skip (deterministic; the ~4.2 s auto-finish is confirmed visually in the snapshot flow, and Escape-skip is covered in Task 6):

```bash
playwright-cli eval "document.getElementById('dialup').click(); document.getElementById('dialup').hidden"
```
Expected: `true` (click skipped it and set the flag).

```bash
playwright-cli reload
playwright-cli eval "document.getElementById('dialup').hidden"
```
Expected: `true` immediately (localStorage flag set — plays once, ever).

Note: the `prefers-reduced-motion` guard cannot be emulated through this playwright-cli — verify it by reading the code (the `matchMedia('(prefers-reduced-motion: reduce)')` condition must gate the overlay), not by browser test.

- [ ] **Step 3: Verify the mail link and the harvesting guard**

```bash
playwright-cli eval "document.getElementById('gb-mail') !== null && document.querySelector('.gb-sign a[href*=\"issues/new?template=guestbook.yml\"]') !== null"
```
Expected: `true`

Run: `! grep -q "atakee@gmail" guestbook.html && echo clean`
Expected: `clean` (address never appears assembled).

- [ ] **Step 4: Verify zero external requests, then close**

```bash
playwright-cli eval "performance.getEntriesByType('resource').map(r=>r.name).filter(n=>!n.startsWith(location.origin))"
playwright-cli close
```
Expected: `[]`. Newest `.playwright-cli/console-*.log` has no errors (favicon 404 excepted).

- [ ] **Step 5: Commit**

```bash
git add guestbook.html
git commit -m "Add the guestbook, moderated like it's 1999"
```

---

### Task 4: Guestbook issue form (`.github/ISSUE_TEMPLATE/guestbook.yml`)

**Files:**
- Create: `.github/ISSUE_TEMPLATE/guestbook.yml`

**Interfaces:**
- Consumes: nothing.
- Produces: the template name `guestbook.yml`, referenced by Task 3's GitHub link (`issues/new?template=guestbook.yml`).

- [ ] **Step 1: Write the template**

```yaml
name: Guestbook entry
description: Sign the museum's guestbook — the webmaster bakes approved entries into the page.
title: "Guestbook entry"
labels: ["guestbook"]
body:
  - type: markdown
    attributes:
      value: |
        Thanks for visiting **websites through the years**! Fill this in and
        the webmaster will add your entry to the guestbook — as was always
        the way in 1999.
  - type: input
    id: name
    attributes:
      label: Name (as it should appear in the guestbook)
      placeholder: e.g. Jane from IRC
    validations:
      required: true
  - type: input
    id: location
    attributes:
      label: Location (optional)
      placeholder: e.g. Berlin
    validations:
      required: false
  - type: textarea
    id: message
    attributes:
      label: Message
      placeholder: Keep it 1999-friendly.
    validations:
      required: true
```

- [ ] **Step 2: Validate YAML parses**

Run: `python3 -c "import yaml; d=yaml.safe_load(open('.github/ISSUE_TEMPLATE/guestbook.yml')); assert d['labels']==['guestbook'] and len(d['body'])==4; print('ok')"`
Expected: `ok`
(If PyYAML is missing, fall back to: `python3 -c "print(open('.github/ISSUE_TEMPLATE/guestbook.yml').read().count('type:'))"` → `4`.)

- [ ] **Step 3: Commit**

```bash
git add .github/ISSUE_TEMPLATE/guestbook.yml
git commit -m "Add guestbook issue form"
```

---

### Task 5: Landing page — counter, badges, guestbook links

**Files:**
- Modify: `index.html` (inline `<style>` block; the timeline's 2026 `<li>`; the `<footer>` element)

**Interfaces:**
- Consumes: `guestbook.html` (Task 3), the four badge paths from Task 2.
- Produces: localStorage key `museum-hits`; element id `mcount`.

- [ ] **Step 1: Add footer styles to the inline `<style>` block**

Insert immediately before the `.blink {` rule:

```css
  .foot-extra {
    display: flex; flex-wrap: wrap; align-items: center;
    gap: 1rem; margin-top: 1.25rem;
  }
  .counter {
    display: inline-flex; align-items: center; gap: .5rem;
    font: 13px Verdana, sans-serif; color: var(--muted);
  }
  .counter .digits {
    font: bold 16px 'Courier New', monospace; letter-spacing: 2px;
    color: #7dff7d; background: #000;
    border: 1px solid #444; border-radius: 2px; padding: .1rem .4rem;
  }
  .badges { display: inline-flex; flex-wrap: wrap; gap: .5rem; }
  .badges img { width: 88px; height: 31px; display: block; }
```

- [ ] **Step 2: Extend the timeline's 2026 entry**

Replace:

```html
      <li><span class="y">2026</span>The museum opens — the recovery is documented in <a href="restoration-lab.html">the restoration lab</a>.</li>
```

with:

```html
      <li><span class="y">2026</span>The museum opens — the recovery is documented in <a href="restoration-lab.html">the restoration lab</a> — and <a href="guestbook.html">the guestbook</a> reopens.</li>
```

- [ ] **Step 3: Add counter + guestbook link + badges to the footer**

Inside `<footer>`, immediately after the existing `</p>`, insert:

```html
  <div class="foot-extra">
    <span class="counter" title="localStorage replica — the original counter service died in 2005">You are visitor № <span class="digits" id="mcount">018735</span></span>
    <a href="guestbook.html">Sign the guestbook →</a>
    <span class="badges">
      <img src="assets/badges/any-browser.svg" alt="Best viewed with any browser" width="88" height="31">
      <img src="assets/badges/frontpage.svg" alt="Made with FrontPage — restored by hand" width="88" height="31">
      <img src="assets/badges/utf8.svg" alt="UTF-8 inside" width="88" height="31">
      <img src="assets/badges/archived.svg" alt="Archived forever" width="88" height="31">
    </span>
  </div>
  <script>
  (function () {
    // visitor counter replica — continues where the 1999 homepage's counter
    // left off (the exhibit's replica is seeded 18734)
    var n = 18735;
    try {
      n = parseInt(localStorage.getItem('museum-hits') || '18734', 10) + 1;
      localStorage.setItem('museum-hits', String(n));
    } catch (e) {}
    document.getElementById('mcount').textContent = String(n).padStart(6, '0');
  })();
  </script>
```

- [ ] **Step 4: Verify in browser (desktop + mobile + counter persistence)**

```bash
playwright-cli open http://localhost:8765/
playwright-cli eval "localStorage.removeItem('museum-hits')"
playwright-cli reload
playwright-cli eval "document.getElementById('mcount').textContent"
```
Expected: `018735` (deterministic first visit — the profile may persist, so clear the key first).

```bash
playwright-cli reload
playwright-cli eval "document.getElementById('mcount').textContent"
```
Expected: `018736` (increments and persists).

```bash
playwright-cli eval "document.querySelectorAll('.badges img').length"
playwright-cli eval "[...document.images].every(i => i.complete && i.naturalWidth > 0)"
playwright-cli resize 375 812
playwright-cli eval "document.documentElement.scrollWidth"
playwright-cli screenshot
playwright-cli resize 1280 900
playwright-cli eval "performance.getEntriesByType('resource').map(r=>r.name).filter(n=>!n.startsWith(location.origin))"
playwright-cli close
```
Expected: `4`; `true` (all badges load); `375` (no horizontal overflow); `[]`. No new console errors.

- [ ] **Step 5: Commit**

```bash
git add index.html
git commit -m "Landing footer: visitor counter, badges, guestbook link"
```

---

### Task 6: Full verification pass

**Files:**
- None created/modified. Pure verification; report regressions, do not fix.

**Interfaces:**
- Consumes: everything from Tasks 1–5.
- Produces: green light for docs + the user review gate.

- [ ] **Step 1: Guestbook flow from the landing page**

```bash
playwright-cli open http://localhost:8765/
playwright-cli click "Sign the guestbook →"
playwright-cli snapshot
```
Expected: guestbook loads (dial-up may show on a fresh profile — click to skip; verify the skip works). Snapshot shows entry № 001, both sign links, "back to the museum".

- [ ] **Step 2: Escape-key skip on a cleared profile**

```bash
playwright-cli eval "localStorage.removeItem('gb-dialup-done')"
playwright-cli reload
playwright-cli press Escape
playwright-cli eval "document.getElementById('dialup').hidden && localStorage.getItem('gb-dialup-done')"
```
Expected: overlay visible after reload, then `1` (Escape skipped and set the flag).

- [ ] **Step 3: Timeline 2026 → guestbook link; issue-form URL**

```bash
playwright-cli goto http://localhost:8765/
playwright-cli eval "document.querySelector('.timeline a[href=\"guestbook.html\"]') !== null"
playwright-cli goto http://localhost:8765/guestbook.html
playwright-cli eval "document.querySelector('.gb-sign a').href"
```
Expected: `true`; `https://github.com/atakee72/websites-through-the-years/issues/new?template=guestbook.yml`

- [ ] **Step 4: Zero external requests on both changed pages**

For `/` and `/guestbook.html`:
```bash
playwright-cli goto http://localhost:8765/<page>
playwright-cli eval "performance.getEntriesByType('resource').map(r=>r.name).filter(n=>!n.startsWith(location.origin))"
```
Expected: `[]` both times.

- [ ] **Step 5: Console sweep and close**

Run: `grep -il "error" $(ls -t .playwright-cli/console-*.log | head -8) | head -5`
Expected: no hits beyond the pre-existing favicon 404 pattern (inspect any hit before judging).

```bash
playwright-cli close
```

---

### Task 7: Documentation

**Files:**
- Modify: `README.md` (new section after "Curation layer", before "Landing page")
- Modify: `CLAUDE.md` (editable-shell sentence)

**Interfaces:**
- Consumes: final state of Tasks 1–6.
- Produces: docs matching reality; then the plan pauses at the user review gate.

- [ ] **Step 1: Add a "Guestbook" section to README.md**

Insert between the "Curation layer" section and the "Landing page" section:

```markdown
## Guestbook

`guestbook.html` — a 1999-style guestbook, moderated like it's 1999:
entries are static HTML baked in by the webmaster. Visitors sign via a
GitHub issue form (`.github/ISSUE_TEMPLATE/guestbook.yml`, label
`guestbook`) or an email link (assembled by JS on click, so the address
can't be harvested from the source). Baking an entry: copy
name/location/message into a new `.gb-entry` block — **HTML-escape the
message text** (`&`, `<`, `>`, `"`); visitor text is the only untrusted
input in this museum — commit, close the issue with a thank-you. First-time
visitors get a fake 56k handshake (once ever, skippable, absent under
reduced motion). The landing footer's visitor counter is a localStorage
replica seeded at 18 735 — continuing where the 1999 homepage's counter
left off.
```

- [ ] **Step 2: Update CLAUDE.md's editable-shell sentence**

Replace:

```
explains this to visitors. The modern, freely editable museum shell is:
`index.html` (landing page), `plaques/` (curator plaques),
`restoration-lab.html`, and `assets/`
(screenshots + `museum.css`) — all hand-written, no build step. Shell pages
```

with:

```
explains this to visitors. The modern, freely editable museum shell is:
`index.html` (landing page), `plaques/` (curator plaques),
`restoration-lab.html`, `guestbook.html`, `.github/` (issue templates),
and `assets/` (screenshots, badges, `museum.css`) — all hand-written, no
build step. Shell pages
```

- [ ] **Step 3: Commit**

```bash
git add README.md CLAUDE.md
git commit -m "docs: guestbook, counter and badges"
```

- [ ] **Step 4: STOP — user review gate (do not push)**

Leave the local server running and report to the user: the guestbook (incl.
seed entry № 001 written in their voice), the dial-up gag, the counter and
the badges are ready for review at `http://localhost:8765/` and
`http://localhost:8765/guestbook.html`. Push to `main` only after explicit
user approval. Post-push checklist (controller, after user approval):
`gh label create guestbook --description "Guestbook entries awaiting baking" --color 7dd97d`
(GitHub silently drops template labels that don't exist in the repo), then
open the live issue-form URL once to confirm the template renders. The
issue-form link 404s on GitHub until pushed — expected.
