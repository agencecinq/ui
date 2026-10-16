---
"@agencecinq/calendar": minor
---

Drop the `form` and `willValidate` getters, unused wrappers of the element internals: read the form with `closest("form")`, and the validation with `validity` and `checkValidity()`, which stay. A disabled calendar reads `:disabled` instead of keeping its own flag.
