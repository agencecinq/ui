import { EVENTS, dispatchEvent } from '@agencecinq/utils';

export class ModalButton extends HTMLElement {
    private $button: HTMLButtonElement | null = null;
    /** Controlled modal element IDs from `ariaControlsElements`. */
    controls: string[] = [];
  private handleModalClose = (event: CustomEvent<{ modal: string }>) => {
    if (this.$button && this.controls.includes(event.detail.modal)) {
      this.$button.setAttribute("aria-pressed", "false");
    }
  };
  private handleModalOpen = (event: CustomEvent<{ modal: string }>) => {
    if (this.$button && this.controls.includes(event.detail.modal)) {
      this.$button.setAttribute("aria-pressed", "true");
    }
  };

    connectedCallback() {
        this.init();
    }

    disconnectedCallback() {
        this.destroy();
        this.$button = null;
        this.controls = [];
    }

    /**
     * Bind markup + listeners. Call {@link destroy} first if already bound.
     */
    init(): void {
        this.$button = this.querySelector('[data-button]') || this.querySelector('button');

        if (!this.$button) {
            throw new Error('ModalButton: No button found');
        }

        // IDL: `ariaControlsElements` reflects `aria-controls` ID references.
        this.controls = (this.$button.ariaControlsElements ?? []).map(
            (element) => element.id,
        );

        this.$button.addEventListener('click', this.show);
        document.documentElement.addEventListener(EVENTS.MODAL_CLOSE, this.handleModalClose as EventListener);
        document.documentElement.addEventListener(EVENTS.MODAL_OPEN, this.handleModalOpen as EventListener);
    }

    /** Detaches listeners. Safe to call from outside while the host stays mounted. */
    destroy(): void {
        if (this.$button) {
            this.$button.removeEventListener('click', this.show);
        }
        document.documentElement.removeEventListener(EVENTS.MODAL_CLOSE, this.handleModalClose as EventListener);
        document.documentElement.removeEventListener(EVENTS.MODAL_OPEN, this.handleModalOpen as EventListener);
    }

  show = () => {
    if (!this.$button) return;

    this.controls.forEach((control) => {
      const trapId = this.$button?.getAttribute("data-trap");
      const detail = {
        trigger: this.$button,
        trap: trapId ? document.getElementById(trapId) : null,
        modal: control,
      };

      dispatchEvent(document.documentElement, EVENTS.MODAL_TOGGLE, detail, {
        bubbles: false,
        cancelable: false,
      });
    });
  };
}

if (!customElements.get('cinq-modal-button')) {
    customElements.define('cinq-modal-button', ModalButton);
}
