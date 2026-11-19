import { afterEach, describe, expect, it } from "vitest";
import { userEvent } from "vitest/browser";
import type { Tabs } from "./index.js";
import "./index.js";

const markup = `
  <cinq-tabs id="host" data-hash="false">
    <div role="tablist" aria-label="Classes">
      <button id="fighter" type="button" role="tab" aria-selected="true" aria-controls="fighter-panel">Fighter</button>
      <button id="cleric" type="button" role="tab" aria-selected="false" aria-controls="cleric-panel" tabindex="-1">Cleric</button>
      <button id="thief" type="button" role="tab" aria-selected="false" aria-controls="thief-panel" tabindex="-1" data-deletable>Thief</button>
    </div>
    <section id="fighter-panel" role="tabpanel" aria-labelledby="fighter" tabindex="0">THAC0 20</section>
    <section id="cleric-panel" role="tabpanel" aria-labelledby="cleric" tabindex="0">Turn undead</section>
    <section id="thief-panel" role="tabpanel" aria-labelledby="thief" tabindex="0">Backstab</section>
  </cinq-tabs>
`;

const $ = <T extends HTMLElement = HTMLElement>(id: string): T => {
  const $element = document.getElementById(id);

  if (!$element) {
    throw new Error(`No element with id ${id}`);
  }

  return $element as T;
};

const mount = (html = markup): Tabs => {
  document.body.innerHTML = html;

  return $<Tabs>("host");
};

const press = async ($element: HTMLElement, key: string): Promise<void> => {
  $element.focus();
  await userEvent.keyboard(`{${key}}`);
};

const selected = (id: string): boolean =>
  $(id).getAttribute("aria-selected") === "true";

const wait = (ms: number): Promise<void> =>
  new Promise(resolve => setTimeout(resolve, ms));

afterEach(() => {
  document.body.innerHTML = "";
});

describe("keyboard", () => {
  it("moves to the next tab on ArrowRight and ArrowDown, wrapping", async () => {
    mount();

    await press($("fighter"), "ArrowRight");
    expect(document.activeElement).toBe($("cleric"));

    await press($("cleric"), "ArrowDown");
    expect(document.activeElement).toBe($("thief"));

    await press($("thief"), "ArrowRight");
    expect(document.activeElement).toBe($("fighter"));
  });

  it("moves to the previous tab on ArrowLeft and ArrowUp, wrapping", async () => {
    mount();

    await press($("fighter"), "ArrowLeft");
    expect(document.activeElement).toBe($("thief"));

    await press($("thief"), "ArrowUp");
    expect(document.activeElement).toBe($("cleric"));
  });

  it("swaps left and right in a right-to-left tablist", async () => {
    mount(markup.replace('<cinq-tabs id="host"', '<cinq-tabs id="host" dir="rtl"'));

    await press($("fighter"), "ArrowLeft");
    expect(document.activeElement).toBe($("cleric"));

    await press($("cleric"), "ArrowRight");
    expect(document.activeElement).toBe($("fighter"));
  });

  it("moves to the first and last tabs on Home and End", async () => {
    mount();

    await press($("fighter"), "End");
    expect(document.activeElement).toBe($("thief"));

    await press($("thief"), "Home");
    expect(document.activeElement).toBe($("fighter"));
  });

  it("only moves the focus with the arrow keys without data-delay", async () => {
    mount();

    await press($("fighter"), "ArrowRight");
    await wait(50);

    expect(selected("fighter")).toBe(true);
    expect(selected("cleric")).toBe(false);
    expect($("cleric-panel").hidden).toBe(true);
  });

  it("activates the focused tab after data-delay", async () => {
    mount(markup.replace('data-hash="false"', 'data-hash="false" data-delay="20"'));

    await press($("fighter"), "ArrowRight");

    expect(selected("cleric")).toBe(false);

    await wait(60);

    expect(selected("cleric")).toBe(true);
    expect(selected("fighter")).toBe(false);
    expect($("cleric-panel").hidden).toBe(false);
    expect($("fighter-panel").hidden).toBe(true);
  });

  it("activates the focused tab on Enter", async () => {
    mount();

    await press($("fighter"), "ArrowRight");
    await userEvent.keyboard("{Enter}");

    expect(selected("cleric")).toBe(true);
    expect($("cleric-panel").hidden).toBe(false);
  });

  it("deletes a selected deletable tab and its panel on Delete", async () => {
    mount();

    await press($("thief"), "Enter");
    await userEvent.keyboard("{Delete}");

    expect(document.getElementById("thief")).toBeNull();
    expect(document.getElementById("thief-panel")).toBeNull();
    expect(selected("cleric")).toBe(true);
  });

  it("keeps a tab without data-deletable on Delete", async () => {
    mount();

    await press($("fighter"), "Delete");

    expect($("fighter")).toBeTruthy();
    expect(selected("fighter")).toBe(true);
  });

  it("removes the listener on destroy()", async () => {
    const $host = mount();

    $host.destroy();
    await press($("fighter"), "ArrowRight");

    expect(document.activeElement).toBe($("fighter"));
  });
});
