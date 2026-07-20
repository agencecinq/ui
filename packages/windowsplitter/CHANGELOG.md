# @agencecinq/windowsplitter

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
