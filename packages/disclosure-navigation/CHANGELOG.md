# @agencecinq/disclosure-navigation

## 2.0.0

### Major Changes

- bf121ad: - Keep ArrowDown at the level of a submenu: on an expanded button in a submenu, it moved into the nested submenu while ArrowUp went to the previous item, and now goes to the next item, whatever the layout of the nested submenu. Tab still moves into it, and Escape back to its button. ArrowDown on an expanded top-level button moves into its submenu, as in the APG example. See the README migration from 1.x.

## 1.0.0

### Major Changes

- 0a8a1cc: - Add `@agencecinq/disclosure-navigation`, the `<cinq-disclosure-navigation>` Web Component ported from `@19h47/disclosure-navigation` 5.0: buttons open their submenus, one branch at a time, nested ones included, with the APG keyboard support, `hidden="until-found"` and the platform's `beforetoggle` and `toggle` events, fired as popovers do. No dependency.
  - Open the submenus on hover with `data-hover`, for a mouse only. The first click after the hover keeps the submenu open, and Escape closes it wherever the focus is (WCAG 1.4.13).
  - Close the open submenus on Escape outside the navigation too, without canceling the key, so a submenu opened by a click in Safari, which does not focus the button, closes as well.
  - Replace `useArrowKeys = false` with `data-arrow-keys="false"` on the host. See the README migration from `@19h47/disclosure-navigation` and from several `<cinq-disclosure-button>`.
