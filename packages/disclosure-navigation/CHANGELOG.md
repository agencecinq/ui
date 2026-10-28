# @agencecinq/disclosure-navigation

## 1.0.0

### Major Changes

- 0a8a1cc: - Add `@agencecinq/disclosure-navigation`, the `<cinq-disclosure-navigation>` Web Component ported from `@19h47/disclosure-navigation` 5.0: buttons open their submenus, one branch at a time, nested ones included, with the APG keyboard support, `hidden="until-found"` and the platform's `beforetoggle` and `toggle` events, fired as popovers do. No dependency.
  - Open the submenus on hover with `data-hover`, for a mouse only. The first click after the hover keeps the submenu open, and Escape closes it wherever the focus is (WCAG 1.4.13).
  - Close the open submenus on Escape outside the navigation too, without canceling the key, so a submenu opened by a click in Safari, which does not focus the button, closes as well.
  - Replace `useArrowKeys = false` with `data-arrow-keys="false"` on the host. See the README migration from `@19h47/disclosure-navigation` and from several `<cinq-disclosure-button>`.
