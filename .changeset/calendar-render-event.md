---
"@agencecinq/calendar": major
---

`renderInner()` is gone: decorate the days on the new `calendar:render` event instead. It bubbles from the host after each render, once the cells carry their state, with the month on screen as `{ year, month }` in `detail`.
