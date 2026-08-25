# websites through the years

My personal websites from 1999 to 2019 — four recovered from the
[Wayback Machine](https://web.archive.org), two Blogger blogs rescued alive,
and one page found in the rubble — preserved as they were built:
`<font>` tags, hit counter, guestbook and all.

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
- Later touch-ups (2026-08-08, user-requested): the @t@kee's-blog theme's
  "home" nav link — which originally pointed at gmail.com, of all places
  (preserved in `data-original`) — was re-pointed at the exhibit's own
  index so visitors can navigate back. A sweep for scheme-relative URLs
  (`//host/…`), which the original sealing greps missed, then closed the
  last leaks in both blogs: a live `//www.blogger.com/home` link and, on
  *Thoughtful thoughts*, Blogger-logo comment avatars plus two 2010 embed
  players (YouTube, a ZDF stream) — all disabled with originals kept in
  `data-original`, and a dozen half-rewritten `../..///host/…` artifacts
  normalized to the intentionally-absent local path. Both exhibits again
  verify: zero live external references.
- Some embedded images had already been lost by Blogger's own image proxy
  while the blogs were live (the proxy 404s even on the originals). Their
  references now point at an intentionally absent local path — still shown as
  broken (authentic), but without the dozens of slow round-trips to Google
  that made pages crawl.

### 6. ercan-atak.de — the translator years (~2015–2019)

`ercan-atak-2015/` and `ercan-atak-2019/` — the author's translator and
interpreter website in its two One.com Web Editor incarnations: version one
(2015; face photo, services, customer reviews, a few dummy links that never
led anywhere) and version two (2019; content completed, Impressum and all).
One plaque, two doors. The site's third life — a WordPress/Divi template the
author couldn't tame, whose test posts haunt the archive until the domain went
dark in 2023 — is deliberately not recovered.
[v1 capture](https://web.archive.org/web/20151220181045/http://www.ercan-atak.de/) ·
[v2 capture](https://web.archive.org/web/20191024230042/https://www.ercan-atak.de/)

**Provenance / restoration notes**

- Both versions were crawled from the Wayback Machine with the recovery kit,
  rooted at the bare domain (`http://ercan-atak.de/`, not the `www.` anchor
  URL literally) — the site's own internal links are host-bare and
  scheme-relative, and the crawler treats `www.` and bare as different hosts.
  v1 is anchored to its nearest capture around 20 Dec 2015, v2 around
  24 Oct 2019; gaps the crawler missed or stalled on were closed with a
  CDX-nearest-timestamp helper.
- **Despite the `ercan-atak-2019/` folder name, its recovered content is not
  a 2019 redesign.** Direct Wayback CDX queries (across every scheme/`www.`
  host variant) show the front page and all eight subpages plus the blog
  page share one underlying snapshot: the front page kept getting
  re-crawled by Wayback for years (letting it land a near-anchor Dec 2019
  capture), while every subpage's last-ever capture is 25–26 Oct 2016 — no
  2017, 2018 or 2019 capture of them exists anywhere in the archive. A
  byte-diff confirms the front page's content (hero, nav, an Airbnb listing
  widget, Google Fonts links) was already present in the 2016 captures. So
  the whole v2 exhibit is effectively frozen at ~2016 content; the
  ~3-year timestamp spread reflects Wayback's capture cadence, not a design
  change. The real content difference from v1 (Dec 2015) — mainly the
  Airbnb widget — dates from a genuine site update sometime in 2016.
- Both versions' internal links (scheme-relative `//ercan-atak.de/...` and a
  handful of absolute `http(s)://[www.]ercan-atak.de/...` forms, plus CSS
  `url()` references) were rewritten to relative paths for local
  browsability. v1's rewrite left a self-inflicted doubled-path bug in its
  CSS (`url()` values resolving to `onewebstatic/onewebstatic/...`, since
  the CSS files themselves live inside `onewebstatic/`); caught via a
  playwright console 404 and fixed with a follow-up sed. v2's surgery
  applied that same fix proactively, so it never hit the bug.
- The href-rewrite sed for v1 also touched one `data-href=""` attribute
  on the dead Facebook share-button widget, as a harmless substring-match
  side effect (it was already non-functional, and emptying it matches how
  the page treats other dead widgets elsewhere); the adjacent emptied
  attribute is a plain `href=""` on a `g:plus` element, not another
  `data-href`. v2's markup had no such attributes, so nothing was touched
  there.
- v2's `Kundenrezensionen.html` references a customer's logo (the taxi.eu
  app) the crawler saved under an invented, hash-suffixed `.html` filename
  (its own query-string-hashing convention for
  `onewebmedia/taxi.png?etag=...`) even though the bytes are a valid PNG.
  Renamed to `onewebmedia/taxi.png` (bytes untouched) and the one `<img>`
  reference repointed, so it renders instead of serving with the wrong
  content type.
- v1 permanently lost 26 assets — a mix of stylesheets, JS widgets and a
  handful of review/portrait images (e.g. `onewebstatic/f2c24eaaca.css`,
  `onewebstatic/9573d5b448-caglar.jpeg`) — confirmed by repeated CDX lookups
  to have no Wayback capture anywhere, not a fetch or rate-limit artifact.
  Their references are left broken in the HTML/CSS, the authentic look for
  a lost asset. v2 had zero permanent losses: every one of its 43
  referenced assets was recovered.
- No WordPress-era content was recovered (verified: no `wp-content`
  references in either folder).
- Curator's redaction (2026, at the author's request): both Impressum
  pages carried the office's tax number, VAT-ID, bank details (BLZ,
  account number, IBAN, BIC), phone numbers and the street address (v1) /
  PO box (v2). These values are masked with █ blocks — layout untouched,
  the redaction visible as such. The originals remain in the Wayback
  captures the plaque links to; the museum simply declines to republish
  them.
