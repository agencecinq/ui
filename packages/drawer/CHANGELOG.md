# @agencecinq/drawer

## 9.1.1

### Patch Changes

- Updated dependencies [ff4db3c]
  - @agencecinq/utils@11.0.0

## 9.1.0

### Minor Changes

- 40544f4: - Import `@agencecinq/utils` rather than bundle it, and list it in `dependencies` instead of `peerDependencies`: a page built with Vite or another bundler gets it with the component and loads one copy for all the components. A page without a bundler maps `@agencecinq/utils` in its import map.

### Patch Changes

- Updated dependencies [0508d43]
- Updated dependencies [2043c18]
  - @agencecinq/utils@10.0.0

## 9.0.0

### Major Changes

- Drop `<cinq-drawer-button>`: buttons open and close the dialog with invoker commands (`commandfor` + `command="show-modal"` / `"request-close"`), and `aria-expanded` goes away from modal drawer buttons (APG Dialog uses a plain button).
- Move the `id` from `<cinq-drawer>` to the `<dialog>`.
- Replace `data-modal="false"` with `popover` on the dialog: a non-modal drawer is toggled with `command="toggle-popover"`, and the browser handles `aria-expanded`, Escape, a press outside, focus in and out, and one drawer open at a time. Escape and a press outside close it without `drawer:before-close`, since a popover cannot cancel them.
- Stop reflecting `open` on the host: the dialog is the only state. `<cinq-drawer open>` no longer opens on load.
- Rename `open()` to `show()`, drop `toggle()`, and let `close(returnValue?)` set `dialog.returnValue` on a modal drawer, keeping the `value` of a `request-close` button.
- Drop `drawer:toggle`, `drawer:open` and `drawer:close`: script opens with `show()`, and the dialog's native `toggle` event follows the state.
- Route `show-modal`, `request-close`, `toggle-popover`, `show-popover`, `hide-popover`, Escape and the backdrop click of a modal drawer through `drawer:before-open` / `drawer:before-close`. A forced Escape closes without the hook.
- Close a modal drawer on a backdrop click only with `closedby="any"`, handled by the component in Safari until it supports the attribute. Clicks on the dialog padding no longer close it.
- Add `data-replace` on a button that opens: the target opens in place of the drawer holding the button. It replaces the exclusive drawers and the buttons that listed two ids.
- Stop locking scroll and forcing focus: lock scroll in CSS (`html:has(cinq-drawer > dialog:is(:modal, :popover-open))`), and the browser focuses the dialog content, honoring `autofocus`.
- Liquid snippet: `id` on the dialog with `closedby="any"`, or `popover` and a scrim after the dialog with `modal: false`.
- Test in Chromium, Firefox and WebKit.
- Requires invoker commands: Chrome 135, Firefox 144, Safari 26.2. See the README migration from 8.x.

## 8.0.0

### Major Changes

- Build on a native `<dialog>` opened with `showModal()`. Replace `[role="dialog"]` with a `<dialog>` inside `<cinq-drawer>`; drop `aria-modal` (implicit).
- Replace `[data-dom="overlay"]` with the dialog `::backdrop`. Backdrop click closes the drawer.
- Stop writing inline `opacity` / `visibility` and drop the `transitionend` listener. Animate from CSS with `[open]`, `@starting-style` and `transition-behavior: allow-discrete` (see README > Styling). Older browsers open and close without animation.
- Drop the JS focus trap and the `trap` option (`toggle({ trap })`, `data-trap`, `drawer:toggle` detail). The modal dialog makes the page inert. Escape goes through the native `cancel` event, still routed through `drawer:before-close`.
- A host rendered with `open` in the markup now opens its dialog on connect.
- `data-modal="false"` opens the dialog with `show()`, so controls outside it (a header burger) stay usable. Escape, outside press, scroll lock and focus return are handled by the component. Snippet `modal: false` adds a scrim.
- Liquid snippet: `<dialog>` markup, Tailwind animation classes, new `label` param (ID of the labelling element, as in `@agencecinq/sheet`); `classes` now applies to the dialog.
- Replace `detail.resolve()` with `detail.waitUntil(promise)` on `drawer:before-open` / `drawer:before-close`. `preventDefault()` now only cancels; pass a promise to defer. Several listeners can defer the same action, and a rejected promise cancels it. Requires `@agencecinq/utils` >= 7.7.0.
- `open()`, `close()` and `toggle()` return `Promise<boolean>` (whether the call changed the state). A request made while another is deferred joins it instead of dispatching a second before-event.

## 7.0.1

### Patch Changes

- Drop `fs-extra`. The Vite plugin uses `node:fs/promises` (`fs.cp`, Node 18+).
- Add `engines.node` >= 18. Document Node requirement for the Shopify plugin.

## 7.0.0

### Major Changes

- Align drawer events with `@agencecinq/utils` 7.x: `drawer:open`, `drawer:close`, `drawer:toggle`, `drawer:before-open`, `drawer:before-close` (replaces `drawer-open`, etc.).
- Stop inlining `EVENTS` in the bundle. Import `@agencecinq/utils` at runtime (`peerDependencies` >= 7.0.0).

## 6.1.0

### Minor Changes

- ddbd6be: Add cancelable `before-open` / `before-close` hooks with `detail.resolve()` to drawer and modal. Align modal on `open` attribute + ACC like drawer.

  **@agencecinq/utils:** `MODAL_*` / `DRAWER_*` before events; `scheduleRestoreReturnFocus`.

  **Docs:** async bestiary playground demos, pixelate sandbox hooks, UX note on defer vs in-panel loading.

  **Hosts:** `#` private fields and `init`/`destroy` lifecycle consistency (accordion, calendar, combobox, disclosure-button, switch, tabs, windowsplitter).

## 6.0.1

### Patch Changes

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

## 6.0.0

### Major Changes

- dadcbc8: Drop legacy `cid` (`id` only). Harden drawer lifecycle: trap/scroll on open/close, restore focus to opener, exclusive drawers, `aria-expanded` from events, `ariaControlsElements` only. Docs demos for exclusive and multi-button.

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
