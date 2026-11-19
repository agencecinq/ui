---
"@agencecinq/disclosure-navigation": minor
---

- Move the arrow, Home and End keys onto `focusByKey()` from `@agencecinq/utils`, the keyboard the accordion and the tabs now share. The keys behave as before.
- `@agencecinq/utils` becomes a dependency, imported rather than bundled: a page built with a bundler gets it with the package, a page without one maps it in its import map.
