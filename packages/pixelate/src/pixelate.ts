import { clamp, parseNumber } from "@agencecinq/utils";
import { PIXEL_MAX, PIXEL_MIN } from "./types.js";

/**
 * Wraps an `<img>` and sibling `<canvas>`.
 * Reads `pixel` (`0`–`256`): block size in CSS px. Sharp at `0`–`1`, larger blocks above.
 * Crop is centered `cover`.
 */
export class Pixelate extends HTMLElement {
  static observedAttributes = ["pixel"];

  $img: HTMLImageElement | null = null;
  $canvas: HTMLCanvasElement | null = null;

  #context: CanvasRenderingContext2D | null = null;
  #resizeObserver: ResizeObserver | null = null;
  #rafId = 0;
  #handleLoad = this.sync.bind(this);

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
    // Ignore until init has wired the observer
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
      this.sync();
    }

    this.#resizeObserver = new ResizeObserver(() => this.sync());
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

    // Coalesce resize and load bursts into one draw
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

  #pixel(): number {
    return clamp(
      parseNumber(this.getAttribute("pixel"), PIXEL_MAX),
      PIXEL_MIN,
      PIXEL_MAX,
    );
  }

  #layout(): { width: number; height: number } {
    const { clientWidth: width, clientHeight: height } = this.$canvas!;

    return { width, height };
  }

  // drawImage source crop: sx/sy top-left in the image, sw/sh width and height
  #rect(
    width: number,
    height: number,
  ): { sx: number; sy: number; sw: number; sh: number } {
    // Centered cover: map the canvas box back onto natural image coordinates
    const iw = this.$img!.naturalWidth;
    const ih = this.$img!.naturalHeight;
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

  #reset(
    width: number,
    height: number,
    sx: number,
    sy: number,
    sw: number,
    sh: number,
  ): void {
    // Sharp image: hi-DPR buffer, smoothing on
    const dpr = window.devicePixelRatio || 1;
    const bufferWidth = Math.round(width * dpr);
    const bufferHeight = Math.round(height * dpr);

    if (
      this.$canvas!.width !== bufferWidth ||
      this.$canvas!.height !== bufferHeight
    ) {
      this.$canvas!.width = bufferWidth;
      this.$canvas!.height = bufferHeight;
    }

    this.#context!.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.#context!.clearRect(0, 0, width, height);
    // Resizing the bitmap resets the context. Set smoothing before each draw.
    this.#context!.imageSmoothingEnabled = true;
    this.#context!.drawImage(this.$img!, sx, sy, sw, sh, 0, 0, width, height);
  }

  #draw(): void {
    if (!this.$canvas || !this.$img || !this.#context || !this.$img.complete) {
      return;
    }

    const { width, height } = this.#layout();

    if (width === 0 || height === 0) {
      return;
    }

    const pixel = this.#pixel();
    const { sx, sy, sw, sh } = this.#rect(width, height);

    if (pixel <= 1) {
      this.#reset(width, height, sx, sy, sw, sh);
      return;
    }

    // Tiny offscreen buffer, upscaled by the canvas element via CSS
    const sampleWidth = Math.max(1, Math.ceil(width / pixel));
    const sampleHeight = Math.max(1, Math.ceil(height / pixel));

    if (
      this.$canvas.width !== sampleWidth ||
      this.$canvas.height !== sampleHeight
    ) {
      this.$canvas.width = sampleWidth;
      this.$canvas.height = sampleHeight;
    }

    this.#context.setTransform(1, 0, 0, 1, 0, 0);
    this.#context.clearRect(0, 0, sampleWidth, sampleHeight);
    // Resizing the bitmap resets the context. Set smoothing before each draw.
    this.#context.imageSmoothingEnabled = false;
    this.#context.drawImage(
      this.$img,
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
