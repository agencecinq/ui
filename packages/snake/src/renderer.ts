import type { DrawState } from "./types.js";

interface Layout {
  width: number;
  height: number;
  cols: number;
  rows: number;
}

/**
 * Canvas 2D painter. The grid always covers the canvas box. Cell size is
 * `width / cols` by `height / rows`, so cells stretch with the box.
 */
export default class Renderer {
  #$canvas: HTMLCanvasElement;
  #context: CanvasRenderingContext2D;

  constructor($canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) {
    this.#$canvas = $canvas;
    this.#context = context;
  }

  /**
   * Match the bitmap to the CSS size.
   * Call after layout changes, and before the first draw.
   */
  resize(): void {
    const { clientWidth: width, clientHeight: height } = this.#$canvas;

    if (width === 0 || height === 0) {
      return;
    }

    const dpr = window.devicePixelRatio || 1;
    const bufferWidth = Math.round(width * dpr);
    const bufferHeight = Math.round(height * dpr);

    if (
      this.#$canvas.width !== bufferWidth ||
      this.#$canvas.height !== bufferHeight
    ) {
      this.#$canvas.width = bufferWidth;
      this.#$canvas.height = bufferHeight;
    }

    this.#context.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  draw(state: DrawState, color: string): void {
    const layout = this.#fit(state.cols, state.rows);

    if (!layout) {
      return;
    }

    const { width, height } = layout;
    const ctx = this.#context;

    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, width, height);

    for (const part of state.snake) {
      this.#fillCell(part.x, part.y, layout, color, 0.12);
    }

    this.#fillCell(state.food.x, state.food.y, layout, color, 0.32);
  }

  #fit(cols: number, rows: number): Layout | null {
    const { clientWidth: width, clientHeight: height } = this.#$canvas;

    if (width === 0 || height === 0) {
      return null;
    }

    return { width, height, cols, rows };
  }

  /**
   * Map a grid cell onto the canvas so columns share `width` exactly and
   * rows share `height` exactly (no leftover gutter).
   */
  #fillCell(
    gridX: number,
    gridY: number,
    layout: Layout,
    color: string,
    insetRatio: number,
  ): void {
    const { width, height, cols, rows } = layout;
    const x = (gridX * width) / cols;
    const y = (gridY * height) / rows;
    const w = ((gridX + 1) * width) / cols - x;
    const h = ((gridY + 1) * height) / rows - y;
    const inset = Math.max(
      1,
      Math.round(Math.min(w, h) * insetRatio),
    );
    const innerW = w - inset * 2;
    const innerH = h - inset * 2;

    if (innerW <= 0 || innerH <= 0) {
      return;
    }

    this.#context.fillStyle = color;
    this.#context.fillRect(x + inset, y + inset, innerW, innerH);
  }
}
