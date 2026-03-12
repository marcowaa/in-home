# نظام المندوبين - إدارة الشحن والتوصيل
# Multi-stage Dockerfile for production deployment

# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY package-lock.json* ./

# Install all dependencies (including dev for build)
RUN npm install --ignore-scripts=false

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Stage 2: Production
FROM node:20-alpine AS production

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY package-lock.json* ./

# Install production dependencies only
RUN npm install --omit=dev --ignore-scripts=false

# Copy built dist folder from builder (contains compiled server and client)
COPY --from=builder /app/dist ./dist

# Set environment variables
ENV NODE_ENV=production
ENV PORT=5000

# Expose the application port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://127.0.0.1:5000/api/settings || exit 1

# Start the application
CMD ["node", "dist/index.cjs"]
