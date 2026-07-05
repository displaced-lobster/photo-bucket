<script lang="ts">
	import '../app.css';
	import type { Snippet } from 'svelte';

	let { children }: { children: Snippet } = $props();
</script>

<div class="page">
	{@render children()}
</div>

<style>
	.page {
		max-width: 1400px;
		margin: 0 auto;
		padding: 2rem 1rem;
	}
</style>
