# @agencecinq/drawer

## 5.0.3

### Patch Changes

- 264c92a: Resolve `aria-controls` targets via `Element.ariaControlsElements` instead of `parseList` + `getElementById`.

## 5.0.2

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

## 5.0.0

### Minor Changes

- 3594668: Spinbutton package

### Patch Changes

- Updated dependencies [3594668]
  - @agencecinq/utils@5.0.0

## 4.1.3

### Patch Changes

- 5000b68: Fix package.json
- Updated dependencies
  - @agencecinq/utils@4.0.1

## 4.1.1

### Patch Changes

- y

## 4.1.0

### Minor Changes

- Refacto

## 4.0.0

### Major Changes

- Create a new package in @agencecinq/shopify

### Patch Changes

- d8e4559: Fix enableScroll missing false parameter
- Updated dependencies
  - @agencecinq/utils@4.0.0

## 3.0.0

### Major Changes

- Bump

### Patch Changes

- Updated dependencies
  - @agencecinq/utils@3.0.0
