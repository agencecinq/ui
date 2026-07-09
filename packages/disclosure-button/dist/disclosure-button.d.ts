/**
 * Disclosure button Web Component wrapping a slotted trigger.
 *
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/
 */
export declare class DisclosureButton extends HTMLElement {
    static observedAttributes: string[];
    $button: HTMLButtonElement | null;
    elements: HTMLElement[];
    private controlIds;
    private observer;
    private reflectingAttribute;
    connectedCallback(): void;
    disconnectedCallback(): void;
    attributeChangedCallback(name: string, _oldValue: string | null, newValue: string | null): void;
    get button(): HTMLButtonElement | null;
    get expanded(): boolean;
    toggle(): boolean;
    close(emit?: boolean): void;
    open(emit?: boolean): void;
    destroy(): void;
    private initEvents;
    private handleClick;
    private handleFocus;
    private handleBlur;
    private handleLinkedChange;
    private get detail();
    private isExpanded;
    private updateExpandedFromElements;
    private reflectExpandedAttribute;
}
//# sourceMappingURL=disclosure-button.d.ts.map