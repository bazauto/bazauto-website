---
title: Sensor nodes publish only the sensors that are actually wired
summary: An unwired expander input reads as "clear", so publishing the whole pin table would tell the orchestrator a block is empty using a wire that doesn't exist. Nodes publish an allow-list instead.
date: 2026-08-23
status: accepted
projects: [layout-feedback]
---

## Context

The feedback node's pin allocation reserves an MCP23017 input for every sensor that will exist. Most aren't wired
yet. An unwired input sits pulled up, which reads as **inactive**, which would be published as `clear`.

For a current-sensing block detector, one `clear` is enough on its own to let the orchestrator clear the block.

## Decision

**Allocation is not installation.** Each node's `config.py` lists the installed sensors, and only those are
published. Bringing a new sensor online is three steps: wire it to its allocated pin, add its id to the installed
list, deploy.

## Consequences

- Unwired track reads `unknown` in the orchestrator, not falsely empty.
- A related weakness is **accepted and recorded**: a *broken* wire on an installed sensor also floats up and reads
  `clear`, and re-assertion can't catch it because the node is alive and still publishing (#9, reopened). That
  weakness is what [the active-high block detector](/decisions/active-high-block-detector/) is designed to remove.

Source: [`layout-feedback` CLAUDE.md](https://github.com/bazauto/layout-feedback/blob/main/CLAUDE.md) and
[`docs/pin-allocation.md`](https://github.com/bazauto/layout-feedback/blob/main/docs/pin-allocation.md).
