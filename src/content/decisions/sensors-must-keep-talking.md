---
title: Sensors must keep talking, and silence is treated differently from lying
summary: Every sensor re-sends its reading at least every 30 seconds. A silent sensor degrades only its own blocks, while a garbled message Safe-Stops the layout.
date: 2026-08-16
status: accepted
projects: [layout-orchestration, layout-feedback]
---

## Context

Sensor readings were retained on the broker, so a restarted orchestrator got the last value immediately. But a
retained message says nothing about whether the sensor is still alive. When the orchestrator restarted with a
sensor dead, it received that sensor's last `clear` and reported it as live, empty track (#28).

## Decision

One rule, from which every retention choice follows:

> **Telemetry may be retained only where the publisher is obliged to re-assert it, and a retained delivery is
> never trusted on its own.**

- **Sensors re-assert every 30 seconds**, changed or not. A reading that only arrives retained, or that hasn't been
  refreshed within 90 seconds, marks the blocks it covers as `unknown`, which is treated as occupied.
- **Point readings are not retained at all.** A point can be thrown by hand while its controller is off, so a
  stored position is an archived belief. Recovery is a live query instead.
- **Silence and garbage get different answers.** A device *dying* (stale) degrades only the track it observes, and
  the rest of the layout keeps running. A device *lying* (a malformed payload) is a system-wide Safe-Stop on the
  first message.

## Alternatives considered

| Option | Why not |
|---|---|
| MQTT Last Will and Testament | One Will per *connection*, not per sensor, so it would need a controller identity model and a live-database migration. It also detects strictly less: it doesn't fire when the reading task crashes but the connection stays up, or when a detector board loses power behind a healthy controller. |
| Softening the malformed-payload response | Proposed and explicitly overruled. Degrading doesn't stop a train already moving under automation; Safe-Stop does. |

## Consequences

- Firmware cost is one timer comparison and a re-publish; 20 sensors is 40 messages a minute.
- Until a node's firmware re-asserts, its blocks read `unknown`. Manual driving still works, but routing and
  automation over unobserved track are refused.

Source: [`docs/sensor-trust.md`](https://github.com/bazauto/layout-orchestration/blob/main/docs/sensor-trust.md) D1, D10.
