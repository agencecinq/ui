---
"@agencecinq/store": minor
---

A change set by a listener now waits until the current one has reached every listener, so all listeners get the changes in order and end on the current state; over 100 chained changes, `set()` throws instead of looping. A `mutate()` action can resolve to a function of the state current once it settles, to keep the changes made while it waited.
