import { describe, expect, it, vi } from "vitest";
import { Store } from "./store.js";

type Party = { gold: number; members: string[] };

const party = (): Party => ({ gold: 10, members: ["Mialee"] });

describe("set", () => {
  it("takes a value or an update function", () => {
    const store = new Store(1);

    store.set(2);
    store.set((value) => value * 10);

    expect(store.get()).toBe(20);
  });

  it("normalizes before comparing, then notifies with the previous state", () => {
    const store = new Store(party(), {
      normalize: (next) => ({ ...next, gold: Math.max(0, next.gold) }),
    });
    const listener = vi.fn();
    const before = store.get();

    store.subscribe(listener);
    store.set((state) => ({ ...state, gold: -5 }));

    expect(store.get().gold).toBe(0);
    expect(listener).toHaveBeenCalledWith(store.get(), before);
  });

  it("skips equal states", () => {
    const store = new Store(party(), {
      equals: (a, b) => JSON.stringify(a) === JSON.stringify(b),
    });
    const listener = vi.fn();

    store.subscribe(listener);
    store.set((state) => ({ ...state }));

    expect(listener).not.toHaveBeenCalled();
  });

  it("keeps notifying when a listener throws", () => {
    const store = new Store(0);
    const error = new Error("Mimic");
    const report = vi.spyOn(console, "error").mockImplementation(() => {});
    const after = vi.fn();

    store.subscribe(() => {
      throw error;
    });
    store.subscribe(after);
    store.set(1);

    expect(after).toHaveBeenCalledWith(1, 0);
    report.mockRestore();
  });
});

describe("subscribe and select", () => {
  it("stops after unsubscribing", () => {
    const store = new Store(0);
    const listener = vi.fn();
    const unsubscribe = store.subscribe(listener);

    unsubscribe();
    store.set(1);

    expect(listener).not.toHaveBeenCalled();
  });

  it("selects right away, then on slice changes only", () => {
    const store = new Store(party());
    const listener = vi.fn();

    store.select((state) => state.gold, listener);
    store.set((state) => ({ ...state, members: [...state.members, "Tordek"] }));
    store.set((state) => ({ ...state, gold: 25 }));

    expect(listener.mock.calls).toEqual([[10], [25]]);
  });
});

describe("mutate", () => {
  it("runs actions in order and sets what they resolve to", async () => {
    const store = new Store(party());
    const order: string[] = [];
    const later = store.mutate(async (state) => {
      await new Promise((resolve) => setTimeout(resolve, 10));
      order.push("first");
      return { ...state, gold: state.gold + 5 };
    });
    const sooner = store.mutate(async (state) => {
      order.push("second");
      return { ...state, gold: state.gold * 2 };
    });

    await Promise.all([later, sooner]);

    expect(order).toEqual(["first", "second"]);
    expect(store.get().gold).toBe(30);
  });

  it("tracks the pending state of the queue", async () => {
    const store = new Store(0);
    const pending = vi.fn();

    store.subscribePending(pending);
    await Promise.all([store.mutate(async () => 1), store.mutate(async () => 2)]);

    expect(pending.mock.calls).toEqual([[false], [true], [false]]);
    expect(store.pending).toBe(false);
  });

  it("leaves the state as is and keeps the queue going after a rejection", async () => {
    const store = new Store(1);

    await expect(store.mutate(async () => Promise.reject(new Error("Fumble")))).rejects.toThrow(
      "Fumble",
    );
    await store.mutate(async (value) => value + 1);

    expect(store.get()).toBe(2);
    expect(store.pending).toBe(false);
  });
});
