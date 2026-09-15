---
title: The magical stairs
hook: A curved staircase builds itself across a pit one step at a time — and unbuilds in reverse when the power goes out.
room: tech-art
order: 1
tier: front
frontRank: 1
project: Neon Echo
year: 2025
tech: [Niagara, Blueprint, Splines, HLSL]
defensibility: own
source: neon-echo.md#the-stairs
media:
  - type: video
    src: https://media.guymellsop.dev/magical-stairs-v2.mp4
    poster: /posters/magical-stairs.jpg
    caption: In game, a floor button builds the staircase step by step, the player climbs it, and it comes apart in reverse. Then in the editor, the curve is a spline and step count, size and mesh are parameters.
---

A laser strikes a receiver, a floor button activates, and eighty steps assemble themselves
along a curving spline across a pit. Cut the power and they come apart in the order they
arrived.

## The problem

Stairs that materialise are easy. Stairs that materialise, carry a player, and then
*un*-materialise without stranding them are a system — and it has to stay coherent if the
player interrupts it halfway.

## What it does

- **The path is a spline, but the rise is derived.** Each step's horizontal position comes
  from the spline; a *uniform height* option lerps its Z between the spline's endpoints. The
  designer draws the curve in plan and never touches a tangent to get even step heights.
- **Positions aren't synchronised — they're shared.** The visual and the collision compute
  position from the same spline with the same formula, so they cannot drift apart.
- **The visual is Niagara mesh particles; the collision is ordinary box components.** That
  split is why it can look like a GPU dissolve and still be something you walk on.
- **Solidity is a channel swap, not a boolean.** An unformed step overlaps the player and
  *ignores* the laser channel — so the beam that builds the staircase is never blocked by it.
- **Build and unbuild are one loop.** A direction flag decides whether the passing front
  solidifies or unsolidifies each step, so the two directions cannot fall out of step.

## Why it's built this way

A single hidden static mesh acts as the sampling source for all eighty steps: Niagara's mesh
sampler needs a real component with a real transform, and there is only one. Each particle's
local sample is re-framed into the spline's orientation at its own index. The alternative was
eighty real mesh components, which is what the earlier version did — and what made the
technique necessary in the first place.

## Known limits

The Blueprint side advances by accumulating delays while Niagara reads a normalised progress
value — two clocks, so the *timing* of the solid front can drift under a hitch even though the
positions can't. The fix is designed but not yet built: drive the iteration from a timeline so
both sides become functions of the same 0–1 progress.

There's also a collision edge case: an unformed step can be overlapped, so something standing inside a
step's volume when it solidifies gets trapped. For now the player simply can't climb faster than
collision switches on ahead of them. The proper fix — clearing anything inside a step before it turns
solid — is designed but deferred.
