# @agencecinq/accordion

## 4.2.0

### Minor Changes

- 5fda1c4: - Find each panel body through `ariaControlsElements` alone, without reading `aria-controls` with `getElementById()` when the property is missing, like the tabs, the disclosure button, the disclosure navigation and the window splitter. Browsers without `ariaControlsElements` (before Chrome 135, Firefox 136 and Safari 16.4) throw on init.

### Patch Changes

- Updated dependencies [ff4db3c]
  - @agencecinq/utils@11.0.0

## 4.1.0

### Minor Changes

- d4751f5: - Move the arrow, Home and End keys onto `focusByKey()` from `@agencecinq/utils`, the keyboard the tabs and the disclosure navigation share.
  - Arrow Left and Arrow Right follow the reading direction: they swap in a right-to-left context.
  - Keys pressed with Alt, Ctrl or Meta are left to the browser.
- 40544f4: - Import `@agencecinq/utils` rather than bundle it, and list it in `dependencies` instead of `peerDependencies`: a page built with Vite or another bundler gets it with the component and loads one copy for all the components. A page without a bundler maps `@agencecinq/utils` in its import map.

### Patch Changes

- Updated dependencies [0508d43]
- Updated dependencies [2043c18]
  - @agencecinq/utils@10.0.0

## 4.0.0

### Major Changes

- 1b92ddc: `data-deselect` is `data-deselectable` and the panel's `isDeselect` is `isDeselectable`, an adjective like `data-multiselectable`.

## 3.0.0

### Major Changes

- Rename data attributes: drop the `accordion` prefix (`data-hash`, `data-multiselectable`, `data-panel`, `data-header`, `data-open`, `data-deselect`, `data-inner`).

## 2.1.0

### Minor Changes

- Rename accordion events to `accordion:open` / `accordion:close` (`EVENTS.ACCORDION_*`).

## 2.0.2

### Patch Changes

- ddbd6be: Add cancelable `before-open` / `before-close` hooks with `detail.resolve()` to drawer and modal. Align modal on `open` attribute + ACC like drawer.

  **@agencecinq/utils:** `MODAL_*` / `DRAWER_*` before events; `scheduleRestoreReturnFocus`.

  **Docs:** async bestiary playground demos, pixelate sandbox hooks, UX note on defer vs in-panel loading.

  **Hosts:** `#` private fields and `init`/`destroy` lifecycle consistency (accordion, calendar, combobox, disclosure-button, switch, tabs, windowsplitter).

## 2.0.1

### Patch Changes

- b523376: Switch 3.0: drop JS `.focus` class, `[data-switch-input]`, and `SwitchDetail`; expose public `init`/`destroy`; use `event.key`; sync optional input via `update()`.

  Utils 6.0: remove `keycode` export.

  Accordion: migrate keyboard handlers from `keyCode` to `event.key`.

## 2.0.0

### Major Changes

- 8cb9b80: Breaking: rename public types to `Options` / `Detail` and export `Panel`. Fix URL hash matching for `#id` (and `#/id`). Cancel panel animation timers on destroy. Delegate panel-open handling on the host.

## 1.0.3

### Patch Changes

- ec6a727: Add `parseNumber` and `parseBoolean` helpers alongside `parseList` in a single `parse` module, and use them in combobox, accordion, and spinbutton.

## 1.0.2

### Patch Changes

- 264c92a: Resolve `aria-controls` targets via `Element.ariaControlsElements` instead of `parseList` + `getElementById`.

## 1.0.1

### Patch Changes

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

## 1.0.0

### Major Changes

- Add `@agencecinq/accordion` with `<cinq-accordion>` Web Component, panel open/close API, keyboard navigation, and hash support. Export `ACCORDION_PANEL_OPEN` and `ACCORDION_PANEL_CLOSE` from `@agencecinq/utils`. Harmonise component docs around HTML as source of truth and AD&D 2nd Edition playground examples. Fix RegisterComponents custom-element display rules so Tailwind layout utilities apply on spinbuttons.

### Patch Changes

- Updated dependencies
  - @agencecinq/utils@5.0.4
