---
title: Never guess a stopping distance
summary: Automated braking uses only measured track lengths and refuses on unmeasured track. Automation's one invariant is that a train never passes the end of its authority, and where a beam is fitted, the beam breaking is what stops it.
date: 2026-08-08
status: accepted
projects: [layout-orchestration]
---

## Context

Occupancy is block-level: a train confirmed in a block could be anywhere inside it. Braking runs open-loop, from
a commanded speed step, with no speed measurement. To stop a train at a point, the orchestrator has to know how
much track there is to stop in.

## Decision

**Braking distance is worst-case and measured.** It's the sum of the *intermediate* blocks' measured lengths, from
the exit of the train's confirmed block to the entry of its target. **Any block in that stretch without a measured
length refuses the run outright**, naming the block.

The pathfinder's default 1000mm block length is explicitly **not** reused. Guessing a *cost* to steer a route
search is fine, since the worst outcome is a slightly worse route. Guessing a *stopping distance* is a collision
if the guess is short.

Automation, added later (#7), builds on this with one invariant:

> **A train under automation never passes the end of its authority.**

- **The stop target is a beam, not a boundary.** IR beams are fitted where a train should stand, such as the goods
  shed loading bank. Automation brakes toward the beam, crawls the last part, and stops when the beam breaks. It's
  the only closed loop in the system.
- **No usable beam means a boundary stop,** just short of the destination block, and an operator finishes the move.
  It never falls back to a guess.

## Consequences

- A run to the *immediately next* block has zero intermediate distance and is refused, unless a sensor fix inside
  the current block adds measured distance. A sensor fix can only ever *add* distance, never rescue unmeasured
  track.
- Automation arrives incrementally as beams are fitted and blocks are measured with a tape.

Source: [`docs/braking.md` B4](https://github.com/bazauto/layout-orchestration/blob/main/docs/braking.md) and
[`docs/automation.md` A1, A2](https://github.com/bazauto/layout-orchestration/blob/main/docs/automation.md).
