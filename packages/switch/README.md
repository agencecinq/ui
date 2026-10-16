[![](https://img.shields.io/npm/v/@agencecinq/switch)](https://www.npmjs.com/package/@agencecinq/switch)
[![](https://img.shields.io/npm/dm/@agencecinq/switch)](https://www.npmjs.com/package/@agencecinq/switch)

# @agencecinq/switch

> Accessible, WAI-ARIA switch as a lightweight Web Component.

A switch is an on/off control that represents a binary setting. `<cinq-switch>`
provides an accessible, keyboard-navigable interface following the ARIA switch
pattern, reads its state from the markup, takes part in forms like a checkbox,
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
</cinq-switch>
```

```js
import "@agencecinq/switch";
```

When disabled, add `disabled`. As on a native field, the switch leaves the tab
order and the form, and is announced as disabled:

```html
<cinq-switch role="switch" aria-checked="false" disabled tabindex="0">
  <span class="label">Disabled switch</span>
  <span class="switch" aria-hidden="true"><span></span></span>
</cinq-switch>
```

Importing `@agencecinq/switch` registers the Web Component automatically.
No manual `init()` call required.

> **HTML is the source of truth.** The component will not auto-set `role`,
> auto-migrate attributes, or warn about missing labels. Use an a11y linter
> (axe-core, Lighthouse) to catch invalid markup.

### Required markup

| Attribute / element | Required | Role |
| ------------------- | -------- | ---- |
| `<cinq-switch>` | **Yes** | Host element with `role="switch"`. |
| `role="switch"` | **Yes** | Identifies the control as a switch. |
| `aria-checked` | **Yes** | The on/off state (`"true"` or `"false"`), and the only one: style with it, and write it to change the state without events. |
| `tabindex="0"` | **Yes** | Makes the switch keyboard-focusable. `disabled` takes it out of the tab order. |
| `name` | Optional | Submits the switch with its form. See [Forms](#forms). |
| `aria-hidden="true"` on On/Off text | Recommended | Decorative state labels must not appear in the accessible name ([APG](https://www.w3.org/WAI/ARIA/apg/patterns/switch/)). |

The switch **label must not change** when its state changes. Update decorative
On/Off text only if it is marked `aria-hidden="true"`.

The content of the host is presentational, as for any `role="switch"`
([ARIA](https://www.w3.org/TR/wai-aria-1.2/#switch)): its text becomes the
accessible name, and it must hold nothing interactive. Put a help link next to
the switch, tied with `aria-describedby`.

For multiple switches, use a `<fieldset>` with a `<legend>` (see [Forms](#forms)),
or an element with `role="group"` and `aria-labelledby` pointing to the group
label ([APG](https://www.w3.org/WAI/ARIA/apg/patterns/switch/)).

### Markup variants

| Variant | Markup |
| ------- | ------ |
| Visible label | Text inside `<cinq-switch>` |
| `aria-label` | On the host when no visible label |
| `aria-labelledby` | References an external visible label |
| `<label>` | `<label for>` or a wrapping `<label>`, as on a native field |
| `aria-describedby` | Points to static help text |
| Minimal | Host + label only. No slider |
| Pre-checked | `aria-checked="true"` |
| Form field | `name` (+ optional `value`) on the host. See [Forms](#forms) |
| Disabled | `disabled`, or `aria-disabled="true"` alone to stay focusable and submitted |

See the [interactive docs](https://agencecinq.github.io/ui/components/switch/) for live examples of each variant.

### Forms

`<cinq-switch>` is a form-associated custom element, and behaves like a
checkbox. Inside a `<form>`, a switch with a `name` submits its `value` while
on (`"on"` without a `value` attribute), and nothing while off. `form.reset()`
brings back the `aria-checked` of the markup, and the browser restores the
state when the user comes back to the page. `disabled`, on the switch or on a
`<fieldset>` around it, leaves it out of the form.

```html
<form>
  <cinq-switch name="newsletter" value="yes" role="switch" aria-checked="false" tabindex="0">
    <span class="label">Newsletter</span>
    <span class="switch" aria-hidden="true"><span></span></span>
  </cinq-switch>
  <button>Save</button>
</form>
```

```js
new FormData(form).get("newsletter"); // "yes" while on, null while off
```

Name it and group it as any field: a `<label for>` or a wrapping `<label>`
names the switch and toggles it on click, and a `<fieldset disabled>` disables
every switch inside.

```html
<form>
  <fieldset>
    <legend>Notifications</legend>

    <label for="loot">Loot found</label>
    <cinq-switch id="loot" name="loot" role="switch" aria-checked="true" tabindex="0">
      <span class="switch" aria-hidden="true"><span></span></span>
    </cinq-switch>

    <label>
      Level up
      <cinq-switch name="level_up" value="yes" role="switch" aria-checked="false" tabindex="0">
        <span class="switch" aria-hidden="true"><span></span></span>
      </cinq-switch>
    </label>
  </fieldset>
</form>
```

### Styling

Style the on state with its attributes, and the rest with native
pseudo-classes:

| Selector | When |
| -------- | ---- |
| `[aria-checked="true"]` | The switch is on |
| `:disabled` | `disabled` on the switch, or on a `<fieldset>` around it |
| `:focus-visible` | Keyboard focus |

```css
cinq-switch[aria-checked="true"] .switch {
  background-color: currentColor;
}

cinq-switch:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
```

`:disabled` does not match `aria-disabled="true"` alone: add
`[aria-disabled="true"]` to the selector if you use it.

The switch has no [custom state](https://developer.mozilla.org/docs/Web/CSS/:state):
on, off and disabled are already in the markup or in `:disabled`, and a change
is synchronous, so nothing waits in between.

### API

| Attribute | Required | Description |
| --------- | -------- | ----------- |
| `disabled` | No | Disables the switch: out of the tab order and the form, announced as disabled, blurred when set while focused. A disabled `<fieldset>` does the same. |
| `name` | No | Form field name. Without it, the switch is not submitted. |
| `value` | No | Submitted while on. Defaults to `"on"`. |

| Method | Description |
| ------ | ----------- |
| `init()` | Binds listeners. Runs on connect. Call `destroy()` first if already bound. |
| `activate(emit?)` | Turns the switch on. |
| `deactivate(emit?)` | Turns the switch off. |
| `toggle()` | Toggles on/off. |
| `destroy()` | Detaches listeners. Runs on disconnect. |

| Property | Description |
| -------- | ----------- |
| `checked` | Whether the switch is on. |
| `disabled` | Whether the switch is disabled, by `disabled`, `aria-disabled="true"` or a disabled `<fieldset>`. |
| `value` | The value submitted while on. |

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

## Migration

### From 3.x to 4.0

4.0 takes part in forms itself, as a form-associated custom element (Safari
16.4). The hidden checkbox is gone.

**1. Form field.** Move `name` and `value` from the hidden input to the host,
and remove the input with its container.

```html
<!-- 3.x -->
<cinq-switch role="switch" aria-checked="false" tabindex="0">
  <span class="label">Newsletter</span>
  <div hidden>
    <input type="checkbox" name="newsletter" value="yes" tabindex="-1" aria-hidden="true" />
  </div>
</cinq-switch>

<!-- 4.0 -->
<cinq-switch name="newsletter" value="yes" role="switch" aria-checked="false" tabindex="0">
  <span class="label">Newsletter</span>
</cinq-switch>
```

**2. Disabled.** `disabled` alone is enough: drop the `aria-disabled="true"` and
`tabindex="-1"` that came with it. Keep `aria-disabled="true"` alone where the
switch must stay focusable.

**3. `checked` attribute.** The host no longer has it: `aria-checked` is the only
state. Style with `[aria-checked="true"]` instead of `[checked]`, drop `checked`
from the markup, and replace `setAttribute("checked", "")` with `activate()`
(events) or `setAttribute("aria-checked", "true")` (no events).

**4. `$input`.** The property is gone. Read the state with `checked`, and the
submitted value with `new FormData(form)`. A script that looked for
`input[name]` in the form reads `form.elements` instead.

## Build setup

```bash
pnpm -C packages/switch build
```

## Acknowledgments

- [Switch Pattern (WAI-ARIA Practices)](https://www.w3.org/WAI/ARIA/apg/patterns/switch/)
- [`@19h47/switch`](https://github.com/19h47/19h47-switch), original implementation
