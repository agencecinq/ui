---
"@agencecinq/calendar": patch
---

Day numbers use the locale's digits, like the title and the day labels: Persian digits for `fa`, Arabic ones for `ar-EG`. Add `-u-nu-latn` to the locale to keep Latin digits.
