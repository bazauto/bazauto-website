# Deployment

The site is a static Astro build served by a **Cloudflare Worker with static assets**. There is no Worker script;
Cloudflare serves the files in `dist/` directly. Deployment is Git-driven through **Workers Builds**.

| Event | What happens |
|---|---|
| PR opened or updated | GitHub Actions runs `astro check` and `astro build`. Workers Builds uploads a **preview version** and posts its URL on the PR. |
| Merge to `main` | Workers Builds builds and runs `wrangler deploy`, which makes it live on `www.bazautomation.com`. |

No Cloudflare credentials are stored in GitHub. Cloudflare pulls from the repo through its GitHub app.

## Files involved

- `wrangler.jsonc`: Worker name, assets directory, 404 handling, custom domain.
- `public/_headers`: cache and security headers, applied by Cloudflare's asset serving.
- `.node-version`: Node version for both Workers Builds and GitHub Actions.
- `.github/workflows/ci.yml`: the PR gate.

## One-time setup

1. **Push the repo** so `main` exists on GitHub with `wrangler.jsonc` in it.
2. Cloudflare dashboard → **Compute → Workers & Pages → Create application → Import a repository**.
   Authorise the Cloudflare GitHub app for `bazauto/bazauto-website` only.
3. Configure the build:

   | Setting | Value |
   |---|---|
   | Project name | `bazauto-website` (must match `name` in `wrangler.jsonc`) |
   | Production branch | `main` |
   | Build command | `npm run build` |
   | Deploy command | `npx wrangler deploy` |
   | Non-production branch deploy command | `npx wrangler versions upload` |
   | Root directory | `/` |

4. Under the Worker's **Settings → Build → Branch control**, make sure **builds for non-production branches**
   are enabled. This produces the per-PR preview URLs.
5. **Custom domain.** `wrangler.jsonc` declares `www.bazautomation.com` as a custom domain, so the first production
   deploy creates the DNS record and certificate. If a `www` DNS record already exists in the zone, the deploy
   fails. Delete the old record first, or attach the domain by hand under **Settings → Domains & Routes**.
6. **Apex redirect.** In the `bazautomation.com` zone: **Rules → Redirect Rules → Create rule** using the
   "Redirect from root to WWW" template, which gives a 301 from `bazautomation.com/*` to
   `https://www.bazautomation.com/${1}` with the query string preserved. The apex needs a proxied DNS record for
   the rule to fire. A proxied `AAAA` record pointing to `100::` is the usual placeholder.
7. **GitHub branch protection** on `main`: require a pull request, and require the `Check and build` status check.
   This is what lets auto-merge land PRs only when CI is green.

## Deploying by hand

Normally unnecessary. From a clean checkout, logged in with `npx wrangler login`:

```sh
npm ci
npm run build
npx wrangler deploy                 # production
npx wrangler versions upload        # preview only; prints a preview URL
```

## Rolling back

Dashboard → the Worker → **Deployments** lists previous versions. Roll back to any of them instantly; no rebuild
is needed. Then revert the offending commit on `main` so the next build doesn't reintroduce it.
