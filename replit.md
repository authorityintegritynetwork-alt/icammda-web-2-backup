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

- `DATABASE_URL` — PostgreSQL connection string
- `CLERK_SECRET_KEY` — Clerk backend auth key
- `VITE_CLERK_PUBLISHABLE_KEY` — Clerk frontend key
- `VITE_CLERK_PROXY_URL` — Clerk proxy URL
- `SESSION_SECRET` — Session secret

## Seed Data

Run `pnpm dlx tsx artifacts/api-server/src/seed.ts` from workspace root to seed test content.

## Workflows

- `artifacts/api-server: API Server` — Express API on port 8080
- `artifacts/icammda-website: web` — Vite dev server (frontend)
