# Translator-Website Exhibit Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Recover ercan-atak.de's two One.com incarnations (2015, 2019) from the Wayback Machine and hang them in the museum as one exhibit with one plaque and two doors.

**Architecture:** Two new archived-exhibit folders (`ercan-atak-2015/`, `ercan-atak-2019/`) crawled with the existing rescue-wayback.py from two anchor captures; one plaque (`plaques/translator.html`); one landing card + timeline entries; README/CLAUDE.md provenance and count updates. No build step, no new tooling.

**Tech Stack:** `~/projects/website-rescue-kit/rescue-wayback.py` (python3, no deps), curl + Wayback CDX, playwright-cli (bundled chromium), python3 http.server for verification.

**Spec:** `docs/superpowers/specs/2026-08-24-translator-site-design.md`

## Global Constraints

- Anchors are fixed: **v1 = `20151220181045` / `http://www.ercan-atak.de/`**, **v2 = `20191024230042` / `https://www.ercan-atak.de/`**.
- **No WordPress-era content enters the repo.** Gate before every commit of exhibit files: `grep -ril 'wp-content' ercan-atak-2015/ ercan-atak-2019/` returns nothing.
- Archived files are historical artifacts: never lint, reformat, or modernize. Only permitted edits: Wayback-chrome/tracking removal, absolute-self-domain → relative link rewrites needed for local browsing, one-time UTF-8 transcode if a page is not UTF-8. Every such edit lands in README provenance.
- Never re-encode beyond that (`.gitattributes` `* -text` already covers the repo).
- Filenames keep their spaces (`zur person.html`, `gesellschaftliches engagement.html`) — URL-encode when testing, never rename.
- Wayback rate: ~1 req/s, back off on errors/429.
- Shell pages (plaque, landing) make zero external requests; external `<a href>` allowed.
- Commits: simple messages, no Claude signature, no Co-Authored-By.
- **Push only on the user's explicit go-ahead**, after the user's preview/correction round.
- Draft plaque/card/timeline copy is curator-vetted later — write it well, expect corrections.

## Reference: known One.com-era URL inventory (from CDX, first-capture timestamps)

v1 page files (bare host, 2015–2016 captures): `index.html`, `leistungen.html`, `kontakt.html`, `impressum.html`, `blog.html`, `Kundenrezensionen.html`, `Partner.html`, `zur person.html` (2016), `gesellschaftliches engagement.html` (2016). Assets under `onewebstatic/` (~50 files, 2015–2017) and `onewebmedia/taxi.png?etag=…`. The CDX list used `collapse=urlkey` (first capture per URL) — most URLs have LATER captures too; per-URL nearest-to-anchor selection is the crawler's job. A full dump lives nowhere durable — regenerate with:

```bash
curl -s "https://web.archive.org/cdx/search/cdx?url=ercan-atak.de*&collapse=urlkey&fl=original,timestamp,statuscode,mimetype&filter=statuscode:200&limit=5000" > /tmp/ercan-cdx.txt
```

WordPress-era URLs (EXCLUDED — recognize and drop): directory-style paths (`/about/`, `/category/…`, `/2019/12/…`, `/shop/…`, `/page/N/`, `wp-login.php`, `xmlrpc.php`) and anything whose HTML contains `wp-content`.

## Gap-fill helper (used by Tasks 1–2)

