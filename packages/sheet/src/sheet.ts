import { EVENTS, dispatchBeforeEvent } from "@agencecinq/utils";

export type { BeforeCloseDetail, BeforeOpenDetail } from "./types.js";

/** Safari lacks `closedby`: the sheet handles `closedby="any"` itself there. */
const supportsClosedBy = "closedBy" in HTMLDialogElement.prototype;

/** Pull distance in px past which a release dismisses. */
const DISMISS_DISTANCE = 80;
/** Downward release speed in px/ms that dismisses regardless of distance. */
const DISMISS_VELOCITY = 0.5;
/** Upward pull distance in px on a trigger past which a release opens. */
const OPEN_DISTANCE = 40;
/** Upward release speed in px/ms on a trigger that opens regardless of distance. */
const OPEN_VELOCITY = 0.5;
/** Movement in px under which a press on a trigger still counts as a tap. */
const TAP_SLOP = 8;
/** Time in ms after a pull during which the command of its trailing click is ignored. */
const PULL_CLICK_WINDOW = 300;

type Drag = {
  pointerId: number;
  startY: number;
  lastY: number;
  lastTime: number;
  velocity: number;
};

/** Tracks a pointer: its start, last position and downward speed in px/ms. */
function startDrag(event: PointerEvent): Drag {
  return {
    pointerId: event.pointerId,
    startY: event.clientY,
    lastY: event.clientY,
    lastTime: event.timeStamp,
    velocity: 0,
  };
}

function moveDrag(drag: Drag, event: PointerEvent): void {
  const elapsed = Math.max(event.timeStamp - drag.lastTime, 1);

  drag.velocity = (event.clientY - drag.lastY) / elapsed;
  drag.lastY = event.clientY;
  drag.lastTime = event.timeStamp;
}

export class Sheet extends HTMLElement {
  /** Element that last requested the sheet to open. */
  trigger: HTMLElement | null = null;
  $dialog: HTMLDialogElement | null = null;
  $handle: HTMLElement | null = null;

  #drag: Drag | null = null;
  #pull: (Drag & { $button: HTMLButtonElement }) | null = null;
  #ignoreCommandUntil = 0;
  #pending: Promise<boolean> | null = null;

