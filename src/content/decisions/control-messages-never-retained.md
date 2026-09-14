---
title: Control messages are never retained
summary: A retained MQTT control message replays to every client that reconnects, which would make a loco move with nobody asking. Control topics are always published unretained.
date: 2026-05-02
status: accepted
projects: [layout-orchestration, esp-layout-controller]
---

## Context

MQTT can **retain** a message, so the broker hands the last value to anything that subscribes later. That's
useful for state: a new UI client immediately sees every block and point without polling. For a *command* it's
dangerous.

## Decision

**Control topics are never retained.** A controller that restarts receives no stale throttle command, so there's
no ghost movement. It recovers the last known loco *state* from the retained state topics instead.

The same idea carries over to the throttle's WebSocket connection. A state snapshot received on reconnect updates
the display and is **never replayed as commands**, because it describes what the layout believes, including locos
this device didn't start.

## Consequences

- Retention is decided per topic by what the message *is*: state may be retained, commands never.
- The general rule for telemetry is in [sensors must keep talking](/decisions/sensors-must-keep-talking/).

Source: [`docs/mqtt-contract.md`, "QoS and Retained"](https://github.com/bazauto/layout-orchestration/blob/main/docs/mqtt-contract.md)
and [`esp-layout-controller` CLAUDE.md](https://github.com/bazauto/esp-layout-controller/blob/main/CLAUDE.md).
