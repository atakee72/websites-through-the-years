# Deeper Curation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add five curator-plaque pages, a restoration-lab page, and a landing-page timeline to the web museum, per `docs/superpowers/specs/2026-07-12-deeper-curation-design.md`.

**Architecture:** Hand-written static HTML, no build step. New pages share `assets/museum.css`; the landing page `index.html` keeps its inline CSS and is edited only for card links, the timeline section, and two lab links. Archived site folders are never touched.

**Tech Stack:** Plain HTML/CSS. Testing via `python3 -m http.server 8765` + `playwright-cli` (config auto-loaded from `.playwright/cli.config.json`, bundled chromium channel — the chrome channel is NOT installed).

## Global Constraints

- Repo root: `/home/atakee/projects/eski-web-sayfalarim`. All paths below are repo-relative.
- Do NOT modify anything under `atakee-fortunecity-2004/`, `dtm-ab-2002/`, `tbmm-kpk-2006/`, `thoughtful-thoughts-2011/`, `atakees-blog-2013/`, `backups/`.
- Shell pages make **zero external requests** (no CDN fonts/scripts/images). External *links* (`<a href>` to github.com, web.archive.org, blogspot.com) are allowed.
- In the restoration lab, historical ad/tracking code is shown ONLY as HTML-escaped text inside `<pre>` blocks (`<` → `&lt;`, `>` → `&gt;`, `&` → `&amp;`). Never as live markup.
- Commit messages: simple one-liners, **no** Claude signature, **no** Co-Authored-By footer.
- Do NOT push in any task. Push happens only after the user has reviewed the plaque texts (review gate, end of plan).
- Playwright console logs are auto-written to `.playwright-cli/console-*.log` (gitignored). After loading pages, check the newest log for errors.
- Test server: if not already running, start once with `python3 -m http.server 8765` from repo root (background). URL-encode paths when testing.

---

### Task 1: Shared stylesheet `assets/museum.css`

**Files:**
- Create: `assets/museum.css`

**Interfaces:**
- Consumes: nothing.
- Produces: class names used verbatim by Tasks 2–7: `wrap`, `crumbs`, `plaquehead`, `year`, `at`, `host`, `shot`, `aside`, `doorway`, `enter`, `lab`, `specimen`, `specimen-label`. Palette is copied from `index.html`'s `:root` (do not invent colors).

- [ ] **Step 1: Write the stylesheet**

```css
/* museum.css — shared stylesheet for the plaque pages and the restoration lab.
   Palette mirrors index.html's inline styles (kept in sync by hand). */
:root {
  --bg: #101418;
  --panel: #1a2129;
  --ink: #e8e6e1;
  --muted: #9aa4ae;
  --amber: #ffb454;
  --green: #7dd97d;
  --line: #2c3640;
}
* { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; }
body {
  background: var(--bg); color: var(--ink);
  font: 16px/1.6 Georgia, 'Times New Roman', serif;
  padding: 0 1rem;
}
.wrap { max-width: 46rem; margin: 0 auto; }
nav.crumbs { padding: 2rem 0 0; }
nav.crumbs a {
  color: var(--green); text-decoration: none;
  border-bottom: 1px dotted var(--green); font: 13px Verdana, sans-serif;
}
nav.crumbs a:hover { color: var(--amber); border-color: var(--amber); }
header.plaquehead { padding: 2.5rem 0 1.5rem; border-bottom: 1px solid var(--line); }
.year {
  font: bold 13px 'Courier New', monospace;
  color: var(--bg); background: var(--amber);
  display: inline-block; padding: .1rem .6rem; border-radius: 2px;
}
h1 { font-size: clamp(1.6rem, 4vw, 2.4rem); font-weight: normal; margin: .6rem 0 .4rem; }
h1 .at { color: var(--amber); }
.host { font: 13px 'Courier New', monospace; color: var(--green); }
figure.shot { margin: 2rem 0 0; }
figure.shot img {
  width: 100%; height: auto; display: block;
  border: 1px solid #555; border-radius: 4px;
  box-shadow: 0 10px 30px rgba(0,0,0,.5);
}
figure.shot figcaption { font-size: .85rem; color: var(--muted); font-style: italic; margin-top: .5rem; }
section { padding: 1.5rem 0; border-bottom: 1px solid var(--line); }
section h2 {
  font: bold 14px 'Courier New', monospace; letter-spacing: .15em;
  text-transform: uppercase; color: var(--amber); margin-bottom: .75rem;
}
section p { margin-bottom: .75rem; }
section .aside { color: var(--muted); font-style: italic; }
section a { color: var(--green); }
section ul { margin: 0 0 .75rem 1.2rem; }
section li { color: var(--muted); margin-bottom: .5rem; }
.doorway { padding: 2.5rem 0; text-align: center; }
.enter {
  display: inline-block; font: bold 15px Verdana, sans-serif;
  color: var(--bg); background: var(--green);
  padding: .7rem 1.4rem; border-radius: 3px; text-decoration: none;
}
.enter:hover { background: var(--amber); }
footer { padding: 1rem 0 3rem; color: var(--muted); font-size: .9rem; }
footer a {
  color: var(--green); text-decoration: none;
  border-bottom: 1px dotted var(--green);
}
footer a:hover { color: var(--amber); border-color: var(--amber); }

/* restoration lab */
.lab section h2 { font-size: 15px; }
pre {
  background: #0b0f13; border: 1px solid var(--line); border-radius: 4px;
  padding: 1rem; overflow-x: auto;
  font: 13px/1.5 'Courier New', monospace; color: var(--muted);
  margin: 0 0 .75rem;
}
code {
  font: 13px 'Courier New', monospace; color: var(--green);
  background: #10161c; padding: 0 .3rem; border-radius: 2px;
}
pre code { background: none; padding: 0; color: inherit; }
.specimen { border-left: 4px solid #a33; }
.specimen-label {
  font: bold 12px 'Courier New', monospace; color: #d77;
  letter-spacing: .1em; text-transform: uppercase; margin-bottom: .4rem;
}
```

