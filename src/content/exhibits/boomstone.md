---
title: The rock you can shoot
hook: A rock you could mine or blow up was impossible under the original harvesting design — so the design changed, and the rock became a data row.
room: gameplay-systems
order: 3
project: Survival game (course project)
year: 2025
tech: [Blueprint, Unreal Engine 5, Data Tables]
defensibility: own
source: survival-harvest-system.md
media: []
---

*From a multiplayer survival game built as part of a course.*

## The idea that didn't fit

I wanted a rock called Boomstone. Harvestable with any tool, like any other rock — but also
shootable like an explosive barrel: one hit and it's gone, dropping pickups instead of handing
resources straight to the player.

Under the taught harvesting system that wasn't hard, it was **inexpressible**. A tree or rock was
swapped for a dedicated actor on the first tool hit, and that actor held its state. The only thing
that knew how to talk to it was a tool. A bullet had nowhere to go.

## The change

The actor was removed from the path entirely.

Harvest state now lives as data on the zone the rock sits in, keyed by which mesh it is and which
instance. Anything that deals damage — a hatchet, a pickaxe, a bullet — reports a number at a
location, and the zone updates the health. The zone never learns what hit it.

- **A new damage source needs no new system**, only a new caller.
- **An undamaged rock costs nothing.** An entry only appears on the first hit and disappears when
  the rock breaks, so memory scales with *partly harvested* rocks rather than all of them.
- **Species are table rows, not subclasses.** Adding a tree, a rock or its hit sound is a row keyed
  by the mesh the environment is already using.

## Boomstone, in data

With the damage path generalised, the mechanic needed no special code: any tool works because
nothing checks the tool; the gun deals enough to finish it; the row gives no direct resources; and
its destructible drops pickups instead. The design held up for a requirement invented after it was
built.

## Known limits

The asset loads on hit are synchronous, which is a hitch risk. Health is clamped to a hard-coded
maximum even though the starting value comes from the table. And the shooting path itself was
designed but never finished before the project ended — including scaling the pickups by the rock's
remaining health, so it couldn't be chipped down with a pickaxe and then shot for a full reward.
