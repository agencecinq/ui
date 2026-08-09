# @agencecinq/calendar

## 3.0.0

### Major Changes

- b3c745e: Rename `data-picked-dates` to `data-picked` and simplify internal selection updates through `setPicked`.

## 2.0.1

### Patch Changes

- ddbd6be: Add cancelable `before-open` / `before-close` hooks with `detail.resolve()` to drawer and modal. Align modal on `open` attribute + ACC like drawer.

  **@agencecinq/utils:** `MODAL_*` / `DRAWER_*` before events; `scheduleRestoreReturnFocus`.

  **Docs:** async bestiary playground demos, pixelate sandbox hooks, UX note on defer vs in-panel loading.

  **Hosts:** `#` private fields and `init`/`destroy` lifecycle consistency (accordion, calendar, combobox, disclosure-button, switch, tabs, windowsplitter).

## 2.0.0

### Major Changes

- 8cb9b80: Replace boolean `single` with `mode="single|range|multiple"` on `<cinq-calendar>`. Document and demo multiple dates in the docs playground.

## 1.0.0

### Major Changes

- 1f15fe4: Add `@agencecinq/calendar` with `<cinq-calendar>` Web Component for single-date and range selection (ported from `@19h47/calendar`). Export `CALENDAR_CHANGE` from `@agencecinq/utils`. Add calendar docs page and live playgrounds.
