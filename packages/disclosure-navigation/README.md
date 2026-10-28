[![](https://img.shields.io/npm/v/@agencecinq/disclosure-navigation)](https://www.npmjs.com/package/@agencecinq/disclosure-navigation)
[![](https://img.shields.io/npm/dm/@agencecinq/disclosure-navigation)](https://www.npmjs.com/package/@agencecinq/disclosure-navigation)

# @agencecinq/disclosure-navigation

> Accessible, WAI-ARIA disclosure navigation as a lightweight Web Component.

A site navigation whose buttons show and hide submenus. `<cinq-disclosure-navigation>`
updates `aria-expanded` and `hidden`, keeps one branch open at a time, adds the keyboard
support of the APG example, and can open the submenus on hover.

Implementation follows the
[WAI-ARIA Authoring Practices disclosure navigation example](https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/examples/disclosure-navigation/).
Inspired by [`@19h47/disclosure-navigation`](https://github.com/19h47/19h47-disclosure-navigation).

- **Navigation, not a menu.** A site navigation is a list of links. Buttons announce
  _collapsed_ or _expanded_, links stay links. The ARIA `menu` role is meant for
  application menus.
- **Your HTML is the source of truth.** The component reads `aria-expanded` and
  `aria-controls`, and never adds a missing attribute.
- **Built on the platform.** Native `<button>`, the `hidden` attribute,
  [`ariaControlsElements`](https://developer.mozilla.org/en-US/docs/Web/API/Element/ariaControlsElements),
  [`ToggleEvent`](https://developer.mozilla.org/en-US/docs/Web/API/ToggleEvent) as popovers
  fire it, `AbortController`. No dependency.

## Installation

```bash
pnpm add @agencecinq/disclosure-navigation
```

## Usage

```js
import "@agencecinq/disclosure-navigation";
```

```html
<cinq-disclosure-navigation>
  <nav aria-label="Main">
    <ul>
      <li><a href="/">Home</a></li>
      <li>
        <button type="button" aria-expanded="false" aria-controls="about-menu">About</button>
        <ul id="about-menu" hidden>
          <li><a href="/about/overview">Overview</a></li>
          <li><a href="/about/team" aria-current="page">Team</a></li>
        </ul>
      </li>
    </ul>
  </nav>
</cinq-disclosure-navigation>
```

Importing the package registers the custom element. Connecting it only adds listeners.

> **HTML is the source of truth.** The component does not set a missing
> `aria-expanded`, `hidden` or label, nor warns about them. Use an accessibility linter
> (axe-core, Lighthouse) to catch invalid markup.

### Required markup

| Attribute       | On          | Role                                                                                     |
| --------------- | ----------- | ---------------------------------------------------------------------------------------- |
| `aria-expanded` | `<button>`  | **Required.** The state. A button without it is ignored. The component updates it.       |
| `aria-controls` | `<button>`  | **Required.** ID(s) of the submenu(s), inside the host. Several IDs work together.       |
| `hidden`        | Submenu     | Present while collapsed, or `hidden="until-found"` to keep its links searchable.         |
| `aria-label`    | `<nav>`     | Names the landmark when the page has more than one navigation.                           |
| `aria-current`  | `<a>`       | Optional: marks the current page.                                                         |

To render a submenu open, write `aria-expanded="true"` on its button and leave out
`hidden`.

### Attributes

| Attribute                | On   | Effect                                                                    |
| ------------------------ | ---- | ------------------------------------------------------------------------- |
| `data-hover`             | Host | A mouse opens the submenus on hover. See [Opening on hover](#opening-on-hover). |
| `data-arrow-keys="false"` | Host | Leaves the arrow, Home and End keys to the browser.                       |

Both are read on each interaction: setting or removing them needs no call.

### Styling

Style the state the component writes:

```css
button[aria-expanded="true"]::after {
  rotate: 225deg;
}

/* Needed only if your CSS gives .submenu a display value */
.submenu[hidden]:not([hidden="until-found"]) {
  display: none;
}
```

Position submenus with logical properties, such as `inset-inline-start`, so they follow
the reading direction. The host is inline, as any custom element: give it a `display`
if you lay it out.

### Nested submenus

A submenu can hold buttons with their own submenus. Opening one keeps its parents open
and closes the other branches. Closing a submenu closes the ones nested in it.

### Opening on hover

With `data-hover`, a mouse opens a submenu when it enters its button, and closes it when
it leaves the button and the submenu. Touch and pen keep the click.

```html
<cinq-disclosure-navigation data-hover>…</cinq-disclosure-navigation>
```

- **The click still works.** The first click after the mouse opened a submenu keeps it
  open, as the user meant to open it. The next click closes it.
- **No gap.** The pointer goes from the button to the submenu: leave no space between
  them, or fill it with the submenu's padding.
- **Escape closes it wherever the focus is.** Content shown on hover must be dismissible
  without moving the pointer
  ([WCAG 1.4.13](https://www.w3.org/WAI/WCAG22/Understanding/content-on-hover-or-focus.html)).
- **Hover only adds.** Keyboard and screen reader users open the same submenus with the
  buttons.

### Find in page

Write `hidden="until-found"` on collapsed submenus and their links stay searchable. When
find in page or a link to a fragment reveals a submenu, the component opens it, nested
ones included, and keeps `until-found` when it closes again.

```html
<ul id="about-menu" hidden="until-found">…</ul>
```

A stylesheet that sets `[hidden] { display: none }` keeps the links out of the search:
Bootstrap's Reboot does, with `!important`, while Tailwind 4's preflight leaves
`until-found` out. Restore `display` for `[hidden="until-found"]`. The browser reveals
the submenu whatever a listener does:
canceling `beforetoggle` leaves the button collapsed next to a visible submenu.

## Keyboard

| Key                 | Focus on                   | Action                                           |
| ------------------- | -------------------------- | ------------------------------------------------ |
| Tab / Shift + Tab   | Anywhere                   | Native order. Collapsed submenus are skipped.    |
| Enter / Space       | Button                     | Toggles its submenu (native button activation).  |
| Escape              | Button or top-level link   | Closes the open submenu.                         |
| Escape              | Submenu                    | Closes the innermost one and focuses its button. |
| Escape              | Outside the navigation     | Closes the open submenu, focus stays.            |
| ArrowDown           | Expanded button, any level | Moves focus to the first item of its submenu.    |
| Arrow keys          | Top-level item             | Previous or next button or link, wrapping.       |
| Arrow keys          | Submenu item               | Previous or next item, wrapping.                 |
| Home / End          | Top-level or submenu item  | First or last item.                              |

Moving focus out of the navigation closes the open submenu. Keys pressed with Alt, Ctrl
or Meta are left to the browser, and so are arrow keys in a text field.

In a right-to-left context, ArrowLeft and ArrowRight swap. The component reads the
direction from the markup with `:dir(rtl)`: a `dir` attribute on the page or the
navigation is enough.

### In a dialog or a popover

Escape is also a
[close request](https://html.spec.whatwg.org/multipage/interaction.html#close-requests):
it closes the topmost dialog or popover. While a submenu is open and focus is in the
navigation, the component cancels the key press, so each press closes one layer: the
submenu, then the dialog. With every submenu closed, or focus elsewhere, the browser
handles the key. An Escape another script already canceled is left alone.

## API

| Member            | Description                                                                                  |
| ----------------- | -------------------------------------------------------------------------------------------- |
| `init()`          | Binds listeners. Runs on connect. Call `destroy()` first if already bound.                   |
| `destroy()`       | Removes listeners. Runs on disconnect. The markup stays in its current state.                |
| `open($button)`   | Opens the submenu of `$button` and closes the other branches. Canceling its `beforetoggle` leaves every submenu as it is. |
| `close($button?)` | Closes the submenu of `$button`, or every open submenu. Focus inside a closing submenu moves to its button. |
| `toggle($button)` | Opens or closes the submenu of `$button`.                                                    |

Buttons are found inside the host with `button[aria-expanded][aria-controls]`, read from
the DOM on each interaction: adding or removing items needs no call. Closing the submenu
once a link is followed is up to you:

```js
const $navigation = document.querySelector("cinq-disclosure-navigation");

$navigation.addEventListener("click", (event) => {
  if (event.target.closest("a")) {
    $navigation.close();
  }
});
```

### Closing from outside

The open submenu closes when focus leaves the navigation, on Escape, and with
`data-hover` when the mouse leaves it. Safari does not focus a button on click, by
design: after opening a submenu with a click, clicking elsewhere moves no focus and the
submenu stays open. If you need it, close it yourself:

```js
document.addEventListener("click", (event) => {
  if (!$navigation.contains(event.target)) {
    $navigation.close();
  }
});
```

## Events

The component fires the platform's events, the way a popover does: a
[`ToggleEvent`](https://developer.mozilla.org/en-US/docs/Web/API/ToggleEvent) named
`beforetoggle`, then `toggle`, at each submenu. The same listener works for `<details>`,
popovers and `<dialog>`.

| Event          | Fires                                                                                     | Cancelable              |
| -------------- | ----------------------------------------------------------------------------------------- | ----------------------- |
| `beforetoggle` | **Before** the DOM changes.                                                               | When the submenu opens. |
| `toggle`       | **After**, in a later task. Changes made before it fires coalesce into one event, from the first old state to the last new state. | No. |

`event.target` is the submenu, `event.source` its button, and `oldState` and `newState`
are `'open'` or `'closed'`. As on the platform, the events do not bubble: otherwise a
submenu's `toggle` would reach the `ontoggle` of a `<details>` or a `<dialog>` holding the
navigation. Listen on the submenu, or on the host in the capture phase.

```js
$navigation.addEventListener(
  "beforetoggle",
  (event) => {
    if ("open" === event.newState && "services" === event.source.id) {
      event.preventDefault(); // Services stays closed
    }
  },
  { capture: true },
);

$navigation.addEventListener(
  "toggle",
  (event) => console.log(event.target.id, event.newState),
  { capture: true },
);
```

Canceling an opening leaves every submenu as it is, the open one included: the other
branches close after `beforetoggle`. Closing cannot be canceled. A button that controls
several elements fires at each one, and opens none of them when one opening is canceled.
In TypeScript, the DOM library already types both events as `ToggleEvent`.

## Browser support

Chrome and Edge 135, Firefox 136 and Safari 17: submenus are resolved with
[`ariaControlsElements`](https://developer.mozilla.org/en-US/docs/Web/API/Element/ariaControlsElements)
and events are [`ToggleEvent`](https://developer.mozilla.org/en-US/docs/Web/API/ToggleEvent)s.
`event.source` needs Chrome and Edge 140, Firefox 145 and Safari 26.5: older browsers
fire the events without it.

Find in page relies on `hidden="until-found"`: Chrome and Edge 102, Firefox 139,
Safari 26.2. Elsewhere it acts as `hidden`. The package is an ES module.

## Migration

### From `@19h47/disclosure-navigation` 5.x

The class becomes a custom element: the host replaces `$nav`. Markup inside it, styles,
methods and events do not change.

1. **Wrap the navigation in the host**, and drop the instance.

   ```diff
   + <cinq-disclosure-navigation>
       <nav aria-label="Main">…</nav>
   + </cinq-disclosure-navigation>
   ```

   ```diff
   - import DisclosureNavigation from "@19h47/disclosure-navigation";
   -
   - const disclosureNavigation = new DisclosureNavigation($nav);
   -
   - disclosureNavigation.init();
   + import "@agencecinq/disclosure-navigation";
   ```

2. **Call the methods on the host.** `open()`, `close()` and `toggle()` take the same
   arguments. `init()` and `destroy()` run on connect and disconnect. `$el` is gone.
3. **Listen on the host.** `beforetoggle` and `toggle` still fire at the submenus,
   without bubbling: listen on the host in the capture phase, instead of `$nav`.
4. **Replace `useArrowKeys = false`** with `data-arrow-keys="false"` on the host.
5. **Expect Escape outside the navigation** to close the open submenu, without
   canceling the key.

### From several `<cinq-disclosure-button>`

A navigation built from one `<cinq-disclosure-button>` per entry, with a script that
closes the others or opens on hover, becomes one host.

1. **Remove the `<cinq-disclosure-button>` around each button**, and wrap the navigation
   in `<cinq-disclosure-navigation>`. Add `data-hover` to open on hover.
2. **Remove the script.** One branch open at a time, Escape, closing when focus leaves
   and hover are built in.
3. **Replace the `disclosure-button:*` listeners** with `beforetoggle` and `toggle` on
   the host, in the capture phase.

## Development

```bash
pnpm --filter @agencecinq/disclosure-navigation build
pnpm --filter @agencecinq/disclosure-navigation test # Chromium, Firefox and WebKit
```
