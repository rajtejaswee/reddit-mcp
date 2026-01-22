# --- Stage 1: Builder ---
FROM node:20-alpine AS builder

WORKDIR /app

# Copy config files first
COPY package*.json tsconfig*.json ./

# Install ALL dependencies (including devDependencies for 'tsc')
RUN npm ci

# Copy source code
COPY src ./src

# Build TypeScript -> JavaScript
RUN npm run build

# --- Stage 2: Runner ---
FROM node:20-alpine AS runner

WORKDIR /app

# Set production env
ENV NODE_ENV=production

# Install ONLY production dependencies (saves space)
COPY package*.json ./
RUN npm ci --only=production

# Copy built JS from Stage 1
COPY --from=builder /app/dist ./dist

# Create a non-root user (Security Best Practice)
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

# Start
CMD ["node", "dist/index.js"]