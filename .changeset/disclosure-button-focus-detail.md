---
"@agencecinq/disclosure-button": major
---

Drop JS `.focus` class; rename event detail `el` → `$button`; document `init`/`destroy`.

- Remove `focus` / `blur` listeners (style with `:focus-visible`)
- Event detail field `el` renamed to `$button` (breaking)
- Document `init` / `destroy`, `ariaControlsElements` browser support, destroy→re-init
