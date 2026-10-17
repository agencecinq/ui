import { beforeAll, describe, expect, it, vi } from "vitest";
import { userEvent } from "vitest/browser";
import { EVENTS } from "@agencecinq/utils";

/**
 * Every test browser supports `closedby`, unlike Safari 26. Hide it before the
 * component loads so the fallback binds, as it does in Safari. The native light
 * dismiss still runs, so these tests check the fallback adds no wrong close.
 */
beforeAll(async () => {
  Reflect.deleteProperty(HTMLDialogElement.prototype, "closedBy");
  await import("./index.js");
});

const $dialog = () => document.querySelector<HTMLDialogElement>("#a")!;

async function open(): Promise<void> {
  document.body.innerHTML = `
    <button id="opener" type="button" commandfor="a" command="show-modal">Open</button>
    <cinq-modal>
      <dialog id="a" closedby="any" style="padding: 40px">
        <button type="button">Inside</button>
      </dialog>
    </cinq-modal>
  `;

  document.querySelector<HTMLElement>("#opener")!.focus();
  await userEvent.keyboard("{Enter}");
}

describe("closedby fallback", () => {
  it("closes once on a backdrop click", async () => {
    const closes = vi.fn();

    document.documentElement.addEventListener(EVENTS.MODAL_BEFORE_CLOSE, closes);
    await open();

    await userEvent.click(document.documentElement, {
      position: { x: 5, y: 5 },
      force: true,
    });

    document.documentElement.removeEventListener(EVENTS.MODAL_BEFORE_CLOSE, closes);

    expect($dialog().open).toBe(false);
    expect(closes).toHaveBeenCalledTimes(1);
  });

  it("closes on a click outside the dialog box on its own", async () => {
    await open();

    // Synthetic: the native light dismiss ignores it, only the fallback runs.
    const click = new MouseEvent("click", { bubbles: true, clientX: 5, clientY: 5 });

    $dialog().dispatchEvent(click);

    expect($dialog().open).toBe(false);
  });

  it("stays open on a click on the dialog padding", async () => {
    await open();

    await userEvent.click($dialog(), { position: { x: 5, y: 5 } });

    expect($dialog().open).toBe(true);
    $dialog().close();
  });
});
