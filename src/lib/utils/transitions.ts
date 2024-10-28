import { cubicInOut, quartInOut } from 'svelte/easing';

export function scaleInFullscreen(
	node: HTMLElement,
	{ delay = 0, duration = 400, endScaleX = 100, endScaleY = 100 }
) {
	const minValue = (value: number, minValue: number) => (value >= minValue ? value : minValue);

	return {
		delay,
		duration,
		easing: cubicInOut,
		css: (t: number) => {
			const startScaleX = 100;
			const startScaleY = 100;
			const currentScaleX = startScaleX + t * (minValue(endScaleX, 100) - startScaleX);
			const currentScaleY = startScaleY + t * (minValue(endScaleY, 100) - startScaleY);
			return `transform: scale(${currentScaleX}%, ${currentScaleY}%);`;
		}
	};
}

export function backgroundSizeTransition(
	node: HTMLElement,
	{ delay = 0, duration = 400, from = '200', to = '100' }
) {
	return {
		delay,
		duration,
		easing: quartInOut,
		css: (t: number) => {
			const startSize = parseFloat(from);
			const endSize = parseFloat(to);
			const currentSize = startSize + t * (endSize - startSize);
			return `background-size: ${currentSize}%;-webkit-background-size: ${currentSize}%;-moz-background-size: ${currentSize}%;-o-background-size: ${currentSize}%;`;
		}
	};
}
