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

document.querySelector("cinq-tabs").addEventListener(EVENTS.TABS_ACTIVATE, (event) => {
  console.log(event.detail);
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

## Drag

`trackDrag(element, options)` follows one pointer gesture at a time on
`element`: it captures the pointer on a primary press, follows that pointer
only, and ends on release, cancel or lost capture. It returns raw values, and
the component decides what they mean (a value, a ratio, a dismiss).

```js
import { trackDrag } from "@agencecinq/utils";

const drag = trackDrag($handle, {
  host: this, // gets [dragging] while a gesture runs
  start: (event) => this.open, // return false to ignore this press
  move: (event, { dx, dy, vx, vy }) => {},
  end: (event, { dx, dy, vx, vy, canceled }) => {},
});

// in destroy()
drag.destroy();
```

| Value | Meaning |
| ----- | ------- |
| `dx`, `dy` | Distance from the press, in px. |
| `vx`, `vy` | Speed over the last 50 ms, in px/ms, positive rightward and downward. A pause before the release brings it back to 0. |
| `canceled` | The browser took the pointer back before the release (`pointercancel` or lost capture). |

| Option | Role |
| ------ | ---- |
| `host` | Element that gets `[dragging]` while a gesture runs. |
| `target(event)` | Element that takes the pointer for this press, or `null` to ignore it. Defaults to `element`. Lets one listener on a container start gestures on its children. |
| `start(event)` | A primary press, once the gesture holds the pointer and the host has `[dragging]`. Return `false` to give it up. |
| `move(event, values)` | Each move of the tracked pointer. |
| `end(event, values)` | The release, or the cancel with `canceled: true`. |

`cancel()` stops a running gesture without calling `end`, for instance when
the component closes. `destroy()` also removes the listeners. Set
`touch-action: none` on the element, or touch drags turn into page scroll.
Types: `DragOptions`, `DragValues`, `DragEndValues`, `DragTracker`.

## Focus

| Export | Role |
| ------ | ---- |
| `getFocusableElements(container)` | Visible, tabbable descendants. |
| `rememberReturnFocus(element?)` | Stash the page control to refocus later (first call wins). |
| `restoreReturnFocus()` | Focus the stashed element and clear it. |
| `scheduleRestoreReturnFocus(closingHost?)` | Restore after the current turn, unless focus already moved elsewhere. |
| `addTrapFocus(container, elementToFocus?)` | Keep Tab inside a non-modal overlay. |
| `removeTrapFocus(elementToFocus?)` | Remove the trap, optionally move focus. |
| `focusByKey(event, elements, index)` | Move focus between `elements` with the arrow, Home and End keys, from `elements[index]`. Returns the new index, or `undefined` for a key left to the browser. |

`focusByKey()` wraps at both ends, swaps left and right in a right-to-left
context (read with `:dir(rtl)`, so a `dir` attribute is enough), cancels the
default action of the keys it handles, and leaves the keys pressed with Alt,
Ctrl or Meta to the browser. The component picks the elements and acts on the
new index, to activate a tab for instance.

```js
import { focusByKey } from "@agencecinq/utils";

#handleKeydown = (event) => {
  const index = this.$buttons.indexOf(event.target);

  if (index !== -1) {
    focusByKey(event, this.$buttons, index);
  }
};
```

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

## Migration

### From 8.x to 9.0

`DRAWER_TOGGLE`, `DRAWER_OPEN`, `DRAWER_CLOSE`, `SHEET_TOGGLE`, `SHEET_OPEN` and
`SHEET_CLOSE` are gone: `@agencecinq/drawer` 9.0 and `@agencecinq/sheet` 3.0 open
with invoker commands and leave the after-events to the native `toggle` event.
See the [drawer](https://github.com/agencecinq/ui/tree/main/packages/drawer#migration)
and [sheet](https://github.com/agencecinq/ui/tree/main/packages/sheet#migration)
migrations.

### From 7.x to 8.0

`MODAL_TOGGLE`, `MODAL_OPEN` and `MODAL_CLOSE` are gone: `@agencecinq/modal`
6.0 opens with invoker commands and leaves the after-events to the native
`toggle` event. See the
[modal migration](https://github.com/agencecinq/ui/tree/main/packages/modal#migration).

## Build setup

```bash
pnpm -C packages/utils build
```

## Acknowledgments

See the [reference docs](https://agencecinq.github.io/ui/reference/utils/) for
the full `EVENTS` catalog.
