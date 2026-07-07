# websites-through-the-years (eski-web-sayfalarim)

A digital museum: three websites the user built between 2000 and 2006,
recovered from the Wayback Machine and served on GitHub Pages.
Live: https://atakee72.github.io/websites-through-the-years/
Repo: github.com/atakee72/websites-through-the-years (public)

## Prime directive: authenticity

The archived sites (`atakee-fortunecity-2004/`, `dtm-ab-2002/`,
`tbmm-kpk-2006/`) are historical artifacts. Do NOT modernize, reformat,
lint, or "fix" them unless the user explicitly asks. Broken images, dead
links, `<font>` tags, IE-era markup are features, not bugs — the landing
page's curator's note explains this to visitors. The only modern, freely
editable file is `index.html` (landing page, hand-written, no build step)
plus `assets/`.

## Rules

- **Never re-encode or normalize archived files.** `.gitattributes` sets
  `* -text` on purpose. HTML was deliberately transcoded to UTF-8 once
  (GitHub Pages forces a `charset=utf-8` header that overrides meta tags);
  original bytes live in git history.
- Filenames may contain spaces (`AB Sayfasi/`) and `&` (`mummy&daddy.htm`).
  Always URL-encode when testing; never rename.
- Commits: simple messages, no Claude signature/footer (user preference).
- Any edit to archived pages must be user-requested and documented in
  README's "Provenance / restoration notes" for that site.

## Testing

- Serve locally: `python3 -m http.server 8765` from repo root (note: sends
  no charset header, unlike GitHub Pages — charset bugs can hide locally).
- Browser checks: `playwright-cli` (config in `.playwright/cli.config.json`,
  uses bundled chromium — the default chrome channel is not installed).
  Check console errors and screenshots after changes; close when done.
- GitHub Pages build: `gh api repos/atakee72/websites-through-the-years/pages/builds/latest --jq .status`
  (first build after enabling can error transiently; it retries).

## Recovery tooling (scratchpad from original session; recreate if needed)

- Wayback CDX list: `https://web.archive.org/cdx/search/cdx?url=<prefix>*&collapse=urlkey&fl=original,timestamp,statuscode&filter=statuscode:200`
- Raw file fetch: `https://web.archive.org/web/<ts>id_/<original-url>`
  (`id_` = no Wayback rewriting). Rate-limit ~1 req/s; retry with backoff —
  archive.org drops connections when hammered.
- Crawler pattern: start from an anchor capture, follow internal links,
  Wayback serves nearest capture per URL. Make it resumable (skip files on
  disk, still parse them for links) and quote non-ASCII URLs.

## Possible future work

- Astro + Svelte + Tailwind rebuild of the landing shell only (archived
  sites would move verbatim into `public/`). Discussed, deferred — current
  single-file page is adequate until the portfolio grows.
