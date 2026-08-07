---
"@agencecinq/utils": minor
"@agencecinq/drawer": minor
"@agencecinq/modal": minor
"@agencecinq/accordion": patch
"@agencecinq/calendar": patch
"@agencecinq/combobox": patch
"@agencecinq/disclosure-button": patch
"@agencecinq/switch": patch
"@agencecinq/tabs": patch
"@agencecinq/windowsplitter": patch
---

Add cancelable `before-open` / `before-close` hooks with `detail.resolve()` to drawer and modal. Align modal on `open` attribute + ACC like drawer.

**@agencecinq/utils:** `MODAL_*` / `DRAWER_*` before events; `scheduleRestoreReturnFocus`.

**Docs:** async bestiary playground demos, pixelate sandbox hooks, UX note on defer vs in-panel loading.

**Hosts:** `#` private fields and `init`/`destroy` lifecycle consistency (accordion, calendar, combobox, disclosure-button, switch, tabs, windowsplitter).
