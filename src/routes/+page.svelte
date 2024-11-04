<script lang="ts">
	import Intro from '$lib/intro/Intro.svelte';
	import Browser from '$lib/browser/Browser.svelte';
	import { dev } from '$app/environment';
	import barefoot from '$lib/assets/PPPAAA.wav';
	import { fade } from 'svelte/transition';
	import { onMount } from 'svelte';

	const { data } = $props();
	const PLAY_INTRO_DELAY = 0;

	let audio: HTMLAudioElement = $state(null);
	let paused = $state(true);
	let playingIntro = $state(dev);
	let stage = $state(0);

	onMount(() => {
		if (audio) {
			audio.volume = 0.3;
		}
	});

	function preload(sources: string[]) {
		return Promise.all(sources.map(src => {
			return new Promise(resolve => {
				const img = new Image();
				img.src = src;
				img.onload = resolve;
			});
		}));
	}
</script>

<svelte:head>
	<title>FlowerLoverClub</title>
	<meta name="description" content="Fueled by love to flowers <3" />
</svelte:head>

<section class="w-full h-full overflow-hidden z-20">
	{#if !dev}
		<audio
			bind:this={audio}
			src={barefoot}
			bind:paused={paused}
		></audio>
	{/if}

	{#if paused && !dev}
		{#await preload(data.images)}
			<p class="absolute left-1/2 top-1/2 text-white -translate-y-1/2 -translate-x-1/2 uppercase text-xs">
				Loading...
			</p>
		{:then _}
			<button
				out:fade={{ duration: PLAY_INTRO_DELAY }}
				class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-full px-6 py-3 tracking-wide font-bold w-fit uppercase text-xs"
				onclick={() => {
					paused = false;
					setTimeout(() => {
						playingIntro = true;
					}, PLAY_INTRO_DELAY);
				}}
			>
				start
			</button>
		{/await}
	{:else if playingIntro}
		{#if stage === 0}
			<Intro
				images={data.images}
				done={() => {
				stage = 1;
			}}
			/>
		{:else if stage === 1}
			<Browser
				startMaximized={true}
				images={data.images}
				done={() => {
				stage = 2;
			}}
			/>
		{/if}
	{/if}
</section>
