# @agencecinq/combobox

## 1.0.4

### Patch Changes

- ddbd6be: Add cancelable `before-open` / `before-close` hooks with `detail.resolve()` to drawer and modal. Align modal on `open` attribute + ACC like drawer.

  **@agencecinq/utils:** `MODAL_*` / `DRAWER_*` before events; `scheduleRestoreReturnFocus`.

  **Docs:** async bestiary playground demos, pixelate sandbox hooks, UX note on defer vs in-panel loading.

  **Hosts:** `#` private fields and `init`/`destroy` lifecycle consistency (accordion, calendar, combobox, disclosure-button, switch, tabs, windowsplitter).

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

- Add `@agencecinq/combobox` with `<cinq-combobox>` Web Component for editable list autocomplete (managed and external modes, async search with AbortSignal, host events). Export `COMBOBOX_LOADING`, `COMBOBOX_LOADED`, `COMBOBOX_UPDATE`, `COMBOBOX_SUBMIT`, and `COMBOBOX_EMPTY` from `@agencecinq/utils`. Add combobox docs page and live playground.

### Patch Changes

- Updated dependencies
  - @agencecinq/utils@5.0.5
