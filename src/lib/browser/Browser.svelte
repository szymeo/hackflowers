<script lang="ts">
	import { cls } from 'svelte-ux';

	let track: HTMLDivElement = $state(null);
	let selectedIndex = $state(null);
	let windowWidth = $state(0);
	let imageBrowserWidth = $state(null);
	let imageBrowserOffset = $state(null);
	let leftScroll = $state(0);
	let isDown = false;
	let startX;
	let scrollLeft;
	let velX;
	let momentumID;

	const images = [
		'https://images.unsplash.com/photo-1524781289445-ddf8f5695861?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80',
		'https://images.unsplash.com/photo-1610194352361-4c81a6a8967e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1674&q=80',
		'https://images.unsplash.com/photo-1618202133208-2907bebba9e1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80',
		'https://images.unsplash.com/photo-1495805442109-bf1cf975750b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80',
		'https://images.unsplash.com/photo-1548021682-1720ed403a5b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80',
		'https://images.unsplash.com/photo-1496753480864-3e588e0269b3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2134&q=80',
		'https://images.unsplash.com/photo-1613346945084-35cccc812dd5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1759&q=80',
		'https://images.unsplash.com/photo-1516681100942-77d8e7f9dd97?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80'
	];

	const handleOnDown = e => {
		isDown = true;
		startX = e.pageX - track.offsetLeft;
		scrollLeft = track.scrollLeft;
		cancelMomentumTracking();
	};

	const handleOnUp = () => {
		isDown = false;
		beginMomentumTracking();
	};

	const handleOnMove = e => {
		if (!isDown) {
			return;
		}
		e.preventDefault();
		const x = e.pageX - track.offsetLeft;
		const walk = (x - startX) * 0.8; //scroll-fast
		const prevScrollLeft = track.scrollLeft;

		track.scrollLeft = scrollLeft - walk;
		velX = track.scrollLeft - prevScrollLeft;
	};

	function beginMomentumTracking() {
		cancelMomentumTracking();
		momentumID = requestAnimationFrame(momentumLoop);
	}

	function cancelMomentumTracking() {
		cancelAnimationFrame(momentumID);
	}

	function momentumLoop() {
		track.scrollLeft += velX;
		velX *= 0.95;
		if (Math.abs(velX) > 0.5) {
			momentumID = requestAnimationFrame(momentumLoop);
		}
	}

	$effect(() => {
		imageBrowserOffset = leftScroll / (track.scrollWidth - track.clientWidth) * 100;
	});
</script>

<svelte:window
	bind:innerWidth={windowWidth}
/>

<div
	class={cls(`w-full h-full shrink-0 overflow-auto scroll-smooth flex items-center`, {
	})}
>
	<!--	ontouchstart={e => handleOnDown(e.touches[0])}-->
	<!--	ontouchend={() => handleOnUp()}-->
	<!--	ontouchmove={e => handleOnMove(e.touches[0])}-->
	<div
		bind:clientWidth={imageBrowserWidth}
		bind:this={track}
		onscroll={()=>leftScroll=track.scrollLeft}
		onwheel={cancelMomentumTracking}
		onmousedown={handleOnDown}
		onmouseup={handleOnUp}
		onmousemove={handleOnMove}
		class="z-10 image-track h-full flex items-center px-[30vw] no-scrollbar"
		data-mouse-down-at="0"
		data-prev-percentage="0"
	>
		{#each images as image, index}
			<!--				onclick={() => selectedIndex = selectedIndex === index ? null : index}-->
			<!--				onkeydown={(e) => e.key === 'Enter' && (selectedIndex = selectedIndex === index ? null : index)}-->
			<div
				role="button"
				tabindex="0"
				style="
					transition: width 0.8s, height 0.8s, object-fit 0.8s, object-position 0.8s;
				"
				class={cls('image shrink-0 relative w-[38vw] mx-[1vw] h-[56vw]', {
					'z-20': selectedIndex === index,
					'z-10': selectedIndex !== index
				})}
				draggable="false"
			>
				<div
					style="
						background-image: url({image});
						background-position: {imageBrowserOffset}% center;
					"
					class={cls('absolute bg-no-repeat bg-cover', {
						'w-screen h-screen': selectedIndex === index,
						'w-full h-full': selectedIndex !== index
					})}
				></div>
			</div>
		{/each}
	</div>
</div>

<style lang="scss">
    .image-track {
        position: relative;
        width: 100%;
        overflow-x: scroll;
        overflow-y: hidden;
        white-space: nowrap;
        transition: all 0.2s;
        transform: scale(0.98);
        will-change: transform;
        user-select: none;
        cursor: pointer;

        & > .image {
            display: inline-block;
            max-width: none;
            //width: 40vmin;
            //height: 56vmin;
            //object-fit: cover;
            object-position: 100% center;
        }
    }
</style>