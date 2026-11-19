export type State = "open" | "closed";
/**
 * Fires `beforetoggle` at `$element`, as a popover does: before the change,
 * without bubbling, cancelable only when the element opens.
 *
 * @returns `false` if a listener canceled the opening.
 */
export declare const dispatchBeforetoggle: ($element: HTMLElement, newState: State, $source: HTMLButtonElement) => boolean;
/**
 * Fires `toggle` at `$element` in a later task, as a popover does. Changes made
 * before it fires coalesce into one event, from the first old state to the last
 * new state.
 */
export declare const queueToggle: ($element: HTMLElement, newState: State, $source: HTMLButtonElement) => void;
//# sourceMappingURL=utils.d.ts.map