/**
 * Drop zone Web Component: files dragged onto the host go to a native file
 * input, as if picked in the browser dialog.
 *
 * The input stays the source of truth (`accept`, `multiple`, `disabled`, form
 * submission). It lives inside the host, or anywhere in the document when a
 * `<label for>` inside the host points to it (e.g. an input that must stay in
 * its form). Clicking the label opens the native picker, no script involved.
 */
export declare class Dropzone extends HTMLElement {
    #private;
    $label: HTMLLabelElement | null;
    $input: HTMLInputElement | null;
    connectedCallback(): void;
    disconnectedCallback(): void;
    /** Bind markup + listeners. Call {@link destroy} first if already bound. */
    init(): void;
    /** Detaches listeners. */
    destroy(): void;
    /** Largest file in bytes from `data-max-size`. `0` means no limit. */
    get maxSize(): number;
    /** Files held by the input. */
    get files(): File[];
    /** Empties the input, then dispatches `change` like a user would. */
    clear(): void;
}
//# sourceMappingURL=dropzone.d.ts.map