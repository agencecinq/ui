# @agencecinq/modal

## 6.0.0

### Major Changes

- Drop `<cinq-modal-button>`: buttons open and close the dialog with invoker commands (`commandfor` + `command="show-modal"` / `"request-close"`), and `aria-pressed` goes away (APG Dialog uses a plain button).
- Move the `id` from `<cinq-modal>` to the `<dialog>`, drop `[data-dialog]`, and rename `$modal` to `$dialog`.
- Stop reflecting `open` on the host: the dialog's `open` is the only state.
- Drop `modal:toggle`, `modal:open` and `modal:close`: script opens with `show()`, and the dialog's native `toggle` event follows the state.
- Route `show-modal`, `request-close`, Escape and the backdrop click through `modal:before-open` / `modal:before-close`. A forced Escape closes without the hook.
- Close on a backdrop click only with `closedby="any"`, handled by the component in Safari until it supports the attribute. Clicks on the dialog padding no longer close it.
- Add `data-replace` on a `show-modal` button: the target opens in place of the modal holding the button. Like a navigation, the target accepts the open first (`modal:before-open`), then the current modal closes (`modal:before-close`), then the target opens. Without JavaScript, the target opens over it.
- `close(returnValue?)` sets `dialog.returnValue`, and keeps the `value` of a `request-close` button.
- Let `showModal()` choose the initial focus, so `autofocus` is honored.
- Requires invoker commands: Chrome 135, Firefox 144, Safari 26.2. See the README migration from 5.x.

## 5.0.0

### Major Changes

- Replace `detail.resolve()` with `detail.waitUntil(promise)` on `modal:before-open` / `modal:before-close`. `preventDefault()` now only cancels; pass a promise to defer. Several listeners can defer the same action, and a rejected promise cancels it. Requires `@agencecinq/utils` >= 7.7.0.
- `show()` and `close()` return `Promise<boolean>` (whether the call changed the state). A request made while another is deferred joins it instead of dispatching a second before-event.
- `modal:toggle` no longer carries `trap`: `data-trap` on buttons had no effect since the move to `<dialog>`.

### Patch Changes

- Sync the host `open` attribute when the dialog closes natively (`form[method=dialog]`, `dialog.close()`), so buttons and the next toggle stay in step.

## 4.0.1

### Patch Changes

- Remove unused `fs-extra` dependency.
- Add `engines.node` >= 18.

## 4.0.0

### Major Changes

- Align modal events with `@agencecinq/utils` 7.x: `modal:open`, `modal:close`, `modal:toggle`, `modal:before-open`, `modal:before-close` (replaces `modal-open`, etc.).
- Stop inlining `EVENTS` in the bundle. Import `@agencecinq/utils` at runtime (`peerDependencies` >= 7.0.0).

## 3.1.0

### Minor Changes

- ddbd6be: Add cancelable `before-open` / `before-close` hooks with `detail.resolve()` to drawer and modal. Align modal on `open` attribute + ACC like drawer.

  **@agencecinq/utils:** `MODAL_*` / `DRAWER_*` before events; `scheduleRestoreReturnFocus`.

  **Docs:** async bestiary playground demos, pixelate sandbox hooks, UX note on defer vs in-panel loading.

  **Hosts:** `#` private fields and `init`/`destroy` lifecycle consistency (accordion, calendar, combobox, disclosure-button, switch, tabs, windowsplitter).

## 3.0.0

### Major Changes

- c65b293: Shared return-focus helpers in utils; drawer exclusive restore fix; modal APG stack alignment.

  **@agencecinq/utils**

  - Add `rememberReturnFocus` / `restoreReturnFocus` (first-wins overlay session)
  - Rename internal `focus-trap` module to `focus` (public named exports unchanged)

  **@agencecinq/drawer**

  - Use shared return-focus helpers instead of restoring via `removeTrapFocus(trigger)`
  - Defer restore on close so exclusive multi-toggle keeps the original page opener

  **@agencecinq/modal** (breaking)

  - Require `id`; expose public `init` / `destroy`
  - Stacked native `showModal()` (no exclusive auto-close); scroll lock is consumer-owned
  - `modal-open` / `modal-close` payloads include `modal` id; buttons sync `aria-pressed` by id

## 2.0.3

### Patch Changes

- 264c92a: Resolve `aria-controls` targets via `Element.ariaControlsElements` instead of `parseList` + `getElementById`.

## 2.0.2

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

### Minor Changes

- 3594668: Spinbutton package

### Patch Changes

- Updated dependencies [3594668]
  - @agencecinq/utils@5.0.0

## 1.1.0

### Minor Changes

- Refacto

## 1.0.1

### Patch Changes

- Update event system

## 1.0.0

### Major Changes

- Create a new package in @agencecinq/shopify

### Patch Changes

- Updated dependencies
  - @agencecinq/utils@4.0.0
