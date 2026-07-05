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

Each top-level folder is one row on the page. Folder names drive sort order, so name them so they sort correctly, e.g. `YYYY-MM-DD-NN`.

```
2026-07-01-01/
    01.webp
    02.webp
    03.webp
2026-07-03-01/
    01.webp
    02.webp
```

On desktop, every photo in a folder is laid out on a single line (a justified row: each photo keeps its aspect ratio and the row height is scaled so the row exactly fills the available width). On narrow/mobile screens, photos stack full-width instead.

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
