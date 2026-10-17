import { EVENTS, dispatchBeforeEvent } from "@agencecinq/utils";

export type { BeforeCloseDetail, BeforeOpenDetail } from "./types.js";

/** Safari lacks `closedby`: the modal handles `closedby="any"` itself there. */
const supportsClosedBy = "closedBy" in HTMLDialogElement.prototype;

export class Modal extends HTMLElement {
  trigger: HTMLElement | null = null;
  $dialog: HTMLDialogElement | null = null;

  #pending: Promise<boolean> | null = null;

  /**
   * Invoker commands on the dialog: open and close requests go through the
   * before-events. A `show-modal` button with `data-replace` opens this modal
   * in place of the one it sits in.
   */
  #handleCommand = (event: CommandEvent): void => {
    const source = event.source instanceof HTMLElement ? event.source : null;

    switch (event.command) {
      case "show-modal": {
        const current = source?.hasAttribute("data-replace")
          ? source.closest("cinq-modal")
          : null;

        event.preventDefault();
        this.trigger = source;

        if (current instanceof Modal && current !== this) {
          this.#replace(current);
        } else {
          this.show();
        }
        break;
      }

      case "request-close": {
        // The button's value becomes the dialog's returnValue, as natively.
        const returnValue = source?.getAttribute("value") ?? undefined;

        event.preventDefault();
        this.close(returnValue);
        break;
      }
    }
  };

  /** Escape and light dismiss: route through `close()` unless the browser forces the close. */
  #handleCancel = (event: Event): void => {
    if (!event.cancelable) {
      return;
    }

    event.preventDefault();
    this.close();
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

  connectedCallback() {
    this.init();
  }

  disconnectedCallback() {
    this.destroy();
    this.$dialog = null;
  }

  /**
   * Bind dialog listeners. Call {@link destroy} first if already bound.
   */
  init(): void {
    this.$dialog = this.querySelector("dialog");

    if (!this.$dialog) {
      throw new Error("Modal: No <dialog> found");
    }

    if (!this.$dialog.id) {
      throw new Error("Modal: dialog id attribute is required");
    }

    this.$dialog.addEventListener(
      "command",
      this.#handleCommand as EventListener,
    );
    this.$dialog.addEventListener("cancel", this.#handleCancel);

    if (!supportsClosedBy) {
      this.$dialog.addEventListener("click", this.#handleClick);
    }
  }

  /** Detaches listeners and closes the dialog. Safe to call from outside while the host stays mounted. */
  destroy(): void {
    if (!this.$dialog) {
      return;
    }

    this.$dialog.removeEventListener(
      "command",
      this.#handleCommand as EventListener,
    );
    this.$dialog.removeEventListener("cancel", this.#handleCancel);
    this.$dialog.removeEventListener("click", this.#handleClick);

    if (this.$dialog.open) {
      this.$dialog.close();
    }
  }

  /**
   * Opens the modal. Dispatches cancelable `modal:before-open`: listeners
   * cancel with `preventDefault()` or defer with `detail.waitUntil(promise)`.
   *
   * @returns Whether this call opened the modal.
   */
  show(): Promise<boolean> {
    return this.#show(() => this.#commit(true));
  }

  /**
   * Closes the modal. Dispatches cancelable `modal:before-close`: listeners
   * cancel with `preventDefault()` or defer with `detail.waitUntil(promise)`.
   *
   * @param returnValue - Becomes the dialog's `returnValue`, as with `dialog.close()`.
   * @returns Whether this call closed the modal.
   */
  close(returnValue?: string): Promise<boolean> {
    if (!this.$dialog?.open) {
      return Promise.resolve(false);
    }

    const detail = { modal: this.$dialog.id, instance: this };

    return this.#request(EVENTS.MODAL_BEFORE_CLOSE, detail, () =>
      this.#commit(false, returnValue),
    );
  }

  /**
   * Opens in place of `current`. Like a navigation, this modal accepts the open
   * first, so `current` stays open when its `modal:before-open` cancels.
   */
  #replace(current: Modal): Promise<boolean> {
    return this.#show(async () => {
      const closed = await current.close();

      return closed && this.#commit(true);
    });
  }

  #show(commit: () => boolean | Promise<boolean>): Promise<boolean> {
    if (!this.$dialog || this.$dialog.open) {
      return Promise.resolve(false);
    }

    const detail = {
      modal: this.$dialog.id,
      instance: this,
      trigger: this.trigger,
    };

    return this.#request(EVENTS.MODAL_BEFORE_OPEN, detail, commit);
  }

  /** Opens or closes the dialog, unless it is already in that state. */
  #commit(open: boolean, returnValue?: string): boolean {
    const $dialog = this.$dialog;

    if (!$dialog || $dialog.open === open) {
      return false;
    }

    if (open) {
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
}

if (!customElements.get("cinq-modal")) {
  customElements.define("cinq-modal", Modal);
}