- [ ] **Step 2: Sanity-check the file parses**

Run: `python3 -c "import re,sys; s=open('assets/museum.css').read(); assert s.count('{')==s.count('}'), 'brace mismatch'; print('ok')"`
Expected: `ok`

- [ ] **Step 3: Commit**

```bash
git add assets/museum.css
git commit -m "Add shared stylesheet for plaque pages and restoration lab"
```

---

### Task 2: Plaque — @t@kee's homepage (`plaques/fortunecity.html`)

**Files:**
- Create: `plaques/fortunecity.html`

**Interfaces:**
- Consumes: `assets/museum.css` classes from Task 1 (paths from `plaques/` are `../assets/…`).
- Produces: URL `plaques/fortunecity.html`, linked by Task 8's landing card and timeline.

- [ ] **Step 1: Write the page**

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>@t@kee's homepage (1999–2004) — plaque · websites through the years</title>
<meta name="description" content="Curator's plaque for @t@kee's homepage, a 1999 FortuneCity personal site recovered from the Wayback Machine.">
<link rel="stylesheet" href="../assets/museum.css">
</head>
<body>
<div class="wrap">

<nav class="crumbs"><a href="../index.html">← back to the museum</a></nav>

<header class="plaquehead">
  <span class="year">1999 – 2004</span>
  <h1><span class="at">@t@kee</span>'s homepage</h1>
  <p class="host">members.fortunecity.com/atakee1 · FrontPage Express 2.0</p>
</header>

<figure class="shot">
  <img src="../assets/fortunecity.png" alt="Screenshot of @t@kee's homepage, rainbow letters on black background">
  <figcaption>The homepage as the Wayback Machine saw it in January 2004.</figcaption>
</figure>

<section>
  <h2>The story</h2>
  <p>This is where it all started: my first website, built in 1999 with FrontPage
  Express — the free editor that came bundled with Internet Explorer — and uploaded
  to a free plot of land on FortuneCity. Rainbow lettering on a black background,
  a picture gallery, a CV, pages about Turkey and travel, jokes, baklava, a
  guestbook, an ICQ number. Everything a personal homepage was supposed to have.</p>
  <p>One corner of it was called <i>thoughtful thoughts</i> — a name that would
  resurface eleven years later as a blog, on the other side of this museum.
  The site was maintained until about 2004; FortuneCity itself went dark in 2012
  and took the original with it. What you see here was recovered in 2026 from
  Wayback Machine captures taken between 2004 and 2012.</p>
</section>

<section>
  <h2>The era</h2>
  <p class="aside">1999: the web arrives over a 56k modem onto an 800×600 CRT.
  Personal homepages live on free hosts — GeoCities, FortuneCity, Tripod — paid
  for with injected banner ads. Hit counters prove somebody visited, guestbooks
  let them say so, and your ICQ number is how they find you afterwards. Nobody
  has a smartphone; half the badges say “best viewed in Internet Explorer.”</p>
</section>

<section>
  <h2>What was restored</h2>
  <p>The free host's injected ad and tracking scripts were stripped (they're on
  display in the <a href="../restoration-lab.html">restoration lab</a>); the dead
  hit counter and the news-headlines box were rebuilt to work again. Everything
  else is untouched — including a photo that has pointed at
  <code>C:\My Documents\</code> since the day it was uploaded, and one picture
  the archive never captured.</p>
</section>

<section>
  <h2>Sources</h2>
  <ul>
    <li><a href="https://web.archive.org/web/20040130074500/http://members.fortunecity.com/atakee1/">Wayback Machine capture, 30 January 2004</a> — the recovery anchor</li>
    <li><a href="https://github.com/atakee72/websites-through-the-years">Repository</a> — every intervention documented commit by commit</li>
  </ul>
</section>

<p class="doorway"><a class="enter" href="../atakee-fortunecity-2004/index.htm">Enter the exhibit →</a></p>

<footer><a href="../index.html">websites through the years</a> — a personal museum of the early web</footer>

