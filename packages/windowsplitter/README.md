# @agencecinq/windowsplitter

Accessible window splitter as a lightweight Web Component (`<cinq-windowsplitter>`),
aligned with the
[WAI-ARIA Authoring Practices window splitter pattern](https://www.w3.org/WAI/ARIA/apg/patterns/windowsplitter/).

Inspired by [`@19h47/windowsplitter`](https://github.com/19h47/19h47-windowsplitter).

The host **is** the focusable separator. HTML is the source of truth for roles and
ARIA — you deliver clean markup; the component orchestrates pointer / keyboard
resizing and mirrors layout onto the primary pane.

## Install

```bash
pnpm add @agencecinq/windowsplitter
```

## Usage

```js
import "@agencecinq/windowsplitter";
```

```html
<div class="panes">
  <div id="toc" class="pane pane--primary" style="width: 30%">
    <strong id="toc-label">Table of Contents</strong>
  </div>
  <cinq-windowsplitter
    role="separator"
    tabindex="0"
    aria-orientation="vertical"
    aria-valuemin="0"
    aria-valuemax="100"
    aria-valuenow="30"
    aria-controls="toc"
    aria-labelledby="toc-label"
  ></cinq-windowsplitter>
  <div class="pane pane--secondary">Content</div>
</div>
```

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
| `[collapsed]` | Primary pane at `aria-valuemin` |
| `[dragging]` | Pointer drag in progress |
| `[disabled]` / `[aria-disabled="true"]` | Interaction disabled |
| `:focus-visible` | Keyboard focus on the separator |
| `--windowsplitter-value` / `--windowsplitter-ratio` / `--windowsplitter-offset` | On the container (parent) |

## Options

| Attribute / property | Description |
| -------------------- | ----------- |
| `data-windowsplitter-mode` | `resize` (default) \| `clip` \| `none` |
| `data-windowsplitter-step` | Arrow key step (default `1`) |
| `data-windowsplitter-page` | Page / Shift+Arrow step (default `10`) |
| `data-windowsplitter-fixed` | Enter / pointer toggle only |
| `formatSize` | CSS size for the primary pane in `resize` mode |
| `formatValue` | `aria-valuetext` formatter |
| `container` | Bounds element (default: `parentElement`) |
