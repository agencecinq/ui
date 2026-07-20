export interface Detail {
  /** IDs of the controlled elements resolved at connect time. */
  ids: string[];
  /** Controlled elements resolved from the DOM at connect time via `ariaControlsElements`. */
  elements: HTMLElement[];
  el: HTMLElement;
  /**
   * Intended open state for this transition.
   * Events fire before the DOM mutates, so listeners should use this rather than
   * reading `hidden` yet (e.g. to sync sibling triggers' `aria-expanded`).
   */
  open: boolean;
}
