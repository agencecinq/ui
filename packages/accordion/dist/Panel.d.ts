/**
 * Accordion panel controller.
 *
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/accordion/
 */
export declare class Panel {
    el: HTMLElement;
    $body: HTMLElement | null;
    $button: HTMLButtonElement | null;
    $inner: HTMLElement | null;
    index: number;
    isDeselect: boolean;
    isOpen: boolean;
    height: number;
    transitionDuration: number;
    private rafId;
    private timeoutId;
    constructor(el: HTMLElement, index: number);
    init(): void;
    get open(): boolean;
    openPanel(emit?: boolean): boolean;
    close(emit?: boolean): boolean;
    toggle(): boolean;
    focus(): void;
    destroy(): void;
    private clearAnimation;
    private handleClick;
    private handleFocus;
    private handleBlur;
    private resize;
    private get detail();
}
//# sourceMappingURL=Panel.d.ts.map