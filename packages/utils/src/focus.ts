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

export { getFocusableElements };