</div>
</body>
</html>
```

- [ ] **Step 2: Verify in browser**

```bash
curl -s localhost:8765 >/dev/null || (cd /home/atakee/projects/eski-web-sayfalarim && python3 -m http.server 8765 >/dev/null 2>&1 &)
playwright-cli open http://localhost:8765/plaques/fortunecity.html
playwright-cli snapshot
```
Expected: heading "@t@kee's homepage", sections The story / The era / What was restored / Sources, "Enter the exhibit →" link. Newest `.playwright-cli/console-*.log` contains no errors.

- [ ] **Step 3: Verify links resolve**

Run: `playwright-cli eval "Promise.all([...document.querySelectorAll('a[href]:not([href^=http])')].map(a=>fetch(a.href,{method:'HEAD'}).then(r=>r.ok?null:a.getAttribute('href')))).then(x=>x.filter(Boolean))"`
Expected: `["../restoration-lab.html"]` only (built in Task 7 — every other local link resolves now).

- [ ] **Step 4: Commit**

```bash
git add plaques/fortunecity.html
git commit -m "Add curator plaque for the FortuneCity homepage"
```

---

### Task 3: Plaque — Türkiye–EU / Foreign Trade (`plaques/dtm.html`)

**Files:**
- Create: `plaques/dtm.html`

**Interfaces:**
- Consumes: `assets/museum.css` classes from Task 1.
- Produces: URL `plaques/dtm.html`, linked by Task 8.

- [ ] **Step 1: Write the page**

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Türkiye–EU Relations, Undersecretariat of Foreign Trade (2001–2002) — plaque · websites through the years</title>
<meta name="description" content="Curator's plaque for the EU affairs section of dtm.gov.tr, built and run by its webmaster in 2001–2002, recovered from the Wayback Machine.">
<link rel="stylesheet" href="../assets/museum.css">
</head>
<body>
<div class="wrap">

<nav class="crumbs"><a href="../index.html">← back to the museum</a></nav>

<header class="plaquehead">
  <span class="year">2001 – 2002</span>
  <h1>Türkiye–EU Relations · Undersecretariat of Foreign Trade</h1>
  <p class="host">www.dtm.gov.tr/AB · FrontPage 4.0 · windows-1254</p>
</header>

<figure class="shot">
  <img src="../assets/dtm.png" alt="Screenshot of the Türkiye–EU relations site with a map of Europe, Turkey highlighted in yellow">
  <figcaption>The EU affairs front page, captured 12 February 2002.</figcaption>
</figure>

<section>
  <h2>The story</h2>
  <p>My first professional site. As webmaster at the Undersecretariat of Foreign
  Trade (Dış Ticaret Müsteşarlığı) I built and ran the EU affairs section:
  the legal texts of Türkiye–EU relations, the customs union, free trade
  agreements, trade statistics — 128 pages of it, hand-assembled in FrontPage
  on a government desk in Ankara.</p>
  <p>And one thing the official brief did not include: on the map of Europe,
  over a certain spot on the Bosphorus called Üsküdar, I hid a secret link to
  my personal homepage. The archive's capture dates from just after I left —
  a successor had already replaced the webmaster line — so this restoration
  puts a few things back the way I had them, easter egg included.</p>
</section>

<section>
  <h2>The era</h2>
  <p class="aside">2001: Türkiye has just been declared an EU candidate at
  Helsinki (1999), the customs union is five years old, and “e-government” is
  a word ministries are still learning to pronounce. Official sites are built
  in-house by whoever knows HTML, tables inside tables, encoded in
  windows-1254 because Turkish and the web haven't fully made peace yet.</p>
</section>

<section>
  <h2>What was restored</h2>
  <p>Six shared template graphics the archive never captured under
  <code>/AB/</code> were recovered from identical copies in sibling sections of
  the same server; one filename was made ASCII-safe; an IE4-era FrontPage
  animation was wrapped so modern browsers stay quiet. The author's own
  restorations — original webmaster contact, gray background, full-width
  layout, the Üsküdar easter egg — are documented one commit each in the
  <a href="../restoration-lab.html">restoration lab</a>. One page
  (<i>euro1.htm</i>) is lost forever: the archive never took a copy.</p>
</section>

<section>
  <h2>Sources</h2>
  <ul>
    <li><a href="https://web.archive.org/web/20020212141252/http://www.dtm.gov.tr/AB/AB.htm">Wayback Machine capture, 12 February 2002</a> — the recovery anchor</li>
    <li><a href="https://github.com/atakee72/websites-through-the-years">Repository</a> — every intervention documented commit by commit</li>
  </ul>
</section>

<p class="doorway"><a class="enter" href="../dtm-ab-2002/AB.htm">Enter the exhibit →</a></p>

<footer><a href="../index.html">websites through the years</a> — a personal museum of the early web</footer>

</div>
</body>
</html>
```

- [ ] **Step 2: Verify in browser**

```bash
playwright-cli goto http://localhost:8765/plaques/dtm.html
playwright-cli snapshot
```
Expected: heading "Türkiye–EU Relations · Undersecretariat of Foreign Trade", all four sections (story, era, restored, sources), enter link to `../dtm-ab-2002/AB.htm`. No console errors in newest log.

- [ ] **Step 3: Commit**

```bash
git add plaques/dtm.html
git commit -m "Add curator plaque for the DTM EU affairs site"
```

---

### Task 4: Plaque — TBMM Joint Parliamentary Committee (`plaques/tbmm.html`)

**Files:**
- Create: `plaques/tbmm.html`

**Interfaces:**
- Consumes: `assets/museum.css` classes from Task 1.
- Produces: URL `plaques/tbmm.html`, linked by Task 8.

- [ ] **Step 1: Write the page**

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Turkey–EU Joint Parliamentary Committee, TBMM (2004–2006) — plaque · websites through the years</title>
<meta name="description" content="Curator's plaque for the Turkey–EU Joint Parliamentary Committee site at the Turkish Grand National Assembly, recovered from the Wayback Machine.">
<link rel="stylesheet" href="../assets/museum.css">
</head>
<body>
<div class="wrap">

<nav class="crumbs"><a href="../index.html">← back to the museum</a></nav>

<header class="plaquehead">
  <span class="year">2004 – 2006</span>
  <h1>Turkey–EU Joint Parliamentary Committee · TBMM</h1>
  <p class="host">www.tbmm.gov.tr/ul_kom/kpk · FrontPage 3.0 · iso-8859-9 · tr en de fr</p>
</header>

<figure class="shot">
  <img src="../assets/tbmm.png" alt="Screenshot of the Turkey–EU Joint Parliamentary Committee site">
  <figcaption>The committee site as captured on 27 December 2006.</figcaption>
</figure>

<section>
  <h2>The story</h2>
  <p>At the Turkish Grand National Assembly I ran the site of the Turkey–EU
  Joint Parliamentary Committee (Karma Parlamento Komisyonu) — the body where
  Turkish MPs and Members of the European Parliament met across one table.
  Four languages, and an archive of thirty-three Word documents and a PDF:
  joint declarations, press releases and meeting programmes from the years
  when the accession talks actually began.</p>
  <p>It politely informs you it is “best viewed in Microsoft Internet
  Explorer.” It meant it.</p>
</section>

<section>
  <h2>The era</h2>
  <p class="aside">October 2005: accession negotiations between Türkiye and the
  EU formally open — the diplomatic high-water mark of the whole relationship.
  The paperwork of that moment passed through pages like these, built in
  FrontPage 3.0 and encoded in iso-8859-9, on a parliament web server that
  still spoke pure 1990s.</p>
