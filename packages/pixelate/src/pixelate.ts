import { clamp, parseNumber } from "@agencecinq/utils";
import { PIXEL_MAX, PIXEL_MIN } from "./types.js";

/**
 * Wraps an `<img>` and sibling `<canvas>`. Reads `pixel` (`0`–`256`).
 * At `0` the image is sharp; higher values increase block size.
 * Canvas crop is always centered `cover`.
 */
export class Pixelate extends HTMLElement {
  static observedAttributes = ["pixel"];

  $img: HTMLImageElement | null = null;
  $canvas: HTMLCanvasElement | null = null;

  #context: CanvasRenderingContext2D | null = null;
  #resizeObserver: ResizeObserver | null = null;
  #rafId = 0;

  #handleLoad = (): void => {
    this.#resize();
    this.sync();
  };

  connectedCallback(): void {
    this.init();
  }

  disconnectedCallback(): void {
    this.destroy();
    this.$img = null;
    this.$canvas = null;
    this.#context = null;
  }

  attributeChangedCallback(
    name: string,
    _oldValue: string | null,
    _newValue: string | null,
  ): void {
    if (name === "pixel" && this.#resizeObserver) {
      this.sync();
    }
  }

  /**
   * Bind markup + listeners. Call {@link destroy} first if already bound.
   */
  init(): void {
    if (this.#resizeObserver) {
      return;
    }

    this.$img = this.querySelector("img");

    if (!this.$img) {
      throw new Error("Pixelate must contain an img element");
    }

    this.$canvas = this.querySelector("canvas");

    if (!this.$canvas) {
      throw new Error("Pixelate must contain a canvas element");
    }

    this.#context = this.$canvas.getContext("2d");

    this.$img.addEventListener("load", this.#handleLoad);

    if (this.$img.complete) {
      this.#handleLoad();
    }

    this.#resizeObserver = new ResizeObserver(() => {
      this.#resize();
      this.sync();
    });
    this.#resizeObserver.observe(this.$canvas);

    this.sync();
  }

  /** Detaches listeners. Safe to call from outside while the host stays mounted. */
  destroy(): void {
    if (!this.#resizeObserver) {
      return;
    }

    this.$img?.removeEventListener("load", this.#handleLoad);
    this.#resizeObserver.disconnect();
    this.#resizeObserver = null;
    this.#cancel();
    this.#context = null;
  }

  /** Re-read `pixel` and redraw. */
  sync(): void {
    if (this.#rafId) {
      return;
    }

    this.#rafId = requestAnimationFrame(() => {
      this.#rafId = 0;
      this.#draw();
    });
  }

  #cancel(): void {
    if (!this.#rafId) {
      return;
    }

    cancelAnimationFrame(this.#rafId);
    this.#rafId = 0;
  }

  #pixelSize(): number {
    return clamp(
      parseNumber(this.getAttribute("pixel"), PIXEL_MAX),
      PIXEL_MIN,
      PIXEL_MAX,
    );
  }

  #layout(): { width: number; height: number } {
    const canvas = this.$canvas;

    if (!canvas) {
      return { width: 0, height: 0 };
    }

    return { width: canvas.clientWidth, height: canvas.clientHeight };
  }

  #resize(): void {
    if (!this.$canvas || !this.$img) {
      return;
    }

    const { width, height } = this.#layout();

    if (width === 0 || height === 0) {
      return;
    }

    const pixelSize = this.#pixelSize();
    const context = this.#context;

    if (pixelSize <= 1) {
      const dpr = window.devicePixelRatio || 1;
      const bufferWidth = Math.round(width * dpr);
      const bufferHeight = Math.round(height * dpr);

      if (
        this.$canvas.width !== bufferWidth ||
        this.$canvas.height !== bufferHeight
      ) {
        this.$canvas.width = bufferWidth;
        this.$canvas.height = bufferHeight;
      }

      context?.setTransform(dpr, 0, 0, dpr, 0, 0);
    } else {
      const sampleWidth = Math.max(1, Math.ceil(width / pixelSize));
      const sampleHeight = Math.max(1, Math.ceil(height / pixelSize));

      if (
        this.$canvas.width !== sampleWidth ||
        this.$canvas.height !== sampleHeight
      ) {
        this.$canvas.width = sampleWidth;
        this.$canvas.height = sampleHeight;
      }

      context?.setTransform(1, 0, 0, 1, 0, 0);
    }

    this.#syncSharpAttribute(pixelSize);
  }

  #syncSharpAttribute(pixelSize: number): void {
    if (pixelSize <= 1) {
      this.setAttribute("sharp", "");
      return;
    }

    this.removeAttribute("sharp");
  }

  #sourceRect(
    width: number,
    height: number,
  ): { sx: number; sy: number; sw: number; sh: number } {
    const img = this.$img!;
    const iw = img.naturalWidth;
    const ih = img.naturalHeight;
    const scale = Math.max(width / iw, height / ih);
    const dw = iw * scale;
    const dh = ih * scale;
    const dx = (width - dw) / 2;
    const dy = (height - dh) / 2;

    return {
      sx: Math.max(0, -dx / scale),
      sy: Math.max(0, -dy / scale),
      sw: width / scale,
      sh: height / scale,
    };
  }

  #draw(): void {
    if (!this.$canvas || !this.$img || !this.#context || !this.$img.complete) {
      return;
    }

    const { width, height } = this.#layout();

    if (width === 0 || height === 0) {
      return;
    }

    this.#resize();

    const pixelSize = this.#pixelSize();
    const context = this.#context;
    const img = this.$img;

    if (pixelSize <= 1) {
      context.clearRect(0, 0, width, height);

      const { sx, sy, sw, sh } = this.#sourceRect(width, height);

      context.imageSmoothingEnabled = true;
      context.drawImage(img, sx, sy, sw, sh, 0, 0, width, height);
      return;
    }

    const sampleWidth = Math.max(1, Math.ceil(width / pixelSize));
    const sampleHeight = Math.max(1, Math.ceil(height / pixelSize));
    const { sx, sy, sw, sh } = this.#sourceRect(width, height);

    context.clearRect(0, 0, sampleWidth, sampleHeight);
    context.imageSmoothingEnabled = false;
    context.drawImage(
      img,
      sx,
      sy,
      sw,
      sh,
      0,
      0,
      sampleWidth,
      sampleHeight,
    );
  }
}

if (!customElements.get("cinq-pixelate")) {
  customElements.define("cinq-pixelate", Pixelate);
}
