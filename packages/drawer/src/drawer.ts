import {
  EVENTS,
  disableScroll,
  enableScroll,
  addTrapFocus,
  removeTrapFocus,
  getFocusableElements,
  dispatchEvent,
  rememberReturnFocus,
  scheduleRestoreReturnFocus,
} from "@agencecinq/utils";

export type { BeforeCloseDetail, BeforeOpenDetail } from "./types.js";

export class Drawer extends HTMLElement {
  trigger: HTMLElement | null = null;
  trap: HTMLElement | null = null;
  $overlay: Element | null = null;
  $panel: HTMLElement | null = null;

  constructor() {
    super();
    this.trap = this;
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
   * Bind overlay + document listeners. Call {@link destroy} first if already bound.
   */
  init(): void {
    if (!this.id) {
      throw new Error("Drawer: id attribute is required");
    }

    this.$panel = this.querySelector<HTMLElement>('[role="dialog"]');

    if (!this.$panel) {
      throw new Error('Drawer: No [role="dialog"] panel found');
    }
    this.$overlay =
      this.querySelector('[data-dom="overlay"]') ||
      this.querySelector("[overlay]");

    if (this.$overlay) {
      this.$overlay.addEventListener("click", this.#handleClick);
    }

    document.documentElement.addEventListener("keyup", this.#handleKeyUp);
    document.documentElement.addEventListener(
      EVENTS.DRAWER_OPEN,
      this.#handleDrawerOpen as EventListener,
    );
    document.documentElement.addEventListener(
      EVENTS.DRAWER_TOGGLE,
      this.#handleDrawerToggle as EventListener,
    );
  }

  /**
   * Detaches listeners. Clears trap/scroll/inline styles if still open;
   * leaves the `open` attribute (HTML is source of truth).
   * Safe to call from outside while the host stays mounted.
   */
  destroy(): void {
    this.$panel?.removeEventListener(
      "transitionend",
      this.#onCloseTransitionEnd,
    );

    if (this.$overlay) {
      this.$overlay.removeEventListener("click", this.#handleClick);
    }

    document.documentElement.removeEventListener("keyup", this.#handleKeyUp);
    document.documentElement.removeEventListener(
      EVENTS.DRAWER_OPEN,
      this.#handleDrawerOpen as EventListener,
    );
    document.documentElement.removeEventListener(
      EVENTS.DRAWER_TOGGLE,
      this.#handleDrawerToggle as EventListener,
    );

    if (this.hasAttribute("open")) {
      removeTrapFocus();
      enableScroll(false);
      this.style.setProperty("opacity", "0");
      this.style.setProperty("visibility", "hidden");

      // Defer: another overlay may take focus before we restore.
      scheduleRestoreReturnFocus(this);
    }

    this.$overlay = null;
    this.$panel = null;
  }

  #handleClick = (): boolean => {
    return this.toggle({ trigger: null, trap: null });
  };

  #handleKeyUp = (event: KeyboardEvent): void => {
    if (event.key === "Escape" && this.hasAttribute("open")) {
      this.close();
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
    const { trigger, trap, drawer } = event.detail;

    if (drawer !== this.id) {
      return;
    }

    this.toggle({ trigger, trap });
  };

  /**
   * Toggles the drawer between open and closed.
   *
   * @param trigger - Element that triggered the toggle, or null.
   * @param trap - Focus-trap root when open (defaults to the drawer).
   * @returns Whether the drawer is open after the toggle.
   */
  toggle({
    trigger,
    trap,
  }: {
    trigger: HTMLElement | null;
    trap: HTMLElement | null;
  }): boolean {
    const opening = !this.hasAttribute("open");

    // Only remember the opener — a close control must not replace it.
    if (opening && trigger) {
      this.trigger = trigger;
    }

    this.trap = trap || this;

    if (!opening) {
      this.close();
      return this.hasAttribute("open");
    }

    return this.open();
  }

  #onCloseTransitionEnd = (event: TransitionEvent): void => {
    if (event.target !== event.currentTarget) {
      return;
    }

    this.$panel?.removeEventListener(
      "transitionend",
      this.#onCloseTransitionEnd,
    );

    if (this.hasAttribute("open")) {
      return;
    }

    this.style.setProperty("opacity", "0");
    this.style.setProperty("visibility", "hidden");
  };

  /**
   * Opens the drawer. Dispatches cancelable `drawer-before-open` with
   * `detail.resolve()` to commit after async work.
   *
   * @returns `false` if already open, still closed after abort, or waiting on `resolve()`.
   */
  open(): boolean {
    if (this.hasAttribute("open")) {
      return false;
    }

    const resolve = (): void => this.setAttribute("open", "");

    const proceed = dispatchEvent(
      document.documentElement,
      EVENTS.DRAWER_BEFORE_OPEN,
      {
        drawer: this.id,
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
   * Closes the drawer. Dispatches cancelable `drawer-before-close` with
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
      EVENTS.DRAWER_BEFORE_CLOSE,
      { drawer: this.id, instance: this, resolve },
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
      this.$panel?.removeEventListener(
        "transitionend",
        this.#onCloseTransitionEnd,
      );

      this.style.setProperty("opacity", "1");
      this.style.setProperty("visibility", "visible");

      rememberReturnFocus(this.trigger);

      dispatchEvent(
        document.documentElement,
        EVENTS.DRAWER_OPEN,
        { drawer: this.id, trigger: this.trigger },
        { bubbles: false, cancelable: false },
      );

      const container = this.trap || this;
      const focusables = getFocusableElements(container);
      if (focusables.length > 0) {
        addTrapFocus(container, focusables[0]);
      }

      disableScroll();
      return;
    }

    this.$panel?.removeEventListener(
      "transitionend",
      this.#onCloseTransitionEnd,
    );

    removeTrapFocus();
    enableScroll(false);

    // Defer: another overlay may take focus before we restore.
    scheduleRestoreReturnFocus(this);

    dispatchEvent(
      document.documentElement,
      EVENTS.DRAWER_CLOSE,
      { drawer: this.id },
      { bubbles: false, cancelable: false },
    );

    this.$panel?.addEventListener("transitionend", this.#onCloseTransitionEnd);
  }
}

if (!customElements.get("cinq-drawer")) {
  customElements.define("cinq-drawer", Drawer);
}
