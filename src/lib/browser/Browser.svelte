<script lang="ts">
	import { onMount } from 'svelte';
	import BrowserImage from './Image.svelte';
	import { cls } from 'svelte-ux';
	import { boxTransition } from '$lib/shared/utils/transitions';
	import { switchCase } from '$lib/shared/utils/switch-case';
	import type { Image } from '$lib/shared/types/image.model';

	type Props = {
		images: Image[];
		startMaximized: boolean;
		done?: () => void;
	};

	let { images, startMaximized, done }: Props = $props();

	function vwToPx(vw: number) {
		return (vw * windowWidth) / 100;
	}

	function vhToPx(vh: number) {
		return (vh * windowHeight) / 100;
	}

	let initialAnimationPassed = $state(!startMaximized);
	let track: HTMLDivElement = $state(null);
	let selectedIndex = $state(startMaximized ? 0 : null);
	let lastSelectedIndex = $state(null);
	let windowWidth = $state(null);
	let windowHeight = $state(null);
	let imageBrowserOffset = $state(0);
	let leftScroll = $state(0);
	let previewDimensions = $state(null);
	let isDown = false;
	let startX = 0;
	let scrollLeft = 0;
	let velX = 0;
	let momentumID;

	const onPointerDown = (e) => {
		isDown = true;
		startX = e.pageX - track.offsetLeft;
		scrollLeft = track.scrollLeft;
		velX = 0;
		cancelMomentumTracking();
	};

	const onPointerUp = () => {
		isDown = false;
		beginMomentumTracking();
	};

	const onPointerMove = (e) => {
		if (!isDown) {
			return;
		}
		e.preventDefault();
		const SCROLLING_SPEED = 0.8;
		const x = e.pageX - track.offsetLeft;
		const walk = (x - startX) * SCROLLING_SPEED;
		const prevScrollLeft = track.scrollLeft;

		track.scrollLeft = scrollLeft - walk;
		velX = track.scrollLeft - prevScrollLeft;
	};

	function beginMomentumTracking() {
		cancelMomentumTracking();
		momentumID = requestAnimationFrame(momentumLoop);
	}

	function cancelMomentumTracking() {
		cancelAnimationFrame(momentumID);
		momentumID = null;
	}

	function momentumLoop() {
		track.scrollLeft += velX;
		velX *= 0.95;
		if (Math.abs(velX) > 0.5) {
			momentumID = requestAnimationFrame(momentumLoop);
		}
	}

	$effect(() => {
		imageBrowserOffset = (leftScroll / (track.scrollWidth - track.clientWidth)) * 100;
	});

	function onImageClicked(event: MouseEvent, index: number) {
		selectedIndex = selectedIndex === index ? null : index;
		const dimensions = (event.currentTarget as HTMLDivElement).getBoundingClientRect();

		previewDimensions = {
			x: dimensions.left,
			y: dimensions.top,
			width: dimensions.width,
			height: dimensions.height
		};
	}

	$effect(() => {
		if (windowWidth && windowHeight && !previewDimensions) {
			previewDimensions = {
				x: vwToPx(30) + vwToPx(1),
				y: vhToPx(22),
				width: vhToPx(38),
				height: vhToPx(56)
			};
		}
	});

	$effect(() => {
		if (selectedIndex !== null && lastSelectedIndex !== selectedIndex) {
			lastSelectedIndex = selectedIndex;
		}
	});

	onMount(() => {
		setTimeout(() => {
			if (startMaximized) {
				selectedIndex = null;
			}
		});

		setTimeout(() => {
			initialAnimationPassed = true;
		}, 1000);
	});

	$inspect(previewDimensions);
</script>

<svelte:window bind:innerWidth={windowWidth} bind:innerHeight={windowHeight} />

<!-- {#if previewDimensions}
	<div
		style="
		position: fixed;z-index:999;background-color:red;
		width:{previewDimensions.width}px;
		height:{previewDimensions.height}px;
		left:{previewDimensions.x}px;
		top:{previewDimensions.y}px;
	"
	></div>
{/if} -->

{#if selectedIndex !== null && previewDimensions}
	<div
		in:boxTransition={{
			delay: 0,
			duration: initialAnimationPassed ? 500 : 0,
			start: {
				x: initialAnimationPassed ? previewDimensions.x : 0,
				y: initialAnimationPassed ? previewDimensions.y : 0,
				width: initialAnimationPassed ? previewDimensions.width : windowWidth,
				height: initialAnimationPassed ? previewDimensions.height : windowHeight,
				backgroundXPosition: imageBrowserOffset
			},
			end: {
				x: 0,
				y: 0,
				width: windowWidth,
				height: windowHeight,
				backgroundXPosition: 50
			}
		}}
		out:boxTransition={{
			delay: 0,
			duration: initialAnimationPassed ? 600 : 5000,
			start: {
				x: 0,
				y: 0,
				width: `${windowWidth}px`,
				height: `${windowHeight}px`,
				backgroundXPosition: 50
			},
			end: {
				x: previewDimensions.x,
				y: previewDimensions.y,
				width: previewDimensions.width,
				height: previewDimensions.height,
				backgroundXPosition: imageBrowserOffset
			}
		}}
		style={switchCase({
			true: 'left: 0; top: 0; width: 100vw; height: 100vh;background-position: center center;',
			false: `left: ${previewDimensions.x}px; top: ${previewDimensions.y}px; width: ${previewDimensions.width}px; height: ${previewDimensions.height}px;background-position: ${imageBrowserOffset}% center;`
		})(String(selectedIndex !== null))}
		class={cls('absolute z-20 cursor-crosshair')}
		onclick={() => (selectedIndex = null)}
	>
		<div
			style={`
				background-image: url(${images[selectedIndex].src});
				background-position: inherit;
			`}
			class={cls('bg-no-repeat bg-cover w-full h-full')}
		></div>
	</div>
{/if}

<div class={cls(`w-full h-full shrink-0 overflow-auto scroll-smooth flex items-center`, {})}>
	<!--	ontouchstart={e => handleOnDown(e.touches[0])}-->
	<!--	ontouchend={() => handleOnUp()}-->
	<!--	ontouchmove={e => handleOnMove(e.touches[0])}-->
	<div
		bind:this={track}
		onscroll={() => (leftScroll = track.scrollLeft)}
		onwheel={cancelMomentumTracking}
		onpointerdown={onPointerDown}
		onpointerup={onPointerUp}
		onpointermove={onPointerMove}
		class="z-10 relative w-full whitespace-nowrap transition-all overflow-auto select-none h-full flex items-center px-[30vw] no-scrollbar cursor-crosshair"
		data-mouse-down-at="0"
		data-prev-percentage="0"
	>
		{#each images as image, index}
			<BrowserImage
				onclick={(e) => onImageClicked(e, index)}
				src={image.src}
				class="w-[38vh] mx-[1vw] h-[56vh]"
				backgroundOffset={imageBrowserOffset}
			/>
		{/each}
	</div>
</div>
