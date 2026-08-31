[![](https://img.shields.io/npm/v/@agencecinq/spinbutton)](https://www.npmjs.com/package/@agencecinq/spinbutton)
[![](https://img.shields.io/npm/dm/@agencecinq/spinbutton)](https://www.npmjs.com/package/@agencecinq/spinbutton)

# @agencecinq/spinbutton

> Accessible, WAI-ARIA spinbutton as a lightweight Web Component.

A spinbutton restricts its value to a set or range of discrete values. `<cinq-spinbutton>`
provides an accessible, keyboard-navigable interface for numerical input that
maintains value constraints, and dispatches events when values change.

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
  <button name="decrease" type="button" aria-label="Decrease" tabindex="-1">
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

  <button name="increase" type="button" aria-label="Increase" tabindex="-1">
    +
  </button>

  <!-- Optional: announce changes while the input stays focused -->
  <div aria-live="polite" aria-atomic="true" class="sr-only"></div>
</cinq-spinbutton>
```

```js
import "@agencecinq/spinbutton";
```

Importing `@agencecinq/spinbutton` registers the Web Component automatically.
No manual `init()` call required.

> **HTML is the source of truth.** The component will not auto-set `role`,
> auto-migrate attributes, or warn about missing labels. Use an a11y linter
> (axe-core, Lighthouse) to catch invalid markup.

Use `input type="number"` (implicit `role="spinbutton"`) or set `role="spinbutton"`
explicitly on `input type="text"`.

### Required markup

| Attribute / element | Required | Role |
| ------------------- | -------- | ---- |
| `<cinq-spinbutton>` | **Yes** | Wrapper component, controls the inner input. Carries no ARIA state. |
| `<input>` | **Yes** | The focusable element. One input per host. Hosts `role="spinbutton"` and ARIA value state. |
| `button[name="increase"]` | Optional | Click to increase by step. Auto-disabled at the max. |
| `button[name="decrease"]` | Optional | Click to decrease by step. Auto-disabled at the min. |
| `[aria-live]` | Optional | Live region mirrored when `formatValue` is set. One per host. Style/hide in your CSS. |

The component writes `aria-valuenow` and `value` on the input. Set `aria-valuetext`
in the markup yourself, or assign `formatValue` to keep it in sync (and optionally
mirror into `[aria-live]`). Without `formatValue`, the component does not touch
`aria-valuetext`.

Per the [APG spinbutton pattern](https://www.w3.org/WAI/ARIA/apg/patterns/spinbutton/),
all ARIA state lives on the focusable `<input>`. The host carries no ARIA state.

### Markup variants

| Variant | Markup |
| ------- | ------ |
| Number input | `input type="number"` (implicit `role="spinbutton"`) |
| Text input | `input type="text"` + `role="spinbutton"` |
| Visible label | `aria-labelledby` referencing external text |
| Compact | `aria-label` on the `<input>` |
| Input only | `<input>` without + / − buttons |
| `formatValue` | `(value) => string` for `aria-valuetext` (+ optional `[aria-live]`) |

See the [interactive docs](https://agencecinq.github.io/ui/components/spinbutton/) for live examples of each variant.

### `formatValue` and plural rules

Assign `formatValue` in JS. Use `Intl.PluralRules` (or your i18n library) for
locale-aware pluralisation (English: one/other, Polish: one/few/many/other;
Arabic: up to six categories):

```js
const labels = { one: "level", other: "levels" };
const pluralRules = new Intl.PluralRules("en");

host.formatValue = (value) => {
  const unit = labels[pluralRules.select(value)] ?? labels.other;
  return `${value} ${unit}`;
};
```

### Buttons out of the tab sequence

The + / − buttons must not be in the tab order. They are operated via the
keyboard arrows of the `<input>` itself (per the APG pattern). Always set
`tabindex="-1"` on them, and provide an `aria-label` so screen-reader users
who do reach them via swipe gestures still get a meaningful name.

### API

| Attribute | Type | Default | Description |
| --------- | ---- | ------- | ----------- |
| `data-step` | number | `1` | Increment used by buttons and arrow keys. |
| `data-delay` | number | `100` | Minimum interval (ms) between `spinbutton:change` dispatches during rapid value changes. DOM updates are not throttled. |

| Property | Description |
| -------- | ----------- |
| `formatValue` | Optional formatter for `aria-valuetext` and the optional `[aria-live]` child. |

| Method | Description |
| ------ | ----------- |
| `init()` | Binds markup + listeners. Call `destroy()` first if already bound. |
| `setValue(value, emit?)` | Sets the current value. Clamped to min/max. |
| `setMin(value, emit?)` | Updates `aria-valuemin` and re-clamps the current value. |
| `setMax(value, emit?)` | Updates `aria-valuemax` and re-clamps the current value. |
| `increase()` | Adds step to the current value. |
| `decrease()` | Subtracts step from the current value. |
| `destroy()` | Detaches listeners. |

| Property | Description |
| -------- | ----------- |
| `$input` | The inner `<input>`. |
| `$increase` | The optional increase `<button>`. |
| `$decrease` | The optional decrease `<button>`. |
| `$live` | The optional `[aria-live]` element. |

### Keyboard support

Strictly the keys defined by the
[APG pattern](https://www.w3.org/WAI/ARIA/apg/patterns/spinbutton/#keyboardinteraction).
Other keys (Arrow Left/Right, Backspace, Delete, printable characters) are left
to the browser so the user can freely edit the input's text.

| Key | Function |
| --- | -------- |
| Arrow Up | Increase value by step. |
| Arrow Down | Decrease value by step. |
| Page Up | Increase value by step × 5 (optional per APG). |
| Page Down | Decrease value by step × 5 (optional per APG). |
| Home | Jump to `aria-valuemin` (when defined). |
| End | Jump to `aria-valuemax` (when defined). |

Typed values commit on `change` (blur / Enter), not on every keystroke. Out-of-range
entries set `aria-invalid="true"` on the input, then clamp to the nearest bound.

### Programmatic API

```js
const $spinbutton = document.querySelector("cinq-spinbutton");

$spinbutton.setMin(10);
$spinbutton.setMax(200);
$spinbutton.setValue(50);
$spinbutton.increase();
$spinbutton.decrease();
```

`setValue()`, `setMin()`, and `setMax()` accept an optional `emit` argument (default
`true`). Pass `false` to update state without dispatching an event.

Call `destroy()` when removing the element from the DOM to detach listeners.
After mutating light DOM (e.g. swapping the input), call `destroy()` then
`init()`:

```js
$spinbutton.destroy();
// mutate light DOM...
$spinbutton.init();
```

## Events

| Event | Cancelable | Detail | Description |
| ----- | ---------- | ------ | ----------- |
| `spinbutton:change` | Yes | value: number | Throttled notification when the value changes (see `data-delay`). |

```js
import { EVENTS } from "@agencecinq/utils";

$spinbutton.addEventListener(EVENTS.SPINBUTTON_CHANGE, (event) => {
  console.log(event.detail.value);
});
```

`spinbutton:change` is a throttled notification fired after the value is
committed to the DOM. Calling `event.preventDefault()` does not revert the value.

## Build setup

```bash
pnpm -C packages/spinbutton build
```

## Acknowledgments

- [Spinbutton Pattern (WAI-ARIA Practices)](https://www.w3.org/WAI/ARIA/apg/patterns/spinbutton/)
- [`@19h47/spinbutton`](https://github.com/19h47/19h47-spinbutton/): original implementation
