---
title: One prompt, by construction
hook: Two interaction prompts could appear at once. The fix wasn't a better trigger volume — it was changing who owns the prompt.
room: gameplay-systems
order: 2
project: Survival game (course project)
year: 2025
tech: [Blueprint, Unreal Engine 5, Multiplayer]
defensibility: own
source: survival-interact-system.md
media: []
---

*My redesign of a taught system, from a multiplayer survival game built during a course.*

## The problem

The taught interaction system put a capsule at the player's waist. Anything interactable that
overlapped it showed its own 3D prompt. Stand between two things and you'd see two prompts, while
only one could actually be used.

## The diagnosis

Tuning the capsule couldn't fix that, because the cause wasn't its shape. **Every interactable
owned its own prompt**, so N nearby objects meant N prompts, and "show only one" was a rule someone
had to remember to enforce.

So ownership moved to the player, who holds a single reference to the current target. Switching
target hides the old prompt before showing the new one. One variable can't hold two values — so
two prompts stopped being possible rather than merely prevented.

## Broad phase, narrow phase

The capsule became a box in front of the player, and its job changed completely. It no longer
chooses anything; it keeps a list of candidates nearby. Only while that list is non-empty does a
short trace from the camera run, ten times a second, to pick the one actually being looked at.
Nothing nearby, nothing runs.

## Foliage you can pick

Harvestable plants are instanced meshes, thousands of them, and you can't give each one an actor.
So only the plant being looked at gets promoted — the server spawns an invisible collision proxy
beside it, and the zone it sits in owns how long that proxy lives. The plant itself is never
touched just to show a prompt; it's only removed when it's actually harvested.

The original design did the opposite: it removed the plant and spawned a replacement actor the
moment a prompt needed to appear. In multiplayer that meant looking at a bush was a server-side
change to the world.
