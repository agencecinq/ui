import {
  EVENTS,
  dispatchBeforeEvent,
  dispatchEvent,
  getFocusableElements,
} from "@agencecinq/utils";

export type { BeforeCloseDetail, BeforeOpenDetail } from "./types.js";

export class Modal extends HTMLElement {
  trigger: HTMLElement | null = null;
  $modal: HTMLDialogElement | null = null;

  #pending: Promise<boolean> | null = null;

  #handleClick = (event: MouseEvent) => {
    if (event.target === event.currentTarget) {
      this.close();
    }
  };

  #handleCancel = (event: Event) => {
    event.preventDefault();
    this.close();
  };

  /** Native close (`form[method=dialog]`, `dialog.close()`): sync the host. */
  #handleClose = () => {
    this.removeAttribute("open");
  };

  #handleModalToggle = (event: CustomEvent) => {
    const { modal, trigger } = event.detail;

    if (modal !== this.id) {
      return;
    }

    if (this.hasAttribute("open")) {
      this.close();
      return;
    }

    // Only remember the opener — a close control must not replace it.
    if (trigger) {
      this.trigger = trigger;
    }

    this.show();
  };

  constructor() {
    super();
  }

  static get observedAttributes() {
    return ["open"];
  }

  connectedCallback() {
    this.init();
  }

  disconnectedCallback() {
    this.destroy();
    this.$modal = null;
  }

  /**
   * Bind dialog + listeners. Call {@link destroy} first if already bound.
   */
  init(): void {
    this.$modal = (this.querySelector("[data-dialog]") ||
      this.querySelector("dialog")) as HTMLDialogElement | null;

    if (!this.$modal) {
      throw new Error("Modal: No dialog found");
    }

    if (!this.id) {
      throw new Error("Modal: id attribute is required");
    }

    this.$modal.addEventListener("click", this.#handleClick);
    this.$modal.addEventListener("cancel", this.#handleCancel);
    this.$modal.addEventListener("close", this.#handleClose);
    document.documentElement.addEventListener(
      EVENTS.MODAL_TOGGLE,
      this.#handleModalToggle as EventListener,
    );
  }

  /** Detaches listeners. Safe to call from outside while the host stays mounted. */
  destroy(): void {
    if (this.$modal) {
      this.$modal.removeEventListener("click", this.#handleClick);
      this.$modal.removeEventListener("cancel", this.#handleCancel);
      this.$modal.removeEventListener("close", this.#handleClose);

      if (this.hasAttribute("open") && this.$modal.open) {
        this.$modal.close();
      }
    }

    document.documentElement.removeEventListener(
      EVENTS.MODAL_TOGGLE,
      this.#handleModalToggle as EventListener,
    );
  }

  /**
   * Opens the modal. Dispatches cancelable `modal:before-open`: listeners
   * cancel with `preventDefault()` or defer with `detail.waitUntil(promise)`.
   *
   * @returns Whether this call opened the modal.
   */
  show(): Promise<boolean> {
    if (this.hasAttribute("open")) {
      return Promise.resolve(false);
    }

    return this.#request(
      EVENTS.MODAL_BEFORE_OPEN,
      { modal: this.id, instance: this, trigger: this.trigger },
      true,
    );
  }

  /**
   * Closes the modal. Dispatches cancelable `modal:before-close`: listeners
   * cancel with `preventDefault()` or defer with `detail.waitUntil(promise)`.
   *
   * @returns Whether this call closed the modal.
   */
  close(): Promise<boolean> {
    if (!this.hasAttribute("open")) {
      return Promise.resolve(false);
    }

    return this.#request(
      EVENTS.MODAL_BEFORE_CLOSE,
      { modal: this.id, instance: this },
      false,
    );
  }

  /** Commits `open` after the before-event; joins a request already deferred. */
  #request(name: string, detail: object, open: boolean): Promise<boolean> {
    if (this.#pending) {
      return this.#pending;
    }

    const commit = (proceed: boolean): boolean => {
      if (!proceed || this.hasAttribute("open") === open) {
        return false;
      }

      this.toggleAttribute("open", open);
      return true;
    };

    const result = dispatchBeforeEvent(document.documentElement, name, detail);

    if (typeof result === "boolean") {
      return Promise.resolve(commit(result));
    }

    this.#pending = result.then(commit).finally(() => {
      this.#pending = null;
    });

    return this.#pending;
  }

  attributeChangedCallback(
    name: string,
    _oldValue: string | null,
    newValue: string | null,
  ): void {
    // Upgrade-time ACC runs before connectedCallback — leave markup alone.
    if (!this.isConnected || name !== "open") {
      return;
    }

    if (newValue !== null) {
      if (this.$modal && !this.$modal.open) {
        // Native showModal() stacks in the top layer and restores focus to the
        // invoker on close (APG: return focus to the element that opened the dialog).
        this.$modal.showModal();

        dispatchEvent(
          document.documentElement,
          EVENTS.MODAL_OPEN,
          { modal: this.id, trigger: this.trigger },
          { bubbles: false, cancelable: false },
        );

        const focusables = getFocusableElements(this.$modal);
        if (focusables.length > 0) {
          focusables[0].focus();
        }
      }

      return;
    }

    if (this.$modal?.open) {
      this.$modal.close();
    }

    dispatchEvent(
      document.documentElement,
      EVENTS.MODAL_CLOSE,
      { modal: this.id },
      { bubbles: false, cancelable: false },
    );
  }
}

if (!customElements.get("cinq-modal")) {
  customElements.define("cinq-modal", Modal);
}
