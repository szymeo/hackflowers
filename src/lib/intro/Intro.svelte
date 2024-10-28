<script lang="ts">
	import { backgroundSizeTransition, scaleInFullscreen } from '$lib/utils/transitions';
	import { fly, fade } from 'svelte/transition';
	import { quartInOut } from 'svelte/easing';
	import bouquet from '$lib/assets/bigflower.jpg';
	import { calculateScalePercentage } from '$lib/utils/math';
	// import { goto } from '$app/navigation';

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
			introPhase = 1;
			// goto('/builder');
		}, 8000);
	});
</script>

<svelte:window bind:innerHeight={screenY} bind:innerWidth={screenX} />

{#snippet image(delay = 0, multiplier = 1, primaryAnimation = false)}
	<div
		in:fly={{ y: screenY * multiplier, easing: quartInOut, delay, duration: DEBUG_DURATION + 4500, opacity: 1 }}
		out:fade={{ duration: primaryAnimation ? 500 : 0 }}
		class={"flex items-center py-4 z-10 shrink-0"}
		style="
			height: {screenY/COLUMNS}px;
			aspect-ratio: {screenX} / {screenY};
			-webkit-backface-visibility: hidden;
			-webkit-transform: perspective(1000px);
		"
	>
		<div
			in:backgroundSizeTransition={{ delay: 2500, duration: primaryAnimation ? DEBUG_DURATION + 6050 : 0 }}
			bind:clientWidth={rectX}
			bind:clientHeight={rectY}
			style="
				background-image: url({bouquet});
				background-size: 100%;
				background-position: center;
				background-repeat: no-repeat;
				transform: translate3d(0, 0, 0);
				-webkit-backface-visibility: hidden;
				-webkit-transform: perspective(1000px);
			"
			class="w-full h-full pointer-events-none shrink-0 text-8xl text-white"
		></div>
	</div>
{/snippet}

{#snippet imagesColumn(delay = 0, multiplier = 1, imageScaledTo = false)}
	<div
		in:fly={{ y: 200 * multiplier, easing: quartInOut, duration: multiplier < 0 ? DEBUG_DURATION + 6800 : 0, opacity: 1 }}
		class="flex h-full max-h-full px-4 {multiplier > 0 ? 'flex-col-reverse' : 'flex-col pt-32'}"
		style="width: {screenX/ROWS}px;-webkit-backface-visibility: hidden;"
	>
		{@render image(delay + 1300, multiplier)}
		{@render image(delay + 1000, multiplier)}
		{@render image(delay + 900, multiplier, imageScaledTo && true)}
		{@render image(delay + 600, multiplier)}
		{@render image(delay, multiplier)}
	</div>
{/snippet}

{#if animate && screenX && screenY && introPhase === 0}
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