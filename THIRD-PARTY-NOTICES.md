# Third-party notices

Material in this repository, or served by the built site, that is not the owner's own work.

## Served with the site

### Fonts: SIL Open Font License 1.1

Astro's Google font provider downloads these at build time and serves them from the site's own origin
(`/_astro/fonts/`), so the site redistributes them. The OFL requires the copyright notice and licence to accompany
every copy. The served files keep their copyright line, but Google's subsetting removes the licence text, so the
full licence is published at [`/licenses/OFL.txt`](public/licenses/OFL.txt) and linked from every page footer.

| Font | Copyright |
|---|---|
| IBM Plex Sans | Copyright © 2017 IBM Corp. with Reserved Font Name "Plex" |
| IBM Plex Mono | Copyright © 2017 IBM Corp. with Reserved Font Name "Plex" |
| Barlow Semi Condensed | Copyright 2017 The Barlow Project Authors (https://github.com/jpt/barlow) |

**If `astro.config.mjs` gains or changes a font, update this table and `public/licenses/OFL.txt` in the same PR,**
or confirm the new font's licence first. Not every font on Google Fonts is OFL.

## In the source

### Astro blog template: MIT

The project was started from the `blog` template in [withastro/astro](https://github.com/withastro/astro) and has
since been largely rewritten.

```
MIT License

Copyright (c) 2021 Fred K. Schott
```

## Build-time only (not distributed)

npm dependencies are installed at build time and never committed or served. They are overwhelmingly MIT,
Apache-2.0, ISC or BSD. Two carry copyleft licences, and both are unmodified build tools whose output contains none of
their code:

- `sharp`'s prebuilt `libvips` binaries: LGPL-3.0-or-later
- `lightningcss`: MPL-2.0
