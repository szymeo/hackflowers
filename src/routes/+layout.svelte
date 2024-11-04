<script lang="ts">
	import '../app.scss';
	import { onMount } from 'svelte';
	import { dev } from '$app/environment';
	import { goto } from '$app/navigation';

	let { children } = $props();

	onMount(() => {
		if (!dev) {
			goto('/');
		}
	});
</script>

<div class="w-full h-full relative flex flex-col overflow-hidden">
	{@render children()}

	<div class="sparkles z-0 absolute w-full h-full">
		{#each Array(100) as _}
			<div class="absolute w-0.5 h-0.5 rounded-full"></div>
		{/each}
	</div>
</div>

<style lang="scss">
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
