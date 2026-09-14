---
title: Trapping Rain Water, as a puzzle
hook: A notoriously frustrating algorithm problem, turned into a mechanic where the player edits the terrain the algorithm runs over.
room: computer-science
order: 3
tier: deep
project: Neon Echo
year: 2025
tech: [Blueprint, C++, Algorithms]
defensibility: own
source: neon-echo.md#the-water-trap
media: []
---

*Trapping Rain Water* is the one where you're given a row of bars of varying heights and asked
how much water pools between them. It has a reputation.

I was set it as an exercise, passed it in C++, and then built a room out of it.

## Making it a mechanic rather than a demo

In the original problem the bar heights are **fixed input**. You compute the answer once and
you're done. A visualisation of that is a pretty picture, not a puzzle.

So the block heights are stored as a struct of two integers: **a stationary part and a movable
part.**

The player changes the movable half. The algorithm runs live over terrain they are editing, which
turns a function with a single answer into a **space to search** — you're not computing where the
water goes, you're looking for a configuration that traps the water you need.

That distinction is the whole thing. The algorithm's *input* becomes the object of play.

## Implemented twice

Once in C++ for the exercise, then again in Blueprint for the game — the second time in a
language without the idioms the problem is normally written in, which is a decent test of whether
you understood the algorithm or just recalled the shape of a solution.

## Why I keep doing this

It's the third course exercise I've turned into a mechanic. A tree-node data structure became a
pair of puzzles built around branching light. Pattern-printing and 2D matrix work became
[a memory game whose board is genuinely generated](/work/memory-blocks/) rather than authored — I
don't know the solution to it either.

Abstract exercises tend to look like systems to me before they look like homework.
