export declare class DrawerButton extends HTMLElement {
    #private;
    /** Controlled drawer identifiers from `ariaControlsElements`. */
    controls: string[];
    $button: HTMLButtonElement | null;
    connectedCallback(): void;
    disconnectedCallback(): void;
    /**
     * Bind markup + listeners. Call {@link destroy} first if already bound.
     */
    init(): void;
    /** Detaches listeners. Safe to call from outside while the host stays mounted. */
    destroy(): void;
}
//# sourceMappingURL=drawer-button.d.ts.map