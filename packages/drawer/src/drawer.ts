import {
  EVENTS,
  disableScroll,
  enableScroll,
  getFocusableElements,
  dispatchEvent,
  dispatchBeforeEvent,
  rememberReturnFocus,
  scheduleRestoreReturnFocus,
} from "@agencecinq/utils";

export type { BeforeCloseDetail, BeforeOpenDetail } from "./types.js";

export class Drawer extends HTMLElement {
  trigger: HTMLElement | null = null;
  $dialog: HTMLDialogElement | null = null;

  #pending: Promise<boolean> | null = null;

  /** `data-modal="false"` opens with `show()`: the page stays interactive. Read on open. */
  get modal(): boolean {
    return this.dataset.modal !== "false";
  }

  static get observedAttributes() {
    return ["open"];
  }

  connectedCallback(): void {
    this.init();
  }

  disconnectedCallback(): void {
    this.destroy();
  }

  /**
   * Bind dialog + document listeners. Call {@link destroy} first if already bound.
   * Shows the dialog when the host is already `open` in the markup.
   */
  init(): void {
    if (!this.id) {
      throw new Error("Drawer: id attribute is required");
    }

    this.$dialog = this.querySelector("dialog");

    if (!this.$dialog) {
      throw new Error("Drawer: No <dialog> found");
    }

    this.$dialog.addEventListener("click", this.#handleClick);
    this.$dialog.addEventListener("cancel", this.#handleCancel);
    this.$dialog.addEventListener("close", this.#handleClose);
    document.addEventListener("keydown", this.#handleKeydown);
    document.addEventListener("pointerdown", this.#handlePointerDown);
    document.documentElement.addEventListener(
      EVENTS.DRAWER_OPEN,
      this.#handleDrawerOpen as EventListener,
    );
    document.documentElement.addEventListener(
      EVENTS.DRAWER_TOGGLE,
      this.#handleDrawerToggle as EventListener,
    );

    if (this.hasAttribute("open")) {
      this.#show();
    }
  }

  /**
   * Detaches listeners. Releases scroll lock and focus if still open;
   * leaves the `open` attribute and the dialog state (HTML is source of truth).
   * Safe to call from outside while the host stays mounted.
   */
  destroy(): void {
    if (this.$dialog) {
      this.$dialog.removeEventListener("click", this.#handleClick);
      this.$dialog.removeEventListener("cancel", this.#handleCancel);
      this.$dialog.removeEventListener("close", this.#handleClose);
    }

    document.removeEventListener("keydown", this.#handleKeydown);
    document.removeEventListener("pointerdown", this.#handlePointerDown);
    document.documentElement.removeEventListener(
      EVENTS.DRAWER_OPEN,
      this.#handleDrawerOpen as EventListener,
    );
    document.documentElement.removeEventListener(
      EVENTS.DRAWER_TOGGLE,
      this.#handleDrawerToggle as EventListener,
    );

    if (this.hasAttribute("open")) {
      enableScroll(false);

      // Defer: another overlay may take focus before we restore.
      scheduleRestoreReturnFocus(this);
    }

    this.$dialog = null;
  }

  /** Backdrop click: the event targets the dialog, outside its box. */
  #handleClick = (event: MouseEvent): void => {
    if (!this.$dialog || event.target !== this.$dialog) {
      return;
    }

    const rect = this.$dialog.getBoundingClientRect();
    const inside =
      event.clientX >= rect.left &&
      event.clientX <= rect.right &&
      event.clientY >= rect.top &&
      event.clientY <= rect.bottom;

    if (!inside) {
      this.close();
    }
  };

  /** Escape: route through `close()` so `drawer:before-close` can defer it. */
  #handleCancel = (event: Event): void => {
    event.preventDefault();
    this.close();
  };

  /** Non-modal Escape: `cancel` only fires for modal dialogs. */
  #handleKeydown = (event: KeyboardEvent): void => {
    if (
      event.key !== "Escape" ||
      event.defaultPrevented ||
      this.modal ||
      !this.hasAttribute("open")
    ) {
      return;
    }

    this.close();
  };

  /**
   * Non-modal light dismiss: a press outside the dialog closes it. Triggers are
   * skipped so their click toggles. `pointerdown` runs before the click that
   * may open the drawer, so that click never closes it.
   */
  #handlePointerDown = (event: PointerEvent): void => {
    if (this.modal || !this.$dialog || !this.hasAttribute("open")) {
      return;
    }

    const target = event.target as Element | null;

    if (!target || this.$dialog.contains(target)) {
      return;
    }

    const control = target.closest("[aria-controls]");

    if (control?.getAttribute("aria-controls")?.split(/\s+/).includes(this.id)) {
      return;
    }

    this.close();
  };

  /** Dialog closed natively (`form[method=dialog]`, forced Escape): sync the host. */
  #handleClose = (): void => {
    if (this.hasAttribute("open")) {
      this.removeAttribute("open");
    }
  };

  #handleDrawerOpen = (event: CustomEvent): void => {
    if (event.detail.drawer !== this.id && this.hasAttribute("open")) {
      this.close();
      return;
    }

    if (event.detail.drawer === this.id && !this.hasAttribute("open")) {
      if (event.detail.trigger) {
        this.trigger = event.detail.trigger;
      }
      this.open();
    }
  };

  #handleDrawerToggle = (event: CustomEvent): void => {
    const { trigger, drawer } = event.detail;

    if (drawer !== this.id) {
      return;
    }

    this.toggle({ trigger });
  };

  #show(): void {
    if (!this.$dialog) {
      return;
    }

    if (!this.$dialog.open) {
      if (this.modal) {
        this.$dialog.showModal();
      } else {
        this.$dialog.show();
      }
    }

    if (!this.$dialog.querySelector("[autofocus]")) {
      getFocusableElements(this.$dialog)[0]?.focus();
    }

    disableScroll();
  }

  /**
   * Toggles the drawer between open and closed.
   *
   * @param trigger - Element that triggered the toggle, or null.
   * @returns Whether the drawer is open once the request settles.
   */
  toggle({ trigger = null }: { trigger?: HTMLElement | null } = {}): Promise<boolean> {
    if (this.hasAttribute("open")) {
      return this.close().then(() => this.hasAttribute("open"));
    }

    // Only remember the opener — a close control must not replace it.
    if (trigger) {
      this.trigger = trigger;
    }

    return this.open().then(() => this.hasAttribute("open"));
  }

  /**
   * Opens the drawer. Dispatches cancelable `drawer:before-open`: listeners
   * cancel with `preventDefault()` or defer with `detail.waitUntil(promise)`.
   *
   * @returns Whether this call opened the drawer.
   */
  open(): Promise<boolean> {
    if (this.hasAttribute("open")) {
      return Promise.resolve(false);
    }

    return this.#request(
      EVENTS.DRAWER_BEFORE_OPEN,
      { drawer: this.id, instance: this, trigger: this.trigger },
      true,
    );
  }

  /**
   * Closes the drawer. Dispatches cancelable `drawer:before-close`: listeners
   * cancel with `preventDefault()` or defer with `detail.waitUntil(promise)`.
   *
   * @returns Whether this call closed the drawer.
   */
  close(): Promise<boolean> {
    if (!this.hasAttribute("open")) {
      return Promise.resolve(false);
    }

    return this.#request(
      EVENTS.DRAWER_BEFORE_CLOSE,
      { drawer: this.id, instance: this },
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
    // Upgrade-time ACC runs before connectedCallback — init() handles markup state.
    if (!this.isConnected || name !== "open" || !this.$dialog) {
      return;
    }

    if (newValue !== null) {
      rememberReturnFocus(this.trigger);

      // Exclusive drawers close on this event, before this one locks scroll.
      dispatchEvent(
        document.documentElement,
        EVENTS.DRAWER_OPEN,
        { drawer: this.id, trigger: this.trigger },
        { bubbles: false, cancelable: false },
      );

      this.#show();
      return;
    }

    if (this.$dialog.open) {
      this.$dialog.close();
    }

    enableScroll(false);

    // Defer: another overlay may take focus before we restore.
    scheduleRestoreReturnFocus(this);

    dispatchEvent(
      document.documentElement,
      EVENTS.DRAWER_CLOSE,
      { drawer: this.id },
      { bubbles: false, cancelable: false },
    );
  }
}

if (!customElements.get("cinq-drawer")) {
  customElements.define("cinq-drawer", Drawer);
}
