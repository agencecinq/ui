export declare class Drawer extends HTMLElement {
    trigger: HTMLElement | null;
    trap: HTMLElement | null;
    private $overlay;
    /** Panel that runs the slide transition (fallback: host). */
    private $panel;
    constructor();
    static get observedAttributes(): string[];
    connectedCallback(): void;
    disconnectedCallback(): void;
    /**
     * Bind overlay + document listeners. Call {@link destroy} first if already bound.
     */
    init(): void;
    /**
     * Detaches listeners. Clears trap/scroll/inline styles if still open;
     * leaves the `open` attribute (HTML is source of truth).
     * Safe to call from outside while the host stays mounted.
     */
    destroy(): void;
    handleClick: () => boolean;
    handleKeyUp: (event: KeyboardEvent) => void;
    handleDrawerOpen: (event: CustomEvent) => void;
    handleDrawerToggle: (event: CustomEvent) => void;
    /**
     * Toggles the drawer between open and closed.
     *
     * @param trigger - Element that triggered the toggle, or null.
     * @param trap - Focus-trap root when open (defaults to the drawer).
     * @returns Whether the drawer is open after the toggle.
     */
    toggle({ trigger, trap, }: {
        trigger: HTMLElement | null;
        trap: HTMLElement | null;
    }): boolean;
    private onCloseTransitionEnd;
    open(): void;
    close(): void;
    attributeChangedCallback(name: string, _oldValue: string | null, newValue: string | null): void;
}
//# sourceMappingURL=drawer.d.ts.map