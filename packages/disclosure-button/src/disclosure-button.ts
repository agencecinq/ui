import { EVENTS, dispatchEvent } from "@agencecinq/utils";
import type { Detail } from "./types.js";

const { DISCLOSURE_BUTTON_OPEN, DISCLOSURE_BUTTON_CLOSE } = EVENTS;

/**
 * Disclosure button Web Component wrapping a slotted trigger.
 *
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/
 * @see https://w3c.github.io/aria/#dom-ariamixin-ariacontrolselements
 */
export class DisclosureButton extends HTMLElement {
  $button: HTMLButtonElement | null = null;
  elements: HTMLElement[] = [];

  connectedCallback(): void {
    this.init();
  }

  disconnectedCallback(): void {
    this.destroy();
    this.$button = null;
    this.elements = [];
  }

  /**
   * Bind markup + listeners. Call {@link destroy} first if already bound.
   */
  init(): void {
    this.$button = this.querySelector<HTMLButtonElement>("button");

    if (!this.$button) {
      throw new Error("DisclosureButton: button element not found");
    }

    this.elements = (this.$button.ariaControlsElements ?? []) as HTMLElement[];

    this.$button.addEventListener("click", this.#handleClick);
  }

  get expanded(): boolean {
    return this.$button?.getAttribute("aria-expanded") === "true";
  }

  get #visibleElements(): HTMLElement[] {
    return this.elements.filter((element) => !element.hidden);
  }

  get #allVisibleElements(): boolean {
    return (
      this.elements.length > 0 &&
      this.#visibleElements.length === this.elements.length
    );
  }

  /**
   * Toggles open/closed.
   * Closes when any controlled element is visible; otherwise opens all.
   * @returns `false` if a cancelable event was aborted.
   */
  toggle(): boolean {
    if (!this.$button) {
      return false;
    }

    if (this.#visibleElements.length > 0) {
      if (
        !dispatchEvent(
          this.$button,
          DISCLOSURE_BUTTON_CLOSE,
          this.#detail(false),
        )
      ) {
        return false;
      }

      this.close(false);
      return true;
    }

    if (
      !dispatchEvent(
        this.$button,
        DISCLOSURE_BUTTON_OPEN,
        this.#detail(true),
      )
    ) {
      return false;
    }

    this.open(false);
    return true;
  }

  /** Hides every controlled element. Dispatches a close event by default. */
  close(emit = true): void {
    if (!this.$button) {
      return;
    }

    if (emit && this.#visibleElements.length > 0) {
      if (
        !dispatchEvent(
          this.$button,
          DISCLOSURE_BUTTON_CLOSE,
          this.#detail(false),
        )
      ) {
        return;
      }
    }

    this.elements.forEach((element) => {
      element.hidden = true;
    });
    this.update();
  }

  /** Shows every controlled element. Dispatches an open event by default. */
  open(emit = true): void {
    if (!this.$button) {
      return;
    }

    if (emit && !this.#allVisibleElements) {
      if (
        !dispatchEvent(
          this.$button,
          DISCLOSURE_BUTTON_OPEN,
          this.#detail(true),
        )
      ) {
        return;
      }
    }

    this.elements.forEach((element) => {
      element.hidden = false;
    });
    this.update();
  }

  /**
   * Syncs `aria-expanded` from controlled element visibility.
   * Call after an external dismiss so the trigger stays honest.
   */
  update(): void {
    if (!this.$button) return;

    this.$button.setAttribute(
      "aria-expanded",
      this.#visibleElements.length > 0 ? "true" : "false",
    );
  }

  /** Detaches listeners. Safe to call from outside while the host stays mounted. */
  destroy(): void {
    if (!this.$button) {
      return;
    }

    this.$button.removeEventListener("click", this.#handleClick);
  }

  #handleClick = (): void => {
    this.toggle();
  };

  #detail(open: boolean): Detail {
    return {
      ids: this.elements.map((element) => element.id),
      elements: this.elements,
      $button: this.$button!,
      open,
    };
  }
}

if (!customElements.get("cinq-disclosure-button")) {
  customElements.define("cinq-disclosure-button", DisclosureButton);
}
