# @agencecinq/toast

## 1.0.0

### Major Changes

- Add `@agencecinq/toast` (`<cinq-toast>`) for live-region notifications. Consumer
  sets `role="alert"` or `role="status"`. Opt-in auto-dismiss via `data-duration`
  and `--toast-progress`. Pause / resume is consumer-owned (`pause()` /
  `resume()`). Events: `toast:open` / `toast:close` via `@agencecinq/utils`.
