[![](https://img.shields.io/npm/v/@agencecinq/accordion)](https://www.npmjs.com/package/@agencecinq/accordion)
[![](https://img.shields.io/npm/dm/@agencecinq/accordion)](https://www.npmjs.com/package/@agencecinq/accordion)

# @agencecinq/accordion

> Accessible, WAI-ARIA accordion as a lightweight Web Component.

An accordion shows and hides sections of content. `<cinq-accordion>` wires up
header buttons, `aria-expanded` / `aria-controls` relationships, optional
height transitions, keyboard navigation between headers, and open/close events.

Implementation follows the
[WAI-ARIA Authoring Practices accordion pattern](https://www.w3.org/WAI/ARIA/apg/patterns/accordion/).
Inspired by [`@19h47/accordion`](https://github.com/19h47/19h47-accordion).

## Installation

```bash
pnpm add @agencecinq/accordion
```

## Usage

### Web Component (`<cinq-accordion>`)

```html
<cinq-accordion>
  <div data-accordion-panel data-accordion-open="true" data-accordion-deselect="true">
    <button
      type="button"
      data-accordion-header
      id="section-1-header"
      aria-expanded="true"
      aria-controls="section-1-body"
    >
      Section 1
    </button>

    <div id="section-1-body" role="region" aria-labelledby="section-1-header">
      <div data-accordion-inner>
        Panel content
      </div>
    </div>
  </div>

  <div data-accordion-panel data-accordion-open="false">
    <button
      type="button"
      data-accordion-header
      id="section-2-header"
      aria-expanded="false"
      aria-controls="section-2-body"
    >
      Section 2
    </button>

    <div id="section-2-body" role="region" aria-labelledby="section-2-header" hidden>
      <div data-accordion-inner>
        More content
      </div>
    </div>
  </div>
</cinq-accordion>
```

```js
import "@agencecinq/accordion";
```

Importing `@agencecinq/accordion` registers the Web Component automatically —
no manual `init()` call required.

> **HTML is the source of truth.** The component will not auto-set `role`,
> auto-migrate attributes, or warn about missing labels. Use an a11y linter
> (axe-core, Lighthouse) to catch invalid markup.

### Required markup

| Selector / attribute | Required | Role |
| -------------------- | -------- | ---- |
| `<cinq-accordion>` | **Yes** | Accordion container. |
| `[data-accordion-panel]` | **Yes** | Panel wrapper for each section. |
| `[data-accordion-header]` ‖ `button` | **Yes** | Focusable trigger inside each panel. |
| `aria-expanded` | **Yes** | Current panel state on the trigger. |
| `aria-controls` | **Yes** | ID of the controlled region. |
| `role="region"` | **Yes** | On each panel body element. |
| `aria-labelledby` | **Yes** | On each region, referencing the header `id`. |
| `hidden` | **Yes** | On collapsed regions in their initial state. |
| `[data-accordion-inner]` | Recommended | Inner wrapper used for height measurement. |

### Options

Configured via data attributes on `<cinq-accordion>`:

| Attribute | Type | Default | Description |
| --------- | ---- | ------- | ----------- |
| `data-accordion-multiselectable` | boolean | `false` | Allow multiple panels open at once. |
| `data-accordion-hash` | boolean | `true` | Open the panel whose region `id` matches the URL hash (`#id` or `#/id`). |

Per panel:

| Attribute | Type | Default | Description |
| --------- | ---- | ------- | ----------- |
| `data-accordion-open` | boolean | — | Reflected open state — useful for styling. |
| `data-accordion-deselect` | boolean | `false` | Allow collapsing the panel when it is already open. |

### Nested accordion

Nest a `<cinq-accordion>` inside a panel body. Each instance only binds its own
panels. Set `data-accordion-hash="false"` on nested hosts to avoid hash
collisions.

### Keyboard support

| Key | Function |
| --- | -------- |
| `Tab` / `Shift + Tab` | Move focus through focusable elements in the page. |
| `Space` / `Enter` | Toggle the focused header (native button behavior). |
| `Arrow Up` / `Arrow Down` | Move focus between accordion headers. |
| `Arrow Left` / `Arrow Right` | Move focus between accordion headers. |
| `Home` | Focus the first header. |
| `End` | Focus the last header. |

### Programmatic API

```js
const $accordion = document.querySelector("cinq-accordion");

$accordion.closeAll();
$accordion.destroy(); // unbind
// …mutate panel DOM…
$accordion.init(); // re-bind
```

Each panel exposes `openPanel(emit?)`, `close(emit?)`, and `toggle()` on the
`Panel` instances via `$accordion.panels` (also exported as `Panel`).

## Events

| Event | Cancelable | Detail | Description |
| ----- | ---------- | ------ | ----------- |
| `accordion-panel:open` | Yes | `{ el, index }` | Fired before a panel opens. Cancel to abort. |
| `accordion-panel:close` | Yes | `{ el, index }` | Fired before a panel closes. Cancel to abort. |

```js
import { EVENTS } from "@agencecinq/utils";

$accordion.addEventListener(EVENTS.ACCORDION_PANEL_OPEN, (event) => {
  console.log(event.detail.index);
});
```

## Build setup

```bash
pnpm -C packages/accordion build
```

## Acknowledgments

- [Accordion Pattern (WAI-ARIA Practices)](https://www.w3.org/WAI/ARIA/apg/patterns/accordion/)
- [`@19h47/accordion`](https://github.com/19h47/19h47-accordion) — original implementation
