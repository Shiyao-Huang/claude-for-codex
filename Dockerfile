# Stage 1: Build
FROM node:22-slim AS builder

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci && npm cache clean --force

COPY tsconfig.json ./
COPY src/ ./src/
RUN npm run build && rm -rf node_modules

# Stage 2: Runtime
FROM node:22-slim

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci --omit=dev && npm cache clean --force

COPY --from=builder /app/dist ./dist

# Required env vars (set at runtime via -e or --env-file):
#   ANTHROPIC_API_KEY or ANTHROPIC_AUTH_TOKEN
# Optional:
#   ANTHROPIC_BASE_URL, ANTHROPIC_MODEL

ENTRYPOINT ["node", "dist/index.js"]
