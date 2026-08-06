# Links Page ("The web outside these walls") Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add `links.html` — the links page every 1999 homepage had — pointing outward at Wayback captures and still-alive fossils of the old web, in two sections: sites the curator remembers visiting (Ankara/Berlin, 1999–2006) and the famous classics.

**Architecture:** One new museum-shell page at repo root (same pattern as `guestbook.html`: `assets/museum.css` + one small CSS addition), integrated into the landing page (timeline 2026 line + footer link) and documented in README/CLAUDE.md. No JS needed. All links are external `<a href>` (allowed on shell pages); the page itself makes zero external requests.

**Tech Stack:** Hand-written HTML/CSS, no build step. Testing via `curl` (link liveness) and `playwright-cli` (console, screenshot, resource check).

## Design decisions (agreed in chat)

- Curation criterion is **option 2**: personal core ("the web as I saw it") + famous neighbors section.
- Links go to `https://web.archive.org/web/<YEAR>/<original-url>` — the Wayback Machine auto-redirects to the nearest capture, so no exact timestamps needed. Living fossils (Space Jam, CERN, etc.) link directly and get a "still live" chip.
- This is a **modern shell page in curator voice** (like the guestbook), NOT a fake period artifact — the museum never fakes artifacts.
- The personal-section notes are **drafts of the curator's memories** — the user vets/corrects them after implementation (same flow as the plaques).

## Global Constraints