</section>

<section>
  <h2>What was restored</h2>
  <p>Nothing — this was the cleanest recovery in the museum. No injected code,
  no broken references, no missing files. The only touches were the museum-wide
  UTF-8 transcoding and re-fetching one PDF the archive served truncated on the
  first try. Details in the <a href="../restoration-lab.html">restoration lab</a>.</p>
</section>

<section>
  <h2>Sources</h2>
  <ul>
    <li><a href="https://web.archive.org/web/20061227002006/http://www.tbmm.gov.tr/ul_kom/kpk/index.htm">Wayback Machine capture, 27 December 2006</a> — the recovery anchor</li>
    <li><a href="https://github.com/atakee72/websites-through-the-years">Repository</a> — every intervention documented commit by commit</li>
  </ul>
</section>

<p class="doorway"><a class="enter" href="../tbmm-kpk-2006/index.htm">Enter the exhibit →</a></p>

<footer><a href="../index.html">websites through the years</a> — a personal museum of the early web</footer>

</div>
</body>
</html>
```

- [ ] **Step 2: Verify in browser**

```bash
playwright-cli goto http://localhost:8765/plaques/tbmm.html
playwright-cli snapshot
```
Expected: heading with "TBMM", all four sections, enter link to `../tbmm-kpk-2006/index.htm`. No console errors in newest log.

- [ ] **Step 3: Commit**

```bash
git add plaques/tbmm.html
git commit -m "Add curator plaque for the TBMM committee site"
```

---

### Task 5: Plaque — Thoughtful thoughts (`plaques/thoughtful-thoughts.html`)

**Files:**
- Create: `plaques/thoughtful-thoughts.html`

**Interfaces:**
- Consumes: `assets/museum.css` classes from Task 1.
- Produces: URL `plaques/thoughtful-thoughts.html`, linked by Task 8.

- [ ] **Step 1: Write the page**

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Thoughtful thoughts (2010–2011) — plaque · websites through the years</title>
<meta name="description" content="Curator's plaque for Thoughtful thoughts, a Blogger blog rescued alive into a self-contained copy.">
<link rel="stylesheet" href="../assets/museum.css">
</head>
<body>
<div class="wrap">

<nav class="crumbs"><a href="../index.html">← back to the museum</a></nav>

<header class="plaquehead">
  <span class="year">2010 – 2011</span>
  <h1>Thoughtful thoughts</h1>
  <p class="host">atakee.blogspot.com · Blogger · tr en de</p>
</header>

<figure class="shot">
  <img src="../assets/thoughtful.png" alt="Screenshot of the Thoughtful thoughts blog, teal Blogger theme">
  <figcaption>The blog in its teal Blogger theme — the copy rescued here, not a screenshot of Google's servers.</figcaption>
</figure>

<section>
  <h2>The story</h2>
  <p>By 2010 the hand-coding had stopped; the writing hadn't. It moved to
  Blogger, under a name lifted straight from the 1999 homepage — <i>thoughtful
  thoughts</i> was a section there before it was a blog. Essays in Turkish,
  English and German: politics, integration, travel, whatever needed thinking
  through.</p>
  <p>Unlike the first three exhibits, this one was not recovered from an
  archive — it was <b>rescued alive</b>. The original still runs on Google's
  servers, but free platforms have a way of not lasting (ask FortuneCity).
  In 2026 the whole blog was crawled into the self-contained copy you're about
  to enter: every post, every archive page, every label, every image —
  independent of Google's mercy.</p>
</section>

<section>
  <h2>The era</h2>
  <p class="aside">2010: the late golden age of blogging. Blogger (Google's
  since 2003) and WordPress carry most of the personal web; comment threads
  are where conversation happens. Facebook and Twitter are already at the
  door, about to absorb exactly this kind of writing.</p>
</section>

<section>
  <h2>What was restored</h2>
  <p>The copy is hermetically sealed: zero requests to Google, zero live
  external links — fonts, theme graphics and images all live locally, and
  every outbound link is disarmed with its original URL preserved in the
  markup. The theme's hamburger-menu sidebar was re-wired with a small local
  script after Blogger's own JavaScript was stripped. Pictures Blogger itself
  had already lost stay broken — authentically. Full story in the
  <a href="../restoration-lab.html">restoration lab</a>.</p>
</section>

<section>
  <h2>Sources</h2>
  <ul>
    <li><a href="https://atakee.blogspot.com/">Live original</a> — still breathing, for now</li>
    <li>Google Takeout export in the repository's <code>backups/</code> — the lossless canonical source</li>
    <li><a href="https://github.com/atakee72/websites-through-the-years">Repository</a> — the rescue documented commit by commit</li>
  </ul>
</section>

<p class="doorway"><a class="enter" href="../thoughtful-thoughts-2011/index.html">Enter the exhibit →</a></p>

<footer><a href="../index.html">websites through the years</a> — a personal museum of the early web</footer>

</div>
</body>
</html>
```

- [ ] **Step 2: Verify in browser**

```bash
playwright-cli goto http://localhost:8765/plaques/thoughtful-thoughts.html
playwright-cli snapshot
```
Expected: heading "Thoughtful thoughts", all four sections, enter link to `../thoughtful-thoughts-2011/index.html`. No console errors in newest log.

- [ ] **Step 3: Commit**

```bash
git add plaques/thoughtful-thoughts.html
git commit -m "Add curator plaque for Thoughtful thoughts"
```

---

### Task 6: Plaque — @t@kee's blog (`plaques/atakees-blog.html`)

**Files:**
- Create: `plaques/atakees-blog.html`

**Interfaces:**
- Consumes: `assets/museum.css` classes from Task 1.
- Produces: URL `plaques/atakees-blog.html`, linked by Task 8.

