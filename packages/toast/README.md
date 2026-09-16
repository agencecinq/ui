[![](https://img.shields.io/npm/v/@agencecinq/toast)](https://www.npmjs.com/package/@agencecinq/toast)
[![](https://img.shields.io/npm/dm/@agencecinq/toast)](https://www.npmjs.com/package/@agencecinq/toast)

# @agencecinq/toast

> Accessible toast notifications as a lightweight Web Component.

`<cinq-toast>` manages show / hide for a transient live-region notice. It does
**not** set ARIA roles: put `role="alert"` or `role="status"` (and optional
`aria-live` / `aria-atomic`) on the host yourself.

Behavior follows the spirit of the
[WAI-ARIA Alert pattern](https://www.w3.org/WAI/ARIA/apg/patterns/alert/)
(no focus move, no focus trap). Auto-dismiss is **opt-in** via `data-duration`
because APG advises against alerts that disappear too quickly. Pausing that
timer (hover, focus, …) is **consumer-owned** via `pause()` / `resume()`.

## Installation

```bash
pnpm add @agencecinq/toast
```

Peer: `@agencecinq/utils` >= 7.

## Usage

```js
import "@agencecinq/toast";
```

```html
<cinq-toast
  id="cart-toast"
  role="alert"
  aria-atomic="true"
  data-duration="5000"
>
  <div data-content></div>
  <button type="button" data-dismiss aria-label="Close">×</button>
</cinq-toast>
```

```js
const toast = document.querySelector("cinq-toast");

toast.addEventListener("pointerenter", () => toast.pause());
toast.addEventListener("pointerleave", () => toast.resume());
toast.addEventListener("focusin", () => toast.pause());
toast.addEventListener("focusout", (event) => {
  if (event.relatedTarget instanceof Node && toast.contains(event.relatedTarget)) {
    return;
  }
  toast.resume();
});

toast.show("Could not update cart");
```

> **HTML is the source of truth.** The component will not auto-set `role`.
> Use an a11y linter (axe-core, Lighthouse) to catch invalid markup.

## Required markup

| Attribute / element | Required | Role |
| ------------------- | -------- | ---- |
| `<cinq-toast>` | **Yes** | Host. Set `role="alert"` or `role="status"` yourself. |
| `[data-content]` | **Yes** | Message container updated via `textContent`. |
| `[data-dismiss]` | Optional | Dismiss control (typically a `<button type="button">`). |
| `data-duration` | Optional | Auto-dismiss delay in milliseconds. Omit for manual close only. |
| `open` | Optional | Reflected open state (also useful for CSS). |

## API

| Method | Description |
| ------ | ----------- |
| `show(message?)` | Opens the toast. Returns `false` if already open. |
| `close()` | Closes the toast. Returns `false` if already closed. |
| `toggle(message?)` | Toggles open state. |
| `pause()` | Pauses auto-dismiss and `--toast-progress`. |
| `resume()` | Resumes after `pause()`. |
| `init()` / `destroy()` | Lifecycle (also called from `connectedCallback` / `disconnectedCallback`). |

| Property | Description |
| -------- | ----------- |
| `open` | Whether the `open` attribute is present. |
| `message` | Current message string (synced to `[data-content]`). |
| `duration` | Parsed `data-duration` in ms (`0` = no auto-dismiss). |
| `paused` | Whether the auto-dismiss timer is paused. |

### CSS custom property

While auto-dismiss runs, the host sets `--toast-progress` from `0%` to `100%`
(frozen while `paused`). Style a progress bar with it if you want.

### Events (`@agencecinq/utils`)

| Constant | Name |
| -------- | ---- |
| `EVENTS.TOAST_OPEN` | `toast:open` |
| `EVENTS.TOAST_CLOSE` | `toast:close` |

`event.detail`: `{ el, message }`.

## Accessibility notes

- Do **not** move focus into the toast when it opens.
- Prefer `role="alert"` for errors; `role="status"` for quiet confirmations.
- If you auto-dismiss, decide in the consumer when to `pause()` / `resume()`
  (pointer, keyboard focus, reduced motion, …).
- If focus is inside the toast when it closes, the active element is blurred
  (focus was never stolen on open).
