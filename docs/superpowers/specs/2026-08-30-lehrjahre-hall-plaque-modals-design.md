# Lehrjahre hall: compact tiles + plaque modals — design

**Date:** 2026-08-30
**Status:** draft for user review
**Context:** Cycle 1 of the wing-extension program agreed 2026-08-30:
(1) this hall redesign, then (2) CA-Projects sub-apps promoted to walkable
faces one by one (my-first-react-app → rick-n-morty → restaurant site →
sprint widgets), each with an escaped-JSX source specimen where it is React,
and "baked pantry" data where the exhibit's charm is behavior. Later cycles
get their own specs; this spec covers the hall only.

## Problem

`lehrjahre.html` holds 15 rich catalogue cards (copy + 1–2 screenshots +
charm line each). The page is a long scroll, and the coming face promotions
will add more cards. The user wants: screenshot-first compact cards, with
one click opening a plaque (modal) carrying the detailed copy.

## Design

### Tile (the card face)

Each `.lj-card` shrinks to a tile showing only:

1. its badge (`walkable`, `catalogue only`, etc. — unchanged text),
2. `h3` title + `.lj-date`,
3. **one** screenshot (the card's first `.lj-shot`),
4. a one-line hook (`.lj-hook`, muted, replaces the full copy at tile level),
5. for walkable exhibits: the door link `Enter the exhibit →` stays **on the
   tile** — entering a face must never require opening the plaque,
6. a JS-only `Read the plaque →` control (see mechanism).

The epilogue tile keeps its dashed border. Grid tightens:
`minmax(300px,1fr)` → `minmax(240px,1fr)` so desktop shows 3–4 tiles per row;
mobile stays 1 per row.

### Plaque (the modal)

Opening a tile's plaque shows everything the card holds today: full copy
paragraphs, second screenshot where one exists, `.lj-charm` line, and the
door link again. Plus the badge + title + date as the modal header. Closes
via × button, backdrop click, and Escape. Body scroll locks while open.
On close, focus returns to the control that opened it.

### Mechanism (progressive enhancement, zero external requests)

- The full plaque content **stays in the page's HTML**, inside each card as
  `<div class="lj-plaque">…</div>`. No copy is moved to JS strings; Wayback,
  search engines, and reader modes keep the full text.
- A one-line inline script immediately after `<body>` adds class `js` to
  `<html>`. CSS: `.js .lj-plaque { display:none }` and
  `.lj-plaque-btn { display:none }` / `.js .lj-plaque-btn { display:inline-block }`.
- **JS off ⇒ exactly today's page**: plaques render inline in their cards,
  no dead buttons, door links work. No `<noscript>` needed.
- One shared `<dialog class="lj-dialog">` element in the markup (empty shell
  + × close button). The wiring script (inline, end of body, ~40 lines):
  on tile activation it **moves** that card's `.lj-plaque` node into the
  dialog and calls `showModal()`; on close it moves the node back into its
  card. Moving (not cloning) keeps loaded images loaded and never duplicates
  content. `<dialog>` gives Escape handling, focus trapping, and
  `::backdrop` for free; backdrop click closes (click target === dialog).
- Activation targets: the `Read the plaque →` button, the screenshot
  (non-walkable cards only — on walkable cards the screenshot keeps linking
  into the exhibit, as now), and the title. All get `cursor:pointer` under
  `.js`. The button is a real `<button>`, keyboard-reachable.
- All JS inline in `lehrjahre.html`; all CSS appended to `assets/museum.css`
  `/* lehrjahre */` block. The page continues to make zero external requests.

### Copy

- Intro section: after "The rest are catalogue cards." add exactly:
  "Every card opens its plaque — click one." (One sentence, museum voice;
  with JS off the plaques are already open, and the sentence still reads
  true enough for a museum.)
- Each tile needs its one-line `.lj-hook`, drawn from the existing card copy
  (condensed, not new claims). Draft hooks — **user corrects at preview**:

| Card | Hook |
|---|---|
| CA-Projects | The earliest folder: sprint exercises and my two first React apps. |
| MaHalle v1 | A MERN forum for the neighbourhood, eternally empty. |
| ChatGPT-Interface | Twenty-three lines of Node; the chat happened in a console window. |
| GoneWithTheTailwind | A blog front page for ninjas that was never a blog. |
| GraphOL-server-example | My first GraphQL server; the typo in the name shipped. |
| GraphQL-Booklist | Caught mid-refactor and never run again. |
| React-Hooks-with-TypeScript | One page, six hooks — my React cheat sheet. |
| movie-db | Woke to a blank screen; the museum lent it a dummy config. |
| admin-dashboard | An admin dashboard for nothing; every stat reads 100. |
| Finance_Logger | The one exhibit that still functions — until you reload. |
| MaHalle v2 | Ein Kiez-Gesichterbuch; three doors painted on walls. |
| mongodb-crud | The navbar just says ATAKEE; the list page crashes on cue. |
| Developer-Portefeuille | The direct ancestor of ercan-atak.de, fed by its own CMS. |
| dogsNfilms | Adopt a broken image. |
| translation-office-ai-assistant | A postscript from 2026: the Lehrjahre never really end. |

- No card copy is rewritten or lost — every existing paragraph, screenshot
  and charm line survives inside its plaque.

## Constraints (museum rules, binding)

- Shell page: zero external requests; only `assets/museum.css` is loaded.
- Archived exhibits and sealed faces untouched — this cycle edits only
  `lehrjahre.html` and `assets/museum.css`.
- Simple commit messages, no Claude signature/footer. Push only on user
  go-ahead, after user preview.
- Typographic characters in existing copy (— · ~ „" etc.) must survive
  byte-identical; edits are structural, not textual, except the intro
  instruction sentence and the new hooks.

## Files

- Modify: `lehrjahre.html` (restructure cards into tile + `.lj-plaque`,
  add shared `<dialog>`, two inline scripts).
- Modify: `assets/museum.css` (extend `/* lehrjahre */` block: tile sizing,
  `.lj-hook`, `.lj-plaque-btn`, `.lj-dialog` + `::backdrop`, `.js` gates).
- Docs: one line in README's Lehrjahre section noting the hall's plaque
  modals (shell change, not exhibit provenance).

## Verification

- `python3 -m http.server 8765`; playwright-cli:
  - Desktop 1280 + mobile 390 screenshots: tile grid, an open plaque
    (a two-screenshot card, e.g. CA-Projects), the epilogue tile.
  - Open via button and via screenshot (non-walkable card); close via ×,
    backdrop, Escape; focus returns; open a second plaque after closing the
    first (the move-back must work repeatedly).
  - Walkable tile: screenshot click and door link still navigate into the
    face (no modal).
  - JS disabled (playwright `javaScriptEnabled:false`): page renders all
    plaques inline, no visible `Read the plaque` buttons, doors work.
  - Console: no errors beyond the known favicon 404;
    `performance.getEntriesByType('resource')` → same-host only.
- Grep: every `lj-plaque` opened has a matching home card (counts equal);
  no copy paragraph lost (`git diff` review — paragraphs moved, not deleted).
- After user-approved push: Pages build `built`, live hall 200, SPN re-save
  `lehrjahre.html`.

## Out of scope (later cycles)

Face promotions (my-first-react-app first), JSX source specimens, baked
pantry feeds, re-examining existing faces for pantry joy-wins, movie-db
TMDb feeding. Each arrives with its own spec.
