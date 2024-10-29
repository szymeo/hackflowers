<script lang="ts">
	import '../app.scss';
	import barefoot from '$lib/assets/PPPAAA.wav';

	let { children } = $props();
	let paused = $state(true);
</script>

<div class="app relative flex flex-col overflow-hidden">
	<audio
		src={barefoot}
		bind:paused={paused}
	></audio>

	{#if paused}
		<button
			class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-full px-6 py-3 tracking-wide font-bold w-fit uppercase text-xs"
			onclick={() => {
			paused = false;
		}}>
			start
		</button>
	{:else}
		{@render children()}
	{/if}
</div>

<style>
    .app {
        height: 100dvh;
        width: 100dvw;
    }
</style>
