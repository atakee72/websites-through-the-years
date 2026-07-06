# websites through the years

My personal websites from the early web era, recovered from the
[Wayback Machine](https://web.archive.org) and preserved as they were built —
`<font>` tags, hit counter, guestbook link and all.

## Sites

### 1. @t@kee's homepage (FortuneCity, ~2000–2004)

`atakee-fortunecity-2004/` — my personal homepage hosted on
`members.fortunecity.com/atakee1/`, built with Microsoft FrontPage Express 2.0.
Rainbow lettering, a picture gallery, a CV, pages about Turkey, travel photos
and baklava. [Archived capture](https://web.archive.org/web/20040130074500/http://members.fortunecity.com/atakee1/)

**Provenance / restoration notes**

- All 59 files (30 pages + 29 images) were recovered from the Wayback Machine
  using raw captures (`id_` flag), taken between 2004 and 2012.
- FortuneCity-injected ad/tracking scripts, navbars and footers (plus later
  Google Analytics / ZEDO snippets) were stripped — see the git history for the
  exact diff. The authored content is untouched.
- The original stepzilla.com hit counter died with its service (~2005); it was
  rebuilt as a localStorage replica in the same spot, seeded near the 2004 figure.
- Two period-authentic quirks are preserved: `mummy&daddy.htm` references an
  image at `C:\My Documents\…` (broken since day one — FrontPage kept my local
  path), and `me&javier.jpg` was never captured by the archive.

**View locally**

```bash
python3 -m http.server 8765
# → http://localhost:8765/atakee-fortunecity-2004/index.htm
```

## Planned

- 1–2 more recovered sites
- A landing page tying the eras together
