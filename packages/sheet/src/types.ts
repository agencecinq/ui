import type { Sheet } from "./sheet.js";

export type SheetDetail = {
  sheet: string;
};

export type ToggleDetail = SheetDetail & {
  trigger: HTMLElement | null;
};

export type OpenDetail = SheetDetail & {
  trigger: HTMLElement | null;
};

export type BeforeOpenDetail = SheetDetail & {
  instance: Sheet;
  trigger: HTMLElement | null;
  /** Commits the open after async work. Idempotent. */
  resolve: () => void;
};

export type BeforeCloseDetail = SheetDetail & {
  instance: Sheet;
  /** Commits the close after async work. Idempotent. */
  resolve: () => void;
};
