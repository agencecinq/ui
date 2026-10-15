[![](https://img.shields.io/npm/v/@agencecinq/drilldown)](https://www.npmjs.com/package/@agencecinq/drilldown)
[![](https://img.shields.io/npm/dm/@agencecinq/drilldown)](https://www.npmjs.com/package/@agencecinq/drilldown)

# @agencecinq/drilldown

> Accessible drill-down navigation as a lightweight Web Component.

A drilldown shows one panel of a nested navigation at a time: a trigger replaces the
current panel with its child, a back button returns to the parent. Typical use: a
multi-level mobile menu inside a drawer.

`<cinq-drilldown>` toggles `hidden` on its panels, syncs `aria-expanded` on the
triggers, moves focus and dispatches open/close events. Each trigger follows the
[WAI-ARIA Authoring Practices disclosure pattern](https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/).

## Installation

```bash
pnpm add @agencecinq/drilldown
```

## Usage

Import once:

```js
import "@agencecinq/drilldown";
```

Then write the markup: the component only adds interactivity.

> **HTML is the source of truth.** The component will not auto-set `role`,
> auto-migrate attributes, or warn about missing labels. Run an a11y linter (axe,
> Lighthouse) to catch invalid markup.

```html
<cinq-drilldown>
  <nav id="menu" aria-label="Menu">
    <button type="button" aria-expanded="false" aria-controls="menu-solutions">
      Solutions
    </button>
  </nav>

  <nav id="menu-solutions" aria-label="Solutions" hidden>
    <button type="button" data-close>Back to menu</button>
    <a href="/audit">Audit</a>
  </nav>
</cinq-drilldown>
```

## Required markup

| Attribute / element | Required | Role |
| ------------------- | -------- | ---- |
| Direct children of `<cinq-drilldown>` | **Yes** | The panels. Only one is visible at a time. |
| `hidden` | **Yes** | On every panel except the visible one. |
| `id` | **Yes** | On every child panel, referenced by its trigger. |
| `<button aria-controls>` | **Yes** | Trigger inside a panel, controlling a child panel. |
| `aria-expanded` | **Yes** | On each trigger: `true` while its child panel is open. |
| `[data-close]` | **Yes** | Back button inside each child panel. |

Panels can be nested any number of levels deep. Give each `<nav>` panel an
`aria-label`, and the back button an accessible name that says where it goes.

The component toggles the native `hidden` attribute. Layout is yours.

### Opening on a sub panel

The open path is read from the HTML: the visible panel, and the `aria-expanded="true"`
triggers leading to it. To render the menu already on a sub panel, hide the root,
show the sub panel and expand its trigger in the markup. No stack is kept in
JavaScript.

## API

| Method | Description |
| ------ | ----------- |
| `init()` | Binds markup + listeners. Call `destroy()` first if already bound. |
| `destroy()` | Removes listeners. Safe while the host stays mounted. |
| `open(id, trigger?)` | Shows panel `#id` and hides the current one. Returns `false` if cancelled or invalid. |
| `close(focus?)` | Goes back to the parent panel. Returns `false` on the root panel. |
| `closeAll()` | Goes back to the root panel without moving focus. |

| Property | Description |
| -------- | ----------- |
| `panels` | Direct children of the host, resolved at connect time. |
| `current` | The visible panel. |

After adding or removing panels while the host stays mounted:

```js
$host.destroy();
// mutate panels...
$host.init();
```

To reset the menu when its drawer closes, see [Inside a drawer](#inside-a-drawer).

## Events

| Event | Cancelable | Detail | Description |
| ----- | ---------- | ------ | ----------- |
| `drilldown:open` | Yes | `{ panel, previous, $button, open: true }` | Fired on the host before a child panel opens. |
| `drilldown:close` | Yes | `{ panel, previous, $button, open: false }` | Fired on the host before going back to the parent. |

`panel` is the panel about to show, `previous` the one about to hide, `$button` the
trigger linking them. Events fire **before** the DOM mutates. `closeAll()` fires one
`drilldown:close` per level.

## Keyboard & focus

Triggers and back buttons are native `<button type="button">`: Enter and Space work
through the browser.

- **Open:** focus moves to the new panel's `[data-autofocus]` element if there is one,
  otherwise to its first focusable element, usually the back button.
- **Close:** focus returns to the trigger that opened the panel.
- **closeAll():** focus does not move.

Focus is moved, never trapped. Hidden panels are out of the tab order and the
accessibility tree. To contain focus, put the drilldown in a
[`@agencecinq/drawer`](../drawer/) or [`@agencecinq/modal`](../modal/).

### Announcing the panel

Landing on the back button, a screen reader announces the button but not always the
panel it belongs to. To say where the user is, put `data-autofocus` on the panel's
heading, made focusable with `tabindex="-1"`:

```html
<nav id="menu-solutions" aria-labelledby="menu-solutions-title" hidden>
  <button type="button" data-close>Back to menu</button>
  <h2 id="menu-solutions-title" tabindex="-1" data-autofocus>Solutions</h2>
  <a href="/audit">Audit</a>
</nav>
```

Panels are not dialogs, so they share one autofocus scope: HTML allows a single
`autofocus` per page, and one per panel fails validation. `data-autofocus` keeps
each panel's target without touching the page's own autofocus. `[autofocus]` is
still honoured for existing markup.

## Accessibility

- **Labels:** name every panel (`aria-label` or `aria-labelledby` on the `<nav>`),
  and give the back button a name that says where it goes ("Back to menu", not
  "Back").
- **Parents that are also pages:** an element can't be both a link and a trigger. Put
  a link to the parent page in its sub panel (e.g. "All solutions"), or a link and a
  separate trigger side by side, the trigger labelled for what it opens.
- **Not a menubar:** keep `<nav>`, `<button>` and `<a>`, without `menu` /
  `menuitem` roles. The APG reserves the
  [menubar pattern](https://www.w3.org/WAI/ARIA/apg/patterns/menubar/) for
  application menus: for site navigation it turns links into menu items and requires
  arrow-key navigation.
- **Test with a screen reader:** VoiceOver (Safari, macOS and iOS) and NVDA (Firefox
  or Chrome), going down and back up through every level.

## Inside a drawer

The drawer opens a modal `<dialog>`: the browser makes the rest of the page inert.
Hidden panels are not focusable either, so Tab only cycles through the drawer's own
controls (e.g. its close button) and the visible panel. Nothing else to wire for
focus.

```html
<cinq-drawer id="menu-drawer">
  <dialog aria-labelledby="menu-drawer-title">
    <header>
      <h2 id="menu-drawer-title">Menu</h2>
      <cinq-drawer-button>
        <button type="button" aria-label="Close menu" aria-controls="menu-drawer" aria-expanded="false">
          ✕
        </button>
      </cinq-drawer-button>
    </header>

    <cinq-drilldown id="menu-drilldown">
      <nav id="menu" aria-label="Menu">
        <button type="button" aria-expanded="false" aria-controls="menu-solutions">
          Solutions
        </button>
      </nav>

      <nav id="menu-solutions" aria-label="Solutions" hidden>
        <button type="button" data-close>Back to menu</button>
        <a href="/audit">Audit</a>
      </nav>
    </cinq-drilldown>
  </dialog>
</cinq-drawer>
```

Reset the drilldown when the drawer closes, so it reopens on the root panel.
`drawer:close` is dispatched on `document.documentElement` with the drawer's ID:

```js
import { EVENTS } from "@agencecinq/utils";

const $drilldown = document.getElementById("menu-drilldown");

document.documentElement.addEventListener(EVENTS.DRAWER_CLOSE, (event) => {
  if (event.detail.drawer === "menu-drawer") {
    $drilldown.closeAll();
  }
});
```

## Build setup

```bash
pnpm -C packages/drilldown build
```
