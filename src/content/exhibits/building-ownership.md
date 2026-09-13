---
title: Maintain the index, don't scan for it
hook: Handing a player's buildings over to their tribe used to search every structure on the server. Now it reads a list that was built for free.
room: gameplay-systems
order: 4
project: Survival game (course project)
year: 2025
tech: [Blueprint, Unreal Engine 5, Multiplayer]
defensibility: own
source: survival-building-ownership.md
media: []
---

*From a multiplayer survival game built as part of a course.*

## The problem

When a player joins a tribe, everything they've built becomes tribe property. When they leave, it
reverts. The taught approach found those buildings by fetching **every buildable on the server**,
comparing each one's owner name to the player's, collecting the matches, and then updating them.

Correct — and a whole-world scan with string comparisons, on every join, leave and kick, in a game
whose entire premise is that players build a lot.

## The change

A player's building component already sees every structure the moment it's placed. So it keeps a
reference then. Changing ownership becomes a loop over that list, proportional to what the player
actually built, with no scan and no name matching.

## Two details

**The list cleans itself.** If a structure has since been destroyed, the loop that updates
ownership also removes the dead reference as it passes. No separate cleanup pass.

**Joining and leaving are one function.** A single flag decides the direction: whether the tribe is
looked up at all, which owner name is shown, and what the ownership flag becomes. Two separate
functions would drift apart the first time one got changed and the other didn't.

## The honest trade

The original scan couldn't miss a building, however it came to exist. The list depends on every
building being registered when it's placed, and on that list surviving whatever happens to the
player. That's the right side of the trade for a game like this — but it is a trade, and the
invariant is worth writing down.
