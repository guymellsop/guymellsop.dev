---
title: A building that wields a player weapon
hook: A missile-defence turret assembled almost entirely from systems that already existed — it holds a rocket launcher rather than being one.
room: combat-and-feel
order: 2
project: Survival game (course project)
year: 2025
tech: [Blueprint, Unreal Engine 5, Multiplayer]
defensibility: own
source: survival-defence-turret.md
media:
  - type: video
    src: https://media.guymellsop.dev/missile-defence-turret.mp4
    poster: /posters/missile-defence-turret.jpg
    caption: Left, a client watching the turret; right, the server player firing at it. The turret swings to face each rocket and intercepts it — on both machines.
---

*My own addition to a multiplayer survival game built during a course — not part of the brief, but an extension of the taught building and weapon systems.*

## The point

The turret doesn't have a weapon. It **holds** one — a child actor of the same launcher class the
player uses, fired through the same interface and homing on its target through the same component.
The interceptor missile is the player's missile.

So the turret's own contribution is small: a detection sphere that only notices projectiles, a
decision about what to shoot, and a rotation. Everything else was already built.

## Friend or foe

The ownership model from the building system decides what to intercept. A player-owned turret
ignores that player's own projectiles; a tribe-owned one ignores its tribe's. And interceptors are
tagged so turrets don't intercept each other's interceptors — without that, two facing turrets
would chase each other's missiles indefinitely.

## Feel

- **It winds up.** The turret swings to face the threat on an eased curve, visible to every player,
  and only fires when the swing completes.
- **It leads the target**, aiming at roughly where the incoming missile will be in half a second.
  That's for the eye, not the hit — the interceptor's homing guarantees the hit. The rotation just
  makes the turret visibly respond to the threat.
- **It can be overwhelmed.** It handles one interception at a time and spends ammunition from its
  own storage for each. Fire enough missiles at once and some get through — which is what makes it
  something players get to outplay.

## Known limits

The existing weapon checked the player's hotbar for ammo, and a building has no hotbar, so a turret
flag skips that check. The cleaner design — an ammo-source interface that both players and storage
containers implement — was visible at the time. It wasn't worth changing a base class every weapon
depended on, late in the project, for one consumer.
