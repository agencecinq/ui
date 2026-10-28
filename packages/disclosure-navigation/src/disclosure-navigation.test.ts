import { afterEach, describe, expect, it } from "vitest";
import { server, userEvent } from "vitest/browser";
import type { DisclosureNavigation } from "./index.js";
import "./index.js";

const markup = `
  <cinq-disclosure-navigation id="host">
    <nav id="nav" aria-label="Main">
      <ul>
        <li><a id="home" href="#home">Home</a></li>
        <li>
          <button id="about" type="button" aria-expanded="false" aria-controls="about-menu">About <span id="about-icon">▾</span></button>
          <ul id="about-menu" hidden>
            <li><a id="overview" href="#overview">Overview</a></li>
            <li>
              <button id="team" type="button" aria-expanded="false" aria-controls="team-menu">Team</button>
              <ul id="team-menu" hidden>
                <li><a id="leadership" href="#leadership">Leadership</a></li>
                <li><a id="designers" href="#designers">Designers</a></li>
              </ul>
            </li>
            <li><a id="history" href="#history">History</a></li>
          </ul>
        </li>
        <li>
          <button id="services" type="button" aria-expanded="false" aria-controls="1-services">Services</button>
          <ul id="1-services" hidden>
            <li><a id="design" href="#design">Design</a></li>
            <li><input id="search" type="search" aria-label="Search" /></li>
          </ul>
        </li>
      </ul>
    </nav>
  </cinq-disclosure-navigation>
  <button id="outside" type="button">Outside</button>
`;

const hoverMarkup = markup.replace(
  '<cinq-disclosure-navigation id="host">',
  '<cinq-disclosure-navigation id="host" data-hover>',
);

const $ = <T extends HTMLElement = HTMLElement>(id: string): T => {
  const $element = document.getElementById(id);

  if (!$element) {
    throw new Error(`No element with id ${id}`);
  }

  return $element as T;
};

const mount = (html = markup): DisclosureNavigation => {
  document.body.innerHTML = html;

  return $<DisclosureNavigation>("host");
};

const press = async ($element: HTMLElement, key: string): Promise<void> => {
  $element.focus();
  await userEvent.keyboard(`{${key}}`);
};

const expectExpanded = (
  button: string,
  menu: string,
  expanded: boolean,
): void => {
  expect($(button).getAttribute("aria-expanded")).toBe(expanded.toString());
  expect($(menu).hidden).toBe(!expanded);
};

const supportsUntilFound = (() => {
  const $element = document.createElement("div");

  $element.hidden = "until-found";

  return $element.hidden === "until-found";
})();

/** Records the toggle events reaching `$target`, in the capture phase as they do not bubble. */
const record = ($target: HTMLElement): string[] => {
  const events: string[] = [];
  const listener = (event: ToggleEvent): void => {
    const $element = event.target as HTMLElement;

    events.push(
      `${event.type} #${$element.id} ${event.oldState}→${event.newState}`,
    );
  };

  $target.addEventListener("beforetoggle", listener, { capture: true });
  $target.addEventListener("toggle", listener, { capture: true });

  return events;
};

const nextTask = (): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve));

afterEach(async () => {
  // Park the mouse, so the next markup does not mount under it
  await userEvent.unhover(document.body);
  document.body.innerHTML = "";
  history.replaceState(null, "", location.pathname + location.search);
});

describe("markup", () => {
  it("leaves the markup untouched on connect", () => {
    const html = markup
      .replace(
        'aria-expanded="false" aria-controls="about-menu"',
        'aria-expanded="true" aria-controls="about-menu"',
      )
      .replace('<ul id="about-menu" hidden>', '<ul id="about-menu">');
    const $template = document.createElement("template");

    $template.innerHTML = html;
    document.body.innerHTML = html;

    expect(document.body.innerHTML).toBe($template.innerHTML);
    expectExpanded("about", "about-menu", true);
  });

  it("resolves aria-controls IDs that start with a digit", async () => {
    mount();
    await userEvent.click($("services"));

    expectExpanded("services", "1-services", true);
  });
});

describe("click", () => {
  it("opens and closes a submenu", async () => {
    mount();

    await userEvent.click($("about"));
    expectExpanded("about", "about-menu", true);

    await userEvent.click($("about"));
    expectExpanded("about", "about-menu", false);
  });

  it("closes the open submenu when another one opens", async () => {
    mount();

    await userEvent.click($("about"));
    await userEvent.click($("services"));

    expectExpanded("about", "about-menu", false);
    expectExpanded("services", "1-services", true);
  });
});

