# =============================================================================
# Multi-stage Dockerfile for Astro Static Site
# =============================================================================

# -----------------------------------------------------------------------------
# Stage 1: Build the Astro site
# -----------------------------------------------------------------------------
FROM oven/bun:1-alpine AS builder

WORKDIR /app

# Copy package files first for better layer caching
COPY package.json bun.lock ./

# Install dependencies
RUN bun install --frozen-lockfile

# Copy source files
COPY astro.config.mjs tsconfig.json ./
COPY src ./src
COPY public ./public
COPY buildBlogMap.ts ./

# Build the static site and generate blog URL map
RUN bun run build && bun buildBlogMap.ts

# -----------------------------------------------------------------------------
# Stage 2: Serve with nginx
# -----------------------------------------------------------------------------
FROM nginx:1-alpine AS production

# Install curl for healthcheck
RUN apk add --no-cache curl

# Create non-root user for nginx
RUN addgroup -g 1001 -S appgroup && \
    adduser -u 1001 -S appuser -G appgroup

# Copy nginx configuration
COPY nginx/nginx.conf /etc/nginx/nginx.conf

# Copy built assets and blog map from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html
COPY --from=builder /app/nginx/blog.map /etc/nginx/blog.map

# Set ownership for nginx directories
RUN chown -R appuser:appgroup /usr/share/nginx/html && \
    chown -R appuser:appgroup /var/cache/nginx && \
    chown -R appuser:appgroup /var/log/nginx && \
    chown -R appuser:appgroup /etc/nginx/conf.d && \
    touch /var/run/nginx.pid && \
    chown -R appuser:appgroup /var/run/nginx.pid

# Switch to non-root user
USER appuser

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8080/ || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
