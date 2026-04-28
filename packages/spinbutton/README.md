[![](https://img.shields.io/npm/v/@agencecinq/spinbutton)](https://www.npmjs.com/package/@agencecinq/spinbutton)
[![](https://img.shields.io/npm/dm/@agencecinq/spinbutton)](https://www.npmjs.com/package/@agencecinq/spinbutton)

# @agencecinq/spinbutton

> Accessible, WAI-ARIA spinbutton as a lightweight Web Component.

A spinbutton restricts its value to a set or range of discrete values. It
provides an accessible, keyboard-navigable interface for numerical input that
maintains value constraints, supports internationalization through custom text
labels, and emits events when values change.

Implementation follows the
[WAI-ARIA Authoring Practices spinbutton pattern](https://www.w3.org/WAI/ARIA/apg/patterns/spinbutton/).
Inspired by [`@19h47/spinbutton`](https://github.com/19h47/19h47-spinbutton/).

## Installation

```bash
pnpm add @agencecinq/spinbutton
```

## Usage

### Web Component (`<cinq-spinbutton>`)

```html
<cinq-spinbutton>
  <button data-spinbutton-action="decrease" type="button" aria-label="Decrease" tabindex="-1">
    −
  </button>

  <input
    type="number"
    aria-label="Quantity"
    aria-valuemin="0"
    aria-valuemax="10"
    aria-valuenow="1"
    value="1"
  />

  <button data-spinbutton-action="increase" type="button" aria-label="Increase" tabindex="-1">
    +
  </button>
</cinq-spinbutton>
```

```js
import "@agencecinq/spinbutton";
```

#### Why nothing needs to be initialized

Importing `@agencecinq/spinbutton` registers the Web Component in the
**Custom Elements Registry** (`customElements.define('cinq-spinbutton', Spinbutton)`).
The browser then automatically upgrades every existing `<cinq-spinbutton>` in
the DOM, calling `connectedCallback()`, which in turn calls `init()`.
You don't need `new Spinbutton(...)` or to call `init()` manually.

### Required DOM

| Selector                              | Required | Role                                                                     |
| ------------------------------------- | -------- | ------------------------------------------------------------------------ |
| `<cinq-spinbutton>`                   | Yes      | Wrapper component, controls the inner `<input>`. Carries no ARIA state.  |
| `[data-spinbutton-input]` ‖ `input`   | **Yes**  | The focusable element. Hosts `role="spinbutton"` and ARIA value state.   |
| `[data-spinbutton-action="increase"]` | Optional | Click to increase by `step`. Auto-disabled at the max.                   |
| `[data-spinbutton-action="decrease"]` | Optional | Click to decrease by `step`. Auto-disabled at the min.                   |

The component appends a visually hidden `<div aria-live="polite" aria-atomic="true">`
to announce value changes to screen readers. The hiding styles are applied
inline so the component stays self-contained — **no `.sr-only` utility class
required from the consumer**.

### ARIA semantics live on the `<input>`

Per APG, all ARIA state of a spinbutton lives on the focusable element — i.e.
your `<input>`. The component reads `aria-valuemin/max/now` from it at mount
and writes `aria-valuenow`, `aria-valuetext`, and `aria-invalid` to it as the
state changes. The host `<cinq-spinbutton>` carries no ARIA state.

**HTML is the source of truth**: the component does not auto-set `role`,
auto-migrate attributes, or warn about missing labels. Use a proper a11y linter
(axe-core, Lighthouse, eslint-plugin-jsx-a11y) to catch invalid markup.

Practical implications:

- If you use `<input type="number">`, the implicit ARIA role is already
  `spinbutton` — nothing to add.
- If you use `<input type="text">`, set `role="spinbutton"` explicitly on it.
- The accessible name **must** come from `aria-label`, `aria-labelledby`,
  a wrapping `<label>`, or a `<label for="…">`. There is no fallback.

### Buttons remain out of the tab sequence

The `+` / `−` buttons must not be in the tab order — they are operated via the
keyboard arrows of the input itself (per the APG pattern). Always set
`tabindex="-1"` on them, and provide an `aria-label` so screen-reader users
who do reach them via swipe gestures still get a meaningful name.

## Options

Configured via **data attributes** on the host:

| Attribute                | Type   | Default | Description                                                          |
| ------------------------ | ------ | ------- | -------------------------------------------------------------------- |
| `data-spinbutton-step`   | number | `1`     | Increment used by buttons and arrow keys.                            |
| `data-spinbutton-delay`  | number | `20`    | Throttle (ms) before the `spinbutton-change` event is dispatched.    |
| `data-spinbutton-text`   | JSON   | -       | `{"single":"item","plural":"items"}` — appended to `aria-valuetext`. |

```html
<cinq-spinbutton
  data-spinbutton-step="5"
  data-spinbutton-text='{"single":"barrel","plural":"barrels"}'
>
  <input
    type="number"
    aria-label="Barrels"
    aria-valuemin="5"
    aria-valuemax="50"
    aria-valuenow="5"
  />
  …
</cinq-spinbutton>
```

## Keyboard support

Strictly the keys defined by the
[APG pattern](https://www.w3.org/WAI/ARIA/apg/patterns/spinbutton/#keyboardinteraction).
Other keys (Arrow Left/Right, Backspace, Delete, printable characters) are left
to the browser so the user can freely edit the input's text.

| Key         | Function                                          |
| ----------- | ------------------------------------------------- |
| Arrow Up    | Increase value by `step`.                         |
| Arrow Down  | Decrease value by `step`.                         |
| Page Up     | Increase value by `step × 5` (optional per APG).  |
| Page Down   | Decrease value by `step × 5` (optional per APG).  |
| Home        | Jump to `aria-valuemin` (when defined).           |
| End         | Jump to `aria-valuemax` (when defined).           |

## Events

| Event               | Cancelable | Detail              | Description                          |
| ------------------- | ---------- | ------------------- | ------------------------------------ |
| `spinbutton-change` | Yes        | `{ value: number }` | Throttled value change notification. |

The event is dispatched on `<cinq-spinbutton>` and bubbles. The typed value is
committed on `change` (blur / Enter), not on every keystroke, so the user can
freely type intermediate values that fall outside the bounds.

```js
const $spinbutton = document.querySelector("cinq-spinbutton");

$spinbutton?.addEventListener("spinbutton-change", (event) => {
  console.log(event.detail.value);
});
```

## Programmatic API

```js
const $spinbutton = document.querySelector("cinq-spinbutton");

$spinbutton.setMin(10);     // Updates min, re-clamps current value
$spinbutton.setMax(200);    // Updates max, re-clamps current value
$spinbutton.setValue(50);   // Sets current value (emits by default)
$spinbutton.increase();     // +step
$spinbutton.decrease();     // -step
$spinbutton.destroy();      // Removes listeners + live region
```

## Build Setup

```bash
pnpm -C packages/spinbutton build
```

## Acknowledgments

- [Spinbutton Pattern (WAI-ARIA Practices)](https://www.w3.org/WAI/ARIA/apg/patterns/spinbutton/)
- [`@19h47/spinbutton`](https://github.com/19h47/19h47-spinbutton/) — original implementation
