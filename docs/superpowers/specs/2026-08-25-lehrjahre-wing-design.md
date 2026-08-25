# The Lehrjahre wing — design spec

**Date:** 2026-08-25 · **Status:** approved design "A" (brainstorm 2026-08-23), spec for implementation planning
**Museum:** websites-through-the-years (`/home/atakee/projects/eski-web-sayfalarim`)

## 1. What this is

A new museum wing exhibiting the bootcamp-era repos (CODAC Berlin, 2022–2023)
as frozen **"HTML faces"**: captured rendered DOM per route, no backends, no
build tooling, hermetically sealed. The wing tells the story that the
translator plaque opens — "missing developer knowledge" in 2019 is the seed;
the Lehrjahre (apprenticeship years) are where that knowledge got learned,
amateurishly, charmingly, in public view for the first time here.

The repos themselves stay **private**. Faces only — no repo links, no source
code, no README copies. What visitors see is what a browser saw, plus the
curator's cards.

## 2. Structure

### 2.1 The hall — `lehrjahre.html` (shell page, editable)

One plaque-style hall page at repo root, styled by `assets/museum.css`
(+ appended `/* lehrjahre */` block), same skeleton as other shell pages
(`wrap → nav.top → plaquehead → sections → doorway → footer`). Zero external
requests (museum shell rule).

- **Plaquehead:** chip `2022 – 2023`, h1 `The Lehrjahre`, host line
  `CODAC Berlin · Full-Stack Web Development` (exact course name to be
  confirmed by user at preview).
- **Opening section:** first-person curator voice (consistent with
  plaques/translator.html). The arc: the 2019 WordPress defeat → enrolling at
  a Berlin bootcamp in 2022 → these repos as the surviving school notebooks.
  Frame honestly: "amateur, naive, sometimes childish attempts" (user's own
  words) — shown with affection, not apology.
- **Catalogue:** one card per repo, **15 cards** (+ sub-cards where one repo
  holds several projects — see 2.3). Card = thumbnail (from the inventory
  shots), title, one-paragraph "what it is / aims at", stack line, a
  "charm note" line (the inventory's best finds: the 🚀 console.logs,
  "OrasiBurasi", `dsfgsdfgs`, "Initial commit, but everything's done :))" …),
  and — for the 6 walkable faces + successful rescues — a door:
  `Enter the exhibit →`. CARD/DEAD repos get no door; their card says why
  (e.g. "backend only — no face was ever built").
- **Ordering:** roughly chronological by first commit, so the hall reads as
  a timeline of learning (vanilla HTML → React → Next.js → full-stack).
- **Doorway back** to the museum landing; footer as on other shell pages.

### 2.2 The faces — `lehrjahre/<slug>/` (frozen artifacts)

Captured exhibits live in one wing folder, one subfolder per face:

| Slug | Repo | Routes to capture |
|---|---|---|
| `gonewiththetailwind/` | GoneWithTheTailwind | `/` (+ mobile menu state as screenshot on card only) |
| `finance-logger/` | Finance_Logger | `/` — served **as-is** (already static; keep its local JS, form stays interactive) |
| `dogsnfilms/` | dogsNfilms-catalog-app | `/`, `/films-catalog`, all 10 film details, `/dogs-catalog`, all 49 dog details |
| `admin-dashboard/` | admin-dashboard-with-next.js-and-sass | `/home`, `/list`, `/single`, `/login`, `/new_user`, `/new_product` (door points at `/home`; `/` boilerplate captured too, linked from card note) |
| `mahalle-v1/` | Fullstack-Community-WebApp | `/`, `/login`, `/register`, `/landingPage` (with its authentic rotated-heading bug), plus one extra capture: home with the "Start a debate" modal open (`index-modal.html`, linked in-page) |
| `mahalle-v2/` | Community-Web-Forum-App-with-Next.js | `/`, `/register`, `/dashboard`, `/addTopic`, `/userProfile`, `/blog`, `/shop`, `/kalendar` (the one-word stubs are exhibits in their own right) |

Rescue attempts (section 3) add `movie-db/` and `portefeuille/` if they
succeed.

**Capture method (all Next/CRA faces):**
1. Run the app locally from a scratch clone (throwaway; never committed here).
2. Playwright-crawl each route, let the page settle (MaHalle v2's `/dashboard`
   needs its ~10 s Mongoose timeout to elapse), snapshot
   `document.documentElement.outerHTML`.
