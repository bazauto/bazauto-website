---
title: The throttle's transport is chosen at runtime, not compiled in
summary: The ESP32 throttle speaks both WiThrottle (to JMRI) and the orchestrator's WebSocket, as equal peers selectable from its settings screen. With no over-the-air updates, a compile-time switch would mean a cable at the layout.
date: 2026-08-24
status: accepted
projects: [esp-layout-controller]
---

## Context

The 7" touchscreen throttle was built to talk **WiThrottle** to JMRI. It needed a second transport to talk to the
orchestrator directly ([over WebSocket](/decisions/mqtt-for-hardware-websocket-for-operators/)).

The device has a **1500K factory partition and no OTA partition**, so every firmware change is a USB cable at the
layout. Adding OTA later would halve the remaining flash headroom.

## Decision

- **Both transports stay first-class.** WiThrottle is a peer, not a legacy path.
- **The choice is made at runtime** on the settings screen and persisted in NVS. It isn't a Kconfig option.
- **The seam is a `ThrottleBackend` port.** The throttle controller depends on the interface; each backend answers
  capability questions (roster, function labels, acquisition, polling) in its own terms. Neither protocol
  impersonates the other.
- **Only the selected transport starts.** The device never sits retrying a server the operator didn't choose.

## Alternatives considered

| Option | Why not |
|---|---|
| Compile-time (Kconfig) switch | With no OTA, A/B-testing a bug means reflashing by cable, and it multiplies an already-forked build matrix. |

## Consequences

- The orchestrator transport cost about 70KB of flash, leaving roughly 178KB (12%).
- The UI asks the throttle controller for connection state and never reaches into a concrete client. Doing so is
  what made the orchestrator transport look dead on its first bench run.

Source: [`esp-layout-controller` CLAUDE.md](https://github.com/bazauto/esp-layout-controller/blob/main/CLAUDE.md).
