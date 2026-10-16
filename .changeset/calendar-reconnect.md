---
"@agencecinq/calendar": patch
---

A calendar moved in the DOM keeps dispatching `calendar:change`, and clicking the day already picked in `mode="single"` no longer dispatches it again.
