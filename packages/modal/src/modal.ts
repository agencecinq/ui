import { EVENTS, dispatchEvent, getFocusableElements } from "@agencecinq/utils";

export class Modal extends HTMLElement {
  trigger: HTMLElement | null = null;
  private $modal: HTMLDialogElement | null = null;

  private handleClick = (event: MouseEvent) => {
    if (event.target === event.currentTarget) {
      this.close();
    }
  };

  private handleModalToggle = (event: CustomEvent) => {
    const { modal, trigger } = event.detail;

    if (modal !== this.id) {
      return;
    }

    if (this.$modal?.open) {
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

    this.$modal.addEventListener("click", this.handleClick);
    document.documentElement.addEventListener(
      EVENTS.MODAL_TOGGLE,
      this.handleModalToggle as EventListener,
    );
  }

  /** Detaches listeners. Safe to call from outside while the host stays mounted. */
  destroy(): void {
    if (this.$modal) {
      this.$modal.removeEventListener("click", this.handleClick);

      if (this.$modal.open) {
        this.$modal.close();
      }
    }

    document.documentElement.removeEventListener(
      EVENTS.MODAL_TOGGLE,
      this.handleModalToggle as EventListener,
    );
  }

  close = () => {
    if (!this.$modal?.open) {
      return;
    }

    this.$modal.close();

    dispatchEvent(
      document.documentElement,
      EVENTS.MODAL_CLOSE,
      { modal: this.id },
      { bubbles: false, cancelable: false },
    );
  };

  show = () => {
    if (!this.$modal || this.$modal.open) {
      return;
    }

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
  };
}

if (!customElements.get("cinq-modal")) {
  customElements.define("cinq-modal", Modal);
}
