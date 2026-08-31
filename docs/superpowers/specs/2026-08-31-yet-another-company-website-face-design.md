# "Yet Another Company Website": walkable face, working form flow — design

**Date:** 2026-08-31
**Status:** draft for user review
**Context:** Cycle 4 of the wing-extension program (cycle 3, rick-n-morty,
shipped 2026-08-31 through `2e55375`). The pre-React "before picture": the
first thing built at the bootcamp, a plain HTML/CSS restaurant site whose
header never got a real name.

## The exhibit

`CA-Projects-/Project-1` (Nov 2022 – Apr 2023, per git log): five pages —
`home.html`, `reservations.html`, `special.html`, `contact.html`,
`confirmation-page.html` — plus `styles.css`, one vanilla-JS file
(`confirmation-page.js`) and four images (one, `schöner-regenwald-1.jpg`,
referenced by nothing — it ships anyway, faithfully). Header: **"Yet
Another Company Website"**; browser tab: "Project Kick-Off/ Home". Lorem
ipsum body filler; a crescent-moon Material Symbols icon; footer on every
page: "copyright @ atakee - Lorem ipsum dolor sit amet…". The reservation
form **genuinely works**: it GETs to the confirmation page, whose script
reads the query params back to the visitor ("His/her note: …"). Every log
in that script starts with 🚀 (the rockets the rick-n-morty plaque was
once wrongly credited with). Contact page shows a fake email
(`asdfs@sdfasdfsa.business`) and a generic Google-Maps Berlin embed. No
real PII anywhere.

## Design

### 1. The face — `lehrjahre/yet-another-company-website/`

This one was always plain HTML — no rendering to freeze, so **no
capture_face**: copy the nine files as-is (finance-logger precedent,
"still works"), then museum-treat by hand:

- **Fonts localized**: Google Fonts Montserrat-300 + Material Symbols
  Outlined (the css2 links + preconnects on all five pages) → downloaded
  once into `local-fonts/` (css + woff2, Material Symbols subset is fine
  as the full woff2), links rewritten relative. Zero external font
  requests; crescent moon still renders.
- **Maps embed disabled**: the contact-page iframe gets the museum's dead
  treatment — `src` pointed at an intentionally absent local path, original
  URL kept in `data-original` (blogs' YouTube/ZDF precedent). The empty
  frame stays in the layout.
- **The form flow stays alive**: relative `action="confirmation-page.html"`
  GET, kept; `confirmation-page.js` kept and loaded — the wing's only
  two-page working flow.
- **One curator security patch (marked, documented)**: the original
  script writes all eight query params into the page with raw
  `innerHTML` — on a public origin that is reflected XSS via crafted
  link. Patch is minimal and behavior-preserving for text: every
  `.innerHTML =` becomes `.textContent =` (the two template-literal
  lines included), with one comment block at the top of the file marking
  the museum edit. The 🚀 logs stay. The original lines are exhibited
  (escaped) on the hall plaque, so nothing is hidden by the patch.
- **Curator bar** hand-injected at the top of `<body>` on all five pages,
  byte-identical to the toolkit's bar (`z-index:2147483647`, backlink
  `../../lehrjahre.html`), label: `Yet Another Company Website
  (2022–2023) — frozen capture; nothing here is live.` (The standing bar
  phrasing stays even though the form works — the plaque explains.)
- Seal: `seal_check.sh` + sourcemap grep + playwright same-host check
  across all five pages AND after a form submit (the confirmation page
  with query params must also make zero external requests).
- Filenames keep their original names, umlaut included; refs URL-encode
  where needed (museum rule).
- Thumbnail: `assets/lehrjahre/yet-another-company-website.png` (640px,
  home page).

### 2. The hall card — new tile after rick-n-morty

Cycle-1 pattern, inserted after the rick-n-morty card (before MaHalle v1),
CA-Projects umbrella card untouched (standing ruling).

- Badge: `walkable · still works` · Title: `Yet Another Company Website`
  · Date: `Nov 2022`
