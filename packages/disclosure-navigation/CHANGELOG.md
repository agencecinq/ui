# @agencecinq/disclosure-navigation

## 3.1.2

### Patch Changes

- f65565b: Point the npm homepage to the package docs on agencecinq.github.io/ui, instead of the repository README.
- Updated dependencies [f65565b]
  - @agencecinq/utils@11.0.2

## 3.1.1

### Patch Changes

- Updated dependencies [ff4db3c]
  - @agencecinq/utils@11.0.0

## 3.1.0

### Minor Changes

- e3a32bb: - Move the arrow, Home and End keys onto `focusByKey()` from `@agencecinq/utils`, the keyboard the accordion and the tabs now share. The keys behave as before.
  - `@agencecinq/utils` becomes a dependency, imported rather than bundled: a page built with a bundler gets it with the package, a page without one maps it in its import map.

### Patch Changes

- Updated dependencies [0508d43]
- Updated dependencies [2043c18]
  - @agencecinq/utils@10.0.0

## 3.0.0

### Major Changes

- 41cde32: - Move the arrow keys through the visible items of a submenu in reading order, as Tab does, open nested submenus included: Enter on a nested button opens its submenu and ArrowDown moves into it, at every level, whatever the layout. Up and Down now move through the same items, and Home and End reach the first and last visible ones. See the README migration from 2.x.

## 2.0.0

### Major Changes

- bf121ad: - Keep ArrowDown at the level of a submenu: on an expanded button in a submenu, it moved into the nested submenu while ArrowUp went to the previous item, and now goes to the next item, whatever the layout of the nested submenu. Tab still moves into it, and Escape back to its button. ArrowDown on an expanded top-level button moves into its submenu, as in the APG example. See the README migration from 1.x.

## 1.0.0

### Major Changes

- 0a8a1cc: - Add `@agencecinq/disclosure-navigation`, the `<cinq-disclosure-navigation>` Web Component ported from `@19h47/disclosure-navigation` 5.0: buttons open their submenus, one branch at a time, nested ones included, with the APG keyboard support, `hidden="until-found"` and the platform's `beforetoggle` and `toggle` events, fired as popovers do. No dependency.
  - Open the submenus on hover with `data-hover`, for a mouse only. The first click after the hover keeps the submenu open, and Escape closes it wherever the focus is (WCAG 1.4.13).
  - Close the open submenus on Escape outside the navigation too, without canceling the key, so a submenu opened by a click in Safari, which does not focus the button, closes as well.
  - Replace `useArrowKeys = false` with `data-arrow-keys="false"` on the host. See the README migration from `@19h47/disclosure-navigation` and from several `<cinq-disclosure-button>`.
