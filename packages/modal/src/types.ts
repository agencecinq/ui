import type { Modal } from "./modal.js";

export type BeforeOpenDetail = {
  modal: string;
  instance: Modal;
  trigger: HTMLElement | null;
  /** Commit the open after async work (idempotent). */
  resolve: () => void;
};

export type BeforeCloseDetail = {
  modal: string;
  instance: Modal;
  /** Commit the close after async work (idempotent). */
  resolve: () => void;
};
