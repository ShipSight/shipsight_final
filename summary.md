# ShipSight Final — Summary

Production web app: video management system (VMS) for e-commerce packing. Records packing videos in the browser and links them to scanned/typed barcodes (order IDs) for dispatch verification and theft prevention.

## Stack
- Vite + React 18 + TypeScript
- Tailwind + shadcn-ui (Radix primitives, full kit installed)
- React Router v6, TanStack Query, react-hook-form + zod
- FFmpeg WASM (`@ffmpeg/ffmpeg` + `@ffmpeg/core`) for in-browser video processing
- JSZip + xlsx for export
- Vercel hosting (Analytics + Speed Insights wired)

## Routing (src/App.tsx)
Two-domain split, decided by hostname:
- **Main domain** (`shipsight.in`): `/` → `Landing` (marketing). `/vms` → Login/Dashboard. `/rec` → recorder. `/dashboard` → dashboard.
- **`vms.` subdomain**: `/` itself becomes Login/Dashboard. SEO meta + robots flip to noindex for non-root vms paths.
- Unauth users on `/rec` or `/dashboard` get redirected to the appropriate login (`/` on vms, `/vms` on main).

## Auth model
- Client-side only, localStorage-backed (`shipsight_auth`, `shipsight_user`, `shipsight_lock_<email>`).
- **App.tsx force-logs-out on every page reload** (clears auth + session lock + stored user). Intentional — no persistent sessions.
- 5 default users hardcoded in `api/change-password.ts`:
  - oora, as.international, ss.international, admin, rohit (all `@shipsight.com`)
- Per-user session lock via `shipsight_lock_<email>` key (prevents concurrent logins per user).

## API (api/change-password.ts — only serverless endpoint)
- Vercel serverless function, POST only.
- Verifies old password against Vercel KV (`KV_REST_API_URL` / `KV_REST_API_TOKEN`, namespace `shipsight_passwords`) using PBKDF2-SHA256, 100k iterations, 16-byte salt.
- Falls back to `DEFAULT_USERS_PLAINTEXT` if user not yet in KV (first-time change).
- Stores `{ email, username, displayName, iterations, salt, hash }` back to KV.
- Returns 501 if KV env vars are missing — password change silently fails without KV configured.

## Pages (src/pages/)
- `Landing.tsx` — public marketing page (main domain).
- `Login.tsx` — auth form.
- `Dashboard.tsx` — post-login hub (`onLogout` prop).
- `Index.tsx` — the actual recorder page at `/rec` (`onLogout` prop).
- `NotFound.tsx` — 404.

## Recording components (src/components/)
- `BarcodeInput.tsx` — barcode scan / manual entry
- `CameraPreview.tsx` — webcam preview
- `RecordingControls.tsx` — start/stop/save
- `SessionLog.tsx` — list of recorded sessions in current session
- `src/lib/beep.ts` — audio feedback (scan confirmation)
- `src/lib/utils.ts` — shadcn cn() helper

shadcn UI primitives live under `src/components/ui/` (full set, mostly untouched).

## Deploy (vercel.json)
- Framework: Vite. Build: `npm run build`. Output: `dist`.
- SPA rewrite: every path → `/` (client-side routing handles the rest).

## Env vars (required for password change)
- `KV_REST_API_URL`
- `KV_REST_API_TOKEN`
- `KV_NAMESPACE` (defaults to `shipsight_passwords`)

## Run locally
```
npm install
npm run dev
```

## Quick mental model
Marketing site + gated VMS app in one repo, split by subdomain. The actual product surface is small: login → dashboard → record packing video tied to a barcode → review/export. Heavy dependency footprint (FFmpeg, full shadcn kit, xlsx) but only ~4 feature components do the real work.

## Open / fragile spots worth knowing
- Auth is fully client-side; reload always logs out. If "stay signed in" is ever needed, App.tsx useEffect is where it starts.
- Plaintext default passwords sit in `api/change-password.ts`. Any user who hasn't rotated still uses these.
- No KV configured = no password changes possible (silent 501).
- Session lock is localStorage-scoped, not cross-device — only blocks concurrent tabs on the same browser.
