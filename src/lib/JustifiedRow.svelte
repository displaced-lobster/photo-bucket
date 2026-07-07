<script lang="ts">
	const GAP = 4;
	const FALLBACK_RATIO = 3 / 2;
	const MIN_HEIGHT = 120;

	let { folder, photos, photosBaseUrl }: { folder: string; photos: string[]; photosBaseUrl: string } =
		$props();

	let containerWidth = $state(0);
	// svelte-ignore state_referenced_locally -- intentional: only the initial value is needed,
	// since this component remounts (keyed by folder) whenever `photos` would change.
	let aspectRatios = $state<number[]>(photos.map(() => FALLBACK_RATIO));
	// svelte-ignore state_referenced_locally -- intentional: only the initial value is needed,
	// since this component remounts (keyed by folder) whenever `photos` would change.
	let loaded = $state<boolean[]>(photos.map(() => false));

	let availableWidth = $derived(Math.max(0, containerWidth - GAP * (photos.length - 1)));
	let sumRatios = $derived(aspectRatios.reduce((a, b) => a + b, 0));

	let height = $derived.by(() => {
		if (containerWidth === 0) return MIN_HEIGHT;
		const raw = availableWidth / sumRatios;
		return Math.max(MIN_HEIGHT, raw);
	});

	let widths = $derived(aspectRatios.map((ratio) => height * ratio));

	function photoUrl(photo: string): string {
		return `${photosBaseUrl}/${folder}/${photo}`;
	}

	function handleLoad(e: Event, i: number) {
		const img = e.currentTarget as HTMLImageElement;
		if (img.naturalWidth && img.naturalHeight) {
			aspectRatios[i] = img.naturalWidth / img.naturalHeight;
		}
		loaded[i] = true;
	}
</script>

<div class="row" bind:clientWidth={containerWidth}>
	{#each photos as photo, i (photo)}
		<a
			class="thumb"
			href="/photo/{encodeURIComponent(folder)}/{encodeURIComponent(photo)}"
			style="height: {height}px; width: {widths[i]}px; aspect-ratio: {aspectRatios[i]}"
		>
			<img
				src={photoUrl(photo)}
				alt={photo}
				loading="lazy"
				class:loaded={loaded[i]}
				onload={(e) => handleLoad(e, i)}
			/>
		</a>
	{/each}
</div>

<style>
	.row {
		display: flex;
		flex-wrap: nowrap;
		gap: 4px;
		overflow: hidden;
	}

	.thumb {
		position: relative;
		display: block;
		flex-shrink: 0;
		overflow: hidden;
		border-radius: 20px;
		background: var(--bg);
	}

	.thumb img {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
		opacity: 0;
		transition: opacity 0.3s ease;
	}

	.thumb img.loaded {
		opacity: 1;
	}

	@media (max-width: 700px) {
		.row {
			flex-direction: column;
			overflow: visible;
		}

		.thumb {
			width: 100% !important;
			height: auto !important;
		}
	}
</style>
