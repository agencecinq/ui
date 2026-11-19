---
"@agencecinq/tabs": major
---

- Move the keyboard onto `focusByKey()` from `@agencecinq/utils`, shared with the accordion and the disclosure navigation, and follow the tabs pattern of the APG (see the README migration from 11.x).
- Home and End move the focus only, like the arrow keys, and `data-delay` activates the focused tab after the delay. They activated it at once.
- PageUp and PageDown are left to the browser. They went to the first and last tabs.
- The reading direction is read with `:dir(rtl)`, from a `dir` attribute, instead of the CSS `direction` of the tablist.
- The arrow keys cancel their default action, so the page no longer scrolls, and the keys pressed with Alt, Ctrl or Meta are left to the browser.
