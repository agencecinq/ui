# @agencecinq/calendar

[![](https://img.shields.io/npm/v/@agencecinq/calendar)](https://www.npmjs.com/package/@agencecinq/calendar)

> Accessible date / range picker as a lightweight Web Component (`<cinq-calendar>`).

Markup and CSS are yours — the package fills the grid and handles selection.
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
| `.js-title` | Month / year label; click advances to the next month (same as `.js-next`) |
| `.js-days` | Weekday headers row |
| `.js-body` | Day cells |
| `.js-day` | Day button (generated) |

```html
<cinq-calendar locale="fr" deselect>
  <header>
    <button type="button" class="js-previous" aria-label="Previous month">Previous</button>
    <button type="button" class="js-title" id="calendar-label" aria-live="polite"></button>
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
  // detail.values → string[] (`YYYY-MM-DD`)
  console.log(detail.values);
});
```

Importing the package registers the custom element. The calendar mounts on
`connectedCallback` — no manual `init()` is required.

> **HTML is the source of truth.** Provide `role="grid"`, `aria-labelledby`,
> `aria-live` on the title, and `aria-label` on nav buttons yourself.

### Single date

```html
<cinq-calendar mode="single" deselect>…</cinq-calendar>
```

### Date range

```html
<cinq-calendar mode="range">…</cinq-calendar>
```

### Multiple dates

Toggle discrete days (no range painting). Click again to remove.

```html
<cinq-calendar mode="multiple" allow-past>…</cinq-calendar>
```

There is no built-in max. Cap the selection in your app (e.g. after
`calendar:change`):

```js
const MAX = 3;

el.addEventListener(EVENTS.CALENDAR_CHANGE, () => {
  if (el.picked.length <= MAX) return;

  el.setPicked(el.picked.slice(0, MAX));
  el.render();
});
```

### Locale & week start

`locale` drives labels via `Intl`. Week start defaults from the locale
(`weekInfo`); pass `first-day` to override.

```html
<cinq-calendar locale="fr">…</cinq-calendar>
<!-- fr → week starts Monday -->

<cinq-calendar locale="en" first-day="1">…</cinq-calendar>
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
| `first-day` | Week start (`0`=Sun … `6`=Sat); defaults from locale |
| `button-class` | Extra classes on day buttons |
| `name` | Forwarded in `calendar:change` detail |
| `data-month` | Initial month (`0`–`11`) |
| `data-year` | Initial year |
| `data-picked-dates` | JSON array of `YYYY-MM-DD` days to preselect |

## Keyboard (focus in the grid)

| Key | Action |
| --- | ------ |
| Arrow keys | Move by day / week (crosses months) |
| Home / End | First / last day of the week |
| Page Up / Page Down | Previous / next month |
| Shift + Page Up / Down | Previous / next year |
| Enter / Space | Select the focused day |

## Events

Dispatched on the host `<cinq-calendar>` (bubble). Constants live on
`@agencecinq/utils` `EVENTS`:

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
| `move(delta)` | Navigate by months (`-1` = previous, `1` = next) |
| `destroy()` | Detach listeners and clear the grid |
| `renderInner(inner, date)` | Per-cell hook (override) |

Exported helpers: `getWeekStart`, `toDayString`, `fromDayString`.

## Build setup

```bash
pnpm -C packages/calendar build
```

## Acknowledgments

- [`@19h47/calendar`](https://github.com/19h47/19h47-calendar) — original implementation
- [WAI-ARIA APG — Date Picker Dialog](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/examples/datepicker-dialog/)
- Litepicker
