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
    /**
     * Bind markup + listeners. Call {@link destroy} first if already bound.
     */
    init(): void;
    get expanded(): boolean;
    /**
     * Toggles open/closed.
     * Closes when any controlled element is visible; otherwise opens all.
     * @returns `false` if a cancelable event was aborted.
     */
    toggle(): boolean;
    /** Hides every controlled element. Dispatches a close event by default. */
    close(emit?: boolean): void;
    /** Shows every controlled element. Dispatches an open event by default. */
    open(emit?: boolean): void;
    /**
     * Syncs `aria-expanded` from controlled element visibility.
     * Call after an external dismiss so the trigger stays honest.
     */
    update(): void;
    /** Detaches listeners. Safe to call from outside while the host stays mounted. */
    destroy(): void;
}
//# sourceMappingURL=disclosure-button.d.ts.map