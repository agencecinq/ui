import { html, body, scroll } from "./environment";


/**
 * Resets the scroll position of the window to the specified coordinates.
 *
 * @param positionX - The X coordinate to scroll to, as a number. If undefined, the X coordinate will not be changed.
 * @param positionY - The Y coordinate to scroll to, as a number. If undefined, the Y coordinate will not be changed.
 */
const reset = (positionX: number, positionY: number) => {
	// console.log('resetScroll', positionX, positionY)
	if ("undefined" !== typeof positionX) {
		scroll.x = positionX;
	}

	if ("undefined" !== typeof positionY) {
		scroll.y = positionY;
	}


	window.scrollTo(scroll.x, scroll.y);
};

/**
 * disableScroll
 *
 * Lock scroll position, but retain settings for later
 *
 * @see  http://stackoverflow.com/a/3656618
 */
export function disableScroll() {
	// console.info('disableScroll');

	const documentElementScrollLeft = html.scrollLeft;
	const documentElementScrollTop = html.scrollTop;

	const bodyScrollLeft = body.scrollLeft;
	const bodyScrollTop = body.scrollTop;

	scroll.x = window.scrollX || documentElementScrollLeft || bodyScrollLeft;
	scroll.y = window.scrollY || documentElementScrollTop || bodyScrollTop || 0;

	// console.log('disableScroll',scroll)

	html.style.setProperty("overflow", "hidden");
	html.style.setProperty("height", "100%");
	html.style.setProperty("scroll-padding-top", "0px");

	// eslint-disable-next-line
	reset(scroll.x, scroll.y);
}

export function enableScroll(position: number | boolean | undefined = 0): void {
	// console.info('enableScroll');

	let resumeScroll = true;
	let currentPosition: number = scroll.y;

	if (typeof position === "number") {
		currentPosition = position;
	} else if (typeof position === "boolean" && position === false) {
		resumeScroll = false;
	}

	// console.log('enableScroll', { scroll, resumeScroll, currentPosition });

	// unlock scroll position
	html.style.removeProperty("overflow");
	html.style.removeProperty("height");
	html.style.removeProperty("scroll-padding-top");

	// resume scroll position if possible
	if (resumeScroll) {
		reset(scroll.x, currentPosition);
	}
}
