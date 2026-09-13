---
title: Mesh asset overview tool
hook: Point it at a folder and every static mesh lays itself out in a labelled grid, sorted by name, size, triangle count or triangle density — no dragging assets into a level by hand.
room: tools-and-authoring
order: 2
project: Survival game (course project)
year: 2025
tech: [Blueprint, Unreal Engine 5, Editor Utilities, Asset Registry]
defensibility: own
source: survival-mesh-overview.md
media:
  - type: video
    src: https://media.guymellsop.dev/mesh-asset-overview.mp4
    poster: /posters/mesh-asset-overview.jpg
    caption: Laying out a foliage pack, switching to a building kit, and re-sorting by triangle density — the grid rebuilds live.
---

*From a multiplayer survival game built as part of a course.*

## The problem

Evaluating an asset pack means seeing its meshes side by side, at scale, in the engine. The taught
way to build an asset overview was to place them by hand: drag each mesh into a level, space it
out, and shuffle things about until you could compare them — then do it all again for the next
pack.

## What it does

An actor you drop into a level. Give it a content folder — or an explicit list of meshes, which
takes priority — and its construction script does the rest:

- **Finds every static mesh** under the folder through the asset registry, recursively.
- **Sorts them** by name, bounding size, triangle count, or triangle density.
- **Arranges them in a grid**, each mesh's row and column derived from its sorted position, with
  spacing and meshes-per-row as parameters.
- **Labels each one** with a 3D text component showing the asset name, with optional material and
  font.

Because it lives in the construction script, it's live: change the folder, the sort, or the
spacing, and the grid rebuilds in place.

## Details that matter

**Every mesh sits on the ground, whatever its pivot.** Each mesh is offset by the negative of its
local bounds' minimum Z, so a pack authored with inconsistent pivots still lines up on the floor.

**Labels follow the mesh, not the grid.** Each label is placed at the top of its own mesh's bounds
plus a margin, so it clears a tall tree and a flat rug alike.

**Numbers are sorted as text, deliberately.** Each mesh's sort key is its value — size, triangle
count, density or index — converted to fixed-width, zero-padded text, with the asset name appended.
Fixed width makes alphabetical order match numeric order (`0999` before `1000`, not after), and the
appended name means meshes with equal values fall back to sorting by name. One string sort handles
both. It works because every key is non-negative — which, for distances, counts and volumes, they
always are.

**Triangle density is the useful sort.** Triangles divided by bounding volume pushes over-detailed
small props to one end of the grid — the ones worth a look before they end up scattered across a
map by the thousand.

## Known limits

Spacing is a single value, so a pack that mixes large and small meshes either crowds the big ones
or spreads the small ones out. Deriving each cell from the largest bounds in the set would fix that.

It also loads every asset in the folder whenever the construction script runs, which is fine for a
pack and slow for a whole project.
