/**
 * Disclosure button Web Component wrapping a slotted trigger.
 *
 * HTML is the source of truth: `aria-expanded` / `aria-controls` live on the
 * trigger; style via `[aria-expanded]` or `:has([aria-expanded="true"])`.
 * Controlled nodes come from `ariaControlsElements`
 * (`FrozenArray<Element>?`, reflecting `aria-controls`).
 *
 * Visibility rules:
 * - `aria-expanded` is `true` when **at least one** controlled element is visible.
 * - If **any** controlled element is visible, `toggle()` / a trigger click closes
 *   them all (including after a partial external dismiss).
 *
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/
 * @see https://w3c.github.io/aria/#dom-ariamixin-ariacontrolselements
 */
export declare class DisclosureButton extends HTMLElement {
    $button: HTMLButtonElement | null;
    /** Controlled elements from `ariaControlsElements` (HTML disclosure targets). */
    elements: HTMLElement[];
    connectedCallback(): void;
    disconnectedCallback(): void;
    /**
     * Reads `aria-expanded` on the trigger (HTML source of truth).
     * After mutating controlled elements yourself, call {@link update} first.
     */
    get expanded(): boolean;
    /** Controlled elements that are currently visible (`!hidden`). */
    private get visibleElements();
    /** Every controlled element is visible. */
    private get allVisibleElements();
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
     * Re-reads controlled elements and syncs `aria-expanded`.
     * `aria-expanded` is `true` while at least one controlled element is visible.
     * Call after an external dismiss so the trigger stays honest.
     */
    update(): void;
    /** Detaches listeners. Called automatically from `disconnectedCallback`. */
    destroy(): void;
    private handleClick;
    private handleFocus;
    private handleBlur;
    private detail;
}
//# sourceMappingURL=disclosure-button.d.ts.map