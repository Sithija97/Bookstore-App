# ── Stage 1: Builder ──────────────────────────────────────────────────────────
# We call this stage "builder". It exists only to compile TypeScript.
# This image will NOT be part of the final shipped container.
FROM node:20-alpine AS builder

# Set the working directory inside the builder container
WORKDIR /app

# Copy package files first to take advantage of Docker layer caching.
# If package.json hasn't changed, Docker reuses the cached npm install layer.
COPY package*.json ./

# Install ALL dependencies (including devDependencies like tsc, tsc-alias)
# because we need the TypeScript toolchain to compile the source code.
RUN npm install

# Copy the rest of the source code
COPY . .

# Compile TypeScript → JavaScript (output goes to /app/dist)
RUN npm run build


# ── Stage 2: Production ───────────────────────────────────────────────────────
# Start from a clean, minimal Node.js image.
# Only the compiled output is copied here — no TypeScript sources, no devDeps.
FROM node:20-alpine AS production

WORKDIR /app

# Copy package files again so we can install production dependencies only
COPY package*.json ./

# Install ONLY production dependencies (smaller, more secure image)
RUN npm install --omit=dev

# Copy the compiled JavaScript from the builder stage
COPY --from=builder /app/dist ./dist

# Run as the built-in non-root 'node' user for security (never run as root in production)
RUN chown -R node:node /app
USER node

# Expose the port your app listens on
EXPOSE 3000

# Start the app using the compiled entry point
CMD ["node", "dist/index.js"]