import { afterEach, describe, expect, it, vi } from "vitest";
import { commands, userEvent } from "vitest/browser";
import { EVENTS } from "@agencecinq/utils";
import type { BeforeCloseDetail, BeforeOpenDetail } from "./types.js";
import "./index.js";

type Listener = [name: string, listener: EventListener];

const listeners: Listener[] = [];

/** Listens on `document.documentElement`, removed after each test. */
function on<T>(name: string, listener: (event: CustomEvent<T>) => void): void {
  const entry: Listener = [name, listener as EventListener];

  listeners.push(entry);
  document.documentElement.addEventListener(...entry);
}

function mount(html: string): void {
  document.body.innerHTML = html;
}

function $<T extends Element = HTMLElement>(selector: string): T {
  const element = document.querySelector<T>(selector);

  if (!element) {
    throw new Error(`No element matches ${selector}`);
  }

  return element;
}

const dialog = (id: string) => $<HTMLDialogElement>(`#${id}`);

/** Keyboard activation: a real user gesture, focus stays on the button. */
async function press(button: HTMLElement): Promise<void> {
  button.focus();
  await userEvent.keyboard("{Enter}");
}

/** A real click at the page's top-left corner, on the backdrop of an open sheet. */
async function clickBackdrop(): Promise<void> {
  await userEvent.click(document.documentElement, {
    position: { x: 5, y: 5 },
    force: true,
  });
}

const sheetA = `
  <button id="opener" type="button" commandfor="a" command="show-modal">Open A</button>

  <cinq-sheet>
    <dialog id="a" closedby="any" style="padding: 40px">
      <button id="a-close" type="button" commandfor="a" command="request-close" value="done">Close A</button>
      <button id="a-force" type="button" commandfor="a" command="close">Force close A</button>
      <button id="a-stack" type="button" commandfor="b" command="show-modal">Open B over A</button>
      <button id="a-replace" type="button" commandfor="b" command="show-modal" data-replace>Replace A with B</button>
      <form method="dialog"><button id="a-submit">Submit A</button></form>
    </dialog>
  </cinq-sheet>

  <cinq-sheet>
    <dialog id="b">
      <button id="b-close" type="button" commandfor="b" command="request-close">Close B</button>
      <button id="b-back" type="button" commandfor="a" command="show-modal" data-replace>Back to A</button>
    </dialog>
  </cinq-sheet>
`;

afterEach(() => {
  for (const entry of listeners.splice(0)) {
    document.documentElement.removeEventListener(...entry);
  }

  document.querySelectorAll("dialog").forEach(($dialog) => {
    if ($dialog.matches(":popover-open")) $dialog.hidePopover();
    $dialog.close();
  });
  document.body.innerHTML = "";
});

