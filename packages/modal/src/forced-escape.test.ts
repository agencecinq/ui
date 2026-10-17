import { expect, it, vi } from "vitest";
import { userEvent } from "vitest/browser";
import { EVENTS } from "@agencecinq/utils";
import type { BeforeCloseDetail } from "./types.js";
import "./index.js";

/**
 * Own file: whether an Escape is still cancelable depends on the page's user
 * activation history, so this runs on a fresh page.
 */
it("lets the browser force the close when Escape repeats on a deferred close", async () => {
  document.body.innerHTML = `
    <button id="opener" type="button" commandfor="a" command="show-modal">Open</button>
    <cinq-modal>
      <dialog id="a"><button type="button">Inside</button></dialog>
    </cinq-modal>
  `;

  const $dialog = document.querySelector<HTMLDialogElement>("#a")!;
  const never = new Promise<void>(() => {});
  const closes = vi.fn((event: CustomEvent<BeforeCloseDetail>) => event.detail.waitUntil(never));

  document.documentElement.addEventListener(EVENTS.MODAL_BEFORE_CLOSE, closes as EventListener);

  document.querySelector<HTMLElement>("#opener")!.focus();
  await userEvent.keyboard("{Enter}");
  await userEvent.keyboard("{Escape}");
  expect($dialog.open).toBe(true);

  // Without new user activation, a later Escape is no longer cancelable.
  for (let attempt = 0; attempt < 5 && $dialog.open; attempt += 1) {
    await userEvent.keyboard("{Escape}");
  }

  expect($dialog.open).toBe(false);
  expect(closes).toHaveBeenCalledTimes(1);
});
