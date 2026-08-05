---
"@agencecinq/spinbutton": major
---

HTML-first spinbutton refactor: `button[name="increase"]` / `button[name="decrease"]` replace `data-spinbutton-action`. Drop `data-spinbutton-text` and the `Text` type; add optional `formatValue` (like windowsplitter) for `aria-valuetext` and an optional `[aria-live]` child. Export `FormatValue` and `Detail`; default event throttle delay is 100ms. Add public `init()` / `destroy()` lifecycle.
