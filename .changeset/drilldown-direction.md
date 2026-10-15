---
"@agencecinq/drilldown": minor
---

Reflect `data-direction` on the host (`forward` when drilling in, `back` when going up) right before each panel change, so CSS can animate the panels. `closeAll()` removes it, so a reset is not animated. The README documents an `@starting-style` recipe.