describe("cinq-sheet, modal", () => {
  it("opens with show-modal, closes with request-close, and returns focus to the opener", async () => {
    mount(sheetA);

    await press($("#opener"));

    expect(dialog("a").open).toBe(true);
    expect(dialog("a").matches(":modal")).toBe(true);
    expect(document.activeElement).toBe($("#a-close"));

    await press($("#a-close"));

    expect(dialog("a").open).toBe(false);
    expect(document.activeElement).toBe($("#opener"));
  });

  it("focuses the autofocus element on open", async () => {
    mount(`
      <button id="opener" type="button" commandfor="a" command="show-modal">Open</button>
      <cinq-sheet>
        <dialog id="a">
          <button type="button">First</button>
          <input id="field" autofocus />
        </dialog>
      </cinq-sheet>
    `);

    await press($("#opener"));

    expect(document.activeElement).toBe($("#field"));
  });

  it("passes the request-close button value as returnValue", async () => {
    mount(sheetA);

    await press($("#opener"));
    await press($("#a-close"));

    expect(dialog("a").returnValue).toBe("done");
  });

  it("runs sheet:before-open with the trigger, and sheet:before-close on request-close and Escape", async () => {
    mount(sheetA);

    const opens: BeforeOpenDetail[] = [];
    const closes: BeforeCloseDetail[] = [];

    on<BeforeOpenDetail>(EVENTS.SHEET_BEFORE_OPEN, (event) => opens.push(event.detail));
    on<BeforeCloseDetail>(EVENTS.SHEET_BEFORE_CLOSE, (event) => closes.push(event.detail));

    await press($("#opener"));
    await press($("#a-close"));
    await press($("#opener"));
    await userEvent.keyboard("{Escape}");

    expect(opens).toHaveLength(2);
    expect(opens[0].sheet).toBe("a");
    expect(opens[0].trigger).toBe($("#opener"));
    expect(closes).toHaveLength(2);
    expect(dialog("a").open).toBe(false);
  });

  it("stays open when sheet:before-close is canceled", async () => {
    mount(sheetA);
    on(EVENTS.SHEET_BEFORE_CLOSE, (event) => event.preventDefault());

    await press($("#opener"));
    await press($("#a-close"));
    await userEvent.keyboard("{Escape}");

    expect(dialog("a").open).toBe(true);
  });

  it("defers the open until waitUntil fulfills", async () => {
    mount(sheetA);

    const { promise, resolve } = Promise.withResolvers<void>();

    on<BeforeOpenDetail>(EVENTS.SHEET_BEFORE_OPEN, (event) => event.detail.waitUntil(promise));

    await press($("#opener"));
    expect(dialog("a").open).toBe(false);

    resolve();
    await vi.waitFor(() => expect(dialog("a").open).toBe(true));
  });

  it("defers the close until waitUntil fulfills, and cancels it on rejection", async () => {
    mount(sheetA);

    let settle = Promise.withResolvers<void>();

    on<BeforeCloseDetail>(EVENTS.SHEET_BEFORE_CLOSE, (event) => event.detail.waitUntil(settle.promise));

    await press($("#opener"));
    await press($("#a-close"));
    expect(dialog("a").open).toBe(true);

    settle.reject(new Error("canceled"));
    await settle.promise.catch(() => {});
    await new Promise((resolve) => setTimeout(resolve));
    expect(dialog("a").open).toBe(true);

    settle = Promise.withResolvers<void>();
    await press($("#a-close"));
    settle.resolve();

    await vi.waitFor(() => expect(dialog("a").open).toBe(false));
  });

  it("joins a pending request instead of dispatching a second before-event", async () => {
    mount(sheetA);

    const { promise, resolve } = Promise.withResolvers<void>();
    const closes = vi.fn((event: CustomEvent<BeforeCloseDetail>) => event.detail.waitUntil(promise));

    on(EVENTS.SHEET_BEFORE_CLOSE, closes);

    await press($("#opener"));
    await press($("#a-close"));
    await press($("#a-close"));
    resolve();

    await vi.waitFor(() => expect(dialog("a").open).toBe(false));
    expect(closes).toHaveBeenCalledTimes(1);
  });

  it("closes on a backdrop click through sheet:before-close with closedby=any", async () => {
    mount(sheetA);

    const closes = vi.fn();

    on(EVENTS.SHEET_BEFORE_CLOSE, closes);

    await press($("#opener"));
    await clickBackdrop();

    expect(closes).toHaveBeenCalledTimes(1);
    expect(dialog("a").open).toBe(false);
  });

  it("keeps the sheet open on a click on its padding, or on the backdrop without closedby=any", async () => {
    mount(sheetA);

    await press($("#opener"));
    await userEvent.click(dialog("a"), { position: { x: 5, y: 5 } });
    expect(dialog("a").open).toBe(true);

    await press($("#a-stack"));
    await clickBackdrop();
    expect(dialog("b").open).toBe(true);
  });

  it("skips the hooks for command=close and form method=dialog", async () => {
    mount(sheetA);

    const closes = vi.fn();

    on(EVENTS.SHEET_BEFORE_CLOSE, closes);

    await press($("#opener"));
    await press($("#a-force"));
    expect(dialog("a").open).toBe(false);

    await press($("#opener"));
    await press($("#a-submit"));
    expect(dialog("a").open).toBe(false);

    expect(closes).not.toHaveBeenCalled();
  });

  it("stacks a modal sheet opened from inside another, and returns focus to its invoker", async () => {
    mount(sheetA);

    await press($("#opener"));
    await press($("#a-stack"));

    expect(dialog("a").open).toBe(true);
    expect(dialog("b").open).toBe(true);

    await press($("#b-close"));

    expect(dialog("a").open).toBe(true);
    expect(document.activeElement).toBe($("#a-stack"));
  });

  it("replaces the sheet holding a data-replace button, both ways, and returns focus to the page opener", async () => {
    mount(sheetA);

    await press($("#opener"));
    await press($("#a-replace"));

    expect(dialog("a").open).toBe(false);
    expect(dialog("b").open).toBe(true);

    await press($("#b-back"));

    expect(dialog("a").open).toBe(true);
    expect(dialog("b").open).toBe(false);

    await press($("#a-replace"));
    await press($("#b-close"));

    expect(dialog("b").open).toBe(false);
    expect(document.activeElement).toBe($("#opener"));
  });

  it("keeps the current sheet when the next one cancels its sheet:before-open", async () => {
    mount(sheetA);

    const closes = vi.fn();

    on<BeforeOpenDetail>(EVENTS.SHEET_BEFORE_OPEN, (event) => {
      if (event.detail.sheet === "b") event.preventDefault();
    });
    on(EVENTS.SHEET_BEFORE_CLOSE, closes);

    await press($("#opener"));
    await press($("#a-replace"));

    expect(dialog("a").open).toBe(true);
    expect(dialog("b").open).toBe(false);
    expect(closes).not.toHaveBeenCalled();
    expect(document.activeElement).toBe($("#a-replace"));
  });

  it("keeps the current sheet open while the next one defers its open", async () => {
    mount(sheetA);

    const { promise, resolve } = Promise.withResolvers<void>();

    on<BeforeOpenDetail>(EVENTS.SHEET_BEFORE_OPEN, (event) => {
      if (event.detail.sheet === "b") event.detail.waitUntil(promise);
    });

    await press($("#opener"));
    await press($("#a-replace"));

    expect(dialog("a").open).toBe(true);
    expect(dialog("b").open).toBe(false);

    resolve();

    await vi.waitFor(() => expect(dialog("b").open).toBe(true));
    expect(dialog("a").open).toBe(false);
  });

  it("waits for the current sheet to defer its close before replacing it", async () => {
    mount(sheetA);

    const { promise, resolve } = Promise.withResolvers<void>();

    on<BeforeCloseDetail>(EVENTS.SHEET_BEFORE_CLOSE, (event) => {
      if (event.detail.sheet === "a") event.detail.waitUntil(promise);
    });

    await press($("#opener"));
    await press($("#a-replace"));

    expect(dialog("a").open).toBe(true);
    expect(dialog("b").open).toBe(false);

    resolve();

    await vi.waitFor(() => expect(dialog("b").open).toBe(true));
    expect(dialog("a").open).toBe(false);
  });

  it("keeps the current sheet when its deferred close rejects during a replace", async () => {
    mount(sheetA);

    const { promise, reject } = Promise.withResolvers<void>();

    on<BeforeCloseDetail>(EVENTS.SHEET_BEFORE_CLOSE, (event) => {
      if (event.detail.sheet === "a") event.detail.waitUntil(promise);
    });

    await press($("#opener"));
    await press($("#a-replace"));

    reject(new Error("canceled"));
    await promise.catch(() => {});
    await new Promise((resolve) => setTimeout(resolve));

    expect(dialog("a").open).toBe(true);
    expect(dialog("b").open).toBe(false);
  });

  it("replaces once both the next open and the current close settle", async () => {
    mount(sheetA);

    const opening = Promise.withResolvers<void>();
    const closing = Promise.withResolvers<void>();

    on<BeforeOpenDetail>(EVENTS.SHEET_BEFORE_OPEN, (event) => {
      if (event.detail.sheet === "b") event.detail.waitUntil(opening.promise);
    });
    on<BeforeCloseDetail>(EVENTS.SHEET_BEFORE_CLOSE, (event) => {
      if (event.detail.sheet === "a") event.detail.waitUntil(closing.promise);
    });

    await press($("#opener"));
    await press($("#a-replace"));

    opening.resolve();
    await new Promise((resolve) => setTimeout(resolve));

    expect(dialog("a").open).toBe(true);
    expect(dialog("b").open).toBe(false);

    closing.resolve();

    await vi.waitFor(() => expect(dialog("b").open).toBe(true));
    expect(dialog("a").open).toBe(false);
  });

  it("keeps the current sheet when its sheet:before-close cancels a replace", async () => {
    mount(sheetA);
    on<BeforeCloseDetail>(EVENTS.SHEET_BEFORE_CLOSE, (event) => {
      if (event.detail.sheet === "a") event.preventDefault();
    });

    await press($("#opener"));
    await press($("#a-replace"));

    expect(dialog("a").open).toBe(true);
    expect(dialog("b").open).toBe(false);
  });
});

