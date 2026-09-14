---
title: Westgate Hollow Yard
summary: A small, fictional OO gauge goods yard, built as a test layout to prove the control system and practise scenic techniques before a full-room layout.
status: active
platform: OO gauge · test layout
order: 0
---

## What it's for

Westgate Hollow Yard is deliberately small. It's a **test layout**, and it has three jobs:

- **Verify the control system.** Everything else on this site (the orchestrator, PicoDCC, the feedback nodes and
  the throttle) gets proven here on real track, with real locos and real sensors, before it has to run anything
  bigger.
- **Try out scenic techniques.**
- **General practice** at baseboards, track, wiring and everything else, ahead of a larger **full-room layout**
  in the future.

The reasoning is recorded as a decision: [build a small test layout first](/decisions/test-layout-first/).

## The story

**Westgate Hollow Yard is fictional.** It isn't based on any prototype; the village, the yard, its history and the
farms below are all invented.

Westgate Hollow Yard serves the village of **Hollowgate**, in West Yorkshire, in the early British Railways era.

Hollowgate grew around a medieval packhorse route that crossed the valley ("the Hollow"), with the westward track
marked by a stone gatehouse. When the branch line was pushed through in the 1890s, the railway couldn't justify a
full station at the village, so a compact goods yard was built just off the main lane and named Westgate Hollow
Yard.

By early BR days it handled coal, fertiliser, cattle and seasonal produce from nearby farms, with a small engine
shed added to keep the pick-up goods engine and a shunter overnight. As road haulage took over in the 1950s, the
yard survived by consolidating traffic for several surrounding villages, and by using its storage sidings for
timber and agricultural machinery.

### Traffic

- Coal and coke in small wagons
- Fertiliser and lime for the local farms
- Cattle and sheep in market season
- Timber, fencing and occasional machinery
- Seasonal produce in vanfits or opens

### The farms it serves

| Farm | Mainly |
|---|---|
| Hollowgate Farm | General mixed farming |
| Brackenhowe Farm | Dairy and cattle |
| Low Fell Farm | Sheep and wool |
| Foxfield Farm | Root crops and produce |
| Moorfield Farm | Hay and fodder |
| Alder Beck Farm | Seasonal vegetables |
| Crowden Farm | Timber and fencing |

### Signage

- **BR totem:** deep blue with white lettering, "WESTGATE HOLLOW YARD" in Gill Sans. Three-line version:
  HOLLOWGATE above, EST. 1893 below.
- **Goods enamel board:** white on black, "WESTGATE HOLLOW GOODS YARD".
- **Painted timber board:** off-white with black lettering, slightly weathered, "WESTGATE HOLLOW YARD".
- **Shed nameplate:** a small cast plate, "WESTGATE HOLLOW SHED".

## Track plan

A two-road fiddle yard feeds a single entry line into the goods yard, which fans out through points into:

| Area | Roads |
|---|---|
| Fiddle yard | Two sidings, each split into a rear and front section |
| Storage sidings | Three |
| Goods shed | One line |
| Engine shed | Two roads |

## Hardware on the layout

| Part | Used for |
|---|---|
| **Cobalt iP Digital** point motors | Commanded over DCC accessory addresses. They can't report their own position, so it will be read separately from their `S2` changeover contacts; the firmware for that is built but the wiring isn't in yet. See [why command and feedback are separate](/decisions/point-command-and-feedback-separate/). |
| **LM-iD.1** current detectors | Block occupancy today. They're active low, so a broken wire reads as a clear block. |
| **[Block detector](/projects/block-detection/)** boards | Home-designed, active-high replacement detectors, so a broken wire reads as occupied. Revision 1.0 is on order. |
| **IR reflective sensors** | Fitted where a train should stand, such as the goods shed loading bank, so automation can stop on a beam. |

The control system around it is described on the other [project pages](/projects/).
