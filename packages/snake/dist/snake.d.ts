/**
 * Canvas Snake host. Markup in light DOM is the source of truth.
 *
 * Required: a `<canvas>`. Ink follows the canvas CSS `color` (inherited).
 * The playfield fill and any frame are consumer CSS on the canvas.
 * `cols` and `rows` (defaults {@link COLS} / {@link ROWS}). Changing them
 * resets the board. Score, overlay, and replay UI stay in the consumer.
 * Listen for `snake:eat`, `snake:over`, and `snake:replay`, and call
 * {@link replay}.
 */
export declare class Snake extends HTMLElement {
    #private;
    static observedAttributes: string[];
    $canvas: HTMLCanvasElement | null;
    connectedCallback(): void;
    disconnectedCallback(): void;
    attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void;
    /** Bind markup + listeners. Call {@link destroy} first if already bound. */
    init(): void;
    /** Detaches listeners and stops the animation loop. */
    destroy(): void;
    /** Re-measure the canvas bitmap. Call after layout changes. */
    sync(): void;
    /** Reset the board and run the loop again. */
    replay(): void;
    get score(): number;
    get cols(): number;
    get rows(): number;
}
//# sourceMappingURL=snake.d.ts.map