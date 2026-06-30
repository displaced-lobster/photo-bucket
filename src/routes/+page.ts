import type { AlbumListResponse } from '$lib/types';

// Set this to your deployed Worker URL
const WORKER_URL = import.meta.env.VITE_WORKER_URL ?? 'http://localhost:8787';

export async function load({ fetch }) {
	const res = await fetch(WORKER_URL);
	if (!res.ok) throw new Error(`Failed to load albums: ${res.status}`);
	const data: AlbumListResponse = await res.json();
	return data;
}
