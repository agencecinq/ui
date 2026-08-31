[![](https://img.shields.io/npm/v/@agencecinq/windowsplitter)](https://www.npmjs.com/package/@agencecinq/windowsplitter)
[![](https://img.shields.io/npm/dm/@agencecinq/windowsplitter)](https://www.npmjs.com/package/@agencecinq/windowsplitter)

# @agencecinq/windowsplitter

> Accessible WAI-ARIA window splitter as a lightweight Web Component.

A window splitter lets users resize a primary pane with a focusable separator.
`<cinq-windowsplitter>` is the **layout wrapper** (bounds + CSS custom
properties). A nested `[role="separator"]` (or `slider`) is the interactive
control. You deliver clean markup; the component wires pointer / keyboard
resizing and mirrors layout onto the primary pane.

Implementation follows the
[WAI-ARIA Authoring Practices window splitter pattern](https://www.w3.org/WAI/ARIA/apg/patterns/windowsplitter/).
Inspired by [`@19h47/windowsplitter`](https://github.com/19h47/19h47-windowsplitter).

## Installation

```bash
pnpm add @agencecinq/windowsplitter
```

## Usage

```js
import "@agencecinq/windowsplitter";
```

```html
<cinq-windowsplitter class="panes">
  <div id="toc" class="pane pane--primary" style="width: 30%">
    <strong id="toc-label">Table of Contents</strong>
  </div>
  <div
    role="separator"
    tabindex="0"
    aria-orientation="vertical"
    aria-valuemin="0"
    aria-valuemax="100"
    aria-valuenow="30"
    aria-controls="toc"
    aria-labelledby="toc-label"
  ></div>
  <div class="pane pane--secondary">Content</div>
</cinq-windowsplitter>
```

> **HTML is the source of truth.** ARIA values, orientation, labelling, and
> `aria-controls` live on the separator. The component will not invent missing
> markup. Use an a11y linter (axe-core, Lighthouse) to catch invalid markup.

The primary pane is resolved live via
[`ariaControlsElements`](https://developer.mozilla.org/en-US/docs/Web/API/Element/ariaControlsElements)
on the separator.

### Required markup

| Selector / attribute | Required | Role |
| -------------------- | -------- | ---- |
| `<cinq-windowsplitter>` | **Yes** | Layout wrapper / bounds container. |
| Nested `[role="separator"]` or `[role="slider"]` | **Yes** | Focusable control (`$separator`). |
| `tabindex="0"` | **Yes** | On the separator. |
| `aria-orientation` | **Yes** | On the separator: `vertical` or `horizontal`. |
| `aria-valuemin` / `aria-valuemax` / `aria-valuenow` | **Yes** | On the separator. |
| `aria-controls` | **Yes** (for `resize` / `clip`) | On the separator: id of the primary pane. |
| `aria-label` / `aria-labelledby` | **Yes** | On the separator. |

### Options

| Attribute / property | Description |
| -------------------- | ----------- |
| `data-mode` | `resize` (default) \| `clip` \| `none` |
| `data-step` | Arrow key step (default `1`) |
| `data-page` | Page / Shift+Arrow step (default `10`) |
| `data-fixed` | Enter / pointer toggle only |
| `disabled` / `aria-disabled` | Disable interaction (host and/or separator) |
| `formatSize` | `FormatSize`: CSS size for the primary pane in `resize` mode |
| `formatValue` | `FormatValue`: `aria-valuetext` formatter |

### API

| Method | Description |
| ------ | ----------- |
| `setValue(value, trigger?)` | Set `aria-valuenow` on the separator and update layout. |
| `collapse(trigger?)` / `restore(trigger?)` / `toggle(trigger?)` | Collapse helpers (`history` only from `collapse` / Enter). |
| `sync()` | Re-read ARIA and re-apply layout. |
| `destroy()` | Removes listeners and observers. Called automatically from `disconnectedCallback`. |

| Property | Description |
| -------- | ----------- |
| `$separator` | Focusable separator control. |
| `$primary` | Primary pane from `ariaControlsElements` (live). |
| `value` / `min` / `max` / `ratio` / `orientation` | Read from separator ARIA (HTML source of truth). |
| `collapsed` / `disabled` | Derived state. |
| `mode` / `step` / `page` / `fixed` | Options (also via data attributes). |
| `formatSize` / `formatValue` | Formatters. |

## Events

Dispatched on the **host** `<cinq-windowsplitter>` (bubble). Prefer constants
from `@agencecinq/utils`:

| Event | Constant | Detail | When |
| ----- | -------- | ------ | ---- |
| `windowsplitter:change` | `WINDOWSPLITTER_CHANGE` | `{ value, min, max, ratio, collapsed }` | After a user-driven (or `trigger: true`) value change |

```js
import { EVENTS } from "@agencecinq/utils";

const host = document.querySelector("cinq-windowsplitter");

host.addEventListener(EVENTS.WINDOWSPLITTER_CHANGE, ({ detail }) => {
  console.log(detail.value, detail.collapsed);
});
```

## Styling hooks

| Hook | When |
| ---- | ---- |
| `[collapsed]` | Primary pane at `aria-valuemin` (on the host) |
| `[dragging]` | Pointer drag in progress (on the host) |
| `[disabled]` / `[aria-disabled="true"]` | Interaction disabled |
| `:focus-visible` on `[role="separator"]` | Keyboard focus on the separator |
| `--value` / `--ratio` / `--offset` | On the host |

## Keyboard

| Key | Function |
| --- | -------- |
| `ArrowLeft` / `ArrowRight` | Move a **vertical** splitter |
| `ArrowUp` / `ArrowDown` | Move a **horizontal** splitter |
| `Enter` | Collapse / restore |
| `Home` / `End` | Jump to min / max |
| `PageUp` / `PageDown` | Step by `page` |
| `Shift` + Arrow | Step by `page` |

A fixed splitter (`data-fixed`) omits arrow keys and only
implements Enter (and pointer toggle).

## Build setup

```bash
pnpm -C packages/windowsplitter build
```

## Acknowledgments

- [Window Splitter Pattern (WAI-ARIA Practices)](https://www.w3.org/WAI/ARIA/apg/patterns/windowsplitter/)
- [`@19h47/windowsplitter`](https://github.com/19h47/19h47-windowsplitter): original implementation

See the [interactive docs](https://agencecinq.github.io/ui/components/windowsplitter/) for live examples.
