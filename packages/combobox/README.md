[![](https://img.shields.io/npm/v/@agencecinq/combobox)](https://www.npmjs.com/package/@agencecinq/combobox)
[![](https://img.shields.io/npm/dm/@agencecinq/combobox)](https://www.npmjs.com/package/@agencecinq/combobox)

# @agencecinq/combobox

> Accessible, WAI-ARIA combobox as a lightweight Web Component.

An editable combobox combines a text input with a listbox popup. `<cinq-combobox>`
orchestrates keyboard behaviour, popup visibility, and ARIA state. You supply
clean markup and a `search` function.

Implementation follows the
[WAI-ARIA Authoring Practices combobox pattern](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/).
Inspired by [`@19h47/combobox`](https://github.com/19h47/19h47-combobox).

## Installation

```bash
pnpm add @agencecinq/combobox
```

## Usage

```html
<label for="monster">Monster</label>
<cinq-combobox>
  <input
    id="monster"
    type="text"
    role="combobox"
    aria-autocomplete="list"
    aria-expanded="false"
    aria-controls="monster-listbox"
    autocomplete="off"
  />
  <button
    type="button"
    tabindex="-1"
    aria-label="Monsters"
    aria-controls="monster-listbox"
    aria-expanded="false"
  >
    ▼
  </button>
  <ul id="monster-listbox" role="listbox" aria-label="Monsters" hidden></ul>
</cinq-combobox>
```

```js
import "@agencecinq/combobox";

const host = document.querySelector("cinq-combobox");

host.search = (value) => {
  if (value.length < 1) return monsters;
  return monsters.filter((name) =>
    name.toLowerCase().startsWith(value.toLowerCase()),
  );
};
```

Importing `@agencecinq/combobox` registers the Web Component automatically.
Assign `search` after the element is in the DOM (or before. Mounting waits for
both `connectedCallback` and a search function).

> **HTML is the source of truth.** The component will not auto-set `role`,
> auto-migrate attributes, or warn about missing labels. Use an a11y linter
> (axe-core, Lighthouse) to catch invalid markup.

Set the textbox from outside via the host attribute or property:

```html
<cinq-combobox value="Owlbear">...</cinq-combobox>
```

```js
host.value = "Owlbear";
host.setValue("Owlbear");
host.setAttribute("value", "Owlbear");
```

### Options

| Attribute | Default | Description |
| --------- | ------- | ----------- |
| `data-mode` | `managed` | `managed` or `unmanaged` popup lifecycle. |
| `data-select-mode` | `select` | How a list option commits to the input. |
| `data-debounce` | `0` | Debounce delay (ms) before calling `search`. |
| `data-min-length` | `0` | Minimum input length before searching. |
| `data-open-on-empty` | `false` | Open the popup when the input is empty. |
| `data-autoselect` | `false` | Auto-highlight the first option while typing. |

## Events

Dispatched on the **host** `<cinq-combobox>` (bubble). Prefer constants from
`@agencecinq/utils`:

| Event | Constant | Detail |
| ----- | -------- | ------ |
| `combobox:loading` | `COMBOBOX_LOADING` | - |
| `combobox:loaded` | `COMBOBOX_LOADED` | - |
| `combobox:update` | `COMBOBOX_UPDATE` | `{ options, index, value }` |
| `combobox:submit` | `COMBOBOX_SUBMIT` | `{ option, index, value }` |
| `combobox:empty` | `COMBOBOX_EMPTY` | `{ value }` |

```js
import { EVENTS } from "@agencecinq/utils";

host.addEventListener(EVENTS.COMBOBOX_SUBMIT, ({ detail }) => {
  console.log(detail.option, detail.value);
});
```

## Styling hooks

| Hook | Element | When |
| ---- | ------- | ---- |
| `[hidden]` | listbox | Popup closed |
| `[aria-expanded="true"]` | input / button | Popup open |
| `[aria-busy="true"]` | listbox | Search in flight |
| `[expanded]` / `[busy]` / `[disabled]` | host | Mirrored state |

## Build setup

```bash
pnpm -C packages/combobox build
```

## Acknowledgments

- [Combobox Pattern (WAI-ARIA Practices)](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/)
- [`@19h47/combobox`](https://github.com/19h47/19h47-combobox), original implementation

See the [interactive docs](https://agencecinq.github.io/ui/components/combobox/) for live examples.
