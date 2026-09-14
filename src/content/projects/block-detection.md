---
title: Block Detector
summary: A home-designed two-channel DCC block detector with an active-high output, so a broken wire under the layout reads as occupied rather than clear.
status: active
platform: PCB · KiCad 10
repo: https://github.com/bazauto/block-detection
order: 4
---

## Why

The off-the-shelf detectors on the layout are **active low**. The feedback nodes' inputs are pulled up, so a broken
cable or connection under the layout floats high and reads exactly like a **clear block**, the permissive state.

This board is **active high**: occupied drives 3.3V and clear drives 0V, so the same broken wire reads as
**occupied**. The decision is recorded as
[build our own active-high block detector](/decisions/active-high-block-detector/).

## The board

- **Two independent channels**, each taking an external **current transformer** on the track feed.
- Each channel runs: CT → burden resistor → ESD clamp → precision peak detector → comparator with hysteresis →
  push-pull output.
- **Channel 1's burden is switchable** with a jumper: 100Ω for standard track, or 1.1kΩ for the programming
  track's service-mode acknowledgement pulse. Channel 2 is fixed at 100Ω.
- **Thresholds are set per channel** on a multi-turn trimmer, with test points for the envelope and the threshold.
- **48 × 38mm, 2 layers**, single 3.3V supply fed through the output header.
- A **3D-printed DIN-rail enclosure** (OpenSCAD) with slots for the CT leads and the output cable.

## Status

**Revision 1.0: 10 boards ordered from PCBWay, awaiting delivery.** Nothing has been measured on hardware yet.

A known concern going into bench testing: the signal chain has no gain, so the comparator threshold sits in the
millivolt region, a small fraction of the trimmer's travel. A series resistor to narrow the trimmer's range was
suggested but isn't in revision 1.0; sizing it needs the CT's actual turns ratio.

## Checks

ERC and DRC run in CI on every change, using the same KiCad release the board was designed in.
