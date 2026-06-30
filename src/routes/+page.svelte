<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	function photoUrl(folder: string, filename: string): string {
		return `${data.photosBaseUrl}/${folder}/${filename}`;
	}

	const colClass: Record<number, string> = {
		1: 'cols-1',
		2: 'cols-2',
		3: 'cols-3'
	};
</script>

<main>
	{#each data.albums as album (album.folder)}
		<section class="album">
			<h2 class="album-title">{album.title}</h2>
			<div class="rows">
				{#each album.rows as row, i (i)}
					<div class="row {colClass[row.photos.length] ?? 'cols-1'}">
						{#each row.photos as photo (photo)}
							<img
								src={photoUrl(album.folder, photo)}
								alt={photo}
								loading="lazy"
							/>
						{/each}
					</div>
				{/each}
			</div>
		</section>
	{/each}
</main>

<style>
	main {
		max-width: 1400px;
		margin: 0 auto;
		padding: 2rem 1rem;
	}

	.album {
		margin-bottom: 4rem;
	}

	.album-title {
		font-size: 1rem;
		font-weight: 400;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		margin-bottom: 1rem;
		color: #555;
	}

	.rows {
		display: flex;
		flex-direction: column;
		gap: 4px;
	}

	.row {
		display: grid;
		gap: 4px;
	}

	.cols-1 { grid-template-columns: 1fr; }
	.cols-2 { grid-template-columns: 1fr 1fr; }
	.cols-3 { grid-template-columns: 1fr 1fr 1fr; }

	.row img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
		aspect-ratio: 3 / 2;
	}
</style>
