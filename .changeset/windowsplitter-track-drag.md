---
"@agencecinq/windowsplitter": patch
---

- Follow the separator with `trackDrag()` from `@agencecinq/utils` instead of its own pointer handling. Same behavior: the value follows the pointer from the grab offset, `[dragging]` is set from the press, and a fixed separator still toggles on a press without dragging.
- Test the drags in Chromium, Firefox and WebKit.
