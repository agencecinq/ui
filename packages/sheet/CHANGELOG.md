# @agencecinq/sheet

## 3.2.0

### Minor Changes

- 40544f4: - Import `@agencecinq/utils` rather than bundle it, and list it in `dependencies` instead of `peerDependencies`: a page built with Vite or another bundler gets it with the component and loads one copy for all the components. A page without a bundler maps `@agencecinq/utils` in its import map.

### Patch Changes

- Updated dependencies [0508d43]
- Updated dependencies [2043c18]
  - @agencecinq/utils@10.0.0

## 3.1.0

### Minor Changes

- Follow the handle and the pull up to open with `trackDrag()`. Requires `@agencecinq/utils` >= 9.1.0.
- A drag the browser cancels now snaps back instead of being read as a release.

## 3.0.0

### Major Changes

- Drop `<cinq-sheet-button>`: buttons open and close the dialog with invoker commands, and `aria-expanded` goes away from modal sheet buttons.
- Move the `id` from `<cinq-sheet>` to the `<dialog>`.
- Replace `data-modal="false"` with `popover` on the dialog, toggled with `command="toggle-popover"`. The browser handles `aria-expanded`, Escape, a press outside, focus in and out, and one sheet open at a time. Escape and a press outside close it without `sheet:before-close`, and `<form method="dialog">` does not close it.
- Move the pull up to open from `<cinq-sheet-button>` to the sheet: any button that opens the closed sheet takes the gesture. The sheet opens after the `pointerup`, so a modal sheet with `closedby="any"` no longer takes it for a light dismiss.
- Stop reflecting `open` on the host: the dialog is the only state. `[dragging]` and `--cinq-sheet-drag-offset` stay on the host. `<cinq-sheet open>` no longer opens on load.
- Rename `open(trigger?)` to `show()`, drop `toggle()`, and let `close(returnValue?)` set `dialog.returnValue` on a modal sheet.
- Drop `sheet:toggle`, `sheet:open` and `sheet:close` with the `SheetDetail`, `ToggleDetail` and `OpenDetail` types: the dialog's native `toggle` event follows the state.
- Drop the exclusive close among modal sheets: add `data-replace` on a button to open the next sheet in place of the current one.
- Ignore a forced Escape instead of canceling it, and close on a backdrop click with `closedby="any"` in Safari.
- Liquid snippet: `id` on the dialog.
- Test in Chromium, Firefox and WebKit.
- Requires invoker commands: Chrome 135, Firefox 144, Safari 26.2. See the README migration from 2.x.

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
