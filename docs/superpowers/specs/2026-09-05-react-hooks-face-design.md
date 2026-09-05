# React-Hooks-with-TypeScript: the 13th walkable face — design

**Date:** 2026-09-05
**Status:** approved 2026-09-05; revised the same day after a trial capture
(see "Revision" below)
**Context:** Cycle 7 of the wing-extension program. Cycles 1–6 shipped
through `b772dd3` (19 hall cards, twelve walkable, the last of them
`movie-db` fed with real posters). This cycle promotes the last obvious
candidate: the hooks cheat sheet. Its card already exists — badge
`catalogue only` — so this is a **card rewrite**, not a new tile: 19 cards
stay 19, walkable goes 12 → 13.

## Revision (2026-09-05, after cloning and capturing the app)

The approved spec said the curator could re-animate three of the six hooks
and had to leave `useState` inert because it "would have to create list
items". The source proves otherwise: `UseStateComponent` renders its state
as `{JSON.stringify(arr)}` and `{JSON.stringify(name)}` — plain text nodes
beside their buttons, `[]` and `null` in the capture. Nothing would be
built. So **five of the six hooks come back**, all of them under the same
one-node rule, and the sixth is exempt for a better reason: `useRef` renders
a bare `<input>` whose ref is never used — it did nothing visible in 2023
either. Also corrected from the real markup: the reducer's buttons are
labelled `Increment` / `Decrement` (payloads 10 and 5), the effect counter
starts at 1, and the fetch renders **ten** user cards, not eight.

## The exhibit

`React-Hooks-with-TypeScript` (private repo `atakee72/React-Hooks-with-TypeScript`,
last commit `2076ba5`, 2023-04-02, "Finished custom hook, added useMemo").
Create React App 5.0.1, React 18.2, TypeScript 4.9. One route, `/`, one
vertically stacked page, one component per hook:

1. **Custom hook + useMemo** — `useFetchData` fetches
   `https://jsonplaceholder.typicode.com/users` (public, keyless, no auth)
   and renders ten user cards; a memoized filter picks the user whose
   username is Antonette and prints her email. Coordinates print as raw
   numbers.
2. **useRef** — a bare input. The ref is declared and never used.
3. **useReducer** — a counter starting at 100; `Increment` adds 10,
   `Decrement` subtracts 5.
4. **useState** — `Add to array` appends `arr.length + 1`, `Set name` sets
   "Jack"; both states are printed with `JSON.stringify`.
5. **useEffect** — a counter starting at 1, `setInterval` +1 every second.
6. **useContext** — shows "First: Jane / Last: Smith"; `Change context`
   sets Josie Paris. One-way: the source has no toggle back.

Clean install and clean run on `PORT=4005` (verified again at planning,
2026-09-05). No keys, no PII, no DB; a secret sweep of the clone found
nothing. `leaflet`/`react-leaflet` are installed but the `<MapContainer>`
JSX in `CustomHookComponent.tsx` is entirely commented out — the shelved
"let's map these users" ambition.

## Design

### 1. The face — `lehrjahre/react-hooks/`

Standard capture with the existing toolkit: `npm install`,
`PORT=4005 BROWSER=none npm start`, wait for the jsonplaceholder fetch to
paint the user cards, then `capture_face.py` on route `/` → `index.html`
(scripts/noscript/form-actions stripped, assets localized, sourcemap
comments swept, curator bar injected with `--backlink ../../lehrjahre.html`
and `--exhibit-title "React-Hooks-with-TypeScript"`). The trial capture
localized three assets (favicon, apple-touch icon, manifest) and nothing
else — the API returns text only.

**Fed, not pantried.** The users arrive in the exhibit the way they arrived
on screen in 2023 — fetched live, then frozen. jsonplaceholder returns one
fixed roster of ten, so there is nothing to shuffle and no stash to stock:
this face is *frozen-fed*, one moment, no data script.

**The curator's clock (museum addition, marked in place).** Stripping the
scripts stops every hook on a page whose whole subject is hooks. One small
inline script gives them their motion back. It obeys one rule, stated in
its own header comment and verifiable by reading it:

> the curator may rewrite the text of a node the page already rendered —
> nothing else. No new nodes, no new data, no fetch, ever.

Under that rule, five of the six hooks answer again:

- **useEffect — the ticking counter.** Resumes from the captured number and
  ticks once a second. The headline: the one hook that never needed a click
  to prove it was alive.
- **useReducer.** `Increment` +10, `Decrement` −5 on the captured 100.
- **useState.** `Add to array` grows `[]` → `[1]` → `[1,2]`; `Set name`
  turns `null` into `"Jack"` — the same `JSON.stringify` text the app wrote.
- **useContext.** `Change context` replaces Jane Smith with Josie Paris,
  **one-way**, because that is all the original ever did.
- **useRef** needs nothing: its input already accepts typing, and its ref
  was never used for anything in the first place.

