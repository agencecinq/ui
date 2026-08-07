# @agencecinq/tabs

## 10.0.4

### Patch Changes

- ddbd6be: Add cancelable `before-open` / `before-close` hooks with `detail.resolve()` to drawer and modal. Align modal on `open` attribute + ACC like drawer.

  **@agencecinq/utils:** `MODAL_*` / `DRAWER_*` before events; `scheduleRestoreReturnFocus`.

  **Docs:** async bestiary playground demos, pixelate sandbox hooks, UX note on defer vs in-panel loading.

  **Hosts:** `#` private fields and `init`/`destroy` lifecycle consistency (accordion, calendar, combobox, disclosure-button, switch, tabs, windowsplitter).

## 10.0.3

### Patch Changes

- 264c92a: Resolve `aria-controls` targets via `Element.ariaControlsElements` instead of `parseList` + `getElementById`.

## 10.0.2

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

## 10.0.0

### Minor Changes

- 3594668: Spinbutton package

### Patch Changes

- Updated dependencies [3594668]
  - @agencecinq/utils@5.0.0

## 9.3.1

### Patch Changes

- y

## 9.3.0

### Minor Changes

- Fixes

## 9.2.0

### Minor Changes

- Fix refacto

## 9.1.0

### Minor Changes

- Update @agencecinq/tabs

## 9.0.0

### Major Changes

- Add @agencecinq/tabs
