/**
 * Accordion panel controller.
 *
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/accordion/
 */
export declare class Panel {
    #private;
    el: HTMLElement;
    $body: HTMLElement | null;
    $button: HTMLButtonElement | null;
    $inner: HTMLElement | null;
    index: number;
    isDeselect: boolean;
    isOpen: boolean;
    height: number;
    transitionDuration: number;
    constructor(el: HTMLElement, index: number);
    init(): void;
    get open(): boolean;
    openPanel(emit?: boolean): boolean;
    close(emit?: boolean): boolean;
    toggle(): boolean;
    focus(): void;
    destroy(): void;
}
//# sourceMappingURL=Panel.d.ts.map