describe("events", () => {
  it("fires beforetoggle before the change, and toggle in a later task", async () => {
    const $host = mount();
    const events = record($("nav"));
    const hidden: (boolean | "until-found")[] = [];

    $("about-menu").addEventListener("beforetoggle", () =>
      hidden.push($("about-menu").hidden),
    );
    $("about-menu").addEventListener("toggle", () =>
      hidden.push($("about-menu").hidden),
    );
    $host.open($("about"));

    expect(events).toEqual(["beforetoggle #about-menu closed→open"]);

    await nextTask();

    expect(events).toEqual([
      "beforetoggle #about-menu closed→open",
      "toggle #about-menu closed→open",
    ]);
    expect(hidden).toEqual([true, false]);
  });

  it("fires at the submenu with the button as source, without bubbling", async () => {
    mount();

    const sources: (string | undefined)[] = [];
    const bubbled: string[] = [];

    $("about-menu").addEventListener("beforetoggle", (event) =>
      sources.push(event.source?.id),
    );
    $("about-menu").addEventListener("toggle", (event) =>
      sources.push(event.source?.id),
    );
    $("nav").addEventListener("beforetoggle", (event) =>
      bubbled.push(event.type),
    );
    $("nav").addEventListener("toggle", (event) => bubbled.push(event.type));
    await userEvent.click($("about"));
    await nextTask();

    expect(sources).toEqual(["about", "about"]);
    expect(bubbled).toEqual([]);
  });

  it("cancels the opening when a listener calls preventDefault()", async () => {
    mount();

    const events = record($("nav"));

    $("about-menu").addEventListener("beforetoggle", (event) =>
      event.preventDefault(),
    );
    await userEvent.click($("about"));
    await nextTask();

    expectExpanded("about", "about-menu", false);
    expect(events).toEqual(["beforetoggle #about-menu closed→open"]);
  });

  it("keeps the open submenu when another opening is canceled", async () => {
    mount();
    await userEvent.click($("about"));

    $("1-services").addEventListener("beforetoggle", (event) =>
      event.preventDefault(),
    );
    await userEvent.click($("services"));

    expectExpanded("about", "about-menu", true);
    expectExpanded("services", "1-services", false);
  });

  it("cannot cancel a closing, as popovers", async () => {
    mount();
    await userEvent.click($("about"));

    const cancelable: boolean[] = [];

    $("about-menu").addEventListener("beforetoggle", (event) => {
      cancelable.push(event.cancelable);
      event.preventDefault();
    });
    await userEvent.click($("about"));

    expectExpanded("about", "about-menu", false);
    expect(cancelable).toEqual([false]);
  });

  it("coalesces the changes made before toggle fires into one event", async () => {
    const $host = mount();
    const events = record($("nav"));

    $host.open($("about"));
    $host.close();
    await nextTask();

    expect(events.filter((event) => event.startsWith("toggle"))).toEqual([
      "toggle #about-menu closed→closed",
    ]);
  });

  it("fires at each submenu of a button, and opens none when one is canceled", () => {
    const $host = mount(
      markup
        .replace('aria-controls="1-services"', 'aria-controls="1-services promo"')
        .replace(
          "</nav>",
          '<div id="promo" hidden><a href="#promo">Promo</a></div></nav>',
        ),
    );
    const events = record($("nav"));

    $host.open($("services"));
    $host.close();
    $("promo").addEventListener("beforetoggle", (event) =>
      event.preventDefault(),
    );
    $host.open($("services"));

    expect(events).toEqual([
      "beforetoggle #1-services closed→open",
      "beforetoggle #promo closed→open",
      "beforetoggle #1-services open→closed",
      "beforetoggle #promo open→closed",
      "beforetoggle #1-services closed→open",
      "beforetoggle #promo closed→open",
    ]);
    expectExpanded("services", "1-services", false);
    expect($("promo").hidden).toBe(true);
  });
});