3. Post-process the snapshot into a museum artifact:
   - **Strip all framework/hydration `<script>` tags** — a face is frozen DOM,
     not a running SPA. (Exception: Finance_Logger keeps its own local,
     dependency-free JS; GoneWithTheTailwind keeps its 12-line hamburger
     toggle if it works without the CDN.)
   - **Localize every render asset**: images, fonts, CSS. Google Fonts CSS +
     woffs vendored (translator-exhibit precedent), Tailwind-CDN JIT output
     captured as a static stylesheet, Next `_next/static` CSS copied in,
     Pexels avatars / film posters / carousel images downloaded once.
   - **Authentically dead stays dead**: dogsNfilms' 49 shelter-CDN dog photos
     and Finance_Logger's expired Discord background point at an intentionally
     absent local path with the original URL in `data-original` (blog-exhibit
     precedent). Do not substitute placeholder images.
   - **Rewrite internal links** so routes link to each other as relative
     `.html` files (the "clickable if they have multiple pages" requirement).
   - **All outbound links** → `href="#"` + `data-original` (hermetic seal).
4. Each face's entry page gets a minimal, clearly-curatorial back-link bar to
   `lehrjahre.html` (same pattern the archived exhibits use for returning to
   the museum, styled to not impersonate the original app's chrome).

**Hermetic seal (hard requirement, same as blog exhibits):** each face folder
makes ZERO external requests and contains ZERO live external links. Verify
with the CLAUDE.md recipe: no `http` AND no scheme-relative `//` in
src/href/`url()` (grep both), plus
`performance.getEntriesByType('resource')` all same-host at preview.

**These captures are new artifacts, not recovered originals** — the museum is
allowed to shape them (strip scripts, rewrite links) because the "original"
is a private repo, not a published site. README provenance states this
plainly.

### 2.3 The cards for non-walkable repos

- **React-Hooks-with-TypeScript**, **GraphOL-server-example**,
  **translation-office-ai-assistant**: FACE-grade in the inventory but not in
  the curated 6 — card with 1–2 inventory screenshots, no door. (Keeping the
  wing at 6 doors was the approved curation decision; cards can be promoted
  later.)
- **CA-Projects-**: one card with three sub-entries (Yet Another Company
  Website · the Sprint exercise pile · my-first-react-app + rick-n-morty),
  screenshots included ("Hey, Ercan is learning React! :)))" and the
  broken-search bug shot are mandatory charm). No source is exhibited, so the
  committed NewsAPI key never reaches the museum — but the standing warning
  stays: **user must rotate/scrub it before that repo ever goes public.**
- **mongodb-crud**: card with the crash-overlay shot and the `/addTopic` form
  shot; plaque note about the hardcoded-port bug as period charm.
- **GraphQL-Booklist**: card, no screenshot exists — prose only ("caught
  mid-refactor from require to import; never ran again").
- **ChatGPT-Interface**: card, prose only — "a chat with GPT-3.5 in a
  terminal window; the museum exhibits websites, and this never was one."
- **translation-office-ai-assistant** is dated 2026, not bootcamp era — its
  card sits in a short **"Epilogue"** row at the bottom of the catalogue
  ("the Lehrjahre never really end"), honestly dated. User may cut it at
  preview.

Card thumbnails: copy the needed inventory shots (≈22 of the 46) into
`assets/lehrjahre/`, downscaled to card width (~640 px wide, keep aspect);
originals stay in the git-ignored workspace.

## 3. The two rescue attempts

Both are **attempts** — each has a defined failure fallback, and the attempt
itself becomes plaque copy either way.

### 3.1 movie-db (Firebase crash)

At capture time only, in the scratch clone: give `firebaseConfig.js` a
well-formed dummy config or wrap `getAuth` in try/catch so the SPA mounts.
Capture `/`, `/login`, `/register`, `/about` (+ whatever protected routes do
without auth — likely redirect, capture the landing state). The TMDb fetch
uses the author's own committed key; if it still works, let the popular-movies
grid populate and localize the poster images (key itself never enters the
museum — scripts are stripped anyway). If TMDb fails, capture the starving
state. **Fallback:** card with the blank-white-crash screenshot and the story
of why ("the app that couldn't wake up without its keys").

### 3.2 Developer-Portefeuille (Sanity-fed)

**Gate:** works only if the user's original Sanity project still exists.
First step at execution: ask the user / check via their Sanity tooling for
the project ID + dataset. If found: run with real env vars (capture-time
only, never committed), capture `/` fully fed (blog + testimonials +
the MyAccordion project showcase) and 1–2 `/[slug]` blog posts.
If the project is gone or the user declines: **fallback** — patch the two
`sanityFetch` calls (try/catch → `[]`) in the scratch clone and capture the
static shell: Header + MyAccordion (fully built, local images) + empty
About/Work stubs + footer. Either way this face exists; only its fullness
varies.

**Privacy:** the portfolio footer hardcodes personal contact data (phone,
street-level address, email). Mask phone + postal address with █ blocks in
the captured face, Impressum precedent; marker comment in the HTML, noted in
README provenance. Email treatment decided by user at preview (their gmail is
already public in git history; default = mask it too for consistency).

## 4. Museum integration

- **Landing page (`index.html`):** a new era section after the translator
  era — heading like "The Lehrjahre · 2022 – 2023" — with ONE wing card
  (thumbnail: contact-sheet-style collage or the MaHalle v2 logo shot)
  whose door is `lehrjahre.html`. The wing is one exhibit door on the
  landing; the 15 repos live inside the hall, not on the landing. Museum
  headline count stays "six websites 1999 – 2019" for the recovered-sites
  story; the landing copy introduces the wing as a different kind of
  collection ("not websites — school notebooks").
- **Timeline:** 2–3 new entries (2022 bootcamp begins; 2023 the repo flood /
  MaHalle; 2024 MaHalle v2's last commit "Upgrade dependencies" as the quiet
  end). Exact copy at implementation, same voice as existing entries.
- **Cross-references:** translator plaque already ends on "missing developer
  knowledge" — add one sentence linking forward to the wing. The wing's
  opening links back to `plaques/translator.html`.
- **Nav:** shell pages' `nav.top` gains `The Lehrjahre wing` (placement:
  after the museum link groupings, consistent across pages — exact order
  decided at implementation, matching the shop-link precedent).
- **README:** new top-level section for the wing — what it is, capture
  method, per-face provenance (scripts stripped, assets localized, dead
  images kept dead, PII masked, rescue stories), and the "captures are new
  artifacts" statement.
- **CLAUDE.md:** `lehrjahre/` added to the do-not-modernize list;
  `lehrjahre.html` added to the editable shell list; one line on the wing's
  capture provenance.
- **Wayback:** after user-approved push, SPN-save `lehrjahre.html` + each
  face's entry page.

## 5. Constraints

- **Hermetic seal** on every face folder (§2.2) and zero external requests on
  `lehrjahre.html` (shell rule). External `<a href>` is allowed on the hall
  page only (shell rule), but there are none planned — repos are private.
- **No source code exhibition**: no repo links, no file trees, no README
  copies, no commit SHAs. Commit *messages* quoted on cards are fine (they
  are curatorial quotes, like the plaques' storytelling).
- **No secrets, no PII**: scratch clones and env vars never enter this repo;
  portfolio contact data masked (§3.2); nothing from CA-Projects' source is
  copied.
- **Existing exhibits untouched.** All shell edits (index, nav, README,
  CLAUDE.md) follow existing patterns.
- Simple commit messages, no Claude signature. Push only on user go-ahead.
- **User preview gate before push** (established flow): user walks the hall
  and faces locally, corrects card copy/charm notes, rules on the epilogue
  card and the email masking.

## 6. Verification

- Per face: serve on 8765, playwright walk every captured route — zero
  console errors beyond intentionally-dead images/favicon; resource-entries
  check same-host only; grep seal check (`http` and `//`) per face folder.
- Hall: desktop + mobile screenshots; every door resolves; every card
  thumbnail loads; nav wrap OK at 390 px.
- Links: no `.html` 404s (crawl the wing with a link checker over the local
  server).
- After push: Pages build `built`, live spot-checks, SPN saves.

## 7. Out of scope

- Running/seeding MongoDB for fed MaHalle captures (empty-state forums are
  the authentic capture; revisit only if the user asks).
- Promoting React-Hooks / GraphOL / CA-Projects sub-projects to walkable
  faces (cards note they could be).
- The Astro shell rebuild (parked, unchanged).
- Any change to the repos themselves (they stay private and untouched; all
  patches happen in throwaway scratch clones).
