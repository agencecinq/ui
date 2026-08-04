const trapFocusHandlers: {
  focusin?: (event: FocusEvent) => void;
  focusout?: () => void;
  keydown?: (event: KeyboardEvent) => void;
} = {};

/** First document focus target for the current overlay session (first wins). */
let returnFocusElement: HTMLElement | null = null;

function isVisible(el: HTMLElement): boolean {
  return !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length);
}

function getFocusableElements(container: HTMLElement): HTMLElement[] {
  if (!container) return [];

  const selector = [
    'summary',
    'a[href]',
    'button:enabled',
    '[tabindex]:not([tabindex^="-"])',
    'input:not([type=hidden]):enabled',
    'select:enabled',
    'textarea:enabled',
    'object',
    'iframe',
    '[contenteditable]',
  ].join(',');

  return Array.from(container.querySelectorAll<HTMLElement>(selector)).filter(
    (el) => isVisible(el) && el.getAttribute('tabindex') !== '-1',
  );
}

/**
 * Stash the element to focus when the overlay session ends.
 * First call wins so a chain of exclusive overlays keeps the original page control.
 * Falls back to `document.activeElement` when `element` is omitted/null.
 */
function rememberReturnFocus(element?: HTMLElement | null): void {
  if (returnFocusElement) {
    return;
  }

  const candidate =
    element ??
    (document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null);

  if (!candidate || candidate === document.body || !candidate.isConnected) {
    return;
  }

  returnFocusElement = candidate;
}

/** Restore and clear the stashed return-focus element. */
function restoreReturnFocus(): void {
  returnFocusElement?.focus();
  returnFocusElement = null;
}

function addTrapFocus(
  container: HTMLElement,
  elementToFocus: HTMLElement = container,
): void {
  const elements = getFocusableElements(container);
  if (elements.length === 0) return;

  const first = elements[0];
  const last = elements[elements.length - 1];

  rememberReturnFocus();
  removeTrapFocus();

  trapFocusHandlers.keydown = (event: KeyboardEvent): void => {
    if (event.key !== 'Tab') return;

    if (event.shiftKey) {
      if (
        document.activeElement === first ||
        document.activeElement === container
      ) {
        event.preventDefault();
        last.focus();
      }
    } else {
      if (document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  };

  document.addEventListener('keydown', trapFocusHandlers.keydown);

  elementToFocus.focus();

  if (
    elementToFocus instanceof HTMLInputElement &&
    ['search', 'text', 'email', 'url'].includes(elementToFocus.type) &&
    elementToFocus.value
  ) {
    elementToFocus.setSelectionRange(0, elementToFocus.value.length);
  }
}

function removeTrapFocus(elementToFocus: HTMLElement | null = null): void {
  if (trapFocusHandlers.keydown) {
    document.removeEventListener('keydown', trapFocusHandlers.keydown);
  }

  if (elementToFocus) {
    elementToFocus.focus();
  }
}

export {
  addTrapFocus,
  removeTrapFocus,
  getFocusableElements,
  rememberReturnFocus,
  restoreReturnFocus,
};
