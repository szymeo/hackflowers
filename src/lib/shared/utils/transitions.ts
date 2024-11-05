import { circInOut, cubicInOut, quartInOut } from 'svelte/easing';

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
	{ delay = 0, duration = 400, from = '250', to = '200', windowWidth, windowHeight }
) {
	const imageDimensions = {
		width: 1770,
		height: 1180
	};
	const imgRatio = imageDimensions.height / imageDimensions.width;
	const containerRatio = windowHeight / windowWidth;
	let heightPx: number;
	let widthPx: number;

	if (containerRatio > imgRatio) {
		heightPx = windowHeight;
		widthPx = windowHeight / imgRatio;
	} else {
		widthPx = windowWidth;
		heightPx = windowWidth * imgRatio;
	}

	const widthPct = (widthPx / windowWidth) * 100;
	const heightPct = (heightPx / windowHeight) * 100;

	return {
		delay,
		duration,
		easing: quartInOut,
		css: (t: number) => {
			const startSizeX = parseFloat(from);
			const startSizeY = parseFloat(from) * (heightPct / widthPct);
			const currentSizeX = startSizeX + t * (widthPct - startSizeX);
			const currentSizeY = startSizeY + t * (heightPct - startSizeY);

			return `
				background-size: ${currentSizeX}% ${currentSizeY}%;
				-webkit-background-size: ${currentSizeX}% ${currentSizeY}%;
				-moz-background-size: ${currentSizeX}% ${currentSizeY}%;
				-o-background-size: ${currentSizeX}% ${currentSizeY}%;
			`;
		}
	};
}

export function boxTransition(
	node: HTMLElement,
	{
		delay = 0,
		duration = 400,
		easing = circInOut,
		start = { x: 0, y: 0, width: '100px', height: '100px', backgroundXPosition: 0 },
		end = { x: 100, y: 100, width: '200px', height: '200px', backgroundXPosition: 100 }
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
				console.log(
					start.backgroundXPosition +
						(end.backgroundXPosition - start.backgroundXPosition) * t
				);

				return `
						transform: translate(${startX + (endX - startX) * t}px, ${startY + (endY - startY) * t}px);
						width: ${parseFloat(startWidth) + (parseFloat(endWidth) - parseFloat(startWidth)) * t}px;
						height: ${parseFloat(startHeight) + (parseFloat(endHeight) - parseFloat(startHeight)) * t}px;
						background-position-x: ${start.backgroundXPosition + (end.backgroundXPosition - start.backgroundXPosition) * t}%;
					`;
			} else {
				let backgroundXPosition = 0;
				if (start.backgroundXPosition > end.backgroundXPosition) {
					backgroundXPosition =
						end.backgroundXPosition +
						(start.backgroundXPosition - end.backgroundXPosition) * t;
				} else {
					console.log('bep', start.backgroundXPosition, end.backgroundXPosition);

					backgroundXPosition =
						start.backgroundXPosition +
						(end.backgroundXPosition - start.backgroundXPosition) * t;
				}

				return `
						transform: translate(${endX + (startX - endX) * t}px, ${endY + (startY - endY) * t}px);
						width: ${parseFloat(endWidth) + t * (parseFloat(startWidth) - parseFloat(endWidth))}px;
						height: ${parseFloat(endHeight) + t * (parseFloat(startHeight) - parseFloat(endHeight))}px;
						background-position-x: ${backgroundXPosition}%;
					`;
			}
		}
	};
}
