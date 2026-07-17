# @agencecinq/utils

## 5.0.5

### Patch Changes

- Add `@agencecinq/combobox` with `<cinq-combobox>` Web Component for editable list autocomplete (managed and external modes, async search with AbortSignal, host events). Export `COMBOBOX_LOADING`, `COMBOBOX_LOADED`, `COMBOBOX_UPDATE`, `COMBOBOX_SUBMIT`, and `COMBOBOX_EMPTY` from `@agencecinq/utils`. Add combobox docs page and live playground.

## 5.0.4

### Patch Changes

- Add `@agencecinq/accordion` with `<cinq-accordion>` Web Component, panel open/close API, keyboard navigation, and hash support. Export `ACCORDION_PANEL_OPEN` and `ACCORDION_PANEL_CLOSE` from `@agencecinq/utils`. Harmonise component docs around HTML as source of truth and AD&D 2nd Edition playground examples. Fix RegisterComponents custom-element display rules so Tailwind layout utilities apply on spinbuttons.

## 5.0.3

### Patch Changes

- Add `@agencecinq/switch` Web Component (`<cinq-switch>`) with activate/deactivate/toggle API, WAI-ARIA switch pattern support, and interactive docs playground. Export `SWITCH_ACTIVATE` and `SWITCH_DEACTIVATE` from `@agencecinq/utils`. Align disclosure-button event handlers to `handle*` naming convention.

## 5.0.2

### Patch Changes

- Add `@agencecinq/disclosure-button` package with `DisclosureButton` class, open/close/toggle API, and typed event details. Export `DISCLOSURE_BUTTON_OPEN` and `DISCLOSURE_BUTTON_CLOSE` from `@agencecinq/utils`.

## 5.0.0

### Major Changes

- 3594668: Spinbutton package

## 4.0.2

### Patch Changes

- Add `CART_BEFORE_ADD` event constant for batching extra items into a single `/cart/add.js` request. Listeners receive a mutable `items` array in `event.detail` and can push their own additions (e.g. free samples) before the AddToCart caller fires the request.

## 4.0.1

### Patch Changes

- Add `CART_BEFORE_UPDATE` event constant to coordinate cart pre-update flows. Listeners can call `event.preventDefault()` on the dispatched `CustomEvent` to take ownership of subsequent section rendering (e.g. a free-samples controller batching its own sync into a single render).

## 4.0.0

### Major Changes

- Create a new package in @agencecinq/shopify

## 3.0.0

### Major Changes

- Bump
