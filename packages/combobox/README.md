# @agencecinq/combobox

Accessible editable combobox with list autocomplete as a lightweight Web Component
(`<cinq-combobox>`), aligned with the
[WAI-ARIA Authoring Practices combobox pattern](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/).

Inspired by [`@19h47/combobox`](https://github.com/19h47/19h47-combobox).

**HTML is the source of truth** for roles and structure. The component does not
invent missing attributes — you deliver clean markup; it orchestrates keyboard
behaviour, popup visibility, and ARIA state.

## Install

```bash
pnpm add @agencecinq/combobox
```

## Usage

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

Assign `search` after the element is in the DOM (or before — mounting waits for
both `connectedCallback` and a search function).

Set the textbox from outside via the host attribute or property:

```html
<cinq-combobox value="Owlbear">…</cinq-combobox>
```

```js
host.value = "Owlbear";
host.setValue("Owlbear");
host.setAttribute("value", "Owlbear");
```

## Events

Dispatched on the **host** `<cinq-combobox>` (bubble). Constants live on
`@agencecinq/utils` `EVENTS`:

| Event | Constant | Detail |
| ----- | -------- | ------ |
| `combobox:loading` | `COMBOBOX_LOADING` | — |
| `combobox:loaded` | `COMBOBOX_LOADED` | — |
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
