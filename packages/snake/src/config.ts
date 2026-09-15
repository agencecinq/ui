/**
 * Fallback ink when the canvas has no usable `color`.
 */
export const color = "#2a2a2a";

/** Default `cols` when the host has no `cols` attribute. */
export const COLS = 21;

/** Default `rows` when the host has no `rows` attribute. */
export const ROWS = 15;

/** Base interval between snake steps, in milliseconds. */
export const STEP_MS = 130;

/** Fastest interval after score-based speed-up, in milliseconds. */
export const STEP_MS_MIN = 70;

/** Starting body length, including the head. Faces right from the board center. */
export const INITIAL_LENGTH = 3;
