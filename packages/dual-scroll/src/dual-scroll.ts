import { clamp, parseNumber } from "@agencecinq/utils";
import { SPRING_DEFAULT, SPRING_MAX, SPRING_MIN } from "./types.js";

const COLUMN_LEFT = '[data-scroll-column="left"]';
const COLUMN_RIGHT = '[data-scroll-column="right"]';

/**
 * Two columns inside a sized host, one inverted scroll with spring easing.
 * Markup supplies `[data-scroll-column="left"|"right"]` and stacked panes.
 */
export class DualScroll extends HTMLElement {
  static observedAttributes = ["spring"];

  #left: HTMLElement | null = null;
  #right: HTMLElement | null = null;
  #resizeObserver: ResizeObserver | null = null;
  #rafId = 0;
  #active = false;
  #touchActive = false;
  #didInitialScroll = false;
  #touchStartY = 0;

  #scrollValue = 0;
  #scrollTarget = 0;
  #scrollBottom = 0;

  #handleWindowWheel = (event: WheelEvent): void => {
    if (!this.#containsPoint(event.clientX, event.clientY)) {
      return;
    }

    event.preventDefault();
    this.#applyScrollDelta(event.deltaY);
  };

  #handleTouchStart = (event: TouchEvent): void => {
    if (event.touches.length !== 1) {
      return;
    }

    this.#touchActive = true;
    this.#touchStartY = event.touches[0].clientY;
    window.addEventListener("touchmove", this.#handleWindowTouchMove, {
      passive: false,
    });
    window.addEventListener("touchend", this.#handleTouchEnd, {
      passive: true,
    });
    window.addEventListener("touchcancel", this.#handleTouchEnd, {
      passive: true,
    });
  };

  #handleWindowTouchMove = (event: TouchEvent): void => {
    if (!this.#touchActive || event.touches.length !== 1) {
      return;
    }

    const delta = this.#touchStartY - event.touches[0].clientY;
    this.#touchStartY = event.touches[0].clientY;

    event.preventDefault();
    this.#applyScrollDelta(delta);
  };

  #handleTouchEnd = (): void => {
    this.#touchActive = false;
    window.removeEventListener("touchmove", this.#handleWindowTouchMove);
    window.removeEventListener("touchend", this.#handleTouchEnd);
    window.removeEventListener("touchcancel", this.#handleTouchEnd);
  };

  connectedCallback(): void {
    this.init();
  }

  disconnectedCallback(): void {
    this.destroy();
    this.#left = null;
    this.#right = null;
  }

  attributeChangedCallback(
    name: string,
    _oldValue: string | null,
    _newValue: string | null,
  ): void {
    if (name === "spring" && this.#resizeObserver) {
      this.sync();
    }
  }

  /**
   * Bind columns, listeners, and the animation loop.
   * Call {@link destroy} first if already bound.
   */
  init(): void {
    if (this.#resizeObserver) {
      return;
    }

    this.#left = this.querySelector(COLUMN_LEFT);
    this.#right = this.querySelector(COLUMN_RIGHT);

    if (!this.#left || !this.#right) {
      throw new Error(
        'DualScroll requires [data-scroll-column="left"] and [data-scroll-column="right"]',
      );
    }

    this.#active = true;

    window.addEventListener("wheel", this.#handleWindowWheel, {
      passive: false,
    });
    this.addEventListener("touchstart", this.#handleTouchStart, {
      passive: true,
    });

    this.#resizeObserver = new ResizeObserver(() => this.sync());
    this.#resizeObserver.observe(this);

    this.sync();
    this.#rafId = requestAnimationFrame(this.#update);
  }

  /** Detaches listeners and stops the animation loop. */
  destroy(): void {
    if (!this.#resizeObserver) {
      return;
    }

    this.#active = false;
    this.#touchActive = false;
    this.#didInitialScroll = false;

    if (this.#rafId) {
      cancelAnimationFrame(this.#rafId);
      this.#rafId = 0;
    }

    window.removeEventListener("wheel", this.#handleWindowWheel);
    this.removeEventListener("touchstart", this.#handleTouchStart);
    this.#handleTouchEnd();

    this.#resizeObserver.disconnect();
    this.#resizeObserver = null;
  }

  /** Re-measure the host and clamp the scroll target. */
  sync(): void {
    const height = this.clientHeight;

    if (height === 0) {
      return;
    }

    this.style.setProperty("--dual-scroll-pane-height", `${height}px`);

    const counter = Math.max(
      this.#left?.children.length ?? 0,
      this.#right?.children.length ?? 0,
    );

    this.#scrollBottom = height + height * counter;
    this.#scrollTarget = clamp(this.#scrollTarget, 0, this.#scrollBottom);

    if (!this.#didInitialScroll) {
      // First pane pair sits off-screen until scrollValue reaches host height
      this.#scrollTarget = height;
      this.#scrollValue = height;
      this.#didInitialScroll = true;
    }

    this.#applyTransforms();
  }

  #update = (): void => {
    if (!this.#active) {
      return;
    }

    const spring = this.#spring();
    this.#scrollValue +=
      (this.#scrollTarget - this.#scrollValue) * spring;
    this.#scrollValue = Math.round(
      clamp(this.#scrollValue, -1, this.#scrollBottom + 1),
    );

    this.#applyTransforms();
    this.#rafId = requestAnimationFrame(this.#update);
  };

  #applyTransforms(): void {
    if (this.#right) {
      this.#right.style.transform = `translate3d(0, ${this.#scrollValue}px, 0)`;
    }

    if (this.#left) {
      this.#left.style.transform = `translate3d(0, ${-this.#scrollValue}px, 0)`;
    }
  }

  #spring(): number {
    return clamp(
      parseNumber(this.getAttribute("spring"), SPRING_DEFAULT),
      SPRING_MIN,
      SPRING_MAX,
    );
  }

  #applyScrollDelta(delta: number): void {
    if (delta === 0 || this.#scrollBottom === 0) {
      return;
    }

    this.#scrollTarget = Math.round(
      clamp(this.#scrollTarget + delta * -1, 0, this.#scrollBottom),
    );
  }

  #containsPoint(x: number, y: number): boolean {
    const rect = this.getBoundingClientRect();

    return (
      x >= rect.left &&
      x <= rect.right &&
      y >= rect.top &&
      y <= rect.bottom
    );
  }
}

if (!customElements.get("cinq-dual-scroll")) {
  customElements.define("cinq-dual-scroll", DualScroll);
}
