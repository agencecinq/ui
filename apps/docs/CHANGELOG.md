# @agencecinq/docs

## 4.4.5

### Patch Changes

- 8cb9b80: Replace boolean `single` with `mode="single|range|multiple"` on `<cinq-calendar>`. Document and demo multiple dates in the docs playground.
- Updated dependencies [8cb9b80]
- Updated dependencies [8cb9b80]
  - @agencecinq/accordion@2.0.0
  - @agencecinq/calendar@2.0.0

## 4.4.4

### Patch Changes

- 1f15fe4: Add `@agencecinq/calendar` with `<cinq-calendar>` Web Component for single-date and range selection (ported from `@19h47/calendar`). Export `CALENDAR_CHANGE` from `@agencecinq/utils`. Add calendar docs page and live playgrounds.
- Updated dependencies [1f15fe4]
  - @agencecinq/calendar@1.0.0
  - @agencecinq/utils@5.2.1
  - @agencecinq/accordion@1.0.3
  - @agencecinq/combobox@1.0.3
  - @agencecinq/disclosure-button@2.0.0
  - @agencecinq/drawer@5.0.3
  - @agencecinq/modal@2.0.3
  - @agencecinq/spinbutton@1.0.4
  - @agencecinq/switch@2.0.1
  - @agencecinq/tabs@10.0.3
  - @agencecinq/windowsplitter@2.0.0

## 4.4.3

### Patch Changes

- Updated dependencies [ec6a727]
- Updated dependencies [ec6a727]
  - @agencecinq/utils@5.2.0
  - @agencecinq/combobox@1.0.3
  - @agencecinq/accordion@1.0.3
  - @agencecinq/spinbutton@1.0.4
  - @agencecinq/windowsplitter@2.0.0
  - @agencecinq/disclosure-button@2.0.0
  - @agencecinq/drawer@5.0.3
  - @agencecinq/modal@2.0.3
  - @agencecinq/switch@2.0.1
  - @agencecinq/tabs@10.0.3

## 4.4.2

### Patch Changes

- Updated dependencies [264c92a]
  - @agencecinq/accordion@1.0.2
  - @agencecinq/tabs@10.0.3
  - @agencecinq/windowsplitter@1.0.2
  - @agencecinq/modal@2.0.3
  - @agencecinq/drawer@5.0.3
  - @agencecinq/combobox@1.0.2
  - @agencecinq/utils@5.1.1
  - @agencecinq/disclosure-button@2.0.0
  - @agencecinq/spinbutton@1.0.3
  - @agencecinq/switch@2.0.1

## 4.4.1

### Patch Changes

- Updated dependencies [2e12ffb]
  - @agencecinq/utils@5.1.0
  - @agencecinq/disclosure-button@2.0.0
  - @agencecinq/accordion@1.0.1
  - @agencecinq/tabs@10.0.2
  - @agencecinq/switch@2.0.1
  - @agencecinq/drawer@5.0.2
  - @agencecinq/modal@2.0.2
  - @agencecinq/combobox@1.0.1
  - @agencecinq/spinbutton@1.0.3
  - @agencecinq/windowsplitter@1.0.1

## 4.4.0

### Minor Changes

- Add `@agencecinq/windowsplitter` with `<cinq-windowsplitter>` Web Component for accessible pane resizing (resize/clip/none modes, keyboard + pointer, collapse/restore). Export `WINDOWSPLITTER_CHANGE` from `@agencecinq/utils`. Add window splitter docs page and live playground.

### Patch Changes

- Updated dependencies
  - @agencecinq/windowsplitter@1.0.0
  - @agencecinq/utils@5.0.6
  - @agencecinq/accordion@1.0.0
  - @agencecinq/combobox@1.0.0
  - @agencecinq/disclosure-button@1.1.1
  - @agencecinq/drawer@5.0.1
  - @agencecinq/modal@2.0.1
  - @agencecinq/spinbutton@1.0.2
  - @agencecinq/switch@2.0.0
  - @agencecinq/tabs@10.0.1

## 4.3.0

### Minor Changes

