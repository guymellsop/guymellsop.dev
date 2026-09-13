---
title: Thorg, Disgruntled Stone Mason
hook: A boss fought entirely with the puzzle toolkit — the cubes that solve rooms are also the weapons.
room: combat-and-feel
order: 1
tier: front
frontRank: 4
project: Neon Echo
year: 2026
tech: [Blueprint, Unreal Engine 5, Niagara, Animation Montages]
defensibility: own
source: neon-echo.md#boss-fights
media: []
---

An arena seals itself behind a wall of procedural bars. A stone golem with a grudge starts
throwing rocks. The player fights back with the same deployable cubes they have spent the last
fifteen rooms using to solve puzzles.

## The point

**No new weapon system was built for this.** The projectile-spawner cubes and platform-movers
that open doors and bridge gaps are, under pressure, an arsenal. The encounter is a test of
whether the puzzle toolkit holds up when something is trying to kill you.

What combat did need was **new projectile classes** — some deal damage on impact, others run a
damage trace when the player releases the fire button. They slot into the existing spawner as
new classes; the delivery system underneath didn't change. That's the payoff for building the
cubes as a chassis with a swappable payload rather than as one-off objects.

The same structure has room for more. One idea still on the list: spikes that, deployed close
enough together, trace between each other — so a scattered handful becomes an electric fence.

## Fiction that pays for itself

Gary, the relic accompanying the player, wronged a great many people in life. Part of his
punishment is that anyone who died holding a grudge against him gets placed into a boss, keeping
nothing of themselves except the grievance. Because the player has been carrying Gary's borrowed
power, the boss can't tell the two apart.

One premise answers three mechanical questions at once: why does this creature attack me, why is
each one different, and why is it shouting at my companion. Fiction chosen because it makes the
systems cheaper.

It also means a stone golem's murderous rage can be, on inspection, a contract dispute:

> "Oh, don't start with the 'unpaid overtime' argument again. The contract clearly specified a
> *functional tower*. You provided a glorified chimney."

## How the AI works, and what's wrong with it

Attack selection is a set of actor components, chosen when a move completes. Each holds an
animation montage played by its parent, and the montage's notify fires the attack.

The component structure is fine — composition-based attack selection is closer to how a lot of
action games work than a single monolithic tree, and driving hits from montage notifies is simply
the correct technique.

**What's missing is one layer: decision-making.** Picking at random when a move finishes is a
naive selection policy. A behaviour tree wouldn't improve how an attack *executes*; it would add
conditional selection, shared state and interrupts — "use the ranged attack because they're far
away and I'm hurt." Scoring the selection against some state would buy most of that on the
structure that already exists.

That's the next thing I'd change, and knowing precisely which layer is weak was worth more than
guessing the whole approach was wrong.
