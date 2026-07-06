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

### 2. Türkiye–EU Relations, Undersecretariat of Foreign Trade (~2001–2002)

`dtm-ab-2002/` — the EU affairs section of `www.dtm.gov.tr/AB/`, built with
Microsoft FrontPage 4.0 (Turkish, windows-1254). Legal texts of Türkiye–EU
relations, free trade agreements, customs union, trade statistics.
[Archived capture](https://web.archive.org/web/20020212141252/http://www.dtm.gov.tr/AB/AB.htm)

**Provenance / restoration notes**

- 161 files crawled from the Wayback Machine, anchored to the 12 Feb 2002
  capture; each file comes from its nearest-dated snapshot (mostly 2001–2002).
- No cleanup was needed — the government server injected nothing.
- Small repairs: six shared template graphics (`baslik.gif`, `vertical.jpg`,
  `logo_anasayfa.gif`…) were never archived under `/AB/` and were recovered
  from identical copies in sibling sections (`/ead/ADRES/`, `/Dts/ABTeknik/`,
  `/GIF/`); `çektartav.htm` was renamed to `cektartav.htm` (ASCII-safe);
  `AB.htm`'s FrontPage `dynAnimation()` onload is wrapped in try/catch (it
  requires IE4-era `document.all`).
- Permanently lost: `AB Sayfasi/euro1.htm` (never archived). Period-authentic
  quirk preserved: `akctweb/ihracat.htm` references an image at `file:/H:/`.

## Planned

- possibly 1 more recovered site
- A landing page tying the eras together