- Add `@agencecinq/combobox` with `<cinq-combobox>` Web Component for editable list autocomplete (managed and external modes, async search with AbortSignal, host events). Export `COMBOBOX_LOADING`, `COMBOBOX_LOADED`, `COMBOBOX_UPDATE`, `COMBOBOX_SUBMIT`, and `COMBOBOX_EMPTY` from `@agencecinq/utils`. Add combobox docs page and live playground.

### Patch Changes

- Updated dependencies
  - @agencecinq/combobox@1.0.0
  - @agencecinq/utils@5.0.5
  - @agencecinq/accordion@1.0.0
  - @agencecinq/disclosure-button@1.1.1
  - @agencecinq/drawer@5.0.1
  - @agencecinq/modal@2.0.1
  - @agencecinq/spinbutton@1.0.2
  - @agencecinq/switch@2.0.0
  - @agencecinq/tabs@10.0.1

## 4.2.0

### Minor Changes

- Add `@agencecinq/accordion` with `<cinq-accordion>` Web Component, panel open/close API, keyboard navigation, and hash support. Export `ACCORDION_PANEL_OPEN` and `ACCORDION_PANEL_CLOSE` from `@agencecinq/utils`. Harmonise component docs around HTML as source of truth and AD&D 2nd Edition playground examples. Fix RegisterComponents custom-element display rules so Tailwind layout utilities apply on spinbuttons.

### Patch Changes

- Updated dependencies
  - @agencecinq/accordion@1.0.0
  - @agencecinq/utils@5.0.4
  - @agencecinq/disclosure-button@1.1.1
  - @agencecinq/drawer@5.0.1
  - @agencecinq/modal@2.0.1
  - @agencecinq/spinbutton@1.0.2
  - @agencecinq/switch@2.0.0
  - @agencecinq/tabs@10.0.1

## 4.1.0

### Minor Changes

- Add `@agencecinq/switch` Web Component (`<cinq-switch>`) with activate/deactivate/toggle API, WAI-ARIA switch pattern support, and interactive docs playground. Export `SWITCH_ACTIVATE` and `SWITCH_DEACTIVATE` from `@agencecinq/utils`. Align disclosure-button event handlers to `handle*` naming convention.

### Patch Changes

- Updated dependencies
  - @agencecinq/switch@2.0.0
  - @agencecinq/utils@5.0.3
  - @agencecinq/disclosure-button@1.1.1
  - @agencecinq/drawer@5.0.1
  - @agencecinq/modal@2.0.1
  - @agencecinq/spinbutton@1.0.2
  - @agencecinq/tabs@10.0.1

## 4.0.3

### Patch Changes

- Updated dependencies [e5e3c14]
  - @agencecinq/disclosure-button@1.1.0

## 4.0.2

### Patch Changes

- Updated dependencies
  - @agencecinq/disclosure-button@1.0.0
  - @agencecinq/utils@5.0.2
  - @agencecinq/drawer@5.0.1
  - @agencecinq/modal@2.0.1
  - @agencecinq/spinbutton@1.0.2
  - @agencecinq/tabs@10.0.1

## 4.0.1

### Patch Changes

- Updated dependencies
  - @agencecinq/spinbutton@1.0.2

## 4.0.0

### Major Changes

- 3594668: Spinbutton package

### Patch Changes

- Updated dependencies [3594668]
  - @agencecinq/utils@5.0.0
  - @agencecinq/spinbutton@1.0.0
  - @agencecinq/tabs@10.0.0
  - @agencecinq/drawer@5.0.0
  - @agencecinq/modal@2.0.0

## 3.6.3

### Patch Changes

- Updated dependencies
  - @agencecinq/utils@4.0.2
  - @agencecinq/drawer@4.1.3
  - @agencecinq/modal@1.1.0

## 3.6.2

### Patch Changes

- Updated dependencies
- Updated dependencies [5000b68]
  - @agencecinq/utils@4.0.1
  - @agencecinq/drawer@4.1.3
  - @agencecinq/modal@1.1.0

## 3.6.1

### Patch Changes

- y
- Updated dependencies
  - @agencecinq/drawer@4.1.1
  - @agencecinq/tabs@9.3.1
