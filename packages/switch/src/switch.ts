import { EVENTS, dispatchEvent, keycode } from "@agencecinq/utils";
import type { SwitchDetail } from "./types.js";

/**
 * Switch Web Component implementing the WAI-ARIA switch pattern.
 *
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/switch/
 */
export class Switch extends HTMLElement {
  static observedAttributes = ["checked", "disabled"];

  $input: HTMLInputElement | null = null;

  private reflectingAttribute = false;

  connectedCallback(): void {
    this.$input =
      this.querySelector<HTMLInputElement>("[data-switch-input]") ||
      this.querySelector<HTMLInputElement>('input[type="checkbox"]');

    this.addEventListener("click", this.handleClick);
    this.addEventListener("keydown", this.handleKeydown);
    this.addEventListener("focus", this.handleFocus);
    this.addEventListener("blur", this.handleBlur);
  }

  disconnectedCallback(): void {
    this.destroy();
    this.$input = null;
  }

  attributeChangedCallback(
    name: string,
    _oldValue: string | null,
    newValue: string | null,
  ): void {
    if (name === "disabled") {
      this.syncInput();

      if (newValue !== null && this.matches(":focus")) {
        this.blur();
      }

      return;
    }

    if (name !== "checked" || this.reflectingAttribute) {
      return;
    }

    const isChecked = this.getAttribute("aria-checked") === "true";

    if (newValue !== null && !isChecked) {
      this.activate();
      return;
    }

    if (newValue === null && isChecked) {
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
    if (this.disabled) return false;

    if (this.checked) {
      return this.deactivate();
    }

    return this.activate();
  }

  activate(emit = true): boolean {
    if (this.disabled || this.checked) return false;

    if (emit && !dispatchEvent(this, EVENTS.SWITCH_ACTIVATE, this.detail)) {
      return false;
    }

    this.setAttribute("aria-checked", "true");
    this.syncInput();
    this.reflectCheckedAttribute();
    return true;
  }

  deactivate(emit = true): boolean {
    if (this.disabled || !this.checked) return false;

    if (emit && !dispatchEvent(this, EVENTS.SWITCH_DEACTIVATE, this.detail)) {
      return false;
    }

    this.setAttribute("aria-checked", "false");
    this.syncInput();
    this.reflectCheckedAttribute();
    return true;
  }

  destroy(): void {
    this.removeEventListener("click", this.handleClick);
    this.removeEventListener("keydown", this.handleKeydown);
    this.removeEventListener("focus", this.handleFocus);
    this.removeEventListener("blur", this.handleBlur);
  }

  private handleClick = (event: MouseEvent): void => {
    if (this.disabled) return;

    // Keyboard activation (Space / Enter) is handled in handleKeydown.
    // Ignore the synthesized click (detail === 0) to avoid double toggling.
    if (event.detail === 0) return;

    this.toggle();
  };

  private handleKeydown = (event: KeyboardEvent): void => {
    if (this.disabled) return;

    if (event.keyCode !== keycode.SPACE && event.keyCode !== keycode.ENTER) {
      return;
    }

    event.preventDefault();
    this.toggle();
  };

  private handleFocus = (): void => {
    this.classList.add("focus");
  };

  private handleBlur = (): void => {
    this.classList.remove("focus");
  };

  private get detail(): SwitchDetail {
    return { el: this };
  }

  private syncInput(): void {
    if (!this.$input) return;

    const checked = this.checked;

    this.$input.checked = checked;

    if (checked) {
      this.$input.setAttribute("checked", "");
    } else {
      this.$input.removeAttribute("checked");
    }

    this.$input.disabled = this.disabled;

    if (this.disabled) {
      this.$input.setAttribute("disabled", "");
    } else {
      this.$input.removeAttribute("disabled");
    }
  }

  private reflectCheckedAttribute(): void {
    this.reflectingAttribute = true;

    if (this.getAttribute("aria-checked") === "true") {
      this.setAttribute("checked", "");
    } else {
      this.removeAttribute("checked");
    }

    this.reflectingAttribute = false;
  }
}

if (!customElements.get("cinq-switch")) {
  customElements.define("cinq-switch", Switch);
}
