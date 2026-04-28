export type Details = {
	controls: string;
	element: HTMLElement;
};

export default function dispatchEvent(
	target: HTMLElement,
	details: Details,
	name: string,
): boolean {
	const event = new CustomEvent(name, {
		bubbles: true,
		cancelable: false,
		detail: details,
	});

	return target.dispatchEvent(event);
}

