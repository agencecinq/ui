/** What a drag has done so far. */
export type DragValues = {
  /** Horizontal distance from the press, in px. */
  dx: number;
  /** Vertical distance from the press, in px. */
  dy: number;
  /** Horizontal speed over the last 50 ms, in px/ms, positive rightward. */
  vx: number;
  /** Vertical speed over the last 50 ms, in px/ms, positive downward. */
  vy: number;
};

export type DragEndValues = DragValues & {
  /** The browser took the pointer back before the release. */
  canceled: boolean;
};

export type DragOptions = {
  /** Gets `[dragging]` while a gesture runs. */
  host?: Element;
  /**
   * The element that takes the pointer for this press, or `null` to ignore it.
   * Defaults to the listened element. Lets one listener on a container start
   * gestures on its children.
   */
  target?: (event: PointerEvent) => Element | null;
  /**
   * A primary press, once the gesture holds the pointer and the host has
   * `[dragging]`. Return `false` to give the gesture up: both are undone
   * before the next paint.
   */
  start?: (event: PointerEvent) => boolean | void;
  move?: (event: PointerEvent, values: DragValues) => void;
  end?: (event: PointerEvent, values: DragEndValues) => void;
};

export type DragTracker = {
  /** Stops a running gesture without calling `end`. */
  cancel(): void;
  /** Cancels a running gesture and removes the listeners. */
  destroy(): void;
};

/**
 * The speed is measured over the positions of the last 50 ms: two events too
 * close in time would spike it, and a pause before the release brings it to 0.
 */
const SPEED_WINDOW = 50;

type Sample = {
  x: number;
  y: number;
  time: number;
};

type Gesture = {
  pointerId: number;
  $target: Element;
  startX: number;
  startY: number;
  /** Positions of the last {@link SPEED_WINDOW} ms, oldest first. */
  samples: Sample[];
};

/**
 * Tracks one pointer gesture at a time on `$element`: captures the pointer on
 * a primary press, follows that pointer only, and ends on release, cancel or
 * lost capture. The caller decides what the values mean.
 *
 * @param $element - Listens for the presses, and takes the pointer unless `target` picks another element.
 * @param options - Callbacks and the element that gets `[dragging]`.
 * @returns `cancel()` and `destroy()`.
 *
 * @example
 * const drag = trackDrag($thumb, {
 *   host: this,
 *   move: (event, { dx }) => this.setValue(this.valueAt(dx)),
 * });
 *
 * // in destroy()
 * drag.destroy();
 */
export const trackDrag = (
  $element: EventTarget,
  options: DragOptions = {},
): DragTracker => {
  const { host, target, start, move, end } = options;

  let gesture: Gesture | null = null;

  const valuesOf = ({ startX, startY, samples }: Gesture): DragValues => {
    const first = samples[0];
    const last = samples[samples.length - 1];
    const elapsed = last.time - first.time;
    const values = { dx: last.x - startX, dy: last.y - startY, vx: 0, vy: 0 };

    if (elapsed <= 0) {
      return values;
    }

    return {
      ...values,
      vx: (last.x - first.x) / elapsed,
      vy: (last.y - first.y) / elapsed,
    };
  };

  /** Records a position and forgets the ones older than the speed window. */
  const follow = ({ samples }: Gesture, { clientX, clientY, timeStamp }: PointerEvent): void => {
    const since = timeStamp - SPEED_WINDOW;

    samples.push({ x: clientX, y: clientY, time: timeStamp });

    while (samples.length > 1 && samples[0].time < since) {
      samples.shift();
    }
  };

  /** Drops the gesture first, so the lost capture that follows is ignored. */
  const stop = (current: Gesture): void => {
    const { pointerId, $target } = current;

    gesture = null;
    host?.removeAttribute("dragging");

    if ($target.hasPointerCapture(pointerId)) {
      $target.releasePointerCapture(pointerId);
    }
  };

  const handleDown = (event: PointerEvent): void => {
    const { button, pointerId, clientX, clientY, timeStamp } = event;

    if (gesture || button !== 0) {
      return;
    }

    const $target = target ? target(event) : (event.currentTarget as Element | null);

    if (!$target) {
      return;
    }

    const current: Gesture = {
      pointerId,
      $target,
      startX: clientX,
      startY: clientY,
      samples: [{ x: clientX, y: clientY, time: timeStamp }],
    };

    gesture = current;
    host?.setAttribute("dragging", "");
    $target.setPointerCapture(pointerId);

    // The gesture already holds the pointer and [dragging]: start can act on the press.
    if (start?.(event) === false) {
      stop(current);
    }
  };

  const handleMove = (event: PointerEvent): void => {
    const current = gesture;

    if (!current || event.pointerId !== current.pointerId) {
      return;
    }

    follow(current, event);
    move?.(event, valuesOf(current));
  };

  const handleEnd = (event: PointerEvent): void => {
    const current = gesture;
    const { pointerId, type } = event;

    if (!current || pointerId !== current.pointerId) {
      return;
    }

    const canceled = type !== "pointerup";

    // The release counts too: its position may be new, and its time ends a pause.
    if (!canceled) {
      follow(current, event);
    }

    const values = { ...valuesOf(current), canceled };

    stop(current);
    end?.(event, values);
  };

  const listeners: [string, (event: PointerEvent) => void][] = [
    ["pointerdown", handleDown],
    ["pointermove", handleMove],
    ["pointerup", handleEnd],
    ["pointercancel", handleEnd],
    ["lostpointercapture", handleEnd],
  ];

  listeners.forEach(([type, listener]) => {
    $element.addEventListener(type, listener as EventListener);
  });

  const cancel = (): void => {
    if (gesture) {
      stop(gesture);
    }
  };

  const destroy = (): void => {
    cancel();

    listeners.forEach(([type, listener]) => {
      $element.removeEventListener(type, listener as EventListener);
    });
  };

  return { cancel, destroy };
};
