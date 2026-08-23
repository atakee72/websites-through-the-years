# ercan-atak.de — the translator-website years (2015–2019): exhibit design

**Status:** approved in brainstorm 2026-08-23/24 (user-vetted, three corrections
incorporated). Precedes the Lehrjahre wing (approved concept "A", spec to follow
separately).

## What this adds

A sixth main exhibit for the museum: the author's translator/interpreter
website at **ercan-atak.de**, recovered from the Wayback Machine in its two
One.com Web Editor incarnations, presented under one plaque with two doors.
This fills the museum's 2013–2021 "silence" — the blogs went quiet because the
translation office's website opened.

## The story (plaque source material — user-vetted facts)

- **v1, 2015** (anchor capture `20151220181045`): One.com Web Editor site,
  German, with the author's face photo on the landing page. Sub-pages existed
  and were partially captured 2015–2017 (`leistungen.html`, `kontakt.html`,
  `impressum.html`, `blog.html`, `Kundenrezensionen.html`,
  `gesellschaftliches engagement.html`). Some links were dummies without
  content — preserved dead, as found. **The curator prefers v1's style** —
  this is wall text, not a license to restyle anything.
- **v2, 2019** (anchor capture `20191024230042`): same One.com platform,
  content completed (Impressum etc.).
- **The third life (NOT recovered):** in Nov/Dec 2019 a WordPress 5.3 +
  Divi + WooCommerce install replaced the builder site — a template experiment
  the author "couldn't use properly due to missing developer knowledge at that
  time" (the sentence that foreshadows the 2022 bootcamp). Its test posts —
  including portrait posts naming real people, and imported theme demo content
  (2014–15 travel posts) — still haunt the archive. This version stood watch
  until the site **ended silently in 2023**. It gets one wry plaque paragraph;
  none of it is recovered, and **no model-portrait content is republished**.
- **Afterlife:** the domain came back to the author and now hosts the
  developer portfolio (ercan-atak.de today). And crucially: **the author is
  still a translator and interpreter** — it's one of his jobs; only the
  website retired. Plaque line to the effect of: the only exhibit whose
  business is still open — it just doesn't have a website anymore.

## Recovery

- Method: the museum's established Wayback workflow (rescue-kit pattern):
  CDX prefix listing (`url=ercan-atak.de*`, statuscode 200, collapse urlkey —
  ~207 unique URLs total, most belonging to the excluded WP phase), raw
  fetches with `id_`, nearest capture per URL, ~1 req/s with backoff,
  resumable.
- **Version separation is the crawl's core problem.** One domain, three
  lives. Discriminators, applied per fetched file (not per URL guess):
  - v1/v2 (keep): One.com sites — `generator" content="One.com Web Editor"`,
    assets under `onewebstatic/` / `onewebmedia/`; v1 URLs are
    `http://ercan-atak.de/*.html` page files; v2 is the same platform at the
    2019-10 anchor.
  - WP phase (exclude): anything with `wp-content`/`wp-includes`/WP
    generator meta — directory-style URLs (`/about/`, `/category/...`,
    `/2019/12/...` etc.) are all WP-era.
  - v1 vs v2 split: crawl each from its anchor timestamp; a URL claimed by
    both versions goes to the version whose capture date is nearest that
    exhibit's anchor. Document any judgment calls in provenance.
- Folders: `ercan-atak-2015/` and `ercan-atak-2019/` at repo root, sibling
  to the other exhibits. Internal links rewritten only as far as the other
  exhibits' were (relative, working locally); dead/dummy links stay dead.
- Assets: One.com CSS/JS/images from their captures; never re-encoded
  (`.gitattributes` `* -text` applies). HTML transcoded to UTF-8 once, like
  every exhibit (GitHub Pages charset header), original bytes in git history.
- Stripping: Wayback chrome only, plus any One.com-injected tracking
  (document exact diff in provenance, per museum rules). Authored content
  untouched. External `<a href>` links stay as-is (archived-exhibit
  precedent; the hermetic seal applies to the blog exhibits, not these).
  External **asset requests** (if the One.com pages call home for fonts/JS)
  are localized from captures — same as every recovered exhibit.

## Museum integration

- `plaques/translator.html`: one plaque, existing plaque template — story,
  era ("2015: every tradesperson needs a website; website builders promise
  you won't need a developer"), what was restored, sources (both anchor
  captures + repo), and **two doorways**: "Enter v1 (2015)" and
  "Enter v2 (2019)".
- `index.html`: one new exhibit card (after the blogs, before Lost & found),
  IE-window frame + era screenshot in `assets/`; timeline entries: 2015
  (site opens), 2019 (v2; the Divi experiment begins), 2023 (the domain goes
  dark silently), plus the existing 2026 entries untouched.
- `README.md`: new "### 6." section with provenance/restoration notes;
  "five websites" phrasing updated museum-wide (README intro, index.html
  curator copy, CLAUDE.md project description).
- Curation-layer counts/copy that say "five sites" checked and updated.
- Wayback-save the new/changed museum pages after push, per routine.

## Constraints

- All standing museum rules: authenticity (no modernizing), no re-encoding,
  simple commit messages without Claude signature, push only on user's
  go-ahead, secrets never staged.
- No content from the WP phase enters the repo — re-verify before commit:
  `grep -ril 'wp-content' ercan-atak-2015/ ercan-atak-2019/` must be empty.
- User previews and corrects plaque text + facts before push (correction
  round, as with links page and shop).

## Verification

- Both exhibits browsable locally (python3 -m http.server 8765): landing
  page of each renders with images/styles; sub-pages reachable where
  captured; playwright screenshot + console pass.
- `grep` checks: no `wp-content`; umlauts intact (site is German —
  `Übersetzung`, `ß` spot-checks); no Wayback toolbar remnants
  (`web.archive.org` refs only where an original link genuinely pointed
  there — expected: none).
- After push: Pages build green, both exhibit indexes 200 live.

## Out of scope

- The Lehrjahre wing (separate spec; its timeline/plaque will reference this
  exhibit as the bootcamp's prequel — "missing developer knowledge").
- Any recovery of the WordPress phase.
- Changes to the live portfolio or hub.
