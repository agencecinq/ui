declare function getFocusableElements(container: HTMLElement): HTMLElement[];
/**
 * Stash the element to focus when the overlay session ends.
 * First call wins so a chain of exclusive overlays keeps the original page control.
 * Falls back to `document.activeElement` when `element` is omitted/null.
 */
declare function rememberReturnFocus(element?: HTMLElement | null): void;
/** Restore and clear the stashed return-focus element. */
declare function restoreReturnFocus(): void;
/**
 * Restore stashed focus after the current turn, unless something else already
 * claimed it (another overlay, third-party popup, etc.). Still restores when
 * focus is on `document.body` or inside `closingHost`.
 */
declare function scheduleRestoreReturnFocus(closingHost?: HTMLElement | null): void;
declare function addTrapFocus(container: HTMLElement, elementToFocus?: HTMLElement): void;
declare function removeTrapFocus(elementToFocus?: HTMLElement | null): void;
export { addTrapFocus, removeTrapFocus, getFocusableElements, rememberReturnFocus, restoreReturnFocus, scheduleRestoreReturnFocus, };
//# sourceMappingURL=focus.d.ts.map