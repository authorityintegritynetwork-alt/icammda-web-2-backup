# syntax=docker/dockerfile:1.7
# ============================================================================
# ICAMMDA — Production container (single service)
#   - Builds the React SPA (artifacts/icammda-website)
#   - Builds the Express API (artifacts/api-server)
#   - Final image runs the API which also serves the SPA at /
# ============================================================================

ARG NODE_VERSION=20

# ---- 1. Builder ------------------------------------------------------------
FROM node:${NODE_VERSION}-bookworm-slim AS builder

ENV PNPM_HOME=/root/.local/share/pnpm
ENV PATH=$PNPM_HOME:$PATH
RUN corepack enable && corepack prepare pnpm@latest --activate
ARG VITE_CLERK_PUBLISHABLE_KEY
ENV VITE_CLERK_PUBLISHABLE_KEY=${VITE_CLERK_PUBLISHABLE_KEY}
ARG VITE_API_BASE_URL=
ENV VITE_API_BASE_URL=

WORKDIR /app

# Copy lockfile + workspace manifests first so install layer caches well
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY artifacts/api-server/package.json artifacts/api-server/
COPY artifacts/icammda-website/package.json artifacts/icammda-website/
# Copy any other workspace package manifests
COPY lib lib
COPY scripts scripts

RUN pnpm install --no-frozen-lockfile

# Now copy the rest of the source
COPY . .

# Build web (Vite) and api (esbuild)
RUN pnpm --filter @workspace/icammda-website build \
 && pnpm --filter @workspace/api-server build

# Prune dev-deps to keep only production deps for the runtime stage
RUN pnpm --filter @workspace/api-server deploy --prod /prod-api --legacy


# ---- 2. Runtime ------------------------------------------------------------
FROM node:${NODE_VERSION}-bookworm-slim AS runtime

ENV NODE_ENV=production
WORKDIR /app

# API server runtime files + production node_modules
COPY --from=builder /prod-api/node_modules ./node_modules
COPY --from=builder /app/artifacts/api-server/dist ./dist

# Built SPA — sits next to the API at /app/web/public, matching WEB_DIST_PATH
COPY --from=builder /app/artifacts/icammda-website/dist/public ./web/public
ENV WEB_DIST_PATH=/app/web/public

# Koyeb (and most platforms) inject PORT
ENV PORT=8080
EXPOSE 8080

USER node

CMD ["node", "--enable-source-maps", "./dist/index.mjs"]
