---
title: A level that is a recursive function
hook: Doors are function calls, the way back is a stack, and the wall tells you how deep you are.
room: computer-science
order: 1
tier: front
frontRank: 3
project: Neon Echo
year: 2025
tech: [Blueprint, Unreal Engine 5, Level Design]
defensibility: own
source: neon-echo.md#the-recursion-level
media: []
---

A room with two floor buttons, and the player's job is to call `GetCubes(Root, 0)` — by walking
it.

## The mapping

| Recursion | Level |
|---|---|
| a call | walking through a door |
| the return address | a pushed location |
| which branch you're in | how many times you've used that door |
| returning | walking back, and popping |
| stack depth | tally marks glowing above the exit |

The depth counter is diegetic. The level states its own stack depth in its own visual language,
rather than in a debug overlay.

## The room moves, not the player

There is one room. Everything in it is attached to a single volume, and the hallways are four box
collisions that get relocated wherever they're needed.

When the player crosses a threshold, a dot product against the hallway's forward vector confirms
they're heading the right way. Going deeper, the entry volume's position is set to the exit
volume's — after the outgoing location is pushed.

So the player walks further into a recursion that is physically **one room being repositioned
around them.**

## State

- an array of **pushed locations**, used as a stack
- an array of **traversed exit volumes**, the call path
- a map of **exit volume → visit count**, indexing into the set of actors that should be visible
  and collidable for that depth

The visit count is what makes it a recursion rather than a corridor: the same door, entered at a
different depth, opens onto a different room.

## Making it survive a real level

Two problems break any "attach everything inside this volume" approach the moment it meets
content that wasn't built for it, and both needed solving:

- an **opt-out tag** for actors that happen to sit inside the volume but shouldn't travel with it
- **actors with no primitive component** — spot lights and similar — get attached to one that has
  a primitive, so they move with the room instead of being left behind

## Known limits

Time dilation runs during a transition. That's not a stylistic choice — relocating a room is not
a cheap operation, and slowing game time buys the engine more real frames per unit of simulated
time to absorb it. It's also unmeasured: I know the cost is there, I don't yet know whether the
cushion is the right size.

The pushed locations and the traversed volumes live in two parallel arrays that are pushed and
popped together. One array of a two-field struct would make them impossible to desynchronise, and
that's the change I'd make first.
