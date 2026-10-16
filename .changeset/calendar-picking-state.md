---
"@agencecinq/calendar": minor
---

The calendar matches custom states for CSS: `:state(empty)` without a picked day, `:state(picking)` while a range waits for its end, and `:state(pending)` while a `waitUntil()` of `calendar:before-change` holds a change. The README shows hints that follow them in a `role="status"` element, which screen readers announce.
