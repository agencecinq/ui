---
"@agencecinq/calendar": major
---

The calendar reads its language from `lang`, its own or the closest ancestor's (`<html lang>`), else the browser's: `locale` and `data-locale` are gone. The same attribute tells screen readers which language to read the labels in. `lang` and `first-day` are observed, so `el.lang = "ja"` switches the labels and the week start.
