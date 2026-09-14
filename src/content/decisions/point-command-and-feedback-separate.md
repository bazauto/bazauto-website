---
title: Points are commanded by one device and read back by another
summary: Cobalt iP point motors take DCC commands but can't report their position, so position comes from their S2 contacts on a feedback node. That catches hand-thrown points, but creates two mappings nothing cross-checks.
date: 2026-08-24
status: accepted
projects: [layout-feedback, layout-orchestration, westgate-hollow]
---

## Context

Westgate Hollow's **Cobalt iP Digital** point motors are commanded over **DCC accessory addresses** and have no
feedback or query of their own. The only way to know a point's position is its `S2` changeover contacts.

## Decision

- **Command path:** orchestrator → PicoDCC → DCC accessory command → motor.
- **Feedback path:** `S2` contacts → MCP23017 expander on a feedback node → MQTT `point/{id}/reading` → orchestrator.
- **Two inputs per point,** one per side of the changeover. A break-before-make contact passes through both-open on
  every throw, so the honest sequence is `normal` → `unknown` → `reverse`, and it's never debounced away.

## Consequences

- **Good:** because feedback is independent of command, a point thrown by hand, knocked, or drifting on a failing
  linkage shows up as an uncommanded change (`mismatch`). A self-reporting motor wouldn't know.
- **Dangerous:** two independent mappings decide which motor is which, in two different repos. The DCC address is
  in the orchestrator database; the pins are in the node's `config.py`. If either is wrong, the system commands one
  motor and reads another, and **both ends look healthy**. It will even pass whenever the two motors happen to
  be in the same position.
- **The commissioning check:** throw each point *individually*, and confirm that the expected pair of inputs, and
  only that pair, moves.
- Points come up **one at a time**, because every point fault kind Safe-Stops the whole layout.

Source: [`docs/point-position-feedback.md`](https://github.com/bazauto/layout-feedback/blob/main/docs/point-position-feedback.md).
