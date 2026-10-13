import { Action, Equals, Listener, Options, PendingListener, Update } from './types.js';
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
export declare class Store<T> {
    #private;
    /** `initial` is taken as is: normalize it first when it needs to be. */
    constructor(initial: T, options?: Options<T>);
    get(): T;
    /** Whether queued actions are still running. */
    get pending(): boolean;
    /** A function is called with the current state and returns the next one. */
    set(update: Update<T>): void;
    /** Called on every change, not right away. Returns the unsubscribe function. */
    subscribe(listener: Listener<T>): () => void;
    /**
     * Called right away with the selected slice, then only when it changes.
     * Returns the unsubscribe function.
     */
    select<S>(selector: (state: T) => S, listener: (value: S) => void, equals?: Equals<S>): () => void;
    /**
     * Runs `action` after the queued ones, then sets the state it resolves to.
     * A rejected action leaves the state as is and does not block the queue.
     */
    mutate(action: Action<T>): Promise<T>;
    /** Called right away with the current state of the queue, then on every change. */
    subscribePending(listener: PendingListener): () => void;
}
//# sourceMappingURL=store.d.ts.map