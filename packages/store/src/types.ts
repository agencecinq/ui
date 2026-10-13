/** Called with the new state and the one it replaces. */
export type Listener<T> = (state: T, previous: T) => void;

/** Called with `true` when the queue starts working, `false` once it is idle. */
export type PendingListener = (pending: boolean) => void;

export type Equals<T> = (a: T, b: T) => boolean;

/** Next state from the current one. */
export type Update<T> = T | ((state: T) => T);

/** Async action of the queue: resolves to the next state. */
export type Action<T> = (state: T) => Promise<T>;

export type Options<T> = {
  /** Applied to every next state before it is compared, e.g. clamped to a catalog. */
  normalize?: (next: T, previous: T) => T;
  /** Same states skip the notification. Default `Object.is`. */
  equals?: Equals<T>;
};
