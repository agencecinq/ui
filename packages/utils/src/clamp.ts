/**
 * Clamps a number between a minimum and a maximum value.
 *
 * @example
 * clamp(10, 1, 5);  // 5
 * clamp(-1, 0, 10); // 0
 * clamp(7, 3, 9);   // 7
 */
export const clamp = (value: number, min: number, max: number): number =>
  Math.min(Math.max(value, min), max);
