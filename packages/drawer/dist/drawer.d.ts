export declare class Drawer extends HTMLElement {
    trigger: HTMLElement | null;
    trap: HTMLElement | null;
    constructor();
    get cid(): string | null;
    static get observedAttributes(): string[];
    connectedCallback(): void;
    /**
     * Handles the click event by toggling the drawer.
     */
    handleClick: () => boolean;
    /**
     * Handles the key up event for the drawer component.
     */
    handleKeyUp: (event: KeyboardEvent) => void;
    /**
     * Handles the opening of the drawer when a custom event is triggered.
     */
    handleDrawerOpen: (event: CustomEvent) => void;
    handleDrawerToggle: (event: CustomEvent) => void;
    /**
       * Toggles the state of the drawer between open and closed.
       *
       * @param trigger - The HTML element that triggered the toggle action, or null.
       * @param trap - The HTML element that will be used as a focus trap when the drawer is open, or null. Will default to the drawer itself.
       *
       * @returns boolean - The new state of the drawer (open or closed).
       */
    toggle({ trigger, trap }: {
        trigger: HTMLElement | null;
        trap: HTMLElement | null;
    }): boolean;
    /**
     * Opens the drawer component.
     */
    open(): void;
    /**
     * Closes the drawer component.
     */
    close(): void;
    disconnectedCallback(): void;
    attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void;
}
//# sourceMappingURL=drawer.d.ts.map