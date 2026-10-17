[![](https://img.shields.io/npm/v/@agencecinq/modal)](https://www.npmjs.com/package/@agencecinq/modal)
[![](https://img.shields.io/npm/dm/@agencecinq/modal)](https://www.npmjs.com/package/@agencecinq/modal)

# @agencecinq/modal

> Before-hooks for the native modal `<dialog>`.

The platform already opens, closes and focuses a modal dialog: buttons drive
it with [invoker commands](https://developer.mozilla.org/en-US/docs/Web/API/Invoker_Commands_API),
`showModal()` makes the page inert and returns focus on close. `<cinq-modal>`
only adds what it lacks:

- `modal:before-open` / `modal:before-close`, to cancel or defer an open or a
  close with `waitUntil(promise)`;
- `data-replace` on a `show-modal` button, to open the next modal in place of
  the current one instead of over it;
- the backdrop click of `closedby="any"` in Safari, which does not support it
  yet.

## Installation

Requires **Node.js 18+** (build tooling).

```bash
pnpm add @agencecinq/modal
```

## Usage

```js
import "@agencecinq/modal";
```

```html
<button commandfor="newsletter" command="show-modal">Subscribe</button>

<cinq-modal>
  <dialog id="newsletter" closedby="any" aria-labelledby="newsletter-title">
    <h2 id="newsletter-title">Newsletter</h2>
    ...
    <button commandfor="newsletter" command="request-close">Close</button>
  </dialog>
</cinq-modal>
```

Importing `@agencecinq/modal` registers the Web Component. Without JavaScript,
or before the element is defined, the buttons still open and close the dialog:
only the hooks are missing.

> **HTML is the source of truth.** Provide dialog content, labelling, and focus
> targets yourself. Use an a11y linter (axe-core, Lighthouse) to catch invalid
> markup.

### Markup

| Element / attribute | Required | Role |
| ------------------- | -------- | ---- |
| `<cinq-modal>` | **Yes** | Host. Wraps one `<dialog>`. |
| `<dialog id>` | **Yes** | The modal. Buttons target its `id` with `commandfor`. |
| `closedby="any"` on `<dialog>` | No | Closes on a backdrop click. Without it, only Escape and buttons close the modal. |
| `autofocus` | No | Element focused on open. Defaults to the first focusable element. |
| `data-replace` on a `show-modal` button | No | Opens the target in place of the modal holding the button, instead of over it. The target's `modal:before-open` runs first: if it cancels, the current modal stays open. Without JavaScript, the target opens over it. |

### Commands

| Button | Effect | Hook |
| ------ | ------ | ---- |
| `command="show-modal"` | Opens the dialog. | `modal:before-open` |
| `command="request-close"` | Closes the dialog. The button `value` becomes `dialog.returnValue`. | `modal:before-close` |
| `command="close"` | Closes the dialog at once. | None |

Escape and the backdrop click (`closedby="any"`) go through
`modal:before-close` too. Direct calls skip the hooks, like on the platform:
`dialog.showModal()`, `dialog.close()`, `<form method="dialog">`, and Escape
when the browser forces the close (pressed repeatedly without user activation).

### API

| Method | Description |
| ------ | ----------- |
| `show()` | Opens the modal. Resolves `true` if this call opened it, `false` if already open or canceled. |
| `close(returnValue?)` | Closes the modal. Resolves `true` if this call closed it, `false` if already closed or canceled. |
| `init()` | Binds listeners. Called on connect; call `destroy()` first to re-bind. |
| `destroy()` | Removes listeners and closes the dialog. Called on disconnect. |

| Property | Description |
| -------- | ----------- |
| `$dialog` | The `<dialog>`. |
| `trigger` | The button that last opened the modal. |

### Background scroll

The package does **not** lock document scroll. Native `showModal()` makes the
page inert but the backdrop can still scroll underneath. Lock it in CSS:

```css
html:has(dialog:modal) {
  overflow: hidden;
  scrollbar-gutter: stable;
}
```

### Older browsers

Invoker commands need Chrome 135, Firefox 144 or Safari 26.2. For older
browsers, load the [invokers polyfill](https://keithcirkel.co.uk/invokers-polyfill)
before the component.

## Events

Dispatched on `document.documentElement`. Prefer constants from
`@agencecinq/utils`:

| Event | Constant | Cancelable | Detail | Description |
| ----- | -------- | ---------- | ------ | ----------- |
| `modal:before-open` | `MODAL_BEFORE_OPEN` | Yes | `{ modal, instance, trigger, waitUntil }` | Fired before the dialog opens. `preventDefault()` cancels, `waitUntil(promise)` defers. |
| `modal:before-close` | `MODAL_BEFORE_CLOSE` | Yes | `{ modal, instance, waitUntil }` | Fired before the dialog closes. `preventDefault()` cancels, `waitUntil(promise)` defers. |

`detail.modal` is the dialog `id`. Once the dialog opens or closes, it fires the
native `toggle` event (`event.newState` is `"open"` or `"closed"`):

```js
document.querySelector("#newsletter").addEventListener("toggle", (event) => {
  console.log(event.newState);
});
```

### Deferring open or close

```js
import { EVENTS } from "@agencecinq/utils";

document.documentElement.addEventListener(EVENTS.MODAL_BEFORE_OPEN, (event) => {
  if (event.detail.modal !== "newsletter") return;

  event.detail.waitUntil(doAsyncWork());
});
```

Several listeners can defer the same action; a rejected promise cancels it.
Call `waitUntil()` synchronously in the listener. TypeScript: `BeforeOpenDetail` and
`BeforeCloseDetail` from `@agencecinq/modal`.

**UX:** defer open when the fetch is quick and the dialog would feel empty.
Otherwise open immediately and load on `toggle`. Defer close for save,
archive, or exit animation.

## Migration

### From 5.x to 6.0

Requires invoker commands (see [Older browsers](#older-browsers)).

**1. Buttons.** Remove `<cinq-modal-button>`, `aria-controls` and
`aria-pressed`. Target the dialog with `commandfor`:

```html
<!-- Before -->
<cinq-modal-button>
  <button aria-controls="newsletter" aria-pressed="false">Subscribe</button>
</cinq-modal-button>

<!-- After -->
<button commandfor="newsletter" command="show-modal">Subscribe</button>
```

Inside the dialog, close buttons take `command="request-close"`. A button that
listed two ids to replace a modal (`aria-controls="address confirm"`) becomes
`commandfor="confirm" command="show-modal" data-replace`.

**2. `id`.** Move it from `<cinq-modal>` to the `<dialog>`. `[data-dialog]` is
gone: the host wraps one dialog.

**3. Backdrop.** Add `closedby="any"` to the `<dialog>` to keep closing on a
backdrop click.

**4. State.** The host no longer reflects `open`. Style `dialog[open]` or
`dialog:modal`, and read `modal.$dialog.open` (`$modal` is now `$dialog`).

**5. Events.** `modal:toggle`, `modal:open` and `modal:close` are gone, with
their `EVENTS` constants (`@agencecinq/utils` 8.0). Open from a script with
`modal.show()`, and listen to the dialog's `toggle` event:

```js
// Before
document.documentElement.addEventListener(EVENTS.MODAL_OPEN, (event) => {
  if (event.detail.modal !== "newsletter") return;
  load();
});

// After
document.querySelector("#newsletter").addEventListener("toggle", (event) => {
  if (event.newState === "open") load();
});
```

**6. Focus.** The modal no longer forces focus on the first focusable element:
`showModal()` does it, and honors `autofocus`.

### From 4.x to 5.0

Requires `@agencecinq/utils` >= 7.7.0.

**1. Deferring.** Replace `resolve()` with `waitUntil(promise)`:

```js
// Before
document.documentElement.addEventListener(EVENTS.MODAL_BEFORE_CLOSE, (event) => {
  if (event.detail.modal !== "newsletter-modal") return;
  event.preventDefault();
  doAsyncWork().then(() => event.detail.resolve());
});

// After
document.documentElement.addEventListener(EVENTS.MODAL_BEFORE_CLOSE, (event) => {
  if (event.detail.modal !== "newsletter-modal") return;
  event.detail.waitUntil(doAsyncWork());
});
```

`preventDefault()` now only cancels. A rejected promise cancels too.

**2. API.** `show()` and `close()` return `Promise<boolean>`:

```js
// Before
if (modal.show()) { ... }

// After
if (await modal.show()) { ... }
```

**3. Buttons.** `modal:toggle` no longer carries `trap`. Remove `data-trap`
from buttons: it had no effect.

Markup and styling are unchanged.

## Build setup

```bash
pnpm -C packages/modal build
```

## Tests

The tests run in Chromium, Firefox and WebKit through Playwright, since the
modal relies on what each engine implements. Install the browsers once:

```bash
pnpm -C packages/modal exec playwright install chromium firefox webkit
pnpm -C packages/modal test
```

## Acknowledgments

See the [interactive docs](https://agencecinq.github.io/ui/components/modal/) for live examples.

- [Dialog (Modal) Pattern (WAI-ARIA Practices)](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)
- [The `dialog` element (HTML Standard)](https://html.spec.whatwg.org/multipage/interactive-elements.html#the-dialog-element)
- [`<dialog>` (MDN)](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/dialog)
- [Invoker Commands API (MDN)](https://developer.mozilla.org/en-US/docs/Web/API/Invoker_Commands_API)
- [`closedby` browser support (MDN browser-compat-data)](https://github.com/mdn/browser-compat-data/blob/main/html/elements/dialog.json)
- [Invokers polyfill](https://keithcirkel.co.uk/invokers-polyfill)
