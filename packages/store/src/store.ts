import type {
  Action,
  Equals,
  Listener,
  Options,
  PendingListener,
  Update,
} from "./types.js";

/** Reports a listener error without stopping the other listeners. */
const report = (error: unknown): void => {
  if (typeof globalThis.reportError === "function") {
    globalThis.reportError(error);
    return;
  }

  console.error(error);
};

/**
 * Observable state: one value, replaced on every change and never mutated.
 *
 * `set()` normalizes and compares the next state, then notifies listeners
 * synchronously. `mutate()` queues async actions (server calls) so they
 * settle in order, and tracks whether the queue is busy.
 *
 * Extend it for a domain store (`class CartStore extends Store<Cart>`), or
 * use it as is.
 */
export class Store<T> {
  #state: T;
  #normalize: (next: T, previous: T) => T;
  #equals: Equals<T>;
  #listeners = new Set<Listener<T>>();
  #pendingListeners = new Set<PendingListener>();
  #queue: Promise<unknown> = Promise.resolve();
  #running = 0;

  /** `initial` is taken as is: normalize it first when it needs to be. */
  constructor(initial: T, options: Options<T> = {}) {
    const { normalize = (next: T) => next, equals = Object.is } = options;

    this.#state = initial;
    this.#normalize = normalize;
    this.#equals = equals;
  }

  get(): T {
    return this.#state;
  }

  /** Whether queued actions are still running. */
  get pending(): boolean {
    return this.#running > 0;
  }

  /** A function is called with the current state and returns the next one. */
  set(update: Update<T>): void {
    const previous = this.#state;
    const value =
      typeof update === "function" ? (update as (state: T) => T)(previous) : update;
    const next = this.#normalize(value, previous);

    if (this.#equals(next, previous)) return;

    this.#state = next;
    this.#listeners.forEach((listener) => {
      try {
        listener(next, previous);
      } catch (error) {
        report(error);
      }
    });
  }

  /** Called on every change, not right away. Returns the unsubscribe function. */
  subscribe(listener: Listener<T>): () => void {
    this.#listeners.add(listener);

    return () => {
      this.#listeners.delete(listener);
    };
  }

  /**
   * Called right away with the selected slice, then only when it changes.
   * Returns the unsubscribe function.
   */
  select<S>(
    selector: (state: T) => S,
    listener: (value: S) => void,
    equals: Equals<S> = Object.is,
  ): () => void {
    let value = selector(this.#state);

    listener(value);

    return this.subscribe((state) => {
      const next = selector(state);

      if (equals(next, value)) return;

      value = next;
      listener(next);
    });
  }

  /**
   * Runs `action` after the queued ones, then sets the state it resolves to.
   * A rejected action leaves the state as is and does not block the queue.
   */
  mutate(action: Action<T>): Promise<T> {
    this.#busy(1);

    const run = async (): Promise<T> => {
      try {
        this.set(await action(this.#state));
        return this.#state;
      } finally {
        this.#busy(-1);
      }
    };
    const result = this.#queue.then(run, run);

    this.#queue = result.catch(() => undefined);

    return result;
  }

  /** Called right away with the current state of the queue, then on every change. */
  subscribePending(listener: PendingListener): () => void {
    this.#pendingListeners.add(listener);
    listener(this.pending);

    return () => {
      this.#pendingListeners.delete(listener);
    };
  }

  #busy(step: 1 | -1): void {
    const was = this.pending;

    this.#running += step;

    if (was === this.pending) return;

    this.#pendingListeners.forEach((listener) => {
      try {
        listener(this.pending);
      } catch (error) {
        report(error);
      }
    });
  }
}
