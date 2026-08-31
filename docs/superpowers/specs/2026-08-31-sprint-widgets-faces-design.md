# The sprint widgets: three small faces, one card, three doors — design

**Date:** 2026-08-31
**Status:** draft for user review
**Context:** Cycle 5 of the wing-extension program (cycle 4, the restaurant
site, shipped 2026-08-31 through `b50c870`). The vanilla-JS sprint
exercises from `CA-Projects-/Project-2/Sprint-2` — three standalone
widgets, three different preservation treatments, exhibited under ONE hall
card with three doors (the translator wing's "one plaque, two doors"
precedent, plus one).

## The exhibits (from the clone, verified 2026-08-31)

1. **Daily Wisdom by Chuck Norris** (`Sprint-2/Extra with Ajax/ChuckNorris/`)
   — fetches one random joke from the keyless `api.chucknorris.io` and
   writes it into the card with `innerHTML`. Bootstrap 5 CSS from the
   jsdelivr CDN; local styles.css.
2. **The fisheries browser** (`Sprint-2/Fisheries_card_format/`) — no
   network at all: a **1.4 MB hardcoded array** (`species.js`) of NOAA
   FishWatch species, rendered into cards by main.js. The fish photos
   point at `origin-east-01-drupal-fishwatch.woc.noaa.gov` — NOAA retired
   FishWatch; the host is presumed dead (verified at capture).
3. **Daily News From Turkey** (`Sprint-2/Extra with Ajax/News_api_TR/`) —
   fetches `newsapi.org` top-headlines for Turkey. Its **API key is
   hardcoded in main.js** — the same committed key whose rotation is the
   standing ⚠ in the museum's notes.

## Design

### 1. Three face folders, flat (standard depth, standard backlink)

`lehrjahre/chuck-norris/`, `lehrjahre/fisheries/`, `lehrjahre/news-tr/` —
each captured with `capture_face.py` from a local static server (route
`/index.html` of its source folder), scripts stripped, assets localized
(Bootstrap CDN CSS included), curator bar with `--backlink
../../lehrjahre.html` and exhibit titles `Daily Wisdom by Chuck Norris
(2022)`, `Fisheries browser (2022)`, `Daily News From Turkey (2022)`.

**Per-widget treatment:**

- **chuck-norris — baked pantry** (rick-n-morty recipe): at capture time
  fetch **40 jokes** from the keyless API (deduplicated; UA header +
  polite delay). The captured page shows the capture-moment joke frozen;
  an appended curator-marked inline script (the face's only script) holds
  the 40-joke stash and writes one per visit into the card — with
  `textContent`, not the original's `innerHTML` (curator code, curator
  rules). JS-off = the frozen joke.
- **fisheries — frozen.** Serve, let main.js render every species card,
  capture the result. Image fate decided by reality at capture: if the
  NOAA host still serves them, localize; if dead (expected),
  `--dead-pattern` for the fishwatch host — broken fish photos, names
  intact, the dogsNfilms treatment ("adopt a broken image" has a school
  of fish now). The 1.4 MB species.js is NOT shipped (scripts stripped;
  the rendered cards carry the data that matters).
- **news-tr — frozen-fed, key contingency.** At capture, run the widget
  with a NewsAPI key supplied via env var to a locally patched COPY in
  scratch — **the key never enters the museum repo, in any file, commit,
  or specimen**. Try the old committed key first: if it still answers,
  capture real capture-day headlines AND report to the user that the key
  is demonstrably un-rotated (the standing ⚠ becomes acute — rotate
  after capture). If the key is dead, STOP this sub-face and ask the
  user for a fresh free key (the other two faces and the hall card do
  not wait). Headline images come from news CDNs — localized by the
  capture harvest since they render live at capture. The frozen page is
  a fixed front page from capture day, like a kept newspaper.

Seal per face: `seal_check.sh` + sourcemap grep + playwright same-host
check; on news-tr additionally `grep -r 98134c` over the whole repo → no
hits (defense in depth; the key must appear nowhere).

### 2. The hall card — one card, three doors

Inserted after the Yet Another Company Website card, before MaHalle v1.
CA-Projects umbrella card untouched (standing ruling; its rewrite is the
series finale).

- Badge: `walkable · three doors` · Title: `The sprint widgets` · Date:
  `Dec 2022`
- Hook: **Chuck Norris wisdom, a fisheries browser, Turkish news — one
  sprint, three doors.**
