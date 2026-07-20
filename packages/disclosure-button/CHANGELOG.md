# @agencecinq/disclosure-button

## 2.0.0

### Major Changes

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

## 1.1.1

### Patch Changes

- Add `@agencecinq/switch` Web Component (`<cinq-switch>`) with activate/deactivate/toggle API, WAI-ARIA switch pattern support, and interactive docs playground. Export `SWITCH_ACTIVATE` and `SWITCH_DEACTIVATE` from `@agencecinq/utils`. Align disclosure-button event handlers to `handle*` naming convention.
- Updated dependencies
  - @agencecinq/utils@5.0.3

## 1.1.0

### Minor Changes

- e5e3c14: Toggle the native `hidden` attribute on controlled regions. Linked triggers sync through bubbling disclosure events. `<cinq-disclosure-button>` Web Component with `DisclosureButton` class (aligned with drawer/modal button wrappers).

## 1.0.0

### Major Changes

- Add `@agencecinq/disclosure-button` package with `DisclosureButton` class, open/close/toggle API, and typed event details. Export `DISCLOSURE_BUTTON_OPEN` and `DISCLOSURE_BUTTON_CLOSE` from `@agencecinq/utils`.

### Patch Changes

- Updated dependencies
  - @agencecinq/utils@5.0.2
