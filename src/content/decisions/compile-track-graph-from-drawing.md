---
title: The track diagram is compiled into the route graph, under operator review
summary: Instead of describing the railway twice by hand, as a drawing and as a graph, the drawing is compiled into the graph. The operator reviews the diff and applies it.
date: 2026-08-13
status: accepted
projects: [layout-orchestration]
---

## Context

The orchestrator described the railway **twice, by hand**: the Track Editor's **drawing**, and the **track graph**
the pathfinder routes over. A pile of machinery existed only to keep the two in agreement, forever.

Underneath sat a sharper fault. A block end's label was both its **identity** (edges joined on it by string match)
and a **description** derived from the drawing. An identifier must be stable; a description must change when the
thing changes. On Westgate Hollow two openings got colliding names, and because naming *was* identity, a real,
drawn opening couldn't be connected to anything. **Naming failed, so routing failed.**

## Decision

**The drawing compiles to the track graph.** A compile reads the drawing, produces a candidate graph and a diff; an
operator reviews it and applies it. The compiler is the **only** writer of the graph, and an apply is guarded by a
fingerprint of the drawing it was compiled from.

**Why this is safer, not just less work:** hand transcription puts a person in the loop where they're worst, typing
identifiers where a typo makes a valid-looking edge. A compile diff puts them where they're best: comparing a
picture to a list.

## Alternatives considered

| Option | Why not |
|---|---|
| A 16-point bearing scale for end labels | It happens to separate Westgate Hollow's two colliding openings, which isn't a design argument. |
| An anchor coordinate on block ends (#97) | The right answer to a question that stops being asked. |
| Per-edge speed limits, gradients, direction restrictions | Not wanted. Length moved off the edge and onto the block. |

## Consequences

- The audit invariant weakens, honestly stated: from "every edge was typed by a human" to "one process writes the
  graph, only when an operator applies a reviewed, fully valid diff".
- Gaps in the compile gate automation only. They never cause a Safe-Stop.

Source: [`docs/track-graph-compilation.md`](https://github.com/bazauto/layout-orchestration/blob/main/docs/track-graph-compilation.md).
