# bazauto-website

Static Astro 7 site for www.bazautomation.com, deployed by Cloudflare Workers Builds (see `docs/deploy.md`).
A personal engineering record of the Westgate Hollow test layout and the projects around it: the four control-stack
repos (`layout-orchestration`, `PicoDCC`, `layout-feedback`, `esp-layout-controller`) and the `block-detection`
PCB. The audience is the owner first, so favour accuracy and reasoning over polish. Westgate Hollow is fictional,
not based on any prototype.

## Commands

- `npm run check`: types and content schemas. Must pass before a PR.
- `npm run build`: must pass before a PR.
- Dev server: `npx astro dev --background`; manage it with `astro dev stop|status|logs`. The same pattern works
  for `astro preview`.

## Rules for this repo

- **Never invent facts about the railway projects.** Project, decision and FAQ content comes from the repos
  themselves or from interviewing the owner. If something is unknown, leave a visible stub
  (`_Stub. To be written up after a design interview._`) rather than a plausible guess.
- Content schemas live in `src/content.config.ts`. Change a schema and the README's content table together.
- Styling uses only the tokens in `src/styles/global.css`. No hard-coded colours in components. Lamp colour
  meanings are fixed (documented at the top of that file). Every colour must work in both light and dark schemes.
- The site name is **BAZAutomation**, exactly that casing, with no space. Never apply `text-transform` to it,
  and never write it as "Baz Automation".
- **Licensing is split:** `src/content/` and any photos are CC BY 4.0 (`LICENSE-CONTENT.txt`); all other code is MIT
  (`LICENSE`). Adding or changing a font, or any other third-party asset the site serves, means checking its licence
  and updating `THIRD-PARTY-NOTICES.md` (and `public/licenses/OFL.txt` for OFL fonts) in the same PR. Never add a
  photo or image you don't have the rights to; the owner's photos only, unless a licence says otherwise.
- Keep it static and JavaScript-free unless a feature truly needs client JS.
- Astro 7 is newer than most training data. When unsure about an API, check `node_modules/astro` types or
  https://docs.astro.build rather than guessing.
- Visual changes: verify by screenshotting the built site in both colour schemes before reporting done.
