# @agencecinq/accordion

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
