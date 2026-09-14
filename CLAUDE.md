# bazauto-website

Static Astro 7 site for www.bazautomation.com, deployed by Cloudflare Workers Builds (see `docs/deploy.md`).
A personal engineering record of the Westgate Hollow layout and its four control-stack repos. The audience is
the owner first, so favour accuracy and reasoning over polish.

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
- Keep it static and JavaScript-free unless a feature truly needs client JS.
- Astro 7 is newer than most training data. When unsure about an API, check `node_modules/astro` types or
  https://docs.astro.build rather than guessing.
- Visual changes: verify by screenshotting the built site in both colour schemes before reporting done.
