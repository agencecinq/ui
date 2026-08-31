[![](https://img.shields.io/npm/v/@agencecinq/disclosure-button)](https://www.npmjs.com/package/@agencecinq/disclosure-button)
[![](https://img.shields.io/npm/dm/@agencecinq/disclosure-button)](https://www.npmjs.com/package/@agencecinq/disclosure-button)

# @agencecinq/disclosure-button

> Accessible, WAI-ARIA disclosure button as a lightweight Web Component.

A disclosure button shows or hides a section of content. `<cinq-disclosure-button>`
wraps a `<button>`, wires up `aria-expanded` / `aria-controls`, toggles `hidden` on
controlled regions, and dispatches open/close events.

Implementation follows the
[WAI-ARIA Authoring Practices disclosure pattern](https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/).
Inspired by [`@19h47/disclosure-button`](https://github.com/19h47/19h47-disclosure-button/).

## Installation

```bash
pnpm add @agencecinq/disclosure-button
```

## Usage

```js
import "@agencecinq/disclosure-button";
```

```html
<cinq-disclosure-button>
  <button
    type="button"
    aria-expanded="false"
    aria-controls="details-1"
  >
    Show more
  </button>
</cinq-disclosure-button>

<div id="details-1" class="foo" hidden>
  Disclosure content
</div>
```

```css
.foo[hidden] {
  display: none;
}

.foo {
  display: flex;
}
```

Importing the package registers the custom element. Controlled regions live
**outside** the host and are resolved via
[`ariaControlsElements`](https://developer.mozilla.org/en-US/docs/Web/API/Element/ariaControlsElements)
(Chrome 119+, Firefox 119+, Safari 17.4+).

> **HTML is the source of truth.** The component will not auto-set `role`,
> auto-migrate attributes, or warn about missing labels. Use an a11y linter
> (axe-core, Lighthouse) to catch invalid markup.

### Required markup

| Attribute / element | Required | Role |
| ------------------- | -------- | ---- |
| Inner `<button>` | **Yes** | Focusable trigger inside `<cinq-disclosure-button>`. |
| `aria-expanded` | **Yes** | Current disclosure state on the trigger. |
| `aria-controls` | **Yes** | Space-separated ID(s) of the controlled region(s). |
| `hidden` | **Yes** | On each controlled region when collapsed. |

### API

| Method | Description |
| ------ | ----------- |
| `init()` | Binds markup + listeners. Call `destroy()` first if already bound. |
| `destroy()` | Removes listeners. Safe while the host stays mounted. |
| `open(emit?)` | Shows every controlled element. |
| `close(emit?)` | Hides every controlled element. |
| `toggle()` | Closes if any controlled element is visible. Otherwise opens all. |
| `update()` | Syncs `aria-expanded` from the DOM (e.g. after an external dismiss). |

After mutating the light DOM while the host stays mounted:

```js
$host.destroy();
// mutate button / aria-controls...
$host.init();
```

| Property | Description |
| -------- | ----------- |
| `$button` | The inner `<button>`. |
| `elements` | Controlled elements from `ariaControlsElements` at connect time. |
| `expanded` | Reads `aria-expanded` on the trigger. Call `update()` after external DOM changes. |

`open()` / `close()` accept an optional `emit` flag (default `true`).

When several regions are controlled: `aria-expanded` is `true` while **at least
one** is visible. A trigger click closes all if any remain open.

Style via the trigger, e.g. `button[aria-expanded="true"]` or
`cinq-disclosure-button:has([aria-expanded="true"])`.

### Keyboard & focus

The trigger must be a native `<button type="button">`. Enter and Space activate
it through the browser. The component listens for `click`. Focus stays on the
trigger when opening or closing. While collapsed, `hidden` keeps the region out
of the tab order and accessibility tree.

Style focus with native pseudo-classes:

```css
cinq-disclosure-button button:focus-visible {
  outline: 2px solid currentColor;
  outline-offset: 2px;
}
```

### One button, multiple targets

`aria-controls` is an ID reference list: one control may reference several
elements (see the [`ariaControlsElements` MDN example](https://developer.mozilla.org/en-US/docs/Web/API/Element/ariaControlsElements)).
After a partial dismiss (`region.hidden = true`), call `update()` so
`aria-expanded` stays honest.

### Multiple buttons, one target

Several triggers can share the same ID. Use one `<cinq-disclosure-button>` per
trigger and sync sibling `aria-expanded` yourself from `event.detail.open` /
`event.detail.$button`.

### Programmatic API

```js
const $host = document.querySelector("cinq-disclosure-button");

$host.open();
$host.close();
$host.toggle();
$host.update();
```

```js
$openLink.addEventListener("click", () => {
  $host.open();
});

$dismissButton.addEventListener("click", () => {
  $host.close();
});
```

## Events

| Event | Cancelable | Detail | Description |
| ----- | ---------- | ------ | ----------- |
| `disclosure-button:open` | Yes | `{ ids, elements, $button, open: true }` | Fired on the trigger before open. Cancel to abort. |
| `disclosure-button:close` | Yes | `{ ids, elements, $button, open: false }` | Fired on the trigger before close. Cancel to abort. |

```js
import { EVENTS } from "@agencecinq/utils";

$host.addEventListener(EVENTS.DISCLOSURE_BUTTON_OPEN, (event) => {
  if (!userMayOpen()) {
    event.preventDefault();
  }
});
```

`event.detail` carries `{ ids, elements, $button, open }`. Events fire **before** the
DOM mutates: use `detail.open` rather than reading `hidden` yet.

### Updating the button label

The component does not change the trigger’s visible text. Listen to open/close
and update copy in your app:

```js
import { EVENTS } from "@agencecinq/utils";

const labels = { closed: "Show details", open: "Hide details" };

$button.addEventListener(EVENTS.DISCLOSURE_BUTTON_OPEN, () => {
  $button.textContent = labels.open;
});

$button.addEventListener(EVENTS.DISCLOSURE_BUTTON_CLOSE, () => {
  $button.textContent = labels.closed;
});
```

## Build setup

```bash
pnpm -C packages/disclosure-button build
```

## Acknowledgments

- [Disclosure Pattern (WAI-ARIA Practices)](https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/)
- [`@19h47/disclosure-button`](https://github.com/19h47/19h47-disclosure-button/): original implementation

See the [interactive docs](https://agencecinq.github.io/ui/components/disclosure-button/) for live examples.
