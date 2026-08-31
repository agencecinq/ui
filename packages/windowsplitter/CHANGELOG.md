# @agencecinq/windowsplitter

## 3.0.0

### Major Changes

- Rename host data attributes: drop the `windowsplitter` prefix (`data-mode`, `data-step`, `data-page`, `data-fixed`).
- Rename host CSS custom properties: `--value`, `--ratio`, `--offset` (was `--windowsplitter-*`).

## 2.0.1

### Patch Changes

- ddbd6be: Add cancelable `before-open` / `before-close` hooks with `detail.resolve()` to drawer and modal. Align modal on `open` attribute + ACC like drawer.

  **@agencecinq/utils:** `MODAL_*` / `DRAWER_*` before events; `scheduleRestoreReturnFocus`.

  **Docs:** async bestiary playground demos, pixelate sandbox hooks, UX note on defer vs in-panel loading.

  **Hosts:** `#` private fields and `init`/`destroy` lifecycle consistency (accordion, calendar, combobox, disclosure-button, switch, tabs, windowsplitter).

## 2.0.0

### Major Changes

- ec6a727: Make `<cinq-windowsplitter>` the layout wrapper: nest a `[role="separator"]` (or `slider`) as `$separator`, drop `parentElement` / `container` override. ARIA values and `aria-controls` live on the separator; CSS vars and events stay on the host. Drop exported `Orientation` type; rename detail/size types to `Detail` / `Size`; export `FormatValue`. Use shared `parseNumber` / `parseBoolean` from `@agencecinq/utils`.

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

- Add `@agencecinq/windowsplitter` with `<cinq-windowsplitter>` Web Component for accessible pane resizing (resize/clip/none modes, keyboard + pointer, collapse/restore). Export `WINDOWSPLITTER_CHANGE` from `@agencecinq/utils`. Add window splitter docs page and live playground.

### Patch Changes

- Updated dependencies
  - @agencecinq/utils@5.0.6
