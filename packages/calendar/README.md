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
| `[aria-live]` | No | The first one in the calendar gets the month and year as its whole text, announced on each change: put it on the title itself |
| Buttons with `commandfor` | No | Month navigation, see [Commands](#commands) |

Each generated day button carries `data-day="YYYY-MM-DD"`.

```html
<cinq-calendar id="calendar" lang="fr" deselectable>
  <header>
    <button type="button" commandfor="calendar" command="--previous-month" aria-label="Mois précédent">Précédent</button>
    <h2 id="calendar-title" aria-live="polite"></h2>
    <button type="button" commandfor="calendar" command="--next-month" aria-label="Mois suivant">Suivant</button>
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
- On the calendar itself: custom states rather than attributes, see
  [Custom states](#custom-states).

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

### Custom states

The calendar itself matches
[custom states](https://developer.mozilla.org/docs/Web/CSS/:state):

| State | When |
| ----- | ---- |
| `:state(empty)` | No day is picked |
| `:state(picking)` | A range has its start and waits for its end |
| `:state(pending)` | A `waitUntil()` of `calendar:before-change` holds a change |

A state only changes the look, so say it in words too: put the hints in a
`role="status"` element and hide the hints, not the element. The status stays
in the page, so screen readers announce a hint when it shows. Prefer
`role="status"` to `aria-live` here: the calendar writes the month in the first
`[aria-live]` it finds.

```html
<cinq-calendar mode="range" lang="fr">
  <!-- header and table -->
  <div role="status">
    <p data-hint="empty">Choisissez la date d'arrivée.</p>
    <p data-hint="picking">Choisissez la date de départ.</p>
    <p data-hint="pending">Vérification des disponibilités…</p>
  </div>
</cinq-calendar>
```

```css
/* each hint shows with its state, and the check alone while it runs */
cinq-calendar:not(:state(empty)) [data-hint="empty"],
cinq-calendar:not(:state(picking)) [data-hint="picking"],
cinq-calendar:not(:state(pending)) [data-hint="pending"],
cinq-calendar:state(pending) [data-hint]:not([data-hint="pending"]) {
  display: none;
}

cinq-calendar:state(pending) [data-day] {
  cursor: progress;
}
```

### Single date

The default mode. Add `deselectable` to clear the selection by clicking the
selected day again.

```html
<cinq-calendar deselectable>...</cinq-calendar>
```

### Date range

The first day picked starts the range, the next one ends it, and the one after
starts a new range.

```html
<cinq-calendar mode="range">...</cinq-calendar>
```

While the range waits for its end, the calendar matches `:state(picking)`:
see [Custom states](#custom-states) to show a hint with it.

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
are `aria-disabled`, and a picked day that a moving bound leaves outside makes
the field invalid. Without them, every day can be picked. Both are observed,
so a departure calendar can follow the arrival:

```js
import { dayFromDate } from "@agencecinq/calendar";

const [arrival, departure] = document.querySelectorAll("cinq-calendar");
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
`2026-11-10,2026-11-14`). Validation follows a date field, with the browser's
own messages: `required` needs at least one day (both ends in `range`), and a
day before `min` or after `max` blocks the submission. `form.reset()` brings
back the `data-picked` selection, and `disabled` (or a disabled `<fieldset>`)
leaves the field out. A range with only its start is invalid, like a half-typed
date. The element has the validation API of a native field: `validity`,
`validationMessage`, `checkValidity()` and `reportValidity()`.

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
  <cinq-calendar id="arrival-calendar" lang="fr" min="2026-10-16">
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

// Confirming the day already picked changes nothing, so no calendar:change.
calendar.addEventListener("click", ({ target }) => {
  if (target.closest("[data-day]")?.dataset.day === input.value) dialog.close();
});
```

### Language & week start

The labels follow `lang` through `Intl`: the calendar's own `lang`, or the
closest ancestor's (`<html lang>`), else the browser's language. The same
attribute tells screen readers which language to read them in. The week starts
on the language's first day, `first-day` overrides it. Both are observed on
the calendar itself: after changing an ancestor's `lang`, call `render()`.

```html
<cinq-calendar lang="fr">...</cinq-calendar>
<!-- fr: week starts Monday -->

