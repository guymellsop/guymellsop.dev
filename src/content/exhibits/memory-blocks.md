---
title: A memory game nobody has solved in advance
hook: The board is generated, not authored — a pairing algorithm that degrades gracefully instead of retrying forever. Even I don't know the solution.
room: computer-science
order: 2
project: Neon Echo
year: 2026
tech: [Blueprint, Niagara, Algorithms]
defensibility: own
source: neon-echo.md#memory-blocks
media: []
---

A wall of blocks, each hiding a symbol. Find the pairs. The mechanic isn't new; the generation is.
Every attempt, and every failure, produces a fresh board.

## The rules the generator has to satisfy

- **Every block gets exactly one partner.**
- **Partners shouldn't sit directly next to each other** — side by side is too easy to spot.
  Diagonal is fine.
- **Neighbouring pairs shouldn't look alike**, in shape or in colour.
- **It must always finish.** A generator that sometimes hangs is worse than one that sometimes
  bends a rule.

## Pairing, in three tiers

A two-pointer loop walks the grid. For each block that still needs a partner, it tries three
things, cheapest first:

1. **Random.** Pick a random block in range. Reject it if it's already paired, or if it's directly
   adjacent. On rejection, try again — up to five times, then give up on this tier.
2. **Linear scan.** Walk the remaining candidates and sort them into two lists: *preferred* (not
   adjacent) and *acceptable* (adjacent, but unpaired).
3. **Relax the rule.** Pick randomly from *preferred*. Only if that list is empty, pick from
   *acceptable*.

So it always terminates, always pairs every block, and only breaks the adjacency rule when the board
genuinely leaves no other choice. That's the difference between an algorithm and a retry loop.

A debug widget records which tier produced each pair, so how often the fast path succeeds is
something I can see rather than assume.

## Adjacency, from a flat list

The blocks live in a one-dimensional array. To test whether two are neighbours, each index is
converted to a row and a column, and they're adjacent if they share a row and their columns differ
by one — or share a column and their rows differ by one.

## Variety without running out

Each pair gets a colour scheme and a set of visual parameters chosen at random, while avoiding ones
used recently. The obvious version of "don't repeat" either allows immediate repeats or eventually
has nothing left to choose from.

Instead, recently used values go into an exclusion list, and once that list grows past **half** the
available options, the oldest entry drops off. So consecutive pairs look different, and at least half
the options are always still available.

## Symbols without textures

The patterns aren't images. Each symbol is a set of sprites in a Niagara system, and which sprites
appear, what colour they are, and which are hidden is decided by one of about a dozen small boolean
functions, selected by an integer. The only actual texture in the whole puzzle is the red cross that
appears when you get it wrong.

That's why the symbols read as one family without ever repeating.

## Where it came from

Pattern-printing exercises and 2D matrix work in a C++ course. It's one of several course exercises
I've turned into a mechanic — the most recent is
[Trapping Rain Water, as a puzzle](/work/water-trap/).

## Known limits

"Partners aren't adjacent" is a strong preference, not a guarantee: on a crowded board the third tier
will accept an adjacent pair rather than fail. That's deliberate, but it means a lucky player can
occasionally get an easy one.
