---
title: Density as a parameter
hook: Spawn zones that tile themselves from one extent and a count — resizing the whole grid went from hours of hand-placement to seconds.
room: gameplay-systems
order: 1
tier: front
frontRank: 5
project: Survival game (course project)
year: 2025
tech: [Blueprint, Unreal Engine 5, Multiplayer]
defensibility: own
source: survival-zone-system.md
media: []
---

*From a year-long multiplayer survival game built as part of a course. The taught version of this
system worked. This is what I rebuilt once I understood it well enough not to break it.*

## The problem

Animals spawn in zones: large volumes that, when a player walks in, populate themselves, and
clean up when the last player leaves. The spawning logic was sound. The *authoring* model was
one actor per zone, hand-placed into a grid across the whole map.

Wanting more or fewer zones meant resizing and repositioning dozens of volumes by hand, with no
guarantee the result tiled cleanly.

## The change

One manager actor. You give it an extent and how many zones per row; it computes the rest.

- Cell size is **derived from the count**, so the grid can't have gaps or overlaps — coverage
  isn't achieved by care, it's arithmetic.
- Each zone's row and column come from its **index**, so a cell can be switched off (open ocean,
  say) with a single flag and nothing after it shifts.
- Every zone gets a floating `A1`…`F6` label rendered from the same index, so a designer can look
  at the map and know which entry in the panel they're editing.

## What it cost, and how that was paid

Folding thirty-six zones into one actor loses something the original got for free: each actor
*was* a zone, so anything that hit one knew exactly which zone it was. Two things replaced that —
each zone component binds to its own box, so overlap events arrive already scoped; and anything
elsewhere in the world addresses a zone **by position**, through a library query that returns
something guaranteed to accept zone messages.

That turned out to matter more than the grid. Once zones were addressable, foliage respawn,
harvesting and interactable spawning all hung their lifetimes off them rather than tracking player
proximity themselves.

## Outcome

Resizing the grid or changing its density went from hours to seconds, and deciding which animals
spawn where moved into one panel instead of clicking through every zone in the level.

## Known limits

The label letters stop at F. The array length has to be a full rectangle, or the last row has real
gaps. And rows and columns share one input, so a 6×4 grid means counting to twenty-four yourself.
