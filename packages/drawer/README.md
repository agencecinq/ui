[![](https://img.shields.io/npm/v/@agencecinq/drawer)](https://www.npmjs.com/package/@agencecinq/drawer)
[![](https://img.shields.io/npm/dm/@agencecinq/drawer)](https://www.npmjs.com/package/@agencecinq/drawer)

# @agencecinq/drawer

> Accessible off-canvas drawer Web Component for Shopify themes.

A drawer slides content in from the edge of the viewport. `<cinq-drawer>`
wraps a native `<dialog>`, opens it with `showModal()`, locks scroll, and
dispatches document-level events. The browser provides the top layer, inert
page, focus containment, Escape, and focus return.
Includes a Vite plugin to sync Liquid snippets in Shopify projects.

## Installation

Requires **Node.js 18+** (build tooling and `@agencecinq/drawer/plugin`).

```bash
pnpm add @agencecinq/drawer
```

## Usage

```js
import "@agencecinq/drawer";
```

```html
<cinq-drawer id="cart-drawer">
  <dialog aria-labelledby="cart-title" class="drawer">
    <h2 id="cart-title">Your cart</h2>
    ...
  </dialog>
</cinq-drawer>

<cinq-drawer-button>
  <button aria-controls="cart-drawer" aria-expanded="false">
    View cart
  </button>
</cinq-drawer-button>
```

Importing `@agencecinq/drawer` registers the Web Components automatically.
No manual `init()` call required.

> **HTML is the source of truth.** Provide labelling yourself. Use an a11y
> linter (axe-core, Lighthouse) to catch invalid markup.

### Styling

The component never writes inline styles. Position and animate the `<dialog>`
and its `::backdrop` from CSS: `@starting-style` for the entry, and
`allow-discrete` on `display` / `overlay` so the exit animation plays out in
the top layer.

```css
.drawer {
  inset: 0 0 0 auto;
  margin: 0;
  width: min(100%, 28rem);
  max-width: none;
  height: 100%;
  max-height: none;
  border: 0;
  padding: 0;
  translate: 100% 0;
  transition: translate 300ms, display 300ms allow-discrete, overlay 300ms allow-discrete;
}

.drawer[open] {
  translate: 0 0;
}

@starting-style {
  .drawer[open] {
    translate: 100% 0;
  }
}

.drawer::backdrop {
  background: rgb(0 0 0 / 0.5);
  opacity: 0;
  transition: opacity 300ms, display 300ms allow-discrete, overlay 300ms allow-discrete;
}

.drawer[open]::backdrop {
  opacity: 1;
}

@starting-style {
  .drawer[open]::backdrop {
    opacity: 0;
  }
}
```

Browsers without `@starting-style` or `allow-discrete` open and close the
drawer without animation. See the Liquid snippet for the Tailwind version.

The UA stylesheet sets `color: CanvasText` and `background: Canvas` on the
`<dialog>`, so it does not inherit the page text color. Set both on the dialog
or its content, or a dark color scheme renders white text on a white panel.

### Non-modal drawer

Add `data-modal="false"` when a control outside the drawer must stay usable
while it is open, such as a burger menu in a header above the drawer. The
dialog opens with `show()`: no top layer, no inert page, no `::backdrop`.

```html
<header class="sticky top-0 z-20">
  <cinq-drawer-button>
    <button aria-controls="menu-drawer" aria-expanded="false">Menu</button>
  </cinq-drawer-button>
</header>

<cinq-drawer id="menu-drawer" data-modal="false">
  <div class="scrim" aria-hidden="true"></div>
  <dialog aria-label="Menu" class="drawer">...</dialog>
</cinq-drawer>
```

The drawer still locks scroll, moves focus in, closes on Escape and restores
focus. A press outside the dialog closes it, except on its triggers so their
click toggles. Give the dialog a `z-index` below the header, and style the
scrim from `cinq-drawer[open]` since `::backdrop` only exists for modal
dialogs. Focus is not contained: Tab can leave the drawer, as in a disclosure
menu.

### Shopify integration

Requires **Node.js 18+** (the plugin uses `fs.cp` from `node:fs/promises`).

Register the Vite plugin in your Shopify project. It copies the
`cinq-drawer.html.liquid` snippet to your theme during development and build:

```typescript
import { defineConfig } from "vite";
import { cinqDrawerPlugin } from "@agencecinq/drawer/plugin";

export default defineConfig({
  plugins: [cinqDrawerPlugin()],
});
```

Render the snippet in Liquid. Pass `modal: false` for a non-modal drawer: the
snippet adds `data-modal="false"` and a scrim offset by `margin_top`.

```liquid
{% render 'cinq-drawer.html',
   id: 'cart-drawer',
   label: 'cart-title',
   content: '<h2 id="cart-title">Your cart</h2><p>Your cart is empty.</p>'
%}

<cinq-drawer-button>
  <button aria-controls="cart-drawer" aria-expanded="false">
    View cart
  </button>
</cinq-drawer-button>
```

### API

| Attribute | Required | Description |
| --------- | -------- | ----------- |
| `id` | **Yes** | Unique drawer identifier. Must match button `aria-controls`. |
| `open` | No | Reflected open state, mirrored on the inner `<dialog>`. Set it in the markup to render the drawer open. |
| `data-modal` | No | `false` opens with `show()` instead of `showModal()`. Read on open. See [Non-modal drawer](#non-modal-drawer). |

| Method | Description |
| ------ | ----------- |
| `open()` | Opens the drawer. Resolves `true` if this call opened it, `false` if already open or canceled. |
| `close()` | Closes the drawer. Resolves `true` if this call closed it, `false` if already closed or canceled. |
| `toggle({ trigger? })` | Toggles open/close. Resolves whether the drawer is open. |
| `destroy()` | Removes listeners, releases scroll lock and focus. Called on disconnect. |
| `init()` | Binds listeners and opens the dialog if `open` is already set. Called on connect; call `destroy()` first to re-bind. |

When you mutate drawer DOM at runtime, re-bind with `destroy()`, mutate,
`init()`.

## Events

Dispatched on `document.documentElement`. Prefer constants from
`@agencecinq/utils`:

| Event | Constant | Cancelable | Detail | Description |
| ----- | -------- | ---------- | ------ | ----------- |
| `drawer:toggle` | `DRAWER_TOGGLE` | No | `{ drawer, trigger }` | Request open/close from a button. |
| `drawer:before-open` | `DRAWER_BEFORE_OPEN` | Yes | `{ drawer, instance, trigger, waitUntil }` | Fired before `open` is set. `preventDefault()` cancels, `waitUntil(promise)` defers. |
| `drawer:before-close` | `DRAWER_BEFORE_CLOSE` | Yes | `{ drawer, instance, waitUntil }` | Fired before `open` is removed. `preventDefault()` cancels, `waitUntil(promise)` defers. |
| `drawer:open` | `DRAWER_OPEN` | No | `{ drawer, trigger? }` | Fired after `open` is set. |
| `drawer:close` | `DRAWER_CLOSE` | No | `{ drawer }` | Fired after `open` is removed. |

```js
import { EVENTS } from "@agencecinq/utils";

document.documentElement.addEventListener(EVENTS.DRAWER_OPEN, (event) => {
  console.log(event.detail.drawer);
});
```

### Deferring open or close

Open and close paths dispatch cancelable `drawer:before-open` /
`drawer:before-close` first. Call `preventDefault()` to cancel, or pass
a promise to `detail.waitUntil()` to defer until async work finishes:

```js
document.documentElement.addEventListener(EVENTS.DRAWER_BEFORE_OPEN, (event) => {
  if (event.detail.drawer !== "cart-drawer") return;

  event.detail.waitUntil(doAsyncWork());
});
```

Several listeners can defer the same action; a rejected promise cancels it.
Call `waitUntil()` synchronously in the listener. TypeScript: `BeforeOpenDetail` and
`BeforeCloseDetail` from `@agencecinq/drawer`.

**UX:** defer open when the fetch is quick and the panel would feel empty.
Otherwise open immediately and load on `drawer:open`. Defer close for save,
archive, or exit animation.

## Migration

### From 7.x to 8.0

Requires `@agencecinq/utils` >= 7.7.0.

**1. Markup.** Replace the overlay and the `[role="dialog"]` panel with a
`<dialog>`. Drop `aria-modal` (implicit with `showModal()`) and `data-trap`
on buttons.

```html
<!-- Before -->
<cinq-drawer id="cart-drawer" class="group" style="opacity: 0; visibility: hidden">
  <div data-dom="overlay" class="..."></div>
  <div role="dialog" aria-modal="true" aria-labelledby="cart-title" class="...">...</div>
</cinq-drawer>

<!-- After -->
<cinq-drawer id="cart-drawer">
  <dialog aria-labelledby="cart-title" class="drawer">...</dialog>
</cinq-drawer>
```

**2. Styling.** The component no longer writes inline `opacity` /
`visibility`. Move the panel classes to the `<dialog>`, style the overlay
with `::backdrop`, and replace `group-[[open]]:*` with `open:*` on the dialog.
Add `@starting-style` and `allow-discrete` for the animations (see
[Styling](#styling)). Reset the UA dialog styles: `margin`, `max-width`,
`max-height`, `border`, `padding`.

**3. Deferring.** Replace `resolve()` with `waitUntil(promise)`:

```js
// Before
document.documentElement.addEventListener(EVENTS.DRAWER_BEFORE_CLOSE, (event) => {
  if (event.detail.drawer !== "cart-drawer") return;
  event.preventDefault();
  doAsyncWork().then(() => event.detail.resolve());
});

// After
document.documentElement.addEventListener(EVENTS.DRAWER_BEFORE_CLOSE, (event) => {
  if (event.detail.drawer !== "cart-drawer") return;
  event.detail.waitUntil(doAsyncWork());
});
```

`preventDefault()` now only cancels. A rejected promise cancels too.

**4. API.** `open()`, `close()` and `toggle()` return `Promise<boolean>`.
`toggle()` no longer takes `trap`, and `drawer:toggle` no longer carries it.
The `$panel`, `$overlay` and `trap` properties are gone; use `$dialog`.

```js
// Before
if (drawer.open()) { ... }

// After
if (await drawer.open()) { ... }
```

**5. Liquid snippet.** `classes` now applies to the `<dialog>`, not the host.
New `label` param: ID of the element labelling the dialog (`aria-labelledby`), as in `@agencecinq/sheet`. Re-copy the snippet if you
customized it.

**6. Behavior.** Everything outside the drawer is inert while it is open,
including header triggers: put a close button inside the drawer, or use
`data-modal="false"` (see [Non-modal drawer](#non-modal-drawer)). A backdrop
click closes it. A `<cinq-drawer open>` in the markup now opens on load.

## Build setup

```bash
pnpm -C packages/drawer build
```

## Acknowledgments

See the [interactive docs](https://agencecinq.github.io/ui/components/drawer/) for live examples.
