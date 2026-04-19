# ICAMMDA Website

Full-stack website for the **International Centre for Applied Mathematical Modelling and Data Analytics (ICAMMDA)**, Federal University Oye-Ekiti, Ekiti State, Nigeria.

## Architecture

**Monorepo (pnpm workspaces)**

- `artifacts/icammda-website` — React + Vite frontend (public site + admin panel)
- `artifacts/api-server` — Express API server
- `lib/api-spec` — OpenAPI spec (source of truth)
- `lib/api-client-react` — Auto-generated React Query hooks from OpenAPI
- `lib/api-zod` — Auto-generated Zod schemas for request validation
- `lib/db` — Drizzle ORM schema + migrations (PostgreSQL)

## Key Tech Stack

- **Frontend**: React 18, Vite, TailwindCSS v4, shadcn/ui, Wouter (routing), @tanstack/react-query
- **Auth**: Clerk (email/password only, no social login)
- **Backend**: Express, Drizzle ORM, PostgreSQL
- **API**: OpenAPI spec → codegen for type-safe client hooks

## Color Palette

Deep navy `hsl(222 47% 11%)` + Teal/Green primary `hsl(175 60% 35%)`
Fonts: Inter (sans) + Merriweather (serif)

## Database Schema

Tables: `posts`, `events`, `team_members`, `partners`

Post categories: "News", "Recent Training", "Upcoming Training"
Event types: "Webinar", "Workshop", "Symposium", "Training", "Conference"
Event form types: "none" | "google" | "custom"
Team roles: "director" | "researcher" | "postdoc" | "staff"

## Pages

**Public:**
- `/` — Home (hero, mission, activities, news feed, events, partners)
- `/about` — About (director letter, structure, units)
- `/news` — News listing with category filters
- `/news/:slug` — News post detail
- `/events` — Events listing with type filters
- `/events/:slug` — Event detail (with Google Form iframe OR custom built-in form)
- `/team` — Team members grouped by role
- `/contact` — Contact info + contact form

**Auth:**
- `/sign-in` — Clerk sign-in page

**Admin (requires Clerk auth):**
- `/admin` — Dashboard with stats
- `/admin/posts` — Posts list
- `/admin/posts/new` — Create post
- `/admin/posts/:id/edit` — Edit post
- `/admin/events` — Events list
- `/admin/events/new` — Create event
- `/admin/events/:id/edit` — Edit event (with form type: none/google/custom)
- `/admin/team` — Team members CRUD (modal-based)
- `/admin/partners` — Partners CRUD (modal-based)

## API Endpoints

All routes prefixed with `/api`:
- `GET/POST /posts`, `GET/PATCH/DELETE /posts/:id`, `GET /posts/recent`
- `GET/POST /events`, `GET/PATCH/DELETE /events/:id`, `GET /events/upcoming`
- `GET/POST /team`, `GET/PATCH/DELETE /team/:id`
- `GET/POST /partners`, `GET/PATCH/DELETE /partners/:id`
- `GET /stats`

## Environment Variables

**Core (always required):**
- `DATABASE_URL` — PostgreSQL connection string (works with Neon, Supabase, RDS, Koyeb-managed Postgres, etc.)
- `CLERK_SECRET_KEY` — Clerk backend auth key
- `VITE_CLERK_PUBLISHABLE_KEY` — Clerk frontend key (build-time)
- `SESSION_SECRET` — Random 32+ byte string
- `ADMIN_EMAILS` — Comma-separated list of admin email addresses

**Email (Resend) — direct, no Replit connector:**
- `RESEND_API_KEY` — from https://resend.com
- `RESEND_FROM_EMAIL` — verified sender, e.g. `ICAMMDA <noreply@icammda.org>`

**Object storage (S3-compatible — Cloudflare R2 recommended):**
- `S3_BUCKET` — bucket name
- `S3_REGION` — `auto` for R2, real region for AWS, etc.
- `S3_ACCESS_KEY_ID` / `S3_SECRET_ACCESS_KEY`
- `S3_ENDPOINT` — required for R2/B2/MinIO; omit for AWS S3
  - R2: `https://<account-id>.r2.cloudflarestorage.com`
- `S3_FORCE_PATH_STYLE` — `true` for MinIO; default `false`
- `S3_UPLOAD_PREFIX` — folder inside bucket (default `uploads`)

**Optional:**
- `CORS_ORIGIN` — comma-separated allowed origins for cross-origin clients (default: same-origin only)
- `SITE_URL` — canonical site URL (used in sitemap/SEO/email links)
- `VITE_API_BASE_URL` — only set if API and web are deployed on different origins
- `VITE_CLERK_PROXY_URL` — only when using Clerk's proxy on a custom domain
- `YOUTUBE_API_KEY` — for the e-learning video feed
- `WEB_DIST_PATH` — overrides the auto-discovered SPA build directory

## Deployment (Koyeb / any Docker host)

The `Dockerfile` at the repo root produces **a single container** that serves both the API at `/api/*` and the React SPA at `/`:

1. Push the repo to GitHub (use the Git tool in the workspace).
2. On Koyeb → New App → Deploy from GitHub → choose this repo and branch `main`.
3. Build method: **Dockerfile**. Instance: smallest is fine to start.
4. Set all required env vars from the lists above.
5. Set the port to **8080** (or expose `$PORT`; the app reads it).
6. Add your custom domain (`icammda.org`) and follow Koyeb's DNS instructions.
7. Run database migrations once: `pnpm --filter @workspace/db push --force` against the production `DATABASE_URL`.

There are **no Replit-specific runtime dependencies left** in the deployed code:
- Object storage uses the AWS SDK against any S3-compatible endpoint.
- Resend uses `RESEND_API_KEY` directly.
- The web build no longer imports any `@replit/*` Vite plugins.

## Seed Data

Run `pnpm dlx tsx artifacts/api-server/src/seed.ts` from workspace root to seed test content.

## Workflows (development)

- `artifacts/api-server: API Server` — Express API on port 8080
- `artifacts/icammda-website: web` — Vite dev server (frontend)
- `artifacts/mockup-sandbox: Component Preview Server` — Replit-only design tool, not deployed
