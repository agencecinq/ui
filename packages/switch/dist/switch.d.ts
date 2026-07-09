/**
 * Switch Web Component implementing the WAI-ARIA switch pattern.
 *
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/switch/
 */
export declare class Switch extends HTMLElement {
    static observedAttributes: string[];
    $input: HTMLInputElement | null;
    private reflectingAttribute;
    connectedCallback(): void;
    disconnectedCallback(): void;
    attributeChangedCallback(name: string, _oldValue: string | null, newValue: string | null): void;
    get checked(): boolean;
    get disabled(): boolean;
    toggle(): boolean;
    activate(emit?: boolean): boolean;
    deactivate(emit?: boolean): boolean;
    destroy(): void;
    private handleClick;
    private handleKeydown;
    private handleFocus;
    private handleBlur;
    private get detail();
    private syncInput;
    private reflectCheckedAttribute;
}
//# sourceMappingURL=switch.d.ts.map