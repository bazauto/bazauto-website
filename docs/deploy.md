# Deployment

The site is a static Astro build served by a **Cloudflare Worker with static assets**. There is no Worker script;
Cloudflare serves the files in `dist/` directly. Deployment is Git-driven through **Workers Builds**.

| Event | What happens |
|---|---|
| PR opened or updated | GitHub Actions runs `astro check` and `astro build`. Workers Builds uploads a **preview version**, served at its own `workers.dev` preview URL. The link is in the **Workers Builds** check on the PR, and in the Worker's **Deployments** tab. |
| Merge to `main` | Workers Builds builds and runs `wrangler deploy`, which makes it live on `www.bazautomation.com`. |

No Cloudflare credentials are stored in GitHub. Cloudflare pulls from the repo through its GitHub app.

## Files involved

- `wrangler.jsonc`: Worker name, assets directory, 404 handling, custom domain, preview URLs. This file is applied
  on every production deploy, so a setting changed only in the dashboard is reverted at the next merge.
- `public/_headers`: cache and security headers, applied by Cloudflare's asset serving. It reaches `www` only,
  because that is the only hostname the Worker answers for. The HSTS `max-age` starts at one day and is meant
  to be ramped — 1 day, then 30, then a year — once each step has been live without trouble. The CSP is written
  against what the build actually emits, so adding client JS, an image, a form or a `data:` URI means widening
  it in the same commit.
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
   | Build command | `npm run check && npm run build` |
   | Deploy command | `npx wrangler deploy` |
   | Non-production branch deploy command | `npx wrangler versions upload` |
   | Root directory | `/` |

   The build command runs `check` as well as `build` because Workers Builds does not wait on GitHub Actions.
   A push to `main` deploys on its own schedule, so without `check` here a TypeScript error would reach
   production and only turn the Actions run red afterwards. `astro build` validates content schemas but does
   not type-check.

4. Under the Worker's **Settings → Build → Branch control**, make sure **builds for non-production branches**
   are enabled. That builds each PR branch and uploads a version, but a version only gets a URL because
   `wrangler.jsonc` sets `"preview_urls": true` (Wrangler's default is `false`). The setting takes effect at the
   next **production** deploy, so a branch built before it reached `main` has no URL. Push to the branch again
   to rebuild it.
5. **Custom domain.** `wrangler.jsonc` declares `www.bazautomation.com` as a custom domain, so the first production
   deploy creates the DNS record and certificate. If a `www` DNS record already exists in the zone, the deploy
   fails. Delete the old record first, or attach the domain by hand under **Settings → Domains & Routes**.
6. **Apex redirect.** The site's canonical host is `www`, so the bare domain redirects to it. The dashboard's
   template for this may only offer the opposite direction ("Redirect from WWW to root"), so create a custom rule
   in the `bazautomation.com` zone under **Rules → Redirect Rules → Create rule**:

   | Setting | Value |
   |---|---|
   | When incoming requests match | Hostname equals `bazautomation.com` |
   | Then | Dynamic redirect |
   | Expression | `concat("https://www.bazautomation.com", http.request.uri.path)` |
   | Status code | 301 |
   | Preserve query string | On |

   The bare domain needs a **proxied** DNS record, or requests never reach Cloudflare for the rule to act on.
   Creating the rule through the dashboard adds that placeholder for you: a proxied `A` record for `@` pointing
   to `192.0.2.1`, commented "Created during Cloudflare Rules deployment process". Any proxied record works —
   the address is never connected to, because the redirect answers first. Do not confuse it with the proxied
   `AAAA` record for `www` pointing to `100::`, which is the custom domain from step 5 and is managed by the
   Worker.
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
