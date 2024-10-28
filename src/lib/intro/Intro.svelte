<script module lang="ts">
	import { fly } from 'svelte/transition';
	import { cubicInOut, quartInOut } from 'svelte/easing';
	import bouquet from '$lib/assets/flower.webp';
	import { calculateScalePercentage } from '$lib/utils/math';
	import {backgroundSizeTransition, scaleInFullscreen} from '$lib/utils/transitions';

	let rect = $state<{ width: number, height: number }>({ width: 0, height: 0 });

	const DEBUG_DURATION = 1;
	const COLUMNS = 5;
	const ROWS = 5;
	let screenY = $state(0);
	let screenX = $state(0);
	const scalePercentage = $derived.by(() => calculateScalePercentage({
		imageWidth: rect.width,
		imageHeight: rect.height,
		screenHeight: screenY,
		screenWidth: screenX
	}));
	const animate = $derived.by(() => scalePercentage?.xScale && scalePercentage?.yScale);
</script>

<svelte:window bind:innerHeight={screenY} bind:innerWidth={screenX} />

{#snippet image(delay = 0, multipler = 1, primaryAnimation = false)}
	<div
		in:fly={{ y: screenY * multipler, easing: quartInOut, delay, duration: DEBUG_DURATION + 4500, opacity: 1 }}
		class="flex items-center py-4 z-10"
		style="
			height: {screenY/COLUMNS}px;
			-webkit-backface-visibility: hidden;
			-webkit-transform: perspective(1000px);
		"
	>
		<div
			in:backgroundSizeTransition={{ delay: 2500, duration: primaryAnimation ? DEBUG_DURATION + 6050 : 0 }}
			bind:contentRect={rect}
			style="
				background-image: url({bouquet});
				background-size: 100%;
				background-position: center;
				aspect-ratio: {screenX} / {screenY};
				transform: translate3d(0, 0, 0);
				-webkit-backface-visibility: hidden;
				-webkit-transform: perspective(1000px);
			"
			class="w-full h-full rounded pointer-events-none">
		</div>
	</div>
{/snippet}

{#snippet imagesColumn(delay = 0, multipler = 1, imageScaledTo = false)}
	<div
		in:fly={{ y: 200 * multipler, easing: quartInOut, duration: multipler < 0 ? DEBUG_DURATION + 6800 : 0, opacity: 1 }}
		class="flex h-full max-h-full px-4 {multipler > 0 ? 'flex-col-reverse' : 'flex-col pt-32'}"
		style="width: {screenX/ROWS}px;-webkit-backface-visibility: hidden;"
	>
		{@render image(delay + 1300, multipler)}
		{@render image(delay + 1000, multipler)}
		{@render image(delay + 900, multipler, imageScaledTo && true)}
		{@render image(delay + 600, multipler)}
		{@render image(delay, multipler)}
	</div>
{/snippet}

{#if animate && screenX && screenY}
	<div
		in:scaleInFullscreen="{{ delay: 2000, duration: DEBUG_DURATION + 6100, endScaleX: scalePercentage.xScale, endScaleY: scalePercentage.yScale }}"
		class="flex w-full h-full"
		style="
		 	will-change: transform;
		 	-webkit-backface-visibility: hidden;
		 	transform: scale({scalePercentage?.xScale || 100}%, {scalePercentage?.yScale || 100}%);
		"
	>
		{@render imagesColumn(100 + 300)}
		{@render imagesColumn(100 + 150, -1)}
		{@render imagesColumn(0, 1, true)}
		{@render imagesColumn(100 + 150, -1)}
		{@render imagesColumn(100 + 300)}
	</div>
{:else}
	<div class="flex w-full h-full invisible"
		 style="{animate ? `will-change: transform;-webkit-backface-visibility: hidden;transform: scale(${scalePercentage?.xScale || 100}%, ${scalePercentage?.yScale || 100}%)` : ''}"
	>
		<div
			class="flex h-full max-h-full px-4 flex-col"
			style="width: {screenX/ROWS}px;"
		>
			{@render image()}
		</div>
	</div>
{/if}

<style>
    .image {
        object-fit: cover;
        object-position: center 100%;
    }
</style>