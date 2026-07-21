---
"@agencecinq/windowsplitter": major
---

Make `<cinq-windowsplitter>` the layout wrapper: nest a `[role="separator"]` (or `slider`) as `$separator`, drop `parentElement` / `container` override. ARIA values and `aria-controls` live on the separator; CSS vars and events stay on the host. Drop exported `Orientation` type; rename detail/size types to `Detail` / `Size`; export `FormatValue`. Use shared `parseNumber` / `parseBoolean` from `@agencecinq/utils`.
