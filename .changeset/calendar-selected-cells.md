---
"@agencecinq/calendar": major
---

Selected days carry `aria-selected="true"` on their `<td>`, every day of a range included, instead of on the day button, and each day button is named with its full date. Style them with `td[aria-selected="true"]` or the `active` class instead of `.js-day[aria-selected]`. `.js-title` is a label only: clicking it no longer moves to the next month, so it can be a heading. `setPicked()` paints the grid, so it no longer needs `render()`, and `setDaySelected()` is gone.
