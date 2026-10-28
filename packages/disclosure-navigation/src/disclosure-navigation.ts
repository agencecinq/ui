import type { State } from "./utils.js";
import { dispatchBeforetoggle, focusByKey, queueToggle } from "./utils.js";

const BUTTONS = "button[aria-expanded][aria-controls]";
const TOP_LEVEL_ITEMS = `a[href], ${BUTTONS}`;
const MENU_ITEMS = 'a[href], button:enabled, [tabindex]:not([tabindex^="-"])';

const isExpanded = ($button: HTMLButtonElement): boolean =>
  $button.ariaExpanded === "true";

const controlledElements = ($button: HTMLButtonElement): HTMLElement[] =>
  ($button.ariaControlsElements ?? []) as HTMLElement[];

/** Whether `$node` is inside one of the submenus of `$button`. */
const controls = ($button: HTMLButtonElement, $node: Node): boolean =>
  controlledElements($button).some(($element) => $element.contains($node));

/** Whether `$node` is in the area a pointer hovers: `$button` and its submenus. */
const holds = ($button: HTMLButtonElement, $node: Node | null): boolean =>
  $node !== null && ($button.contains($node) || controls($button, $node));

/** Fires `beforetoggle` at each submenu of `$button`, `false` if the opening is canceled. */
const beforetoggle = ($button: HTMLButtonElement, newState: State): boolean =>
  controlledElements($button).every(($element) =>
    dispatchBeforetoggle($element, newState, $button),
  );

/**
 * Disclosure navigation Web Component around a site navigation whose buttons show
 * and hide submenus. The markup is the source of truth: `aria-expanded` on each
 * button holds the state, and the submenus are the elements its `aria-controls`
 * references. The component never adds a missing attribute; it only updates
 * `aria-expanded` and `hidden` when the user interacts, and fires `beforetoggle`
 * and `toggle` at the submenus, as popovers do.
 *
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/examples/disclosure-navigation/
 * @see https://w3c.github.io/aria/#dom-ariamixin-ariacontrolselements
 */
export class DisclosureNavigation extends HTMLElement {
  #controller: AbortController | null = null;
  /** The `hidden` value of each submenu before it opened, so `until-found` survives a close. */
  #hidden = new WeakMap<HTMLElement, true | "until-found">();
  /** Opened by the mouse, while it stays open: the next click on it keeps it open. */
  #hovered: HTMLButtonElement | null = null;

  connectedCallback(): void {
    this.init();
  }

  disconnectedCallback(): void {
    this.destroy();
  }

  /** Binds listeners. Call `destroy()` first if already bound. */
  init(): void {
    this.#controller = new AbortController();

    const { signal } = this.#controller;

    this.addEventListener("click", this.#handleClick, { signal });
    this.addEventListener("keydown", this.#handleKeydown, { signal });
    this.addEventListener("focusout", this.#handleFocusout, { signal });
    this.addEventListener("beforematch", this.#handleBeforematch, { signal });
    this.addEventListener("pointerover", this.#handlePointerover, { signal });
    this.addEventListener("pointerout", this.#handlePointerout, { signal });
    document.addEventListener("keydown", this.#handleEscape, { signal });
  }

  /** Removes listeners. The markup stays in its current state. */
  destroy(): void {
    this.#controller?.abort();
    this.#hovered = null;
  }

  /**
   * Opens the submenu of `$button` and closes the open ones outside its branch,
   * as popovers do. Canceling its `beforetoggle` leaves every submenu as it is.
   */
  open($button: HTMLButtonElement): void {
    if (isExpanded($button) || !beforetoggle($button, "open")) {
      return;
    }

    const others = this.#expandedButtons.filter(
      ($expanded) =>
        !controls($expanded, $button) && !controls($button, $expanded),
    );

    this.#collapse(others);
    this.#expand($button, true);
  }

  /** Closes the submenu of `$button` and the ones nested in it, or every open submenu. */
  close($button?: HTMLButtonElement): void {
    const buttons = $button
      ? this.#expandedButtons.filter(
          ($expanded) => $expanded === $button || controls($button, $expanded),
        )
      : this.#expandedButtons;

    this.#collapse(buttons);
  }

  toggle($button: HTMLButtonElement): void {
    if (isExpanded($button)) {
      return this.close($button);
    }

    return this.open($button);
  }

  get #buttons(): HTMLButtonElement[] {
    return [...this.querySelectorAll<HTMLButtonElement>(BUTTONS)];
  }

  get #expandedButtons(): HTMLButtonElement[] {
    return this.#buttons.filter(isExpanded);
  }

  /** Items inside `containers`, outside the submenus nested in them. */
  #items(containers: HTMLElement[], selector: string): HTMLElement[] {
    const submenus = this.#buttons
      .flatMap(controlledElements)
      .filter(($submenu) =>
        containers.some(
          ($container) =>
            $container !== $submenu && $container.contains($submenu),
        ),
      );

    return containers
      .flatMap(($container) => [
        ...$container.querySelectorAll<HTMLElement>(selector),
      ])
      .filter(($item) => !submenus.some(($submenu) => $submenu.contains($item)));
  }

  /** Closes the submenus of `buttons`, innermost first, as nested popovers do. */
  #collapse(buttons: HTMLButtonElement[]): void {
    buttons.toReversed().forEach(($button) => {
      beforetoggle($button, "closed");
      this.#expand($button, false);
    });
  }

  /** Updates `aria-expanded` and `hidden`, and queues `toggle` at each submenu. */
  #expand($button: HTMLButtonElement, expanded: boolean): void {
    const newState = expanded ? "open" : "closed";

    $button.ariaExpanded = expanded.toString();

    if (!expanded && $button === this.#hovered) {
      this.#hovered = null;
    }

    controlledElements($button).forEach(($element) => {
      queueToggle($element, newState, $button);

      if (expanded) {
        this.#hidden.set($element, $element.hidden || true);
        $element.hidden = false;

        return;
      }

      // Hiding the focused element would send focus to the body
      if ($element.matches(":focus-within")) {
        $button.focus();
      }

      $element.hidden = this.#hidden.get($element) ?? true;
    });
  }

