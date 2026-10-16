# @agencecinq/calendar

[![](https://img.shields.io/npm/v/@agencecinq/calendar)](https://www.npmjs.com/package/@agencecinq/calendar)
[![](https://img.shields.io/npm/dm/@agencecinq/calendar)](https://www.npmjs.com/package/@agencecinq/calendar)

> Accessible, WAI-ARIA date / range picker as a lightweight Web Component.

Markup and CSS are yours. The package fills the grid and handles selection.
Aligned with the
[WAI-ARIA Authoring Practices date picker grid](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/examples/datepicker-dialog/).

Inspired by [`@19h47/calendar`](https://github.com/19h47/19h47-calendar).

## Installation

```bash
pnpm add @agencecinq/calendar
```

## Markup

Required hooks:

| Selector | Role |
| -------- | ---- |
| `<cinq-calendar>` | Host element |
| `.js-previous` / `.js-next` | Month navigation (optional) |
| `.js-title` | Month / year label, filled by the calendar |
| `.js-days` | Weekday headers row |
| `.js-body` | Day cells |
| `.js-day` | Day button (generated) |

```html
<cinq-calendar locale="fr" deselect>
  <header>
    <button type="button" class="js-previous" aria-label="Previous month">Previous</button>
    <h2 class="js-title" id="calendar-label" aria-live="polite"></h2>
    <button type="button" class="js-next" aria-label="Next month">Next</button>
  </header>
  <table role="grid" aria-labelledby="calendar-label">
    <thead>
      <tr class="js-days"></tr>
    </thead>
    <tbody class="js-body"></tbody>
  </table>
</cinq-calendar>
```

## Usage

```js
import "@agencecinq/calendar";
import { EVENTS } from "@agencecinq/utils";

const el = document.querySelector("cinq-calendar");

el.addEventListener(EVENTS.CALENDAR_CHANGE, ({ detail }) => {
  // detail.values to string[] (`YYYY-MM-DD`)
  console.log(detail.values);
});
```

Importing the package registers the custom element. The calendar mounts on
`connectedCallback`. No manual `init()` is required.

> **HTML is the source of truth.** Provide `role="grid"`, `aria-labelledby`,
> `aria-live` on the title, `aria-multiselectable="true"` on the grid in
> `range` and `multiple` modes, and `aria-label` on nav buttons yourself.

### Selection state

The calendar writes the state on the cells it generates:

- `aria-selected="true"` on the `<td>` of each selected day, every day of a
  range included.
- The full date as `aria-label` on each day button (`lundi 16 novembre 2026`),
  `aria-current="date"` on today, and `aria-disabled="true"` on days that
  cannot be picked.
- Classes on the day button for styling: `active` (picked day, range ends),
  `range` (inside a range, ends included), `start` and `end`.

```css
td[aria-selected="true"] .js-day {
  background: #e5e7eb;
}

.js-day.active {
  background: #111827;
  color: #fff;
}
```

### Single date

```html
<cinq-calendar mode="single" deselect>...</cinq-calendar>
```

### Date range

```html
<cinq-calendar mode="range">...</cinq-calendar>
```

### Multiple dates

Toggle discrete days (no range painting). Click again to remove.

```html
<cinq-calendar mode="multiple" allow-past>...</cinq-calendar>
```

There is no built-in max. Cap the selection in your app (e.g. after
`calendar:change`). Pass `emit: false` to `setPicked` so the trim does not
fire a second `calendar:change`:

```js
const MAX = 3;

el.addEventListener(EVENTS.CALENDAR_CHANGE, () => {
  if (el.picked.length <= MAX) return;

  el.setPicked(el.picked.slice(0, MAX), false);
});
```

### Locale & week start

`locale` drives labels via `Intl`. Week start defaults from the locale
(`weekInfo`). Pass `first-day` to override.

```html
<cinq-calendar locale="fr">...</cinq-calendar>
<!-- fr: week starts Monday -->

<cinq-calendar locale="en" first-day="1">...</cinq-calendar>
<!-- force Monday despite en -->
```

Update at runtime:

```js
import { getWeekStart } from "@agencecinq/calendar";

el.options.locale = "ja";
el.options.firstDay = getWeekStart("ja");
el.render();
```

### Custom labels

```js
el.options.days = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];
el.options.months = [
  "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre",
];
el.render();
```

### Cell hook

Override `renderInner` to enrich or rebuild each day cell. Keep `.js-day` and
`data-day`.

```js
el.renderInner = (inner, date) => {
  const button = inner.querySelector(".js-day");
  if (!button) return;

  button.classList.add("MyDay");
  button.innerHTML = `<time datetime="${date.toISOString().slice(0, 10)}">${date.getDate()}</time>`;
};
```

## Attributes

| Attribute | Description |
| --------- | ----------- |
| `locale` / `data-locale` | BCP 47 locale for title and weekday/month labels |
| `mode` | Selection mode: `single` (default), `range`, or `multiple` |
| `deselect` | Allow clearing the selection in `mode="single"` |
| `allow-past` | Allow selecting past dates |
| `first-day` | Week start (`0`=Sun ... `6`=Sat). Defaults from locale |
| `button-class` | Extra classes on day buttons |
| `name` | Forwarded in `calendar:change` detail |
| `data-month` | Initial month (`0`-`11`) |
| `data-year` | Initial year |
| `data-picked` | JSON array of `YYYY-MM-DD` days to preselect |

## Keyboard (focus in the grid)

| Key | Action |
| --- | ------ |
| Arrow keys | Move by day / week (crosses months) |
| Home / End | First / last day of the week |
| Page Up / Page Down | Previous / next month |
| Shift + Page Up / Down | Previous / next year |
| Enter / Space | Select the focused day |

## Events

Dispatched on the host `<cinq-calendar>` (bubble) when the selection changes.
Constants live on `@agencecinq/utils` `EVENTS`:

| Event | Constant | Detail |
| ----- | -------- | ------ |
| `calendar:change` | `CALENDAR_CHANGE` | `{ values: string[], name?: string }` |

## API

| Method / property | Description |
| ----------------- | ----------- |
| `options` | Runtime options object |
| `picked` | Selected days as `YYYY-MM-DD` |
| `current` | Viewed `{ month, year, day }` |
| `render()` | Rebuild the grid |
| `setPicked(picked, emit?)` | Assign the selection, mirror `data-picked` and paint the grid. Emits `calendar:change` unless `emit` is `false` |
| `move(delta)` | Navigate by months (`-1` = previous, `1` = next) |
| `destroy()` | Detach listeners and clear the grid |
| `renderInner(inner, date)` | Per-cell hook (override) |

Exported helpers: `getWeekStart`, `toDayString`, `fromDayString`.

## Build setup

```bash
pnpm -C packages/calendar build
```

## Acknowledgments

- [`@19h47/calendar`](https://github.com/19h47/19h47-calendar), original implementation
- [WAI-ARIA APG, Date Picker Dialog](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/examples/datepicker-dialog/)
- Litepicker

See the [interactive docs](https://agencecinq.github.io/ui/components/calendar/) for live examples.