- Layout repair on v2's front page (2026, at the author's request): the
  Lichtenberg quote block was positioned by the site builder so that it
  overlapped the closing paragraphs — already so in the Wayback Machine's
  own rendering of the original. Its `top` offset was shifted 140px down
  so quote and attribution sit below the contact strip. Nothing else moved.
- The author's portrait on v1 (index and *zur person*) is displayed with
  drag and text-selection disabled, and those two pages suppress the
  right-click menu entirely (2026, at the author's request) — a
  deterrent, not a lock; the pages' look is unchanged.
- Both exhibits made live external requests at crawl time that a later
  review caught and closed. Google Fonts stylesheets (Quantico, Averia
  Serif Libre, Varela Round, Rokkitt, and — front pages only — Fasthand)
  were genuinely localized: each distinct `fonts.googleapis.com` CSS URL
  was fetched from its nearest Wayback capture into `onewebfonts/`, along
  with every `fonts.gstatic.com` woff2/ttf file the CSS referenced;
  v2's one Airbnb listing photo (`a2.muscache.com`) was recovered the same
  way into `onewebmedia/`. Zero font or image losses in either folder —
  every referenced file was found on a retry after transient fetch
  failures. Separately, dead or now-unrelated third-party service
  scripts — the Zopim live-chat bootstrap, Facebook/Google+/Twitter/
  LinkedIn social-button SDKs, v2's Airbnb embed SDK, and v1's
  phrasen.com phrase-of-the-day and 24timezones.com clock widgets — were
  neutralized rather than resurrected: their `<script src>` now points at
  an intentionally absent `onewebstatic/lost-external-service.js` (the
  absence is the point, matching the blog exhibits' dead-Blogger-proxy
  convention), with the real URL preserved in `data-original`; the
  inline Zopim bootstrap keeps its code byte-identical apart from that
  one URL swap, flagged with a preceding HTML comment. One inert leftover:
  v1's 24timezones clock widget also embeds its SWF URL as a plain string
  inside inline JavaScript (`new SWFObject("http://24timezones.com/...")`),
  which isn't a `src=`/`href=`/`url()` attribute and so isn't a live
  request — the `SWFObject` constructor it calls is defined only by the
  now-neutralized `swfobject.js`, so this code throws and never runs.
  Left as-is, same authentic-breakage spirit as the rest of the widget.

## Lost & found

### Cinderellas Fotoalbum (GeoCities, ~2001–2002)

`geocities-cindy-2002/` — a single-page found object: a photo album built
with Yahoo! PageBuilder under the author's GeoCities account
(`geocities.com/atakee`), written in German and speaking in its subject's
voice — "this homepage was made by one of my many admirers :))".
Rediscovered in 2026 during a Wayback Machine sweep of the author's old
handles; the author has no memory of making it.
[Archived capture](https://web.archive.org/web/20020110013051/http://geocities.com/atakee/cindy.html)

**Provenance / restoration notes**

- Recovered from the archive's only capture of the page (10 Jan 2002).
- Restorations: the shared GeoCities template assets (the
  `aboutme_country_bg2.gif` background and the `c.gif` PageBuilder spacer)
  were never captured with the page and were recovered from the archive's
  separate captures of `geocities.com/clipart/`; Yahoo's server-injected
  tracking block — which the server itself labeled "PLEASE REMOVE" — was
  stripped.
- Permanently lost: the photo (`cindy_4.jpg`) and the album itself
  (`page2.html`, "Mein Fotoalbum") were never archived. The empty photo
  frame and the dead links are preserved as captured.

## Backups

`backups/` — Google Takeout exports of both blogs (Atom post feeds, themes,
settings): the lossless canonical source alongside the crawled copies.
Account-level personal data was excluded and two secrets (the mail-to-Blogger
posting address and the admin email) redacted before publishing.

## Curation layer

- `plaques/` — a curator's plaque per exhibit (story, era context, what was
  restored, sources). Landing cards lead to the plaque; the plaque's
  "Enter the exhibit" button is the door to the site itself.
- `restoration-lab.html` — the recovery narrated: Wayback archaeology, the
  stripped host-injected junk shown as an inert specimen, the UTF-8
  transcoding, the live Blogger rescue, and permalinks to the load-bearing
  commits. All historical code on this page is HTML-escaped display text.
- A timeline on the landing page connects the exhibits (1998–2026).
- `links.html` — the links page every homepage had, pointing outward:
  Wayback captures of the sites the curator remembers visiting (Warwick,
  Ankara & Berlin, 1998–2007) and the famous classics, plus the handful
  that are still alive at their original addresses.
- `shop.html` — the museum's gift shop: fully stocked since 1999, never
  open. All prices in Deutsche Mark, orders by fax only; the fax was
  unplugged in 2003. Nothing is for sale — the shop is itself an exhibit.
- The recovery crawlers are published as
  [website-rescue-kit](https://github.com/atakee72/website-rescue-kit).

## Guestbook

`guestbook.html` — a 1999-style guestbook, moderated like it's 1999:
entries are static HTML baked in by the webmaster. Visitors sign via a
GitHub issue form (`.github/ISSUE_TEMPLATE/guestbook.yml`, label
`guestbook`) or an email link (assembled by JS on click, so the address
can't be harvested from the source). Baking an entry: copy
name/location/message into a new `.gb-entry` block — **HTML-escape the
message text** (`&`, `<`, `>`, `"`); visitor text is the only untrusted
input in this museum — commit, close the issue with a thank-you. First-time
visitors get a fake 56k handshake (once ever, skippable, absent under
reduced motion). The landing footer's visitor counter is a localStorage
replica seeded at 18 735 — continuing where the 1999 homepage's counter
left off.

## Landing page

`index.html` — a hand-written, dependency-free page (inline CSS, no build step)
presenting the six sites in IE-window frames with era screenshots
(`assets/`), a timeline connecting the eras, and links to each exhibit's curator
plaque. It includes a **curator's note** explaining what visitors will
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

The domain root, [atakee72.github.io](https://atakee72.github.io/), is a small
hub linking the author's [portfolio](https://ercan-atak.de) and this museum.
