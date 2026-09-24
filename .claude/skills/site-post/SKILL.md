---
name: site-post
description: Write log posts, decision records and FAQ entries for www.bazautomation.com, either harvested from recent activity in the layout repos or from an interview about the owner's own thinking, and open one content PR for review. Use when asked to write up, post, publish or log something on the site, to see what is worth posting, or when invoked as /site-post.
---

# Posting to the site

Two modes, picked from the arguments:

- **Harvest** (`/site-post` with no arguments, or `/site-post since 2026-09-01`): find what has happened in the
  project repos since the last harvest, propose what is worth writing up, and draft what the owner picks.
- **Ad-hoc** (`/site-post <topic or thought>`): interview the owner about a topic until the reasoning is clear,
  then write it up. A project page still marked `_Stub._` is a good topic.

Both modes end the same way: **one PR per run**, opened **without auto-merge**. The owner reads the Workers Builds
preview and merges it themselves. That, together with approving the shortlist, is the review.

## Ground rules

These come from the repo's `CLAUDE.md` and override anything below.

- **Never invent facts.** Everything comes from the repos or from the owner. The repos usually say *what* was done.
  They rarely say *why*. A reason that is not written down is a question for the owner. If the owner doesn't answer
  it, leave `_Stub. To be written up after a design interview._` where the reasoning would go. Never write a
  plausible guess.
- A fact that is quoted must be checked against its source at the commit being cited, not at the tip of `main`,
  if they differ.
- The site name is **BAZAutomation**, exactly.
- Everything under `src/content/` is CC BY 4.0. Photos must be the owner's own.
- Never set auto-merge on the PR this skill opens.

## Voice

Match `src/content/log/2026-09-14-why-this-site-exists.md`: first person as the owner, plain and direct, British
spelling, short paragraphs, no marketing or hype, no exclamation marks. The audience is the owner first, so give
reasons and trade-offs rather than polish. Link to project pages (`/projects/<id>/`) and decision records
(`/decisions/<id>/`) rather than re-explaining them. When published content turns out to be wrong, correct it in
place with a `> **Correction:** …` note and bump `updatedDate`. Don't edit history silently.

## Harvest mode

### 1. Branch

```powershell
git fetch origin
git switch -c content/<today> origin/main
```

### 2. Work out the window

The last harvest is the most recent commit on `main` that added `sources:` lines:

```powershell
git log -1 --format=%cs -S"sources:" origin/main -- src/content
```

If nothing is found, use `2026-09-14`, when the site started. An explicit `since <date>` argument wins. Also collect
every URL already cited, so nothing is written up twice:

```powershell
git grep -h -A40 "^sources:" origin/main -- src/content | Select-String "https://"
```

### 3. Gather activity

Repos: `layout-orchestration`, `PicoDCC`, `layout-feedback`, `esp-layout-controller`, `block-detection`, all under
`bazauto/`. Use `gh`, so the local clones' state doesn't matter:

```powershell
gh pr list --repo bazauto/<repo> --state merged --search "merged:>=<since>" --limit 100 --json number,title,url,mergedAt,author,body,files
gh issue list --repo bazauto/<repo> --state closed --search "closed:>=<since> reason:completed" --limit 100 --json number,title,url,closedAt,body
gh release list --repo bazauto/<repo> --limit 10
```

Parse the JSON with `node -e`, since `jq` isn't installed. Drop anything already cited, and drop the noise without
listing it: Dependabot, version bumps, CI and tooling-only changes, formatting, typo fixes.

For anything that looks like a candidate, read it properly before judging it. That means the PR body, the files it
changed and, for docs, the doc itself (`gh api repos/bazauto/<repo>/contents/<path>?ref=<sha>`, or the local clone
under `E:\Development\railway\<repo>` after `git fetch`).

### 4. Classify

Each candidate becomes one of:

| Kind | When |
|---|---|
| **Log post** | A merged PR that changes behaviour or hardware, a new or substantially changed doc under a repo's `docs/`, or a milestone (board ordered or assembled, a feature running on the bench box, a release). Related items across repos can share one post. |
| **Decision record** | The activity shows a design choice with alternatives: an ADR, a contract change in `docs/mqtt-contract.md`, a rule added to a repo's `CLAUDE.md`, or a PR body arguing for one approach over another. Check `src/content/decisions/` first. A change to an existing decision means updating or superseding that record, not writing a duplicate. |
| **FAQ entry** | A question a reader would plausibly ask that the activity now lets the site answer from facts. These are anticipated questions, so only propose one when the answer is solid. |
| **Project page update** | A project's status changed, or the activity fills in part of a stubbed project page. |
| **Nothing** | Everything else. |

