# Folder: docker

Generated from SmartEntry project.
Secrets are automatically redacted.


---

## File: docker\docker-compose.dev.yml

```yaml
version: '3.8'

# Development overrides — mount source code for hot reload
services:
  frontend:
    build:
      context: ./frontend
      dockerfile: ../docker/Dockerfile.frontend
      target: development
    volumes:
      - ./frontend:/app
      - /app/node_modules
      - /app/.next
    environment:
      - NEXT_PUBLIC_API_URL=http://localhost:4000/api
    ports:
      - "3000:3000"
    command: npm run dev

  backend:
    volumes:
      - ./backend:/app
      - /app/node_modules
    ports:
      - "4000:4000"
    command: npm run dev

  analysis:
    volumes:
      - ./analysis:/app
    ports:
      - "5000:5000"
    command: python app.py

  redis:
    ports:
      - "6379:6379"

```

---

## File: docker\docker-compose.yml

```yaml
version: '3.8'

services:
  # ── Nginx Reverse Proxy ─────────────────────────────
  nginx:
    image: nginx:alpine
    container_name: smartentry-nginx
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./docker/nginx/nginx.conf:/etc/nginx/nginx.conf:ro
    depends_on:
      - frontend
      - backend
    restart: unless-stopped
    networks:
      - smartentry

  # ── Next.js Frontend ────────────────────────────────
  frontend:
    build:
      context: ./frontend
      dockerfile: ../docker/Dockerfile.frontend
    container_name: smartentry-frontend
    environment:
      - NEXT_PUBLIC_API_URL=/api
    restart: unless-stopped
    networks:
      - smartentry

  # ── Node.js Backend API ─────────────────────────────
  backend:
    build:
      context: ./backend
      dockerfile: ../docker/Dockerfile.backend
    container_name: smartentry-backend
    environment:
      - NODE_ENV=production
      - PORT=4000
      - DB_PATH=/data/smartentry.db
      - REDIS_URL=redis://redis:6379
      - BINANCE_BASE_URL=https://api.binance.com
      - ANALYSIS_URL=http://analysis:5000
      - TELEGRAM_BOT_TOKEN=${TELEGRAM_BOT_TOKEN}
      - TELEGRAM_CHANNEL_ID=${TELEGRAM_CHANNEL_ID}
      - BINANCE_AFFILIATE_REF=${BINANCE_AFFILIATE_REF}
    volumes:
      - db-data:/data
    depends_on:
      - redis
    restart: unless-stopped
    networks:
      - smartentry

  # ── Python Analysis Engine ──────────────────────────
  analysis:
    build:
      context: ./analysis
      dockerfile: ../docker/Dockerfile.analysis
    container_name: smartentry-analysis
    environment:
      - DB_PATH=/data/smartentry.db
    volumes:
      - db-data:/data
    restart: unless-stopped
    networks:
      - smartentry

  # ── Redis Cache ─────────────────────────────────────
  redis:
    image: redis:7-alpine
    container_name: smartentry-redis
    command: redis-server --maxmemory 64mb --maxmemory-policy allkeys-lru --save ""
    restart: unless-stopped
    networks:
      - smartentry

volumes:
  db-data:
    driver: local

networks:
  smartentry:
    driver: bridge

```

---

## File: docker\Dockerfile.analysis

```
FROM python:3.12-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy source
COPY . .

EXPOSE 5000

# Production: use gunicorn
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "--workers", "2", "--timeout", "120", "app:app"]

```

---

## File: docker\Dockerfile.backend

```
# ── Stage 1: Build ─────────────────────────────────────
FROM node:22-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci
COPY . .
RUN npm run build

# ── Stage 2: Production ───────────────────────────────
FROM node:22-alpine AS production
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

EXPOSE 4000
CMD ["node", "dist/index.js"]

```

---

## File: docker\Dockerfile.frontend

```
# ── Stage 1: Dependencies ──────────────────────────────
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev

# ── Stage 2: Build ─────────────────────────────────────
FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# ── Stage 3: Production ───────────────────────────────
FROM node:22-alpine AS production
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Copy standalone output
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 3000
CMD ["node", "server.js"]

# ── Development target ─────────────────────────────────
FROM node:22-alpine AS development
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "run", "dev"]

```

---

## File: docker\nginx\nginx.conf

```
worker_processes auto;

events {
    worker_connections 1024;
}

http {
    include       mime.types;
    default_type  application/octet-stream;

    # Performance
    sendfile        on;
    tcp_nopush      on;
    tcp_nodelay     on;
    keepalive_timeout 65;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml;
    gzip_min_length 1000;

    # Rate limiting zone
    limit_req_zone $binary_remote_addr zone=api:10m rate=30r/m;

    # Upstream services
    upstream frontend {
        server frontend:3000;
    }

    upstream backend {
        server backend:4000;
    }

    server {
        listen 80;
        server_name _;

        # Security headers
        add_header X-Frame-Options DENY;
        add_header X-Content-Type-Options nosniff;
        add_header X-XSS-Protection "1; mode=block";

        # API routes → Node.js backend
        location /api/ {
            limit_req zone=api burst=10 nodelay;

            proxy_pass http://backend;
            proxy_http_version 1.1;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;

            # Cache API responses at Nginx level
            proxy_cache_valid 200 60s;
        }

        # Everything else → Next.js frontend
        location / {
            proxy_pass http://frontend;
            proxy_http_version 1.1;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "upgrade";
        }

        # Static assets caching
        location /_next/static/ {
            proxy_pass http://frontend;
            expires 365d;
            add_header Cache-Control "public, immutable";
        }

        # Health check
        location /health {
            access_log off;
            return 200 'ok';
            add_header Content-Type text/plain;
        }
    }
}

```
