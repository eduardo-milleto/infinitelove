# ----- base -----
FROM node:20-slim AS base
ENV PNPM_HOME=/root/.local/share/pnpm
ENV PATH=$PNPM_HOME:$PATH
RUN corepack enable && corepack prepare pnpm@9.12.0 --activate
WORKDIR /app

# ----- deps -----
FROM base AS deps
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml* ./
COPY packages/shared/package.json packages/shared/
COPY apps/api/package.json apps/api/
RUN pnpm install --frozen-lockfile || pnpm install

# ----- build -----
FROM base AS build
COPY --from=deps /app /app
COPY tsconfig.base.json ./
COPY packages/shared packages/shared
COPY apps/api apps/api
RUN pnpm --filter @infinitelove/shared exec tsc -p tsconfig.json || true
RUN pnpm --filter api build

# ----- runtime -----
FROM node:20-slim AS runtime
ENV NODE_ENV=production
ENV PHOTOS_DIR=/data/photos
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@9.12.0 --activate \
 && apt-get update && apt-get install -y --no-install-recommends ca-certificates \
 && rm -rf /var/lib/apt/lists/*
COPY --from=build /app /app
RUN mkdir -p /data/photos
EXPOSE 3001
CMD ["pnpm", "--filter", "api", "start"]
