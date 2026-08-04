export declare class Modal extends HTMLElement {
    trigger: HTMLElement | null;
    private $modal;
    private handleClick;
    private handleModalToggle;
    constructor();
    connectedCallback(): void;
    disconnectedCallback(): void;
    /**
     * Bind dialog + listeners. Call {@link destroy} first if already bound.
     */
    init(): void;
    /** Detaches listeners. Safe to call from outside while the host stays mounted. */
    destroy(): void;
    close: () => void;
    show: () => void;
}
//# sourceMappingURL=modal.d.ts.map