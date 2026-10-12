export interface Detail {
    /** Panel being shown. */
    panel: HTMLElement;
    /** Panel being hidden. */
    previous: HTMLElement;
    /** Trigger linking the parent panel to the child panel (`aria-controls`). */
    $button: HTMLButtonElement;
    /**
     * Direction of this transition: `true` drills into a child panel, `false` goes back.
     * Events fire before the DOM mutates, so listeners should use this rather than
     * reading `hidden` yet.
     */
    open: boolean;
}
//# sourceMappingURL=types.d.ts.map