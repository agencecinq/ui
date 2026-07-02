[![](https://img.shields.io/npm/v/@agencecinq/disclosure-button)](https://www.npmjs.com/package/@agencecinq/disclosure-button)
[![](https://img.shields.io/npm/dm/@agencecinq/disclosure-button)](https://www.npmjs.com/package/@agencecinq/disclosure-button)

# @agencecinq/disclosure-button

> Accessible WAI-ARIA disclosure button controller.

A disclosure button shows or hides a section of content. This package wires up
the `aria-expanded` / `aria-controls` relationship, toggles the `hidden`
attribute on controlled regions, and dispatches open/close events.

Implementation follows the
[WAI-ARIA Authoring Practices disclosure pattern](https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/).
Inspired by [`@19h47/disclosure-button`](https://github.com/19h47/19h47-disclosure-button/).

## Installation

```bash
pnpm add @agencecinq/disclosure-button
```

## Usage

```html
<button
  type="button"
  class="js-disclosure-button"
  aria-expanded="false"
  aria-controls="details-1"
>
  Show details
</button>

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

```js
import { DisclosureButton } from "@agencecinq/disclosure-button";

const $button = document.querySelector(".js-disclosure-button");
const disclosure = new DisclosureButton($button);

disclosure.init();
```

### Required markup

| Attribute / element | Required | Role |
| ------------------- | -------- | ---- |
| `aria-expanded`     | **Yes**  | Current disclosure state on the trigger. |
| `aria-controls`     | **Yes**  | Space-separated IDs of the controlled regions. |
| `hidden`            | **Yes**  | Set on each controlled region in its collapsed initial state. |

The package toggles the native `hidden` attribute. Layout and visibility styling
stay in your CSS.

### Keyboard & focus

The trigger must be a native focusable control — typically
`<button type="button">`. Enter and Space activate the button through browser
defaults; the controller listens for `click`, which those keys dispatch on
buttons.

| Key | Function |
| --- | -------- |
| `Enter` | Toggle the disclosure (native button behavior). |
| `Space` | Toggle the disclosure (native button behavior). |

The package does **not** move focus into the controlled region on open, nor
restore focus on close — focus stays on the trigger. Once open, users can tab
into focusable elements inside the region if you include any.

While collapsed, `hidden` keeps the region out of the tab order and accessibility
tree.

On `focus` / `blur`, the controller toggles a `.focus` class on the trigger:

```css
.js-disclosure-button.focus {
  outline: 2px solid currentColor;
  outline-offset: 2px;
}
```

### One button, multiple targets

`aria-controls` accepts several space-separated IDs — all matched regions open
and close together:

```html
<button
  aria-expanded="false"
  aria-controls="verbal-component somatic-component material-component"
>
  Show material components
</button>
```

### Multiple buttons, one target

Several triggers can share the same `aria-controls` ID. Initialise one
`DisclosureButton` per trigger — each instance listens for bubbling open/close
events and syncs when `event.detail.elements` references a shared DOM node.

### Programmatic API

```js
disclosure.open();
disclosure.close();
disclosure.toggle();
disclosure.destroy();
```

`open()` and `close()` accept an optional `emit` argument (default `true`). Pass
`false` to update state without dispatching an event. Linked triggers only sync
when the event is dispatched.

```js
$openLink.addEventListener("click", () => {
  disclosure.open();
});

$dismissButton.addEventListener("click", () => {
  disclosure.close();
});
```

Call `destroy()` when removing the trigger from the DOM to detach listeners.

## Events

| Event | Cancelable | Detail | Description |
| ----- | ---------- | ------ | ----------- |
| `disclosure-button:open` | Yes | `{ ids, elements, el }` | Fired before the disclosure opens. Cancel to abort. |
| `disclosure-button:close` | Yes | `{ ids, elements, el }` | Fired before the disclosure closes. Cancel to abort. |

```js
import { EVENTS } from "@agencecinq/utils";

$button.addEventListener(EVENTS.DISCLOSURE_BUTTON_OPEN, (event) => {
  if (!userMayOpen()) {
    event.preventDefault();
  }
});
```

`event.detail` carries `{ ids, elements, el }`.

### Updating the button label

The package does not change the trigger's visible text. Listen to the open/close
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
