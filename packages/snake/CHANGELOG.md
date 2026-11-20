# @agencecinq/snake

## 1.2.1

### Patch Changes

- Updated dependencies [ff4db3c]
  - @agencecinq/utils@11.0.0

## 1.2.0

### Minor Changes

- 40544f4: - Import `@agencecinq/utils` rather than bundle it, and list it in `dependencies` instead of `peerDependencies`: a page built with Vite or another bundler gets it with the component and loads one copy for all the components. A page without a bundler maps `@agencecinq/utils` in its import map.

### Patch Changes

- Updated dependencies [0508d43]
- Updated dependencies [2043c18]
  - @agencecinq/utils@10.0.0

## 1.1.0

### Minor Changes

- Read the swipe with `trackDrag()` from `@agencecinq/utils`: a press focuses the board, and a swipe of at least 24 px turns the snake toward its dominant axis. Requires `@agencecinq/utils` >= 9.1.1.
- Only the primary button swipes: a drag with the right button no longer turns the snake.
- Test the swipes in Chromium, Firefox and WebKit.

## 1.0.0

### Major Changes

- Initial public release of `<cinq-snake>`. Canvas Snake with a requestAnimationFrame loop, observed `cols` / `rows`, and consumer-owned score overlay.
