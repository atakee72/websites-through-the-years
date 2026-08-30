# rick-n-morty: walkable face, baked-pantry grid, broken search — design

**Date:** 2026-08-30
**Status:** draft for user review
**Context:** Cycle 3 of the wing-extension program (cycle 2, the
my-first-react-app face, shipped 2026-08-30 through `ee73d70`). This is the
first **baked pantry** exhibit — the user's brief: "frozen at a live state",
joy over corpses — and the search bug stays exactly as broken as it was.

## The exhibit

`rick-n-morty` lives in the private repo `CA-Projects-` at
`Project-3/rick-n-morty` (CRA 5 + React 18, single route, ~Jan 2023 —
exact date read from the clone's git log at planning). On load it fetched
20 characters (image + name) from the public, keyless
`rickandmortyapi.com` API and rendered them as cards. It has a visible
search box with a famous dead end: `filterCharacters()` computes the
filtered list and `console.log`s it — the line that would update the
screen is commented out in `App.js`:
`// if (filteredCharacters.length != 0) { characters = filteredCharacters; }`.
Typing visibly does nothing. Modal/Pagination components exist in source
but were never reachably wired. Heavy `console.log('🚀 ~ …')` debug-emoji
logging throughout. No keys, no PII.

## Design

### 1. The face — `lehrjahre/rick-n-morty/`

Captured with the existing toolkit (repo already cloned at
`.superpowers/sdd/lehrjahre/repos/CA-Projects-`): `npm install`,
`PORT=4017 BROWSER=none npm start`, wait for the live API fetch to
populate the grid, then `capture_face.py` on route `/` → `index.html`
(scripts stripped, assets localized — including the 20 avatar images —
sourcemaps swept, curator bar with `--backlink ../../lehrjahre.html`).

**The pantry (museum addition, clearly marked):**

- At capture time, fetch the API's character pages 1–3 once → a stash of
  **60 characters** (name + image). Download all 60 avatars into the
  face's local assets (~40 extra images beyond the captured 20).
- Embed the stash as a JSON array in one inline `<script>` appended to
  `index.html`, headed by a comment identifying it as a curator addition
  and its stocking date, e.g.
  `/* Museum pantry — stocked 2026-08-30 from rickandmortyapi.com; the
  exhibit makes no network requests. */`
- On each visit the script shuffles the stash and fills the grid's 20
  card slots (img src/alt + name text) with a random 20 of the 60. Exact
  DOM selectors pinned at planning from the captured markup. It touches
  NOTHING else — no other node, no styles, no search wiring.
- JS off / Wayback replay: the page shows the captured page-1 grid
  exactly as frozen. Degradation is the pure artifact.
- **The search stays broken.** The input remains, inert (scripts were
  stripped; the original only ever logged to the console anyway). The
  pantry must not make it work — the bug is the exhibit.

Seal: `seal_check.sh lehrjahre/rick-n-morty` + CLAUDE.md grep recipe.
Zero external requests at view time — the pantry is stocked once, at
capture, and never phones home. Thumbnail:
`assets/lehrjahre/rick-n-morty.png` (640px, from the fresh capture).

### 2. The hall card — new tile after my-first-react-app

Cycle-1 pattern (badge → h3+date → linked shot → hook → plaque → button →
door), inserted immediately after the my-first-react-app card, keeping the
CA-Projects umbrella card untouched (standing ruling: one umbrella rewrite
at the end of the promotion series).

- Badge: `walkable · pantry-fed` · Title: `rick-n-morty` · Date: `Jan 2023`
- Hook: **The search box searches — into the console, and no further.**
- Plaque copy (draft — user corrects at preview):
  - p1: "My second React app fetched twenty Rick and Morty characters
    from the public API every time it started. The museum could not
    freeze a network, so it stocked a pantry instead: sixty characters
    fetched once, on capture day, and stored inside the page. Each visit
    the exhibit serves a different twenty. Nothing is requested; the
    pantry never empties."
  - **Specimen — App.js, the broken search** (escaped, verbatim from
    source): the `filterCharacters` function in full, including the
    commented-out fix line quoted above. Extracted verbatim at planning;
    no tidying — indentation and the emoji logs are part of the artifact.
  - p2: "Typing in the search box computed the filtered list, logged it
    to the console — and stopped. The one line that would have updated
    the screen sits commented out, one keystroke from working. It has
    been one keystroke from working since January 2023. In the frozen
    face even the console is silent now, so the search does exactly what
    it always appeared to do: nothing."
  - Charm: "Every console.log in the source begins with a little rocket:
    🚀 ~ — the debugging style of the era, launched hundreds of times,
    landed nowhere."
- Door: `Enter the exhibit →` → `lehrjahre/rick-n-morty/index.html`;
  tile shot links there too.
- Specimen presentation reuses cycle 2's classes (`.specimen-label`,
  `pre.specimen` with the amber wing rule) — HTML-escaped display text,
  never live markup.

### 3. Hall + museum integration (walkable 9 → 10)

- Walkable count updated at **every** site naming it — find them all with
  `grep -rn "ine of them\|9 walkable" *.html README.md` (three known
  sites: hall intro, landing era chip, README; the grep is the authority).
- Hall's "How these were captured" section gains one sentence introducing
  the pantry, e.g.: "Where a face is marked pantry-fed, the museum
  stocked it at capture time — data fetched once, stored in the page,
  served by a few curator lines; the exhibit still makes no requests."
- README `### 7.` provenance entry: capture date/method, pantry mechanism
  (60 characters, pages 1–3, stocking date, curator script marked in
  place), search-left-broken statement, specimen source file named.

## Constraints (museum rules, binding)

- Sealed NEW artifact: zero external requests **at view time**, zero live
  external links, `data-original` for dead externals; re-verify seal after
  any change; sweep `sourceMappingURL` after any hand-edit.
- The pantry script is the ONLY script on the face, inline, curator-marked;
  it fetches nothing, ever.
- Only these paths change: new `lehrjahre/rick-n-morty/` (new files),
  `assets/lehrjahre/rick-n-morty.png` (new), `lehrjahre.html` (new card,
  count word, one pantry sentence), `index.html` (chip count), `README.md`.
  All existing faces and archived exhibits stay byte-identical.
- Specimen text verbatim-then-escaped; no reformatting.
- Simple commits, no Claude signature/footer; user previews before push;
  after approved push: Pages `built`, live checks, SPN save of hall + face.

## Verification

- `seal_check.sh` + grep recipe on the new face; playwright same-host
  resource check on the face **after the pantry runs** (networkidle) —
  still same-host only.
- Pantry behavior: two fresh loads yield different 20-name sequences
  (compare the full ordered list; if equal — probability ≈ 0 — reload
  once and compare again); every rendered img resolves locally (no 404s
  in console); search input typing changes nothing in the grid.
- JS-off load: grid equals the captured page-1 twenty, pantry dormant,
  no broken images.
- Hall behavior test re-run with counts 16 → 17 (cards, plaques, buttons,
  hooks) + new door navigation; JS-off inline degrade still holds; the
  specimen renders as escaped text (literal `filterCharacters` visible,
  no stray live elements from specimen content).
- Byte checks: hook/charm verbatim; "Ten of them are walkable" and
  "10 walkable faces" present; specimen matches the source function
  after escaping; 🚀 intact.
- Desktop + mobile screenshots: new tile, open plaque (specimen visible),
  the face twice (two loads, different grids), for user preview.

## Out of scope (later cycles)

Restaurant site face (cycle 4), sprint widgets + their pantries (cycle 5),
pantry pass over existing faces (cycle 6), CA-Projects umbrella-card
rewrite (end of series).
