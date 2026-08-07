export declare class ModalButton extends HTMLElement {
    #private;
    $button: HTMLButtonElement | null;
    /** Controlled modal element IDs from `ariaControlsElements`. */
    controls: string[];
    connectedCallback(): void;
    disconnectedCallback(): void;
    /**
     * Bind markup + listeners. Call {@link destroy} first if already bound.
     */
    init(): void;
    /** Detaches listeners. Safe to call from outside while the host stays mounted. */
    destroy(): void;
    show: () => void;
}
//# sourceMappingURL=modal-button.d.ts.map