For files the crawler misses (its README warns: treats `www.`/bare as different hosts, doesn't parse CSS `url()`), fetch a URL's capture nearest the anchor:

```bash
fetch_nearest() {  # fetch_nearest <url> <outfile> <anchor-ts>
  local url="$1" out="$2" anchor="$3" ts
  ts=$(curl -s "https://web.archive.org/cdx/search/cdx?url=${url}&fl=timestamp&filter=statuscode:200" \
    | awk -v a="$anchor" '{d=$1-a; if(d<0)d=-d; if(best==""||d<bd){bd=d;best=$1}} END{print best}')
  [ -n "$ts" ] && curl -s "https://web.archive.org/web/${ts}id_/${url}" --create-dirs -o "$out"
  sleep 1.2
}
```

---

### Task 1: Recover v1 → `ercan-atak-2015/`

**Files:**
- Create: `ercan-atak-2015/` (crawled site: page HTML at folder root, `onewebstatic/`, `onewebmedia/`)

**Interfaces:**
- Produces: a locally browsable `ercan-atak-2015/index.html` whose relative links reach the other captured pages; later tasks link to `ercan-atak-2015/index.html`.

- [ ] **Step 0: Test-crawl first — learn the kit's actual behavior**

The steps below assume things the kit's README doesn't promise: that `/` is saved as `index.html`, that `%20` URLs become space-filenames on disk, whether links get rewritten at all. Verify before the full run:

```bash
cd /home/atakee/projects/eski-web-sayfalarim
python3 ~/projects/website-rescue-kit/rescue-wayback.py 20151220181045 "http://www.ercan-atak.de/" /tmp/tx-test 5   # 4th arg caps fetches
find /tmp/tx-test -type f | head -20
```

Read the saved front page's link forms, note the root filename and name-decoding behavior, skim the script's source if anything is unclear (`~/projects/website-rescue-kit/rescue-wayback.py`), then adapt Steps 2–4's filenames/paths to what the kit actually produces. Delete `/tmp/tx-test`.

- [ ] **Step 1: Crawl from the anchor**

```bash
cd /home/atakee/projects/eski-web-sayfalarim
python3 ~/projects/website-rescue-kit/rescue-wayback.py 20151220181045 "http://www.ercan-atak.de/" ercan-atak-2015
```

Expected: ~1 req/s fetching; on completion the folder holds the front page plus every internal link it could follow, each from its capture nearest the anchor. The script is resumable — re-run it if the connection drops.

- [ ] **Step 2: Gap-check pages against the known inventory**

Every v1 page file listed in the Reference section must exist in `ercan-atak-2015/`. For any missing page (host-variant misses are expected — the pages were captured under bare `ercan-atak.de`):

```bash
fetch_nearest "http://ercan-atak.de/leistungen.html" "ercan-atak-2015/leistungen.html" 20151220181045
# …repeat per missing page, exact names from the Reference list (quote the space-names)
```

- [ ] **Step 3: Gap-check assets referenced by the HTML and CSS**

```bash
cd ercan-atak-2015
grep -ohrE '(onewebstatic|onewebmedia)/[^"'"'"'() ?]+' --include='*.html' . | sort -u > /tmp/refs.txt
grep -ohE 'url\([^)]*\)' onewebstatic/*.css | grep -oE '(onewebstatic|onewebmedia)/[^") ]+' | sort -u >> /tmp/refs.txt
sort -u /tmp/refs.txt | while read -r f; do [ -f "$f" ] || echo "MISSING: $f"; done
```

Fetch each MISSING via `fetch_nearest "http://ercan-atak.de/<path>" "ercan-atak-2015/<path>" 20151220181045`. A file absent from the archive entirely is a permanent loss — record it for the provenance notes, leave the reference broken (museum policy).

- [ ] **Step 4: Make it locally browsable (minimal surgery, recorded)**

Check how internal links are written: `grep -ohE 'href="[^"]*"' ercan-atak-2015/*.html | sort -u | head -30`. If pages link absolutely to their own domain (`http://ercan-atak.de/kontakt.html` or the `www.` variant), rewrite ONLY those to relative (`kontakt.html`) with sed, e.g.:

```bash
sed -i 's|href="https\?://\(www\.\)\?ercan-atak\.de/|href="|g' ercan-atak-2015/*.html
```

Do the same for `src=`, `<link href=…>` (stylesheets/canonical), and CSS `url(…)` inside `onewebstatic/*.css` if they carry the absolute domain — check with `grep -oE '(url\(|href=|src=)["'"'"']?https?://(www\.)?ercan-atak\.de[^")'"'"' ]*' -r .`. Keep a note of the exact sed commands used — they go into README provenance in Task 6. External links (other domains) stay untouched.

- [ ] **Step 5: Verify hermetics of the era + WP gate + charset**

```bash
grep -ril 'wp-content' ercan-atak-2015/ && echo "FAIL: WP leak" || echo "OK no WP"
grep -ril 'web.archive.org' ercan-atak-2015/ && echo "CHECK: wayback chrome?" || echo "OK no wayback refs"
grep -ihoE '<meta[^>]*charset[^>]*>' ercan-atak-2015/*.html | sort -u
```

`id_` fetches should contain no Wayback toolbar; if any `web.archive.org` markup appears, strip that block and record it. If charset is not UTF-8, transcode that file with `iconv -f <enc> -t utf-8` (hosting note: GitHub Pages forces utf-8) and record it. Spot-check umlauts render in the bytes: `grep -l 'Übersetz' ercan-atak-2015/*.html` should match at least one page.

- [ ] **Step 6: Browse it**

```bash
cd /home/atakee/projects/eski-web-sayfalarim && python3 -m http.server 8765 &
```

playwright-cli (from repo root, session `tx1`): open `http://localhost:8765/ercan-atak-2015/index.html`, screenshot, click through to `leistungen.html`, `kontakt.html`, `impressum.html`, `Kundenrezensionen.html`. Expect: styled pages with images; the author's face photo on the landing page; dummy/dead links stay dead (that's correct). No console errors other than genuinely-lost assets. Kill the server, close the session.

