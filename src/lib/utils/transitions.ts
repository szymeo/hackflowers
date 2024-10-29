import { cubicInOut, quartInOut } from 'svelte/easing';

export function scaleToFullscreen(
	node: HTMLElement,
	{ delay = 0, duration = 400, startScaleX = 10, startScaleY = 10 }
) {
	return {
		delay,
		duration,
		easing: cubicInOut,
		css: (t: number) => {
			const currentScaleX = startScaleX + t * (100 - startScaleX);
			const currentScaleY = startScaleY + t * (100 - startScaleY);
			return `transform: scale(${currentScaleX}%, ${currentScaleY}%);`;
		}
	};
}

export function scaleInTransition(
	node: HTMLElement,
	{ delay = 0, duration = 400, easing = cubicInOut, startScale = 0 }
) {
	const originalTransform = getComputedStyle(node).transform;

	return {
		delay,
		duration,
		easing,
		css: (t: number) => {
			const currentScale = startScale + t * (100 - startScale);
			return `transform: ${originalTransform} scale(${currentScale}%);`;
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
