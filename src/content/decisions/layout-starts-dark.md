---
title: The layout starts with track power off
summary: Connecting to the command station checks the power state instead of switching it on. Only an operator turns the track on.
date: 2026-08-26
status: accepted
projects: [layout-orchestration, picodcc]
---

## Context

PicoDCC's tracks come up unpowered. An earlier change (#149) had the orchestrator send "power on" the moment the
serial link to the command station connected. The reasoning was that otherwise a cold start would report a
healthy link and accept throttle commands into dead rails.

That was the wrong default in service. The link comes up whenever the orchestrator process starts, and **every
deploy restarts the process**. So the layout came to life because somebody pushed a build, with nobody
necessarily standing at it. A decoder that loses DCC signal falls back to DC, which on a powered track is full
speed.

## Decision

**On connect, the orchestrator asks the station for its power state and doesn't set it.** The layout comes up
dark. Routes and automation are refused until an operator presses **On**.

What the operator sees is the power state the **station reported back**, never the state that was requested.

## Consequences

- A deploy can't energise the rails.
- Track power off refuses routes, but isn't a Safe-Stop and latches nothing. The layout is already stopped, and
  someone who switched it off to re-rail a wagon shouldn't come back to a system demanding acknowledgement.

Source: [`docs/dcc-link.md` D14](https://github.com/bazauto/layout-orchestration/blob/main/docs/dcc-link.md).
