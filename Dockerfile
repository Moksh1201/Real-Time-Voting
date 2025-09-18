# syntax=docker/dockerfile:1

FROM node:18-alpine AS base
WORKDIR /app

# Install OS deps (openssl for Prisma)
RUN apk add --no-cache openssl

# Install dependencies separately to leverage Docker layer cache
FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci --only=production && npm cache clean --force

# Build stage (not strictly needed for pure Node, but reserved for future builds)
FROM base AS build
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Generate Prisma client
RUN npx prisma generate

# Runtime image
FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Copy app source and node_modules
COPY --from=build /app .
COPY --from=deps /app/node_modules ./node_modules

# Expose port
EXPOSE 3000

# Healthcheck (optional)
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s CMD wget -qO- http://localhost:3000 || exit 1

# Run prisma migrate deploy on startup then start server
CMD ["sh", "-c", "npx prisma migrate deploy && node src/server.js"]


