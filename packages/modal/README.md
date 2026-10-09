[![](https://img.shields.io/npm/v/@agencecinq/modal)](https://www.npmjs.com/package/@agencecinq/modal)
[![](https://img.shields.io/npm/dm/@agencecinq/modal)](https://www.npmjs.com/package/@agencecinq/modal)

# @agencecinq/modal

> Accessible modal Web Component built on the native `<dialog>` element.

A modal presents content above the page. `<cinq-modal>` wraps a native
`<dialog>`, handles open/close via `showModal()` / `close()`, and coordinates
with `cinq-modal-button` through document-level events.

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
<cinq-modal-button>
  <button aria-controls="newsletter-modal" aria-pressed="false">
    Open modal
  </button>
</cinq-modal-button>

<cinq-modal id="newsletter-modal">
  <dialog aria-labelledby="newsletter-title">
    <h2 id="newsletter-title">Newsletter</h2>
    ...
  </dialog>
</cinq-modal>
```

Importing `@agencecinq/modal` registers the Web Components automatically.
No manual `init()` call required.

> **HTML is the source of truth.** Provide dialog content, labelling, and focus
> targets yourself. Use an a11y linter (axe-core, Lighthouse) to catch invalid
> markup.

### Required markup

| Selector / attribute | Required | Role |
| -------------------- | -------- | ---- |
| `<cinq-modal>` | **Yes** | Modal host. Requires an `id` for event-driven open/close. |
| `<dialog>` | **Yes** | Native dialog element inside the host. Mark it `[data-dialog]` if the host contains several. |
| `id` on `<cinq-modal>` | **Yes** | Must match button `aria-controls`. |
| `aria-controls` on trigger | **Yes** | Points to the modal `id`. |

### API

| Attribute | Required | Description |
| --------- | -------- | ----------- |
| `id` | **Yes** | Modal identifier. Must match button `aria-controls`. |
| `open` | No | Reflected open state. Useful for styling. |

| Method | Description |
| ------ | ----------- |
| `show()` | Opens the modal. Resolves `true` if this call opened it, `false` if already open or canceled. |
| `close()` | Closes the modal. Resolves `true` if this call closed it, `false` if already closed or canceled. |
| `init()` | Binds listeners. Called on connect; call `destroy()` first to re-bind. |
| `destroy()` | Removes listeners and closes the dialog. Called on disconnect. |

A native close (`<form method="dialog">`, `dialog.close()`) removes `open` too,
without `modal:before-close`.

### Wiring with `cinq-modal-button`

`cinq-modal-button` dispatches `modal:toggle` on `document.documentElement` with:

- `detail.modal`: the modal id from the button `aria-controls`
- `detail.trigger`: the button element

`cinq-modal` listens to `modal:toggle` and toggles itself when `detail.modal`
matches its `id`.

### Background scroll

The package does **not** lock document scroll. Native `showModal()` makes the
page inert but the backdrop can still scroll underneath. Prefer CSS in the
theme:

```css
html:has(dialog[open]:modal) {
  overflow: hidden;
  scrollbar-gutter: stable;
}
```

Or refcount `modal:open` / `modal:close` with `disableScroll` / `enableScroll`
from `@agencecinq/utils` if the theme already uses those helpers.

## Events

Dispatched on `document.documentElement`. Prefer constants from
`@agencecinq/utils`:

| Event | Constant | Cancelable | Detail | Description |
| ----- | -------- | ---------- | ------ | ----------- |
| `modal:toggle` | `MODAL_TOGGLE` | No | `{ modal, trigger }` | Request open/close from a button. |
| `modal:before-open` | `MODAL_BEFORE_OPEN` | Yes | `{ modal, instance, trigger, waitUntil }` | Fired before `open` is set. `preventDefault()` cancels, `waitUntil(promise)` defers. |
| `modal:before-close` | `MODAL_BEFORE_CLOSE` | Yes | `{ modal, instance, waitUntil }` | Fired before `open` is removed. `preventDefault()` cancels, `waitUntil(promise)` defers. |
| `modal:open` | `MODAL_OPEN` | No | `{ modal, trigger? }` | Fired after `open` is set. |
| `modal:close` | `MODAL_CLOSE` | No | `{ modal }` | Fired after `open` is removed. |

```js
import { EVENTS } from "@agencecinq/utils";

document.documentElement.addEventListener(EVENTS.MODAL_OPEN, (event) => {
  console.log(event.detail.modal);
});
```

### Deferring open or close

```js
document.documentElement.addEventListener(EVENTS.MODAL_BEFORE_OPEN, (event) => {
  if (event.detail.modal !== "newsletter-modal") return;

  event.detail.waitUntil(doAsyncWork());
});
```

Several listeners can defer the same action; a rejected promise cancels it.
Call `waitUntil()` synchronously in the listener. TypeScript: `BeforeOpenDetail` and
`BeforeCloseDetail` from `@agencecinq/modal`.

**UX:** defer open when the fetch is quick and the dialog would feel empty.
Otherwise open immediately and load on `modal:open`. Defer close for save,
archive, or exit animation.

## Migration

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

## Acknowledgments

See the [interactive docs](https://agencecinq.github.io/ui/components/modal/) for live examples.
