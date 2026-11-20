---
"@agencecinq/accordion": minor
---

- Find each panel body through `ariaControlsElements` alone, without reading `aria-controls` with `getElementById()` when the property is missing, like the tabs, the disclosure button, the disclosure navigation and the window splitter. Browsers without `ariaControlsElements` (before Chrome 135, Firefox 136 and Safari 16.4) throw on init.
