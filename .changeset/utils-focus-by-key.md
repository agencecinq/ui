---
"@agencecinq/utils": minor
---

- Add `focusByKey(event, elements, index)`, from `@agencecinq/disclosure-navigation`: the arrow, Home and End keys move focus between `elements`, wrapping, with left and right swapped in a right-to-left context and the keys pressed with a modifier left to the browser. It returns the index of the element that took the focus, so the accordion, the tabs and the disclosure navigation share one keyboard.
