---
title: The block detectors' Input A is left unpowered, against the datasheet
summary: Powering an LM-iD.1's Input A, as every datasheet says to, makes its output idle at 5V into 3.3V expander inputs. It's deliberately left unpowered on Westgate Hollow.
date: 2026-08-24
status: accepted
projects: [layout-feedback, westgate-hollow]
---

## Context

The LM-iD.1 current detectors feed MCP23017 expander inputs running at 3.3V. Measured on the bench, the detector's
output has **two modes, selected by Input A**, and nothing published says so:

| Input A | Clear | Occupied |
|---|---|---|
| Unpowered | Open circuit | Pulled to 0V |
| Powered | Driven to **5V** | Pulled to 0V |

5V on a 3.3V MCP23017 input is out of specification (absolute maximum 3.9V). The clamp diode conducts whenever a
block is clear, which is most of the time, and back-feeds the 3.3V rail. **It appears to work while degrading the
part.**

## Decision

**Input A is deliberately left unpowered.** The output is then 0V or open circuit, which is harmless to the
expander. "Occupied" reads as 0 in both modes, so the node's active-low setting is correct either way.

## Alternatives considered

If Input A ever needs powering (it's also what lights the detector's own LED), the inputs need protecting first:

| Option | Verdict |
|---|---|
| Pull-up resistor to 3.3V | Worth fitting anyway, but doesn't stop the 5V. |
| BSS138 level shifter (Adafruit 757) | Works with this kind of open-drain source. |
| TXB0108 level shifter (Adafruit 395) | No. Its auto-direction sensing is defeated by this source. |
| 74LVC14A Schmitt trigger, 5V-tolerant, run at 3.3V | Takes 5V directly, adds hysteresis beside a DCC bus, and opens the door to wire supervision. |

## Consequences

- This is recorded because it's the kind of thing someone tidying the wiring in a year, following the official
  drawings, would "fix", putting 5V onto sixteen 3.3V inputs without noticing.

Source: [`docs/block-detector-wiring.md`](https://github.com/bazauto/layout-feedback/blob/main/docs/block-detector-wiring.md).
