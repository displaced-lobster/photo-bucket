<script lang="ts">
	import JustifiedRow from '$lib/JustifiedRow.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<main>
	{#each data.rows as row (row.folder)}
		<JustifiedRow folder={row.folder} photos={row.photos} photosBaseUrl={data.photosBaseUrl} />
	{/each}
</main>

<style>
	main {
		display: flex;
		flex-direction: column;
		gap: 4px;
	}
</style>
