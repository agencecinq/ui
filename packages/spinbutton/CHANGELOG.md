# @agencecinq/spinbutton

## 4.1.1

### Patch Changes

- Updated dependencies [ff4db3c]
  - @agencecinq/utils@11.0.0

## 4.1.0

### Minor Changes

- 40544f4: - Import `@agencecinq/utils` rather than bundle it, and list it in `dependencies` instead of `peerDependencies`: a page built with Vite or another bundler gets it with the component and loads one copy for all the components. A page without a bundler maps `@agencecinq/utils` in its import map.

### Patch Changes

- Updated dependencies [0508d43]
- Updated dependencies [2043c18]
  - @agencecinq/utils@10.0.0

## 4.0.0

### Major Changes

- Align change event with `@agencecinq/utils` 7.x: `spinbutton:change` (replaces `spinbutton-change`).
- Stop inlining `EVENTS` in the bundle. Import `@agencecinq/utils` at runtime (`peerDependencies` >= 7.0.0).

## 3.0.0

### Major Changes

- Rename host data attributes: `data-spinbutton-step` → `data-step`, `data-spinbutton-delay` → `data-delay`.

## 2.0.0

### Major Changes

- 2b95ef7: HTML-first spinbutton refactor: `button[name="increase"]` / `button[name="decrease"]` replace `data-spinbutton-action`. Drop `data-spinbutton-text` and the `Text` type; add optional `formatValue` (like windowsplitter) for `aria-valuetext` and an optional `[aria-live]` child. Export `FormatValue` and `Detail`; default event throttle delay is 100ms. Add public `init()` / `destroy()` lifecycle.

## 1.0.4

### Patch Changes

- ec6a727: Add `parseNumber` and `parseBoolean` helpers alongside `parseList` in a single `parse` module, and use them in combobox, accordion, and spinbutton.

## 1.0.3

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

## 1.0.2

### Patch Changes

- Export public TypeScript interfaces (`Text`, `Options`, `Value`, `SpinbuttonChangeDetail`) from the package entry point.

## 1.0.0

### Major Changes

- 3594668: Spinbutton package

### Patch Changes

- Updated dependencies [3594668]
  - @agencecinq/utils@5.0.0
