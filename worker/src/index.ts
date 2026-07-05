interface Env {
	PHOTOS_BUCKET: R2Bucket;
	PHOTOS_BASE_URL: string;
}

interface Row {
	folder: string;
	photos: string[];
}

const CORS_HEADERS = {
	'Access-Control-Allow-Origin': '*',
	'Access-Control-Allow-Methods': 'GET',
};

export default {
	async fetch(req: Request, env: Env): Promise<Response> {
		if (req.method === 'OPTIONS') {
			return new Response(null, { headers: CORS_HEADERS });
		}

		const cache = caches.default;
		const cached = await cache.match(req);
		if (cached) return cached;

		const listed = await env.PHOTOS_BUCKET.list({ delimiter: '/' });

		const folders = (listed.delimitedPrefixes ?? []).sort().reverse();

		const rows: Row[] = (
			await Promise.all(
				folders.map(async (folder) => {
					const listedPhotos = await env.PHOTOS_BUCKET.list({ prefix: folder, delimiter: '/' });
					const photos = (listedPhotos.objects ?? [])
						.map((obj) => obj.key.slice(folder.length))
						.filter((name) => name.length > 0)
						.sort();
					if (photos.length === 0) return null;
					return { folder: folder.replace(/\/$/, ''), photos };
				})
			)
		).filter((r): r is Row => r !== null);

		const body = JSON.stringify({ rows, photosBaseUrl: env.PHOTOS_BASE_URL });

		const res = new Response(body, {
			headers: {
				...CORS_HEADERS,
				'Content-Type': 'application/json',
				'Cache-Control': 'public, max-age=300',
			},
		});

		await cache.put(req, res.clone());
		return res;
	},
};
