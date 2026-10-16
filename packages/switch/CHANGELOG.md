# @agencecinq/switch

## 4.0.0

### Major Changes

- 0180c76: The switch is a form-associated custom element and takes part in forms like a checkbox: with a `name` on the host, it submits its `value` (`"on"` by default) while on. `form.reset()` brings back the markup state, the browser restores it on return, and `disabled` on the switch or on a `<fieldset>` around it leaves it out of the tab order and the form, matches `:disabled` and is announced as disabled. The hidden checkbox and the `$input` property are gone: move `name` and `value` from the input to the host, and drop `aria-disabled="true"` and `tabindex="-1"` next to `disabled`. The README has the migration steps.

  A `<label for>` or a wrapping `<label>` names the switch and toggles it on click, as on a native field.

  `aria-checked` is the only state, as in the APG example: the `checked` attribute is gone. Style with `[aria-checked="true"]` instead of `[checked]`, and call `activate()` / `deactivate()` instead of setting `checked`. Writing `aria-checked` directly changes the state without events, and the form value follows.

## 3.0.1

### Patch Changes

- ddbd6be: Add cancelable `before-open` / `before-close` hooks with `detail.resolve()` to drawer and modal. Align modal on `open` attribute + ACC like drawer.

  **@agencecinq/utils:** `MODAL_*` / `DRAWER_*` before events; `scheduleRestoreReturnFocus`.

  **Docs:** async bestiary playground demos, pixelate sandbox hooks, UX note on defer vs in-panel loading.

  **Hosts:** `#` private fields and `init`/`destroy` lifecycle consistency (accordion, calendar, combobox, disclosure-button, switch, tabs, windowsplitter).

## 3.0.0

### Major Changes

- b523376: Switch 3.0: drop JS `.focus` class, `[data-switch-input]`, and `SwitchDetail`; expose public `init`/`destroy`; use `event.key`; sync optional input via `update()`.

  Utils 6.0: remove `keycode` export.

  Accordion: migrate keyboard handlers from `keyCode` to `event.key`.

## 2.0.1

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

## 2.0.0

### Major Changes

- Add `@agencecinq/switch` Web Component (`<cinq-switch>`) with activate/deactivate/toggle API, WAI-ARIA switch pattern support, and interactive docs playground. Export `SWITCH_ACTIVATE` and `SWITCH_DEACTIVATE` from `@agencecinq/utils`. Align disclosure-button event handlers to `handle*` naming convention.

### Patch Changes

- Updated dependencies
  - @agencecinq/utils@5.0.3

## 1.0.0

### Major Changes

- Add `@agencecinq/switch` package with `<cinq-switch>` Web Component, activate/deactivate/toggle API, and typed event details. Export `SWITCH_ACTIVATE` and `SWITCH_DEACTIVATE` from `@agencecinq/utils`.
