---
title: Build our own active-high block detector
summary: Off-the-shelf detectors pull low for occupied, so a broken wire under the layout reads as a clear block. A home-designed board with an active-high output makes that fault read as occupied instead.
date: 2026-08-25
status: accepted
projects: [block-detection, layout-feedback, westgate-hollow]
---

## Context

Block occupancy on Westgate Hollow comes from **LM-iD.1** current detectors wired into MCP23017 expander inputs on a
feedback node. Their output is **active low**: occupied pulls the line to 0V, and clear leaves it open (see
[why their Input A is left unpowered](/decisions/detector-input-a-unpowered/)).

The expander inputs are pulled up. So an **open circuit** (a broken cable, a failed crimp, a connector worked
loose under the layout) floats high, and reads exactly like a **clear block**. The sensor node is still alive and
still re-asserting, so [the 30-second re-assert rule](/decisions/sensors-must-keep-talking/) can't catch it. For a
current detector, a false `clear` is enough on its own to let the orchestrator clear the block. This is recorded
in the feedback repo as #9.

## Decision

**Design a block detector with an active-high output.** Occupied drives 3.3V, clear drives 0V, from a push-pull
comparator output. On a pulled-up input, the broken-wire fault now floats to **occupied**, which is the fail-safe
side.

## Consequences

- The detector becomes a PCB project of its own: [Block Detector](/projects/block-detection/). Revision 1.0 is on
  order and not yet bench-tested.
- The date is the first saved schematic in the project folder (2026-08-25). The design has no git history from
  before the repo was created.

Source: [`block-detection` README](https://github.com/bazauto/block-detection/blob/main/README.md) and
[`layout-feedback` CLAUDE.md](https://github.com/bazauto/layout-feedback/blob/main/CLAUDE.md).
