# GraphOL-server-example: the 14th walkable face — design

**Date:** 2026-09-08
**Status:** draft for user review
**Context:** Cycle 8, and the last promotion the catalogue can honestly
support. Cycle 7 shipped the React-Hooks face through `2d9b3f3`; the copy
fix `382a98e` settled the wing's vocabulary (15 repos, 15 faces, 13 walkable
cards, 10 repos that produced a face). Of the six cards still unwalkable,
this is the only one whose inventory verdict was FACE. The other five stay
cards on merit: `GraphQL-Booklist` is dead on arrival, `mongodb-crud`'s
point dies without a database, `ChatGPT-Interface` never had a browser,
`CA-Projects` is the umbrella, and the translator assistant is the epilogue.

## The exhibit

`GraphOL-server-example` (private repo; the typo in the name is the real
repo name and shipped). One commit in its whole history — "ReadMe file
added", 2023-03-25. Node + TypeScript + ESM, Apollo Server v4 with the
legacy `ApolloServerPluginLandingPageGraphQLPlayground`, `graphql` v16.

It is a backend with no website. The schema models a tiny blog — `User`,
`Post`, `Comment`, cross-linked by resolvers — over data hardcoded in
`src/data.ts`: two users (Mehmet Seven, Ahmet Günal), three posts, four
comments. No database, no keys, no remote calls. Installs and runs clean on
Node 24; the source listens on port 4000.

Its only face is the GraphQL Playground the plugin serves at `/`: a
two-pane IDE with a query editor, a Play button, and Docs/Schema drawers.
That is the exhibit — there is no other route, and there never was.

Two files in the repo root are the author's own lab notes:
`queryExamples.txt` (six queries he wrote to try the server) and
`theirResponses.txt` (the answers he got back, pasted in). **The notes have
fossilised out of step with the code:** `theirResponses.txt` still holds the
Turkish data he started with — `"Bu Ahmet'in yorumudur"`, `"Mehmet'in
gönderisi"` — while `src/data.ts` now says the same things in English
(`"This is Ahmet's comment"`, `"Mehmet's post"`). The saved answers no
longer match the questions. That is this exhibit's find.

## Design

### 1. The face — `lehrjahre/graphol/`, three states

The Playground is a live React app served from a CDN, so this face needed
two additions to the capture toolkit before it was possible at all. Both
are already built and proven on a trial capture (2026-09-08):

- **`--materialize-css`.** The Playground styles itself with
  styled-components, which injects rules into the CSSOM rather than into
  the DOM, so a plain capture serialises *empty* `<style>` tags — the first
  trial froze to an unstyled column of text. The new flag walks
  `document.styleSheets` and writes each sheet's rules back into its own
  `<style>` element before the snapshot. It recovered 28,058 characters of
  CSS and the frozen page is now pixel-faithful to the live one.
- **`key:` specials.** `--special` could only click. It now accepts
  `key:Control+Enter`, which is how the Playground runs a query.

Capture, all from one page in one sequence, so each state is the true
consequence of the one before it:

1. **`index.html`** — the Playground loaded with the author's own
   `getAllUsers` query already in the editor, verbatim from
   `queryExamples.txt`, prefilled through the Playground's `?query=` URL
   parameter. The right pane reads "Hit the Play Button to get a response
   here".
2. **`answered.html`** — after `Control+Enter`: the nested JSON answer,
   Mehmet's two posts and Ahmet's one, exactly as the server replied.
3. **`schema.html`** — after clicking the Schema tab: the drawer open over
   the answer, listing `type User`, `type Post`, `type Comment`, `type
   Query` with every field.

Sealed the usual way: 20 assets localized, including the Playground's own
CSS from jsdelivr and the Google Fonts `woff2` files. The trial capture
loads with **zero external requests** and `seal_check.sh` reports SEALED.

**The curator's wiring (static anchors, no script).** The captured buttons
are dead HTML. Rather than add a script, the museum wraps three of them in
plain links, so the exhibit works with JavaScript off:

| state | Play button | Schema tab |
|---|---|---|
| `index.html` | → `answered.html` | inert |
| `answered.html` | → `answered.html` (a re-run returns the same answer) | → `schema.html` |
| `schema.html` | → `answered.html` | → `answered.html` (closes the drawer) |

Every wired click lands on a state that was actually captured, which is why
`index.html`'s Schema tab stays inert: there is no capture of the schema
drawer over an unanswered pane, and the museum will not manufacture one.
Each wrapping anchor carries a curator comment naming it a museum addition.

