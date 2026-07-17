import type { HideOptions, Write } from "./types.js";

/**
 * Minimal surface the keyboard layer needs from the combobox.
 * Keeps key handling free of search / render / DOM sync details.
 */
export type KeyboardHost = {
  input: HTMLInputElement;
  readonly focused: boolean;
  readonly expanded: boolean;
  index: number;
  readonly options: { length: number };
  value: string;
  write: Write;
  select(): void;
  hide(options?: HideOptions): void;
  ensureOpen(): Promise<boolean>;
  blurOption(): void;
  refresh(index: number): void;
};

/**
 * W3C APG combobox keyboard behaviour.
 * Bound once to `input` keydown; host owns state and side effects.
 */
export default class Keyboard {
  constructor(private readonly host: KeyboardHost) {}

  handle = (event: KeyboardEvent): void => {
    const { key, ctrlKey, shiftKey } = event;

    if (ctrlKey || shiftKey) {
      return;
    }

    switch (key) {
      case "Enter":
        this.onEnter(event);
        break;
      case "ArrowDown":
        void this.onArrowDown(event);
        break;
      case "ArrowUp":
        void this.onArrowUp(event);
        break;
      case "Escape":
        this.onEscape(event);
        break;
      case "Tab":
        this.onTab();
        break;
      case "Home":
        this.onHome(event);
        break;
      case "End":
        this.onEnd(event);
        break;
      case "ArrowLeft":
      case "ArrowRight":
        this.host.blurOption();
        break;
      default:
        break;
    }
  };

  /**
   * Accept focused option, or — when open without visual focus —
   * close and allow native form submit (no preventDefault).
   */
  private onEnter(event: KeyboardEvent): void {
    const { host } = this;

    if (host.focused) {
      event.preventDefault();
      host.select();
      return;
    }

    if (host.expanded) {
      host.hide({ force: true, clear: false });
    }
  }

  private async onArrowDown(event: KeyboardEvent): Promise<void> {
    event.preventDefault();

    const { host } = this;
    const opened = await host.ensureOpen();

    if (!opened) {
      return;
    }

    const { altKey } = event;

    if (altKey) {
      host.blurOption();
      return;
    }

    const { length } = host.options;

    if (host.focused) {
      host.index = host.index + 1 > length - 1 ? 0 : host.index + 1;
    } else {
      host.index = 0;
    }

    host.refresh(host.index);
  }

  private async onArrowUp(event: KeyboardEvent): Promise<void> {
    event.preventDefault();

    const { host } = this;
    const opened = await host.ensureOpen();

    if (!opened) {
      return;
    }

    const { altKey } = event;

    if (altKey) {
      host.blurOption();
      return;
    }

    const { length } = host.options;

    if (host.focused) {
      host.index = 0 > host.index - 1 ? length - 1 : host.index - 1;
    } else {
      host.index = length - 1;
    }

    host.refresh(host.index);
  }

  private onEscape(event: KeyboardEvent): void {
    event.preventDefault();

    const { host } = this;

    if (host.expanded) {
      host.hide({ force: true });
      return;
    }

    host.write(host.input, "");
    host.value = "";
  }

  private onTab(): void {
    const { host } = this;

    if (host.focused) {
      host.select();
      return;
    }

    host.hide({ force: true });
  }

  private onHome(event: KeyboardEvent): void {
    const { host } = this;

    if (!host.focused) {
      return;
    }

    event.preventDefault();
    host.blurOption();
    host.input.setSelectionRange(0, 0);
  }

  private onEnd(event: KeyboardEvent): void {
    const { host } = this;

    if (!host.focused) {
      return;
    }

    event.preventDefault();
    host.blurOption();

    const { length } = host.input.value;
    host.input.setSelectionRange(length, length);
  }
}
