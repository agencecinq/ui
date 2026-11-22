# @agencecinq/utils

## 11.0.2

### Patch Changes

- f65565b: Point the npm homepage to the package docs on agencecinq.github.io/ui, instead of the repository README.

## 11.0.1

### Patch Changes

- 7e9e5c5: Add the package description and author, so npm shows the description instead of the README badges. In utils, list the `types` condition first in `exports`, as TypeScript expects.

## 11.0.0

### Major Changes

- ff4db3c: - Remove `addTrapFocus()`, `removeTrapFocus()`, `rememberReturnFocus()`, `restoreReturnFocus()` and `scheduleRestoreReturnFocus()`: no component uses them since the drawer, the sheet and the modal open a native `<dialog>`, which keeps the focus inside and gives it back on close (see the README migration from 10.x). `getFocusableElements()` stays.

## 10.0.0

### Major Changes

- 2043c18: - Remove the environment exports `html`, `body`, `isDebug`, `scroll`, `mouse`, `breakpoints` and `production`, with the `pointermove` listener and the media queries they set up on import (see the README migration from 9.x).
  - Declare `"sideEffects": false`: the package does nothing on import, so a bundler keeps only what a page imports.

### Minor Changes

- 0508d43: - Add `focusByKey(event, elements, index)`, from `@agencecinq/disclosure-navigation`: the arrow, Home and End keys move focus between `elements`, wrapping, with left and right swapped in a right-to-left context and the keys pressed with a modifier left to the browser. It returns the index of the element that took the focus, so the accordion, the tabs and the disclosure navigation share one keyboard.

## 9.1.1

### Patch Changes

- `trackDrag()` calls `start` once the gesture holds the pointer and the host has `[dragging]`, so a component can act on the press, and undoes both when `start` returns `false`.

## 9.1.0

### Minor Changes

- Add `trackDrag(element, options)`: one pointer gesture at a time, with pointer capture, `[dragging]` on a host, and the distance of the drag with its speed over the last 50 ms, so a pause before the release reads as a stop and close events do not spike it. The component decides what the values mean. Types: `DragOptions`, `DragValues`, `DragEndValues`, `DragTracker`.
- Publish `dist` only: the package no longer ships its sources and build files.

## 9.0.0

### Major Changes

- 2e34715: Remove `EVENTS.DRAWER_TOGGLE`, `EVENTS.DRAWER_OPEN`, `EVENTS.DRAWER_CLOSE`, `EVENTS.SHEET_TOGGLE`, `EVENTS.SHEET_OPEN` and `EVENTS.SHEET_CLOSE`: `@agencecinq/drawer` 9.0 and `@agencecinq/sheet` 3.0 open with invoker commands and leave the after-events to the native `toggle` event.

## 8.0.0

### Major Changes

- c5c844c: Remove `EVENTS.MODAL_TOGGLE`, `EVENTS.MODAL_OPEN` and `EVENTS.MODAL_CLOSE`: `@agencecinq/modal` 6.0 opens with invoker commands and leaves the after-events to the native `toggle` event.

## 7.10.0

### Minor Changes

- 421e95f: Add `EVENTS.CALENDAR_RENDER` (`calendar:render`) and `EVENTS.CALENDAR_BEFORE_CHANGE` (`calendar:before-change`).

## 7.9.0

### Minor Changes

- Add `DROPZONE_CHANGE` and `DROPZONE_REJECT` event constants for `@agencecinq/dropzone`.

## 7.8.0

### Minor Changes

- Add `@agencecinq/drilldown`, a drill-down navigation Web Component with nested panels and back buttons, plus `DRILLDOWN_*` event constants on `@agencecinq/utils`.

## 7.7.0

### Minor Changes

- Add `dispatchBeforeEvent(target, name, detail)`: cancelable, non-bubbling before-event whose `detail.waitUntil(promise)` defers the action. `preventDefault()` or a rejected promise cancels it. Returns a boolean when nothing deferred, otherwise a promise. Types `WaitUntil` and `BeforeEventDetail<T>`.

## 7.6.0

### Minor Changes

- 19c183f: Add `SHEET_*` event constants for `@agencecinq/sheet`, and document the new Sheet component.

## 7.5.0

### Minor Changes

- Add `debounce(fn, wait)` alongside `throttle` for trailing delayed callbacks.

## 7.4.0

### Minor Changes

- Add `TOAST_OPEN` / `TOAST_CLOSE` (`toast:open` / `toast:close`) for `@agencecinq/toast`.

