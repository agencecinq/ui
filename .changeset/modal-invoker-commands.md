---
"@agencecinq/modal": major
"@agencecinq/utils": major
---

**@agencecinq/modal**

- Drop `<cinq-modal-button>`: buttons open and close the dialog with invoker commands (`commandfor` + `command="show-modal"` / `"request-close"`), and `aria-pressed` goes away (APG Dialog uses a plain button).
- Move the `id` from `<cinq-modal>` to the `<dialog>`, drop `[data-dialog]`, and rename `$modal` to `$dialog`.
- Stop reflecting `open` on the host: the dialog's `open` is the only state.
- Drop `modal:toggle`, `modal:open` and `modal:close`: script opens with `show()`, and the dialog's native `toggle` event follows the state.
- Route `show-modal`, `request-close`, Escape and the backdrop click through `modal:before-open` / `modal:before-close`. A forced Escape closes without the hook.
- Close on a backdrop click only with `closedby="any"`, handled by the component in Safari until it supports the attribute. Clicks on the dialog padding no longer close it.
- Add `data-replace` on a `show-modal` button: the target opens in place of the modal holding the button. Like a navigation, the target accepts the open first (`modal:before-open`), then the current modal closes (`modal:before-close`), then the target opens. Without JavaScript, the target opens over it.
- `close(returnValue?)` sets `dialog.returnValue`, and keeps the `value` of a `request-close` button.
- Let `showModal()` choose the initial focus, so `autofocus` is honored.

**@agencecinq/utils**

- Remove `EVENTS.MODAL_TOGGLE`, `EVENTS.MODAL_OPEN` and `EVENTS.MODAL_CLOSE`.
