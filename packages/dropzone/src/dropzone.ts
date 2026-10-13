import { EVENTS, dispatchEvent } from "@agencecinq/utils";
import { filter } from "./filter.js";
import type { ChangeDetail, RejectDetail } from "./types.js";

/**
 * Drop zone Web Component: files dragged onto the host go to a native file
 * input, as if picked in the browser dialog.
 *
 * The input stays the source of truth (`accept`, `multiple`, `disabled`, form
 * submission). It lives inside the host, or anywhere in the document when a
 * `<label for>` inside the host points to it (e.g. an input that must stay in
 * its form). Clicking the label opens the native picker, no script involved.
 */
export class Dropzone extends HTMLElement {
  $label: HTMLLabelElement | null = null;
  $input: HTMLInputElement | null = null;

  /** `dragenter` / `dragleave` pairs, children fire their own. */
  #depth = 0;

  connectedCallback(): void {
    this.init();
  }

  disconnectedCallback(): void {
    this.destroy();
    this.$label = null;
    this.$input = null;
  }

  /** Bind markup + listeners. Call {@link destroy} first if already bound. */
  init(): void {
    this.$label = this.querySelector("label");

    const $control = this.$label?.control;
    const $input =
      this.querySelector<HTMLInputElement>('input[type="file"]') ??
      ($control instanceof HTMLInputElement ? $control : null);

    if (!$input || $input.type !== "file") {
      throw new Error(
        'cinq-dropzone: needs an input[type="file"] inside, or a label[for] pointing to one.',
      );
    }

    this.$input = $input;
    this.addEventListener("dragenter", this.#handleDragEnter);
    this.addEventListener("dragover", this.#handleDragOver);
    this.addEventListener("dragleave", this.#handleDragLeave);
    this.addEventListener("drop", this.#handleDrop);
    this.$input.addEventListener("change", this.#handleChange);
  }

  /** Detaches listeners. */
  destroy(): void {
    this.removeEventListener("dragenter", this.#handleDragEnter);
    this.removeEventListener("dragover", this.#handleDragOver);
    this.removeEventListener("dragleave", this.#handleDragLeave);
    this.removeEventListener("drop", this.#handleDrop);
    this.$input?.removeEventListener("change", this.#handleChange);
    this.#leave();
  }

  /** Largest file in bytes from `data-max-size`. `0` means no limit. */
  get maxSize(): number {
    const size = Number(this.getAttribute("data-max-size"));

    return Number.isFinite(size) && size > 0 ? size : 0;
  }

  /** Files held by the input. */
  get files(): File[] {
    return Array.from(this.$input?.files ?? []);
  }

  /** Empties the input, then dispatches `change` like a user would. */
  clear(): void {
    if (!this.$input) return;

    this.$input.value = "";
    this.#change();
  }

  #accepting(event: DragEvent): boolean {
    const types = Array.from(event.dataTransfer?.types ?? []);

    return types.includes("Files") && !this.$input?.disabled;
  }

  #handleDragEnter = (event: DragEvent): void => {
    if (!this.#accepting(event)) return;

    event.preventDefault();
    this.#depth += 1;
    this.toggleAttribute("dragover", true);
  };

  #handleDragOver = (event: DragEvent): void => {
    if (!this.#accepting(event)) return;

    event.preventDefault();

    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = "copy";
    }
  };

  #handleDragLeave = (): void => {
    this.#depth = Math.max(0, this.#depth - 1);

    if (!this.#depth) {
      this.#leave();
    }
  };

  #handleDrop = (event: DragEvent): void => {
    const files = Array.from(event.dataTransfer?.files ?? []);

    this.#leave();

    if (!this.$input || !this.#accepting(event) || !files.length) return;

    event.preventDefault();

    const { accepted } = this.#filter(files);

    if (!accepted.length) return;

    const transfer = new DataTransfer();

    accepted.forEach((file) => transfer.items.add(file));
    this.$input.files = transfer.files;
    this.#change();
  };

  /** Picks from the dialog go through the same rules as drops. */
  #handleChange = (): void => {
    if (!this.$input) return;

    const { accepted, rejected } = this.#filter(this.files);

    if (rejected.length) {
      const transfer = new DataTransfer();

      accepted.forEach((file) => transfer.items.add(file));
      this.$input.files = transfer.files;
    }

    dispatchEvent<ChangeDetail>(
      this,
      EVENTS.DROPZONE_CHANGE,
      { files: accepted, $input: this.$input },
      { cancelable: false },
    );
  };

  /**
   * Dispatches the rejections. Files kept on a drop pass again on `change`
   * without any, so each rejection is dispatched once.
   */
  #filter(files: File[]): ReturnType<typeof filter> {
    const $input = this.$input as HTMLInputElement;
    const result = filter(files, {
      accept: $input.accept,
      maxSize: this.maxSize,
      multiple: $input.multiple,
    });

    if (result.rejected.length) {
      dispatchEvent<RejectDetail>(
        this,
        EVENTS.DROPZONE_REJECT,
        { rejected: result.rejected, $input },
        { cancelable: false },
      );
    }

    return result;
  }

  /** `input` then `change`, bubbling, so forms and frameworks see the new files. */
  #change(): void {
    if (!this.$input) return;

    this.$input.dispatchEvent(new Event("input", { bubbles: true }));
    this.$input.dispatchEvent(new Event("change", { bubbles: true }));
  }

  #leave(): void {
    this.#depth = 0;
    this.removeAttribute("dragover");
  }
}

if (!customElements.get("cinq-dropzone")) {
  customElements.define("cinq-dropzone", Dropzone);
}
