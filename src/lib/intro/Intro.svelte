<script lang="ts">
	import { backgroundSizeTransition, scaleToFullscreen } from '$lib/utils/transitions';
	import { fly, fade } from 'svelte/transition';
	import { quartInOut } from 'svelte/easing';
	import bouquet from '$lib/assets/bigflower.jpg';
	import { calculateScalePercentage } from '$lib/utils/math';
	// import { goto } from '$app/navigation';

	const PADDING = 64;
	let rectX = $state(0);
	let rectY = $state(0);
	const DEBUG_DURATION = 1;
	const COLUMNS = 5;
	const ROWS = 5;
	let screenY = $state(0);
	let screenX = $state(0);
	const scalePercentage = $derived.by(() => calculateScalePercentage({
		imageWidth: rectX,
		imageHeight: rectY,
		screenHeight: screenY,
		screenWidth: screenX
	}));
	const animate = $derived.by(() => scalePercentage?.xScale && scalePercentage?.yScale );

	let introPhase = $state(0);

	$effect(() => {
		setTimeout(() => {
			// introPhase = 1;
			// goto('/builder');
		}, 8000);
	});
</script>

<svelte:window bind:innerHeight={screenY} bind:innerWidth={screenX} />

{#snippet image(delay = 0, multiplier = 1, primaryAnimation = false)}
	<div
		in:fly={{ y: screenY * ROWS * multiplier, easing: quartInOut, delay, duration: DEBUG_DURATION + 4500, opacity: 1 }}
		out:fade={{ duration: primaryAnimation ? 500 : 0 }}
		class={"flex items-center z-10 shrink-0"}
		style="
			padding-top: {PADDING}px;
			padding-bottom: {PADDING}px;
			-webkit-backface-visibility: hidden;
			-webkit-transform: perspective(1000px);
		"
	>
		<div
			in:backgroundSizeTransition={{ delay: 2500, duration: primaryAnimation ? DEBUG_DURATION + 6050 : 0 }}
			style="
				background-image: url({bouquet});
				background-size: cover;
				background-position: center;
				background-repeat: no-repeat;
				transform: translate3d(0, 0, 0);
				-webkit-backface-visibility: hidden;
				-webkit-transform: perspective(1000px);
			"
			class="w-screen h-screen pointer-events-none shrink-0 text-8xl text-white"
		>
		</div>
	</div>
{/snippet}

{#snippet imagesColumn(delay = 0, multiplier = 1, imageScaledTo = false)}
	<div
		in:fly={{ y: 200 * multiplier, easing: quartInOut, duration: multiplier < 0 ? DEBUG_DURATION + 6800 : 0, opacity: 1 }}
		class="flex h-full max-h-full shrink-0 {multiplier > 0 ? 'flex-col-reverse' : 'flex-col pt-80'}"
		style="width: {screenX + PADDING * 2}px;padding-left:{PADDING}px;padding-right:{PADDING}px;-webkit-backface-visibility: hidden;"
	>
		{@render image(delay + 1300, multiplier)}
		{@render image(delay + 1000, multiplier)}
		{@render image(delay + 900, multiplier, imageScaledTo && true)}
		{@render image(delay + 600, multiplier)}
		{@render image(delay, multiplier)}
	</div>
{/snippet}

<div class="w-screen h-screen overflow-hidden">
	{#if introPhase === 0 && screenX && screenY}
		<div
			in:scaleToFullscreen="{{ delay: 2000, duration: DEBUG_DURATION + 6100, startScaleX: 25, startScaleY: 25 }}"
			class="flex"
			style="
				position: absolute;
				left: calc(-1 * ({(COLUMNS * 40)}% + {(COLUMNS) * PADDING}px));
				transform: scale(100%, 100%);
				top: calc(-1 * ({(ROWS * 40)}% + {(ROWS) * PADDING}px));
				width: calc({COLUMNS * 100}vw + {COLUMNS * PADDING * 2}px);
				height: calc({ROWS * 100}vh + {ROWS * PADDING * 2}px);
				will-change: transform;
				-webkit-backface-visibility: hidden;
			"
		>
			{@render imagesColumn(100 + 300)}
			{@render imagesColumn(100 + 150, -1)}
			{@render imagesColumn(0, 1, true)}
			{@render imagesColumn(100 + 150, -1)}
			{@render imagesColumn(100 + 300)}
		</div>
	{:else if introPhase === 1}
		<div>
			faza2
		</div>
	{:else if !animate}
		<div class="flex w-full h-full"
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
</div>