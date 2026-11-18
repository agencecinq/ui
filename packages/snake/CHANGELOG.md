# @agencecinq/snake

## 1.1.0

### Minor Changes

- Read the swipe with `trackDrag()` from `@agencecinq/utils`: a press focuses the board, and a swipe of at least 24 px turns the snake toward its dominant axis. Requires `@agencecinq/utils` >= 9.1.1.
- Only the primary button swipes: a drag with the right button no longer turns the snake.
- Test the swipes in Chromium, Firefox and WebKit.

## 1.0.0

### Major Changes

- Initial public release of `<cinq-snake>`. Canvas Snake with a requestAnimationFrame loop, observed `cols` / `rows`, and consumer-owned score overlay.
