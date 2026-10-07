import { EVENTS, dispatchEvent } from "@agencecinq/utils";
import type { SheetDetail, ToggleDetail } from "./types.js";

/** Upward pull distance in px past which a release opens. */
const OPEN_DISTANCE = 40;
/** Upward release speed in px/ms that opens regardless of distance. */
const OPEN_VELOCITY = 0.5;
/** Movement in px under which a press still counts as a tap. */
const TAP_SLOP = 8;

type Pull = {
  pointerId: number;
  startY: number;
  lastY: number;
  lastTime: number;
  velocity: number;
};

export class SheetButton extends HTMLElement {
  /** Sheet ids from the button `aria-controls`. */
  controls: string[] = [];
  $button: HTMLButtonElement | null = null;

  #pull: Pull | null = null;
  #ignoreClick = false;

  connectedCallback(): void {
    this.init();
  }

  disconnectedCallback(): void {
    this.destroy();
  }

  init(): void {
    this.$button = this.querySelector("button");

    if (!this.$button) {
      throw new Error("SheetButton: button element not found");
    }

    const sheets = this.$button.ariaControlsElements ?? [];

    this.controls = sheets.map((sheet) => sheet.id);
    this.#setExpanded(sheets.some((sheet) => sheet.hasAttribute("open")));

    this.$button.addEventListener("click", this.#handleClick);
    this.$button.addEventListener("pointerdown", this.#handlePointerDown);
    this.$button.addEventListener("pointermove", this.#handlePointerMove);
    this.$button.addEventListener("pointerup", this.#handlePointerUp);
    this.$button.addEventListener("pointercancel", this.#handlePointerCancel);
    document.documentElement.addEventListener(
      EVENTS.SHEET_OPEN,
      this.#handleSheetOpen as EventListener,
    );
    document.documentElement.addEventListener(
      EVENTS.SHEET_CLOSE,
      this.#handleSheetClose as EventListener,
    );
  }

  destroy(): void {
    this.#pull = null;

    if (this.$button) {
      this.$button.removeEventListener("click", this.#handleClick);
      this.$button.removeEventListener("pointerdown", this.#handlePointerDown);
      this.$button.removeEventListener("pointermove", this.#handlePointerMove);
      this.$button.removeEventListener("pointerup", this.#handlePointerUp);
      this.$button.removeEventListener(
        "pointercancel",
        this.#handlePointerCancel,
      );
    }

    document.documentElement.removeEventListener(
      EVENTS.SHEET_OPEN,
      this.#handleSheetOpen as EventListener,
    );
    document.documentElement.removeEventListener(
      EVENTS.SHEET_CLOSE,
      this.#handleSheetClose as EventListener,
    );

    this.$button = null;
    this.controls = [];
  }

  #setExpanded(expanded: boolean): void {
    this.$button?.setAttribute("aria-expanded", String(expanded));
  }

  #toggle(sheet: string): void {
    dispatchEvent<ToggleDetail>(
      document.documentElement,
      EVENTS.SHEET_TOGGLE,
      { sheet, trigger: this.$button },
      { bubbles: false, cancelable: false },
    );
  }

  #handleClick = (): void => {
    if (this.#ignoreClick) {
      this.#ignoreClick = false;
      return;
    }

    this.controls.forEach((sheet) => this.#toggle(sheet));
  };

  #handlePointerDown = (event: PointerEvent): void => {
    if (event.button !== 0 || !this.$button) {
      return;
    }

    this.#ignoreClick = false;
    this.#pull = {
      pointerId: event.pointerId,
      startY: event.clientY,
      lastY: event.clientY,
      lastTime: event.timeStamp,
      velocity: 0,
    };

    this.$button.setPointerCapture(event.pointerId);
  };

  #handlePointerMove = (event: PointerEvent): void => {
    const pull = this.#pull;

    if (!pull || event.pointerId !== pull.pointerId) {
      return;
    }

    const elapsed = Math.max(event.timeStamp - pull.lastTime, 1);
    pull.velocity = (event.clientY - pull.lastY) / elapsed;
    pull.lastY = event.clientY;
    pull.lastTime = event.timeStamp;
  };

  /** A tap is left to the native click. A pull opens or does nothing. */
  #handlePointerUp = (event: PointerEvent): void => {
    const pull = this.#pull;

    if (!pull || event.pointerId !== pull.pointerId) {
      return;
    }

    this.#pull = null;

    const delta = pull.lastY - pull.startY;

    if (Math.abs(delta) < TAP_SLOP) {
      return;
    }

    this.#ignoreClick = true;

    if (delta > -OPEN_DISTANCE && pull.velocity > -OPEN_VELOCITY) {
      return;
    }

    this.controls
      .filter((sheet) => !document.getElementById(sheet)?.hasAttribute("open"))
      .forEach((sheet) => this.#toggle(sheet));
  };

  #handlePointerCancel = (): void => {
    this.#pull = null;
  };

  #handleSheetOpen = (event: CustomEvent<SheetDetail>): void => {
    if (this.controls.includes(event.detail.sheet)) {
      this.#setExpanded(true);
    }
  };

  #handleSheetClose = (event: CustomEvent<SheetDetail>): void => {
    if (this.controls.includes(event.detail.sheet)) {
      this.#setExpanded(false);
    }
  };
}

if (!customElements.get("cinq-sheet-button")) {
  customElements.define("cinq-sheet-button", SheetButton);
}
