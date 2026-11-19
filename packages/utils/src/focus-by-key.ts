/**
 * Moves focus between `elements` with the arrow, Home and End keys, wrapping at
 * both ends. Left and right follow the reading direction of the focused element.
 * Keys pressed with a modifier are left to the browser.
 *
 * @param event - The keydown on `elements[index]`.
 * @param elements - The elements the keys move through, in order.
 * @param index - The position of the focused element in `elements`.
 * @returns The index of the element that took the focus, or `undefined` when the key is left to the browser.
 *
 * @example
 * #handleKeydown = (event: KeyboardEvent): void => {
 *   const index = this.$buttons.indexOf(event.target as HTMLButtonElement);
 *
 *   if (index !== -1) {
 *     focusByKey(event, this.$buttons, index);
 *   }
 * };
 */
export const focusByKey = (
  event: KeyboardEvent,
  elements: HTMLElement[],
  index: number,
): number | undefined => {
  if (event.altKey || event.ctrlKey || event.metaKey) {
    return undefined;
  }

  const last = elements.length - 1;
  const previous = index === 0 ? last : index - 1;
  const next = index === last ? 0 : index + 1;
  const rtl = elements[index].matches(":dir(rtl)");
  const keys: Partial<Record<string, number>> = {
    ArrowUp: previous,
    ArrowLeft: rtl ? next : previous,
    ArrowDown: next,
    ArrowRight: rtl ? previous : next,
    Home: 0,
    End: last,
  };
  const destination = keys[event.key];

  if (destination === undefined) {
    return undefined;
  }

  event.preventDefault();
  elements[destination].focus();

  return destination;
};
