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
/**
 * Moves focus between `elements` with the arrow, Home and End keys, wrapping at
 * both ends. Left and right follow the reading direction of the focused element.
 * Keys pressed with a modifier are left to the browser.
 */
export declare const focusByKey: (event: KeyboardEvent, elements: HTMLElement[], index: number) => void;
//# sourceMappingURL=utils.d.ts.map