describe("keyboard", () => {
  it("closes the submenu and focuses its button on Escape inside it", async () => {
    mount();
    await userEvent.click($("about"));

    await press($("team"), "Escape");

    expectExpanded("about", "about-menu", false);
    expect(document.activeElement).toBe($("about"));
  });

  it("closes the open submenu on Escape on a top-level item", async () => {
    mount();
    await userEvent.click($("about"));

    await press($("services"), "Escape");

    expectExpanded("about", "about-menu", false);
  });

  it("closes the submenu, not the enclosing dialog, on Escape", async () => {
    mount(`<dialog id="dialog">${markup}</dialog>`);

    const $dialog = $<HTMLDialogElement>("dialog");

    $dialog.showModal();
    await userEvent.click($("about"));

    await press($("overview"), "Escape");
    expectExpanded("about", "about-menu", false);
    expect($dialog.open).toBe(true);

    await userEvent.keyboard("{Escape}");
    expect($dialog.open).toBe(false);
  });

  it("closes the open submenus on Escape outside the navigation, and leaves the key to the page", () => {
    const $host = mount();

    $("outside").focus();
    $host.open($("about"));

    const event = new KeyboardEvent("keydown", {
      key: "Escape",
      bubbles: true,
      cancelable: true,
    });

    $("outside").dispatchEvent(event);

    expectExpanded("about", "about-menu", false);
    expect(event.defaultPrevented).toBe(false);
    expect(document.activeElement).toBe($("outside"));
  });

  it("leaves an Escape already handled by the page", () => {
    const $host = mount();

    $("outside").addEventListener("keydown", (event) => event.preventDefault());
    $host.open($("about"));

    const event = new KeyboardEvent("keydown", {
      key: "Escape",
      bubbles: true,
      cancelable: true,
    });

    $("outside").dispatchEvent(event);

    expectExpanded("about", "about-menu", true);
  });

  it("moves focus into the submenu on ArrowDown on an expanded button", async () => {
    mount();
    await userEvent.click($("about"));

    await press($("about"), "ArrowDown");

    expect(document.activeElement).toBe($("overview"));
  });

  it("moves between top-level items, wrapping, with Home and End", async () => {
    mount();
    await userEvent.click($("about"));

    await press($("home"), "ArrowRight");
    expect(document.activeElement).toBe($("about"));

    await userEvent.keyboard("{ArrowLeft}");
    await userEvent.keyboard("{ArrowLeft}");
    expect(document.activeElement).toBe($("services"));

    await userEvent.keyboard("{Home}");
    expect(document.activeElement).toBe($("home"));

    await userEvent.keyboard("{End}");
    expect(document.activeElement).toBe($("services"));
  });

  it("moves between submenu items", async () => {
    mount();
    await userEvent.click($("about"));

    await press($("overview"), "ArrowDown");
    expect(document.activeElement).toBe($("team"));

    await userEvent.keyboard("{End}");
    expect(document.activeElement).toBe($("history"));

    await userEvent.keyboard("{ArrowDown}");
    expect(document.activeElement).toBe($("overview"));
  });

  it("leaves arrow keys to text fields", async () => {
    mount();
    await userEvent.click($("services"));

    await press($("search"), "ArrowDown");

    expect(document.activeElement).toBe($("search"));
  });

  it("leaves arrow keys pressed with a modifier to the browser", () => {
    mount();
    $("home").focus();

    const event = new KeyboardEvent("keydown", {
      key: "ArrowRight",
      altKey: true,
      bubbles: true,
    });

    $("home").dispatchEvent(event);

    expect(event.defaultPrevented).toBe(false);
    expect(document.activeElement).toBe($("home"));
  });

  it('ignores arrow keys with data-arrow-keys="false"', async () => {
    mount(markup.replace('id="host"', 'id="host" data-arrow-keys="false"'));

    await press($("home"), "ArrowRight");

    expect(document.activeElement).toBe($("home"));
  });
});

describe("focus", () => {
  it("closes the open submenu when focus leaves the navigation", async () => {
    mount();
    await userEvent.click($("about"));

    $("team").focus();
    $("outside").focus();

    expectExpanded("about", "about-menu", false);
    expect(document.activeElement).toBe($("outside"));
  });

  it("moves focus to the button when the submenu holding it closes", () => {
    const $host = mount();

    $host.open($("about"));
    $("overview").focus();
    $host.close();

    expectExpanded("about", "about-menu", false);
    expect(document.activeElement).toBe($("about"));
  });

  it("moves focus to the outermost closing button from a nested submenu", () => {
    const $host = mount();

    $host.open($("about"));
    $host.open($("team"));
    $("leadership").focus();
    $host.close($("about"));

    expectExpanded("team", "team-menu", false);
    expect(document.activeElement).toBe($("about"));
  });

  it("closes the submenu when its button is clicked while focus is inside it", async () => {
    mount();
    await userEvent.click($("about"));

    $("overview").focus();
    await userEvent.click($("about"));

    expectExpanded("about", "about-menu", false);
  });

  it("keeps the submenu open while focus stays inside the navigation", async () => {
    mount();
    await userEvent.click($("about"));

    $("team").focus();
    $("home").focus();

    expectExpanded("about", "about-menu", true);
  });
});

