import type { WaitUntil } from "@agencecinq/utils";
import type { Modal } from "./modal.js";

export type BeforeOpenDetail = {
  /** The dialog's `id`. */
  modal: string;
  instance: Modal;
  trigger: HTMLElement | null;
  /** Defers the open until `promise` settles. A rejection cancels it. */
  waitUntil: WaitUntil;
};

export type BeforeCloseDetail = {
  /** The dialog's `id`. */
  modal: string;
  instance: Modal;
  /** Defers the close until `promise` settles. A rejection cancels it. */
  waitUntil: WaitUntil;
};