  /** `<dialog popover>`: a non-modal sheet, toggled by its buttons. */
  get #popover(): boolean {
    return this.$dialog?.hasAttribute("popover") ?? false;
  }

  get #open(): boolean {
    if (!this.$dialog) {
      return false;
    }

    return this.#popover
      ? this.$dialog.matches(":popover-open")
      : this.$dialog.open;
  }

  /** Pulls dismiss unless the dialog opts out with `closedby="none"`. */
  get dismissible(): boolean {
    return (
      this.$dialog !== null && this.$dialog.getAttribute("closedby") !== "none"
    );
  }

  connectedCallback(): void {
    this.init();
  }

  disconnectedCallback(): void {
    this.destroy();
    this.$dialog = null;
    this.$handle = null;
  }

  /**
   * Bind dialog, handle and trigger listeners. Call {@link destroy} first if already bound.
   */
  init(): void {
    this.$dialog = this.querySelector("dialog");

    if (!this.$dialog) {
      throw new Error("Sheet: No <dialog> found");
    }

    if (!this.$dialog.id) {
      throw new Error("Sheet: dialog id attribute is required");
    }

    this.$handle = this.$dialog.querySelector<HTMLElement>(
      '[data-dom="drag-indicator"]',
    );

    this.$dialog.addEventListener(
      "command",
      this.#handleCommand as EventListener,
    );
    this.$dialog.addEventListener("cancel", this.#handleCancel);
    this.$dialog.addEventListener("toggle", this.#handleToggle as EventListener);

    if (!supportsClosedBy) {
      this.$dialog.addEventListener("click", this.#handleClick);
    }

    if (this.$handle) {
      this.$handle.addEventListener("pointerdown", this.#handleDragStart);
      this.$handle.addEventListener("pointermove", this.#handleDragMove);
      this.$handle.addEventListener("pointerup", this.#handleDragEnd);
      this.$handle.addEventListener("pointercancel", this.#handleDragEnd);
      this.$handle.addEventListener("lostpointercapture", this.#handleDragEnd);
    }

    document.addEventListener("pointerdown", this.#handlePullStart);
    document.addEventListener("pointermove", this.#handlePullMove);
    document.addEventListener("pointerup", this.#handlePullEnd);
    document.addEventListener("pointercancel", this.#handlePullCancel);
  }

  /** Detaches listeners and closes the dialog. Safe to call from outside while the host stays mounted. */
  destroy(): void {
    this.#endDrag();
    this.#pull = null;

    document.removeEventListener("pointerdown", this.#handlePullStart);
    document.removeEventListener("pointermove", this.#handlePullMove);
    document.removeEventListener("pointerup", this.#handlePullEnd);
    document.removeEventListener("pointercancel", this.#handlePullCancel);

    if (this.$handle) {
      this.$handle.removeEventListener("pointerdown", this.#handleDragStart);
      this.$handle.removeEventListener("pointermove", this.#handleDragMove);
      this.$handle.removeEventListener("pointerup", this.#handleDragEnd);
      this.$handle.removeEventListener("pointercancel", this.#handleDragEnd);
      this.$handle.removeEventListener(
        "lostpointercapture",
        this.#handleDragEnd,
      );
    }

    if (!this.$dialog) {
      return;
    }

    this.$dialog.removeEventListener(
      "command",
      this.#handleCommand as EventListener,
    );
    this.$dialog.removeEventListener("cancel", this.#handleCancel);
    this.$dialog.removeEventListener(
      "toggle",
      this.#handleToggle as EventListener,
    );
    this.$dialog.removeEventListener("click", this.#handleClick);

    this.#commit(false);
  }

  /**
   * Opens the sheet. Dispatches cancelable `sheet:before-open`: listeners
   * cancel with `preventDefault()` or defer with `detail.waitUntil(promise)`.
   *
   * @returns Whether this call opened the sheet.
   */
  show(): Promise<boolean> {
    return this.#show(() => this.#commit(true));
  }

  /**
   * Closes the sheet. Dispatches cancelable `sheet:before-close`: listeners
   * cancel with `preventDefault()` or defer with `detail.waitUntil(promise)`.
   *
   * @param returnValue - Becomes the dialog's `returnValue` on a modal sheet, as with `dialog.close()`.
   * @returns Whether this call closed the sheet.
   */
  close(returnValue?: string): Promise<boolean> {
    if (!this.$dialog || !this.#open) {
      return Promise.resolve(false);
    }

    const detail = { sheet: this.$dialog.id, instance: this };

    return this.#request(EVENTS.SHEET_BEFORE_CLOSE, detail, () =>
      this.#commit(false, returnValue),
    );
  }

  /**
   * Invoker commands on the dialog: open and close requests go through the
   * before-events. A button with `data-replace` opens this sheet in place of
   * the one it sits in. The trailing click of a pull is ignored.
   */
  #handleCommand = (event: CommandEvent): void => {
    const source = event.source instanceof HTMLElement ? event.source : null;
    const action = this.#action(event.command);

    if (!action) {
      return;
    }

    event.preventDefault();

    if (event.timeStamp < this.#ignoreCommandUntil) {
      this.#ignoreCommandUntil = 0;
      return;
    }

    if (action === "close") {
      // The button's value becomes the dialog's returnValue, as natively.
      const returnValue = source?.getAttribute("value") ?? undefined;

      this.close(returnValue);
      return;
    }

    const current = source?.hasAttribute("data-replace")
      ? source.closest("cinq-sheet")
      : null;

    this.trigger = source;

    if (current instanceof Sheet && current !== this) {
      this.#replace(current);
    } else {
      this.show();
    }
  };

  /** Escape and light dismiss of a modal sheet: route through `close()` unless the browser forces the close. */
  #handleCancel = (event: Event): void => {
    if (!event.cancelable) {
      return;
    }

    event.preventDefault();
    this.close();
  };

  /** Closed by any path, native ones included: drop the drag state. */
  #handleToggle = (event: ToggleEvent): void => {
    if (event.newState === "closed") {
      this.#endDrag();
      this.#setDragOffset(0);
    }
  };

  /** `closedby="any"` fallback: a click outside the dialog box closes it. */
  #handleClick = (event: MouseEvent): void => {
    const $dialog = this.$dialog;

    if (
      !$dialog ||
      event.target !== $dialog ||
      $dialog.getAttribute("closedby") !== "any"
    ) {
      return;
    }

    const rect = $dialog.getBoundingClientRect();
    const inside =
      event.clientX >= rect.left &&
      event.clientX <= rect.right &&
      event.clientY >= rect.top &&
      event.clientY <= rect.bottom;

    if (!inside) {
      this.close();
    }
  };

  /** The open or close a command asks for, among the commands of the dialog's mode. */
  #action(command: string): "show" | "close" | null {
    if (this.#popover) {
      switch (command) {
        case "show-popover":
          return "show";
        case "hide-popover":
          return "close";
        case "toggle-popover":
          return this.#open ? "close" : "show";
      }

      return null;
    }

    switch (command) {
      case "show-modal":
        return "show";
      case "request-close":
        return "close";
    }

    return null;
  }

  /**
   * Opens in place of `current`. Like a navigation, this sheet accepts the
   * open first, so `current` stays open when its `sheet:before-open` cancels.
   */
  #replace(current: Sheet): Promise<boolean> {
    return this.#show(async () => {
      const closed = await current.close();

      return closed && this.#commit(true);
    });
  }

  #show(commit: () => boolean | Promise<boolean>): Promise<boolean> {
    if (!this.$dialog || this.#open) {
      return Promise.resolve(false);
    }

    const detail = {
      sheet: this.$dialog.id,
      instance: this,
      trigger: this.trigger,
    };

    return this.#request(EVENTS.SHEET_BEFORE_OPEN, detail, commit);
  }

  /** Opens or closes the dialog, unless it is already in that state. */
  #commit(open: boolean, returnValue?: string): boolean {
    const $dialog = this.$dialog;

    if (!$dialog || this.#open === open) {
      return false;
    }

    if (!open) {
      // Before the close, so the exit motion starts from the resting place.
      this.#endDrag();
      this.#setDragOffset(0);
    }

    if (this.#popover) {
      // The source makes the trigger the invoker: its click toggles instead of light dismissing.
      const source = this.trigger ?? undefined;

      if (open) {
        $dialog.showPopover({ source });
      } else {
        $dialog.hidePopover();
      }
    } else if (open) {
      $dialog.showModal();
    } else {
      $dialog.close(returnValue);
    }

    return true;
  }

  /** Commits after the before-event; joins a request already in progress. */
  #request(
    name: string,
    detail: object,
    commit: () => boolean | Promise<boolean>,
  ): Promise<boolean> {
    if (this.#pending) {
      return this.#pending;
    }

    const result = dispatchBeforeEvent(document.documentElement, name, detail);

    if (result === false) {
      return Promise.resolve(false);
    }

    const committed =
      result === true ? commit() : result.then((proceed) => proceed && commit());

    if (typeof committed === "boolean") {
      return Promise.resolve(committed);
    }

    this.#pending = committed.finally(() => {
      this.#pending = null;
    });

    return this.#pending;
  }

  /** A press on a button that opens this closed sheet may turn into a pull up. */
  #handlePullStart = (event: PointerEvent): void => {
    if (
      event.button !== 0 ||
      this.#open ||
      !(event.target instanceof Element)
    ) {
      return;
    }

    const $button = event.target.closest("button");

    if (
      !$button ||
      $button.commandForElement !== this.$dialog ||
      this.#action($button.command) !== "show"
    ) {
      return;
    }

    this.#ignoreCommandUntil = 0;
    this.#pull = { ...startDrag(event), $button };
    $button.setPointerCapture(event.pointerId);
  };

  #handlePullMove = (event: PointerEvent): void => {
    const pull = this.#pull;

    if (pull && event.pointerId === pull.pointerId) {
      moveDrag(pull, event);
    }
  };

  /** A tap is left to the native command. A pull opens or does nothing. */
  #handlePullEnd = (event: PointerEvent): void => {
    const pull = this.#pull;

    if (!pull || event.pointerId !== pull.pointerId) {
      return;
    }

    // A pull can end with no pointermove in between.
    if (event.clientY !== pull.lastY) {
      moveDrag(pull, event);
    }

    this.#pull = null;

    const delta = pull.lastY - pull.startY;

    if (Math.abs(delta) < TAP_SLOP) {
      return;
    }

    this.#ignoreCommandUntil = event.timeStamp + PULL_CLICK_WINDOW;

    if (delta > -OPEN_DISTANCE && pull.velocity > -OPEN_VELOCITY) {
      return;
    }

    this.trigger = pull.$button;

    // After this pointerup: taken outside a freshly open dialog, it would light dismiss it.
    setTimeout(() => this.show());
  };

  #handlePullCancel = (): void => {
    this.#pull = null;
  };

  #handleDragStart = (event: PointerEvent): void => {
    if (event.button !== 0 || !this.#open || !this.$handle) {
      return;
    }

    this.#drag = startDrag(event);
    this.$handle.setPointerCapture(event.pointerId);
    this.toggleAttribute("dragging", true);
  };

  #handleDragMove = (event: PointerEvent): void => {
    const drag = this.#drag;

    if (!drag || event.pointerId !== drag.pointerId) {
      return;
    }

    moveDrag(drag, event);

    const delta = drag.lastY - drag.startY;

    this.#setDragOffset(delta > 0 ? delta : -Math.sqrt(-delta));
  };

  #handleDragEnd = (event: PointerEvent): void => {
    const drag = this.#drag;

    if (!drag || event.pointerId !== drag.pointerId) {
      return;
    }

    // A pull can end with no pointermove in between.
    if (event.clientY !== drag.lastY) {
      moveDrag(drag, event);
    }

    this.#endDrag();

    const shouldDismiss =
      this.dismissible &&
      (drag.lastY - drag.startY >= DISMISS_DISTANCE ||
        drag.velocity >= DISMISS_VELOCITY);

    if (!shouldDismiss) {
      this.#setDragOffset(0);
      return;
    }

    void this.close().then((closed) => {
      if (!closed) {
        this.#setDragOffset(0);
      }
    });
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
