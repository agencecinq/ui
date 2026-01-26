const trapFocusHandlers: {
  focusin?: (event: FocusEvent) => void;
  focusout?: () => void;
  keydown?: (event: KeyboardEvent) => void;
} = {};

/**
 * Filtre les éléments réellement visibles et focalisables
 */
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
    '[contenteditable]'
  ].join(',');

  return Array.from(container.querySelectorAll<HTMLElement>(selector))
    .filter(el => isVisible(el) && el.getAttribute('tabindex') !== '-1');
}

function addTrapFocus(container: HTMLElement, elementToFocus: HTMLElement = container): void {
  const elements = getFocusableElements(container);
  if (elements.length === 0) return;

  const first = elements[0];
  const last = elements[elements.length - 1];

  // Nettoyage avant d'ajouter (pour éviter les doublons)
  removeTrapFocus();

  trapFocusHandlers.keydown = (event: KeyboardEvent): void => {
    if (event.key !== 'Tab') return;

    if (event.shiftKey) {
      // Tab arrière
      if (document.activeElement === first || document.activeElement === container) {
        event.preventDefault();
        last.focus();
      }
    } else {
      // Tab avant
      if (document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  };

  document.addEventListener('keydown', trapFocusHandlers.keydown);

  // Focus initial
  elementToFocus.focus();

  // Support spécifique pour les inputs texte (sélection du contenu)
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

export { addTrapFocus, removeTrapFocus, getFocusableElements };