- [ ] **Step 1: Write the page**

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>@t@kee's blog (2008–2013) — plaque · websites through the years</title>
<meta name="description" content="Curator's plaque for @t@kee's blog, a Blogger notebook rescued alive into a self-contained copy.">
<link rel="stylesheet" href="../assets/museum.css">
</head>
<body>
<div class="wrap">

<nav class="crumbs"><a href="../index.html">← back to the museum</a></nav>

<header class="plaquehead">
  <span class="year">2008 – 2013</span>
  <h1><span class="at">@t@kee</span>'s blog</h1>
  <p class="host">tbb-wissenschaftsforum.blogspot.com · Blogger</p>
</header>

<figure class="shot">
  <img src="../assets/atakees.png" alt="Screenshot of the @t@kee's blog, gold Blogger theme">
  <figcaption>The gold-themed notebook — six posts across five years.</figcaption>
</figure>

<section>
  <h2>The story</h2>
  <p>The address gives away a plan that never happened: it was registered in
  2008 for a “Wissenschaftsforum” — a science forum — that never came to be.
  The blog stayed, renamed but never re-addressed, and became a personal
  notebook: naval-archive detective work, a rant at Turkcell, philosophical
  takes on institutions. Six posts across five years.</p>
  <p>The last one is from 2013 — roughly the year personal blogging itself
  faded out, everywhere. Like its sibling exhibit, this blog was rescued
  alive in 2026: crawled from the still-running original into the
  self-contained copy shown here.</p>
</section>

<section>
  <h2>The era</h2>
  <p class="aside">2008–2013: blogging's long goodbye. The writing migrates to
  Facebook walls and 140 characters; Google Reader — the RSS heart of the
  blogosphere — is shut down in 2013, the same year this blog went quiet.</p>
</section>

<section>
  <h2>What was restored</h2>
  <p>The same hermetic seal as its sibling: zero requests to Google, zero live
  external links, every asset local, every outbound link disarmed with its
  original URL preserved in the markup. Pictures Blogger's own image proxy had
  already lost stay broken — authentically. Full story in the
  <a href="../restoration-lab.html">restoration lab</a>.</p>
</section>

<section>
  <h2>Sources</h2>
  <ul>
    <li><a href="https://tbb-wissenschaftsforum.blogspot.com/">Live original</a> — still breathing, for now</li>
    <li>Google Takeout export in the repository's <code>backups/</code> — the lossless canonical source</li>
    <li><a href="https://github.com/atakee72/websites-through-the-years">Repository</a> — the rescue documented commit by commit</li>
  </ul>
</section>

<p class="doorway"><a class="enter" href="../atakees-blog-2013/index.html">Enter the exhibit →</a></p>

<footer><a href="../index.html">websites through the years</a> — a personal museum of the early web</footer>

