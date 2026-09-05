# React-Hooks-with-TypeScript: the 13th walkable face — design

**Date:** 2026-09-05
**Status:** draft for user review
**Context:** Cycle 7 of the wing-extension program. Cycles 1–6 shipped
through `b772dd3` (19 hall cards, twelve walkable, the last of them
`movie-db` fed with real posters). This cycle promotes the last obvious
candidate: the hooks cheat sheet. Its card already exists — badge
`catalogue only` — so this is a **card rewrite**, not a new tile: 19 cards
stay 19, walkable goes 12 → 13.

## The exhibit

`React-Hooks-with-TypeScript` (private repo `atakee72/React-Hooks-with-TypeScript`,
last commit `2076ba5`, 2023-04-02, "Finished custom hook, added useMemo").
Create React App 5.0.1, React 18.2, TypeScript 4.9. One route, `/`, one
vertically stacked page, one component per hook:

1. **Custom hook + useMemo** — `useFetchData` fetches
   `https://jsonplaceholder.typicode.com/users` (public, keyless, no auth)
   and renders the users as cards; a memoized filter picks the one named
   Antonette and prints her email. Coordinates are printed as raw numbers.
2. **useRef** — a bare input.
3. **useReducer** — a counter that starts at 100, buttons `+10` and `-5`.
4. **useState** — array-append and name-set buttons.
5. **useEffect** — a counter that ticks once a second, forever.
6. **useContext** — shows "Jane Smith"; "Change context" swaps in "Josie Paris".

Ran clean on `PORT=4005` at inventory time (2026-08), no legacy-openssl flag,
no console errors. `leaflet`/`react-leaflet` are installed but the
`<MapContainer>` JSX in `CustomHookComponent.tsx` is entirely commented out —
the shelved "let's map these users" ambition. No keys, no PII, no DB.

The repo is **not currently cloned** (the scratch clone was removed); cycle 7
re-clones it into `.superpowers/sdd/lehrjahre/repos/` (git-ignored).

## Design

### 1. The face — `lehrjahre/react-hooks/`

Standard capture with the existing toolkit: `npm install`,
`PORT=4005 BROWSER=none npm start`, wait for the jsonplaceholder fetch to
paint the user cards, then `capture_face.py` on route `/` → `index.html`
(scripts/noscript/form-actions stripped, assets localized, sourcemap
comments swept, curator bar injected with `--backlink ../../lehrjahre.html`
and `--exhibit-title "React-Hooks-with-TypeScript"`).

**Fed, not pantried.** The users arrive in the exhibit the way they arrived
on screen in 2023 — fetched live, then frozen. jsonplaceholder returns one
fixed roster, so there is nothing to shuffle and no stash to stock: this
face is *frozen-fed*, one moment, no data script. (The inventory noted
eight cards on screen; the API's roster is ten. The plan counts the cards in
the captured DOM and the plaque uses that number.) The only
assets to localize are CRA's own favicon/logo; the API returns text only.

**The curator's clock (museum addition, marked in place).** Stripping the
scripts stops every hook on a page whose whole subject is hooks. One small
inline script gives some of them their motion back. It obeys one rule,
stated in its own header comment and verifiable by reading it:

> the curator may rewrite the text of a node the page already rendered —
> nothing else. No new nodes, no new data, no fetch, ever.

Under that rule, three of the six hooks answer again:

- **useEffect — the ticking counter.** Resumes from the captured number and
  ticks once a second, exactly as it did. This is the headline: the one hook
  that never needed a click to prove it was alive.
- **useReducer — the counter.** `+10` and `-5` move the captured number.
- **useContext — "Change context".** Toggles the two hardcoded names the
  source contains, "Jane Smith" ↔ "Josie Paris".

The other three stay inert and the plaque says so: **useState** would have to
create list items and **useRef** would need a live ref — both are past the
line. The input still accepts typing, because inputs do that by themselves.

Selectors are pinned at planning time from the actual captured markup (CRA
output has few hooks to grab onto; the plan quotes the exact nodes). The
script is the only script on the face, inline, headed by a comment naming it
a curator addition and its date. JS off, or Wayback replay: a still page with
the captured numbers standing — the pure artifact, undamaged.

Seal: `seal_check.sh lehrjahre/react-hooks` + the CLAUDE.md grep recipe +
`sourceMappingURL` sweep. Zero external requests at view time.

Thumbnail `assets/lehrjahre/react-hooks.png` is **replaced** with a fresh
640px shot of the captured face (the current file is an inventory screenshot
of the running app).

