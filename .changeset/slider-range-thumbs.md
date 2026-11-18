---
"@agencecinq/slider": major
---

- Range: map the pointer from the leading edge of the thumb, as the range geometry expects, so a press no longer moves the min thumb by half a thumb.
- Range: document thumbs that share a track two thumbs shorter than the host, side by side at equal values. Update the thumb and fill CSS and drop the `[data-collapsed]` offsets (see the README migration from 6.x).
