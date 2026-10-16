---
"@agencecinq/calendar": major
---

The calendar reads its markup, language and bounds from standard HTML and takes part in forms. Each change is a search and replace step in the README, under "Migration from 3.x to 4.0".

- Markup: no more `.js-*` classes. The calendar fills the `<tbody>` and the `<thead> <tr>` of its `role="grid"` table and the first `[aria-live]` element. Month buttons send invoker commands to the calendar `id`: `commandfor="calendar" command="--previous-month"`, or `--next-month`, `--previous-year`, `--next-year`. Clicking the title no longer moves to the next month.
- State: no more classes nor `stateClasses`. Each selected cell gets `aria-selected="true"`, and a range adds `data-range`, `data-start` and `data-end` on its cells, preview included. Day buttons sit directly in their `<td>` with `data-day`, the full date as `aria-label` and the language's digits.
- Attributes: `locale` and `data-locale` become `lang`, the calendar's own or inherited. `deselect` becomes `deselectable`. `allow-past` gives way to `min` and `max`: past days can be picked by default. `lang`, `first-day`, `min`, `max` and `required` are observed.
- Forms: the element is form-associated. With a `name`, it submits the picked days joined by commas and validates like a date field: `required`, `min`, `max` and an unfinished range, with the browser's own messages. `form.reset()`, `disabled`, a disabled `<fieldset>` and history restore work, along with `form`, `validity`, `validationMessage`, `willValidate`, `checkValidity()` and `reportValidity()`.
- Events: the cancelable `calendar:before-change`, with `waitUntil()`, comes before a change from a click or a key. `calendar:render` comes after each render and replaces `renderInner()`. `calendar:change` fires only when the selection changes.
- API: `toDayString`, `fromDayString` and `getWeekStart` become `dayFromDate`, `dateFromDay` and `getFirstDay`, and `getWeekdays()` becomes `getWeekdayNames()`. `renderHeader()` and `renderCalendar()` take the year before the month. `setPicked()` paints the grid. `options.locale` and `options.firstDay` are read-only. Removed: `setDaySelected()`, `getMonthName()`, `options.months`, `$previous` and `$next`.
- Accessibility and fixes: labels on the Gregorian calendar for any language, arrow keys that follow the screen in a right-to-left grid, the native Enter and Space activation, focus kept when the grid renders again, and events still dispatched after a move in the DOM.
- Requires `@agencecinq/utils` 7.10.0 or later.
