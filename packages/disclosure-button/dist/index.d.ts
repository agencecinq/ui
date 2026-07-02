export type { DisclosureButtonDetail } from './types.js';
/**
 * Disclosure button controller for elements with `aria-expanded` and `aria-controls`.
 *
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/
 */
export declare class DisclosureButton {
    el: HTMLElement;
    elements: HTMLElement[];
    private controlIds;
    constructor(el: HTMLElement);
    init(): void;
    private initEvents;
    private onClick;
    private onFocus;
    private onBlur;
    private onLinkedChange;
    private get detail();
    private isExpanded;
    private updateExpandedFromElements;
    toggle(): boolean;
    close(emit?: boolean): void;
    open(emit?: boolean): void;
    destroy(): void;
}
//# sourceMappingURL=index.d.ts.map