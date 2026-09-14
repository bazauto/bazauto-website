---
title: Flash writes only in Layout Maintenance Mode
summary: Saving settings to flash stops DCC output for about 410ms, which makes decoders run away at full speed. So writes are only allowed with the main track off, in a mode entered from the command station's own screen.
date: 2025-10-20
status: accepted
projects: [picodcc]
---

## Context

PicoDCC keeps its configuration in the last sector of the RP2350's flash. A flash erase and write takes **about
410ms, and both cores halt** for all of it, so DCC packets stop.

When DCC packets stop, decoders don't coast. Within roughly 10 to 30ms they switch to **DC mode**, and on a
powered track that means **full speed, instantly**. It's specified decoder behaviour, not a bug, and no software
watchdog is fast enough to prevent it.

## Decision

Flash writes are legal **only in Layout Maintenance Mode**, which has four properties that are safety
requirements, not UX choices:

- **Entered from the LCD only.** You have to be physically at the command station, so a remote client can't put the
  layout into this state.
- **The main track must be verified unpowered** before entry. The firmware checks what it can observe and asks the
  operator to confirm what it can't, namely that locos are stopped ("verify, don't force").
- **No timeout.** Exit is manual.
- **No automatic power restore.** Main track power stays off after exit until someone turns it on.

The programming track keeps working in this mode, since its decoder is isolated.

## Alternatives considered

The storage options study compared the flash sector with an external I2C EEPROM, external SPI flash, an SD card
and a LittleFS filesystem, and recommended the flash sector. The maintenance-mode constraint is the price of
choosing it.

## Consequences

- The firmware is linked with a custom memory map that reserves the last 4KB sector, so configuration survives a
  firmware update.
- Nothing may write flash anywhere else in the firmware.

Source: [`PicoDCC` CLAUDE.md](https://github.com/bazauto/PicoDCC/blob/main/CLAUDE.md),
[`docs/safety-recommendations.md`](https://github.com/bazauto/PicoDCC/blob/main/docs/safety-recommendations.md) and
[`docs/architecture.md`](https://github.com/bazauto/PicoDCC/blob/main/docs/architecture.md).
