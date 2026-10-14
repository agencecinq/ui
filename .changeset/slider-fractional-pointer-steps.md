---
"@agencecinq/slider": patch
---

Dragging honours fractional `data-step` again: pointer values are no longer rounded to integers before snapping, and snapped values are free of float noise (`4.2`, not `4.199999999999999`).
