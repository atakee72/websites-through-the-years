# Cycle 6: the joy-win pass + the umbrella-card rewrite — design

**Date:** 2026-09-01
**Status:** draft for user review
**Context:** The closing cycle of the wing-extension program (cycle 5, the
sprint widgets, shipped 2026-09-01 through `f580417`). Two halves: feed the
one original face still starving (movie-db), and rewrite the CA-Projects
umbrella card that five promotions have made stale. No new walkable count —
nothing new becomes walkable; one walkable exhibit gets richer.

## Part 1 — the joy-win pass over the original eight faces

Surveyed against the "frozen at a live state" brief. Verdicts:

| Face | Verdict | Why |
|---|---|---|
| movie-db | **FEED IT** (this cycle's work) | The only exhibit whose substance is still missing: its movie grid sits behind a login that can never succeed. The data source (TMDb) is alive and its key is in the app's own source. |
| MaHalle v1 | no change | The empty forum IS the exhibit ("search box ready, nobody home"). Faking posts would be fabrication. |
| MaHalle v2 | no change | The one-word stub pages are the exhibit. |
| GoneWithTheTailwind | no change | Its hamburger toggle already works (kept scripts); "Load more" loading nothing is preserved charm. |
| Finance_Logger | no change | Still fully functional — the wing's original "still works". |
| admin-dashboard | no change | Hardcoded data already shows; pagination curator-wired in the first cycle. |
| Developer-Portefeuille | no change | Fed by its own live Sanity CMS at capture — already the model exhibit. |
| dogsNfilms | no change | "Adopt a broken image" is load-bearing charm; posters already shine. |

### movie-db: revive → feed

The public repo `atakee72/movie-db` (re-cloned at execution; the old clone
is gone) hard-crashes without Firebase env vars; the shipped face already
solved that with a dummy well-formed config at capture. What's still
missing: the `/movies` grid and `/movies/:id` detail pages — `/movies` sits
behind `ProtectedRoute`, and no account can ever log in.

**Method (news-tr scratch-copy precedent):** in a scratch-side copy only —
(a) the dummy Firebase config as before, (b) a curator bypass of
`ProtectedRoute` (render children unconditionally), so the app itself
fetches real TMDb data with the API key committed in its own source
(`src/store/MoviesContext.js`). Run, let the grid fill with real posters,
capture two more pages into the existing face:

- `lehrjahre/movie-db/movies.html` — the fed grid (frozen-fed: capture-day
  popular movies, posters localized from image.tmdb.org).
- `lehrjahre/movie-db/movie-detail.html` — the first movie's detail page
  (`/movies/:id`), same treatment.
- Curator wiring: the captured nav's "Movies" link on all six face pages →
  `movies.html`; on the grid, the first movie's card → `movie-detail.html`
  (single wired card, the fisheries one-working-button precedent, if the
  app links cards individually — else the grid's own links are rewritten
  naturally by the tool where they resolve to the captured detail page).
  Everything else stays frozen.
- Genre filter / search on the grid stay dead (frozen precedent: the
  broken search is never wired).

**Key protocol (binding, both keys):**
- The TMDb key never enters the museum repo (grep proof with prefix
  `b6bd7a` before every commit). It is used only by the scratch copy at
  capture; TMDb serves images from URL paths without the key, but the
  captured DOM and localized asset names must be grep-verified anyway.
- The Firebase dummy values never committed (scratch only), as before.
- ⚠ To surface to the user again: this TMDb key is hardcoded in a PUBLIC
  GitHub repo — worth rotating or usage-limiting at themoviedb.org,
  independent of the museum.

**Hall card update (movie-db):** badge `walkable · revived` →
`walkable · revived · fed`; plaque gains one sentence after "…nothing here
can log in.": "In 2026 the museum went further and carried the movie hall
door off its hinges: the grid behind the login now hangs here too, fed
with real posters on capture day." Plus a second plaque shot
(`assets/lehrjahre/movie-db-2.png`, the fed grid). Hook unchanged.

## Part 2 — the CA-Projects umbrella-card rewrite

The standing ruling from cycle 2 comes due: the umbrella card still
introduces its sub-apps as if none were promoted; five now have their own
frames (my-first-react-app, rick-n-morty, Yet Another Company Website, and
the three sprint-widget doors).

New plaque copy (draft — user corrects at preview; badge stays
`catalogue only`, title/date/tile shot/hook unchanged, charm unchanged):

> The earliest surviving folder — and by now mostly a frame of empty
> hooks: the restaurant site, both first React apps and three sprint
> widgets that once lived only in this card hang in frames of their own
> across the hall. What remains uniquely here: Sprint-1's exercise pile
> ("Answers to The Exercises 19-28, if any :)"), a shopping list, a file
> honestly named deneme.html — Turkish for "trial" — and the folder's
> name itself, CA-Projects-, trailing hyphen shipped.

The second plaque shot (rick-n-morty search bug) MOVES OUT of this plaque
— that story now lives on the rick-n-morty card — leaving the umbrella
with its one tile shot. `assets/lehrjahre/ca-projects-2.png` stays on disk
(referenced history) but is no longer shown; alternatively it is kept in
the plaque if the user prefers. Default: remove from the plaque.

## Constraints (museum rules, binding)

- Existing six movie-db pages stay byte-identical except the nav-link
  wiring edit; new pages sealed like all faces (zero external requests,
  zero scripts, data-original for dead externals, sourcemap sweep).
- Only these paths change: `lehrjahre/movie-db/**` (2 new pages + wiring
  edits), `assets/lehrjahre/movie-db-2.png` (new), `lehrjahre.html`
  (movie-db card update + umbrella plaque rewrite), `README.md`.
  No counts change anywhere.
- Both keys nowhere in the repo; grep proofs (`b6bd7a`, `98134c`) before
  every commit.
- Simple commits, no signatures; user previews before push; after push:
  Pages `built`, live checks, SPN save hall + movies.html.

## Verification

- seal_check + sourcemap + same-host playwright checks on the whole
  movie-db face (all 8 pages incl. the two new ones); TMDb-key grep → 0.
- movies.html: ≥ 10 movie cards with locally-loading posters; nav wiring
  navigates index → movies → detail and back via the captured nav.
- Hall: card updates verbatim; umbrella plaque new copy; JS-off degrade;
  19 cards unchanged in count; no other card copy touched.
- Screenshots for preview: fed grid, detail page, updated movie-db plaque,
  rewritten umbrella plaque.

## Out of scope

Astro shell rebuild (deferred indefinitely), promotable cards
(React-Hooks/GraphOL) — future ideas, not this series. After this cycle
the wing-extension program is complete.
