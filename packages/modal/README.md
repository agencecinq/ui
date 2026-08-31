# @agencecinq/modal

A lightweight, accessible Web Component wrapper around the native HTML `<dialog>` element, designed for Shopify themes. Part of the **CINQ** internal tools ecosystem.

## Features

- **Native `<dialog>`**: Uses `showModal()` / `close()` for a solid baseline behavior.
- **Backdrop click to close**: Click outside the dialog content to close (on the dialog backdrop).
- **Event-driven**: Works with the shared `@agencecinq/utils` event names.

---

## Installation

```bash
pnpm add @agencecinq/modal
```

---

## Usage (Shopify integration)

### 1. Import the components

In your theme entry (e.g. `theme.ts`, `main.js`):

```js
import "@agencecinq/modal";
```

### 2. Implementation in Liquid / HTML

Render the markup and wire buttons with `aria-controls`.
`cinq-modal` must have an `id`, because it toggles itself when `detail.modal` matches its `id`.

```liquid
<cinq-modal-button>
  <button aria-controls="newsletter-modal" aria-pressed="false">
    Open modal
  </button>
</cinq-modal-button>

<cinq-modal id="newsletter-modal">
  <dialog>
    ...
  </dialog>
</cinq-modal>
```

---

## API reference

### Markup

`<cinq-modal>` must contain a `<dialog>` (or an element marked with `[data-dialog]`).
An `id` is required if you want it to react to `modal:toggle` events from `cinq-modal-button`.

```html
<cinq-modal id="my-modal">
  <dialog>...</dialog>
</cinq-modal>
```

### Attributes

| Attribute | Required | Description |
| --------- | -------- | ----------- |
| `id`      | Yes      | Modal identifier; must match button `aria-controls`. |
| `open`    | No       | Reflected state attribute (useful for styling). |

### Methods

Interact with the element instance directly:

```js
const $modal = document.querySelector("cinq-modal#my-modal");

$modal.show(); // returns false if already open, aborted, or deferred
$modal.close(); // returns false if already closed, aborted, or deferred
```

### Events

Event names come from `@agencecinq/utils` on `document.documentElement`:

| Event | Constant | Cancelable | Detail | Description |
| ----- | -------- | ---------- | ------ | ----------- |
| `modal:toggle` | `MODAL_TOGGLE` | No | `{ modal, trigger, trap }` | Request open/close from a button |
| `modal:before-open` | `MODAL_BEFORE_OPEN` | Yes | `{ modal, instance, trigger, resolve }` | Fired before `open` is set. Cancel to defer; call `resolve()` to commit |
| `modal:before-close` | `MODAL_BEFORE_CLOSE` | Yes | `{ modal, instance, resolve }` | Fired before `open` is removed. Cancel to defer; call `resolve()` to commit |
| `modal:open` | `MODAL_OPEN` | No | `{ modal, trigger? }` | Fired after `open` is set |
| `modal:close` | `MODAL_CLOSE` | No | `{ modal }` | Fired after `open` is removed |

#### Deferring open or close

```js
import { EVENTS } from '@agencecinq/utils';

document.documentElement.addEventListener(EVENTS.MODAL_BEFORE_OPEN, (event) => {
  if (event.detail.modal !== 'my-modal') return;

  event.preventDefault();

  void doAsyncWork().then(() => {
    event.detail.resolve();
  });
});

document.documentElement.addEventListener(EVENTS.MODAL_BEFORE_CLOSE, (event) => {
  if (event.detail.modal !== 'my-modal') return;

  event.preventDefault();

  void doAsyncWork().then(() => {
    event.detail.resolve();
  });
});
```

`resolve()` is idempotent. TypeScript: `BeforeOpenDetail` and `BeforeCloseDetail`
from `@agencecinq/modal`.

**UX:** defer open when the fetch is quick and the dialog would feel empty;
otherwise open immediately and load on `modal:open`. Defer close for save,
archive, or exit animation.

### Wiring: handle `modal:toggle`

`cinq-modal-button` dispatches `modal:toggle` on `document.documentElement` with:

- `detail.modal`: the modal id from the button `aria-controls`
- `detail.trigger`: the button element
- `detail.trap`: optional element from `data-trap` (if you use it)

`cinq-modal` listens to `modal:toggle` by default and toggles itself when `detail.modal` matches its `id` (so `id` is required for event-driven open/close).

### Background scroll (consumer)

The package does **not** lock document scroll. Native `showModal()` makes the page
inert but the backdrop can still scroll underneath. Prefer CSS in the theme:

```css
html:has(dialog[open]:modal) {
  overflow: hidden;
  scrollbar-gutter: stable;
}
```

Or refcount `modal:open` / `modal:close` with `disableScroll` / `enableScroll` from
`@agencecinq/utils` if the theme already uses those helpers.

---

## Development (monorepo)

```bash
pnpm -C packages/modal build
pnpm -C packages/modal dev
```

## License

Internal tool developed by **CINQ**. All rights reserved.