### 2. The hall card — rewrite in place

The existing tile at `lehrjahre.html:302` keeps its position (Apr 2023) and
its charm line. It gains a linked shot, a door, and a specimen:

- Badge: `catalogue only` → **`walkable · still ticking`**
- Hook: **Six hooks pinned to one page; one of them still beats.**
- Plaque (draft copy — user corrects at preview):
  - p1: the cheat sheet, one component per hook, the fake users
    fetched to prove `useMemo` filtered for Antonette. Kept from the
    current plaque, which is already good.
  - p2 (new): "Freezing a page about hooks stops every hook on it. So the
    curator wrote a handful of lines: the `useEffect` counter picks up where the
    capture left it and goes on ticking, once a second, as it has been
    doing since April 2023. The reducer still adds ten and takes five; the
    context still changes its mind about whose name it holds. The rest are
    pinned open — `useState` would have to build something new, and this
    museum does not build."
  - **Specimen — `CustomHookComponent.tsx`, the map that never opened**
    (HTML-escaped, verbatim from source): the commented-out `<MapContainer>`
    block. Extracted byte-exact at planning; md5-gated against source bytes.
  - Charm (kept verbatim): 'A comment in the custom hook: "Payload" instead
    of "User[]" to make it genuinely generic :-]'
- Door: `Enter the exhibit →` → `lehrjahre/react-hooks/index.html`; the
  tile shot links there too.
- Specimen markup reuses the wing's `.specimen-label` / `pre.specimen`.

### 3. Museum integration (walkable 12 → 13)

- Every site naming the count changes; find them all with
  `grep -rn "welve of them\|12 walkable" *.html README.md` — the grep is the
  authority, not this list (known: hall intro, landing era chip, README).
- README `### 7.` provenance: capture date and method, the curator's-clock
  rule quoted, which three hooks were re-animated and which three were left
  inert, the specimen's source file, and the private-repo note.
- No new "how these were captured" sentence is needed — the pantry sentence
  already there covers curator-marked scripts; the plaque carries the rest.

## Constraints (museum rules, binding)

- Sealed NEW artifact: zero external requests at view time, zero live
  external links, `data-original` on dead externals; re-verify the seal and
  sweep `sourceMappingURL` after any hand-edit.
- The curator script is the ONLY script on the face: inline, marked, no
  fetch, no node creation, no style changes. It rewrites text of existing
  nodes and nothing else.
- Only these paths change: new `lehrjahre/react-hooks/`,
  `assets/lehrjahre/react-hooks.png` (replaced), `lehrjahre.html` (card
  rewrite + count word), `index.html` (chip count), `README.md`. Every other
  face and archived exhibit stays byte-identical.
- Specimen text verbatim-then-escaped; no reformatting; md5 gate against the
  source bytes (Edit strips trailing whitespace — use a python rewrite).
- Nothing from the private clone is committed. Before every commit, sweep
  the staged tree for secrets even though none are expected.
- Simple commit messages, no signature/footer; user previews before push;
  after an approved push: Pages `built`, live checks, SPN save of hall + face.

## Verification

- `seal_check.sh` + CLAUDE.md greps + sourcemap sweep on the new face.
- Playwright same-host resource check **after the curator script has run**
  (networkidle + 3s): only same-host entries; no console errors; no 404s.
- The clock: read the counter, wait 3s, read again — it advanced by ~3.
  Reload: it restarts from the captured value, not from a stored one.
- Tier-B controls: `+10` then `-5` moves the reducer number by the right
  amounts from the captured start; "Change context" toggles both ways.
- Inertness: the `useState` buttons add nothing; the page's node count is
  identical before and after clicking every button on it.
- JS-off load: numbers frozen at capture values, no broken images, layout
  identical to the JS-on first paint.
- Hall: 19 cards / 19 plaques / 19 buttons, door count +1, the new door
  navigates; JS-off inline degrade holds; the specimen renders as escaped
  text (a literal `MapContainer` visible, no live element from it).
- Byte checks: hook and charm lines verbatim; "Thirteen of them are
  walkable" and "13 walkable faces" present; specimen md5 matches source.
- Desktop + mobile screenshots: the rewritten tile, the open plaque with the
  specimen, and the face twice a few seconds apart (the clock moved), for the
  user's preview.

## Out of scope

GraphOL promotion, a someday-plaque for the retired portfolio, the Astro
shell rebuild. The three inert hooks stay inert — re-animating `useState`
would mean building DOM the original app built, which is the line this
museum does not cross.
