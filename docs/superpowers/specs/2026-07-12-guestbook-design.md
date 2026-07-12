# Guestbook & period-authentic touches

**Date:** 2026-07-12 · **Status:** approved by user (design + audit amendments in session)
**Scope:** sub-project C of the museum-extension program (B done → **C** → D → A).

## Goal

Give the museum a 1999-style guestbook (webmaster-moderated, static) plus
three period-authentic touches on the landing page: a hit counter continuing
the exhibit's story, an 88×31 badge row, and a once-only dial-up gag on the
guestbook page.

## Constraints (inherited, non-negotiable)

- Archived exhibit folders and `backups/` untouched.
- Shell pages make **zero external requests** (links out are fine).
- No build step; hand-written HTML/CSS/vanilla JS only.
- Simple commit messages, no Claude signature/footer. No push until the
  user has reviewed the guestbook page locally (review gate).

## New / changed files

| File | Purpose |
|---|---|
| `guestbook.html` | the guestbook (root; styled by `assets/museum.css`) |
| `.github/ISSUE_TEMPLATE/guestbook.yml` | structured "sign the guestbook" issue form (fields: name, location optional, message; label `guestbook`) |
| `assets/badges/*.svg` | four hand-drawn 88×31 badges |
| `assets/museum.css` | append guestbook/entry/badge/counter/dial-up styles |
| `index.html` | footer: hit counter + badge row + guestbook link; timeline 2026 line gains "…and the guestbook reopens." |
| `README.md` | "Guestbook" section incl. moderation workflow |
| `CLAUDE.md` | editable-shell list grows: `guestbook.html`, `assets/badges/`, `.github/` |

## Guestbook page

- Plaque-style header: "The guestbook — sign like it's 1999".
- Entries are static HTML blocks baked in by the webmaster: №, name,
  location, date, message. Seed entry №001 by the curator.
- **Sign section**, two doors:
  - GitHub: link to
    `https://github.com/atakee72/websites-through-the-years/issues/new?template=guestbook.yml`
    (URL-prefill and issue forms don't compose — the template link IS the
    prefill).
  - Email: **JS-assembled mailto** — the address never appears as one string
    in the source; a click handler concatenates the parts and sets
    `location.href` (`'atakee' + '@' + 'gmail.com'`, subject "Guestbook
    entry"). Anti-harvester, zero external requests, no visible change for
    humans.
- A short note tells visitors entries appear "after the webmaster reviews
  them — as was always the way."

### Moderation workflow (documented in README)

New issue with label `guestbook` (or email) → curator copies fields into a
new entry block in `guestbook.html`, **HTML-escaping the message text**
(`<` `>` `&` `"`) — visitor text is the only untrusted input this museum
ever accepts — commits, closes the issue with a thank-you.

## Hit counter (landing footer)

- "You are visitor №" + odometer-styled digits (black box, light digits).
- localStorage replica, exactly the exhibit-counter approach; **seeded at
  18 735 — continuing where the 1999 homepage's counter left off** (that
  counter's replica is seeded 18 734).
- Honesty wink: `title="localStorage replica — the original counter service
  died in 2005"`.
- Inline JS in index.html (a few lines; no shared file, no requests).

## Badge row (landing footer)

Four 88×31 SVGs in `assets/badges/`, local, decorative, alt-texted:
1. "Best viewed with ANY browser"
2. "Made with FrontPage" (struck through) / "restored by hand"
3. "UTF-8 inside"
4. "ARCHIVED 4-EVER"
System monospace fonts inside the SVGs (no font files). Footer lays counter,
badges and guestbook link out with flex-wrap; must be clean at 375 px.

## Dial-up gag (guestbook page only)

- Full-page black overlay on first visit: "CONNECTING TO GUESTBOOK.EXE …
  56,000 bps", fake handshake progress bar, ~4 s, then reveals the page.
- Skippable by click anywhere **and Escape**; `prefers-reduced-motion`
  visitors never see it; `localStorage` flag (`gb-dialup-done`) makes it
  once per visitor, ever.
- Visual only — no audio (autoplay is blocked anyway).

## Out of scope

D (archive-the-archive, open-source crawler), A (Wayback hunt), E (Astro
rebuild). Any change to archived exhibit folders.

## Testing

Playwright pass: counter increments across reloads and shows ≥18 735;
badges render; guestbook links (issue-form URL correct, mailto assembles on
click — assert `location.href` change intercepted or handler present);
dial-up plays once, skip via click and Escape works, never replays after
localStorage flag, absent under reduced motion; zero external resource
entries on `/` and `/guestbook.html`; 375 px clean; console clean.
