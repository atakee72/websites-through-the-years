# Deeper curation: plaques, restoration lab, timeline

**Date:** 2026-07-12 · **Status:** approved by user (design dialogue in session)
**Scope:** sub-project B of the museum-extension program (B → C → D → A).

## Goal

Surface the curation that today lives only in README/git history: give each
exhibit a curator plaque, tell the recovery story on a restoration-lab page,
and connect the eras with a timeline on the landing page.

## Constraints (inherited, non-negotiable)

- Archived site folders are untouched. Only the museum shell changes.
- No build step, no external dependencies. Shell pages make **zero external
  requests** (external *links* to GitHub/archive.org/Blogger are fine —
  the hermetic-seal invariant covers the blog exhibit folders, not the shell).
- Simple commit messages, no Claude signature.

## New files

| File | Purpose |
|---|---|
| `plaques/fortunecity.html` | plaque: @t@kee's homepage (1999–2004) |
| `plaques/dtm.html` | plaque: Türkiye–EU / Foreign Trade (2001–2002) |
| `plaques/tbmm.html` | plaque: TBMM Joint Parliamentary Committee (2004–2006) |
| `plaques/thoughtful-thoughts.html` | plaque: Thoughtful thoughts blog (2010–2011) |
| `plaques/atakees-blog.html` | plaque: @t@kee's blog (2008–2013) |
| `restoration-lab.html` | the archaeology story, one narrative page |
| `assets/museum.css` | shared stylesheet for the six new pages |

`index.html` keeps its inline CSS (unchanged aesthetic); `museum.css`
lifts the same palette/typography for the new pages. Known accepted risk:
palette duplication until the (deferred) Astro rebuild unifies it.

## Plaque structure (each ~1 screen)

1. Title + years + host (e.g. "members.fortunecity.com/atakee1")
2. Era screenshot (reuse existing `assets/*.png`)
3. **The story** — why/how it was built (drafted by Claude from README, git
   history and session knowledge; user enriches/corrects before publish)
4. **Era context** — what the web looked like then
5. **What was restored** — 2–3 lines, link to the restoration lab for detail
6. **Sources** — link to the original Wayback capture / live Blogger original
7. **Enter exhibit →** button (the plaque is the door)
8. Back-to-museum link

Landing cards change from linking directly into exhibits to linking to the
plaque (option chosen: card → plaque only; the plaque's button enters the
exhibit).

## Restoration lab (`restoration-lab.html`)

Five chapters, narrative tone:

1. **Wayback recovery method** — CDX API, `id_` raw fetches,
   anchor-timestamp crawling, politeness/backoff.
2. **The junk gallery** — the FortuneCity-injected ad/tracking code shown
   as a specimen, before/after. **Safety rule: all snippets rendered as
   escaped text in `<pre>` blocks, never live markup; tracker URLs are
   inert strings.**
3. **The charset surgery** — GitHub Pages' forced `charset=utf-8` header
   vs windows-1254/iso-8859-9 originals; transcode-once rule.
4. **The live Blogger rescue** — crawl of a living blog, the hermetic seal
   (zero external requests/links), dead image-proxy story, sidebar revival.
5. **Verify it yourself** — permalinks (full-SHA GitHub URLs) to the actual
   commits/diffs.

## Timeline (landing page section)

Between the exhibits and the curator's note: 1999 homepage → 2001 DTM →
2004 TBMM → 2008 & 2010 blogs → 2013 last post → 2026 museum opens. Each
dot links to its plaque. A few gray web-history flavor markers (Google
founded, FortuneCity dies, Blogger acquired…). Vertical layout on mobile;
respect the known `min-width: 0` grid-overflow gotcha.

## Implementation notes

- Five plaques are independent → drafted by parallel subagents; shared CSS,
  timeline, lab, and integration done in the main session.
- **Review gate:** plaques carry biographical claims — user reads drafts on
  local preview (`python3 -m http.server 8765`) before anything is pushed.
- Docs: README gains a section on plaques/lab/timeline; CLAUDE.md's
  freely-editable list grows to `plaques/`, `restoration-lab.html`,
  `assets/museum.css`.

## Testing

Playwright pass on all new/changed pages: console clean; desktop + mobile
screenshots; all links resolve (plaque → exhibit, plaque → lab, timeline →
plaque, back-links); `performance.getEntriesByType('resource')` shows
same-host requests only.

## Out of scope

Guestbook and other interactivity (sub-project C), archive-the-archive and
open-sourcing the crawler (D), new-exhibit hunt (A), Astro rebuild (E,
deferred).
