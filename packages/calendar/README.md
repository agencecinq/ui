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

No class to add: the calendar finds its parts in your HTML.

| Element | Required | Role |
| ------- | -------- | ---- |
| `<cinq-calendar>` | **Yes** | Host. Needs an `id` only for the month buttons |
| `<tbody>` of the `role="grid"` table | **Yes** | Filled with the day cells |
| `<thead> <tr>` of the same table | No | Filled with the weekday headers |
| `[aria-live]` | No | Filled with the month and year, announced on each change |
| Buttons with `commandfor` | No | Month navigation, see [Commands](#commands) |

Each generated day button carries `data-day="YYYY-MM-DD"`.

```html
<cinq-calendar id="calendar" locale="fr" deselectable>
  <header>
    <button type="button" commandfor="calendar" command="--previous-month" aria-label="Previous month">Previous</button>
    <h2 id="calendar-title" aria-live="polite"></h2>
    <button type="button" commandfor="calendar" command="--next-month" aria-label="Next month">Next</button>
  </header>
  <table role="grid" aria-labelledby="calendar-title">
    <thead>
      <tr></tr>
    </thead>
    <tbody></tbody>
  </table>
</cinq-calendar>
```

### Commands

Buttons move the calendar with
[invoker commands](https://developer.mozilla.org/docs/Web/API/Invoker_Commands_API):
`commandfor` names the calendar `id`, `command` the move. The browser sends the
command on click, Enter or Space, and the button can sit anywhere in the page.

| `command` | Moves |
| --------- | ----- |
| `--previous-month` / `--next-month` | One month back / forward |
| `--previous-year` / `--next-year` | One year back / forward |

The calendar needs an `id` for these buttons, and only for them: `commandfor`
points to it. Without month buttons, leave the `id` out: Page Up and Page Down
still change the month from the grid. From a script,
`button.commandForElement = calendar` links a button without any `id`.

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

The calendar writes the state as attributes, no class:

- On each `<td>`: `aria-selected="true"` for a selected day, every day of a
  range included. In `mode="range"`, `data-range` inside the range (ends
  included), `data-start` and `data-end` on its ends. These three also paint
  the range to come while the pointer or the focus chooses its end.
- On each day button: the full date as `aria-label`
  (`lundi 16 novembre 2026`), `aria-current="date"` on today, and
  `aria-disabled="true"` on days that cannot be picked.

These rules weigh the same, so the last one that matches wins:

```css
/* picked day */
td[aria-selected="true"] [data-day] {
  background: #111827;
  color: #fff;
}

/* inside a range, ends included */
td[data-range] [data-day] {
  background: #e5e7eb;
  color: #111827;
}

/* range ends */
td[data-start] [data-day],
td[data-end] [data-day] {
  background: #111827;
  color: #fff;
}
```

### Single date

The default mode. Add `deselectable` to clear the selection by clicking the
selected day again.

```html
<cinq-calendar deselectable>...</cinq-calendar>
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
  el.querySelectorAll("[data-day]").forEach(button => {
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
  <cinq-calendar id="stay" name="stay" mode="range" required>
    <header>
      <!-- commandfor="stay" buttons -->
      <h2 id="stay-title" aria-live="polite"></h2>
    </header>
    <table role="grid" aria-labelledby="stay-label stay-title" aria-multiselectable="true">
      <thead>
        <tr></tr>
      </thead>
      <tbody></tbody>
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
  <cinq-calendar id="arrival-calendar" locale="fr" min="2026-10-16">
    <header>
      <button type="button" commandfor="arrival-calendar" command="--previous-month" aria-label="Mois précédent">‹</button>
      <h3 id="arrival-month" aria-live="polite"></h3>
      <button type="button" commandfor="arrival-calendar" command="--next-month" aria-label="Mois suivant">›</button>
    </header>
    <table role="grid" aria-labelledby="arrival-dialog-title arrival-month">
      <thead>
        <tr></tr>
      </thead>
      <tbody></tbody>
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

Weekday headers come from `Intl`. Replace them, Sunday first:

```js
el.options.days = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];
el.render();
```

### Decorate days

`calendar:render` bubbles from the host after each render: on connection, on
each month change, and when an observed attribute changes. The cells already
carry their state, so decorate the day buttons from there. Keep their
`data-day`.

```js
el.addEventListener(EVENTS.CALENDAR_RENDER, ({ detail }) => {
  // detail.year and detail.month (`0`-`11`): the month on screen
  el.querySelectorAll("[data-day]").forEach(button => {
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
| `deselectable` | Allow clearing the selection in `mode="single"` |
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
