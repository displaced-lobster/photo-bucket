# Photography Site

A SvelteKit photography portfolio backed by Cloudflare R2 for image storage and a Cloudflare Worker for dynamic album listing.

## Architecture

```
yourdomain.com           → Cloudflare Pages (SvelteKit app)
photos.yourdomain.com    → R2 public bucket (image files served directly)
api.yourdomain.com       → Cloudflare Worker (lists bucket, returns album JSON)
```

The SvelteKit app fetches album data from the Worker at runtime — no redeploy needed when you add photos.

## R2 Bucket Structure

Albums are top-level folders. Folder names drive sort order, so prefix them with a date.

```
2024-03-15_iceland/
    meta.json
    01.webp
    02.webp
    03.webp
2024-06-01_norway/
    meta.json
    01.webp
    02.webp
```

Albums are sorted alphabetically by folder name, so `2024-03-15_iceland` appears before `2024-06-01_norway`.

## meta.json

Every album folder must contain a `meta.json` file. Folders without one are silently skipped.

```json
{
  "title": "Iceland, March 2024",
  "rows": [
    { "photos": ["01.webp", "02.webp"] },
    { "photos": ["03.webp"] },
    { "photos": ["04.webp", "05.webp", "06.webp"] }
  ]
}
```

### Fields

| Field | Type | Description |
|-------|------|-------------|
| `title` | string | Display title for the album |
| `rows` | Row[] | Ordered list of photo rows |

### Row

| Field | Type | Description |
|-------|------|-------------|
| `photos` | string[] | Filenames in this row. Length determines column layout: `1` = full width, `2` = half width each, `3` = third width each |

Photos within a row are displayed left to right in the order listed. Rows are displayed top to bottom in the order listed.

## Local Development

You need two terminals.

**Terminal 1 — Worker:**
```sh
cd worker
npm install
npm run dev        # starts on http://localhost:8787
```

**Terminal 2 — SvelteKit app:**
```sh
npm install
echo 'VITE_WORKER_URL=http://localhost:8787' > .env
npm run dev        # starts on http://localhost:5173
```

## Configuration

### worker/wrangler.toml

```toml
[[r2_buckets]]
binding = "PHOTOS_BUCKET"
bucket_name = "your-bucket-name"   # your R2 bucket name

[vars]
PHOTOS_BASE_URL = "https://photos.yourdomain.com"  # public URL of your R2 bucket
```

### .env (SvelteKit app)

```sh
VITE_WORKER_URL=https://api.yourdomain.com   # deployed Worker URL
```

## Deployment

**Worker:**
```sh
cd worker
npm run deploy
```

**SvelteKit app:**
Connect the repo to Cloudflare Pages. Set the build command to `npm run build` and the output directory to `.svelte-kit/cloudflare`. Add `VITE_WORKER_URL` as an environment variable pointing to your deployed Worker.
