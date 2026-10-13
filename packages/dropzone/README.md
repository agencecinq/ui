[![](https://img.shields.io/npm/v/@agencecinq/dropzone)](https://www.npmjs.com/package/@agencecinq/dropzone)
[![](https://img.shields.io/npm/dm/@agencecinq/dropzone)](https://www.npmjs.com/package/@agencecinq/dropzone)

# @agencecinq/dropzone

> File drop zone as a lightweight Web Component, wired to a native file input.

A drop zone lets users drag files from their desktop instead of browsing for them.
`<cinq-dropzone>` hands the dropped files to a native `<input type="file">`, as if
they were picked in the browser dialog, and checks them against the input's
`accept`, `multiple` and an optional maximum size.

The input stays the source of truth: it keeps its name, its form and its
validation. Clicking the label still opens the native picker, with no script
involved, so the zone works with the keyboard and without JavaScript.

## Installation

```bash
pnpm add @agencecinq/dropzone
```

## Usage

Import once:

```js
import "@agencecinq/dropzone";
```

Then write the markup: the component only adds drag and drop.

> **HTML is the source of truth.** The component will not auto-set `role`,
> auto-migrate attributes, or warn about missing labels. Run an a11y linter (axe,
> Lighthouse) to catch invalid markup.

```html
<cinq-dropzone data-max-size="10485760">
  <label>
    <input type="file" name="portrait" accept=".svg,.png,.jpg" class="sr-only" />
    Drop your portrait or click to browse
  </label>
</cinq-dropzone>
```

The input can live elsewhere, for example inside a form rendered by a plugin.
Point a label inside the host to it with `for`:

```html
<cinq-dropzone>
  <label for="quote-file">Drop your files or click to browse</label>
</cinq-dropzone>

<form>
  <input type="file" id="quote-file" name="quote-file" />
</form>
```

## Required markup

| Attribute / element | Required | Role |
| ------------------- | -------- | ---- |
| `<cinq-dropzone>` | **Yes** | Host and drop target. |
| `input[type="file"]` | **Yes** | Inside the host, or anywhere when a `label[for]` inside the host points to it. Holds the files. |
| `<label>` | Recommended | Opens the native picker and names the input. |
| `accept` | Optional | On the input. Extensions, MIME types or groups (`image/*`). |
| `multiple` | Optional | On the input. Without it, only the first valid file is kept. |
| `disabled` | Optional | On the input. Drops are ignored. |

`init()` throws when no file input can be found.

## Options

| Attribute | Type | Default | Description |
| --------- | ---- | ------- | ----------- |
| `data-max-size` | number | none | Largest file in bytes. Larger files are rejected. |

## API

| Method / property | Description |
| ----------------- | ----------- |
| `$input` | The file input. |
| `$label` | The first label inside the host. |
| `files` | Files held by the input, as an array. |
| `maxSize` | From `data-max-size`, `0` without limit. |
| `clear()` | Empties the input and dispatches `change`. |
| `init()` / `destroy()` | Bind / unbind for DOM mutation. |

```js
const dropzone = document.querySelector("cinq-dropzone");

dropzone.destroy();
// mutate light DOM...
dropzone.init();
```

`accepts(file, accept)` and `filter(files, rules)` are exported too, for the same
checks outside the component.

## Behavior

- Dragging files over the host sets the `dragover` attribute, for styling.
- A drop keeps the files that match `accept`, `data-max-size` and `multiple`, puts
  them in the input, then dispatches `input` and `change` on it, bubbling. Forms,
  frameworks and plugins listening to the input see the new files.
- Files picked in the dialog go through the same checks. The input only keeps the
  valid ones.
- Dragging text or links does nothing, nor does dropping on a disabled input.

## Styling hooks

| Hook | Description |
| ---- | ----------- |
| `[dragover]` | Files are dragged over the host. |

```css
cinq-dropzone[dragover] {
  outline: 2px dashed currentColor;
}
```

Keep the input focusable when you hide it (`sr-only`, not `display: none`), and
show its focus on the label with `:focus-visible` or `:has(:focus-visible)`.

## Events

Both are dispatched on the host, bubbling, not cancelable.

| Constant | Event | Detail |
| -------- | ----- | ------ |
| `EVENTS.DROPZONE_CHANGE` | `dropzone:change` | `{ files, $input }`, after a drop, a pick or a `clear()` |
| `EVENTS.DROPZONE_REJECT` | `dropzone:reject` | `{ rejected, $input }`, each `{ file, reason }` with `reason` `accept`, `size` or `multiple` |

```js
import { EVENTS } from "@agencecinq/utils";

dropzone.addEventListener(EVENTS.DROPZONE_CHANGE, (event) => {
  const { files } = event.detail;
  console.log(files.map(({ name }) => name));
});

dropzone.addEventListener(EVENTS.DROPZONE_REJECT, (event) => {
  const { rejected } = event.detail;
  console.log(rejected.map(({ file, reason }) => `${file.name}: ${reason}`));
});
```

## Build setup

```bash
pnpm -C packages/dropzone build
pnpm -C packages/dropzone test
```

## Acknowledgments

- [HTML drag and drop API (MDN)](https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API)
- [`<input type="file">` (MDN)](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file)

See the [interactive docs](https://agencecinq.github.io/ui/components/dropzone/) for live examples.
