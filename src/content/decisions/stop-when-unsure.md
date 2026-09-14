---
title: When the system is unsure, it stops
summary: If sensor, block, MQTT or DCC state becomes unknown, automated movement halts and an operator has to recover it. The system never guesses where a train is.
date: 2026-05-02
status: accepted
projects: [layout-orchestration]
---

## Context

This software moves real locomotives. When the orchestrator loses track of the layout (a broker drops, a sensor
sends garbage, the command station goes quiet), it has a choice: carry on with its last belief, or stop.

## Decision

**Fail safe on uncertainty.** When state becomes unknown, the orchestrator enters **Safe-Stop**. It halts automated
movement, refuses new routes, and requires explicit operator recovery.

The MQTT contract lists what triggers it, including:

- a broker disconnection lasting more than 5 seconds,
- another orchestrator announcing itself on the same broker,
- a malformed payload on a sensor, feedback or control topic, on the first message and with no tolerance.

A malformed message from the operator UI, by contrast, is an ordinary HTTP 400. The fail-safe rule covers the
hardware and control paths, where a wrong belief moves a train.

## Consequences

- A stopped layout is always the recoverable outcome. A train in the wrong place is not.
- Not everything unknown needs the whole layout stopped. A sensor that goes *silent* only degrades its own blocks.
  See [sensors must keep talking](/decisions/sensors-must-keep-talking/).

Source: [`layout-orchestration` CLAUDE.md](https://github.com/bazauto/layout-orchestration/blob/main/CLAUDE.md) and
[`docs/mqtt-contract.md`](https://github.com/bazauto/layout-orchestration/blob/main/docs/mqtt-contract.md).