describe("hover", () => {
  it("opens a submenu when the mouse enters its button, and closes it when the mouse leaves", async () => {
    mount(hoverMarkup);

    await userEvent.hover($("about"));
    expectExpanded("about", "about-menu", true);

    await userEvent.hover($("outside"));
    expectExpanded("about", "about-menu", false);
  });

  it("does not open on hover without data-hover", async () => {
    mount();

    await userEvent.hover($("about"));

    expectExpanded("about", "about-menu", false);
  });

  it("keeps the submenu open while the mouse moves into it", async () => {
    mount(hoverMarkup);

    await userEvent.hover($("about"));
    await userEvent.hover($("overview"));

    expectExpanded("about", "about-menu", true);
  });

  it("keeps the submenu open on the first click after the hover, and closes it on the next one", async () => {
    mount(hoverMarkup);
    await userEvent.hover($("about"));

    await userEvent.click($("about"));
    expectExpanded("about", "about-menu", true);

    await userEvent.click($("about"));
    expectExpanded("about", "about-menu", false);
  });

  it("closes the open submenu when the mouse enters another button", async () => {
    mount(hoverMarkup);

    await userEvent.hover($("about"));
    await userEvent.hover($("services"));

    expectExpanded("about", "about-menu", false);
    expectExpanded("services", "1-services", true);
  });

  it("closes a nested submenu when the mouse leaves it for its parent", async () => {
    // Out of the flow, as in a real navigation: closing it moves nothing under the mouse
    mount(
      hoverMarkup
        .replace(
          '<ul id="about-menu" hidden>',
          '<ul id="about-menu" style="position: relative" hidden>',
        )
        .replace(
          '<ul id="team-menu" hidden>',
          '<ul id="team-menu" style="position: absolute; inset-block-start: 0; inset-inline-start: 8em" hidden>',
        ),
    );

    await userEvent.hover($("about"));
    await userEvent.hover($("team"));
    expectExpanded("team", "team-menu", true);

    await userEvent.hover($("history"));
    expectExpanded("team", "team-menu", false);
    expectExpanded("about", "about-menu", true);
  });

  it("closes the submenu opened on hover on Escape, the focus staying where it is", async () => {
    mount(hoverMarkup);
    $("outside").focus();

    await userEvent.hover($("about"));
    await userEvent.keyboard("{Escape}");

    expectExpanded("about", "about-menu", false);
    expect(document.activeElement).toBe($("outside"));
  });

  it("does not reopen while the mouse moves within the button", async () => {
    mount(hoverMarkup);
    await userEvent.hover($("about"));
    await userEvent.keyboard("{Escape}");

    const event = new PointerEvent("pointerover", {
      pointerType: "mouse",
      bubbles: true,
      relatedTarget: $("about"),
    });

    $("about-icon").dispatchEvent(event);

    expectExpanded("about", "about-menu", false);
  });

  it("leaves touch to the click", () => {
    mount(hoverMarkup);

    const event = new PointerEvent("pointerover", {
      pointerType: "touch",
      bubbles: true,
    });

    $("about").dispatchEvent(event);

    expectExpanded("about", "about-menu", false);
  });
});

