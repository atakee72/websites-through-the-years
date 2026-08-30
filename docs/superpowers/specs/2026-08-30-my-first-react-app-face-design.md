# my-first-react-app: walkable face + JSX specimens — design

**Date:** 2026-08-30
**Status:** draft for user review
**Context:** Cycle 2 of the wing-extension program (cycle 1, the hall's
plaque modals, shipped 2026-08-30). Goal set by the user: exhibit the first
React app so visitors see not just the rendered page but that **everything
on it is a hand-written React component** — source shown next to render,
"the skeleton next to the taxidermy."

## The exhibit

`my-first-react-app` lives in the private repo `CA-Projects-` at
`Project-3/my-first-react-app` (CRA 5 + React 18, single route, committed
2023-01-13 in one commit: "RickNMorty-first-version"). The rendered page:
a NavBar whose five links read `sdf`/`asdf`, a Contact view rendering
"Contact information", a Footer ("copyright @atakee" on green), the heading
**"Hey, Ercan is learning React! :)))"**, a cascade of styling-technique
headings (`className` → inline `style` → style object), and MyComponent's
exercises — including a list of names held in a constant called
`elephants`. No backend, no API calls, no keys.

## Design

### 1. The face — `lehrjahre/my-first-react-app/`

Captured with the existing toolkit (`.superpowers/sdd/lehrjahre/tools/`),
same treatment as the other eight faces:

- Repo already cloned (full history) at
  `.superpowers/sdd/lehrjahre/repos/CA-Projects-`. Run the app locally
  (`npm install`, `PORT=4016 BROWSER=none npm start`), capture the single
  route `/` → `index.html` with `capture_face.py` (scripts stripped —
  no interactivity worth keeping — assets localized, sourcemaps swept,
  curator bar injected with `--backlink ../../lehrjahre.html`).
- Seal: `seal_check.sh lehrjahre/my-first-react-app` + the CLAUDE.md grep
  recipe + playwright same-host resource check. Zero external requests,
  zero live external links.
- PII: the page shows first names and the public handle @atakee only. The
  rendered face includes the line "It is not you! It is Abdurrezzak" (a
  first name, consistent with the other first names on the page; the full
  "Abdurrezzak Atak" exists only in the unshipped source). Surfaced to the
  curator at preview for explicit approval.
- Thumbnail: `assets/lehrjahre/my-first-react-app.png` (640px wide, from
  the fresh capture, like the other tile shots).

### 2. The hall card — new tile, CA-Projects umbrella untouched

A new `.lj-card` (cycle-1 pattern: badge → h3+date → linked shot → hook →
plaque → button → door) inserted **immediately after the CA-Projects card**,
so the folder card introduces the era and the exhibit card opens the door.

- Badge: `walkable` · Title: `my-first-react-app` · Date: `Jan 2023`
- Hook (the user's thesis, verbatim): **Every block on this page is a
  hand-written React component.**
- Plaque copy (draft — user corrects at preview):
  - p1: "My first React app, preserved mid-lesson. A NavBar whose five
    links read sdf, asdf, sdf; a Contact view that renders the words
    'Contact information'; a Footer that says 'copyright @atakee' on green.
    None of it is a page in the old sense — every block is a component,
    written by hand, mounted one under the other so each had somewhere to
    stand."
  - **Specimen A** — the styling lesson, `App.js` (escaped JSX, verbatim
    from source):

    ```
    <div className="App">
      <Contacts />
      <h1 className='tomato'>Hey, Ercan is learning React! :)))</h1>
      <h2 className='blue'>this should appear blue</h2>
      <h3 className='blue' style={{color: "yellowgreen" }}>inline style</h3>
      <h4 className='blue' style={myStyle}>style object</h4>


      <MyComponent />
    </div>
    ```
  - p2 (between specimens): "One heading per styling technique — that was
    the entire lesson. In the stylesheet, the class named tomato is,
    of course, red. And the walkable page next door is exactly what this
    JSX became."
  - **Specimen B** — one whole component, `NavBar.js` (escaped, verbatim,
    all 17 lines incl. the `sdf`/`asdf` list items).
  - Charm: "The list of names in MyComponent is a constant called
    elephants. Two of the elephants are Monique."
- Door: `Enter the exhibit →` → `lehrjahre/my-first-react-app/index.html`;
  the tile shot links there too.

Specimen presentation: the lab's existing `pre`/`code`/`.specimen`/
`.specimen-label` styles are reused, with one new rule so wing specimens
read as source vitrines rather than the lab's red hazard specimens:
`.lj-plaque .specimen { border-left-color: var(--amber); }`. Labels e.g.
`SPECIMEN — App.js, the styling lesson` / `SPECIMEN — NavBar.js, one whole
component`. **Both specimens are HTML-escaped display text (`&lt;` etc.),
never live markup** — the museum's standing rule for code specimens.

Ruling carried from planning: the CA-Projects umbrella card is left
untouched this cycle (its copy still describes both React apps); it gets
one rewrite at the end of the promotion series (after cycles 3–5) instead
of churning every cycle.

### 3. Count updates (walkable goes 8 → 9)

- `lehrjahre.html` intro: "Eight of them are walkable" → "Nine of them are
  walkable".
- `index.html` Lehrjahre era chip: "8 walkable faces" → "9 walkable faces".
- "fifteen repositories" phrasing stays — the repo count is unchanged; the
  hall simply gains a 16th card (an exhibit within a repo).
- README `### 7.` gains a provenance entry: capture date/method, scripts
  stripped, no edits to app output, specimens' source files named.

## Constraints (museum rules, binding)

- The face is a sealed NEW artifact: zero external requests, zero live
  external links; never modernize; `data-original` for any dead external.
  Re-verify seal after any change.
- Only these paths change: new `lehrjahre/my-first-react-app/` (new files
  only), `assets/lehrjahre/my-first-react-app.png` (new), `lehrjahre.html`
  (new card + one word), `assets/museum.css` (one rule), `index.html` (chip
  text), `README.md`. The 8 existing faces and all archived exhibits stay
  byte-identical.
- Specimen text is verbatim from source (then HTML-escaped) — no tidying,
  no reformatting; the double blank line and spacing quirks in App.js are
  part of the artifact.
- Existing hall card copy untouched (CA-Projects umbrella included).
- Simple commits, no Claude signature/footer; user previews before push;
  after approved push: Pages `built`, live checks, SPN save of hall + face.

## Verification

- `seal_check.sh` on the new face; grep recipe (no `http`/`//`/`srcset`/
  `noscript`/`sourceMappingURL` beyond `data-original*`).
- Playwright: face loads with zero non-same-host resources, curator bar
  visible/clickable at top; specimens in the hall plaque render as visible
  escaped text (the literal string `className` appears, and no element
  named `h1p`-style leaks — `document.querySelector('.lj-plaque h1')` from
  specimen content must be null).
- Hall behavior test re-run with counts updated 15 → 16 (cards, plaques,
  buttons, hooks) + the new card's door navigation asserted; JS-off inline
  degrade still holds.
- Byte checks: hook and charm lines verbatim; "Nine of them are walkable"
  and "9 walkable faces" present; App.js specimen matches `src/App.js`
  lines 16–25 after escaping; NavBar specimen matches `src/components/NavBar.js`
  in full.
- Desktop + mobile screenshots of the new tile, its open plaque (both
  specimens visible), and the face itself, for user preview.

## Out of scope (later cycles)

rick-n-morty face (cycle 3), restaurant site (cycle 4), sprint widgets +
baked pantry (cycle 5), pantry pass over existing faces (cycle 6), and the
CA-Projects umbrella-card rewrite (end of series).
