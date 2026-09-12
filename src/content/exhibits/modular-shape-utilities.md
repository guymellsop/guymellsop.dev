---
title: ModularShapeUtilities
hook: An Unreal plugin for cheap collision on stylised geometry — built because a wave of eight hundred blocks wouldn't run.
room: tools-and-authoring
order: 1
tier: front
frontRank: 2
project: ModularShapeUtilities
year: 2026
tech: [Unreal Engine 5, C++, Editor Tooling, Procedural Geometry]
defensibility: directed
source: PORTFOLIO_PLAN.md#31
media: []
---

A UE5 plugin providing procedural CSG kitbashing and collision-mesh generation: author a shape
tree in the level, paint it, and bake out a mesh, its collision, its material and its data asset
in one pass.

## Where it came from

I was building a rippling surface for a puzzle game — several hundred blocks, each moving
independently. Made of static mesh components it fell over at a density of about twenty, long
before it looked like anything.

The way out was to stop asking one system to do both jobs:

> **Primitive shapes for collision. Let the render thread do the visuals.**

That worked, so I used it again for a self-assembling staircase. Then it stopped being a trick I
kept reaching for and became a plugin.

That is the whole pitch. It isn't an opinion about collision cost in the abstract — it's the
packaged version of a fix that rescued a level.

## What it does

- **A shape tree, not a mesh.** Shapes are a polymorphic tree of nodes — lofted primitives,
  grouping anchors, and procedural nodes that interpolate between two shapes across a generated
  run of children. Every node carries its own transform, sockets and paint data.
- **Reusable recipes.** A shape tree saves to a data asset, so a design can be loaded into any
  actor and re-baked.
- **Painting in the viewport.** Per-face texture layer colours, applied by clicking the shape
  itself, hit-tested against the same geometry the renderer uses — so what you click is what you
  see.
- **A bake layout you author.** Rather than fixed output paths, the bake is driven by a tree of
  folders and slots carrying name rules with tokens (`{AssetName}`, `{NodeName}`, `{Index}`). The
  preview panel and the bake call the same resolver, so they cannot disagree about what will be
  written or where.
- **One entry point.** Resolve, validate, scan for conflicts, then write: mesh geometry, simple
  collision, sockets, the compound data asset, rasterised textures, the material instance and the
  paint profile.

## Why it's built this way

The data model is a **polymorphic instanced UObject tree rather than a flat array of structs** —
because a shape node has to contain shape nodes, and a struct cannot contain itself. Each node
gets its own inline, polymorphic editor widget as a direct consequence.

That constraint is one I'd hit before, in a puzzle game, building a mechanic around tree
structures. It's the reason the plugin's spine looks the way it does.

## Status

Pending release on Fab.