- Shell pages make **zero external requests**; external `<a href>` links are allowed (CLAUDE.md).
- Never touch archived exhibit folders (`atakee-fortunecity-2004/`, `dtm-ab-2002/`, `tbmm-kpk-2006/`, `thoughtful-thoughts-2011/`, `atakees-blog-2013/`, `geocities-cindy-2002/`).
- The museum email must never appear assembled anywhere.
- Copy all text/code blocks from this plan **byte-exact**, including typographic quotes (“ ” ’ —). After writing a file, byte-verify the copied blocks against the plan (cheap models have flattened “ ” to " before).
- Commit messages: simple and concise, **no** Claude signature, **no** Co-Authored-By footer.
- `playwright-cli` uses the bundled chromium (config `.playwright/cli.config.json`); pass `-s=<session>` if agents run in parallel. Serve with `python3 -m http.server 8765` from repo root.

---

### Task 1: `links.html` + CSS

**Files:**
- Modify: `assets/museum.css` (append one block at end of file)
- Create: `links.html`

**Interfaces:**
- Produces: `links.html` at repo root (Task 2 links to it as `links.html`), CSS classes `.linklist`, `.lyear`, `.alivechip`, `.lnote`.

- [ ] **Step 1: Append the links-page block to `assets/museum.css`**

Append at end of file:

```css

/* links page */
.linklist { list-style: none; margin: 0 0 .75rem; }
.linklist li { margin-bottom: .9rem; color: var(--ink); }
.linklist .lyear {
  font: bold 12px 'Courier New', monospace;
  color: var(--amber); margin-right: .35rem;
}
.linklist .alivechip {
  font: bold 10px Verdana, sans-serif; color: var(--bg);
  background: var(--green); padding: 0 .35rem; border-radius: 2px;
  margin-left: .35rem; vertical-align: middle; white-space: nowrap;
}
.linklist .lnote { color: var(--muted); }
```

- [ ] **Step 2: Create `links.html`** with exactly this content:

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>The links page · websites through the years</title>
<meta name="description" content="The links page every 1999 homepage had — the old web outside these walls, in Wayback captures and living fossils.">
<link rel="stylesheet" href="assets/museum.css">
</head>
<body>

<div class="wrap">

<nav class="crumbs"><a href="index.html">← back to the museum</a></nav>

<header class="plaquehead">
  <span class="year">every homepage had one</span>
  <h1>The links page</h1>
  <p class="host">the web outside these walls · curated from memory</p>
</header>

<section>
  <h2>Before you click</h2>
  <p>Every homepage of that era ended in a links page — the door to the rest
  of the web, back when the web felt small enough to recommend. This one is
  the museum's only room whose doors all open <i>outward</i>: most lead to the
  Wayback Machine's capture of a site as it looked then, and a few — marked
  <span class="alivechip">STILL LIVE</span> — lead to pages that are,
  astonishingly, still standing today.</p>
  <p class="aside">The museum hosts none of these; it only points. Side
  effects of time travel are the visitor's own responsibility.</p>
</section>

<section>
  <h2>The web as I saw it · Ankara &amp; Berlin, 1999 – 2006</h2>
  <p class="aside">The sites I actually remember dialing into. Memories drafted
  by the curator's assistant; corrections by the curator himself.</p>
  <ul class="linklist">
    <li><span class="lyear">1999</span><a href="https://web.archive.org/web/1999/http://www.altavista.com/">AltaVista</a>
      <span class="lnote">— where you searched before you googled.</span></li>
    <li><span class="lyear">1999</span><a href="https://web.archive.org/web/1999/http://www.google.com/">Google</a>
      <span class="lnote">— the clean white page that quietly ended the portal era. We didn't know yet.</span></li>
    <li><span class="lyear">1999</span><a href="https://web.archive.org/web/1999/http://www.hotmail.com/">Hotmail</a>
      <span class="lnote">— your first email address that didn't belong to your ISP.</span></li>
    <li><span class="lyear">1999</span><a href="https://web.archive.org/web/1999/http://www.icq.com/">ICQ</a>
      <span class="lnote">— <i>uh-oh!</i> The sound of the late nineties. My number is long forgotten.</span></li>
    <li><span class="lyear">1999</span><a href="https://web.archive.org/web/2001/http://sozluk.sourtimes.org/">Ekşi Sözlük</a>
      <span class="lnote">— born the same year as my homepage; the Turkish web's collaborative dictionary of everything, still running.</span></li>
    <li><span class="lyear">2000</span><a href="https://web.archive.org/web/2000/http://www.mynet.com/">Mynet</a>
      <span class="lnote">— the Turkish portal: news, chat, email and everything else on one page.</span></li>
    <li><span class="lyear">2000</span><a href="https://web.archive.org/web/2000/http://www.superonline.com/">Superonline</a>
      <span class="lnote">— the ISP at the other end of the 56k handshake.</span></li>
    <li><span class="lyear">2000</span><a href="https://web.archive.org/web/2000/http://www.milliyet.com.tr/">Milliyet</a>
      <span class="lnote">— the morning paper, suddenly refreshing at lunchtime too.</span></li>
    <li><span class="lyear">2000</span><a href="https://web.archive.org/web/2000/http://www.ntvmsnbc.com/">ntvmsnbc</a>
      <span class="lnote">— breaking news in Turkish, under the strangest joint-venture name of the era.</span></li>
    <li><span class="lyear">2000</span><a href="https://web.archive.org/web/2000/http://www.spiegel.de/">Spiegel Online</a>
      <span class="lnote">— German news, read first from abroad, later from Berlin itself.</span></li>
    <li><span class="lyear">2000</span><a href="https://web.archive.org/web/2000/http://www.web.de/">web.de</a>
      <span class="lnote">— Germany's portal-and-email combo; every second German address ended in it.</span></li>
    <li><span class="lyear">2004</span><a href="https://web.archive.org/web/2004/http://www.fu-berlin.de/">Freie Universität Berlin</a>
      <span class="lnote">— my university's homepage in the Berlin years. The museum's hunt through its old servers for my own pages found nothing.</span></li>
    <li><span class="lyear">2005</span><a href="https://web.archive.org/web/2005/http://www.warwick.ac.uk/">University of Warwick</a>
      <span class="lnote">— the other alma mater, mid-decade. Its servers kept no trace of me either.</span></li>
  </ul>
</section>

<section>
  <h2>Famous neighbors · the sites every history mentions</h2>
  <ul class="linklist">
    <li><span class="lyear">1991</span><a href="https://info.cern.ch/hypertext/WWW/TheProject.html">The first website</a><span class="alivechip">STILL LIVE</span>
      <span class="lnote">— the first page of the World Wide Web, restored by CERN at its original address.</span></li>
    <li><span class="lyear">1995</span><a href="https://web.archive.org/web/1996/http://www.amazon.com/">Amazon</a>
      <span class="lnote">— “Earth's biggest bookstore,” selling only books, captured as close to the beginning as the archive gets.</span></li>
    <li><span class="lyear">1996</span><a href="https://web.archive.org/web/1996/http://www.yahoo.com/">Yahoo!</a>
      <span class="lnote">— the web as a directory: a hand-sorted catalog of everything, with an exclamation mark.</span></li>
    <li><span class="lyear">1997</span><a href="https://web.archive.org/web/1997/http://www.ebay.com/">eBay</a>
      <span class="lnote">— fresh out of its AuctionWeb years, still trading Beanie Babies and Pez dispensers.</span></li>
    <li><span class="lyear">1998</span><a href="https://web.archive.org/web/1998/http://www.google.com/">Google, in beta</a>
      <span class="lnote">— a Stanford research project with an “I'm feeling lucky” button.</span></li>
    <li><span class="lyear">1996</span><a href="https://www.spacejam.com/1996/">Space Jam</a><span class="alivechip">STILL LIVE</span>
      <span class="lnote">— the most famous surviving 1996 website; Warner Bros never took it down.</span></li>
    <li><span class="lyear">1996</span><a href="http://www.dolekemp96.org/">Dole/Kemp '96</a><span class="alivechip">STILL LIVE</span>
      <span class="lnote">— a US presidential campaign, frozen mid-election for thirty years.</span></li>
    <li><span class="lyear">1999</span><a href="https://web.archive.org/web/1999/http://www.hampsterdance.com/">Hampster Dance</a>
      <span class="lnote">— four rodent GIFs and a nine-second loop: the first meme to escape the web.</span></li>
    <li><span class="lyear">1999</span><a href="https://zombo.com/">Zombo.com</a><span class="alivechip">STILL LIVE</span>
      <span class="lnote">— “You can do anything at Zombo com. The only limit is yourself.” Outlived Flash itself.</span></li>
    <li><span class="lyear">1997</span><a href="https://web.archive.org/web/2002/http://www.timecube.com/">Time Cube</a>
      <span class="lnote">— Gene Ray's four-simultaneous-days manifesto; the web's great outsider artwork.</span></li>
    <li><span class="lyear">1995</span><a href="https://www.berkshirehathaway.com/">Berkshire Hathaway</a><span class="alivechip">STILL LIVE</span>
      <span class="lnote">— Warren Buffett's homepage: plain HTML, no stylesheet, several hundred billion dollars.</span></li>
    <li><span class="lyear">2005</span><a href="http://www.milliondollarhomepage.com/">The Million Dollar Homepage</a><span class="alivechip">STILL LIVE</span>
      <span class="lnote">— a student sold a million pixels at a dollar each; every ad is still there, most now pointing at ghosts.</span></li>
    <li><span class="lyear">2000</span><a href="https://www.lingscars.com/">Ling's Cars</a><span class="alivechip">STILL LIVE</span>
      <span class="lnote">— the loudest website on Earth, entirely on purpose, gloriously undimmed.</span></li>
  </ul>
</section>

<p class="doorway"><a class="enter" href="index.html">Back to the museum →</a></p>

<footer><a href="index.html">websites through the years</a> — a personal museum of the early web</footer>

</div>

</body>
</html>
```

- [ ] **Step 3: Verify every link resolves**

Write the URL list and check each (Wayback rate limit: sleep between requests):

```bash
LIST=/tmp/claude-1000/-home-atakee-projects-eski-web-sayfalarim/48efd0d1-7db7-47bf-b550-98f7a8711c2b/scratchpad/linkcheck.txt
grep -o 'href="http[^"]*"' links.html | sed 's/href="//;s/"$//' | sort -u > "$LIST"
while read -r url; do
  code=$(curl -s -o /dev/null -w '%{http_code}' -L --max-time 45 "$url")
  echo "$code $url"
  sleep 2
done < "$LIST"
```

Expected: every line starts with `200`. If a Wayback URL fails: retry once (archive.org drops connections when hammered), then try a neighboring year (e.g. `/2001/` instead of `/2000/`). If a live-fossil URL fails: first try swapping the scheme (`http://` ↔ `https://`); only if both fail, replace its href with a Wayback form of the same site and delete its `alivechip` span. Record any substitution in the task report. (All six live fossils and the two riskiest Wayback URLs were spot-checked 200 on 2026-08-07 during plan audit.)

- [ ] **Step 4: Browser check**

```bash
cd /home/atakee/projects/eski-web-sayfalarim && python3 -m http.server 8765 &
```

With `playwright-cli` (bundled chromium, config `.playwright/cli.config.json`): open `http://localhost:8765/links.html`, confirm zero console errors, take a screenshot and confirm the page renders (header, two link sections, chips). Then run:

```js
performance.getEntriesByType('resource').map(r => r.name).filter(n => !n.startsWith(location.origin))
```

Expected: `[]` (the stylesheet is the only resource and it is same-host). Kill the server and close the browser session when done.

- [ ] **Step 5: Byte-verify quotes and commit**

Confirm the typographic characters survived (must all appear):

```bash
grep -c '“' links.html            # expected: 3 (three opening typographic quotes)
grep -c '’' links.html            # expected: 0 (page uses ASCII ' apostrophes only)
grep -c '·' links.html            # expected: ≥ 4
grep -c 'Ekşi Sözlük' links.html  # expected: 1 (Turkish characters survived)
grep -c 'Universität' links.html  # expected: 1 (German characters survived)
```

```bash
git add assets/museum.css links.html
git commit -m "Add links page: the web outside these walls"
```

---

### Task 2: Landing page integration

**Files:**
- Modify: `index.html` (timeline 2026 line, footer `.foot-extra`)

**Interfaces:**
- Consumes: `links.html` from Task 1.

- [ ] **Step 1: Extend the timeline's 2026 entry**

In `index.html`, replace:

```html
      <li><span class="y">2026</span>The museum opens — the recovery is documented in <a href="restoration-lab.html">the restoration lab</a> — and <a href="guestbook.html">the guestbook</a> reopens.</li>
```

with:

```html
      <li><span class="y">2026</span>The museum opens — the recovery is documented in <a href="restoration-lab.html">the restoration lab</a> — <a href="guestbook.html">the guestbook</a> reopens, and <a href="links.html">a links page</a> opens onto the web outside these walls.</li>
```

- [ ] **Step 2: Add the footer link**

In `index.html`'s `.foot-extra`, replace:

```html
    <a href="guestbook.html">Sign the guestbook →</a>
```

with:

```html
    <a href="guestbook.html">Sign the guestbook →</a>
    <a href="links.html">The links page →</a>
```

- [ ] **Step 3: Browser check**

Serve on 8765 as in Task 1; open `http://localhost:8765/index.html` with playwright-cli. Confirm: zero console errors; the timeline 2026 line shows all three links; the footer shows the new link between the guestbook link and the badges without breaking the row layout (screenshot). Close server/session.

- [ ] **Step 4: Commit**

```bash
git add index.html
git commit -m "Landing page: link the links page (timeline + footer)"
```

---

### Task 3: Documentation

**Files:**
- Modify: `README.md` (Curation layer section)
- Modify: `CLAUDE.md` (shell page list)

- [ ] **Step 1: README — add a Curation layer bullet**

In `README.md`, in the `## Curation layer` section, after the timeline bullet (`- A timeline on the landing page connects the exhibits (1998–2026).`), insert:

```markdown
- `links.html` — the links page every homepage had, pointing outward:
  Wayback captures of the sites the curator remembers visiting (Ankara &
  Berlin, 1999–2006) and the famous classics, plus the handful that are
  still alive at their original addresses.
```

- [ ] **Step 2: CLAUDE.md — add links.html to the shell list**

In `CLAUDE.md`, replace:

```
`index.html` (landing page), `plaques/` (curator plaques),
`restoration-lab.html`, `guestbook.html`, `.github/` (issue templates),
```

with:

```
`index.html` (landing page), `plaques/` (curator plaques),
`restoration-lab.html`, `guestbook.html`, `links.html`, `.github/` (issue templates),
```

- [ ] **Step 3: Commit**

```bash
git add README.md CLAUDE.md
git commit -m "Docs: links page in README curation layer and CLAUDE.md shell list"
```

---

## Post-implementation (controller, not a task)

- User vets the personal-section memories and the link selection (drafted notes are flagged in the page itself: “Memories drafted by the curator's assistant; corrections by the curator himself.”).
- Push only on the user's explicit go-ahead, then verify Pages build.
- After push: save `links.html` to the Wayback Machine (`curl -L https://web.archive.org/save/https://atakee72.github.io/websites-through-the-years/links.html`) — and retry the two pending cindy SPN saves while at it (SPN was down 2026-07-13).
