---
"@agencecinq/slider": patch
"@agencecinq/utils": patch
---

**@agencecinq/slider**

- Follow the thumbs with `trackDrag()` from `@agencecinq/utils` instead of its own pointer handling. Same behavior: the value follows the pointer from the grab offset, `[dragging]` is set from the press, and a non-primary button is ignored.
- Test the drags in Chromium, Firefox and WebKit.

**@agencecinq/utils**

- `trackDrag()` calls `start` once the gesture holds the pointer and the host has `[dragging]`, so a component can act on the press, and undoes both when `start` returns `false`.
