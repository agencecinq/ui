export type { DisclosureButtonDetail } from './types.js';
/**
 * Disclosure button controller for elements with `aria-expanded` and `aria-controls`.
 *
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/
 */
export declare class DisclosureButton {
    el: HTMLElement;
    elements: HTMLElement[];
    ids: string[];
    constructor(el: HTMLElement);
    init(): void;
    private initEvents;
    private onClick;
    private onFocus;
    private onBlur;
    private get detail();
    toggle(): boolean;
    close(): void;
    open(): void;
    destroy(): void;
}
//# sourceMappingURL=index.d.ts.map