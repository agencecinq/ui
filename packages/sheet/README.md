[![](https://img.shields.io/npm/v/@agencecinq/sheet)](https://www.npmjs.com/package/@agencecinq/sheet)
[![](https://img.shields.io/npm/dm/@agencecinq/sheet)](https://www.npmjs.com/package/@agencecinq/sheet)

# @agencecinq/sheet

> Accessible bottom sheet Web Component built on the native `<dialog>` element.

A sheet presents content from the bottom edge. `<cinq-sheet>` wraps a native
`<dialog>`, opens it with `showModal()`, closes it on Escape, backdrop press or
a pull on the handle, and dispatches document level events.
`<cinq-sheet-button>` connects triggers through `aria-controls`.

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
<cinq-sheet-button>
  <button aria-controls="cloak-sheet" aria-expanded="false">
    Select a size
  </button>
</cinq-sheet-button>

<cinq-sheet id="cloak-sheet">
  <dialog
    aria-labelledby="cloak-title"
    closedby="any"
    class="fixed inset-x-0 top-auto -bottom-4 m-0 w-auto max-w-none max-h-[calc(100dvh-4rem)] overflow-y-auto border-0 p-0 pb-4"
  >
    <div data-dom="drag-indicator" class="touch-none" aria-hidden="true"></div>
    <h2 id="cloak-title">Cloak of Elvenkind</h2>
    ...
  </dialog>
</cinq-sheet>
```

Importing `@agencecinq/sheet` registers the Web Components automatically.
No manual `init()` call required.

> **HTML is the source of truth.** Provide the `<dialog>`, its label and the
> optional drag handle yourself. Use an a11y linter (axe-core, Lighthouse) to
> catch invalid markup.

`closedby="any"` adds backdrop press to Escape. `top-auto` overrides the UA
`top: 0`. A small overhang (`-bottom-4` with `pb-4`) keeps the bottom edge
hidden while the panel moves. Cap the height with `max-height`.

### Required markup

| Selector / attribute | Required | Role |
| -------------------- | -------- | ---- |
| `<cinq-sheet>` | **Yes** | Sheet host. Requires an `id`. |
| `<dialog>` | **Yes** | Native dialog inside the host. It is the panel. |
| `[data-dom="drag-indicator"]` | No | Drag handle inside the dialog. |
| `aria-controls` on trigger | **Yes** | Points to the sheet `id`. |

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

<cinq-sheet-button>
  <button aria-controls="size-sheet" aria-expanded="false">
    Select a size
  </button>
</cinq-sheet-button>
```

The snippet sets `closedby="any"` by default. Pass `closedby: 'none'` to block
every dismissal but your own close control.

### API

| Attribute | Required | Description |
| --------- | -------- | ----------- |
| `id` | **Yes** | Sheet identifier. Must match button `aria-controls`. |
| `open` | No | Reflected open state. Useful for styling. |
| `dragging` | No | Set while the handle is pulled. |
| `data-modal` | No | `false` opens with `show()`. Read on open. |

Dismissal is set on the `<dialog>` with the native `closedby` attribute:

| `closedby` | Escape | Backdrop press | Handle pull |
| ---------- | ------ | -------------- | ----------- |
| `any` | Yes | Yes | Yes |
| `closerequest` | Yes | No | Yes |
| absent | Modal only | No | Yes |
| `none` | No | No | No |

| Method | Description |
| ------ | ----------- |
| `open(trigger?)` | Opens the sheet. Resolves `true` if this call opened it, `false` if already open or canceled. |
| `close()` | Closes the sheet. Resolves `true` if this call closed it, `false` if already closed or canceled. |
| `toggle(trigger?)` | Toggles open/close. Resolves whether the sheet is open. |
| `destroy()` | Removes listeners and closes the dialog. Called on disconnect. |
| `init()` | Binds listeners and opens the dialog if `open` is already set. Called on connect; call `destroy()` first to re-bind. |

A `<form method="dialog">` submit closes the sheet too.

### Drag

Release the handle past 80 px, or with a quick downward flick, to close.
Otherwise the sheet snaps back. A pull upward gives a damped rubber band. The
host exposes the pull distance:

| Property | Meaning |
| -------- | ------- |
| `--cinq-sheet-drag-offset` | Pull distance in px, negative and damped upward, unset at rest |

### Pull up to open

A `<cinq-sheet-button>` opens its sheet on a pull up past 40 px, or a quick
upward flick. A tap still toggles. A pull that falls short does nothing. On
touch screens, set `touch-action: none` on the button that should take the
gesture, typically a handle outside the sheet. Buttons without it keep page
scroll.

### Motion

`max(-1rem, ...)` below caps the rubber band at the overhang so no gap shows
under the panel.

```css
cinq-sheet dialog {
  translate: 0 max(-1rem, var(--cinq-sheet-drag-offset, 0px));
  transition:
    translate 300ms ease-out,
    display 300ms allow-discrete,
    overlay 300ms allow-discrete;
}

cinq-sheet dialog:not([open]) {
  translate: 0 100%;
}

@starting-style {
  cinq-sheet dialog[open] {
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

A non-modal sheet laid out in the page flow (`position: absolute` inside a
container) can scroll the page as it opens: the browser moves focus into the
dialog while it still sits at its `@starting-style` offset, below the fold, and
scrolls to reveal it. A `fixed` sheet never does: scrolling the page does not
bring it closer. Prefer `position: fixed` unless the sheet must stay inside a
container.

### Background scroll

The package does **not** lock document scroll. Native `showModal()` makes the
page inert but the page can still scroll underneath. Prefer CSS in the theme:

```css
html:has(cinq-sheet[open] dialog:modal) {
  overflow: hidden;
}
```

## Events

Dispatched on `document.documentElement`. Prefer constants from
`@agencecinq/utils`:

| Event | Constant | Cancelable | Detail | Description |
| ----- | -------- | ---------- | ------ | ----------- |
| `sheet:toggle` | `SHEET_TOGGLE` | No | `{ sheet, trigger }` | Request open/close from a button. |
| `sheet:before-open` | `SHEET_BEFORE_OPEN` | Yes | `{ sheet, instance, trigger, waitUntil }` | Fired before `open` is set. `preventDefault()` cancels, `waitUntil(promise)` defers. |
| `sheet:before-close` | `SHEET_BEFORE_CLOSE` | Yes | `{ sheet, instance, waitUntil }` | Fired before `open` is removed. `preventDefault()` cancels, `waitUntil(promise)` defers. |
| `sheet:open` | `SHEET_OPEN` | No | `{ sheet, trigger }` | Fired after `open` is set. |
| `sheet:close` | `SHEET_CLOSE` | No | `{ sheet }` | Fired after `open` is removed. |

```js
import { EVENTS } from "@agencecinq/utils";

document.documentElement.addEventListener(EVENTS.SHEET_OPEN, (event) => {
  console.log(event.detail.sheet);
});
```

Opening a sheet closes any other open modal sheet.

### Deferring open or close

```js
document.documentElement.addEventListener(EVENTS.SHEET_BEFORE_CLOSE, (event) => {
  if (event.detail.sheet !== "cloak-sheet") return;

  event.detail.waitUntil(doAsyncWork());
});
```

Several listeners can defer the same action; a rejected promise cancels it.
Call `waitUntil()` synchronously in the listener. A vetoed handle pull snaps back. A
`<form method="dialog">` submit closes natively and skips `sheet:before-close`.
TypeScript: `BeforeOpenDetail` and `BeforeCloseDetail` from
`@agencecinq/sheet`.

**UX:** defer open when the fetch is quick and the sheet would feel empty.
Otherwise open immediately and load on `sheet:open`. Defer close for save,
archive, or exit animation.

## Accessibility

- Label the dialog (`aria-labelledby`)
- Hide the handle from assistive tech (`aria-hidden="true"`)
- Provide a visible close button. Escape is not discoverable, and the button is
  the only way out with `closedby="none"`
- Focus on open and restore on close are native `<dialog>` behaviors. Put
  `autofocus` on the control the user came for
- With `data-modal="false"` the page stays interactive. Set `inert` on the
  content the sheet covers while it is open, and lift it on `beforetoggle` so
  focus can return to the trigger
- Announce values the sheet updates elsewhere with `aria-live="polite"`
- Style focus with `:focus-visible`

## Migration

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

## Acknowledgments

See the [interactive docs](https://agencecinq.github.io/ui/components/sheet/) for live examples.
