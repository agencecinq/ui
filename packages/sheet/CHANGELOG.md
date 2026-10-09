# @agencecinq/sheet

## 2.0.0

### Major Changes

- Replace `detail.resolve()` with `detail.waitUntil(promise)` on `sheet:before-open` / `sheet:before-close`. `preventDefault()` now only cancels; pass a promise to defer. Several listeners can defer the same action, and a rejected promise cancels it. Requires `@agencecinq/utils` >= 7.7.0.
- `open()`, `close()` and `toggle()` return `Promise<boolean>` (whether the call changed the state). A request made while another is deferred joins it instead of dispatching a second before-event.
- A deferred handle pull keeps its offset until the close commits, and snaps back if it is canceled.

## 1.0.1

### Patch Changes

- Ignore only the click that follows a pull on `cinq-sheet-button`, so a later keyboard press is never swallowed.

## 1.0.0

### Major Changes

- Initial release: bottom sheet on native `<dialog>`, content-sized, with drag to dismiss and a Liquid snippet plugin.
