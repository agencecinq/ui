# @agencecinq/calendar

[![](https://img.shields.io/npm/v/@agencecinq/calendar)](https://www.npmjs.com/package/@agencecinq/calendar)
[![](https://img.shields.io/npm/dm/@agencecinq/calendar)](https://www.npmjs.com/package/@agencecinq/calendar)

> Accessible, WAI-ARIA date / range picker as a lightweight Web Component.

Markup and CSS are yours. The package fills the grid and handles selection.
Aligned with the
[WAI-ARIA Authoring Practices date picker grid](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/examples/datepicker-dialog/).

Inspired by [`@19h47/calendar`](https://github.com/19h47/19h47-calendar).

## When not to use it

For one date with no day to rule out, `<input type="date">` already does the
job without a script: the platform's own picker, typing, `min` / `max`
validation and a `YYYY-MM-DD` value. Add `autocomplete="bday"` for a birth
date. Reach for `<cinq-calendar>` for a range or several dates in one field,
unavailable days, or a grid that has to follow the design.

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
<cinq-calendar mode="multiple">...</cinq-calendar>
```

There is no built-in max. Cancel the change that would go over yours:

```js
const MAX = 3;

el.addEventListener(EVENTS.CALENDAR_BEFORE_CHANGE, event => {
  if (event.detail.values.length > MAX) event.preventDefault();
});
```

### Bounds

`min` and `max` (`YYYY-MM-DD`) work as on `<input type="date">`: days outside
are `aria-disabled`. Without them, every day can be picked. Both are observed,
so a departure calendar can follow the arrival:

```js
import { dayFromDate } from "@agencecinq/calendar";

const today = dayFromDate(new Date());

arrival.setAttribute("min", today);
departure.setAttribute("min", today);

arrival.addEventListener(EVENTS.CALENDAR_CHANGE, ({ detail }) => {
  departure.setAttribute("min", detail.values[0] ?? today);
});
```

### Unavailable days

Set `aria-disabled="true"` on a day button on `calendar:render`. Clicks, the
keyboard and the range preview already skip it.

```js
const unavailable = ["2026-11-11", "2026-11-12"];

el.addEventListener(EVENTS.CALENDAR_RENDER, () => {
  el.querySelectorAll(".js-day").forEach(button => {
    if (unavailable.includes(button.dataset.day)) {
      button.setAttribute("aria-disabled", "true");
    }
  });
});
el.render();
```

A range can still go over an unavailable day. Refuse it:

```js
el.addEventListener(EVENTS.CALENDAR_BEFORE_CHANGE, event => {
  const [start, end] = event.detail.values;

  if (end && unavailable.some(day => day > start && day < end)) {
    event.preventDefault();
  }
});
```

### Forms

`<cinq-calendar>` is a form-associated custom element. Inside a `<form>`, its
`name` is submitted with the picked days joined by commas (`2026-11-10`,
`2026-11-10,2026-11-14`). `required` blocks the submission until a day is
picked, or both ends of a range, with the browser's own message.
`form.reset()` brings back the `data-picked` selection, and `disabled` (or a
disabled `<fieldset>`) leaves the field out.

```html
<form>
  <p id="stay-label">Dates du séjour</p>
  <cinq-calendar name="stay" mode="range" required>
    <header>
      <!-- previous / next buttons -->
      <h2 class="js-title" id="stay-title" aria-live="polite"></h2>
    </header>
    <table role="grid" aria-labelledby="stay-label stay-title" aria-multiselectable="true">
      <thead>
        <tr class="js-days"></tr>
      </thead>
      <tbody class="js-body"></tbody>
    </table>
  </cinq-calendar>
  <button>Réserver</button>
</form>
```

Name the grid with `aria-labelledby`: a `<label for>` on the host does not
reach it.

### In a dialog

Keep a native `<input type="date">` as the field and open the calendar in a
`<dialog>` to fill it. `command` and `commandfor` open and close the dialog
without a script, the browser closes it on Escape and gives focus back to the
button. The calendar has no `name`, so only the input is submitted.

```html
<label for="arrival">Arrivée</label>
<input type="date" id="arrival" name="arrival" min="2026-10-16" required />
<button type="button" command="show-modal" commandfor="arrival-dialog">
  Choisir dans le calendrier
</button>

<dialog id="arrival-dialog" aria-labelledby="arrival-dialog-title">
  <h2 id="arrival-dialog-title">Date d'arrivée</h2>
  <cinq-calendar locale="fr" min="2026-10-16">
    <header>
      <button type="button" class="js-previous" aria-label="Mois précédent">‹</button>
      <h3 class="js-title" id="arrival-month" aria-live="polite"></h3>
      <button type="button" class="js-next" aria-label="Mois suivant">›</button>
    </header>
    <table role="grid" aria-labelledby="arrival-dialog-title arrival-month">
      <thead>
        <tr class="js-days"></tr>
      </thead>
      <tbody class="js-body"></tbody>
    </table>
  </cinq-calendar>
  <button type="button" command="close" commandfor="arrival-dialog">Fermer</button>
</dialog>
```

On open, show the input's date and focus it (today when the input is empty).
A picked day fills the input and closes the dialog:

```js
import { dateFromDay } from "@agencecinq/calendar";
import { EVENTS } from "@agencecinq/utils";

const input = document.getElementById("arrival");
const dialog = document.getElementById("arrival-dialog");
const calendar = dialog.querySelector("cinq-calendar");

dialog.addEventListener("toggle", ({ newState }) => {
  if (newState !== "open") return;

  const date = input.value ? dateFromDay(input.value) : new Date();

  calendar.current = {
    month: date.getMonth(),
    year: date.getFullYear(),
    day: input.value || null,
  };
  calendar.setPicked(input.value ? [input.value] : [], false);
  calendar.render({ focus: true });
});

calendar.addEventListener(EVENTS.CALENDAR_CHANGE, ({ detail }) => {
  input.value = detail.values[0] ?? "";
  input.dispatchEvent(new Event("change", { bubbles: true }));
  dialog.close();
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

Labels stay on the Gregorian calendar the grid is built on, even for a locale
with another calendar of its own: `fa` shows `نوامبر ۲۰۲۶`, not the Persian
month, and `th` shows 2026, not the Buddhist year. Day numbers use the
locale's digits, Persian ones for `fa`. Add `-u-nu-latn` to the locale
(`fa-u-nu-latn`) to keep Latin digits everywhere.

Update at runtime:

```js
import { getFirstDay } from "@agencecinq/calendar";

el.options.locale = "ja";
el.options.firstDay = getFirstDay("ja");
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

### Decorate days

`calendar:render` bubbles from the host after each render: on connection, on
each month change, and when an observed attribute changes. The cells already
carry their state, so decorate the day buttons from there. Keep `.js-day` and
`data-day`.

```js
el.addEventListener(EVENTS.CALENDAR_RENDER, ({ detail }) => {
  // detail.year and detail.month (`0`-`11`): the month on screen
  el.querySelectorAll(".js-day").forEach(button => {
    button.innerHTML = `<time datetime="${button.dataset.day}">${button.textContent.trim()}</time>`;
  });
});
el.render();
```

The first render happens on connection, often before your script runs. Call
`render()` once after adding the listener, or listen on `document` from a
script that runs first.

## Attributes

| Attribute | Description |
| --------- | ----------- |
| `locale` / `data-locale` | BCP 47 locale for title and weekday/month labels |
| `mode` | Selection mode: `single` (default), `range`, or `multiple` |
| `deselect` | Allow clearing the selection in `mode="single"` |
| `min` / `max` | First / last day that can be picked (`YYYY-MM-DD`). Observed |
| `name` | Form field name, also in the event details |
| `required` | Needs a day, or both ends of a range, to submit. Observed |
| `disabled` | Leaves the field out of the form and disables every day |
| `first-day` | Week start (`0`=Sun ... `6`=Sat). Defaults from locale |
| `button-class` | Extra classes on day buttons |
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

Dispatched on the host `<cinq-calendar>`. Constants live on
`@agencecinq/utils` `EVENTS`:

| Event | Constant | Detail |
| ----- | -------- | ------ |
| `calendar:render` | `CALENDAR_RENDER` | `{ year: number, month: number }` |
| `calendar:before-change` | `CALENDAR_BEFORE_CHANGE` | `{ values: string[], name?: string, waitUntil }` |
| `calendar:change` | `CALENDAR_CHANGE` | `{ values: string[], name?: string }` |

`calendar:render` bubbles after each render, once the cells carry their state
(see [Decorate days](#decorate-days)).
`calendar:before-change` comes first when a click or a key would change the
selection, with the selection to come in `values`. It does not bubble.
`preventDefault()` cancels the change, and `event.detail.waitUntil(promise)`
holds it until the promise settles (a rejection cancels it).
`calendar:change` bubbles once the selection has changed. `setPicked()` skips
`calendar:before-change`, and dispatches `calendar:change` unless `emit` is
`false`.

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

Exported helpers: `getFirstDay`, `dayFromDate`, `dateFromDay`.

## Build setup

```bash
pnpm -C packages/calendar build
```

## Acknowledgments

- [`@19h47/calendar`](https://github.com/19h47/19h47-calendar), original implementation
- [WAI-ARIA APG, Date Picker Dialog](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/examples/datepicker-dialog/)
- Litepicker

See the [interactive docs](https://agencecinq.github.io/ui/components/calendar/) for live examples.
