# `@agencecinq/sheet` Specification

> Bottom sheet Web Component on native `<dialog>`.

**Status:** v3
**Target APG:** [Dialog (Modal)](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)
**Design reference:** Zhiggie, Sticky add to cart mobile (Figma node `51:6472`)

---

## 1. Goals

### In scope

- Present a native `<dialog>` from the bottom edge, opened and closed with invoker commands
- Open height follows content
- Optional drag handle: pull down to dismiss, snap back otherwise
- Pull up on a button that opens the sheet to open it
- Cancelable before-open / before-close, deferred with `waitUntil(promise)`
- Modal (`showModal()`) by default, non-modal with `<dialog popover>`
- Replace a sheet with the next one (`data-replace`)

### Out of scope

- Other edges (`direction`)
- Detents and snap points
- Sheet following the finger while pulling up to open
- Drag from content
- Positioning, motion and reduced motion (consumer CSS)
- Scroll lock (consumer CSS)
- Polyfills (latest browsers only, invokers polyfill for older ones)

### Non-goals (relation to existing packages)

| Package | Pattern | Why not this package |
| ------- | ------- | -------------------- |
| `@agencecinq/modal` | Centered dialog | No edge anchoring, no drag |
| `@agencecinq/drawer` | Side panel | Side edges, no drag |

---

## 2. Custom elements

| Item | Value |
| ---- | ----- |
| Tag | `cinq-sheet` |
| Package | `@agencecinq/sheet` |
| Import | `import "@agencecinq/sheet"` |

---

## 3. Markup contract

### 3.1 Structure

```html
<button commandfor="loot-sheet" command="show-modal">Open</button>

<cinq-sheet>
  <dialog id="loot-sheet" aria-labelledby="loot-title" closedby="any">
    <div data-dom="drag-indicator"></div>
    <h2 id="loot-title">Loot</h2>
    <button commandfor="loot-sheet" command="request-close">Close</button>
  </dialog>
</cinq-sheet>
```

### 3.2 Required attributes / elements

| Selector / attribute | Required | Role |
| -------------------- | -------- | ---- |
| `dialog[id]` | Yes | The panel, targeted by `commandfor` |
| `dialog[popover]` | No | Non-modal sheet |
| `[data-dom="drag-indicator"]` | No | Drag handle, inside the dialog |
| `button[commandfor][command]` | Yes for buttons | Trigger |
| `data-replace` on an opening button | No | Opens in place of the sheet holding the button |

### 3.3 What the component writes at runtime

| Target | Attributes / properties |
| ------ | ----------------------- |
| Host | `dragging`, `--cinq-sheet-drag-offset` |
| `dialog` | native open state, through `showModal()`, `close()`, `showPopover()`, `hidePopover()` |

`aria-expanded` on popover triggers is the browser's.

### 3.4 HTML is the source of truth

The component does not invent roles, labels or classes. The dialog is the only
open state.

---

## 4. Options

| Attribute | On | Description |
| --------- | -- | ----------- |
| `popover` | `dialog` | Non-modal sheet in the top layer, toggled by `toggle-popover` |
| `closedby` | `dialog` | Native dismissal of a modal sheet, read by the handle too |

| `closedby` | Escape | Backdrop press | Handle pull |
| ---------- | ------ | -------------- | ----------- |
| `any` | Yes | Yes | Yes |
| `closerequest` | Yes | No | Yes |
| absent | Yes | No | Yes |
| `none` | No | No | No |

On a popover sheet, `closedby` only matters to the handle. `popover="manual"` keeps the sheet open on a press outside and Escape.

---

## 5. Interaction

### Commands

| Command | Sheet | Hook |
| ------- | ----- | ---- |
| `show-modal` | Modal | `sheet:before-open` |
| `request-close` | Modal | `sheet:before-close` |
| `close` | Modal | None |
| `toggle-popover`, `show-popover`, `hide-popover` | Non-modal | `sheet:before-open` / `sheet:before-close` |

### Keyboard

| Key | Function |
| --- | -------- |
| Escape | Closes unless `closedby="none"`. Through `sheet:before-close` on a modal sheet, natively on a popover |
| Tab | Native modal dialog containment |

### Pointer

- Backdrop press closes a modal sheet with `closedby="any"`, handled by the component in Safari
- A press outside closes a popover sheet natively
- Button pull: a button that opens the closed sheet opens it on a pull up past 40 px or an upward flick, after the `pointerup`. A tap runs the command, a short pull does nothing, and the click that ends a pull is ignored
- Handle drag: offset follows the pointer downward, damped (square root) upward. Release past 80 px or with a downward flick closes, otherwise snaps back
- Focus on open and restore on close are native `<dialog>` and popover behaviors

---

## 6. Consumer styling and accessibility

- Anchor the dialog: `fixed inset-x-0 top-auto bottom-0 m-0`. A small overhang (`-bottom-4 pb-4`) hides the bottom edge during spring motion
- Cap height with `max-height`
- Apply `--cinq-sheet-drag-offset` as a `translate`, drop the transition under `[dragging]`
- Enter and exit motion with `@starting-style` and `transition-behavior: allow-discrete`
- `prefers-reduced-motion` handled by the consumer
- `touch-action: none` on the handle and on the button that takes the pull up
- Hide the handle from assistive tech (`aria-hidden="true"`)
- A visible close button, required with `closedby="none"`
- `autofocus` on the control the user came for
- Non-modal: `inert` on the covered content while open, lifted on `beforetoggle` so focus restore reaches the trigger
- Non-modal: close on `submit`, since `<form method="dialog">` does not close a popover
- `:focus-visible` on interactive content

---

## 7. Styling hooks

| Hook | When |
| ---- | ---- |
| `dialog[open]`, `dialog:popover-open` | Open |
| `cinq-sheet[dragging]` | Handle drag in progress |
| `--cinq-sheet-drag-offset` | Drag distance in px, negative upward, unset at rest |
| `dialog::backdrop` | Scrim (modal only) |

---

## 8. Events

Dispatched on `document.documentElement`, not bubbling.

| Event | Constant | Cancelable | Detail |
| ----- | -------- | ---------- | ------ |
| `sheet:before-open` | `SHEET_BEFORE_OPEN` | Yes | `{ sheet, instance, trigger, waitUntil }` |
| `sheet:before-close` | `SHEET_BEFORE_CLOSE` | Yes | `{ sheet, instance, waitUntil }` |

`sheet` is the dialog `id`. The dialog's native `toggle` event follows the state.

---

## 9. Public API

| Name | Description |
| ---- | ----------- |
| `init()` / `destroy()` | Bind and unbind listeners |
| `show()` | Request open, resolves `true` when committed |
| `close(returnValue?)` | Request close, resolves `true` when committed |
| `trigger` | Button that last requested open |
| `dismissible` | Whether a handle pull may close |
| `$dialog`, `$handle` | DOM refs |

---

## 10. Package layout

```
packages/sheet/
  SPEC.md
  src/
    index.ts
    sheet.ts
    sheet.test.ts
    types.ts
    plugin.ts
    sheet.html.liquid
```

---

## 11. Acceptance criteria

- [x] Opens and closes with invoker commands, `aria-expanded` native on popover triggers
- [x] Escape, backdrop and drag follow the dialog `closedby`, none of them close with `closedby="none"`
- [x] Before-events can veto and defer with `waitUntil()`
- [x] A pull up on an opening button opens the sheet and keeps it open
- [x] `data-replace` opens the next sheet in place of the current one
- [x] Tested in Chromium, Firefox and WebKit
- [x] README and docs aligned with this spec
