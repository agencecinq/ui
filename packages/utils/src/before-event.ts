import { dispatchEvent } from './dispatch-event.js';

/** Defers the pending action until `promise` settles. A rejection cancels it. */
export type WaitUntil = (promise: PromiseLike<unknown>) => void;

/** `event.detail` of a before-event: the payload plus {@link WaitUntil}. */
export type BeforeEventDetail<T> = T & { waitUntil: WaitUntil };

/**
 * Dispatches a cancelable, non-bubbling before-event on `target`.
 *
 * Listeners cancel the action with `preventDefault()`, or defer it with
 * `event.detail.waitUntil(promise)`. Several listeners can defer the same
 * action: it proceeds once every promise fulfills, and is canceled if one
 * rejects. `waitUntil()` must be called synchronously in the listener.
 *
 * @typeParam T - Payload merged into `event.detail`.
 * @param target - Event target that receives the event.
 * @param name - Event type name (e.g. `EVENTS.DRAWER_BEFORE_OPEN`).
 * @param detail - Payload exposed on `event.detail` next to `waitUntil`.
 * @returns A boolean when no listener deferred (sync commit stays possible),
 *   otherwise a promise of whether the action may proceed.
 *
 * @example
 * const result = dispatchBeforeEvent(document.documentElement, EVENTS.DRAWER_BEFORE_OPEN, { drawer: id });
 */
export const dispatchBeforeEvent = <T extends object>(
  target: EventTarget,
  name: string,
  detail: T,
): boolean | Promise<boolean> => {
  const promises: PromiseLike<unknown>[] = [];
  let dispatching = true;

  const waitUntil: WaitUntil = (promise) => {
    if (!dispatching) {
      throw new Error(`${name}: call waitUntil() synchronously in the listener`);
    }

    promises.push(promise);
  };

  const proceed = dispatchEvent<BeforeEventDetail<T>>(
    target,
    name,
    { ...detail, waitUntil },
    { bubbles: false },
  );

  dispatching = false;

  if (!proceed) {
    return false;
  }

  if (promises.length === 0) {
    return true;
  }

  return Promise.allSettled(promises).then((results) =>
    results.every((result) => result.status === 'fulfilled'),
  );
};
