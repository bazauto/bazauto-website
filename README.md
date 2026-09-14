# bazauto-website

Source for [www.bazautomation.com](https://www.bazautomation.com): a working record of the Westgate Hollow model
railway and its control system.

Built with [Astro](https://astro.build), served by Cloudflare Workers static assets. See
[docs/deploy.md](docs/deploy.md).

## Develop

Node 22.12 or later (`.node-version` pins 24).

```sh
npm install
npm run dev       # http://localhost:4321, drafts visible
npm run check     # types and content schemas
npm run build     # static output in dist/
npm run preview   # serve dist/
```

## Content

Everything lives in `src/content/` as Markdown. The frontmatter for each collection is defined and validated in
`src/content.config.ts`, so a wrong field fails `npm run check`.

| Collection | Folder | URL | Notes |
|---|---|---|---|
| Log | `log/` | `/log/<file>/` | Name files `YYYY-MM-DD-slug.md`. `draft: true` hides a post from builds. |
| Projects | `projects/` | `/projects/<file>/` | `status` sets the lamp: active / paused / planned / done. |
| Decisions | `decisions/` | `/decisions/<file>/` | Context → Decision → Alternatives considered → Consequences. |
| FAQ | `faq/` | `/faq/#<file>` | `order` controls position. |

Log posts and decisions reference projects by file name (`projects: [picodcc]`). An unknown name fails the build.

### Images

Put images next to the post that uses them, e.g. `src/content/log/2026-10-01-baseboards/`, and reference them with a
relative path. Astro generates web-sized versions at build time. Resize camera originals to about 2400px on the long
edge before committing; the repo stores whatever you give it.

## Design

A signal box mimic panel. In light mode it's a pale painted panel with black track lines; in dark mode the same panel
with the lights off. It follows the OS colour scheme. All colours are tokens at the top of `src/styles/global.css`,
which also documents the fixed lamp colour meanings.

## Licence

Two licences, split by what the material is:

| Material | Licence |
|---|---|
| **Content**: everything under `src/content/` (log posts, project pages, decisions, FAQ), and any photos or images | [CC BY 4.0](LICENSE-CONTENT.txt): reuse it, with credit to Paul Barrett |
| **Code**: everything else (components, pages, styles, config, scripts, docs) | [MIT](LICENSE) |

Copyright © 2026 Paul Barrett. Third-party material, notably the OFL-licensed fonts the site serves, is listed in
[THIRD-PARTY-NOTICES.md](THIRD-PARTY-NOTICES.md).
