import { EVENTS, dispatchEvent } from "@agencecinq/utils";
import type {
  BeforeCloseDetail,
  BeforeOpenDetail,
  OpenDetail,
  SheetDetail,
  ToggleDetail,
} from "./types.js";

/** Pull distance in px past which a release dismisses. */
const DISMISS_DISTANCE = 80;
/** Downward release speed in px/ms that dismisses regardless of distance. */
const DISMISS_VELOCITY = 0.5;

type Drag = {
  pointerId: number;
  startY: number;
  lastY: number;
  lastTime: number;
  velocity: number;
};

export class Sheet extends HTMLElement {
  static observedAttributes = ["open", "modal", "dismissible"];

  /** Element that last requested the sheet to open. */
  trigger: HTMLElement | null = null;
  $dialog: HTMLDialogElement | null = null;
  $handle: HTMLElement | null = null;

  #drag: Drag | null = null;

  get modal(): boolean {
    return this.getAttribute("modal") !== "false";
  }

  get dismissible(): boolean {
    return this.getAttribute("dismissible") !== "false";
  }

  connectedCallback(): void {
    this.init();
  }

  disconnectedCallback(): void {
    this.destroy();
  }

  init(): void {
    if (!this.id) {
      throw new Error("Sheet: id attribute is required");
    }

    this.$dialog = this.querySelector("dialog");

    if (!this.$dialog) {
      throw new Error("Sheet: dialog element not found");
    }

    this.$handle = this.$dialog.querySelector<HTMLElement>(
      '[data-dom="drag-indicator"]',
    );

    this.$dialog.addEventListener("cancel", this.#handleCancel);
    this.$dialog.addEventListener("close", this.#handleDialogClose);

    if (this.$handle) {
      this.$handle.addEventListener("pointerdown", this.#handlePointerDown);
      this.$handle.addEventListener("pointermove", this.#handlePointerMove);
      this.$handle.addEventListener("pointerup", this.#handlePointerUp);
      this.$handle.addEventListener("pointercancel", this.#handlePointerUp);
      this.$handle.addEventListener("lostpointercapture", this.#handlePointerUp);
    }

    document.documentElement.addEventListener(
      EVENTS.SHEET_TOGGLE,
      this.#handleSheetToggle as EventListener,
    );
    document.documentElement.addEventListener(
      EVENTS.SHEET_OPEN,
      this.#handleSheetOpen as EventListener,
    );

    this.#syncClosedBy();

    if (this.hasAttribute("open")) {
      this.#present();
    }
  }

  /** Removes listeners and closes the native dialog. Leaves `open` as is. */
  destroy(): void {
    this.#endDrag();

    if (this.$dialog) {
      this.$dialog.removeEventListener("cancel", this.#handleCancel);
      this.$dialog.removeEventListener("close", this.#handleDialogClose);

      if (this.$dialog.open) {
        this.$dialog.close();
      }
    }

    if (this.$handle) {
      this.$handle.removeEventListener("pointerdown", this.#handlePointerDown);
      this.$handle.removeEventListener("pointermove", this.#handlePointerMove);
      this.$handle.removeEventListener("pointerup", this.#handlePointerUp);
      this.$handle.removeEventListener("pointercancel", this.#handlePointerUp);
      this.$handle.removeEventListener(
        "lostpointercapture",
        this.#handlePointerUp,
      );
    }

    document.documentElement.removeEventListener(
      EVENTS.SHEET_TOGGLE,
      this.#handleSheetToggle as EventListener,
    );
    document.documentElement.removeEventListener(
      EVENTS.SHEET_OPEN,
      this.#handleSheetOpen as EventListener,
    );

    this.$dialog = null;
    this.$handle = null;
  }

  toggle(trigger: HTMLElement | null = null): boolean {
    return this.hasAttribute("open") ? this.close() : this.open(trigger);
  }

  /**
   * Dispatches cancelable `sheet:before-open`. A listener can call
   * `preventDefault()` then `detail.resolve()` once async work is done.
   */
  open(trigger: HTMLElement | null = null): boolean {
    if (this.hasAttribute("open")) {
      return false;
    }

    this.trigger = trigger;

    const resolve = (): void => {
      this.toggleAttribute("open", true);
    };
    const proceed = dispatchEvent<BeforeOpenDetail>(
      document.documentElement,
      EVENTS.SHEET_BEFORE_OPEN,
      { sheet: this.id, instance: this, trigger, resolve },
      { bubbles: false },
    );

    if (!proceed) {
      return false;
    }

    resolve();
    return true;
  }

  /**
   * Dispatches cancelable `sheet:before-close`. A listener can call
   * `preventDefault()` then `detail.resolve()` once async work is done.
   */
  close(): boolean {
    if (!this.hasAttribute("open")) {
      return false;
    }

    const resolve = (): void => {
      this.toggleAttribute("open", false);
    };
    const proceed = dispatchEvent<BeforeCloseDetail>(
      document.documentElement,
      EVENTS.SHEET_BEFORE_CLOSE,
      { sheet: this.id, instance: this, resolve },
      { bubbles: false },
    );

    if (!proceed) {
      return false;
    }

    resolve();
    return true;
  }

  attributeChangedCallback(
    name: string,
    oldValue: string | null,
    newValue: string | null,
  ): void {
    if (!this.$dialog || oldValue === newValue) {
      return;
    }

    if (name !== "open") {
      this.#syncClosedBy();
      return;
    }

    if (newValue !== null) {
      this.#present();
      dispatchEvent<OpenDetail>(
        document.documentElement,
        EVENTS.SHEET_OPEN,
        { sheet: this.id, trigger: this.trigger },
        { bubbles: false, cancelable: false },
      );
      return;
    }

    this.#endDrag();
    this.#setDragOffset(0);

    if (this.$dialog.open) {
      this.$dialog.close();
    }

    dispatchEvent<SheetDetail>(
      document.documentElement,
      EVENTS.SHEET_CLOSE,
      { sheet: this.id },
      { bubbles: false, cancelable: false },
    );
  }

  #present(): void {
    if (!this.$dialog || this.$dialog.open) {
      return;
    }

    if (this.modal) {
      this.$dialog.showModal();
      return;
    }

    this.$dialog.show();
  }

  #syncClosedBy(): void {
    if (!this.$dialog) {
      return;
    }

    if (!this.dismissible) {
      this.$dialog.setAttribute("closedby", "none");
      return;
    }

    this.$dialog.setAttribute("closedby", this.modal ? "any" : "closerequest");
  }

  /** Routes Escape and light dismiss through `close()` and its before-event. */
  #handleCancel = (event: Event): void => {
    event.preventDefault();

    if (this.dismissible) {
      this.close();
    }
  };

  /** Native close that bypassed `close()`, e.g. `<form method="dialog">`. */
  #handleDialogClose = (): void => {
    if (!this.$dialog?.open) {
      this.toggleAttribute("open", false);
    }
  };

  #handleSheetToggle = (event: CustomEvent<ToggleDetail>): void => {
    if (event.detail.sheet === this.id) {
      this.toggle(event.detail.trigger);
    }
  };

  #handleSheetOpen = (event: CustomEvent<SheetDetail>): void => {
    if (event.detail.sheet !== this.id && this.modal) {
      this.close();
    }
  };

  #handlePointerDown = (event: PointerEvent): void => {
    if (event.button !== 0 || !this.hasAttribute("open") || !this.$handle) {
      return;
    }

    this.#drag = {
      pointerId: event.pointerId,
      startY: event.clientY,
      lastY: event.clientY,
      lastTime: event.timeStamp,
      velocity: 0,
    };

    this.$handle.setPointerCapture(event.pointerId);
    this.toggleAttribute("dragging", true);
  };

  #handlePointerMove = (event: PointerEvent): void => {
    const drag = this.#drag;

    if (!drag || event.pointerId !== drag.pointerId) {
      return;
    }

    const elapsed = Math.max(event.timeStamp - drag.lastTime, 1);
    drag.velocity = (event.clientY - drag.lastY) / elapsed;
    drag.lastY = event.clientY;
    drag.lastTime = event.timeStamp;

    const delta = drag.lastY - drag.startY;
    this.#setDragOffset(delta > 0 ? delta : -Math.sqrt(-delta));
  };

  #handlePointerUp = (event: PointerEvent): void => {
    const drag = this.#drag;

    if (!drag || event.pointerId !== drag.pointerId) {
      return;
    }

    this.#endDrag();

    const shouldDismiss =
      this.dismissible &&
      (drag.lastY - drag.startY >= DISMISS_DISTANCE ||
        drag.velocity >= DISMISS_VELOCITY);

    if (!shouldDismiss || !this.close()) {
      this.#setDragOffset(0);
    }
  };

  #endDrag(): void {
    const drag = this.#drag;

    if (!drag) {
      return;
    }

    this.#drag = null;
    this.toggleAttribute("dragging", false);

    if (this.$handle?.hasPointerCapture(drag.pointerId)) {
      this.$handle.releasePointerCapture(drag.pointerId);
    }
  }

  #setDragOffset(offset: number): void {
    if (offset !== 0) {
      this.style.setProperty("--cinq-sheet-drag-offset", `${offset}px`);
      return;
    }

    this.style.removeProperty("--cinq-sheet-drag-offset");
  }
}

if (!customElements.get("cinq-sheet")) {
  customElements.define("cinq-sheet", Sheet);
}
