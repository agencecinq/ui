[![](https://img.shields.io/npm/v/@agencecinq/sheet)](https://www.npmjs.com/package/@agencecinq/sheet)
[![](https://img.shields.io/npm/dm/@agencecinq/sheet)](https://www.npmjs.com/package/@agencecinq/sheet)

# @agencecinq/sheet

> Bottom sheet on a native `<dialog>`: before-hooks, pull to dismiss and pull up to open.

A sheet presents content from the bottom edge. The platform already opens,
closes and focuses it: buttons drive the `<dialog>` with
[invoker commands](https://developer.mozilla.org/en-US/docs/Web/API/Invoker_Commands_API),
`showModal()` makes the page inert and returns focus on close. `<cinq-sheet>`
only adds what it lacks:

- `sheet:before-open` / `sheet:before-close`, to cancel or defer an open or a
  close with `waitUntil(promise)`
- a drag handle: pull it down to dismiss, it snaps back otherwise
- pull up on a button that opens the sheet, to open it with a gesture
- `data-replace` on a button, to open the next sheet in place of the current
  one instead of over it
- the backdrop click of `closedby="any"` in Safari, which does not support it
  yet

Open height follows content. Position, motion and scroll lock stay in consumer
CSS.

## Installation

Requires **Node.js 18+** (build tooling and `@agencecinq/sheet/plugin`).

```bash
pnpm add @agencecinq/sheet
```

## Usage

```js
import "@agencecinq/sheet";
```

```html
<button commandfor="cloak-sheet" command="show-modal">Select a size</button>

<cinq-sheet>
  <dialog
    id="cloak-sheet"
    aria-labelledby="cloak-title"
    closedby="any"
    class="fixed inset-x-0 top-auto -bottom-4 m-0 w-auto max-w-none max-h-[calc(100dvh-4rem)] overflow-y-auto border-0 p-0 pb-4"
  >
    <div data-dom="drag-indicator" class="touch-none" aria-hidden="true"></div>
    <h2 id="cloak-title">Cloak of Elvenkind</h2>
    ...
    <button commandfor="cloak-sheet" command="request-close">Close</button>
  </dialog>
</cinq-sheet>
```

Importing `@agencecinq/sheet` registers the Web Component. Without JavaScript,
or before the element is defined, the buttons still open and close the sheet:
only the hooks and the gestures are missing.

> **HTML is the source of truth.** Provide the `<dialog>`, its label and the
> optional drag handle yourself. Use an a11y linter (axe-core, Lighthouse) to
> catch invalid markup.

`closedby="any"` adds backdrop press to Escape. `top-auto` overrides the UA
`top: 0`. A small overhang (`-bottom-4` with `pb-4`) keeps the bottom edge
hidden while the panel moves. Cap the height with `max-height`.

### Markup

| Element / attribute | Required | Role |
| ------------------- | -------- | ---- |
| `<cinq-sheet>` | **Yes** | Host. Wraps one `<dialog>`. |
| `<dialog id>` | **Yes** | The panel. Buttons target its `id` with `commandfor`. |
| `closedby` on `<dialog>` | No | Dismissal of a modal sheet. See [Dismissal](#dismissal). |
| `popover` on `<dialog>` | No | Makes a non-modal sheet. See [Non-modal sheet](#non-modal-sheet). |
| `[data-dom="drag-indicator"]` | No | Drag handle inside the dialog. |
| `autofocus` | No | Element focused on open. Defaults to the first focusable element. |
| `data-replace` on a button that opens | No | Opens the target in place of the sheet holding the button. The target's `sheet:before-open` runs first: if it cancels, the current sheet stays open. Without JavaScript, the target opens over it. |

### Commands

| Button | Sheet | Effect | Hook |
| ------ | ----- | ------ | ---- |
| `command="show-modal"` | Modal | Opens the dialog. | `sheet:before-open` |
| `command="request-close"` | Modal | Closes the dialog. The button `value` becomes `dialog.returnValue`. | `sheet:before-close` |
| `command="close"` | Modal | Closes the dialog at once. | None |
| `command="toggle-popover"` | Non-modal | Opens or closes the dialog. | `sheet:before-open` or `sheet:before-close` |
| `command="show-popover"` | Non-modal | Opens the dialog. | `sheet:before-open` |
| `command="hide-popover"` | Non-modal | Closes the dialog. | `sheet:before-close` |

Direct calls skip the hooks, like on the platform: `dialog.showModal()`,
`dialog.close()`, `<form method="dialog">`, and Escape when the browser forces
the close (pressed repeatedly without user activation).

### Dismissal

Set it on a modal sheet with the native `closedby` attribute. The handle reads
it too:

| `closedby` | Escape | Backdrop press | Handle pull |
| ---------- | ------ | -------------- | ----------- |
| `any` | Yes | Yes | Yes |
| `closerequest` | Yes | No | Yes |
| absent | Yes | No | Yes |
| `none` | No | No | No |

Escape, the backdrop press and the handle pull go through `sheet:before-close`.
A vetoed pull snaps back.

### Non-modal sheet

Add `popover` to the `<dialog>` when the page must stay usable while the sheet
is open, such as a sticky purchase bar. Buttons toggle it with
`command="toggle-popover"`:

```html
<button commandfor="size-sheet" command="toggle-popover">Select a size</button>

<cinq-sheet>
  <dialog id="size-sheet" popover aria-labelledby="size-title">...</dialog>
</cinq-sheet>
```

The browser handles the rest: `aria-expanded` on the buttons, Escape, a press
outside the sheet, focus moved into the dialog and back to the button on close,
and one sheet open at a time. Focus is not contained.

The popover sits in the top layer: position it against the viewport. Escape
and a press outside close it without `sheet:before-close`: the browser does not
let a popover cancel them. Buttons, the handle and `close()` still go through
the hook. A `<form method="dialog">` does not close a popover: close it on
`submit`.

With `popover="manual"`, a press outside and Escape leave the sheet open, so the
page around it stays fully usable, like a map under a place card. Buttons, the
handle and `close()` close it. On a popover sheet, `closedby` only matters to
the handle: `closedby="none"` turns the pull off. Close requests are left to the page:
open a [`CloseWatcher`](https://developer.mozilla.org/en-US/docs/Web/API/CloseWatcher)
on `toggle` to close the sheet on Escape or the back gesture.

Set `inert` on the content the sheet covers while it is open, and lift it on
`beforetoggle` so focus can return to the button:

```js
document.querySelector("#size-sheet").addEventListener("beforetoggle", (event) => {
  document.querySelector("main").inert = event.newState === "open";
});
```

### Drag

Release the handle past 80 px, or with a quick downward flick, to close.
Otherwise the sheet snaps back. A pull upward gives a damped rubber band. The
host exposes the pull distance:

| Hook | Meaning |
| ---- | ------- |
| `--cinq-sheet-drag-offset` | Pull distance in px, negative and damped upward, unset at rest |
| `cinq-sheet[dragging]` | Set while the handle is pulled |

### Pull up to open

A button that opens the sheet (`show-modal`, `show-popover` or
`toggle-popover`) also opens it on a pull up past 40 px, or a quick upward
flick. A tap still runs the command. A pull that falls short does nothing. On
touch screens, set `touch-action: none` on the button that should take the
gesture, typically a handle outside the sheet. Buttons without it keep page
scroll.

### Motion

`max(-1rem, ...)` below caps the rubber band at the overhang so no gap shows
under the panel. Tailwind `open:` matches both `[open]` and `:popover-open`.

```css
cinq-sheet dialog {
  translate: 0 max(-1rem, var(--cinq-sheet-drag-offset, 0px));
  transition:
    translate 300ms ease-out,
    display 300ms allow-discrete,
    overlay 300ms allow-discrete;
}

cinq-sheet dialog:not([open], :popover-open) {
  translate: 0 100%;
}

@starting-style {
  cinq-sheet dialog:is([open], :popover-open) {
    translate: 0 100%;
  }
}

cinq-sheet[dragging] dialog {
  transition: none;
}

@media (prefers-reduced-motion: reduce) {
  cinq-sheet dialog {
    transition: none;
  }
}
```

### Background scroll

The package does **not** lock document scroll. Native `showModal()` makes the
page inert but the page can still scroll underneath. Lock it in CSS:

```css
html:has(cinq-sheet > dialog:modal) {
  overflow: hidden;
}
```

### Shopify integration

Requires **Node.js 18+** (the plugin uses `fs.cp` from `node:fs/promises`).

Register the Vite plugin in your Shopify project. It copies the
`cinq-sheet.html.liquid` snippet to your theme during development and build:

```typescript
import { defineConfig } from "vite";
import { cinqSheetPlugin } from "@agencecinq/sheet/plugin";

export default defineConfig({
  plugins: [cinqSheetPlugin()],
});
```

Render the snippet in Liquid:

```liquid
{% render 'cinq-sheet.html',
   id: 'size-sheet',
   label: 'size-sheet-title',
   content: panel
%}

<button commandfor="size-sheet" command="show-modal">Select a size</button>
```

The snippet sets `closedby="any"` by default. Pass `closedby: 'none'` to block
every dismissal but your own close control.

### Older browsers

Invoker commands need Chrome 135, Firefox 144 or Safari 26.2. For older
browsers, load the [invokers polyfill](https://keithcirkel.co.uk/invokers-polyfill)
before the component.

### API

| Method | Description |
| ------ | ----------- |
| `show()` | Opens the sheet. Resolves `true` if this call opened it, `false` if already open or canceled. |
| `close(returnValue?)` | Closes the sheet. Resolves `true` if this call closed it, `false` if already closed or canceled. `returnValue` applies to a modal sheet. |
| `init()` | Binds listeners. Called on connect. Call `destroy()` first to re-bind. |
| `destroy()` | Removes listeners and closes the dialog. Called on disconnect. |

| Property | Description |
| -------- | ----------- |
| `$dialog` | The `<dialog>`. |
| `$handle` | The drag handle, if any. |
| `trigger` | The button that last opened the sheet. |
| `dismissible` | Whether a handle pull may close the sheet. |

## Events

Dispatched on `document.documentElement`. Prefer constants from
`@agencecinq/utils`:

| Event | Constant | Cancelable | Detail | Description |
| ----- | -------- | ---------- | ------ | ----------- |
| `sheet:before-open` | `SHEET_BEFORE_OPEN` | Yes | `{ sheet, instance, trigger, waitUntil }` | Fired before the dialog opens. `preventDefault()` cancels, `waitUntil(promise)` defers. |
| `sheet:before-close` | `SHEET_BEFORE_CLOSE` | Yes | `{ sheet, instance, waitUntil }` | Fired before the dialog closes. `preventDefault()` cancels, `waitUntil(promise)` defers. |

`detail.sheet` is the dialog `id`. Once the dialog opens or closes, it fires
the native `toggle` event (`event.newState` is `"open"` or `"closed"`), in both
modes:

```js
document.querySelector("#cloak-sheet").addEventListener("toggle", (event) => {
  console.log(event.newState);
});
```

### Deferring open or close

```js
import { EVENTS } from "@agencecinq/utils";

document.documentElement.addEventListener(EVENTS.SHEET_BEFORE_CLOSE, (event) => {
  if (event.detail.sheet !== "cloak-sheet") return;

  event.detail.waitUntil(doAsyncWork());
});
```

Several listeners can defer the same action, and a rejected promise cancels
it. Call `waitUntil()` synchronously in the listener. TypeScript:
`BeforeOpenDetail` and `BeforeCloseDetail` from `@agencecinq/sheet`.

**UX:** defer open when the fetch is quick and the sheet would feel empty.
Otherwise open immediately and load on `toggle`. Defer close for save,
archive, or exit animation.

## Accessibility

- Label the dialog (`aria-labelledby`)
- Hide the handle from assistive tech (`aria-hidden="true"`)
- Provide a visible close button. Escape is not discoverable, and the button is
  the only way out with `closedby="none"`
- Focus on open and restore on close are native `<dialog>` behaviors. Put
  `autofocus` on the control the user came for
- In a non-modal sheet, set `inert` on the content the sheet covers while it is
  open, and lift it on `beforetoggle` so focus can return to the button
- Announce values the sheet updates elsewhere with `aria-live="polite"`
- Style focus with `:focus-visible`

## Migration

### From 2.x to 3.0

Requires invoker commands (see [Older browsers](#older-browsers)).

**1. Buttons.** Remove `<cinq-sheet-button>`, `aria-controls` and
`aria-expanded`. Target the dialog with `commandfor`:

```html
<!-- Before -->
<cinq-sheet-button>
  <button aria-controls="cloak-sheet" aria-expanded="false">Select a size</button>
</cinq-sheet-button>

<!-- After -->
<button commandfor="cloak-sheet" command="show-modal">Select a size</button>
```

Inside the dialog, close buttons take `command="request-close"`. The pull up
to open now works on any button that opens the sheet: keep `touch-action: none`
on the one that should take the gesture.

**2. `id`.** Move it from `<cinq-sheet>` to the `<dialog>`.

**3. Non-modal sheet.** Replace `data-modal="false"` on the host with `popover`
on the dialog, and give its buttons `command="toggle-popover"`. The dialog now
sits in the top layer: position it against the viewport, not inside a
container. A press outside closes it natively: drop
the scrim click handler. Escape and a press outside no longer go through
`sheet:before-close`, and `<form method="dialog">` no longer closes it: close
it on `submit`.

**4. State.** The host no longer reflects `open`. Style `dialog[open]` and
`dialog:popover-open` (Tailwind `open:` covers both). `<cinq-sheet open>` no
longer opens on load: call `sheet.show()`. `[dragging]` stays on the host.

**5. API.** `open(trigger?)` is now `show()`, and `toggle()` is gone: buttons
toggle a non-modal sheet with `command="toggle-popover"`.

**6. Events.** `sheet:toggle`, `sheet:open` and `sheet:close` are gone, with
their `EVENTS` constants (`@agencecinq/utils` 9.0), and so are the
`SheetDetail`, `ToggleDetail` and `OpenDetail` types. Open from a script with
`sheet.show()`, and listen to the dialog's `toggle` event:

```js
// Before
document.documentElement.addEventListener(EVENTS.SHEET_OPEN, (event) => {
  if (event.detail.sheet !== "cloak-sheet") return;
  load();
});

// After
document.querySelector("#cloak-sheet").addEventListener("toggle", (event) => {
  if (event.newState === "open") load();
});
```

**7. Exclusive sheets.** Opening a sheet no longer closes the other open modal
sheet. A modal sheet makes the page inert, so its buttons cannot open another
one. From inside a sheet, add `data-replace` to open the next one in place.

**8. Scroll lock.** Update the selector: `html:has(cinq-sheet > dialog:modal)`.

**9. Liquid snippet.** The `id` goes on the dialog. Re-copy the snippet if you
customized it.

### From 1.x to 2.0

Requires `@agencecinq/utils` >= 7.7.0.

**1. Deferring.** Replace `resolve()` with `waitUntil(promise)`:

```js
// Before
document.documentElement.addEventListener(EVENTS.SHEET_BEFORE_CLOSE, (event) => {
  if (event.detail.sheet !== "cloak-sheet") return;
  event.preventDefault();
  doAsyncWork().then(() => event.detail.resolve());
});

// After
document.documentElement.addEventListener(EVENTS.SHEET_BEFORE_CLOSE, (event) => {
  if (event.detail.sheet !== "cloak-sheet") return;
  event.detail.waitUntil(doAsyncWork());
});
```

`preventDefault()` now only cancels. A rejected promise cancels too.

**2. API.** `open()`, `close()` and `toggle()` return `Promise<boolean>`:

```js
// Before
if (sheet.close()) { ... }

// After
if (await sheet.close()) { ... }
```

**3. Handle pull.** A deferred pull keeps its offset until the close commits,
and snaps back if it is canceled. Markup and styling are unchanged.

## Build setup

```bash
pnpm -C packages/sheet build
```

## Tests

The tests run in Chromium, Firefox and WebKit through Playwright, since the
sheet relies on what each engine implements. Install the browsers once:

```bash
pnpm -C packages/sheet exec playwright install chromium firefox webkit
pnpm -C packages/sheet test
```

## Acknowledgments

See the [interactive docs](https://agencecinq.github.io/ui/components/sheet/) for live examples.

- [Dialog (Modal) Pattern (WAI-ARIA Practices)](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)
- [Invoker Commands API (MDN)](https://developer.mozilla.org/en-US/docs/Web/API/Invoker_Commands_API)
- [Popover API (MDN)](https://developer.mozilla.org/en-US/docs/Web/API/Popover_API)
- [Invokers polyfill](https://keithcirkel.co.uk/invokers-polyfill)
