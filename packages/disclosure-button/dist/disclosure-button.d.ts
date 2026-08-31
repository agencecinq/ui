/**
 * Disclosure button Web Component wrapping a slotted trigger.
 *
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/
 * @see https://w3c.github.io/aria/#dom-ariamixin-ariacontrolselements
 */
export declare class DisclosureButton extends HTMLElement {
    #private;
    $button: HTMLButtonElement | null;
    elements: HTMLElement[];
    connectedCallback(): void;
    disconnectedCallback(): void;
    init(): void;
    get expanded(): boolean;
    toggle(): boolean;
    /** Hides every controlled element. Dispatches a close event by default. */
    close(emit?: boolean): void;
    open(emit?: boolean): void;
    update(): void;
    destroy(): void;
}
//# sourceMappingURL=disclosure-button.d.ts.map