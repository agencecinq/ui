/**
 * Switch Web Component implementing the WAI-ARIA switch pattern. It is a
 * form-associated custom element: with a `name`, it submits its `value` while
 * on, like a checkbox.
 *
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/switch/
 */
export declare class Switch extends HTMLElement {
    #private;
    static formAssociated: boolean;
    static observedAttributes: string[];
    connectedCallback(): void;
    disconnectedCallback(): void;
    /**
     * Bind listeners and submit the current state. Call {@link destroy} first if
     * already bound.
     */
    init(): void;
    /** `aria-checked` is the state: whoever writes it, the form value follows. */
    attributeChangedCallback(): void;
    formResetCallback(): void;
    formStateRestoreCallback(state: string | null): void;
    /** Submitted while on, `"on"` without a `value` attribute, as on a checkbox. */
    get value(): string;
    get checked(): boolean;
    /** `:disabled` covers `disabled` and a disabled `<fieldset>`, as on a native field. */
    get disabled(): boolean;
    toggle(): boolean;
    activate(emit?: boolean): boolean;
    deactivate(emit?: boolean): boolean;
    destroy(): void;
}
//# sourceMappingURL=switch.d.ts.map