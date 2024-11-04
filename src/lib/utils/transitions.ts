import { cubicInOut, quartInOut, quintInOut } from 'svelte/easing';

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

export function boxTransition(
	node: HTMLElement,
	{
		delay = 0,
		duration = 400,
		easing = quintInOut,
		start = { x: 0, y: 0, width: '100px', height: '100px' },
		end = { x: 100, y: 100, width: '200px', height: '200px' }
	}
) {
	const { x: startX, y: startY, width: startWidth, height: startHeight } = start;
	const { x: endX, y: endY, width: endWidth, height: endHeight } = end;

	return {
		delay,
		duration,
		easing,
		css: (t) => {
			if (parseFloat(startWidth) < parseFloat(endWidth)) {
				return `
						transform: translate(${startX + (endX - startX) * t}px, ${startY + (endY - startY) * t}px);
						width: ${parseFloat(startWidth) + (parseFloat(endWidth) - parseFloat(startWidth)) * t}px;
						height: ${parseFloat(startHeight) + (parseFloat(endHeight) - parseFloat(startHeight)) * t}px;
					`;
			} else {
				return `
						transform: translate(${endX + (startX - endX) * t}px, ${endY + (startY - endY) * t}px);
						width: ${parseFloat(endWidth) + t * (parseFloat(startWidth) - parseFloat(endWidth))}px;
						height: ${parseFloat(endHeight) + t * (parseFloat(startHeight) - parseFloat(endHeight))}px;
					`;
			}
		}
	};
}
