declare function getFocusableElements(container: HTMLElement): HTMLElement[];
/**
 * Stash the element to focus when the overlay session ends.
 * First call wins so a chain of exclusive overlays keeps the original page control.
 * Falls back to `document.activeElement` when `element` is omitted/null.
 */
declare function rememberReturnFocus(element?: HTMLElement | null): void;
/** Restore and clear the stashed return-focus element. */
declare function restoreReturnFocus(): void;
declare function addTrapFocus(container: HTMLElement, elementToFocus?: HTMLElement): void;
declare function removeTrapFocus(elementToFocus?: HTMLElement | null): void;
export { addTrapFocus, removeTrapFocus, getFocusableElements, rememberReturnFocus, restoreReturnFocus, };
//# sourceMappingURL=focus.d.ts.map