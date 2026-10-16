# @agencecinq/store

## 1.1.0

### Minor Changes

- 302034b: A change set by a listener now waits until the current one has reached every listener, so all listeners get the changes in order and end on the current state; over 100 chained changes, `set()` throws instead of looping. A `mutate()` action can resolve to a function of the state current once it settles, to keep the changes made while it waited.

## 1.0.0

### Major Changes

- Add `@agencecinq/store`, a tiny observable state store with normalized updates, selectors and a queue for async actions.
