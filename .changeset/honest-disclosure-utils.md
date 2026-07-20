---
"@agencecinq/utils": minor
"@agencecinq/disclosure-button": major
"@agencecinq/accordion": patch
"@agencecinq/tabs": patch
"@agencecinq/switch": patch
"@agencecinq/drawer": patch
"@agencecinq/modal": patch
"@agencecinq/combobox": patch
"@agencecinq/spinbutton": patch
"@agencecinq/windowsplitter": patch
---

Simplify disclosure-button around HTML source of truth and shared utils.

**@agencecinq/utils**
- Add `dispatchEvent` helper for cancelable `CustomEvent`s
- Add `parseList` for space-separated ARIA ID reference lists

**@agencecinq/disclosure-button** (breaking)
- Resolve targets via `Element.ariaControlsElements`
- `aria-expanded` is `true` while any controlled region is visible; click closes all if any remain open
- Add `update()` for external dismiss; drop automatic linked-trigger sync (app responsibility)
- Require a native inner `<button>` (no `[data-button]` escape hatch)
- Remove the `button` getter (`$button` remains)

**Consumers**
- Migrate to shared `dispatchEvent` / `parseList` from `@agencecinq/utils`
