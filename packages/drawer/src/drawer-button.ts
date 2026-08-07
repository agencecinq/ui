import { EVENTS, dispatchEvent } from "@agencecinq/utils";

export class DrawerButton extends HTMLElement {
  /** Controlled drawer identifiers from `ariaControlsElements`. */
  controls: string[] = [];
  $button: HTMLButtonElement | null = null;

  #handleDrawerClose = (event: CustomEvent<{ drawer: string }>) => {
    if (this.$button && this.controls.includes(event.detail.drawer)) {
      this.$button.setAttribute("aria-expanded", "false");
    }
  };

  #handleDrawerOpen = (event: CustomEvent<{ drawer: string }>) => {
    if (this.$button && this.controls.includes(event.detail.drawer)) {
      this.$button.setAttribute("aria-expanded", "true");
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
    this.$button =
      this.querySelector("[data-button]") || this.querySelector("button");

    if (!this.$button) {
      throw new Error("DrawerButton: button element not found");
    }

    // IDL: `ariaControlsElements` reflects `aria-controls` ID references.
    this.controls = (this.$button.ariaControlsElements ?? []).map(
      (element) => element.id,
    );

    this.$button.addEventListener("click", this.#handleClick);
    document.documentElement.addEventListener(
      EVENTS.DRAWER_CLOSE,
      this.#handleDrawerClose as EventListener,
    );
    document.documentElement.addEventListener(
      EVENTS.DRAWER_OPEN,
      this.#handleDrawerOpen as EventListener,
    );
  }

  /** Detaches listeners. Safe to call from outside while the host stays mounted. */
  destroy(): void {
    if (this.$button) {
      this.$button.removeEventListener("click", this.#handleClick);
    }
    document.documentElement.removeEventListener(
      EVENTS.DRAWER_CLOSE,
      this.#handleDrawerClose as EventListener,
    );
    document.documentElement.removeEventListener(
      EVENTS.DRAWER_OPEN,
      this.#handleDrawerOpen as EventListener,
    );
  }

  #handleClick = () => {
    const trapId = this.$button?.getAttribute("data-trap");

    this.controls.forEach(control => {
      const detail = {
        trigger: this.$button,
        trap: trapId ? document.getElementById(trapId) : null,
        drawer: control,
      };

      dispatchEvent(document.documentElement, EVENTS.DRAWER_TOGGLE, detail, {
        bubbles: false,
        cancelable: false,
      });
    });
  };
}

if (!customElements.get("cinq-drawer-button")) {
  customElements.define("cinq-drawer-button", DrawerButton);
}