- Hook: **A restaurant whose header admits it: Yet Another Company
  Website.**
- Plaque copy (draft — user corrects at preview):
  - p1: "The first thing I built at the bootcamp: a restaurant site that
    never got a name — the header says 'Yet Another Company Website', the
    browser tab still says 'Project Kick-Off'. Lorem ipsum stands in for
    every paragraph the restaurant never wrote. But the reservation form
    works: book a table and the confirmation page reads your booking back
    to you — the wing's only working two-page flow, alive since November
    2022."
  - **Specimen — confirmation-page.js, the rockets** (escaped, verbatim,
    the file's lines 1–12: `params` + email + fname blocks with their
    `🚀 ~` logs and raw `innerHTML`).
  - p2: "Every log in that file launches a little rocket — the 🚀 ~ prefix
    a VS Code extension stamped on the era. The museum kept the rockets
    and defused one booby trap: the original pasted your booking into the
    page as live HTML; the exhibit pastes it as text. Everything else is
    untouched."
  - Charm: "The form's checkbox arrives pre-ticked: 'I do NOT want any
    special treatment.'"
- Door: `Enter the exhibit →` → `lehrjahre/yet-another-company-website/home.html`
  (the site has no index.html; admin-dashboard precedent). Tile shot links
  there too.

### 3. Museum integration (walkable 10 → 11)

- Counts: `lehrjahre.html` intro `Ten of them are walkable` → `Eleven of
  them are walkable`; `index.html` same sentence → `Eleven…`; chip
  `10 walkable faces` → `11 walkable faces`. Re-grep for stragglers
  (`grep -rn -i "ten of them\|10 walkable" *.html`); dated README
  provenance entries stay historical.
- README `### 7.` provenance bullet: copied as-is (not captured), fonts
  localized, maps embed disabled with `data-original`, the XSS patch
  named plainly (what/why), form flow left working, walkable count eleven.

## Constraints (museum rules, binding)

- Sealed NEW artifact: zero external requests at view time on every page
  and after form submission; zero live external links; `data-original`
  for the dead maps embed. Re-verify seal after any change; sweep
  `sourceMappingURL`.
- The ONLY content edits to the app's files: font-link rewrites, the maps
  iframe deadening, the marked `.textContent` patch, and the curator bar.
  Lorem ipsum, fake email, misspellings, unused image all ship untouched.
- Only these paths change: new `lehrjahre/yet-another-company-website/`,
  `assets/lehrjahre/yet-another-company-website.png` (new),
  `lehrjahre.html` (new card + count), `index.html` (two count sites),
  `README.md`. Everything else byte-identical.
- Specimen verbatim-then-escaped (the ORIGINAL innerHTML lines, pre-patch).
- Simple commits, no Claude signature/footer; user previews before push;
  after approved push: Pages `built`, live checks, SPN save hall + face.

## Verification

- seal_check + sourcemap grep on the face; playwright: load all five pages
  AND submit the reservation form with a text booking — zero non-same-host
  resources on every page including the parameterized confirmation page;
  crescent moon glyph renders (Material Symbols font loads locally).
- XSS patch proof: navigate to
  `confirmation-page.html?fname=<img src=x onerror=alert(1)>&…` — the
  payload must render as literal text, no error dialog, no `<img>` element
  created inside the field spans.
- Form joy: fill and submit the real form; confirmation page shows the
  values back.
- Hall test: 18 cards/plaques/buttons/hooks; new card's modal, specimen
  escaped, door navigates; counts read Eleven/11; JS-off inline degrade.
- Byte checks: hook/charm verbatim; specimen matches source lines 1–12
  after escaping (md5); 🚀 intact in specimen AND in the shipped (patched)
  js file.
- Desktop + mobile screenshots: tile, open plaque, home page, filled
  confirmation page — for user preview.

## Out of scope (later cycles)

Sprint widgets + pantries (cycle 5), pantry pass over old faces (cycle 6),
CA-Projects umbrella-card rewrite (end of series).