- Plaque copy (draft — user corrects at preview):
  - p1: "Sprint exercises: each of these was an afternoon, a fetch call,
    and a div to put the result in. The museum gives them three small
    doors. Behind the first, Chuck Norris dispenses wisdom from a pantry
    of forty jokes stocked on capture day — a different one each visit.
    Behind the second, a browser of NOAA fish species whose photos sank
    with the government image server that hosted them — names, biology
    and habitat swim on. Behind the third, the Turkish headlines of
    capture day, kept like a newspaper on the day the presses stopped."
  - **Specimen — ChuckNorris/main.js, createCard** (escaped, verbatim,
    source lines 22–26):

    ```
    function createCard(wisdom) {
        const cardContainer = document.getElementById("card-container");
        cardContainer.innerHTML = "";
        cardContainer.innerHTML = wisdom.value;
    }
    ```
  - p2: "Empty the container, then fill it — belt and braces, in two
    consecutive lines. The pantry that serves the jokes now is curator
    code and uses textContent; Chuck's original createCard is retired to
    this plaque."
  - Charm: "Two of the three titles promise dailiness — 'Daily Wisdom by
    Chuck Norris', 'Daily News From Turkey' — from pages that never saw
    a second day."
- Doors (three `.lj-door` lines, in this order):
  `Daily Wisdom by Chuck Norris →` / `The fisheries browser →` /
  `Daily News From Turkey →`, to each face's `index.html`.
- Tile shot: the Chuck Norris widget (`assets/lehrjahre/sprint-widgets.png`);
  the plaque additionally shows the fisheries capture
  (`assets/lehrjahre/sprint-widgets-2.png`, second shot inside the plaque
  — CA-Projects card precedent).

### 3. Museum integration (walkable 11 → 12)

- The count counts walkable CARDS, and this is one card: `Eleven of them
  are walkable` → `Twelve of them are walkable` (lehrjahre.html +
  index.html), chip `11 walkable faces` → `12 walkable faces`. Straggler
  grep as always; dated README provenance entries stay.
- README `### 7.` bullet: the three treatments (pantry / frozen with dead
  NOAA images / frozen-fed newspaper), scripts stripped, the pantry as
  the only script on chuck-norris, key handling stated plainly (fetched
  with the owner's key at capture only; never committed), walkable count
  twelve.

## Constraints (museum rules, binding)

- Sealed NEW artifacts ×3: zero external requests at view time; zero live
  external links; dead externals carry `data-original`. Re-verify seal
  after any change; sweep sourcemaps.
- **The NewsAPI key appears NOWHERE in the museum repo** — not in code,
  commits, specimens, README, or scratch files inside the repo. Env var
  at capture, scratch-side patched copy only. `grep -r` proof required
  before every commit of news-tr material.
- chuck-norris pantry script: curator-marked, textContent-only, fetches
  nothing, only script on that face. The other two faces: zero scripts.
- Only these paths change: three new `lehrjahre/<widget>/` folders,
  `assets/lehrjahre/sprint-widgets.png` + `sprint-widgets-2.png`,
  `lehrjahre.html` (card + count), `index.html` (two count sites),
  `README.md`. Everything else byte-identical.
- Simple commits, no Claude signature/footer; user previews before push;
  after approved push: Pages `built`, live checks, SPN save hall + three
  doors.

## Verification

- Per face: seal_check + sourcemap grep + playwright zero-external check;
  every `<img>` either loads locally or is an intended dead fishwatch
  image; curator bar present.
- chuck-norris: two visits serve different jokes (reload-retry rule);
  JS-off shows the frozen capture-day joke; the joke text node is created
  via textContent (no element injection possible from joke strings).
- fisheries: species cards present with names/text intact; if images were
  dead at capture, they are dead via absent local path + `data-original`,
  not live NOAA URLs.
- news-tr: headlines + images from capture day render locally; no key
  substring anywhere (`grep -r 98134c` → nothing).
- Hall: 19 cards; the new plaque opens with specimen escaped; all three
  doors navigate; counts Twelve/12; JS-off degrade; specimen md5 against
  source lines 22–26.
- Screenshots for preview: tile, open plaque, each of the three faces
  (chuck twice — two jokes).

## Out of scope

Pantry joy-win pass over the original 8 faces (cycle 6), CA-Projects
umbrella-card rewrite (end of series), Sprint-1 exercises (stay
catalogue-only inside the umbrella card).