Everything else in the Playground — Prettify, History, Copy CURL, the tab
bar, the settings gear — stays dead, as it is in every face here.

Thumbnail `assets/lehrjahre/graphol.png` is replaced with a fresh 640×360
shot of `answered.html` (the current file is an inventory screenshot).

### 2. The hall card — rewrite in place

The existing tile keeps its position (Mar 2023) and its charm line.

- Badge: `catalogue only` → **`walkable · answered`**
- Hook: **A server with no website. Press Play and 2023 answers.**
- Plaque: keep the current opening (first GraphQL server, the typo that
  shipped, two Turkish-named users and their posts, the playground as its
  only face), then add: the query in the editor is his own, from his notes;
  Play returns the answer the server actually gave; the Schema drawer shows
  the shape he built.
- **Specimen — `theirResponses.txt` vs `src/data.ts`**: a short slice of
  the saved Turkish answer beside the English data that replaced it, with
  one line of plaque saying the notes are older than the code. Both slices
  verbatim, HTML-escaped, md5-gated against the source bytes.
- Charm (kept verbatim): "The fake data gives up halfway through: the last
  comments are 'foo bar' and 'foo bar baz'."
- Door: `Enter the exhibit →` → `lehrjahre/graphol/index.html`; the tile
  shot links there too.

### 3. Museum integration

Counts move: **walkable cards 13 → 14**, **faces 15 → 16**, **repos that
produced a face 10 → 11**. Doors 15 → 16.

- `lehrjahre.html`: "Thirteen of the cards below are walkable … they open
  fifteen faces" → fourteen and sixteen.
- `index.html`: "Ten of them left a page you can still walk through" →
  eleven; chip `10 of 15 walkable` → `11 of 15 walkable`.
- The grep is the authority: `grep -rn "hirteen of the cards\|10 of 15\|Ten of them" *.html`.
- README `### 7.` provenance bullet: capture method, the two new toolkit
  flags and why they were needed, the three states, exactly which buttons
  are wired and which are inert, the specimen's two source files.
- `CLAUDE.md`'s toolkit paragraph gains one sentence naming
  `--materialize-css` and `key:` specials, so the next face inherits them.

## Constraints (museum rules, binding)

- Sealed new artifact: zero external requests at view time, no live
  external links, `sourceMappingURL` swept, seal re-verified after any
  hand-edit.
- **No script on this face at all.** The wiring is static anchors; if a
  state cannot be reached without JavaScript, it is not wired.
- Nothing invented: no state is shown that the app could not produce, and
  no button is wired to a state that was not captured.
- Only these paths change: new `lehrjahre/graphol/`,
  `assets/lehrjahre/graphol.png` (replaced), `lehrjahre.html`, `index.html`,
  `README.md`, `CLAUDE.md`. Every other face stays byte-identical.
- Specimens verbatim then escaped; md5-gated (Edit strips trailing
  whitespace — use a python rewrite).
- Nothing from the git-ignored clone is committed. The repo holds no
  secrets; sweep the staged tree anyway.
- Simple commits, no signature/footer; user previews before push; after an
  approved push: Pages `built`, live checks, SPN saves.

## Verification

- `seal_check.sh lehrjahre/graphol` + the CLAUDE.md greps + sourcemap sweep.
- Playwright on each of the three states: zero external requests, no 404s,
  no console errors — with JavaScript **on and off**, since the face has no
  script and must look identical either way.
- Navigation: from `index.html`, Play reaches the answer; from there,
  Schema opens the drawer and closes back to the answer. Every wired anchor
  resolves to a file that exists; the inert ones have no `href`.
- Fidelity: `answered.html` contains "Mehmet Seven", "Ahmet Günal",
  "Mehmet's other post"; `schema.html` contains `type Comment` and
  `fullName`; `index.html` contains none of the answer's text.
- Byte checks: hook and charm verbatim; specimen md5s match both sources;
  "Fourteen of the cards", "sixteen faces", "Eleven of them",
  "11 of 15 walkable" present, and no "hirteen of the cards"/"10 of 15"
  left anywhere in the shell.
- Hall: 19 cards / 19 plaques / 19 buttons, doors 15 → 16, the new door
  navigates, JS-off inline degrade holds, the specimen renders as escaped
  text.
- Desktop and mobile screenshots of the tile, the open plaque, and all
  three states, for the owner's preview.

## Out of scope

The other five unwalkable cards, which stay cards for the reasons listed at
the top. After this, the wing is complete: sixteen faces, and every repo
that could open a door has one.
