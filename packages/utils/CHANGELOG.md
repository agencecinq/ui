# @agencecinq/utils

## 4.0.1

### Patch Changes

- Add `CART_BEFORE_UPDATE` event constant to coordinate cart pre-update flows. Listeners can call `event.preventDefault()` on the dispatched `CustomEvent` to take ownership of subsequent section rendering (e.g. a free-samples controller batching its own sync into a single render).

## 4.0.0

### Major Changes

- Create a new package in @agencecinq/shopify

## 3.0.0

### Major Changes

- Bump
