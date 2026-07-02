[![](https://img.shields.io/npm/v/@agencecinq/disclosure-button)](https://www.npmjs.com/package/@agencecinq/disclosure-button)
[![](https://img.shields.io/npm/dm/@agencecinq/disclosure-button)](https://www.npmjs.com/package/@agencecinq/disclosure-button)

# @agencecinq/disclosure-button

> Accessible WAI-ARIA disclosure button controller.

A disclosure button shows or hides a section of content. This package wires up
the `aria-expanded` / `aria-controls` relationship, toggles visibility on the
controlled panels, and dispatches open/close events.

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
  aria-controls="panel-1"
>
  Show details
</button>

<div id="panel-1" aria-hidden="true" style="display: none">
  Disclosure content
</div>
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
| `aria-controls`     | **Yes**  | Space-separated IDs of the controlled panels. |
| `aria-hidden`       | Optional | When present on a panel, updated on open/close. |
| `style="display: …"` | Optional | When present, toggled between `block` and `none`. |

The controller adds/removes an `is-active` class and updates `pointer-events` on
panels that carry `aria-hidden`.

## Events

| Event | Cancelable | Detail | Description |
| ----- | ---------- | ------ | ----------- |
| `disclosure-button:open` | Yes | `{ ids, elements, el }` | Fired after the disclosure opens. |
| `disclosure-button:close` | Yes | `{ ids, elements, el }` | Fired after the disclosure closes. |

```js
import { EVENTS } from "@agencecinq/utils";

$button.addEventListener(EVENTS.DISCLOSURE_BUTTON_OPEN, (event) => {
  console.log(event.detail.elements);
});
```

## Programmatic API

```js
disclosure.open();
disclosure.close();
disclosure.toggle();
disclosure.destroy();
```

## Build setup

```bash
pnpm -C packages/disclosure-button build
```

## Acknowledgments

- [Disclosure Pattern (WAI-ARIA Practices)](https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/)
- [`@19h47/disclosure-button`](https://github.com/19h47/19h47-disclosure-button/) — original implementation
