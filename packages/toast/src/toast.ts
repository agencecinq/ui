import { EVENTS, dispatchEvent } from "@agencecinq/utils";
import type { Detail } from "./types.js";

/**
 * Toast Web Component: transient live-region notification.
 *
 * Does not set `role`. The consumer chooses `role="alert"` or `role="status"`
 * (and optional `aria-live` / `aria-atomic`) in markup.
 *
 * Does not move or trap focus (not an Alert Dialog). Auto-dismiss is opt-in via
 * `data-duration` (milliseconds). Pausing the timer (hover, focus, …) is left
 * to the consumer via {@link pause} / {@link resume}.
 *
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/alert/
 */
export class Toast extends HTMLElement {
  static observedAttributes = ["open"];

  $content: HTMLElement | null = null;
  $dismiss: HTMLButtonElement | null = null;

  #message = "";
  #rafId = 0;
  #clearTimer = 0;
  #started = 0;
  #pauseStarted = 0;
  #paused = false;
  #duration = 0;

  connectedCallback(): void {
    this.init();
  }

  disconnectedCallback(): void {
    this.destroy();
    this.$content = null;
    this.$dismiss = null;
  }

  /**
   * Bind markup + listeners. Call {@link destroy} first if already bound.
   */
  init(): void {
    this.$content = this.querySelector<HTMLElement>("[data-content]");
    this.$dismiss = this.querySelector<HTMLButtonElement>(
      "button[data-dismiss], [data-dismiss]",
    );

    if (this.$dismiss) {
      this.$dismiss.addEventListener("click", this.#handleDismiss);
    }

    if (this.open) {
      this.#startTimer();
    }
  }

  /** Detaches listeners and cancels the auto-dismiss timer. */
  destroy(): void {
    this.#cancelTimer();
    window.clearTimeout(this.#clearTimer);
    this.#clearTimer = 0;

    if (this.$dismiss) {
      this.$dismiss.removeEventListener("click", this.#handleDismiss);
    }
  }

  attributeChangedCallback(
    name: string,
    _oldValue: string | null,
    newValue: string | null,
  ): void {
    if (name !== "open") return;

    if (newValue !== null) {
      this.#onOpen();
      return;
    }

    this.#onClose();
  }

  get open(): boolean {
    return this.hasAttribute("open");
  }

  get message(): string {
    return this.#message;
  }

  set message(value: string) {
    this.#message = value;
    if (this.$content) {
      this.$content.textContent = value;
    }
  }

  /**
   * Auto-dismiss duration in ms from `data-duration`. `0` means no auto-dismiss.
   */
  get duration(): number {
    const raw = this.getAttribute("data-duration");
    if (raw == null || raw === "") return 0;
    const n = Number(raw);
    return Number.isFinite(n) && n > 0 ? n : 0;
  }

  /** Whether the auto-dismiss timer is currently paused. */
  get paused(): boolean {
    return this.#paused;
  }

  /**
   * Show the toast. Optionally set the message first.
   * @returns `false` if already open.
   */
  show(message?: string): boolean {
    if (this.open) return false;

    if (typeof message === "string") {
      this.message = message;
    }

    this.setAttribute("open", "");
    return true;
  }

  /**
   * Hide the toast.
   * @returns `false` if already closed.
   */
  close(): boolean {
    if (!this.open) return false;
    this.removeAttribute("open");
    return true;
  }

  /**
   * Toggle open state. When opening, optionally set the message.
   */
  toggle(message?: string): boolean {
    if (this.open) {
      return this.close();
    }
    return this.show(message);
  }

  /**
   * Pause auto-dismiss (and `--toast-progress`). No-op if already paused.
   * Wire hover / focus / keyboard from the consumer.
   */
  pause(): void {
    this.#paused = true;
  }

  /**
   * Resume auto-dismiss after {@link pause}. No-op if not paused.
   */
  resume(): void {
    this.#paused = false;
  }

  #onOpen(): void {
    window.clearTimeout(this.#clearTimer);
    this.#clearTimer = 0;
    this.removeEventListener("transitionend", this.#clearAfterClose);

    if (this.$content && this.#message) {
      this.$content.textContent = this.#message;
    }

    this.#paused = false;
    this.#duration = this.duration;
    this.style.setProperty("--toast-progress", "0%");
    this.#startTimer();

    dispatchEvent(this, EVENTS.TOAST_OPEN, this.#detail, { cancelable: false });
  }

  #onClose(): void {
    this.#cancelTimer();
    this.#paused = false;

    if (this.contains(document.activeElement)) {
      (document.activeElement as HTMLElement).blur();
    }

    window.clearTimeout(this.#clearTimer);
    this.removeEventListener("transitionend", this.#clearAfterClose);
    this.addEventListener("transitionend", this.#clearAfterClose, { once: true });
    // Fallback when no CSS transition is attached to the host.
    this.#clearTimer = window.setTimeout(() => this.#clearAfterClose(), 400);

    dispatchEvent(this, EVENTS.TOAST_CLOSE, this.#detail, { cancelable: false });
  }

  #clearAfterClose = (): void => {
    window.clearTimeout(this.#clearTimer);
    this.#clearTimer = 0;
    this.removeEventListener("transitionend", this.#clearAfterClose);

    // Re-opened before the close transition finished.
    if (this.open) return;

    if (this.$content) {
      this.$content.textContent = "";
    }
    this.#message = "";
    this.style.setProperty("--toast-progress", "0%");
  };

  #handleDismiss = (event: Event): void => {
    event.preventDefault();
    this.close();
  };

  #startTimer(): void {
    this.#cancelTimer();
    if (this.#duration <= 0) return;

    this.#started = performance.now();
    this.#pauseStarted = 0;
    this.#rafId = requestAnimationFrame(this.#tick);
  }

  #cancelTimer(): void {
    cancelAnimationFrame(this.#rafId);
    this.#rafId = 0;
  }

  #tick = (now: number): void => {
    if (this.#paused) {
      if (!this.#pauseStarted) {
        this.#pauseStarted = now;
      }
      this.#rafId = requestAnimationFrame(this.#tick);
      return;
    }

    if (this.#pauseStarted) {
      this.#started += now - this.#pauseStarted;
      this.#pauseStarted = 0;
    }

    const elapsed = now - this.#started;
    const progress = Math.min(100, (elapsed / this.#duration) * 100);
    this.style.setProperty("--toast-progress", `${progress}%`);

    if (progress >= 100) {
      this.close();
      return;
    }

    this.#rafId = requestAnimationFrame(this.#tick);
  };

  get #detail(): Detail {
    return { el: this, message: this.#message };
  }
}

if (!customElements.get("cinq-toast")) {
  customElements.define("cinq-toast", Toast);
}
