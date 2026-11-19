---
"@agencecinq/accordion": minor
"@agencecinq/calendar": minor
"@agencecinq/combobox": minor
"@agencecinq/disclosure-button": minor
"@agencecinq/drawer": minor
"@agencecinq/drilldown": minor
"@agencecinq/dropzone": minor
"@agencecinq/dual-scroll": minor
"@agencecinq/modal": minor
"@agencecinq/pixelate": minor
"@agencecinq/sheet": minor
"@agencecinq/slider": minor
"@agencecinq/snake": minor
"@agencecinq/spinbutton": minor
"@agencecinq/switch": minor
"@agencecinq/tabs": minor
"@agencecinq/toast": minor
"@agencecinq/windowsplitter": minor
---

- Import `@agencecinq/utils` rather than bundle it, and list it in `dependencies` instead of `peerDependencies`: a page built with Vite or another bundler gets it with the component and loads one copy for all the components. A page without a bundler maps `@agencecinq/utils` in its import map.
