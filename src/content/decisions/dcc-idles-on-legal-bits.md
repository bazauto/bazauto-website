---
title: When the signal generator runs dry, it sends legal DCC bits instead of DC
summary: If PicoDCC's PIO program runs out of packet data, it keeps emitting valid DCC '1' bits rather than parking the output pin. Running short of packets costs throughput instead of putting DC on the rails.
date: 2026-08-27
status: accepted
projects: [picodcc]
---

## Context

PicoDCC generates the DCC waveform with an RP2350 **PIO** state machine, fed from a FIFO by Core 1. When that
FIFO emptied, the program parked the signal pin high. Between packets that put **2.2 to 2.5ms of DC** on the main
track (#34, #35). Given that [decoders treat lost DCC as DC and run at full speed](/decisions/flash-writes-only-in-maintenance-mode/),
that's the dangerous direction.

## Decision

**A starved FIFO idles on `1` bits.** The PIO program pulls without blocking and, when there's no data, branches to
a loop that keeps emitting legal DCC `1` bits until data arrives.

Two related rules came from the same investigation:

- **Only the main track may block.** Core 1 services both tracks in one pass. Programming-track packets carry six
  more preamble bits, so when both blocked, the pass ran at the slower track's rate and the main FIFO drained
  faster than it refilled. The programming track now skips a pass instead of waiting.
- **A header claiming zero bytes is discarded**, not transmitted. Otherwise the PIO's counter wrapped and it
  streamed raw FIFO words as data until reboot.

## Consequences

- The PIO program now fills **all 32 instruction slots**, so adding anything means taking something out first.
- A host-side test runs the *assembled* PIO program through an emulator and decodes the waveform, so a timing
  regression shows up in CI rather than on the rails.
- What causes a FIFO to slip by one word is **still unknown**. "The waveform is garbage and a reboot fixes it" is
  a known open fault.

Source: [`PicoDCC` CLAUDE.md](https://github.com/bazauto/PicoDCC/blob/main/CLAUDE.md) and
[`docs/architecture.md`](https://github.com/bazauto/PicoDCC/blob/main/docs/architecture.md).
