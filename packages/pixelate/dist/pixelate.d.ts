/**
 * Wraps an `<img>` and sibling `<canvas>`. Reads `pixel` (`0`–`256`).
 * At `0` the image is sharp; higher values increase block size.
 * Canvas crop is always centered `cover`.
 */
export declare class Pixelate extends HTMLElement {
    #private;
    static observedAttributes: string[];
    $img: HTMLImageElement | null;
    $canvas: HTMLCanvasElement | null;
    connectedCallback(): void;
    disconnectedCallback(): void;
    attributeChangedCallback(name: string, _oldValue: string | null, _newValue: string | null): void;
    /**
     * Bind markup + listeners. Call {@link destroy} first if already bound.
     */
    init(): void;
    /** Detaches listeners. Safe to call from outside while the host stays mounted. */
    destroy(): void;
    /** Re-read `pixel` and redraw. */
    sync(): void;
}
//# sourceMappingURL=pixelate.d.ts.map