Selectors are pinned in the plan from the captured markup: every section is
addressed as "the `h1` whose text is X, then its following siblings" — the
CRA output carries no ids or classes to grab. The script is the face's only
script, inline, headed by a comment naming it a curator addition and its
date. JS off, or Wayback replay: a still page with the captured numbers
standing — the pure artifact, undamaged.

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
  - p1: the cheat sheet, one component per hook, ten fake users fetched to
    prove `useMemo` could filter for Antonette. Kept from the current
    plaque, which is already good.
  - p2 (new): "Freezing a page about hooks stops every hook on it. So the
    curator wrote a handful of lines, allowed to change only text the page
    had already written: the `useEffect` counter picks up where the capture
    left it and goes on ticking, once a second. The reducer still adds ten
    and takes five, the array still grows, the context still changes its
    mind about whose name it holds — once, which is all it ever did.
    Nothing here is rebuilt; the numbers are simply allowed to move again."
  - **Specimen — `CustomHookComponent.tsx`, the map that never opened**
    (HTML-escaped): the commented-out `<MapContainer>` block, lines 67–77,
    dedented by its common 16-space indent and otherwise verbatim; md5-gated
    against the source slice.
  - Charm (kept verbatim): 'A comment in the custom hook: "Payload" instead
    of "User[]" to make it genuinely generic :-]'
- Door: `Enter the exhibit →` → `lehrjahre/react-hooks/index.html`; the
  tile shot links there too.
- Specimen markup reuses the wing's `.specimen-label` / `pre.specimen`.

### 3. Museum integration (walkable 12 → 13)

- Every site naming the count changes; find them all with
  `grep -rn "welve of them\|12 walkable\|count: twelve" *.html README.md` —
  the grep is the authority (known: `lehrjahre.html:40`, `index.html:387`
  and `:392`, README's last provenance bullet).
- README `### 7.` provenance: capture date and method, the one-node rule
  quoted, which five hooks were re-animated and why `useRef` needed nothing,
  the specimen's source file and its dedent, and the private-repo note.
- No new "how these were captured" sentence is needed — the pantry sentence
  already there covers curator-marked scripts; the plaque carries the rest.

## Constraints (museum rules, binding)

- Sealed NEW artifact: zero external requests at view time, zero live
  external links, `data-original` on dead externals; re-verify the seal and
  sweep `sourceMappingURL` after any hand-edit.
- The curator script is the face's ONLY script: inline, marked, no fetch, no
  node creation, no style changes. It rewrites the text of existing nodes
  and nothing else.
- Only these paths change: new `lehrjahre/react-hooks/`,
  `assets/lehrjahre/react-hooks.png` (replaced), `lehrjahre.html` (card
  rewrite + count word), `index.html` (chip + count), `README.md`. Every
  other face and archived exhibit stays byte-identical.
- Specimen text verbatim-then-escaped apart from the uniform dedent; md5
  gate against the source bytes (Edit strips trailing whitespace — use a
  python rewrite).
- Nothing from the private clone is committed. Sweep the staged tree before
  every commit even though the repo holds no secrets.
- Simple commit messages, no signature/footer; user previews before push;
  after an approved push: Pages `built`, live checks, SPN save of hall + face.

## Verification

- `seal_check.sh` + CLAUDE.md greps + sourcemap sweep on the new face.
- Playwright same-host resource check **after the curator script has run**
  (networkidle + 3s): only same-host entries; no console errors; no 404s.
- The clock: read the counter, wait 3s, read again — advanced by ~3. Reload:
  restarts from the captured value, not from a stored one.
- The controls: `Increment` then `Decrement` moves 100 → 110 → 105; two
  `Add to array` clicks give `[1,2]`; `Set name` gives `"Jack"`; `Change
  context` gives Josie Paris and a second click leaves it there.
- No building: the page's element count is identical before and after
  clicking every button on it.
- JS-off load: numbers frozen at the captured values, no broken images,
  layout identical to the JS-on first paint.
- Hall: 19 cards / 19 plaques / 19 buttons, door count +1, the new door
  navigates; JS-off inline degrade holds; the specimen renders as escaped
  text (a literal `MapContainer` visible, no live element from it) and the
  OpenStreetMap URL inside it stays inert text — re-run the shell-page
  resource check on `lehrjahre.html` to prove it requests nothing.
- Byte checks: hook and charm lines verbatim; "Thirteen of them are
  walkable" and "13 walkable faces" present; specimen md5 matches source.
- Desktop + mobile screenshots: the rewritten tile, the open plaque with the
  specimen, and the face twice a few seconds apart (the clock moved), for the
  user's preview.

## Out of scope

GraphOL promotion, a someday-plaque for the retired portfolio, the Astro
shell rebuild. The exhibit gains no behaviour the original did not have: no
toggle back on the context button, no working ref, no search, no map.
