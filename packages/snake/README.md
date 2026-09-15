[![](https://img.shields.io/npm/v/@agencecinq/snake)](https://www.npmjs.com/package/@agencecinq/snake)
[![](https://img.shields.io/npm/dm/@agencecinq/snake)](https://www.npmjs.com/package/@agencecinq/snake)

# @agencecinq/snake

> Canvas Snake as a lightweight Web Component.

`<cinq-snake>` runs the game loop and draws square cells into a consumer-owned
`<canvas>`. Score, overlay, replay UI, layout, and colors stay in your page.

## Installation

```bash
pnpm add @agencecinq/snake
```

## Usage

### Web Component (`<cinq-snake>`)

```html
<cinq-snake cols="21" rows="15">
  <p>Score <span data-score aria-live="polite">0</span></p>
  <div class="snake-stage">
    <canvas tabindex="0" aria-label="Snake. Arrow keys to move."></canvas>
    <div data-overlay hidden>
      <p data-status>Game over</p>
      <button type="button" data-replay>Play again</button>
    </div>
  </div>
</cinq-snake>
```

```js
import "@agencecinq/snake";
```

Importing `@agencecinq/snake` registers the Web Component automatically.
No manual `init()` call required.

> **HTML is the source of truth.** The component will not auto-set `role`,
> auto-migrate attributes, or warn about missing labels. Use an a11y linter
> (axe-core, Lighthouse) to catch invalid markup.

The `[data-score]` span, overlay, and replay button are yours. The host does
not query them or write to them.

### Required markup

| Attribute / element | Required | Role |
| ------------------- | -------- | ---- |
| `<cinq-snake>` | **Yes** | Host. Observes `cols` and `rows`. |
| `<canvas>` | **Yes** | Playfield. One canvas per host. Give it `tabindex="0"` so arrow keys reach it. |

### Layout and color

Size the canvas yourself. Use `width: 100%` and `aspect-ratio: 21 / 15`
(or `cols / rows`) for square tiles. After the canvas box changes, call
`sync()` (a `ResizeObserver` on the canvas is enough).

Ink follows the canvas CSS `color` (inherited). `background-color` and any
frame (`border`, `outline`, etc.) are yours. The component clears the bitmap
each frame so that fill shows through. If CSS `color` is missing, the package
falls back to `#2a2a2a`.

The component does not ship CSS.

```css
cinq-snake {
  display: block;
}

cinq-snake canvas {
  display: block;
  width: 100%;
  height: auto;
  aspect-ratio: 21 / 15;
  touch-action: none;
  image-rendering: pixelated;
  background-color: #c5d0b8;
  color: #2a2a2a;
}

cinq-snake canvas:focus-visible {
  outline: 2px solid currentColor;
  outline-offset: 4px;
}
```

### Attributes

| Attribute | Default | Description |
| --------- | ------- | ----------- |
| `cols` | `21` | Horizontal cell count. Observed. Resets the board when it changes. |
| `rows` | `15` | Vertical cell count. Observed. Resets the board when it changes. |

Changing `cols` or `rows` also dispatches `snake:replay`.

### API

```js
const $host = document.querySelector("cinq-snake");

$host.init();
$host.sync();
$host.replay();
$host.destroy();
$host.score;
$host.cols;
$host.rows;
$host.$canvas;
```

Call `destroy()` before `init()` if the host is already bound and you mutated
the light DOM.

### Keyboard

| Key | Function |
| --- | --- |
| Arrow keys | Turn. 180-degree reverses are ignored. The first arrow starts the game. |
| Enter or Space | After a collision, start again (when the canvas still holds focus). |

On a touch screen, swipe on the board to turn.

### Events

Dispatched on the host `<cinq-snake>` (bubble, not cancelable). Prefer
constants from `@agencecinq/utils`:

| Event | Constant | Detail | When |
| ----- | -------- | ------ | ---- |
| `snake:eat` | `SNAKE_EAT` | `{ score }` | After food |
| `snake:over` | `SNAKE_OVER` | `{ score }` | After a wall or self hit |
| `snake:replay` | `SNAKE_REPLAY` | `{ score }` | After `replay()`, or after `cols` / `rows` change |

```js
import { EVENTS } from "@agencecinq/utils";

const $host = document.querySelector("cinq-snake");
const $score = $host.querySelector("[data-score]");
const $overlay = $host.querySelector("[data-overlay]");
const $replay = $host.querySelector("[data-replay]");

$host.addEventListener(EVENTS.SNAKE_EAT, (event) => {
  $score.textContent = String(event.detail.score);
});

$host.addEventListener(EVENTS.SNAKE_OVER, () => {
  $overlay.hidden = false;
  $replay.focus();
});

$host.addEventListener(EVENTS.SNAKE_REPLAY, (event) => {
  $overlay.hidden = true;
  $score.textContent = String(event.detail.score);
});

$replay.addEventListener("click", () => {
  $host.replay();
});
```

## Build setup

```bash
pnpm -C packages/snake build
```

## Acknowledgments

See the [interactive docs](https://agencecinq.github.io/ui/components/snake/) for live examples.
