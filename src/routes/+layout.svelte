<script lang="ts">
	import '../app.scss';
	import barefoot from '$lib/assets/PPPAAA.wav';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import { dev } from '$app/environment';
	import { goto } from '$app/navigation';

	const PLAY_INTRO_DELAY = 1300;
	let audio: HTMLAudioElement = $state(null);
	let { children } = $props();
	let paused = $state(true);
	let playingIntro = $state(dev);

	onMount(() => {
		if (audio) {
			audio.volume = 0.3;
		}
		if (!dev) {
			goto('/');
		}
	});
</script>

<div class="app relative flex flex-col overflow-hidden">
	{#if !dev}
		<audio
			bind:this={audio}
			src={barefoot}
			bind:paused={paused}
		></audio>
	{/if}

	{#if paused && !dev}
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
	{:else if playingIntro}
		{@render children()}
	{/if}

	<div class="sparkles z-0 absolute w-full h-full">
		{#each Array(100) as _}
			<div class="absolute w-0.5 h-0.5 rounded-full"></div>
		{/each}
	</div>
</div>

<style lang="scss">
    .app {
        height: 100dvh;
        width: 100dvw;
    }

    .sparkles {
        bottom: -40px;
    }

    .sparkles > div {
        background: #ff96c0;
        box-shadow: 0 0 12px 4px #ff4e85;
        bottom: 0;
        opacity: 0;
    }

    $sparkles: 100;

    @function random-delay($min, $max) {
        @return $min + random($max - $min + 1);
    }

    @for $i from 1 through $sparkles {
        .sparkles > div:nth-child(#{$i}) {
            $time: random-delay(5s, 40s);
            -moz-animation: sparkle $time ease-in-out infinite;
            -webkit-animation: sparkle $time ease-in-out infinite;
            animation: sparkle $time ease-in-out infinite;
            left: $i * 60px;
            $base-delay: random-delay(0s, 8s);
            $random-addition: random-delay(0s, 8s);
            $delay: $base-delay + $random-addition;
            -moz-animation-delay: #{$delay};
            -webkit-animation-delay: #{$delay};
            animation-delay: #{$delay};
        }
    }

    @-moz-keyframes sparkle {
        50% {
            opacity: 1;
        }
        100% {
            bottom: 100%;
        }
    }

    @-ms-keyframes sparkle {
        50% {
            opacity: 1;
        }
        100% {
            bottom: 100%;
        }
    }

    @keyframes sparkle {
        50% {
            opacity: 1;
        }
        100% {
            bottom: 100%;
        }
    }
</style>
