import { EVENTS, dispatchEvent } from '@agencecinq/utils';

export class Modal extends HTMLElement {
    private $modal: HTMLDialogElement | null = null;
    private handleClick = (event: MouseEvent) => {
        if (event.target === event.currentTarget) this.close();
    };
    private handleModalToggle = (event: CustomEvent) => {
        const { modal } = event.detail;

        if (modal !== this.id) {
            return;
        }

        if (this.$modal?.open) {
            this.close();
        } else {
            this.show();
        }
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
        document.documentElement.addEventListener(EVENTS.MODAL_TOGGLE, this.handleModalToggle as EventListener);
    }

    disconnectedCallback() {
        if (this.$modal) {
            this.$modal.removeEventListener('click', this.handleClick);
        }
        document.documentElement.removeEventListener(EVENTS.MODAL_TOGGLE, this.handleModalToggle as EventListener);

        this.$modal = null;
    }

    close = () => {
        if (!this.$modal) {
            return;
        }

        this.$modal.close();
        dispatchEvent(document.documentElement, EVENTS.MODAL_CLOSE, undefined, {
            bubbles: false,
            cancelable: false,
        });
    };

    show = () => {
        if (!this.$modal) {
            return;
        }

        this.$modal.showModal();
        dispatchEvent(
            document.documentElement,
            EVENTS.MODAL_OPEN,
            { modal: this.id },
            { bubbles: false, cancelable: false },
        );
    };
}

if (!customElements.get('cinq-modal')) {
    customElements.define('cinq-modal', Modal);
}