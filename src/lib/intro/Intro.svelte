<script lang="ts">
	import { backgroundSizeTransition, scaleToFullscreen } from '$lib/shared/utils/transitions';
	import { fly, fade } from 'svelte/transition';
	import { quartInOut } from 'svelte/easing';
	import { createImageMatrix as buildMatrix } from '$lib/shared/utils/image-matrix';
	import type { Image } from '$lib/shared/types/image.model';

	type Props = {
		images: Image[];
		done?: () => void;
	}

	const { images, done }: Props = $props();

	const PADDING = 64;
	const DEBUG_DURATION = 1;
	const PHASE_1_FADEOUT_DURATION = 855;
	const COLUMNS = 5;
	const ROWS = 5;
	const matrix = buildMatrix<Image>(images, COLUMNS, ROWS);
	let screenY = $state(0);
	let screenX = $state(0);
	let introPhase = $state(0);

	$effect(() => {
		let timeout1;
		const timeout2 = setTimeout(() => {
			introPhase = 1;
			done?.();
		}, 8000);

		return()=> {
			clearTimeout(timeout1);
			clearTimeout(timeout2);
		}
	});
</script>

<svelte:window bind:innerHeight={screenY} bind:innerWidth={screenX} />

{#snippet image(url: string, delay = 0, multiplier = 1, primaryAnimation = false)}
	<div
		in:fly={{ y: screenY * ROWS * multiplier, easing: quartInOut, delay, duration: DEBUG_DURATION + 4500, opacity: 1 }}
		class={"flex items-center z-20 shrink-0 backface-hidden will-change-transform"}
		style="
			padding-top: {PADDING}px;
			padding-bottom: {PADDING}px;
			-webkit-transform: perspective(1000px);
		"
	>
		<div
			in:backgroundSizeTransition={{
				delay: 2500,
				duration: primaryAnimation ? DEBUG_DURATION + 6050 : 0,
				windowWidth: screenX,
				windowHeight: screenY
			}}
			style="
				background-image: url({url});
				transform: translate3d(0, 0, 0);
				-webkit-transform: perspective(1000px);
			"
			class="w-screen h-screen pointer-events-none shrink-0 text-8xl text-white bg-cover bg-center bg-no-repeat will-change-auto"
		>
		</div>
	</div>
{/snippet}

{#snippet imagesColumn(index, delay = 0, multiplier = 1, imageScaledTo = false)}
	<div
		in:fly={{ y: 200 * multiplier, easing: quartInOut, duration: multiplier < 0 ? DEBUG_DURATION + 6800 : 0, opacity: 1 }}
		class="flex will-change-transform backface-hidden h-full max-h-full shrink-0 {multiplier > 0 ? 'flex-col-reverse' : 'flex-col pt-80'}"
		style="width: {screenX + PADDING * 2}px;padding-left:{PADDING}px;padding-right:{PADDING}px;"
	>
		{@render image(matrix[index][0].src, delay + 1300, multiplier)}
		{@render image(matrix[index][1].src, delay + 1000, multiplier)}
		{@render image(matrix[index][2].src, delay + 900, multiplier, imageScaledTo && true)}
		{@render image(matrix[index][3].src, delay + 600, multiplier)}
		{@render image(matrix[index][4].src, delay, multiplier)}
	</div>
{/snippet}

<div class="w-screen h-screen overflow-hidden z-20">
	{#if introPhase === 0 && screenX && screenY}
		<div
			in:scaleToFullscreen="{{ delay: 2000, duration: DEBUG_DURATION + 6100, startScaleX: 25, startScaleY: 25 }}"
			class="flex absolute will-change-transform backface-hidden"
			style="
				left: calc(-1 * ({(COLUMNS * 40)}% + {(COLUMNS) * PADDING}px));
				transform: scale(100%, 100%);
				top: calc(-1 * ({(ROWS * 40)}% + {(ROWS) * PADDING}px));
				width: calc({COLUMNS * 100}vw + {COLUMNS * PADDING * 2}px);
				height: calc({ROWS * 100}vh + {ROWS * PADDING * 2}px);
			"
		>
			{@render imagesColumn(0, 100 + 300)}
			{@render imagesColumn(1, 100 + 150, -1)}
			{@render imagesColumn(2, 0, 1, true)}
			{@render imagesColumn(3, 100 + 150, -1)}
			{@render imagesColumn(4, 100 + 300)}
		</div>
	{/if}
</div>