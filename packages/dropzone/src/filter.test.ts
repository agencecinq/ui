import { describe, expect, it } from "vitest";
import { accepts, filter } from "./filter.js";

const file = (name: string, type: string, size = 10): File =>
  new File([new Uint8Array(size)], name, { type });

describe("accepts", () => {
  it("takes every file without accept", () => {
    expect(accepts(file("map.pdf", "application/pdf"), "")).toBe(true);
  });

  it("matches extensions, whatever the case", () => {
    expect(accepts(file("Sigil.SVG", "image/svg+xml"), ".svg,.png")).toBe(true);
    expect(accepts(file("sigil.gif", "image/gif"), ".svg, .png")).toBe(false);
  });

  it("matches exact MIME types and groups", () => {
    expect(accepts(file("portrait.png", "image/png"), "image/png")).toBe(true);
    expect(accepts(file("portrait.webp", "image/webp"), "image/*")).toBe(true);
    expect(accepts(file("scroll.pdf", "application/pdf"), "image/*")).toBe(false);
  });
});

describe("filter", () => {
  const rules = { accept: "image/*", maxSize: 100, multiple: false };

  it("keeps the first valid file of a single input", () => {
    const { accepted, rejected } = filter(
      [file("a.png", "image/png"), file("b.png", "image/png")],
      rules,
    );

    expect(accepted.map(({ name }) => name)).toEqual(["a.png"]);
    expect(rejected.map(({ reason }) => reason)).toEqual(["multiple"]);
  });

  it("gives the reason of each rejection", () => {
    const { accepted, rejected } = filter(
      [file("a.pdf", "application/pdf"), file("b.png", "image/png", 500), file("c.png", "image/png")],
      { ...rules, multiple: true },
    );

    expect(accepted.map(({ name }) => name)).toEqual(["c.png"]);
    expect(rejected.map(({ file: { name }, reason }) => [name, reason])).toEqual([
      ["a.pdf", "accept"],
      ["b.png", "size"],
    ]);
  });

  it("ignores the size without a limit", () => {
    expect(filter([file("a.png", "image/png", 500)], { ...rules, maxSize: 0 }).accepted).toHaveLength(1);
  });
});
