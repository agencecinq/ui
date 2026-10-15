# @agencecinq/drilldown

## 1.2.0

### Minor Changes

- d446982: Focus the opened panel's `[data-autofocus]` element, so each panel can mark its target without repeating `autofocus`, which HTML allows once per page. `[autofocus]` still works.

## 1.1.0

### Minor Changes

- Focus the opened panel's `[autofocus]` element when there is one, and document panel announcement and accessibility guidance.

## 1.0.0

### Major Changes

- Add `@agencecinq/drilldown`, a drill-down navigation Web Component with nested panels and back buttons, plus `DRILLDOWN_*` event constants on `@agencecinq/utils`.
