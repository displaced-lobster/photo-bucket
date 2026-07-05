import { fetchRows } from '$lib/api';

export async function load({ fetch }) {
	return fetchRows(fetch);
}
