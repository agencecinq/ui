import { afterEach, describe, expect, it } from "vitest";
import { userEvent } from "vitest/browser";
import type { Accordion } from "./index.js";
import "./index.js";

const panel = (id: string, label: string): string => `
  <div data-panel>
    <button id="${id}" type="button" data-header aria-expanded="false" aria-controls="${id}-body">${label}</button>
    <div id="${id}-body" role="region" aria-labelledby="${id}" hidden>
      <div data-inner><a id="${id}-link" href="#${id}">Read the ${label} entry</a></div>
    </div>
  </div>
`;

const markup = `
  <cinq-accordion id="host" data-hash="false">
    ${panel("owlbear", "Owlbear")}
    ${panel("beholder", "Beholder")}
    ${panel("mimic", "Mimic")}
  </cinq-accordion>
`;

const $ = <T extends HTMLElement = HTMLElement>(id: string): T => {
  const $element = document.getElementById(id);

  if (!$element) {
    throw new Error(`No element with id ${id}`);
  }

  return $element as T;
};

const mount = (html = markup): Accordion => {
  document.body.innerHTML = html;

  return $<Accordion>("host");
};

const press = async ($element: HTMLElement, key: string): Promise<void> => {
  $element.focus();
  await userEvent.keyboard(`{${key}}`);
};

afterEach(() => {
  document.body.innerHTML = "";
});

describe("keyboard", () => {
  it("moves to the next header on ArrowDown and ArrowRight, wrapping", async () => {
    mount();

    await press($("owlbear"), "ArrowDown");
    expect(document.activeElement).toBe($("beholder"));

    await press($("beholder"), "ArrowRight");
    expect(document.activeElement).toBe($("mimic"));

    await press($("mimic"), "ArrowDown");
    expect(document.activeElement).toBe($("owlbear"));
  });

  it("moves to the previous header on ArrowUp and ArrowLeft, wrapping", async () => {
    mount();

    await press($("mimic"), "ArrowUp");
    expect(document.activeElement).toBe($("beholder"));

    await press($("beholder"), "ArrowLeft");
    expect(document.activeElement).toBe($("owlbear"));

    await press($("owlbear"), "ArrowUp");
    expect(document.activeElement).toBe($("mimic"));
  });

  it("moves to the first and last headers on Home and End", async () => {
    mount();

    await press($("beholder"), "End");
    expect(document.activeElement).toBe($("mimic"));

    await press($("mimic"), "Home");
    expect(document.activeElement).toBe($("owlbear"));
  });

  it("follows the focused header as current", async () => {
    const $host = mount();

    await press($("beholder"), "ArrowDown");

    expect($host.current).toBe(2);
  });

  it("cancels the default action of the keys it handles", () => {
    mount();

    const event = new KeyboardEvent("keydown", {
      key: "ArrowDown",
      bubbles: true,
      cancelable: true,
    });

    $("owlbear").dispatchEvent(event);

    expect(event.defaultPrevented).toBe(true);
  });

  it("leaves the keys pressed inside a panel to the page", async () => {
    mount();

    await press($("owlbear"), "Enter");
    await press($("owlbear-link"), "ArrowDown");

    expect(document.activeElement).toBe($("owlbear-link"));
  });

  it("leaves the headers of a nested accordion to it", async () => {
    mount(
      markup.replace(
        `<a id="owlbear-link" href="#owlbear">Read the Owlbear entry</a>`,
        `<cinq-accordion data-hash="false">
          ${panel("lair", "Lair")}
          ${panel("hoard", "Hoard")}
        </cinq-accordion>`,
      ),
    );

    await press($("owlbear"), "Enter");
    await press($("lair"), "ArrowDown");

    expect(document.activeElement).toBe($("hoard"));
  });

  it("removes the listener on destroy()", async () => {
    const $host = mount();

    $host.destroy();
    await press($("owlbear"), "ArrowDown");

    expect(document.activeElement).toBe($("owlbear"));
  });
});
