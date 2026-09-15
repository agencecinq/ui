import { DrawState } from './types.js';
/**
 * Canvas 2D painter. The grid always covers the canvas box. Cell size is
 * `width / cols` by `height / rows`, so cells stretch with the box.
 */
export default class Renderer {
    #private;
    constructor($canvas: HTMLCanvasElement, context: CanvasRenderingContext2D);
    /**
     * Match the bitmap to the CSS size.
     * Call after layout changes, and before the first draw.
     */
    resize(): void;
    draw(state: DrawState, color: string): void;
}
//# sourceMappingURL=renderer.d.ts.map