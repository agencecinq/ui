[![](https://img.shields.io/npm/v/@agencecinq/switch)](https://www.npmjs.com/package/@agencecinq/switch)
[![](https://img.shields.io/npm/dm/@agencecinq/switch)](https://www.npmjs.com/package/@agencecinq/switch)

# @agencecinq/switch

> Accessible, WAI-ARIA switch as a lightweight Web Component.

A switch is an on/off control that represents a binary setting. `<cinq-switch>`
provides an accessible, keyboard-navigable interface following the ARIA switch
pattern, reads its state from the markup, syncs an optional hidden checkbox,
and dispatches events when toggled.

Implementation follows the
[WAI-ARIA Authoring Practices switch pattern](https://www.w3.org/WAI/ARIA/apg/patterns/switch/).
Inspired by [`@19h47/switch`](https://github.com/19h47/19h47-switch).

## Installation

```bash
pnpm add @agencecinq/switch
```

## Usage

### Web Component (`<cinq-switch>`)

```html
<cinq-switch role="switch" aria-checked="false" tabindex="0">
  <span class="label">Notifications</span>
  <span class="switch" aria-hidden="true"><span></span></span>
  <span class="on" aria-hidden="true">On</span>
  <span class="off" aria-hidden="true">Off</span>
  <div hidden>
    <input type="checkbox" tabindex="-1" aria-hidden="true" />
  </div>
</cinq-switch>
```

```js
import "@agencecinq/switch";
```

When disabled, use `disabled` or `aria-disabled="true"` and `tabindex="-1"`:

```html
<cinq-switch role="switch" aria-checked="false" disabled aria-disabled="true" tabindex="-1">
  <span class="label">Disabled switch</span>
  <span class="switch" aria-hidden="true"><span></span></span>
  <div hidden>
    <input type="checkbox" tabindex="-1" aria-hidden="true" disabled />
  </div>
</cinq-switch>
```

Importing `@agencecinq/switch` registers the Web Component in the
**Custom Elements Registry** (`customElements.define('cinq-switch', Switch)`).
The browser upgrades every existing `<cinq-switch>` in the DOM automatically —
no manual `init()` call required.

> **HTML is the source of truth.** The component will not auto-set `role`,
> auto-migrate attributes, or warn about missing labels. Use an a11y linter
> (axe-core, Lighthouse) to catch invalid markup.

### Required markup

| Attribute / element | Required | Role |
| ------------------- | -------- | ---- |
| `<cinq-switch>` | **Yes** | Host element with `role="switch"`. |
| `role="switch"` | **Yes** | Identifies the control as a switch. |
| `aria-checked` | **Yes** | Current on/off state (`"true"` or `"false"`). |
| `tabindex="0"` | **Yes** | Makes the switch keyboard-focusable (use `-1` when disabled). |
| Hidden `<input>` | Optional | Form helper only — not the switch. One input in the host. Keep it in a `hidden` container, with `tabindex="-1"` and `aria-hidden="true"`. |
| `aria-hidden="true"` on On/Off text | Recommended | Decorative state labels must not appear in the accessible name ([APG](https://www.w3.org/WAI/ARIA/apg/patterns/switch/)). |

The switch **label must not change** when its state changes — update decorative
On/Off text only if it is marked `aria-hidden="true"`.

### Switch groups

When presenting multiple switches, wrap them in a `<fieldset>` with a `<legend>`,
or in an element with `role="group"` and `aria-labelledby` pointing to the
group label ([APG](https://www.w3.org/WAI/ARIA/apg/patterns/switch/)).

### Markup variants

| Variant | Markup |
| ------- | ------ |
| Visible label | Text inside `<cinq-switch>` |
| `aria-label` | On the host when no visible label |
| `aria-labelledby` | References an external visible label |
| `aria-describedby` | Points to static help text |
| Minimal | Host + label only — no slider, no checkbox |
| Pre-checked | `aria-checked="true"` (+ optional `checked` for CSS) |
| Form helper | Hidden `<input>` in `<div hidden>` |
| Disabled | `disabled` + `aria-disabled` + `tabindex="-1"`, or `aria-disabled` alone |

See the [interactive docs](https://agencecinq.github.io/ui/components/switch/) for live examples of each variant.

### API

| Attribute | Required | Description |
| --------- | -------- | ----------- |
| `checked` | No | Reflected state on the host — useful for styling the wrapper. |
| `disabled` | No | Observed — syncs the hidden checkbox and blurs focus when set externally. Pair with `aria-disabled="true"` and `tabindex="-1"` in markup. |

| Method | Description |
| ------ | ----------- |
| `init()` | Binds markup + listeners. Call `destroy()` first if already bound. |
| `activate(emit?)` | Turns the switch on. |
| `deactivate(emit?)` | Turns the switch off. |
| `toggle()` | Toggles on/off. |
| `destroy()` | Detaches listeners. |

### Keyboard support

| Key | Function |
| --- | -------- |
| `Tab` | Moves keyboard focus to the switch (`tabindex="0"` in markup). |
| `Space` | Toggles between on and off when focused. |
| `Enter` | Toggles between on and off when focused (optional per [APG](https://www.w3.org/WAI/ARIA/apg/patterns/switch/)). |

Style focus with native pseudo-classes:

```css
cinq-switch:focus-visible {
  outline: 2px solid currentColor;
  outline-offset: 2px;
}
```

### Programmatic API

```js
const $switch = document.querySelector("cinq-switch");

$switch.activate();
$switch.deactivate();
$switch.toggle();
```

`activate()` and `deactivate()` accept an optional `emit` argument (default
`true`). Pass `false` to update state without dispatching an event.

Call `destroy()` when removing the element from the DOM to detach listeners.
After mutating light DOM (e.g. swapping the hidden input), call `destroy()` then
`init()`:

```js
$switch.destroy();
// mutate light DOM…
$switch.init();
```

## Events

| Event | Cancelable | Detail | Description |
| ----- | ---------- | ------ | ----------- |
| `switch:activate` | Yes | `{ el }` | Fired before the switch turns on. Cancel to abort. |
| `switch:deactivate` | Yes | `{ el }` | Fired before the switch turns off. Cancel to abort. |

```js
import { EVENTS } from "@agencecinq/utils";

$switch.addEventListener(EVENTS.SWITCH_ACTIVATE, () => {
  console.log("activated");
});

$switch.addEventListener(EVENTS.SWITCH_DEACTIVATE, () => {
  console.log("deactivated");
});
```

## Build setup

```bash
pnpm -C packages/switch build
```

## Acknowledgments

- [Switch Pattern (WAI-ARIA Practices)](https://www.w3.org/WAI/ARIA/apg/patterns/switch/)
- [`@19h47/switch`](https://github.com/19h47/19h47-switch) — original implementation