</div>
</body>
</html>
```

- [ ] **Step 2: Verify in browser**

```bash
playwright-cli goto http://localhost:8765/plaques/atakees-blog.html
playwright-cli snapshot
```
Expected: heading "@t@kee's blog", all four sections, enter link to `../atakees-blog-2013/index.html`. No console errors in newest log.

- [ ] **Step 3: Commit**

```bash
git add plaques/atakees-blog.html
git commit -m "Add curator plaque for @t@kee's blog"
```

---

### Task 7: Restoration lab (`restoration-lab.html`)

**Files:**
- Create: `restoration-lab.html`

**Interfaces:**
- Consumes: `assets/museum.css` from Task 1 (page sits at repo root, so paths are `assets/…`, `index.html`).
- Produces: URL `restoration-lab.html`, linked by every plaque (Tasks 2–6) and by Task 8's landing edits.

**CRITICAL:** every historical code sample below is HTML-escaped on purpose (`&lt;script&gt;` etc.). Copy them exactly — do not "fix" the escaping, or the museum page would execute 1999 ad code.

- [ ] **Step 1: Write the page**

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>The restoration lab · websites through the years</title>
<meta name="description" content="How the museum's exhibits were recovered: Wayback Machine archaeology, the junk that was stripped, the charset surgery, and the live Blogger rescue.">
<link rel="stylesheet" href="assets/museum.css">
</head>
<body>
<div class="wrap lab">

<nav class="crumbs"><a href="index.html">← back to the museum</a></nav>

<header class="plaquehead">
  <span class="year">2026</span>
  <h1>The restoration lab</h1>
  <p class="host">how the exhibits got here</p>
</header>

<section>
  <h2>1 · Digging in the Wayback Machine</h2>
  <p>The three hand-coded sites died with their hosts; the
  <a href="https://web.archive.org">Internet Archive's Wayback Machine</a> had
  been quietly photographing them for years. Recovery starts with the CDX API —
  a catalogue of every capture the archive holds under a URL prefix:</p>
  <pre><code>https://web.archive.org/cdx/search/cdx?url=members.fortunecity.com/atakee1*
    &amp;collapse=urlkey&amp;fl=original,timestamp,statuscode&amp;filter=statuscode:200</code></pre>
  <p>Files are then fetched <i>raw</i> with the archive's <code>id_</code> flag,
  which turns off the Wayback toolbar and link-rewriting and returns the
  original bytes:</p>
  <pre><code>https://web.archive.org/web/20040130074500id_/http://members.fortunecity.com/atakee1/index.htm</code></pre>
  <p>A small crawler starts from one anchor capture and follows internal links;
  for each page the archive serves the capture nearest in time to the anchor,
  which keeps a whole site era-coherent instead of mixing 2001 pages with 2009
  ones. It fetches politely — about one request per second, with backoff,
  because archive.org drops connections when hammered — and it's resumable.</p>
  <p class="aside">Field notes: a Turkish “ç” in one filename crashed the crawler
  and had to be percent-encoded as windows-1254; six template graphics were
  never archived under the site's own path and were recovered from identical
  copies in sibling directories of the same server; one page (euro1.htm) was
  simply never captured, and is gone.</p>
</section>

<section>
  <h2>2 · The junk gallery</h2>
  <p>Free hosting was never free. FortuneCity paid for the disk space by
  injecting trackers, banner frames and pop-up machinery into every page it
  served. This — <b>displayed here as inert text, museum-glass style</b> — is
  what surrounded my homepage in the raw capture, and what was stripped in the
  restoration (the exhibit keeps every byte I actually wrote):</p>
  <p class="specimen-label">Specimen · injected by the host, removed 2026</p>
  <pre class="specimen"><code>&lt;script language="Javascript"&gt;
&lt;!-- hide
document.write('&lt;font size=-3&gt;&lt;img src="http://www.fortunecity.com/banners/track1.gif"
  height=1 width=1% border="0" name="FCimg11bnr" hspace=0 vspace=0&gt;');
// --&gt;
&lt;/script&gt;

&lt;script language="Javascript" src="http://www.fortunecity.com/js/adscript.global.new.js"&gt;
&lt;/script&gt;

var GiveMePopups = 1;
DisplayFCAdBanner();

&lt;table id="fcnavbartable2" style="visibility:hidden" ...&gt;
&lt;tr&gt;&lt;td&gt;&lt;iframe id="fcpopular" src="http://www.fortunecity.com/banners/popular.html"
  width="100%" height="15" ...&gt;&lt;/iframe&gt;&lt;/td&gt;&lt;/tr&gt;&lt;/table&gt;</code></pre>
  <p class="aside">A 1×1 tracking pixel, a global ad script, <code>var
  GiveMePopups = 1</code> — a variable name with the honesty of its age — and a
  hidden iframe of “popular” links. Later captures added Google Analytics and
  ZEDO ad tags on top. All of it is preserved in the repository's first commit,
  behind glass.</p>
</section>

<section>
  <h2>3 · The charset surgery</h2>
  <p>The one modernization every archived page had to accept: GitHub Pages
  serves all HTML with a <code>Content-Type: text/html; charset=utf-8</code>
  header, and an HTTP header outranks whatever a page's
  <code>&lt;meta&gt;</code> tag says. The exhibits were written in iso-8859-1,
  windows-1254 and iso-8859-9 — so every Turkish “ğşıçöü” arrived as mojibake.</p>
  <p>The fix: transcode each file to UTF-8, exactly once. Each file's real
  encoding is detected first (a strict UTF-8 decode as the test — six files
  turned out to be UTF-8 already, and transcoding them twice would have
  destroyed them), and only <code>.htm/.html</code> files are touched, never
  binaries. The original bytes live untouched in git history.</p>
</section>

<section>
  <h2>4 · Rescuing the living</h2>
  <p>The two blogs posed the opposite problem: not digging up the dead, but
  making the living independent of their landlord. They were crawled directly
  from Blogger — posts, year and month archives, label pages, the “older
  posts” pagination chains — then <b>hermetically sealed</b>: fonts, theme
  graphics and images pulled out of Google's CDNs into local folders, every
  reference rewritten (including <code>srcset</code> attributes, CSS
  <code>url()</code> values — some backslash-escaped, some protocol-relative —
  Open Graph metas and the favicon), every outbound link disarmed to
  <code>href="#"</code> with the original URL kept in a
  <code>data-original</code> attribute.</p>
  <p>Some post images had already been lost by Blogger's own image proxy while
  the blogs were live. Their references now point at an intentionally absent
  local path: still broken — that's authentic — but without dozens of slow,
  doomed round-trips to Google. Sealing cut the home page's load time roughly
  tenfold.</p>
  <p>The seal is verifiable in your browser console on any blog page:</p>
  <pre><code>performance.getEntriesByType('resource')
  .filter(r =&gt; !r.name.startsWith(location.origin))   // → []</code></pre>
</section>

<section>
  <h2>5 · Verify it yourself</h2>
  <p>Every intervention is a commit; the untouched originals are always one
  <code>git checkout</code> away. The load-bearing ones:</p>
  <ul>
    <li><a href="https://github.com/atakee72/websites-through-the-years/commit/cb12b36dae427df2fa6ccc1201617a671681c736">cb12b36</a> — the raw Wayback archive of the FortuneCity site, junk and all</li>
    <li><a href="https://github.com/atakee72/websites-through-the-years/commit/790722d3962576c5efb2b9548bb8d3185a6d7b36">790722d</a> — the junk stripped; hit counter rebuilt as a local replica</li>
    <li><a href="https://github.com/atakee72/websites-through-the-years/commit/a209cb1ca25c1a6e0b50eb632972204a228545eb">a209cb1</a> — the dead news-headlines widget revived on Wikipedia's feed</li>
    <li><a href="https://github.com/atakee72/websites-through-the-years/commit/63647b27f2c6996f8a777b9504d42d7c28cc9ef7">63647b2</a> — the Üsküdar easter egg re-armed</li>
    <li><a href="https://github.com/atakee72/websites-through-the-years/commit/d50d975eac81ac9e1b7d430b5bfb1e5c124c888b">d50d975</a> — the charset surgery, all three legacy encodings → UTF-8</li>
    <li><a href="https://github.com/atakee72/websites-through-the-years/commit/dc7be62b576cabe6cfc30678c2dcdcb57ef997a3">dc7be62</a> — both blogs rescued alive as static copies</li>
    <li><a href="https://github.com/atakee72/websites-through-the-years/commit/d4685f938c9888d19638eb97f19c325332ebb15f">d4685f9</a> — the hermetic seal: fonts local, dead proxies cut, external links disarmed</li>
    <li><a href="https://github.com/atakee72/websites-through-the-years/commit/b0ebf2dc0dfd575ede309159931ae12f28cb0ad4">b0ebf2d</a> — the blog sidebar drawer brought back to life</li>
  </ul>
</section>

<p class="doorway"><a class="enter" href="index.html">Back to the museum →</a></p>

<footer><a href="index.html">websites through the years</a> — a personal museum of the early web</footer>

</div>
</body>
</html>
```

