---
"@agencecinq/drawer": major
"@agencecinq/sheet": major
"@agencecinq/utils": major
---

**@agencecinq/drawer**

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

**@agencecinq/sheet**

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

**@agencecinq/utils**

- Remove `EVENTS.DRAWER_TOGGLE`, `EVENTS.DRAWER_OPEN`, `EVENTS.DRAWER_CLOSE`, `EVENTS.SHEET_TOGGLE`, `EVENTS.SHEET_OPEN` and `EVENTS.SHEET_CLOSE`.