const menu = `
  <header>
    <button id="burger" type="button" commandfor="menu" command="toggle-popover">Menu</button>
    <button id="outside" type="button">Outside</button>
  </header>

  <cinq-sheet>
    <dialog id="menu" popover aria-label="Menu">
      <button id="menu-first" type="button">Spells</button>
      <button id="menu-close" type="button" commandfor="menu" command="hide-popover">Close menu</button>
      <button id="menu-replace" type="button" commandfor="search" command="show-popover" data-replace>Search</button>
    </dialog>
  </cinq-sheet>

  <cinq-sheet>
    <dialog id="search" popover aria-label="Search">
      <input id="search-field" aria-label="Creature" />
    </dialog>
  </cinq-sheet>
`;

const showing = (id: string) => dialog(id).matches(":popover-open");

describe("cinq-sheet, popover", () => {
  it("opens with toggle-popover, moves focus in, and closes from the same trigger", async () => {
    mount(menu);

    const opens = vi.fn();
    const closes = vi.fn();

    on(EVENTS.SHEET_BEFORE_OPEN, opens);
    on(EVENTS.SHEET_BEFORE_CLOSE, closes);

    await press($("#burger"));

    expect(showing("menu")).toBe(true);
    expect(dialog("menu").matches(":modal")).toBe(false);
    expect(document.activeElement).toBe($("#menu-first"));

    // A pointer click: light dismiss must not close it before the toggle reopens it.
    await userEvent.click($("#burger"));

    expect(showing("menu")).toBe(false);
    expect(opens).toHaveBeenCalledTimes(1);
    expect(closes).toHaveBeenCalledTimes(1);
    // Safari does not focus a clicked button: focus may land on the body, never in the closed menu.
    expect(dialog("menu").contains(document.activeElement)).toBe(false);
  });

  it("runs sheet:before-open with the trigger, and sheet:before-close on hide-popover", async () => {
    mount(menu);

    const opens: BeforeOpenDetail[] = [];
    const closes: BeforeCloseDetail[] = [];

    on<BeforeOpenDetail>(EVENTS.SHEET_BEFORE_OPEN, (event) => opens.push(event.detail));
    on<BeforeCloseDetail>(EVENTS.SHEET_BEFORE_CLOSE, (event) => closes.push(event.detail));

    await press($("#burger"));
    await press($("#menu-close"));

    expect(opens).toHaveLength(1);
    expect(opens[0].sheet).toBe("menu");
    expect(opens[0].trigger).toBe($("#burger"));
    expect(closes).toHaveLength(1);
    expect(showing("menu")).toBe(false);
    expect(document.activeElement).toBe($("#burger"));
  });

  it("stays open when sheet:before-close is canceled, and defers the open until waitUntil fulfills", async () => {
    mount(menu);

    const { promise, resolve } = Promise.withResolvers<void>();

    on<BeforeOpenDetail>(EVENTS.SHEET_BEFORE_OPEN, (event) => event.detail.waitUntil(promise));
    on(EVENTS.SHEET_BEFORE_CLOSE, (event) => event.preventDefault());

    await press($("#burger"));
    expect(showing("menu")).toBe(false);

    resolve();
    await vi.waitFor(() => expect(showing("menu")).toBe(true));

    await press($("#menu-close"));
    expect(showing("menu")).toBe(true);
  });

  it("closes on a click outside and on Escape, natively and without the hooks", async () => {
    mount(menu);

    const closes = vi.fn();

    on(EVENTS.SHEET_BEFORE_CLOSE, closes);

    await press($("#burger"));
    await userEvent.click($("#outside"));
    expect(showing("menu")).toBe(false);

    await press($("#burger"));
    await userEvent.keyboard("{Escape}");
    expect(showing("menu")).toBe(false);
    expect(document.activeElement).toBe($("#burger"));

    expect(closes).not.toHaveBeenCalled();
  });

  it("returns focus to an opener in a region made inert on beforetoggle", async () => {
    mount(`
      <main>
        <button id="opener" type="button" commandfor="menu" command="toggle-popover">Menu</button>
      </main>
      <cinq-sheet>
        <dialog id="menu" popover aria-label="Menu"><button type="button">Spells</button></dialog>
      </cinq-sheet>
    `);

    dialog("menu").addEventListener("beforetoggle", (event) => {
      $("main").inert = (event as ToggleEvent).newState === "open";
    });

    await press($("#opener"));
    expect($("main").inert).toBe(true);

    await userEvent.keyboard("{Escape}");

    expect($("main").inert).toBe(false);
    expect(document.activeElement).toBe($("#opener"));
  });

  it("replaces the sheet holding a data-replace button, and returns focus to the page opener", async () => {
    mount(menu);

    await press($("#burger"));
    await press($("#menu-replace"));

    expect(showing("menu")).toBe(false);
    expect(showing("search")).toBe(true);
    expect(document.activeElement).toBe($("#search-field"));

    await userEvent.keyboard("{Escape}");

    expect(showing("search")).toBe(false);
    expect(document.activeElement).toBe($("#burger"));
  });
});

