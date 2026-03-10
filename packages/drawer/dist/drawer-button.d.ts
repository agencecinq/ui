export declare class DrawerButton extends HTMLElement {
    controls: string[];
    $button: HTMLButtonElement | null;
    constructor();
    connectedCallback(): void;
    handleClick: () => void;
    /**
     * Handles the drawer close event.
     *
     * @param event - The custom event containing the drawer information.
     */
    handleDrawerClose: (event: CustomEvent<{
        drawer: string;
    }>) => void;
    /**
     * Handles the drawer open event.
     *
     * @param event - The custom event containing the drawer information.
     */
    handleDrawerOpen: (event: CustomEvent<{
        drawer: string;
    }>) => void;
    disconnectedCallback(): void;
}
//# sourceMappingURL=drawer-button.d.ts.map