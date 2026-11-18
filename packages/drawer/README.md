[![](https://img.shields.io/npm/v/@agencecinq/drawer)](https://www.npmjs.com/package/@agencecinq/drawer)
[![](https://img.shields.io/npm/dm/@agencecinq/drawer)](https://www.npmjs.com/package/@agencecinq/drawer)

# @agencecinq/drawer

> Before-hooks for an off-canvas native `<dialog>`, with a Liquid snippet for Shopify themes.

A drawer slides content in from the edge of the viewport. The platform already
opens, closes and focuses it: buttons drive the `<dialog>` with
[invoker commands](https://developer.mozilla.org/en-US/docs/Web/API/Invoker_Commands_API),
`showModal()` makes the page inert and returns focus on close. `<cinq-drawer>`
only adds what it lacks:

- `drawer:before-open` / `drawer:before-close`, to cancel or defer an open or a
  close with `waitUntil(promise)`
- `data-replace` on a button, to open the next drawer in place of the current
  one instead of over it
- the backdrop click of `closedby="any"` in Safari, which does not support it
  yet

Includes a Vite plugin to sync the Liquid snippet in Shopify projects.

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
<button commandfor="cart-drawer" command="show-modal">View cart</button>

<cinq-drawer>
  <dialog id="cart-drawer" closedby="any" aria-labelledby="cart-title" class="drawer">
    <h2 id="cart-title">Your cart</h2>
    ...
    <button commandfor="cart-drawer" command="request-close">Close</button>
  </dialog>
</cinq-drawer>
```

Importing `@agencecinq/drawer` registers the Web Component. Without JavaScript,
or before the element is defined, the buttons still open and close the drawer:
only the hooks are missing.

> **HTML is the source of truth.** Provide labelling and focus targets
> yourself. Use an a11y linter (axe-core, Lighthouse) to catch invalid markup.

### Markup

| Element / attribute | Required | Role |
| ------------------- | -------- | ---- |
| `<cinq-drawer>` | **Yes** | Host. Wraps one `<dialog>`. |
| `<dialog id>` | **Yes** | The drawer. Buttons target its `id` with `commandfor`. |
| `closedby="any"` on `<dialog>` | No | Closes a modal drawer on a backdrop click. Without it, only Escape and buttons close it. |
| `popover` on `<dialog>` | No | Makes a non-modal drawer. See [Non-modal drawer](#non-modal-drawer). |
| `autofocus` | No | Element focused on open. Defaults to the first focusable element. |
| `data-replace` on a button that opens | No | Opens the target in place of the drawer holding the button. The target's `drawer:before-open` runs first: if it cancels, the current drawer stays open. Without JavaScript, the target opens over it. |

### Commands

| Button | Drawer | Effect | Hook |
| ------ | ------ | ------ | ---- |
| `command="show-modal"` | Modal | Opens the dialog. | `drawer:before-open` |
| `command="request-close"` | Modal | Closes the dialog. The button `value` becomes `dialog.returnValue`. | `drawer:before-close` |
| `command="close"` | Modal | Closes the dialog at once. | None |
| `command="toggle-popover"` | Non-modal | Opens or closes the dialog. | `drawer:before-open` or `drawer:before-close` |
| `command="show-popover"` | Non-modal | Opens the dialog. | `drawer:before-open` |
| `command="hide-popover"` | Non-modal | Closes the dialog. | `drawer:before-close` |

On a modal drawer, Escape and the backdrop click (`closedby="any"`) go through
`drawer:before-close` too. Direct calls skip the hooks, like on the platform:
`dialog.showModal()`, `dialog.close()`, `<form method="dialog">`, and Escape
when the browser forces the close (pressed repeatedly without user activation).

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

.drawer:is([open], :popover-open) {
  translate: 0 0;
}

@starting-style {
  .drawer:is([open], :popover-open) {
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
drawer without animation. With Tailwind, the `open:` variant matches both
`[open]` and `:popover-open`. See the Liquid snippet for the Tailwind version.

The UA stylesheet sets `color: CanvasText` and `background: Canvas` on the
`<dialog>`, so it does not inherit the page text color. Set both on the dialog
or its content, or a dark color scheme renders white text on a white panel.

### Background scroll

The package does **not** lock document scroll. A modal dialog makes the page
inert but the page can still scroll underneath. Lock it in CSS:

```css
html:has(cinq-drawer > dialog:is(:modal, :popover-open)) {
  overflow: hidden;
  scrollbar-gutter: stable;
}
```

### Non-modal drawer

Add `popover` to the `<dialog>` when a control outside the drawer must stay
usable while it is open, such as a burger menu in a header above the drawer.
The burger toggles it with `command="toggle-popover"`:

```html
<header class="sticky top-0 z-20">
  <button commandfor="menu-drawer" command="toggle-popover">Menu</button>
</header>

<cinq-drawer>
  <dialog id="menu-drawer" popover aria-label="Menu" class="drawer">...</dialog>
  <div class="scrim" aria-hidden="true"></div>
</cinq-drawer>
```

The browser handles the rest: `aria-expanded` on the burger, Escape, a press
outside the drawer, focus moved into the dialog and back to the burger on
close, and one drawer open at a time. Focus is not contained: Tab can leave the
drawer, as in a disclosure menu.

The popover sits in the top layer, above the header: offset it from the top
(`margin-top`) to leave the header visible. Its `::backdrop` would cover the
header too, so dim the page with a scrim placed after the dialog, below the
header, and shown with `dialog:popover-open + .scrim` (Tailwind: `peer` on the
dialog, `peer-open:` on the scrim). Give the scrim pointer events while it
shows, so a press on it closes the drawer instead of reaching the page below.

Escape and a press outside close the drawer without `drawer:before-close`: the
browser does not let a popover cancel them. Buttons and `close()` still go
through the hook. A `<form method="dialog">` does not close a popover: close it
on `submit`.

When the drawer covers the page, make the covered regions inert while it is
open, so Tab and screen readers stay out of what they cannot see. The drawer
leaves this to the page, which alone knows the regions it covers. Leave out the
region holding the triggers, here the header:

```js
document.querySelector("#menu-drawer").addEventListener("beforetoggle", (event) => {
  const inert = event.newState === "open";

  document.querySelectorAll("main, footer").forEach(($element) => {
    $element.inert = inert;
  });
});
```

`beforetoggle` fires before focus returns, so an opener inside a covered region
still gets its focus back.

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

Render the snippet in Liquid. It renders a modal drawer that closes on a
backdrop click. Pass `modal: false` for a non-modal drawer: the snippet adds
`popover` to the dialog and a scrim offset by `margin_top`.

```liquid
{% render 'cinq-drawer.html',
   id: 'cart-drawer',
   label: 'cart-title',
   content: '<h2 id="cart-title">Your cart</h2><p>Your cart is empty.</p>'
%}

<button commandfor="cart-drawer" command="show-modal">View cart</button>
```

### Older browsers

Invoker commands need Chrome 135, Firefox 144 or Safari 26.2. For older
browsers, load the [invokers polyfill](https://keithcirkel.co.uk/invokers-polyfill)
before the component.

### API

| Method | Description |
| ------ | ----------- |
| `show()` | Opens the drawer. Resolves `true` if this call opened it, `false` if already open or canceled. |
| `close(returnValue?)` | Closes the drawer. Resolves `true` if this call closed it, `false` if already closed or canceled. `returnValue` applies to a modal drawer. |
| `init()` | Binds listeners. Called on connect. Call `destroy()` first to re-bind. |
| `destroy()` | Removes listeners and closes the dialog. Called on disconnect. |

| Property | Description |
| -------- | ----------- |
| `$dialog` | The `<dialog>`. |
| `trigger` | The button that last opened the drawer. |

## Events

Dispatched on `document.documentElement`. Prefer constants from
`@agencecinq/utils`:

| Event | Constant | Cancelable | Detail | Description |
| ----- | -------- | ---------- | ------ | ----------- |
| `drawer:before-open` | `DRAWER_BEFORE_OPEN` | Yes | `{ drawer, instance, trigger, waitUntil }` | Fired before the dialog opens. `preventDefault()` cancels, `waitUntil(promise)` defers. |
| `drawer:before-close` | `DRAWER_BEFORE_CLOSE` | Yes | `{ drawer, instance, waitUntil }` | Fired before the dialog closes. `preventDefault()` cancels, `waitUntil(promise)` defers. |

`detail.drawer` is the dialog `id`. Once the dialog opens or closes, it fires
the native `toggle` event (`event.newState` is `"open"` or `"closed"`), in both
modes:

```js
document.querySelector("#cart-drawer").addEventListener("toggle", (event) => {
  console.log(event.newState);
});
```

### Deferring open or close

```js
import { EVENTS } from "@agencecinq/utils";

document.documentElement.addEventListener(EVENTS.DRAWER_BEFORE_OPEN, (event) => {
  if (event.detail.drawer !== "cart-drawer") return;

  event.detail.waitUntil(doAsyncWork());
});
```

Several listeners can defer the same action, and a rejected promise cancels
it. Call `waitUntil()` synchronously in the listener. TypeScript:
`BeforeOpenDetail` and `BeforeCloseDetail` from `@agencecinq/drawer`.

**UX:** defer open when the fetch is quick and the panel would feel empty.
Otherwise open immediately and load on `toggle`. Defer close for save,
archive, or exit animation.

## Migration

### From 8.x to 9.0

Requires invoker commands (see [Older browsers](#older-browsers)).

**1. Buttons.** Remove `<cinq-drawer-button>`, `aria-controls` and
`aria-expanded`. Target the dialog with `commandfor`:

```html
<!-- Before -->
<cinq-drawer-button>
  <button aria-controls="cart-drawer" aria-expanded="false">View cart</button>
</cinq-drawer-button>

<!-- After -->
<button commandfor="cart-drawer" command="show-modal">View cart</button>
```

Inside the dialog, close buttons take `command="request-close"`. A button that
listed two ids to switch drawers (`aria-controls="notes bestiary"`) becomes
`commandfor="bestiary" command="show-modal" data-replace`.

**2. `id`.** Move it from `<cinq-drawer>` to the `<dialog>`.

**3. Backdrop.** Add `closedby="any"` to the `<dialog>` to keep closing on a
backdrop click.

**4. Non-modal drawer.** Replace `data-modal="false"` on the host with
`popover` on the dialog, and give the burger `command="toggle-popover"`. The
dialog now sits in the top layer: replace its `z-index` below the header with
a top offset. Move the scrim after the dialog and show it from
`dialog:popover-open + .scrim` instead of `cinq-drawer[open]`. Escape and a
press outside no longer go through `drawer:before-close`.

**5. State.** The host no longer reflects `open`. Style `dialog[open]` and
`dialog:popover-open` (Tailwind `open:` covers both). `<cinq-drawer open>` no
longer opens on load: call `drawer.show()`.

**6. API.** `open()` is now `show()`, and `toggle()` is gone: buttons toggle a
non-modal drawer with `command="toggle-popover"`.

**7. Events.** `drawer:toggle`, `drawer:open` and `drawer:close` are gone, with
their `EVENTS` constants (`@agencecinq/utils` 9.0). Open from a script with
`drawer.show()`, and listen to the dialog's `toggle` event:

```js
// Before
document.documentElement.addEventListener(EVENTS.DRAWER_CLOSE, (event) => {
  if (event.detail.drawer !== "menu-drawer") return;
  reset();
});

// After
document.querySelector("#menu-drawer").addEventListener("toggle", (event) => {
  if (event.newState === "closed") reset();
});
```

**8. Scroll.** The drawer no longer locks scroll: add the CSS from
[Background scroll](#background-scroll).

**9. Focus.** The drawer no longer forces focus on the first focusable
element: the browser does, and honors `autofocus`.

**10. Liquid snippet.** The `id` goes on the dialog, which gets
`closedby="any"`, or `popover` with `modal: false`. Re-copy the snippet if you
customized it.

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

## Tests

The tests run in Chromium, Firefox and WebKit through Playwright, since the
drawer relies on what each engine implements. Install the browsers once:

```bash
pnpm -C packages/drawer exec playwright install chromium firefox webkit
pnpm -C packages/drawer test
```

## Acknowledgments

See the [interactive docs](https://agencecinq.github.io/ui/components/drawer/) for live examples.

- [Dialog (Modal) Pattern (WAI-ARIA Practices)](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)
- [The `dialog` element (HTML Standard)](https://html.spec.whatwg.org/multipage/interactive-elements.html#the-dialog-element)
- [Invoker Commands API (MDN)](https://developer.mozilla.org/en-US/docs/Web/API/Invoker_Commands_API)
- [Popover API (MDN)](https://developer.mozilla.org/en-US/docs/Web/API/Popover_API)
- [Invokers polyfill](https://keithcirkel.co.uk/invokers-polyfill)
