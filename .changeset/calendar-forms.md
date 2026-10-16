---
"@agencecinq/calendar": major
---

`<cinq-calendar>` is a form-associated custom element: its `name` is submitted with the picked days joined by commas, `required` blocks the submission with the browser's own message until a day, or both ends of a range, is picked, and `form.reset()`, `disabled` and a disabled `<fieldset>` work as on native fields. Observed `min` and `max` bound the days that can be picked and replace `allow-past`, so past days are no longer disabled by default. A cancelable `calendar:before-change` comes before each change from a click or a key, with `waitUntil()` to hold it.
