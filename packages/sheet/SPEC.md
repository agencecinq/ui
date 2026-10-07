# `@agencecinq/sheet` Specification

> Bottom sheet Web Component on native `<dialog>`.

**Status:** v1
**Target APG:** [Dialog (Modal)](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)
**Design reference:** Zhiggie, Sticky add to cart mobile (Figma node `51:6472`)

---

## 1. Goals

### In scope

- Present a native `<dialog>` from the bottom edge
- Open height follows content
- Optional drag handle: pull down to dismiss, snap back otherwise
- Cancelable before-open / before-close with async `resolve()`
- Modal (`showModal()`) by default, modeless (`show()`) on demand
- Exclusive close among modal sheets

### Out of scope (v1)

- Other edges (`direction`)
- Detents and snap points
- Sheet following the finger while pulling up to open
- Drag from content
- Positioning, motion and reduced motion (consumer CSS)
- Scroll lock (consumer CSS)
- Polyfills (latest browsers only)

### Non-goals (relation to existing packages)

| Package | Pattern | Why not this package |
| ------- | ------- | -------------------- |
| `@agencecinq/modal` | Centered dialog | No edge anchoring, no drag |
| `@agencecinq/drawer` | Side panel with overlay element | Custom overlay, side edges |

---

## 2. Custom elements

| Item | Value |
| ---- | ----- |
| Tags | `cinq-sheet`, `cinq-sheet-button` |
| Package | `@agencecinq/sheet` |
| Import | `import "@agencecinq/sheet"` |

---

## 3. Markup contract

### 3.1 Structure

```html
<cinq-sheet-button>
  <button aria-controls="loot-sheet" aria-expanded="false">Open</button>
</cinq-sheet-button>

<cinq-sheet id="loot-sheet">
  <dialog aria-labelledby="loot-title" closedby="any">
    <div data-dom="drag-indicator"></div>
    <h2 id="loot-title">Loot</h2>
  </dialog>
</cinq-sheet>
```

### 3.2 Required attributes / elements

| Selector / attribute | Required | Role |
| -------------------- | -------- | ---- |
| `cinq-sheet[id]` | Yes | Matched by `aria-controls` |
| `dialog` | Yes | The panel |
| `[data-dom="drag-indicator"]` | No | Drag handle, inside the dialog |
| `cinq-sheet-button > button[aria-controls]` | Yes for buttons | Trigger |

### 3.3 What the component writes at runtime

| Target | Attributes / properties |
| ------ | ----------------------- |
| Host | `open`, `dragging`, `--cinq-sheet-drag-offset` |
| `dialog` | native `open` |
| Trigger `button` | `aria-expanded` |

### 3.4 HTML is the source of truth

The component does not invent roles, labels or classes.

---

## 4. Host options

| Attribute | Type | Default | Description |
| --------- | ---- | ------- | ----------- |
| `open` | boolean | absent | Reflected state |
| `data-modal` | `"false"` | modal | `false` opens with `show()` |

`data-modal` is read on open. Changing it while open applies on the next open.

Dismissal is the native `closedby` attribute on the `<dialog>`, written by the
consumer. The component reads it once more for the handle: `closedby="none"`
also disables drag dismiss.

| `closedby` | Escape | Backdrop press | Handle pull |
| ---------- | ------ | -------------- | ----------- |
| `any` | Yes | Yes | Yes |
| `closerequest` | Yes | No | Yes |
| absent | Modal only | No | Yes |
| `none` | No | No | No |

---

## 5. Interaction

### Keyboard

| Key | Function |
| --- | -------- |
| Escape | Closes unless `closedby="none"` (non-modal needs an explicit `closedby`) |
| Tab | Native modal dialog containment |

### Pointer

- Backdrop press closes a modal sheet with `closedby="any"`
- Button pull: a `cinq-sheet-button` opens its closed sheet on a pull up past 40 px or an upward flick. A tap toggles through the native click, a short pull does nothing
- Handle drag: offset follows the pointer downward, damped (square root) upward. Release past 80 px or with a downward flick closes, otherwise snaps back
- Focus on open and restore on close are native `<dialog>` behaviors

---

## 6. Consumer styling and accessibility

- Anchor the dialog: `fixed inset-x-0 top-auto bottom-0 m-0`. A small overhang (`-bottom-4 pb-4`) hides the bottom edge during spring motion
- Cap height with `max-height`
- Apply `--cinq-sheet-drag-offset` as a `translate`, drop the transition under `[dragging]`
- Enter and exit motion with `@starting-style` and `transition-behavior: allow-discrete`
- `prefers-reduced-motion` handled by the consumer
- `touch-action: none` on the handle so touch drags are not eaten by scroll
- Hide the handle from assistive tech (`aria-hidden="true"`)
- `:focus-visible` on interactive content

---

## 7. Styling hooks

| Hook | When |
| ---- | ---- |
| `cinq-sheet[open]` | Open |
| `cinq-sheet[dragging]` | Pointer drag in progress |
| `--cinq-sheet-drag-offset` | Drag distance in px, negative upward, unset at rest |
| `dialog::backdrop` | Scrim (modal only) |

---

## 8. Events

Dispatched on `document.documentElement`, not bubbling.

| Event | Constant | Cancelable | Detail |
| ----- | -------- | ---------- | ------ |
| `sheet:toggle` | `SHEET_TOGGLE` | No | `{ sheet, trigger }` |
| `sheet:before-open` | `SHEET_BEFORE_OPEN` | Yes | `{ sheet, instance, trigger, resolve }` |
| `sheet:before-close` | `SHEET_BEFORE_CLOSE` | Yes | `{ sheet, instance, resolve }` |
| `sheet:open` | `SHEET_OPEN` | No | `{ sheet, trigger }` |
| `sheet:close` | `SHEET_CLOSE` | No | `{ sheet }` |

---

## 9. Public API

| Name | Description |
| ---- | ----------- |
| `init()` / `destroy()` | Bind and unbind listeners |
| `open(trigger?)` | Request open, returns `true` when committed |
| `close()` | Request close, returns `true` when committed |
| `toggle(trigger?)` | Open or close, returns whether the sheet is open |
| `trigger` | Element that last requested open |
| `$dialog`, `$handle` | DOM refs |

---

## 10. Package layout

```
packages/sheet/
  SPEC.md
  src/
    index.ts
    sheet.ts
    sheet-button.ts
    types.ts
    plugin.ts
    sheet.html.liquid
```

---

## 11. Acceptance criteria

- [ ] Opens from a `cinq-sheet-button`, `aria-expanded` follows
- [ ] Escape, backdrop and drag follow the dialog `closedby`, none of them close with `closedby="none"`
- [ ] Before-events can veto and defer with `resolve()`
- [ ] Opening a modal sheet closes the other open modal sheet
- [ ] README and docs aligned with this spec
