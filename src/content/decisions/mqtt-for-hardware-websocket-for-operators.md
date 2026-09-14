---
title: MQTT for hardware, WebSocket for operators
summary: Sensors and point feedback talk to the orchestrator over MQTT under a binding contract. Operator devices, including the handheld throttle, use the orchestrator's WebSocket control plane.
date: 2026-08-24
status: accepted
projects: [layout-orchestration, layout-feedback, esp-layout-controller]
---

## Context

Four repositories have to agree on how they talk. The MQTT contract once described the handheld throttle
publishing loco commands over MQTT, but nothing in the orchestrator ever published or subscribed to that topic.
In practice the orchestrator drives DCC itself, over serial to PicoDCC.

## Decision

- **MQTT is the hardware telemetry bus.** Sensors and point position feedback publish on topics defined in
  `layout-orchestration`'s `docs/mqtt-contract.md`. The contract is **binding** on every other repo: if a
  change needs a topic or field the contract doesn't define, the contract is amended first, in
  `layout-orchestration`.
- **WebSocket is the operator control plane.** The ESP32 throttle connects to the orchestrator's `/ws`, logs in with
  its own `operator` credential, and speaks the same message vocabulary as the browser UI.
- **The message vocabulary is `layout-orchestration`'s `types.ts`**, which is authoritative for the whole
  system, firmware included.

## Consequences

- An operator device gets the same roles, authentication and safety checks as the web UI, rather than a side
  channel.
- The throttle reuses the WebSocket client it already had for JMRI, so no new firmware component was needed.

Source: [`esp-layout-controller` CLAUDE.md](https://github.com/bazauto/esp-layout-controller/blob/main/CLAUDE.md) and
[`docs/mqtt-contract.md`](https://github.com/bazauto/layout-orchestration/blob/main/docs/mqtt-contract.md).
