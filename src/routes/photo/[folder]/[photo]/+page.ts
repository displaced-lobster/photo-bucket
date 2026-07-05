import { error } from '@sveltejs/kit';

export async function load({ parent, params }) {
	const { rows, photosBaseUrl } = await parent();
	const row = rows.find((r) => r.folder === params.folder);
	if (!row || !row.photos.includes(params.photo)) {
		error(404, 'Photo not found');
	}
	return { folder: params.folder, photo: params.photo, photosBaseUrl };
}
