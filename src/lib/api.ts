import type { RowListResponse } from './types';

const WORKER_URL = import.meta.env.VITE_WORKER_URL ?? 'http://localhost:8787';

export async function fetchRows(fetch: typeof globalThis.fetch): Promise<RowListResponse> {
	const res = await fetch(WORKER_URL);
	if (!res.ok) throw new Error(`Failed to load rows: ${res.status}`);
	return res.json();
}
