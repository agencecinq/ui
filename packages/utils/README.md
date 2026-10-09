[![](https://img.shields.io/npm/v/@agencecinq/utils)](https://www.npmjs.com/package/@agencecinq/utils)
[![](https://img.shields.io/npm/dm/@agencecinq/utils)](https://www.npmjs.com/package/@agencecinq/utils)

# @agencecinq/utils

> Shared event names and helpers for CINQ UI Web Components.

The contract between CINQ UI packages: event constants, event dispatch
helpers, focus and scroll utilities, and attribute parsers. Most component
packages list it as a peer dependency.

## Installation

```bash
pnpm add @agencecinq/utils
```

## Events

Custom events follow `{package}:{action}` in kebab-case. Use the `EVENTS`
constants rather than string literals:

```js
import { EVENTS } from "@agencecinq/utils";

document.documentElement.addEventListener(EVENTS.DRAWER_OPEN, (event) => {
  console.log(event.detail.drawer);
});
```

### `dispatchEvent(target, name, detail?, options?)`

Dispatches a typed `CustomEvent`. Defaults: `bubbles: true`,
`cancelable: true`. Returns `false` when a listener called `preventDefault()`.

```js
import { EVENTS, dispatchEvent } from "@agencecinq/utils";

if (!dispatchEvent(host, EVENTS.ACCORDION_OPEN, { el, index })) {
  return; // canceled
}
```

### `dispatchBeforeEvent(target, name, detail)`

Dispatches a cancelable, non-bubbling before-event whose `detail` gets a
`waitUntil(promise)` method. Drawer, Modal and Sheet use it for their
`before-open` / `before-close` events.

- `preventDefault()` cancels the action.
- `detail.waitUntil(promise)` defers it. Several listeners can defer the same
  action: it proceeds once every promise fulfills, and is canceled if one
  rejects.
- `waitUntil()` must be called synchronously in the listener. A later call
  throws.

Returns a boolean when no listener deferred, so the caller can commit
synchronously, otherwise a promise of whether the action may proceed.

```js
import { EVENTS, dispatchBeforeEvent } from "@agencecinq/utils";

const result = dispatchBeforeEvent(document.documentElement, EVENTS.DRAWER_BEFORE_OPEN, {
  drawer: id,
});

if (typeof result === "boolean") {
  if (result) commit();
} else {
  result.then((proceed) => proceed && commit());
}
```

Types: `WaitUntil`, `BeforeEventDetail<T>`.

## Focus

| Export | Role |
| ------ | ---- |
| `getFocusableElements(container)` | Visible, tabbable descendants. |
| `rememberReturnFocus(element?)` | Stash the page control to refocus later (first call wins). |
| `restoreReturnFocus()` | Focus the stashed element and clear it. |
| `scheduleRestoreReturnFocus(closingHost?)` | Restore after the current turn, unless focus already moved elsewhere. |
| `addTrapFocus(container, elementToFocus?)` | Keep Tab inside a non-modal overlay. |
| `removeTrapFocus(elementToFocus?)` | Remove the trap, optionally move focus. |

## Scroll lock

| Export | Role |
| ------ | ---- |
| `disableScroll()` | Lock document scroll and keep the position. |
| `enableScroll(position?)` | Unlock and restore the previous position, unless `position` is a number or `false`. |

## Attribute parsers

| Export | Role |
| ------ | ---- |
| `parseBoolean(value, fallback?)` | `"false"` / `"0"` to `false`, absent to `fallback`. |
| `parseNumber(value, fallback)` | Finite number or `fallback`. |
| `parseList(value)` | Space-separated tokens to `string[]`. |

## Other helpers

| Export | Role |
| ------ | ---- |
| `clamp(value, min, max)` | Numeric clamp. |
| `throttle(fn, wait)` | Trailing throttle. |
| `debounce(fn, wait)` | Trailing debounce. |

## Build setup

```bash
pnpm -C packages/utils build
```

## Acknowledgments

See the [reference docs](https://agencecinq.github.io/ui/reference/utils/) for
the full `EVENTS` catalog.
