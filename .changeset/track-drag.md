---
"@agencecinq/utils": minor
"@agencecinq/sheet": minor
---

**@agencecinq/utils**

- Add `trackDrag(element, options)`: one pointer gesture at a time, with pointer capture, `[dragging]` on a host, and the distance and speed of the drag. The component decides what the values mean. Types: `DragOptions`, `DragValues`, `DragEndValues`, `DragTracker`.
- Publish `dist` only: the package no longer ships its sources and build files.

**@agencecinq/sheet**

- Follow the handle and the pull up to open with `trackDrag()`. Requires `@agencecinq/utils` >= 9.1.0.
- A drag the browser cancels now snaps back instead of being read as a release.
