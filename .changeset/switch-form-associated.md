---
"@agencecinq/switch": major
---

The switch is a form-associated custom element and takes part in forms like a checkbox: with a `name` on the host, it submits its `value` (`"on"` by default) while on. `form.reset()` brings back the markup state, the browser restores it on return, and `disabled` on the switch or on a `<fieldset>` around it leaves it out of the tab order and the form, matches `:disabled` and is announced as disabled. The hidden checkbox and the `$input` property are gone: move `name` and `value` from the input to the host, and drop `aria-disabled="true"` and `tabindex="-1"` next to `disabled`. The README has the migration steps.

A `<label for>` or a wrapping `<label>` names the switch and toggles it on click, as on a native field.

`aria-checked` is the only state, as in the APG example: the `checked` attribute is gone. Style with `[aria-checked="true"]` instead of `[checked]`, and call `activate()` / `deactivate()` instead of setting `checked`. Writing `aria-checked` directly changes the state without events, and the form value follows.