  /** With `data-hover`, a mouse opens the submenus: touch and pen keep the click. */
  #opensOnHover(event: PointerEvent): boolean {
    return "mouse" === event.pointerType && this.hasAttribute("data-hover");
  }

  #handleClick = (event: MouseEvent): void => {
    const $button = (event.target as Element).closest<HTMLButtonElement>(
      BUTTONS,
    );

    if (!$button || !this.contains($button)) {
      return;
    }

    // The mouse got there first: the click meant to open, closing would be a surprise
    const hovered = $button === this.#hovered;

    this.#hovered = null;

    if (!hovered) {
      this.toggle($button);
    }
  };

  #handlePointerover = (event: PointerEvent): void => {
    const $button = (event.target as Element).closest<HTMLButtonElement>(
      BUTTONS,
    );
    const $from = event.relatedTarget as Node | null;

    // Entering the button, not moving within it or back from its submenu
    if (
      !this.#opensOnHover(event) ||
      !$button ||
      !this.contains($button) ||
      isExpanded($button) ||
      holds($button, $from)
    ) {
      return;
    }

    this.open($button);

    if (isExpanded($button)) {
      this.#hovered = $button;
    }
  };

  #handlePointerout = (event: PointerEvent): void => {
    if (!this.#opensOnHover(event)) {
      return;
    }

    const $from = event.target as Node;
    const $to = event.relatedTarget as Node | null;

    this.#expandedButtons
      .filter(($button) => holds($button, $from) && !holds($button, $to))
      .forEach(($button) => this.close($button));
  };

  #handleFocusout = (event: FocusEvent): void => {
    // Safari does not focus a clicked button: focus leaves for nowhere while the
    // navigation is being clicked, and the click toggles the submenu itself
    if (
      this.contains(event.relatedTarget as Node | null) ||
      this.matches(":active")
    ) {
      return;
    }

    this.close();
  };

  /** Find in page or fragment navigation reveals a submenu in `hidden="until-found"`. */
  #handleBeforematch = (event: Event): void => {
    const $target = event.target as HTMLElement;
    const $button = this.#buttons.find(($button) =>
      controlledElements($button).includes($target),
    );

    if (!$button) {
      return;
    }

    this.open($button);

    // The browser removes `hidden` after this event, and stops revealing the
    // ancestors when it is already gone
    $target.hidden = "until-found";
  };

  /**
   * Escape closes the innermost open submenu holding the focus. With the focus
   * elsewhere, as after a hover or a click in Safari, which does not focus the
   * button, it closes every open submenu and leaves the key to the page.
   */
  #handleEscape = (event: KeyboardEvent): void => {
    if (
      "Escape" !== event.key ||
      event.defaultPrevented ||
      !this.#expandedButtons.length
    ) {
      return;
    }

    const $target = event.target as Node;

    if (!this.contains($target)) {
      return this.close();
    }

    // Escape is also a close request: canceling it keeps an enclosing dialog or
    // popover open, so one press closes one layer
    event.preventDefault();

    return this.close(
      this.#expandedButtons.findLast(($expanded) =>
        controls($expanded, $target),
      ),
    );
  };

  #handleKeydown = (event: KeyboardEvent): void => {
    if ("false" === this.dataset.arrowKeys) {
      return;
    }

    const $target = event.target as HTMLElement;
    // The innermost open submenu holding the focus, none at the top level
    const $button = this.#expandedButtons.findLast(($expanded) =>
      controls($expanded, $target),
    );
    const items = $button
      ? this.#items(controlledElements($button), MENU_ITEMS)
      : this.#items([this], TOP_LEVEL_ITEMS);
    const index = items.indexOf($target);

    if (index === -1) {
      return;
    }

    // Move focus into the submenu of an expanded button
    if (
      "ArrowDown" === event.key &&
      $target instanceof HTMLButtonElement &&
      isExpanded($target)
    ) {
      event.preventDefault();

      return this.#items(controlledElements($target), MENU_ITEMS)[0]?.focus();
    }

    return focusByKey(event, items, index);
  };
}

if (!customElements.get("cinq-disclosure-navigation")) {
  customElements.define("cinq-disclosure-navigation", DisclosureNavigation);
}
