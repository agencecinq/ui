/** What a drag has done so far. */
export type DragValues = {
  /** Horizontal distance from the press, in px. */
  dx: number;
  /** Vertical distance from the press, in px. */
  dy: number;
  /** Horizontal speed of the last move, in px/ms, positive rightward. */
  vx: number;
  /** Vertical speed of the last move, in px/ms, positive downward. */
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
  /** A primary press. Return `false` to ignore it. */
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

type Gesture = {
  pointerId: number;
  $target: Element;
  startX: number;
  startY: number;
  lastX: number;
  lastY: number;
  lastTime: number;
  vx: number;
  vy: number;
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

  const valuesOf = ({ startX, startY, lastX, lastY, vx, vy }: Gesture): DragValues => ({
    dx: lastX - startX,
    dy: lastY - startY,
    vx,
    vy,
  });

  const follow = (current: Gesture, { clientX, clientY, timeStamp }: PointerEvent): void => {
    const elapsed = Math.max(timeStamp - current.lastTime, 1);

    current.vx = (clientX - current.lastX) / elapsed;
    current.vy = (clientY - current.lastY) / elapsed;
    current.lastX = clientX;
    current.lastY = clientY;
    current.lastTime = timeStamp;
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

    if (!$target || start?.(event) === false) {
      return;
    }

    gesture = {
      pointerId,
      $target,
      startX: clientX,
      startY: clientY,
      lastX: clientX,
      lastY: clientY,
      lastTime: timeStamp,
      vx: 0,
      vy: 0,
    };

    host?.setAttribute("dragging", "");
    $target.setPointerCapture(pointerId);
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
    const { pointerId, clientX, clientY, type } = event;

    if (!current || pointerId !== current.pointerId) {
      return;
    }

    const canceled = type !== "pointerup";

    // A release can come with no pointermove since the last position.
    if (!canceled && (clientX !== current.lastX || clientY !== current.lastY)) {
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
