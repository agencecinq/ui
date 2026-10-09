export type { BeforeCloseDetail, BeforeOpenDetail } from './types.js';
export declare class Modal extends HTMLElement {
    #private;
    trigger: HTMLElement | null;
    $modal: HTMLDialogElement | null;
    constructor();
    static get observedAttributes(): string[];
    connectedCallback(): void;
    disconnectedCallback(): void;
    /**
     * Bind dialog + listeners. Call {@link destroy} first if already bound.
     */
    init(): void;
    /** Detaches listeners. Safe to call from outside while the host stays mounted. */
    destroy(): void;
    /**
     * Opens the modal. Dispatches cancelable `modal:before-open`: listeners
     * cancel with `preventDefault()` or defer with `detail.waitUntil(promise)`.
     *
     * @returns Whether this call opened the modal.
     */
    show(): Promise<boolean>;
    /**
     * Closes the modal. Dispatches cancelable `modal:before-close`: listeners
     * cancel with `preventDefault()` or defer with `detail.waitUntil(promise)`.
     *
     * @returns Whether this call closed the modal.
     */
    close(): Promise<boolean>;
    attributeChangedCallback(name: string, _oldValue: string | null, newValue: string | null): void;
}
//# sourceMappingURL=modal.d.ts.map