- [ ] **Step 7: Commit**

```bash
git add ercan-atak-2015 && git commit -m "Recover ercan-atak.de v1 (2015) from the Wayback Machine"
```

### Task 2: Recover v2 → `ercan-atak-2019/`

**Files:**
- Create: `ercan-atak-2019/` (crawled site, same shape as Task 1)

**Interfaces:**
- Consumes: the `fetch_nearest` helper.
- Produces: a locally browsable `ercan-atak-2019/index.html`; later tasks link to `ercan-atak-2019/index.html`.

- [ ] **Step 1: Crawl from the v2 anchor**

```bash
cd /home/atakee/projects/eski-web-sayfalarim
python3 ~/projects/website-rescue-kit/rescue-wayback.py 20191024230042 "https://www.ercan-atak.de/" ercan-atak-2019
```

- [ ] **Step 2: Confirm the anchor really is One.com and map v2's own pages**

```bash
grep -c 'onewebstatic' ercan-atak-2019/index.html   # expect > 0
grep -ril 'wp-content' ercan-atak-2019/ && echo "FAIL: WP leak — delete offending files" || echo "OK"
grep -ohE 'href="[^"]*"' ercan-atak-2019/index.html | sort -u
```

v2's page set is whatever its front page links to — it may differ from v1's (new/renamed pages like `zur person.html`, `gesellschaftliches engagement.html` may belong here). Gap-fill missing linked pages and assets exactly as Task 1 Steps 2–3, with anchor `20191024230042`. A page whose nearest capture is years away is acceptable (museum precedent: nearest-dated snapshot per file) — note distant-capture files for provenance.

**Judgment call to document:** if a URL genuinely serves both eras, its capture nearest THIS anchor belongs here; nearest the 2015 anchor belongs in Task 1's folder. List any such calls for the provenance notes.

- [ ] **Step 2b: Version-bleed check — diff the two exhibits**

"Nearest capture to the 2019 anchor" can silently fetch a 2016 file when no 2019-era capture exists — v1-era design inside the v2 exhibit. Compare:

```bash
cd /home/atakee/projects/eski-web-sayfalarim
for f in ercan-atak-2019/*.html; do b=$(basename "$f"); [ -f "ercan-atak-2015/$b" ] && { cmp -s "$f" "ercan-atak-2015/$b" && echo "IDENTICAL: $b" || echo "differs: $b"; }; done
```

