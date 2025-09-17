# Dockerfile for canvas-service

# 1. Builder stage
FROM node:18-alpine AS builder

# Install pnpm
RUN npm install -g pnpm

# Set working directory
WORKDIR /app

# Copy workspace files
COPY package.json pnpm-lock.yaml ./

# Copy service-specific package.json
COPY canvas-service/package.json ./canvas-service/

# Install dependencies
RUN pnpm install --prod

# Copy the rest of the application source code
COPY canvas-service/ ./canvas-service/

# Build the application
RUN pnpm --filter canvas-service build

# 2. Production stage
FROM node:18-alpine

# Install pnpm
RUN npm install -g pnpm

# Set working directory
WORKDIR /app

# Copy built application from the builder stage
COPY --from=builder /app/canvas-service/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/canvas-service/package.json ./

# Expose the port the app runs on
EXPOSE 3003

# Command to run the application
CMD ["node", "dist/main"]
