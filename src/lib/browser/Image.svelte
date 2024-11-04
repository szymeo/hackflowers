<script lang="ts">
import { cls } from 'svelte-ux';

const {
	onclick,
	src,
	class: className,
	backgroundOffset,
} = $props();

type Coords = {
	x: number;
	y: number;
}

let el: HTMLDivElement | null = $state(null);
let startXY: Coords = { x: 0, y: 0 };
let distance: Coords = { x: 0, y: 0 };

function onPointerDown(event) {
	event.preventDefault();

	startXY = {
		x: event.clientX,
		y: event.clientY,
	};
	el.addEventListener('pointermove', onPointerMove);
	el.addEventListener('pointerup', onPointerUp);
}

function onPointerMove(event) {
	event.preventDefault();
	distance = {
		x: event.clientX - startXY.x,
		y: event.clientY - startXY.y,
	};
}

function onPointerUp(event) {
	event.preventDefault();

	if (Math.abs(distance.x) > 10 || Math.abs(distance.y) > 10) {
		distance = { x: 0, y: 0 };
		return;
	}

	distance = { x: 0, y: 0 };
	onclick?.(event);
}

</script>

<div
	bind:this={el}
	onpointerdown={onPointerDown}
	role="button"
	tabindex="0"
	style="
		transition: width 0.8s, height 0.8s, object-fit 0.8s, object-position 0.8s;
	"
	class={cls('inline-block max-w-none cursor-crosshair shrink-0 relative z-10', className)}
	draggable="false"
>
	<div
		style="
			background-image: url({src});
			background-position: {backgroundOffset}% center;
		"
		class={cls('absolute bg-no-repeat bg-cover w-full h-full')}
	></div>
</div>