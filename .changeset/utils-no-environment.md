---
"@agencecinq/utils": major
---

- Remove the environment exports `html`, `body`, `isDebug`, `scroll`, `mouse`, `breakpoints` and `production`, with the `pointermove` listener and the media queries they set up on import (see the README migration from 9.x).
- Declare `"sideEffects": false`: the package does nothing on import, so a bundler keeps only what a page imports.
