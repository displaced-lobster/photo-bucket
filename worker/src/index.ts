interface Env {
	PHOTOS_BUCKET: R2Bucket;
	PHOTOS_BASE_URL: string;
}

interface Row {
	photos: string[];
}

interface Meta {
	title: string;
	rows: Row[];
}

interface Album {
	folder: string;
	title: string;
	rows: Row[];
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

		const folders = (listed.delimitedPrefixes ?? []).sort();

		const albums: Album[] = (
			await Promise.all(
				folders.map(async (folder) => {
					const metaObj = await env.PHOTOS_BUCKET.get(`${folder}meta.json`);
					if (!metaObj) return null;
					const meta: Meta = await metaObj.json();
					return { folder: folder.replace(/\/$/, ''), ...meta };
				})
			)
		).filter((a): a is Album => a !== null);

		const body = JSON.stringify({ albums, photosBaseUrl: env.PHOTOS_BASE_URL });

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