- [ ] **Step 2: Verify in browser — especially that the specimen is inert**

```bash
playwright-cli goto http://localhost:8765/restoration-lab.html
playwright-cli snapshot
playwright-cli eval "performance.getEntriesByType('resource').map(r=>r.name).filter(n=>!n.startsWith(location.origin))"
```
Expected: five chapters visible; the specimen shows as literal `<script ...>` text inside a red-edged box; the eval returns `[]` (zero external requests — if the specimen were live, fortunecity.com requests would appear here). No console errors in newest log.

- [ ] **Step 3: Commit**

```bash
git add restoration-lab.html
git commit -m "Add restoration lab page"
```

---

### Task 8: Landing page — cards link to plaques, timeline, lab links

**Files:**
- Modify: `index.html` (five card sections ~lines 156–276; style block; after last `</section>` in `<main>`; curator's note closing paragraph ~line 307; footer ~line 316)

**Interfaces:**
- Consumes: URLs `plaques/fortunecity.html`, `plaques/dtm.html`, `plaques/tbmm.html`, `plaques/thoughtful-thoughts.html`, `plaques/atakees-blog.html`, `restoration-lab.html` (Tasks 2–7).
- Produces: final visitor flow — card → plaque → exhibit.

- [ ] **Step 1: Repoint the five cards at their plaques**

In each `.era` section, change three hrefs (screenshot `<a>`, `<h2><a>`, `.go` button) to the plaque URL and change the button text from `Enter site →` to `Read the plaque →`. Keep the `.wb` links unchanged. Exact mapping:

| Card | old href (×3) | new href (×3) |
|---|---|---|
| @t@kee's homepage | `atakee-fortunecity-2004/index.htm` | `plaques/fortunecity.html` |
| Türkiye–EU / DTM | `dtm-ab-2002/AB.htm` | `plaques/dtm.html` |
| TBMM committee | `tbmm-kpk-2006/index.htm` | `plaques/tbmm.html` |
| Thoughtful thoughts | `thoughtful-thoughts-2011/index.html` | `plaques/thoughtful-thoughts.html` |
| @t@kee's blog | `atakees-blog-2013/index.html` | `plaques/atakees-blog.html` |

Example — the first card's three edits (repeat the pattern for the other four):

```html
<a href="plaques/fortunecity.html"><img src="assets/fortunecity.png" alt="Screenshot of @t@kee's homepage, rainbow letters on black background" loading="lazy"></a>
```
```html
<h2><a href="plaques/fortunecity.html"><span class="at">@t@kee</span>'s homepage</a></h2>
```
```html
<a class="go" href="plaques/fortunecity.html">Read the plaque →</a>
```

- [ ] **Step 2: Add timeline CSS to the inline `<style>` block**

Insert before the `footer {` rule:

```css
  .timeline {
    max-width: 62rem; margin: 0 auto; padding: 3rem 0 0;
  }
  .timeline ol {
    list-style: none; margin: 1.5rem 0 0 .5rem;
    border-left: 2px solid var(--line); padding: 0;
  }
  .timeline li { position: relative; padding: 0 0 1.4rem 1.5rem; }
  .timeline li::before {
    content: ""; position: absolute; left: -7px; top: .45rem;
    width: 12px; height: 12px; border-radius: 50%; background: var(--amber);
  }
  .timeline li.flavor { color: var(--muted); font-size: .9rem; }
  .timeline li.flavor::before {
    width: 8px; height: 8px; left: -5px; top: .55rem; background: var(--line);
  }
  .timeline .y {
    font: bold 13px 'Courier New', monospace;
    color: var(--amber); margin-right: .6rem;
  }
  .timeline li.flavor .y { color: var(--muted); }
  .timeline a { color: var(--ink); }
  .timeline a:hover { color: var(--amber); }
```

- [ ] **Step 3: Add the timeline section**

Insert inside `<main>`, immediately after the last `</section>` (the @t@kee's blog card) and before `</main>`:

```html
  <section class="timeline">
    <h2 class="eralabel">The timeline · 1998 – 2026</h2>
    <ol>
      <li class="flavor"><span class="y">1998</span>Google is founded.</li>
      <li><span class="y">1999</span><a href="plaques/fortunecity.html">@t@kee's homepage</a> opens on FortuneCity — rainbow letters, hit counter, guestbook.</li>
      <li class="flavor"><span class="y">2001</span>The Wayback Machine opens to the public — quietly photographing everything below.</li>
      <li><span class="y">2001</span><a href="plaques/dtm.html">The Türkiye–EU site</a> goes up at the Undersecretariat of Foreign Trade, easter egg included.</li>
      <li><span class="y">2004</span><a href="plaques/tbmm.html">The Joint Parliamentary Committee site</a> launches at the Grand National Assembly.</li>
      <li><span class="y">2008</span><a href="plaques/atakees-blog.html">@t@kee's blog</a> begins on Blogger, at an address named for a forum that never came to be.</li>
      <li class="flavor"><span class="y">2009</span>GeoCities is shut down — the free-host era starts to end.</li>
      <li><span class="y">2010</span><a href="plaques/thoughtful-thoughts.html">Thoughtful thoughts</a> begins — the 1999 homepage section reborn as a blog.</li>
      <li class="flavor"><span class="y">2012</span>FortuneCity goes dark; the 1999 homepage vanishes with it.</li>
      <li><span class="y">2013</span>The last blog post. Blogging itself fades into social media.</li>
      <li><span class="y">2026</span>The museum opens — the recovery is documented in <a href="restoration-lab.html">the restoration lab</a>.</li>
    </ol>
  </section>
```

- [ ] **Step 4: Link the lab from the curator's note and footer**

Curator's note, closing paragraph — replace the sentence ending `…the untouched originals live in its history.` so the paragraph ends:

```html
  <p>What <i>was</i> repaired, sparingly: the free hosts' injected ad scripts were removed,
  the text was transcoded to UTF-8 so Turkish renders on modern hosting, and the dead
  hit counter and news-headline widget were rebuilt to work again. Every intervention is
  documented, commit by commit, in the
  <a href="https://github.com/atakee72/websites-through-the-years">repository</a> —
  the untouched originals live in its history, and the whole recovery is narrated in
  <a href="restoration-lab.html">the restoration lab</a>.</p>
```

Footer paragraph — replace with:

```html
  <p>Every page here is served exactly as it was written, give or take the ad scripts
  its free hosts injected. The recovery process — crawling the Wayback Machine,
  stripping dead third-party code, sealing the blogs, reviving the widgets — is
  narrated in <a href="restoration-lab.html">the restoration lab</a> and documented
  in the <a href="https://github.com/atakee72/websites-through-the-years">repository</a>.</p>
```

- [ ] **Step 5: Verify in browser (desktop + mobile)**

```bash
playwright-cli goto http://localhost:8765/
playwright-cli snapshot
playwright-cli resize 375 812
playwright-cli screenshot
playwright-cli resize 1280 900
```
Expected: five cards say "Read the plaque →" and link into `plaques/`; timeline renders between the last card and the curator's note, vertical with amber dots (small gray dots for flavor rows), no horizontal overflow at 375px (the `min-width: 0` grid rule already exists — verify nothing new overflows). No console errors.

- [ ] **Step 6: Commit**

```bash
git add index.html
git commit -m "Landing: cards lead to plaques, add timeline and restoration lab links"
```

---

### Task 9: Full click-through verification

**Files:**
- None created/modified. Pure verification; fix regressions found here in place.

**Interfaces:**
- Consumes: everything from Tasks 1–8.
- Produces: green light for the docs task and the user review gate.

- [ ] **Step 1: Card → plaque → exhibit chain, all five**

```bash
playwright-cli goto http://localhost:8765/
playwright-cli click "Read the plaque →" # first card
playwright-cli snapshot
playwright-cli click "Enter the exhibit →"
playwright-cli snapshot
```
Repeat for all five cards (navigate back to `/` between chains with `playwright-cli goto http://localhost:8765/`). Expected: each plaque loads styled (dark background — if it renders unstyled white, the `museum.css` path is wrong), each "Enter the exhibit →" lands on the correct exhibit front page.

- [ ] **Step 2: Timeline and lab links**

```bash
playwright-cli goto http://localhost:8765/
playwright-cli click "the restoration lab"
playwright-cli snapshot
```
Expected: lab loads; from the lab, "← back to the museum" returns to `/`. Also verify the commit permalinks are present: `playwright-cli eval "[...document.querySelectorAll('a[href^=\"https://github.com\"]')].length"` → expected `8` (the eight commit links in chapter 5).

- [ ] **Step 3: Zero external requests on every new page**

For each of `/`, `/restoration-lab.html`, and all five `/plaques/*.html`:

```bash
playwright-cli goto http://localhost:8765/<page>
playwright-cli eval "performance.getEntriesByType('resource').map(r=>r.name).filter(n=>!n.startsWith(location.origin))"
```
Expected: `[]` every time.

- [ ] **Step 4: Console log sweep**

Run: `grep -il "error" .playwright-cli/console-2026-07-1*.log | tail -5`
Expected: no files from today's runs (or investigate and fix any hit, then re-verify).

- [ ] **Step 5: Close the browser**

```bash
playwright-cli close
```

---

### Task 10: Documentation

**Files:**
- Modify: `README.md` (after the "Backups" section, before "Landing page"; and the "Landing page" section itself)
- Modify: `CLAUDE.md` ("Prime directive" paragraph)

**Interfaces:**
- Consumes: final state of Tasks 1–9.
- Produces: docs matching reality; after this task the plan pauses for the user review gate.

- [ ] **Step 1: Add a "Curation layer" section to README.md**

Insert between the "Backups" and "Landing page" sections:

```markdown
## Curation layer

- `plaques/` — a curator's plaque per exhibit (story, era context, what was
  restored, sources). Landing cards lead to the plaque; the plaque's
  "Enter the exhibit" button is the door to the site itself.
- `restoration-lab.html` — the recovery narrated: Wayback archaeology, the
  stripped host-injected junk shown as an inert specimen, the UTF-8
  transcoding, the live Blogger rescue, and permalinks to the load-bearing
  commits. All historical code on this page is HTML-escaped display text.
- A timeline on the landing page connects the exhibits (1998–2026).
```

Also update the README "Landing page" section's first sentence from "presenting the three sites" to "presenting the five sites" if it still says three, and mention the timeline.

- [ ] **Step 2: Update CLAUDE.md's editable-files sentence**

Replace:

```
The only modern, freely editable file is
`index.html` (landing page, hand-written, no build step) plus `assets/`.
```

with:

```
The modern, freely editable museum shell is: `index.html` (landing page),
`plaques/` (curator plaques), `restoration-lab.html`, and `assets/`
(screenshots + `museum.css`) — all hand-written, no build step. Shell pages
make zero external requests; external `<a href>` links are allowed. Code
specimens in `restoration-lab.html` must stay HTML-escaped (never live markup).
```

- [ ] **Step 3: Commit**

```bash
git add README.md CLAUDE.md
git commit -m "docs: curation layer (plaques, restoration lab, timeline)"
```

- [ ] **Step 4: STOP — user review gate (do not push)**

Leave the local server running and report to the user: the five plaque texts,
the lab narrative and the timeline are ready for review at
`http://localhost:8765/` (plaques carry biographical claims drafted by Claude —
the user corrects/enriches before anything goes public). Push to `main` only
after explicit user approval.
