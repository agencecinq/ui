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
     * Opens the modal. Dispatches cancelable `modal-before-open` with
     * `detail.resolve()` to commit after async work.
     *
     * @returns `false` if already open, still closed after abort, or waiting on `resolve()`.
     */
    show(): boolean;
    /**
     * Closes the modal. Dispatches cancelable `modal-before-close` with
     * `detail.resolve()` to commit after async work.
     *
     * @returns `false` if already closed, still open after abort, or waiting on `resolve()`.
     */
    close(): boolean;
    attributeChangedCallback(name: string, _oldValue: string | null, newValue: string | null): void;
}
//# sourceMappingURL=modal.d.ts.map