For every IDENTICAL (or visibly v1-era) page in the v2 folder, record its actual capture timestamp (from the crawler's log/output). Do NOT silently keep or delete — these go on a short list for the curator's preview round (options there: keep with a provenance note, or drop the page from v2 and let its link fall dead). The v2 front page itself must NOT be identical to v1's — if it is, the crawl anchored wrong; stop and re-check the anchor fetch.

- [ ] **Step 3: Local-browsability surgery + charset, same rules as Task 1 Steps 4–5**

Same sed pattern (domain-absolute → relative), same WP/wayback/charset gates, same record-keeping.

- [ ] **Step 4: Browse it**

Serve on 8765, playwright session `tx2`: open `/ercan-atak-2019/index.html`, screenshot, click 3–4 subpages. Expect the completed site (Impressum present). Kill server, close session.

- [ ] **Step 5: Commit**

```bash
git add ercan-atak-2019 && git commit -m "Recover ercan-atak.de v2 (2019) from the Wayback Machine"
```

### Task 3: Era screenshots for the museum shell

**Files:**
- Create: `assets/ercan-atak-2015.png`, `assets/ercan-atak-2019.png`

**Interfaces:**
- Produces: the two PNGs, referenced by exact name in Tasks 4 and 5.

- [ ] **Step 1: Capture both landing pages at desktop width**

Serve repo on 8765. playwright-cli session `tx3`, viewport 1280×900: screenshot `http://localhost:8765/ercan-atak-2015/index.html` and `http://localhost:8765/ercan-atak-2019/index.html`. Known gotcha: opening a new page resets the viewport — re-apply the resize after each `open` before shooting. Screenshots land in `.playwright-cli/` — move them:

```bash
mv .playwright-cli/<shot1>.png assets/ercan-atak-2015.png
mv .playwright-cli/<shot2>.png assets/ercan-atak-2019.png
```

Match the look of the existing era shots (`assets/fortunecity.png` etc. are page-top captures, not full-page scrolls). Kill server, close session.

- [ ] **Step 2: Commit**

```bash
git add assets/ercan-atak-2015.png assets/ercan-atak-2019.png
git commit -m "Era screenshots for the translator-site exhibit"
```

### Task 4: The plaque — `plaques/translator.html`

**Files:**
- Create: `plaques/translator.html`

**Interfaces:**
- Consumes: `assets/ercan-atak-2015.png`, `assets/ercan-atak-2019.png` (Task 3); exhibit doors `../ercan-atak-2015/index.html`, `../ercan-atak-2019/index.html`.
- Produces: `plaques/translator.html`, linked from Task 5's landing card.

- [ ] **Step 1: Write the plaque** (template: `plaques/fortunecity.html` — same skeleton: crumbs → plaquehead → shot → story/era/restored/sources → doorway → footer). Full content:

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>ercan-atak.de — the translator-website years (2015–2019) — plaque · websites through the years</title>
<meta name="description" content="Curator's plaque for ercan-atak.de, the author's translator and interpreter website, recovered from the Wayback Machine in its two One.com incarnations.">
<link rel="stylesheet" href="../assets/museum.css">
</head>
<body>
<div class="wrap">

<nav class="crumbs"><a href="../index.html">← back to the museum</a></nav>

<header class="plaquehead">
  <span class="year">2015 – 2019</span>
  <h1>ercan-atak.de · the translator-website years</h1>
  <p class="host">One.com Web Editor · Übersetzungen &amp; Dolmetschen</p>
</header>

<figure class="shot">
  <img src="../assets/ercan-atak-2015.png" alt="Screenshot of the 2015 translator website ercan-atak.de">
  <figcaption>Version one, December 2015 — the curator still prefers this one.</figcaption>
</figure>

<section>
  <h2>The story</h2>
  <p>The blogs in this museum fall silent in 2013. Here is why: I had become a
  translator and interpreter, and in 2015 my office got what every business got
  in 2015 — a website, built on One.com's site builder. Version one had my face
  photo, a services page, customer reviews, and a few links that led nowhere in
  particular. By 2019, version two had grown up: content completed, Impressum
  and all.</p>
  <p>Then came a third life this museum deliberately does not exhibit: late in
  2019 I moved the site onto a WordPress template — Divi, WooCommerce, the
  works — which I couldn't use properly, for missing developer knowledge. Its
  test posts and demo shop pages still haunt the archive. That phrase —
  <i>missing developer knowledge</i> — is the seed of everything in the
  museum's next wing. The untamed template stood watch until the site ended,
  silently, in 2023.</p>
  <p>The domain found its way back to me and today hosts my developer
  portfolio. And one thing never stopped: the translating. Of everything in
  this museum, this is the only exhibit whose business is still open — it just
  doesn't have a website anymore.</p>
</section>

<section>
  <h2>The era</h2>
  <p class="aside">2015: every tradesperson needs a website, and the website
  builders promise you'll never need a developer. Drag, drop, publish —
  the personal homepage of 1999 reborn as a business card. It mostly worked,
  until you wanted more.</p>
</section>

<section>
  <h2>What was restored</h2>
  <p>Both versions were recovered from Wayback Machine captures (raw bytes,
  nearest capture per file to each version's anchor). Links that pointed at the
  site's own domain were re-pointed relatively so the pages browse locally;
  everything else — including the dummy links of version one — is exactly as
  captured. The WordPress era was left in the archive, on purpose.</p>
</section>

<section>
  <h2>Sources</h2>
  <ul>
    <li><a href="https://web.archive.org/web/20151220181045/http://www.ercan-atak.de/">Wayback capture, 20 December 2015</a> — the v1 anchor</li>
    <li><a href="https://web.archive.org/web/20191024230042/https://www.ercan-atak.de/">Wayback capture, 24 October 2019</a> — the v2 anchor</li>
    <li><a href="https://github.com/atakee72/websites-through-the-years">Repository</a> — every intervention documented commit by commit</li>
  </ul>
</section>

<p class="doorway">
  <a class="enter" href="../ercan-atak-2015/index.html">Enter v1 (2015) →</a>
  <a class="enter" href="../ercan-atak-2019/index.html">Enter v2 (2019) →</a>
</p>

<footer><a href="../index.html">websites through the years</a> — a personal museum of the early web</footer>

</div>
</body>
</html>
```

If v2's entry file is not `index.html` (check Task 2's output), fix the door href accordingly.

- [ ] **Step 2: Verify** — serve on 8765, open `/plaques/translator.html` (playwright `tx4`): renders like the sibling plaques, both doors work, zero external requests (`performance.getEntriesByType('resource')` shows same-host only). Close session, kill server.

- [ ] **Step 3: Commit**

```bash
git add plaques/translator.html && git commit -m "Curator's plaque for the translator-website exhibit"
```

### Task 5: Landing page — card, timeline, counts

**Files:**
- Modify: `index.html` (new era label + exhibit card after the blog-era sections, before the Lost & found section; three timeline entries; any "five sites" phrasing)

**Interfaces:**
- Consumes: `plaques/translator.html`, `assets/ercan-atak-2015.png`.

- [ ] **Step 1: Insert era label + card** after the last blog-era `</section>` (locate the Lost & found / Cinderella heading; insert before it):

```html
  <h2 class="eralabel">The translator era · 2015 – 2019</h2>

  <section class="era">
    <div class="shot">
      <div class="browser">
        <div class="bar"><span>Ercan Atak - Übersetzungen &amp; Dolmetschen - Mozilla Firefox</span><span class="btns">_ □ ✕</span></div>
        <a href="plaques/translator.html"><img src="assets/ercan-atak-2015.png" alt="Screenshot of the 2015 translator website ercan-atak.de" loading="lazy"></a>
      </div>
    </div>
    <div class="meta">
      <span class="year">2015 – 2019</span>
      <h2><a href="plaques/translator.html">ercan-atak.de · the translator years</a></h2>
      <p>Why the blogs fell silent: I had become a translator and interpreter,
      and my office got a website — built on One.com's site builder, twice.
      Version one (2015) with my face photo and a few dummy links; version two
      (2019), all grown up. Same domain, today: my developer portfolio.</p>
      <div class="chips">
        <span class="chip">One.com Web Editor</span>
        <span class="chip">two versions</span>
        <span class="chip">ercan-atak.de</span>
      </div>
      <p class="quirk">The only business in this museum that is still open. The website retired; the translator didn't.</p>
      <a class="go" href="plaques/translator.html">Read the plaque →</a>
      <a class="wb" href="https://web.archive.org/web/20151220181045/http://www.ercan-atak.de/">Wayback original</a>
    </div>
  </section>
```

(Match the browser-bar window-title style of the neighboring cards; check the exact heading text of the Lost & found section when placing.)

- [ ] **Step 2: Timeline entries** in `index.html` (`section.timeline`): after the 2013 line, insert:

```html
      <li><span class="y">2015</span><a href="plaques/translator.html">ercan-atak.de</a> opens — the translation office gets a website; the blogs' silence explained.</li>
      <li><span class="y">2019</span>Version two — content complete, Impressum and all. Weeks later a WordPress template moves in, and wins.</li>
      <li class="flavor"><span class="y">2023</span>ercan-atak.de goes dark, silently. The domain later returns as the developer portfolio.</li>
```

- [ ] **Step 3: Counts sweep** — `grep -n "five\|1999 to 2013\|1999 and 2013" index.html` and update any museum-count phrasing (meta description, intro copy) from five sites / 1999–2013 to six / 1999–2019. Leave unrelated "five"s (e.g. "six posts across five years") alone.

- [ ] **Step 4: Verify** — serve, screenshot landing (desktop 1280 + mobile 390): new card renders like siblings, timeline reads chronologically, nav wrap unchanged. Console clean.

- [ ] **Step 5: Commit**

```bash
git add index.html && git commit -m "Landing: translator-era card and timeline entries"
```

### Task 6: Docs — README + CLAUDE.md

**Files:**
- Modify: `README.md` (intro counts; new `### 6.` exhibit section with provenance; "five sites" in Landing page section)
- Modify: `CLAUDE.md` (line 3 museum description; exhibit-folder list in the authenticity section)

**Interfaces:**
- Consumes: the surgery notes recorded in Tasks 1–2 (sed rewrites, stripped blocks, transcodes, permanent losses, distant-capture files, era judgment calls).

- [ ] **Step 1: README intro** — update to: sites "from 1999 to 2019", "four recovered from the Wayback Machine, two Blogger blogs rescued alive, and one page found in the rubble". Update "presenting the five sites" (Landing page section) to "the six sites".

- [ ] **Step 2: README new section** after the blogs (before Lost & found):

```markdown
### 6. ercan-atak.de — the translator years (~2015–2019)

`ercan-atak-2015/` and `ercan-atak-2019/` — the author's translator and
interpreter website in its two One.com Web Editor incarnations: version one
(2015; face photo, services, customer reviews, a few dummy links that never
led anywhere) and version two (2019; content completed, Impressum and all).
One plaque, two doors. The site's third life — a WordPress/Divi template the
author couldn't tame, whose test posts haunt the archive until the domain went
dark in 2023 — is deliberately not recovered.
[v1 capture](https://web.archive.org/web/20151220181045/http://www.ercan-atak.de/) ·
[v2 capture](https://web.archive.org/web/20191024230042/https://www.ercan-atak.de/)

**Provenance / restoration notes**

- Crawled from the Wayback Machine with rescue-wayback.py (raw `id_` bytes,
  nearest capture per URL to each version's anchor: 20 Dec 2015 / 24 Oct 2019).
- <the actual surgery notes from Tasks 1–2: link-relativization seds, any
  stripped Wayback/One.com blocks, any transcodes, permanent losses,
  distant-capture files, v1/v2 assignment judgment calls — written from the
  implementers' records, not invented>
- No WordPress-era content was recovered (verified: no `wp-content`
  references in either folder).
```

The `<…>` block above is filled from the recorded notes — if a category had no
instances, say so ("nothing was stripped — One.com injected no tracking").

- [ ] **Step 3: CLAUDE.md** — line 3: "five websites … between 1999 and 2013" → "six websites … between 1999 and 2019" (keep the sentence's shape: "…three recovered from the Wayback Machine…" becomes "four"); add `ercan-atak-2015/`, `ercan-atak-2019/` to the archived-exhibits folder list in the Prime directive section.

- [ ] **Step 4: Commit**

```bash
git add README.md CLAUDE.md && git commit -m "Docs: translator-website exhibit provenance and counts"
```

---

## Wrap-up (controller, after final review)

1. Final whole-branch review (SDD), fix wave if needed.
2. **User preview + correction round** (serve 8765; user vets plaque/card/timeline facts and copy) — then corrections, then **push only on the user's go-ahead**.
3. After push: Pages build green (`gh api repos/atakee72/websites-through-the-years/pages/builds/latest --jq .status`), live check both exhibit indexes + plaque (200), Wayback-save changed/new pages (index, plaque, both exhibit fronts) — check `archive.org/wayback/available` before retrying any timeout.