declare module "vitest/browser" {
  interface BrowserCommands {
    drag: (selector: string, dy: number) => Promise<void>;
  }
}

const cloak = (closedby = "any") => `
  <button id="pull" type="button" commandfor="cloak" command="show-modal" style="touch-action: none; padding: 24px; margin-top: 320px">Sizes</button>

  <cinq-sheet>
    <dialog id="cloak" closedby="${closedby}" style="inset: 80px 0 auto 0; margin: 0; max-width: none; width: auto">
      <div id="handle" data-dom="drag-indicator" style="height: 40px; touch-action: none" aria-hidden="true"></div>
      <button id="cloak-close" type="button" commandfor="cloak" command="request-close">Close</button>
    </dialog>
  </cinq-sheet>
`;

describe("cinq-sheet, drag", () => {
  it("closes on a handle pull down through sheet:before-close, and snaps back on a short one", async () => {
    mount(cloak());

    const closes = vi.fn();

    on(EVENTS.SHEET_BEFORE_CLOSE, closes);

    await press($("#pull"));
    await commands.drag("#handle", 20);

    expect(dialog("cloak").open).toBe(true);
    expect($("cinq-sheet").style.getPropertyValue("--cinq-sheet-drag-offset")).toBe("");
    expect($("cinq-sheet").hasAttribute("dragging")).toBe(false);

    await commands.drag("#handle", 200);

    expect(closes).toHaveBeenCalledTimes(1);
    expect(dialog("cloak").open).toBe(false);
  });

  it("keeps the sheet open on a handle pull with closedby=none", async () => {
    mount(cloak("none"));

    await press($("#pull"));
    await commands.drag("#handle", 200);

    expect(dialog("cloak").open).toBe(true);
  });

  it("opens on a pull up on its trigger, and ignores the click that ends the pull", async () => {
    mount(cloak());

    const opens: BeforeOpenDetail[] = [];

    on<BeforeOpenDetail>(EVENTS.SHEET_BEFORE_OPEN, (event) => opens.push(event.detail));

    await commands.drag("#pull", -25);
    expect(dialog("cloak").open).toBe(false);

    await commands.drag("#pull", -150);

    await vi.waitFor(() => expect(dialog("cloak").open).toBe(true));
    await new Promise((resolve) => setTimeout(resolve, 50));
    expect(dialog("cloak").open).toBe(true);
    expect(opens).toHaveLength(1);
    expect(opens[0].trigger).toBe($("#pull"));
  });

  it("opens a popover sheet on a pull up on its toggle-popover trigger, and keeps it open", async () => {
    mount(`
      <button id="pull" type="button" commandfor="bar" command="toggle-popover" style="touch-action: none; padding: 24px; margin-top: 320px">Sizes</button>
      <cinq-sheet>
        <dialog id="bar" popover style="inset: 80px 0 auto 0; margin: 0"><button type="button">Elf</button></dialog>
      </cinq-sheet>
    `);

    await commands.drag("#pull", -150);

    await vi.waitFor(() => expect(showing("bar")).toBe(true));
    await new Promise((resolve) => setTimeout(resolve, 50));
    expect(showing("bar")).toBe(true);
  });
});
