---
"@agencecinq/utils": major
---

- Remove `addTrapFocus()`, `removeTrapFocus()`, `rememberReturnFocus()`, `restoreReturnFocus()` and `scheduleRestoreReturnFocus()`: no component uses them since the drawer, the sheet and the modal open a native `<dialog>`, which keeps the focus inside and gives it back on close (see the README migration from 10.x). `getFocusableElements()` stays.
