import { EVENTS, dispatchEvent } from "@agencecinq/utils";
import type { Detail } from "./types.js";

/**
 * Switch Web Component implementing the WAI-ARIA switch pattern.
 *
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/switch/
 */
export class Switch extends HTMLElement {
  static observedAttributes = ["checked", "disabled"];

  $input: HTMLInputElement | null = null;

  connectedCallback(): void {
    this.init();
  }

  disconnectedCallback(): void {
    this.destroy();
    this.$input = null;
  }

  /**
   * Bind markup + listeners. Call {@link destroy} first if already bound.
   */
  init(): void {
    this.$input = this.querySelector<HTMLInputElement>("input");

    this.addEventListener("click", this.#handleClick);
    this.addEventListener("keydown", this.#handleKeydown);
    this.#update();
  }

  attributeChangedCallback(
    name: string,
    _oldValue: string | null,
    newValue: string | null,
  ): void {
    if (name === "disabled") {
      this.#update();

      if (newValue !== null && this.matches(":focus")) {
        this.blur();
      }

      return;
    }

    if (name !== "checked") {
      return;
    }

    if (newValue !== null && !this.checked) {
      this.activate();
      return;
    }

    if (newValue === null && this.checked) {
      this.deactivate();
    }
  }

  get checked(): boolean {
    return this.getAttribute("aria-checked") === "true";
  }

  get disabled(): boolean {
    return (
      this.hasAttribute("disabled") ||
      this.getAttribute("aria-disabled") === "true"
    );
  }

  toggle(): boolean {
    if (this.disabled) {
      return false;
    }

    if (this.checked) {
      return this.deactivate();
    }

    return this.activate();
  }

  activate(emit = true): boolean {
    if (this.disabled || this.checked) return false;

    if (emit && !dispatchEvent(this, EVENTS.SWITCH_ACTIVATE, this.#detail)) {
      return false;
    }

    this.setAttribute("aria-checked", "true");
    this.#update();
    this.setAttribute("checked", "");
    return true;
  }

  deactivate(emit = true): boolean {
    if (this.disabled || !this.checked) return false;

    if (emit && !dispatchEvent(this, EVENTS.SWITCH_DEACTIVATE, this.#detail)) {
      return false;
    }

    this.setAttribute("aria-checked", "false");
    this.#update();
    this.removeAttribute("checked");

    return true;
  }

  destroy(): void {
    this.removeEventListener("click", this.#handleClick);
    this.removeEventListener("keydown", this.#handleKeydown);
  }

  #handleClick = (event: MouseEvent): void => {
    if (this.disabled) {
      return;
    }

    if (event.detail === 0) {
      return;
    }

    this.toggle();
  };

  #handleKeydown = (event: KeyboardEvent): void => {
    if (this.disabled) {
      return;
    }

    if (event.key !== " " && event.key !== "Enter") {
      return;
    }

    event.preventDefault();
    this.toggle();
  };

  get #detail(): Detail {
    return { el: this };
  }

  #update(): void {
    if (!this.$input) {
      return;
    }

    this.$input.checked = this.checked;
    this.$input.toggleAttribute("checked", this.checked);

    this.$input.disabled = this.disabled;
    this.$input.toggleAttribute("disabled", this.disabled);
  }
}

if (!customElements.get("cinq-switch")) {
  customElements.define("cinq-switch", Switch);
}
