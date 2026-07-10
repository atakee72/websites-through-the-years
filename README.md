# websites through the years

My personal websites from the early web era (1999–2006), recovered from the
[Wayback Machine](https://web.archive.org) and preserved as they were built —
`<font>` tags, hit counter, guestbook link and all.

## Sites

### 1. @t@kee's homepage (FortuneCity, ~1999–2004)

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
- The Moreover.com news-headlines widget (also long dead) was revived in its
  original look, now fed by Wikipedia's "In the news" feed; the feed content is
  sanitized before insertion (text and wiki links only).
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
- Author's restorations on `AB.htm` (the capture post-dates my leave, so a few
  things were put back the way I had them): my original webmaster contact info,
  the gray `#DEDEDE` page background, the full-width main table, and the hidden
  easter-egg link over Üsküdar on the EU map — which now points to my
  resurrected FortuneCity homepage.

### 3. Türkiye–EU Joint Parliamentary Committee, TBMM (~2004–2006)

`tbmm-kpk-2006/` — the Turkey–EU Joint Parliamentary Committee (Karma
Parlamento Komisyonu) site on `www.tbmm.gov.tr/ul_kom/kpk/`, built with
Microsoft FrontPage 3.0 (Turkish, iso-8859-9), with English, German and French
pages. Includes an archive of 33 Word documents and a PDF: joint declarations,
press releases and meeting programmes of the committee.
[Archived capture](https://web.archive.org/web/20061227002006/http://www.tbmm.gov.tr/ul_kom/kpk/index.htm)

**Provenance / restoration notes**

- 50 files crawled from the Wayback Machine, anchored to the 27 Dec 2006
  capture; each file from its nearest-dated snapshot.
- Nothing was cleaned or repaired — no injected code, no broken references,
  no missing files. The only touch-up was retrying one PDF the archive served
  truncated on first attempt.

### 4. Thoughtful thoughts (Blogger, ~2010–2011)

`thoughtful-thoughts-2011/` — the blog that continued the *thoughtful thoughts*
section of the 1999 homepage: essays in Turkish, English and German on
`atakee.blogspot.com`. [Live original](https://atakee.blogspot.com/)

### 5. @t@kee's blog (Blogger, ~2008–2013)

`atakees-blog-2013/` — the personal notebook of the blog years, six posts on
`tbb-wissenschaftsforum.blogspot.com` (an address named for a forum that never
came to be). [Live original](https://tbb-wissenschaftsforum.blogspot.com/)

**Provenance / rescue notes (both blogs)**

- Unlike sites 1–3 these were rescued *alive*: crawled directly from Blogger
  (not the Wayback Machine), so every post is captured at full fidelity —
  including the complete archive structure (year/month pages, all label/tag
  pages, and the "older posts" pagination chains, saved under `paged/`).
- Made hermetically self-contained — **zero external requests, zero external
  links**: all images, template assets, theme backgrounds and web fonts
  (Damion, Roboto) were downloaded from Google's CDNs into local
  `blog-assets/` folders and every reference rewritten (including `srcset`,
  CSS `url()` — some backslash-escaped or protocol-relative — `og:url`/canonical
  metas and the favicon). Blogger's JS-injected chrome was stripped; its
  share/edit/email/comment links and all outbound content links are disabled
  (`href="#"`), with every original URL preserved in a `data-original`
  attribute.
- The theme's sidebar drawer on *Thoughtful thoughts* (hamburger menu:
  archive tree, labels, report-abuse) was re-wired with a small local script —
  its original Blogger JS was stripped with the rest. Sections render fully
  expanded; the now-purposeless "show more" pills are hidden.
- Some embedded images had already been lost by Blogger's own image proxy
  while the blogs were live (the proxy 404s even on the originals). Their
  references now point at an intentionally absent local path — still shown as
  broken (authentic), but without the dozens of slow round-trips to Google
  that made pages crawl.

## Backups

`backups/` — Google Takeout exports of both blogs (Atom post feeds, themes,
settings): the lossless canonical source alongside the crawled copies.
Account-level personal data was excluded and two secrets (the mail-to-Blogger
posting address and the admin email) redacted before publishing.

## Landing page

`index.html` — a hand-written, dependency-free page (inline CSS, no build step)
presenting the three sites in IE-window frames with era screenshots
(`assets/`). It includes a **curator's note** explaining what visitors will
encounter: fixed-width non-responsive layouts, permanently lost images, dead
outbound links, IE-era assumptions — all deliberately preserved. The archived
pages themselves have no viewport meta, so phones render them zoomed-out
(pinch-to-zoom), which is both authentic and the best available behaviour.

## Hosting note

The HTML was transcoded from its original encodings (iso-8859-1,
windows-1254, iso-8859-9) to UTF-8, because GitHub Pages serves all HTML
with a `charset=utf-8` header that overrides in-page meta tags. The
original bytes are preserved in git history.

## Live

The whole museum is served with GitHub Pages:
https://atakee72.github.io/websites-through-the-years/