<cinq-calendar lang="en" first-day="1">...</cinq-calendar>
<!-- force Monday despite en -->
```

Labels stay on the Gregorian calendar the grid is built on, even for a language
with another calendar of its own: `fa` shows `نوامبر ۲۰۲۶`, not the Persian
month, and `th` shows 2026, not the Buddhist year. Day numbers use the
language's digits, Persian ones for `fa`. Add `-u-nu-latn` to `lang`
(`fa-u-nu-latn`) to keep Latin digits everywhere.

Right-to-left languages (`ar`, `fa`, `he`) also need `dir="rtl"`, usually
next to `lang` on `<html>`. The table then lays the week out from the right,
and the left and right arrow keys follow what is on screen. Characters such as `‹ ›`
mirror themselves in right-to-left text: mirror only icons that do not, such
as an SVG, with `[command] svg:dir(rtl) { scale: -1 1; }`. Round range ends
with logical corners such as `border-start-start-radius`.

Change the language at runtime:

```js
el.lang = "ja";

// right to left
el.lang = "ar";
el.dir = new Intl.Locale(el.lang).getTextInfo().direction;
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
| `lang` | Language of the labels and of their reading, own or inherited (BCP 47). Observed |
| `mode` | Selection mode: `single` (default), `range`, or `multiple` |
| `deselectable` | Allow clearing the selection in `mode="single"` |
| `min` / `max` | First / last day that can be picked (`YYYY-MM-DD`). Observed |
| `name` | Form field name, also in the event details |
| `required` | Needs at least one day, both ends in `range`, to submit. Observed |
| `disabled` | Leaves the field out of the form and disables every day |
| `first-day` | Week start (`0`=Sun ... `6`=Sat). Defaults from the language. Observed |
| `button-class` | Extra classes on day buttons |
| `data-month` | Initial month (`0`-`11`) |
| `data-year` | Initial year |
| `data-picked` | JSON array of `YYYY-MM-DD` days to preselect, in order (start then end in a range) |

## Keyboard (focus in the grid)

| Key | Action |
| --- | ------ |
| Arrow keys | Move by day / week (crosses months). Left and right follow the screen, mirrored under `dir="rtl"` |
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
holds it until the promise settles (a rejection cancels it). Meanwhile, the
calendar matches `:state(pending)`.
`calendar:change` bubbles once the selection has changed. `setPicked()` skips
`calendar:before-change`, and dispatches `calendar:change` unless `emit` is
`false`.

## API

| Method / property | Description |
| ----------------- | ----------- |
| `options` | Resolved options. `locale` and `firstDay` are read from `lang` and `first-day` on each render: set the attributes instead |
| `picked` | Selected days as `YYYY-MM-DD` |
| `current` | Viewed `{ month, year, day }` |
| `render()` | Rebuild the grid |
| `setPicked(picked, emit?)` | Assign the selection (days in order, start then end in a range), mirror `data-picked` and paint the grid. Emits `calendar:change` unless `emit` is `false` |
| `move(delta)` | Navigate by months (`-1` = previous, `1` = next) |
| `destroy()` | Detach listeners, clear the grid, its validity and its states |
| `validity`, `validationMessage` | As on a native field |
| `checkValidity()`, `reportValidity()` | As on a native field |

Exported helpers: `getFirstDay`, `dayFromDate`, `dateFromDay`.

## Migration

### From 3.x to 4.0

4.0 reads its markup, language and bounds from standard HTML and takes part in
forms. It relies on current browsers: form-associated custom elements (Safari
16.4), invoker commands (Chrome 135, Firefox 144, Safari 26.2) for the month
buttons, and `Intl.Locale#getWeekInfo()` (Chrome 130,
Firefox 153, Safari 17) for the first day of the week. Without the latter the
week starts on Sunday unless `first-day` says otherwise.

Each step is a search and replace: find the 3.x form, write the 4.0 one.

**1. Markup.** Drop the `.js-*` classes. Give the calendar an `id`, link the
month buttons to it with commands, and put `aria-live` on the title itself.

```html
<!-- 3.x -->
<cinq-calendar locale="fr">
  <header>
    <button type="button" class="js-previous" aria-label="Mois précédent">‹</button>
    <button type="button" class="js-title" id="title" aria-live="polite"></button>
    <button type="button" class="js-next" aria-label="Mois suivant">›</button>
  </header>
  <table role="grid" aria-labelledby="title">
    <thead><tr class="js-days"></tr></thead>
    <tbody class="js-body"></tbody>
  </table>
</cinq-calendar>

<!-- 4.0 -->
<cinq-calendar id="calendar" lang="fr">
  <header>
    <button type="button" commandfor="calendar" command="--previous-month" aria-label="Mois précédent">‹</button>
    <h2 id="title" aria-live="polite"></h2>
    <button type="button" commandfor="calendar" command="--next-month" aria-label="Mois suivant">›</button>
  </header>
  <table role="grid" aria-labelledby="title">
    <thead><tr></tr></thead>
    <tbody></tbody>
  </table>
</cinq-calendar>
```

