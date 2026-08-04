export declare class DrawerButton extends HTMLElement {
    /** Controlled drawer identifiers from `ariaControlsElements`. */
    controls: string[];
    $button: HTMLButtonElement | null;
    private handleDrawerClose;
    private handleDrawerOpen;
    connectedCallback(): void;
    disconnectedCallback(): void;
    /**
     * Bind markup + listeners. Call {@link destroy} first if already bound.
     */
    init(): void;
    /** Detaches listeners. Safe to call from outside while the host stays mounted. */
    destroy(): void;
    handleClick: () => void;
}
//# sourceMappingURL=drawer-button.d.ts.map