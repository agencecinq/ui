[![](https://img.shields.io/npm/v/@agencecinq/disclosure-button)](https://www.npmjs.com/package/@agencecinq/disclosure-button)
[![](https://img.shields.io/npm/dm/@agencecinq/disclosure-button)](https://www.npmjs.com/package/@agencecinq/disclosure-button)

# @agencecinq/disclosure-button

> Accessible WAI-ARIA disclosure button Web Component.

A disclosure button shows or hides a section of content. `<cinq-disclosure-button>`
wraps a trigger, wires up the `aria-expanded` / `aria-controls` relationship,
toggles the `hidden` attribute on controlled regions, and dispatches open/close
events.

Implementation follows the
[WAI-ARIA Authoring Practices disclosure pattern](https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/).
Inspired by [`@19h47/disclosure-button`](https://github.com/19h47/19h47-disclosure-button/).

## Installation

```bash
pnpm add @agencecinq/disclosure-button
```

## Usage

```js
import '@agencecinq/disclosure-button';
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

### Required markup

| Attribute / element | Required | Role |
| ------------------- | -------- | ---- |
| Inner `<button>`    | **Yes**  | Focusable trigger inside `<cinq-disclosure-button>`. |
| `aria-expanded`     | **Yes**  | Current disclosure state on the trigger. |
| `aria-controls`     | **Yes**  | Space-separated IDs of the controlled regions. |
| `hidden`            | **Yes**  | Set on each controlled region in its collapsed initial state. |

Use `[data-button]` instead of `<button>` when you need a different focusable
element as the trigger.

### API

| Attribute | Required | Description |
| --------- | -------- | ----------- |
| `expanded` | No | Reflected state on the host — useful for styling the wrapper. |

| Method | Description |
| ------ | ----------- |
| `open(emit?)` | Opens the disclosure. |
| `close(emit?)` | Closes the disclosure. |
| `toggle()` | Toggles open/closed. |
| `destroy()` | Detaches listeners. |

### Keyboard & focus

The trigger must be a native focusable control — typically
`<button type="button">`. Enter and Space activate the button through browser
defaults; the component listens for `click`, which those keys dispatch on
buttons.

| Key | Function |
| --- | -------- |
| `Enter` | Toggle the disclosure (native button behavior). |
| `Space` | Toggle the disclosure (native button behavior). |

The component does **not** move focus into the controlled region on open, nor
restore focus on close — focus stays on the trigger. Once open, users can tab
into focusable elements inside the region if you include any.

While collapsed, `hidden` keeps the region out of the tab order and accessibility
tree.

On `focus` / `blur`, a `.focus` class is toggled on the inner trigger:

```css
cinq-disclosure-button button.focus {
  outline: 2px solid currentColor;
  outline-offset: 2px;
}
```

### One button, multiple targets

`aria-controls` accepts several space-separated IDs — all matched regions open
and close together.

### Multiple buttons, one target

Several triggers can share the same `aria-controls` ID. Use one
`<cinq-disclosure-button>` per trigger — each instance listens for bubbling
open/close events and syncs when `event.detail.elements` references a shared DOM
node.

### Programmatic API

```js
const $host = document.querySelector('cinq-disclosure-button');

$host.open();
$host.close();
```

`open()` and `close()` accept an optional `emit` argument (default `true`). Pass
`false` to update state without dispatching an event. Linked triggers only sync
when the event is dispatched.

```js
$openLink.addEventListener("click", () => {
  $host.open();
});

$dismissButton.addEventListener("click", () => {
  $host.close();
});
```

Call `destroy()` when removing the element from the DOM to detach listeners.

## Events

| Event | Cancelable | Detail | Description |
| ----- | ---------- | ------ | ----------- |
| `disclosure-button:open` | Yes | `{ ids, elements, el }` | Fired before the disclosure opens. Cancel to abort. |
| `disclosure-button:close` | Yes | `{ ids, elements, el }` | Fired before the disclosure closes. Cancel to abort. |

```js
import { EVENTS } from "@agencecinq/utils";

$host.addEventListener(EVENTS.DISCLOSURE_BUTTON_OPEN, (event) => {
  if (!userMayOpen()) {
    event.preventDefault();
  }
});
```

`event.detail` carries `{ ids, elements, el }`.

### Updating the button label

The component does not change the trigger's visible text. Listen to the open/close
events and update the label in your app — useful for Show/Hide copy, i18n, or
custom designs:

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

### Read more / Read less

Keep a short excerpt visible and hide the rest. Style the trigger as inline text
and swap between Read more / Read less on open/close events.

## Build setup

```bash
pnpm -C packages/disclosure-button build
```

## Acknowledgments

- [Disclosure Pattern (WAI-ARIA Practices)](https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/)
- [`@19h47/disclosure-button`](https://github.com/19h47/19h47-disclosure-button/) — original implementation
