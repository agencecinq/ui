---
"@agencecinq/switch": major
"@agencecinq/utils": major
"@agencecinq/accordion": patch
---

Switch 3.0: drop JS `.focus` class, `[data-switch-input]`, and `SwitchDetail`; expose public `init`/`destroy`; use `event.key`; sync optional input via `update()`.

Utils 6.0: remove `keycode` export.

Accordion: migrate keyboard handlers from `keyCode` to `event.key`.
