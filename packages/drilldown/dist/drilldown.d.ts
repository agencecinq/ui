/**
 * Drill-down navigation Web Component.
 *
 * Panels are the direct children of the host: only one is visible at a time.
 * A `<button aria-controls>` inside a panel opens the child panel it controls;
 * a `[data-close]` button goes back to the parent panel.
 *
 * State lives in the HTML: `hidden` on panels and `aria-expanded` on triggers.
 * The path back to the root is read from the expanded triggers, so no stack is kept.
 *
 * Before each panel change the host reflects `data-direction` (`forward` when
 * drilling in, `back` when going up), so CSS can animate the panels. `closeAll()`
 * removes it: a reset is not a navigation.
 *
 * Focus is moved, never trapped: put the host in a drawer or modal to contain it.
 *
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/
 */
export declare class Drilldown extends HTMLElement {
    #private;
    panels: HTMLElement[];
    connectedCallback(): void;
    disconnectedCallback(): void;
    init(): void;
    destroy(): void;
    /** The visible panel. */
    get current(): HTMLElement | null;
    /**
     * Shows the panel with the given ID and hides the current one.
     * Focus moves to the panel's `[data-autofocus]` element, or its first focusable one.
     *
     * @param id - ID of a child panel controlled by a trigger in the current panel.
     * @param trigger - Trigger to expand. Defaults to the one in the current panel.
     */
    open(id: string, trigger?: HTMLButtonElement | null): boolean;
    /**
     * Goes back to the parent panel. Focus returns to the trigger that opened the current one.
     * Returns `false` on the root panel.
     */
    close(focus?: boolean): boolean;
    /**
     * Goes back to the root panel without moving focus (e.g. when the drawer closes).
     * Removes `data-direction` afterwards, so the reset is not animated.
     */
    closeAll(): void;
}
//# sourceMappingURL=drilldown.d.ts.map