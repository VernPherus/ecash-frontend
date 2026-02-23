# ─────────────────────────────────────────────
#  Stage 1: Builder
#  - Installs deps and builds the Vite app
# ─────────────────────────────────────────────
FROM node:24-bookworm-slim AS builder

WORKDIR /app

# Copy manifests for layer caching
COPY package*.json ./

# Install all deps (devDeps needed for vite build)
RUN npm install

# Copy full source
COPY . .

# Optional: override VITE_API_URL at build time for deployments where the
# frontend and backend are not on the same origin (i.e. no Nginx proxy).
# Defaults to "" which means "same origin" — correct for the docker-compose setup
# where Nginx proxies /api/* and /socket.io/* to the backend container.
ARG VITE_API_URL=""
ENV VITE_API_URL=${VITE_API_URL}

# Build the production bundle
RUN npm run build

# ─────────────────────────────────────────────
#  Stage 2: Production — serve via Nginx
# ─────────────────────────────────────────────
FROM nginx:alpine AS production

# Remove default nginx static content
RUN rm -rf /usr/share/nginx/html/*

# Copy built static files from builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom nginx config (SPA fallback + API proxy)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
