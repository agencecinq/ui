import { EVENTS, dispatchEvent } from '@agencecinq/utils';

export class ModalButton extends HTMLElement {
    private $button: HTMLButtonElement | null = null;
    /** Controlled modal element IDs from `ariaControlsElements`. */
    controls: string[] = [];
    private handleModalClose = () => this.$button?.setAttribute('aria-pressed', 'false');
    private handleModalOpen = (event: CustomEvent) => {
        const { modal } = event.detail;

        if (this.$button && this.controls.includes(modal)) {
            this.$button.setAttribute('aria-pressed', 'true');
        }
    };

    connectedCallback() {
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

    disconnectedCallback() {
        if (this.$button) {
            this.$button.removeEventListener('click', this.show);
        }
        document.documentElement.removeEventListener(EVENTS.MODAL_CLOSE, this.handleModalClose as EventListener);
        document.documentElement.removeEventListener(EVENTS.MODAL_OPEN, this.handleModalOpen as EventListener);
        this.$button = null;
        this.controls = [];
    }

    show = () => {
        if (!this.$button) return;

        this.$button.setAttribute('aria-pressed', 'true');

        this.controls.forEach((control) => {
            const detail = {
                trigger: this.$button,
                trap: document.getElementById(`${this.$button?.getAttribute('data-trap')}`),
                modal: control
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