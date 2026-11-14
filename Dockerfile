# 1. Base image (Node 24 LTS; Node 20 reached end-of-life in April 2026 and no longer receives security fixes)
FROM node:24-alpine AS base
ENV NEXT_TELEMETRY_DISABLED=1

# 2. Install dependencies
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci

# 3. Build app
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# 4. Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

# Copy only required files, owned by the image's built-in unprivileged "node" user
# (.next must stay writable for Next.js' image optimisation cache).
COPY --from=builder --chown=node:node /app/.next ./.next
COPY --from=builder --chown=node:node /app/public ./public
COPY --from=builder --chown=node:node /app/package.json ./package.json
COPY --from=builder --chown=node:node /app/node_modules ./node_modules

# Run as a non-root user so a compromised process cannot modify the container.
USER node

EXPOSE 3000

CMD ["npm", "start"]
