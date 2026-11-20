# @agencecinq/drilldown

## 1.4.1

### Patch Changes

- Updated dependencies [ff4db3c]
  - @agencecinq/utils@11.0.0

## 1.4.0

### Minor Changes

- 40544f4: - Import `@agencecinq/utils` rather than bundle it, and list it in `dependencies` instead of `peerDependencies`: a page built with Vite or another bundler gets it with the component and loads one copy for all the components. A page without a bundler maps `@agencecinq/utils` in its import map.

### Patch Changes

- Updated dependencies [0508d43]
- Updated dependencies [2043c18]
  - @agencecinq/utils@10.0.0

## 1.3.0

### Minor Changes

- cfc5003: Reflect `data-direction` on the host (`forward` when drilling in, `back` when going up) right before each panel change, so CSS can animate the panels. `closeAll()` removes it, so a reset is not animated. The README documents an `@starting-style` recipe.

## 1.2.0

### Minor Changes

- d446982: Focus the opened panel's `[data-autofocus]` element, so each panel can mark its target without repeating `autofocus`, which HTML allows once per page. `[autofocus]` still works.

## 1.1.0

### Minor Changes

- Focus the opened panel's `[autofocus]` element when there is one, and document panel announcement and accessibility guidance.

## 1.0.0

### Major Changes

- Add `@agencecinq/drilldown`, a drill-down navigation Web Component with nested panels and back buttons, plus `DRILLDOWN_*` event constants on `@agencecinq/utils`.
