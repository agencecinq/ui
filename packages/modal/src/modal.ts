import { EVENTS } from '@agencecinq/utils';

export class Modal extends HTMLElement {
    private $modal: HTMLDialogElement | null = null;
    private handleClick = (event: MouseEvent) => {
        if (event.target === event.currentTarget) this.close();
    };

    constructor() {
        super();
    }

    connectedCallback() {

        this.$modal = (this.querySelector('[data-dialog]') || this.querySelector('dialog')) as HTMLDialogElement | null;

        if (!this.$modal) {
            throw new Error('Modal: No dialog found');
        }

        this.$modal.addEventListener('click', this.handleClick);
    }

    disconnectedCallback() {
        if (this.$modal) {
            this.$modal.removeEventListener('click', this.handleClick);
        }

        this.$modal = null;
    }

    close = () => {
        if (!this.$modal) {
            return;
        }

        this.$modal.close();
        document.documentElement.dispatchEvent(new CustomEvent(EVENTS.MODAL_CLOSE));
    };

    show = () => {
        if (!this.$modal) {
            return;
        }

        this.$modal.showModal();
        document.documentElement.dispatchEvent(new CustomEvent(EVENTS.MODAL_OPEN));
    };
}

if (!customElements.get('cinq-modal')) {
    customElements.define('cinq-modal', Modal);
}