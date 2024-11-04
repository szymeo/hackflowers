<script lang="ts">
	import Intro from '$lib/intro/Intro.svelte';
	import Browser from '$lib/browser/Browser.svelte';

	const { data } = $props();
	let stage = $state(0);
</script>

<svelte:head>
	<title>FlowerLoverClub | Home</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<section class="w-full h-full overflow-hidden z-20">
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
</section>