Clicking the title no longer moves to the next month. Add
`aria-multiselectable="true"` on the grid in `range` and `multiple` modes.

**2. Attributes.**

| 3.x | 4.0 |
| --- | --- |
| `locale="fr"`, `data-locale="fr"` | `lang="fr"`, or nothing when an ancestor already has it (`<html lang>`) |
| `deselect` | `deselectable` |
| `allow-past` | Removed: past days can be picked by default. To block them, set `min` to today (`YYYY-MM-DD`) |
| `data-picked` in any order | `data-picked` in order, start then end in a range |

**3. Styling.** Classes are gone: the state is in attributes on each `<td>`,
and the day button is its direct child (the wrapping `<div>` is gone).

| 3.x selector | 4.0 selector |
| --- | --- |
| `.js-day` | `[data-day]` |
| `.js-day.active`, `.js-day[aria-selected="true"]` | `td[aria-selected="true"] [data-day]` |
| `.js-day.range` | `td[data-range] [data-day]`, picked range and preview alike |
| `.js-day.start`, `.js-day.end` | `td[data-start] [data-day]`, `td[data-end] [data-day]` |

`options.stateClasses` is removed. Write the rules in this order, so the range
ends win over the range, which wins over a picked day.

**4. Script API.**

| 3.x | 4.0 |
| --- | --- |
| `el.renderInner = (inner, date) => { … }` | `el.addEventListener(EVENTS.CALENDAR_RENDER, …)`, then decorate `el.querySelectorAll("[data-day]")` |
| `toDayString(date)` | `dayFromDate(date)` |
| `fromDayString(day)` | `dateFromDay(day)` |
| `getWeekStart(locale)` | `getFirstDay(locale)` |
| `el.getWeekdays()` | `el.getWeekdayNames()` |
| `el.getMonthName()`, `el.options.months` | Removed: the title comes from `Intl` |
| `el.setDaySelected()` | Removed: `el.setPicked()` paints the grid |
| `el.setPicked(days, false); el.render();` | `el.setPicked(days, false);` |
| `el.options.locale = …; el.render();` | `el.lang = …;` (observed) |
| `el.options.firstDay = …; el.render();` | `el.setAttribute("first-day", …);` (observed) |
| `el.$previous`, `el.$next` | Removed |
| `renderHeader(month, year)`, `renderCalendar(month, year, { focus })` | `renderHeader(year, month)`, `renderCalendar(year, month)` |

`options.locale` and `options.firstDay` are read-only: they follow `lang` and
`first-day` on each render.

**5. Forms.** With a `name`, `<cinq-calendar>` is a form field: its value is the
picked days joined by commas (`2026-11-10,2026-11-14`), and `required`, `min`
and `max` validate it. Remove a hidden input you synced from `calendar:change`,
unless the server expects another format.

**6. Events.** Import the constants from `@agencecinq/utils` 7.10.0 or later.
`calendar:change` now fires only when the selection changes: clicking the
picked day again in `single` mode no longer fires it. Cap a selection with the
cancelable `calendar:before-change` instead of trimming after
`calendar:change`:

```js
// 3.x
el.addEventListener(EVENTS.CALENDAR_CHANGE, () => {
  if (el.picked.length > 3) el.setPicked(el.picked.slice(0, 3), false);
});

// 4.0
el.addEventListener(EVENTS.CALENDAR_BEFORE_CHANGE, event => {
  if (event.detail.values.length > 3) event.preventDefault();
});
```

**7. Keyboard.** Enter and Space are the day button's own activation. Left and
right follow the screen: in a right-to-left grid the right arrow goes back a
day.

## Build setup

```bash
pnpm -C packages/calendar build
```

## Acknowledgments

- [`@19h47/calendar`](https://github.com/19h47/19h47-calendar), original implementation
- [WAI-ARIA APG, Date Picker Dialog](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/examples/datepicker-dialog/)
- Litepicker

See the [interactive docs](https://agencecinq.github.io/ui/components/calendar/) for live examples.
