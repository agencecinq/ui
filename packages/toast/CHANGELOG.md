# @agencecinq/toast

## 1.1.0

### Minor Changes

- 40544f4: - Import `@agencecinq/utils` rather than bundle it, and list it in `dependencies` instead of `peerDependencies`: a page built with Vite or another bundler gets it with the component and loads one copy for all the components. A page without a bundler maps `@agencecinq/utils` in its import map.

### Patch Changes

- Updated dependencies [0508d43]
- Updated dependencies [2043c18]
  - @agencecinq/utils@10.0.0

## 1.0.0

### Major Changes

- Add `@agencecinq/toast` (`<cinq-toast>`) for live-region notifications. Consumer
  sets `role="alert"` or `role="status"`. Opt-in auto-dismiss via `data-duration`
  and `--toast-progress`. Pause / resume is consumer-owned (`pause()` /
  `resume()`). Events: `toast:open` / `toast:close` via `@agencecinq/utils`.
