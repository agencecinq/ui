import { EVENTS, dispatchEvent } from "@agencecinq/utils";
import type { Detail } from "./types.js";

/**
 * Switch Web Component implementing the WAI-ARIA switch pattern. It is a
 * form-associated custom element: with a `name`, it submits its `value` while
 * on, like a checkbox.
 *
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/switch/
 */
export class Switch extends HTMLElement {
  static formAssociated = true;
  static observedAttributes = ["aria-checked", "value"];

  #internals = this.attachInternals();
  #defaultChecked: boolean | null = null;

  connectedCallback(): void {
    this.init();
  }

  disconnectedCallback(): void {
    this.destroy();
  }

  /**
   * Bind listeners and submit the current state. Call {@link destroy} first if
   * already bound.
   */
  init(): void {
    this.#defaultChecked ??= this.checked;

    this.addEventListener("click", this.#handleClick);
    this.addEventListener("keydown", this.#handleKeydown);
    this.#update();
  }

  /** `aria-checked` is the state: whoever writes it, the form value follows. */
  attributeChangedCallback(): void {
    this.#update();
  }

  formResetCallback(): void {
    this.#set(this.#defaultChecked ?? false);
  }

  formStateRestoreCallback(state: string | null): void {
    this.#set(state === "true");
  }

  /** Submitted while on, `"on"` without a `value` attribute, as on a checkbox. */
  get value(): string {
    return this.getAttribute("value") ?? "on";
  }

  get checked(): boolean {
    return this.getAttribute("aria-checked") === "true";
  }

  /** `:disabled` covers `disabled` and a disabled `<fieldset>`, as on a native field. */
  get disabled(): boolean {
    return (
      this.matches(":disabled") || this.getAttribute("aria-disabled") === "true"
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

    this.#set(true);
    return true;
  }

  deactivate(emit = true): boolean {
    if (this.disabled || !this.checked) return false;

    if (emit && !dispatchEvent(this, EVENTS.SWITCH_DEACTIVATE, this.#detail)) {
      return false;
    }

    this.#set(false);
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

  /** Write the state without events, even while disabled, as a form reset does. */
  #set(checked: boolean): void {
    this.setAttribute("aria-checked", String(checked));
  }

  /** Submit `value` while on, nothing while off. */
  #update(): void {
    this.#internals.setFormValue(
      this.checked ? this.value : null,
      String(this.checked),
    );
  }
}

if (!customElements.get("cinq-switch")) {
  customElements.define("cinq-switch", Switch);
}
