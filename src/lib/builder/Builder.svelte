<script lang="ts">
	import { scaleInTransition } from '$lib/shared/utils/transitions';
	import flower1 from '$lib/assets/carousel/flower1.png';
	import flower2 from '$lib/assets/carousel/flower2.png';
	import flower3 from '$lib/assets/carousel/flower3.png';
	import { backInOut, bounceInOut, quintIn, quintInOut } from 'svelte/easing';
	import { fade } from 'svelte/transition';

	const DEBUG_DURATION = 1;
	const CAROUSEL_SCALE_IN_DURATION = DEBUG_DURATION + 1500;
	const radius = 600; // Radius of the circle
	const centerX = 0; // X coordinate of the circle's center
	const centerY = 0; // Y coordinate of the circle's center

	let flowers = [
		flower1,
		flower2,
		flower3,
		flower1,
		flower2,
		flower3,
		flower1,
		flower2,
		flower3,
		flower1,
		flower2,
		flower3,
		flower1,
		flower2,
		flower3,
	];
	let spinAngle = $state(0);

	$effect(() => {
		const int = setInterval(() => {
			if (carouselHovered) {
				return;
			}

			spinAngle += 0.001;
		}, 1000 / 60);

		return () => clearInterval(int);
	});

	const positions = $derived.by(() => {
		const angleStep = (2 * Math.PI) / flowers.length;
		const p = flowers.map((_, index) => {
			const angle = index * angleStep + spinAngle;
			const x = centerX + radius * Math.cos(angle);
			const y = centerY + radius * Math.sin(angle);
			return { x, y };
		});
		return p;
	});
	let screenY = $state(0);
	let screenX = $state(0);
	let carouselHovered = $state(false);

	let unique = $state(null);

	$effect(() => {
		unique = {};
	});
</script>

<svelte:window bind:innerHeight={screenY} bind:innerWidth={screenX} />

<div class="w-screen h-screen overflow-hidden">
	{#if unique}
		<div
			in:scaleInTransition="{{ delay: 0, easing: backInOut, duration: CAROUSEL_SCALE_IN_DURATION, startScale: 0.6 }}"
			class="absolute bg-white rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-0 h-0 z-10"
		>
			{#each flowers as flower, index}
				<div
					onmouseenter={()=>{carouselHovered = true}}
					onmouseleave={()=>{carouselHovered = false}}
					role="figure"
					in:fade|global={{ delay: 350+(index * 15), duration: DEBUG_DURATION + 250, easing: quintInOut }}
					class="shrink-0 scale-100 fixed -translate-x-1/2 -translate-y-1/2 w-32 h-32"
					style="
						top: {positions[index].y}px;
						left: {positions[index].x}px;
					"
				>
					<div
						class="
							h-full w-full
							bg-contain bg-no-repeat bg-center
							hover:scale-125 transition-all
						"
						style="
							background-image: url({flower});
						"
					>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>