describe("nested submenus", () => {
  it("keeps the parent open when a nested submenu opens", async () => {
    mount();
    await userEvent.click($("about"));
    await userEvent.click($("team"));

    expectExpanded("about", "about-menu", true);
    expectExpanded("team", "team-menu", true);
  });

  it("closes the nested submenus with their parent", async () => {
    mount();
    await userEvent.click($("about"));
    await userEvent.click($("team"));
    await userEvent.click($("about"));

    expectExpanded("about", "about-menu", false);
    expectExpanded("team", "team-menu", false);
  });

  it("closes the nested submenus when another branch opens", async () => {
    mount();
    await userEvent.click($("about"));
    await userEvent.click($("team"));
    await userEvent.click($("services"));

    expectExpanded("about", "about-menu", false);
    expectExpanded("team", "team-menu", false);
    expectExpanded("services", "1-services", true);
  });

  it("closes the nested submenus innermost first, as nested popovers", () => {
    const $host = mount();

    $host.open($("about"));
    $host.open($("team"));

    const events = record($("nav"));

    $host.close();

    expect(events).toEqual([
      "beforetoggle #team-menu open→closed",
      "beforetoggle #about-menu open→closed",
    ]);
  });

  it("closes only the innermost submenu on Escape inside it", async () => {
    mount();
    await userEvent.click($("about"));
    await userEvent.click($("team"));

    await press($("leadership"), "Escape");

    expectExpanded("team", "team-menu", false);
    expectExpanded("about", "about-menu", true);
    expect(document.activeElement).toBe($("team"));
  });

  it("follows the reading order through an open nested submenu", async () => {
    mount();
    await userEvent.click($("about"));
    await press($("team"), "Enter");

    await userEvent.keyboard("{ArrowDown}");
    expect(document.activeElement).toBe($("leadership"));

    await userEvent.keyboard("{ArrowUp}");
    expect(document.activeElement).toBe($("team"));

    await press($("designers"), "ArrowDown");
    expect(document.activeElement).toBe($("history"));

    await userEvent.keyboard("{ArrowUp}");
    expect(document.activeElement).toBe($("designers"));

    await userEvent.keyboard("{End}");
    expect(document.activeElement).toBe($("history"));
  });

  // WebKit, as Safari, tabs to links only with Option + Tab or its setting
  it.skipIf(server.browser === "webkit")("moves into a nested submenu with Tab", async () => {
    mount();
    await userEvent.click($("about"));
    await userEvent.click($("team"));

    $("team").focus();
    await userEvent.tab();

    expect(document.activeElement).toBe($("leadership"));
  });

  it("skips the items of collapsed nested submenus", async () => {
    mount();
    await userEvent.click($("about"));

    await press($("team"), "ArrowDown");
    expect(document.activeElement).toBe($("history"));

    await userEvent.keyboard("{ArrowUp}");
    expect(document.activeElement).toBe($("team"));
  });
});

describe("reading direction", () => {
  it("swaps left and right in a right-to-left navigation", async () => {
    mount(markup.replace('<nav id="nav"', '<nav id="nav" dir="rtl"'));

    await press($("home"), "ArrowLeft");
    expect(document.activeElement).toBe($("about"));

    await userEvent.keyboard("{ArrowRight}");
    expect(document.activeElement).toBe($("home"));
  });
});

describe.runIf(supportsUntilFound)('hidden="until-found"', () => {
  const untilFound = markup
    .replace(
      '<ul id="about-menu" hidden>',
      '<ul id="about-menu" hidden="until-found">',
    )
    .replace(
      '<ul id="team-menu" hidden>',
      '<ul id="team-menu" hidden="until-found">',
    );

  it("restores until-found when a submenu closes", async () => {
    mount(untilFound);

    await userEvent.click($("about"));
    expect($("about-menu").hidden).toBe(false);

    await userEvent.click($("about"));
    expect($("about-menu").hidden).toBe("until-found");
  });

  it("opens the submenus revealed by fragment navigation, nested ones included", async () => {
    const $host = mount(untilFound);
    const sources: (string | undefined)[] = [];

    $host.addEventListener(
      "beforetoggle",
      (event) => sources.push(event.source?.id),
      { capture: true },
    );

    location.hash = "designers";

    await expect
      .poll(() => $("about").getAttribute("aria-expanded"))
      .toBe("true");
    expectExpanded("team", "team-menu", true);
    expectExpanded("about", "about-menu", true);
    expect(sources).toEqual(["team", "about"]);
  });
});

describe("API", () => {
  it("opens, closes and toggles a submenu", () => {
    const $host = mount();

    $host.open($("about"));
    expectExpanded("about", "about-menu", true);

    $host.toggle($("services"));
    expectExpanded("about", "about-menu", false);
    expectExpanded("services", "1-services", true);

    $host.close();
    expectExpanded("services", "1-services", false);
  });

  it("removes the listeners on destroy() and keeps the markup state", async () => {
    const $host = mount();

    await userEvent.click($("about"));
    $host.destroy();
    await userEvent.click($("about"));

    expectExpanded("about", "about-menu", true);
  });

  it("binds its listeners once when moved in the document", async () => {
    const $host = mount();

    document.body.append($host);
    await userEvent.click($("about"));

    expectExpanded("about", "about-menu", true);
  });
});
