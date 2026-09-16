# @agencecinq/toast

## 1.0.0

### Major Changes

- Initial release: `<cinq-toast>` live-region toast (show / close / toggle).
  Consumer sets `role="alert"` or `role="status"`. Opt-in auto-dismiss via
  `data-duration` and `--toast-progress`. Pause / resume is consumer-owned
  (`pause()` / `resume()`). Events: `toast:open` / `toast:close` via
  `@agencecinq/utils`.
