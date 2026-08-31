[![](https://img.shields.io/npm/v/@agencecinq/tabs)](https://www.npmjs.com/package/@agencecinq/tabs)
[![](https://img.shields.io/npm/dm/@agencecinq/tabs)](https://www.npmjs.com/package/@agencecinq/tabs)

# @agencecinq/tabs

> Accessible, WAI-ARIA tabs as a lightweight Web Component.

Tabs organize content into selectable panels. `<cinq-tabs>` wires tablist
keyboard navigation, optional hash sync, automatic activation delay, and
deletable tabs.

Implementation follows the
[WAI-ARIA Authoring Practices tabs pattern](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/).

## Installation

```bash
pnpm add @agencecinq/tabs
```

## Usage

### Web Component (`<cinq-tabs>`)

```html
<cinq-tabs data-hash="true" data-delay="0">
  <div role="tablist" aria-label="Navigation">
    <button
      type="button"
      class="is-active"
      role="tab"
      aria-selected="true"
      aria-controls="home-tab"
      id="home"
    >
      Home
    </button>
    <button
      type="button"
      role="tab"
      aria-selected="false"
      aria-controls="project-tab"
      id="project"
      tabindex="-1"
    >
      Project
    </button>
    <button
      type="button"
      role="tab"
      aria-selected="false"
      aria-controls="contact-tab"
      id="contact"
      tabindex="-1"
      data-deletable
    >
      Contact
    </button>
  </div>

  <section tabindex="0" role="tabpanel" aria-labelledby="home" id="home-tab">
    ...
  </section>
  <section tabindex="0" role="tabpanel" aria-labelledby="project" id="project-tab">
    ...
  </section>
  <section tabindex="0" role="tabpanel" aria-labelledby="contact" id="contact-tab">
    ...
  </section>
</cinq-tabs>
```

```js
import "@agencecinq/tabs";
```

Importing `@agencecinq/tabs` registers the Web Component automatically.
No manual `init()` call required.

> **HTML is the source of truth.** The component will not auto-set `role`,
> auto-migrate attributes, or warn about missing labels. Use an a11y linter
> (axe-core, Lighthouse) to catch invalid markup.

### Required markup

| Selector / attribute | Required | Role |
| -------------------- | -------- | ---- |
| `<cinq-tabs>` | **Yes** | Tabs container. |
| `[role="tablist"]` | **Yes** | Container for tab triggers (not on `<ul>`). |
| `[role="tab"]` | **Yes** | Tab trigger. Direct child of the tablist. |
| `aria-selected` | **Yes** | Current tab state on each trigger. |
| `aria-controls` | **Yes** | ID of the associated tabpanel. |
| `[role="tabpanel"]` | **Yes** | Panel content region. |
| `aria-labelledby` | **Yes** | On each tabpanel, referencing the tab `id`. |
| `data-deletable` | Optional | On a tab trigger. Enables Delete / Backspace removal. |

Use `class="is-active"` on the initially selected tab and panel for styling.
The component reads `aria-selected` to determine the active tab on load.

### Options

Configured via data attributes on `<cinq-tabs>`:

| Attribute | Type | Default | Description |
| --------- | ---- | ------- | ----------- |
| `data-hash` | boolean | `true` | Sync the active tab id to `location.hash` on activation. |
| `data-delay` | number (ms) | `0` | When `> 0`, arrow key navigation activates the focused tab after the delay. `0` is manual activation. |

### Keyboard

| Key | Function |
| --- | -------- |
| `Tab` | Move focus into the tablist, then to the active tabpanel. |
| `Enter` / `Space` | Activate the focused tab. |
| `ArrowLeft` / `ArrowRight` | Move focus between tabs (follows reading direction in RTL). |
| `Home` / `End` | Focus the first / last tab. |
| `Delete` / `Backspace` | Remove the focused tab when `data-deletable` is set. |

### Programmatic API

```js
const $tabs = document.querySelector("cinq-tabs");

$tabs.destroy();
// mutate tablist / panels...
$tabs.init();
```

Call `destroy()` before mutating light DOM, then `init()` to re-bind.

## Events

Events are dispatched on the **tab** element (the button with `role="tab"`).
Listen on each tab, or use event delegation from `<cinq-tabs>`. Prefer
constants from `@agencecinq/utils`:

| Event | Constant | Cancelable | Detail | Description |
| ----- | -------- | ---------- | ------ | ----------- |
| `tabs:before-activate` | `TABS_BEFORE_ACTIVATE` | Yes | `{ index, controls, element }` | Fired before activation. Cancel to abort. |
| `tabs:activate` | `TABS_ACTIVATE` | No | `{ controls, element }` | Fired when the tab is activated. |
| `tabs:delete` | `TABS_DELETE` | No | `{ controls, element }` | Fired when a deletable tab is removed. |

```js
import { EVENTS } from "@agencecinq/utils";

const $tabs = document.querySelector("cinq-tabs");

$tabs.addEventListener(EVENTS.TABS_BEFORE_ACTIVATE, (event) => {
  event.preventDefault();

  void fetchData(event.detail.controls).then(() => {
    $tabs.tabs[event.detail.index].toggle();
  });
});

$tabs.addEventListener(EVENTS.TABS_ACTIVATE, ({ detail }) => {
  console.log(detail.controls, detail.element);
});
```

## Build setup

```bash
pnpm -C packages/tabs build
```

## Acknowledgments

- [Tabs Pattern (WAI-ARIA Practices)](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/)
- [Manual activation example](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/examples/tabs-manual/)
- [Automatic activation example](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/examples/tabs-automatic/)

See the [interactive docs](https://agencecinq.github.io/ui/components/tabs/) for live examples.
