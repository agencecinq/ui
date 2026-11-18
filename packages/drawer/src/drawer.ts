import { EVENTS, dispatchBeforeEvent } from "@agencecinq/utils";

export type { BeforeCloseDetail, BeforeOpenDetail } from "./types.js";

/** Safari lacks `closedby`: the drawer handles `closedby="any"` itself there. */
const supportsClosedBy = "closedBy" in HTMLDialogElement.prototype;

export class Drawer extends HTMLElement {
  trigger: HTMLElement | null = null;
  $dialog: HTMLDialogElement | null = null;

  #pending: Promise<boolean> | null = null;

  /** `<dialog popover>`: a non-modal drawer, toggled by its buttons. */
  get #popover(): boolean {
    return this.$dialog?.hasAttribute("popover") ?? false;
  }

  get #open(): boolean {
    if (!this.$dialog) {
      return false;
    }

    return this.#popover
      ? this.$dialog.matches(":popover-open")
      : this.$dialog.open;
  }

  /**
   * Invoker commands on the dialog: open and close requests go through the
   * before-events. A button with `data-replace` opens this drawer in place of
   * the one it sits in.
   */
  #handleCommand = (event: CommandEvent): void => {
    const source = event.source instanceof HTMLElement ? event.source : null;
    const action = this.#action(event.command);

    if (!action) {
      return;
    }

    event.preventDefault();

    if (action === "close") {
      // The button's value becomes the dialog's returnValue, as natively.
      const returnValue = source?.getAttribute("value") ?? undefined;

      this.close(returnValue);
      return;
    }

    const current = source?.hasAttribute("data-replace")
      ? source.closest("cinq-drawer")
      : null;

    this.trigger = source;

    if (current instanceof Drawer && current !== this) {
      this.#replace(current);
    } else {
      this.show();
    }
  };

  /** Escape and light dismiss of a modal drawer: route through `close()` unless the browser forces the close. */
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

  connectedCallback(): void {
    this.init();
  }

  disconnectedCallback(): void {
    this.destroy();
    this.$dialog = null;
  }

  /**
   * Bind dialog listeners. Call {@link destroy} first if already bound.
   */
  init(): void {
    this.$dialog = this.querySelector("dialog");

    if (!this.$dialog) {
      throw new Error("Drawer: No <dialog> found");
    }

    if (!this.$dialog.id) {
      throw new Error("Drawer: dialog id attribute is required");
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

    this.#commit(false);
  }

  /**
   * Opens the drawer. Dispatches cancelable `drawer:before-open`: listeners
   * cancel with `preventDefault()` or defer with `detail.waitUntil(promise)`.
   *
   * @returns Whether this call opened the drawer.
   */
  show(): Promise<boolean> {
    return this.#show(() => this.#commit(true));
  }

  /**
   * Closes the drawer. Dispatches cancelable `drawer:before-close`: listeners
   * cancel with `preventDefault()` or defer with `detail.waitUntil(promise)`.
   *
   * @param returnValue - Becomes the dialog's `returnValue` on a modal drawer, as with `dialog.close()`.
   * @returns Whether this call closed the drawer.
   */
  close(returnValue?: string): Promise<boolean> {
    if (!this.$dialog || !this.#open) {
      return Promise.resolve(false);
    }

    const detail = { drawer: this.$dialog.id, instance: this };

    return this.#request(EVENTS.DRAWER_BEFORE_CLOSE, detail, () =>
      this.#commit(false, returnValue),
    );
  }

  /** The open or close a command asks for, among the commands of the dialog's mode. */
  #action(command: string): "show" | "close" | null {
    if (this.#popover) {
      switch (command) {
        case "show-popover":
          return "show";
        case "hide-popover":
          return "close";
        case "toggle-popover":
          return this.#open ? "close" : "show";
      }

      return null;
    }

    switch (command) {
      case "show-modal":
        return "show";
      case "request-close":
        return "close";
    }

    return null;
  }

  /**
   * Opens in place of `current`. Like a navigation, this drawer accepts the
   * open first, so `current` stays open when its `drawer:before-open` cancels.
   */
  #replace(current: Drawer): Promise<boolean> {
    return this.#show(async () => {
      const closed = await current.close();

      return closed && this.#commit(true);
    });
  }

  #show(commit: () => boolean | Promise<boolean>): Promise<boolean> {
    if (!this.$dialog || this.#open) {
      return Promise.resolve(false);
    }

    const detail = {
      drawer: this.$dialog.id,
      instance: this,
      trigger: this.trigger,
    };

    return this.#request(EVENTS.DRAWER_BEFORE_OPEN, detail, commit);
  }

  /** Opens or closes the dialog, unless it is already in that state. */
  #commit(open: boolean, returnValue?: string): boolean {
    const $dialog = this.$dialog;

    if (!$dialog || this.#open === open) {
      return false;
    }

    if (this.#popover) {
      // The source makes the trigger the invoker: its click toggles instead of light dismissing.
      const source = this.trigger ?? undefined;

      if (open) {
        $dialog.showPopover({ source });
      } else {
        $dialog.hidePopover();
      }
    } else if (open) {
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

if (!customElements.get("cinq-drawer")) {
  customElements.define("cinq-drawer", Drawer);
}
