/**
 * Disclosure navigation Web Component around a site navigation whose buttons show
 * and hide submenus. The markup is the source of truth: `aria-expanded` on each
 * button holds the state, and the submenus are the elements its `aria-controls`
 * references. The component never adds a missing attribute; it only updates
 * `aria-expanded` and `hidden` when the user interacts, and fires `beforetoggle`
 * and `toggle` at the submenus, as popovers do.
 *
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/examples/disclosure-navigation/
 * @see https://w3c.github.io/aria/#dom-ariamixin-ariacontrolselements
 */
export declare class DisclosureNavigation extends HTMLElement {
    #private;
    connectedCallback(): void;
    disconnectedCallback(): void;
    /** Binds listeners. Call `destroy()` first if already bound. */
    init(): void;
    /** Removes listeners. The markup stays in its current state. */
    destroy(): void;
    /**
     * Opens the submenu of `$button` and closes the open ones outside its branch,
     * as popovers do. Canceling its `beforetoggle` leaves every submenu as it is.
     */
    open($button: HTMLButtonElement): void;
    /** Closes the submenu of `$button` and the ones nested in it, or every open submenu. */
    close($button?: HTMLButtonElement): void;
    toggle($button: HTMLButtonElement): void;
}
//# sourceMappingURL=disclosure-navigation.d.ts.map