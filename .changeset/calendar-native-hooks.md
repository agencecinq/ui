---
"@agencecinq/calendar": major
---

No more `.js-*` hooks. The calendar fills the `<tbody>` and the `<thead> <tr>` of its `role="grid"` table and writes the month in its `[aria-live]` element. Month buttons send invoker commands to the calendar `id`, from anywhere in the page: `commandfor="calendar" command="--previous-month"`, or `--next-month`, `--previous-year`, `--next-year`. Day buttons have no class: select them with `[data-day]`. `$previous`, `$next`, `getMonthName()`, `options.months` and the month names in `data-content` on the buttons are gone.