## 7.3.0

### Minor Changes

- Add `SNAKE_EAT`, `SNAKE_OVER`, and `SNAKE_REPLAY` event constants for `@agencecinq/snake`.

## 7.2.0

### Minor Changes

- Add `SLIDER_CHANGE` (`slider:change`) for `@agencecinq/slider`.

## 7.1.0

### Minor Changes

- Rename accordion events to `accordion:open` / `accordion:close`. Rename `EVENTS.ACCORDION_PANEL_*` to `EVENTS.ACCORDION_*`.

## 7.0.0

### Major Changes

- Harmonize all custom event names to `{package}:{action}` (e.g. `drawer:before-open`, `tabs:activate`, `spinbutton:change`). Rename `EVENTS.TAB_*` to `EVENTS.TABS_*`.

## 6.1.0

### Minor Changes

- ddbd6be: Add cancelable `before-open` / `before-close` hooks with `detail.resolve()` to drawer and modal. Align modal on `open` attribute + ACC like drawer.

  **@agencecinq/utils:** `MODAL_*` / `DRAWER_*` before events; `scheduleRestoreReturnFocus`.

  **Docs:** async bestiary playground demos, pixelate sandbox hooks, UX note on defer vs in-panel loading.

  **Hosts:** `#` private fields and `init`/`destroy` lifecycle consistency (accordion, calendar, combobox, disclosure-button, switch, tabs, windowsplitter).

## 6.0.0

### Major Changes

- b523376: Switch 3.0: drop JS `.focus` class, `[data-switch-input]`, and `SwitchDetail`; expose public `init`/`destroy`; use `event.key`; sync optional input via `update()`.

  Utils 6.0: remove `keycode` export.

  Accordion: migrate keyboard handlers from `keyCode` to `event.key`.

## 5.3.0

### Minor Changes

- c65b293: Shared return-focus helpers in utils; drawer exclusive restore fix; modal APG stack alignment.

  **@agencecinq/utils**

  - Add `rememberReturnFocus` / `restoreReturnFocus` (first-wins overlay session)
  - Rename internal `focus-trap` module to `focus` (public named exports unchanged)

  **@agencecinq/drawer**

  - Use shared return-focus helpers instead of restoring via `removeTrapFocus(trigger)`
  - Defer restore on close so exclusive multi-toggle keeps the original page opener

  **@agencecinq/modal** (breaking)

  - Require `id`; expose public `init` / `destroy`
  - Stacked native `showModal()` (no exclusive auto-close); scroll lock is consumer-owned
  - `modal-open` / `modal-close` payloads include `modal` id; buttons sync `aria-pressed` by id

## 5.2.1

### Patch Changes

- 1f15fe4: Add `@agencecinq/calendar` with `<cinq-calendar>` Web Component for single-date and range selection (ported from `@19h47/calendar`). Export `CALENDAR_CHANGE` from `@agencecinq/utils`. Add calendar docs page and live playgrounds.

## 5.2.0

### Minor Changes

- ec6a727: Add `parseNumber` and `parseBoolean` helpers alongside `parseList` in a single `parse` module, and use them in combobox, accordion, and spinbutton.

## 5.1.1

### Patch Changes

- 264c92a: Resolve `aria-controls` targets via `Element.ariaControlsElements` instead of `parseList` + `getElementById`.

## 5.1.0

### Minor Changes

- 2e12ffb: Simplify disclosure-button around HTML source of truth and shared utils.

  **@agencecinq/utils**

  - Add `dispatchEvent` helper for cancelable `CustomEvent`s
  - Add `parseList` for space-separated ARIA ID reference lists

  **@agencecinq/disclosure-button** (breaking)

  - Resolve targets via `Element.ariaControlsElements`
  - `aria-expanded` is `true` while any controlled region is visible; click closes all if any remain open
  - Add `update()` for external dismiss; drop automatic linked-trigger sync (app responsibility)
  - Require a native inner `<button>` (no `[data-button]` escape hatch)
  - Remove the `button` getter (`$button` remains)

  **Consumers**

  - Migrate to shared `dispatchEvent` / `parseList` from `@agencecinq/utils`

## 5.0.6

### Patch Changes

- Add `@agencecinq/windowsplitter` with `<cinq-windowsplitter>` Web Component for accessible pane resizing (resize/clip/none modes, keyboard + pointer, collapse/restore). Export `WINDOWSPLITTER_CHANGE` from `@agencecinq/utils`. Add window splitter docs page and live playground.

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
