/**
 * Two columns inside a sized host, one inverted scroll with spring easing.
 * Markup supplies `[data-scroll-column="left"|"right"]` and stacked panes.
 */
export declare class DualScroll extends HTMLElement {
    #private;
    static observedAttributes: string[];
    connectedCallback(): void;
    disconnectedCallback(): void;
    attributeChangedCallback(name: string, _oldValue: string | null, _newValue: string | null): void;
    /**
     * Bind columns, listeners, and the animation loop.
     * Call {@link destroy} first if already bound.
     */
    init(): void;
    /** Detaches listeners and stops the animation loop. */
    destroy(): void;
    /** Re-measure the host and clamp the scroll target. */
    sync(): void;
}
//# sourceMappingURL=dual-scroll.d.ts.map