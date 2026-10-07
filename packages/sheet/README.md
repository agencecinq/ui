[![](https://img.shields.io/npm/v/@agencecinq/sheet)](https://www.npmjs.com/package/@agencecinq/sheet)
[![](https://img.shields.io/npm/dm/@agencecinq/sheet)](https://www.npmjs.com/package/@agencecinq/sheet)

# @agencecinq/sheet

> Bottom sheet Web Component on native `<dialog>`.

`<cinq-sheet>` wraps a native `<dialog>` anchored to the bottom edge. It opens
with `showModal()`, closes on Escape, backdrop press or a pull on the handle,
and dispatches document level events. `<cinq-sheet-button>` wires triggers
through `aria-controls`.

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
    class="fixed inset-x-0 top-auto -bottom-4 m-0 w-auto max-w-none max-h-[calc(100dvh-4rem)] overflow-y-auto border-0 p-0 pb-4"
  >
    <div data-dom="drag-indicator" class="touch-none" aria-hidden="true"></div>
    <h2 id="cloak-title">Cloak of Elvenkind</h2>
    ...
  </dialog>
</cinq-sheet>
```

Importing `@agencecinq/sheet` registers both elements.

> **HTML is the source of truth.** Provide the `<dialog>`, its label and the
> optional `[data-dom="drag-indicator"]` handle. `top-auto` overrides the UA
> `top: 0`. A small overhang (`-bottom-4` with `pb-4`) keeps the bottom edge
> hidden while the panel moves.

### Shopify integration

```typescript
import { defineConfig } from "vite";
import { cinqSheetPlugin } from "@agencecinq/sheet/plugin";

export default defineConfig({
  plugins: [cinqSheetPlugin()],
});
```

The plugin copies `snippets/cinq-sheet.html.liquid`:

```liquid
{% render 'cinq-sheet.html',
   id: 'size-sheet',
   label: 'size-sheet-title',
   content: panel
%}
```

## API

| Attribute | Required | Description |
| --------- | -------- | ----------- |
| `id` | **Yes** | Sheet identifier, matched by `aria-controls`. |
| `open` | No | Reflected open state. |
| `dragging` | No | Set while the handle is pulled. |
| `dismissible` | No | `false` ignores Escape, backdrop press and pulls. |
| `modal` | No | `false` opens with `show()`. Read on open. |

| Method | Description |
| ------ | ----------- |
| `open(trigger?)` | Opens. Returns `true` when committed. |
| `close()` | Closes. Returns `true` when committed. |
| `toggle(trigger?)` | Opens or closes. |
| `init()` / `destroy()` | Bind and unbind listeners. |

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

### Scroll lock

```css
html:has(cinq-sheet[open] dialog:modal) {
  overflow: hidden;
}
```

## Events

Dispatched on `document.documentElement`. Prefer constants from
`@agencecinq/utils`:

| Event | Constant | Cancelable | Detail |
| ----- | -------- | ---------- | ------ |
| `sheet:toggle` | `SHEET_TOGGLE` | No | `{ sheet, trigger }` |
| `sheet:before-open` | `SHEET_BEFORE_OPEN` | Yes | `{ sheet, instance, trigger, resolve }` |
| `sheet:before-close` | `SHEET_BEFORE_CLOSE` | Yes | `{ sheet, instance, resolve }` |
| `sheet:open` | `SHEET_OPEN` | No | `{ sheet, trigger }` |
| `sheet:close` | `SHEET_CLOSE` | No | `{ sheet }` |

Opening a modal sheet closes the other open modal sheet.

## Accessibility

- Label the dialog (`aria-labelledby`)
- Hide the handle from assistive tech (`aria-hidden="true"`). Keep a visible
  close path for keyboard users (Escape, a close button or a submit)
- Focus on open and restore on close are native `<dialog>` behaviors
- Style focus with `:focus-visible`

See the [interactive docs](https://agencecinq.github.io/ui/components/sheet/)
for a live example.
