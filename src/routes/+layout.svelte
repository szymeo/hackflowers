<script lang="ts">
	import '../app.scss';

	let { children } = $props();
</script>

<div class="app flex flex-col overflow-hidden">
	<!--	<Header />-->
	{@render children()}
</div>

<style>
    .app {
        height: 100dvh;
        width: 100dvw;
    }
</style>
