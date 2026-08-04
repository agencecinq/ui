---
"@agencecinq/utils": minor
"@agencecinq/drawer": patch
"@agencecinq/modal": major
---

Shared return-focus helpers in utils; drawer exclusive restore fix; modal APG stack alignment.

**@agencecinq/utils**

- Add `rememberReturnFocus` / `restoreReturnFocus` (first-wins overlay session)
- Rename internal `focus-trap` module to `focus` (public named exports unchanged)

**@agencecinq/drawer**

- Use shared return-focus helpers instead of restoring via `removeTrapFocus(trigger)`
- Defer restore on close so exclusive multi-toggle keeps the original page opener

**@agencecinq/modal** (breaking)

- Require `id`; expose public `init` / `destroy`
- Stacked native `showModal()` (no exclusive auto-close); scroll lock is consumer-owned
- `modal-open` / `modal-close` payloads include `modal` id; buttons sync `aria-pressed` by id
