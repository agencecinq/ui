export declare class ModalButton extends HTMLElement {
    private $button;
    /** Controlled modal element IDs from `ariaControlsElements`. */
    controls: string[];
    private handleModalClose;
    private handleModalOpen;
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