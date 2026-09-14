---
title: Build this site with Astro, hosted on Cloudflare Workers
summary: A static site generated from Markdown, deployed automatically from GitHub.
date: 2026-09-14
status: accepted
---

## Context

I wanted somewhere to keep a record of the railway projects: what's been built, how far each part has got, and why
it's built the way it is. It's mainly for me, so it should be quick to add to and cost nothing to run.

## Decision

- **[Astro](https://astro.build)** static site. Content is Markdown files with schema-checked frontmatter, so a
  broken post fails the build instead of going live broken. Photos are resized at build time.
- **Cloudflare Workers static assets** for hosting. Cloudflare recommends Workers over Pages for new projects, the
  domain's DNS is already on Cloudflare, and Workers Builds deploys straight from GitHub.
- **Pushing to `main` deploys to production.** Every pull request gets a preview URL, so a post can be read as it
  will look before it goes live.

## Alternatives considered

| Option | Why not |
|---|---|
| Hugo | Fast, but Go templates are awkward, and image handling and content validation are weaker. |
| Eleventy | Image processing and schema checks would have to be assembled by hand. |
| Next.js | Far more framework than a static record needs. |
| Cloudflare Pages | Still supported, but Cloudflare now steers new projects to Workers. For a static site they're near-identical. |
| Uploading a zip | No history, no previews, and manual every time. |

## Consequences

- Posts and pages change through pull requests, the same as code in the other repos.
- Rolling back is picking an earlier version in the Cloudflare dashboard.
