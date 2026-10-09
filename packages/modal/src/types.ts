import type { WaitUntil } from "@agencecinq/utils";
import type { Modal } from "./modal.js";

export type BeforeOpenDetail = {
  modal: string;
  instance: Modal;
  trigger: HTMLElement | null;
  /** Defers the open until `promise` settles. A rejection cancels it. */
  waitUntil: WaitUntil;
};

export type BeforeCloseDetail = {
  modal: string;
  instance: Modal;
  /** Defers the close until `promise` settles. A rejection cancels it. */
  waitUntil: WaitUntil;
};