### 5. Shortlist: the first review

Show the owner a numbered table: kind, proposed title, one line on what it would say, the source links, and the
open questions it would need answered (the missing *whys*). Include the items judged "nothing" only as a one-line
count. Ask which to draft. Also offer the choice of combining items or folding them into one post.

Draft only what the owner picks. If they pick nothing, delete the branch and stop.

### 6. Fill the gaps

For the picked items, ask the open questions. Ask a few at a time, grouped by item, and say which item each is for.
An answer the owner gives becomes part of the piece, and the PR body records it as "from the owner". If a question
is skipped or answered "don't know", stub that part of the piece.

### 7. Photos

For each log post or project update that would benefit from one, ask once whether the owner has a photo, and say
what it would show. It is fine for them to decline. Then see "Photos" below.

### 8. Draft, verify, open the PR

See the formats, "Verify" and "Open the PR" below.

## Ad-hoc mode

1. Branch as in harvest step 1, named `content/<slug>`.
2. Read what the site and the repos already say about the topic, so no question has an answer the owner already
   wrote down.
3. Interview one question at a time, in the manner of the `grill-me` skill. Get to the actual reasoning: what was
   considered, what tipped it, what it costs, and what would change the owner's mind. Stop when the piece can be
   written without guessing.
4. Decide with the owner what the result is. Often a decision record plus a short log post pointing at it, sometimes
   a project page section or an FAQ entry.
5. Photos as in harvest step 7, then draft, verify and open the PR. `sources` lists any repo material that was read.
   It may be empty if the piece is purely the owner's reasoning.

## Formats

Reuse existing tags (`git grep -h "^tags:" -- src/content/log`) before inventing new ones. Project ids are the file
names in `src/content/projects/`.

**Log post:** `src/content/log/<pubDate>-<slug>.md`

```markdown
---
title: <sentence case, no trailing full stop>
description: <one sentence, shown in lists and the RSS feed>
pubDate: <today>
projects: [<project ids>]
tags: [<tags>]
sources:
  - https://github.com/bazauto/<repo>/pull/<n>
---
```

The body says what happened and why it matters, with links to the PRs and docs it came from. Keep it short. Detail
belongs in the linked sources or in a decision record.

**Decision record:** `src/content/decisions/<slug>.md`. The slug states the decision (`stop-when-unsure`).

```markdown
---
title: <the decision, as a statement>
summary: <two sentences at most: what was chosen and the gist of why>
date: <when the decision was made: the PR, commit or doc that introduced it, or the date the owner gives. Not today.>
status: accepted
projects: [<project ids>]
sources:
  - <url>
---

## Context
## Decision
## Alternatives considered
## Consequences

Source: <links, matching the existing records>
```

To supersede a record, set `status: superseded` and `supersededBy: <new id>` on the old one, and link back from the
new one's Context.

**FAQ entry:** `src/content/faq/<slug>.md`. The URL is `/faq/#<slug>`.

```markdown
---
question: <as a reader would ask it>
order: <next multiple of 10 after the highest existing>
---
```

Answer in a paragraph or two. Link to the decision or project page that holds the detail.

## Photos

Only the owner's own photos. Put them in a folder named after the post, next to it: for example
`src/content/log/2026-10-01-baseboards/`. Resize them to 2400px on the long edge before committing, using `sharp`,
which is already installed as Astro's image dependency:

```powershell
node -e "require('sharp')(process.argv[1]).rotate().resize(2400,2400,{fit:'inside',withoutEnlargement:true}).jpeg({quality:85}).toFile(process.argv[2])" <original> <dest>.jpg
```

`heroImage` requires `heroAlt`. Write alt text that describes what is in the picture, and check it with the owner.

## Verify

```powershell
npm run check 2>&1 | Select-String "Result|error"
npm run build 2>&1 | Select-String "error|Complete|pages? built"
```

Both must pass. Content changes aren't visual changes, so no screenshots are needed. But if a photo was added, open
the built page (`npx astro preview --background`) and check it renders.

## Open the PR

Follow the `pr` skill for branching, commit messages and the body file (`.git/pr-body.md`, written with `Write`),
with **one exception: do not run `gh pr merge --auto`**. The owner merges.

Title: `Content: <short summary>`. The body lists each piece with its URL path on the site, the sources it was
written from, and which claims came from the owner's answers rather than the repos. It also lists any stubs left
behind.

Finish by reporting the PR URL and pointing the owner at the preview. The link appears in the PR's **Workers
Builds** check once the preview has built (see `docs/deploy.md`). Don't poll for it.
