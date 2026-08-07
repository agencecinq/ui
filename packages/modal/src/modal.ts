import { EVENTS, dispatchEvent, getFocusableElements } from "@agencecinq/utils";

export type { BeforeCloseDetail, BeforeOpenDetail } from "./types.js";

export class Modal extends HTMLElement {
  trigger: HTMLElement | null = null;
  $modal: HTMLDialogElement | null = null;

  #handleClick = (event: MouseEvent) => {
    if (event.target === event.currentTarget) {
      this.close();
    }
  };

  #handleCancel = (event: Event) => {
    event.preventDefault();
    this.close();
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
   * Opens the modal. Dispatches cancelable `modal-before-open` with
   * `detail.resolve()` to commit after async work.
   *
   * @returns `false` if already open, still closed after abort, or waiting on `resolve()`.
   */
  show(): boolean {
    if (this.hasAttribute("open")) {
      return false;
    }

    const resolve = (): void => this.setAttribute("open", "");

    const proceed = dispatchEvent(
      document.documentElement,
      EVENTS.MODAL_BEFORE_OPEN,
      {
        modal: this.id,
        instance: this,
        trigger: this.trigger,
        resolve,
      },
      { bubbles: false },
    );

    if (!proceed) {
      return this.hasAttribute("open");
    }

    resolve();
    return true;
  }

  /**
   * Closes the modal. Dispatches cancelable `modal-before-close` with
   * `detail.resolve()` to commit after async work.
   *
   * @returns `false` if already closed, still open after abort, or waiting on `resolve()`.
   */
  close(): boolean {
    if (!this.hasAttribute("open")) {
      return false;
    }

    const resolve = (): void => this.removeAttribute("open");

    const proceed = dispatchEvent(
      document.documentElement,
      EVENTS.MODAL_BEFORE_CLOSE,
      { modal: this.id, instance: this, resolve },
      { bubbles: false },
    );

    if (!proceed) {
      return !this.hasAttribute("open");
    }

    resolve();
    return true;
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
