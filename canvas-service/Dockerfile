
# Dockerfile for canvas-service (standalone)
FROM node:18-alpine

RUN npm install -g pnpm

WORKDIR /app

COPY package*.json ./
COPY pnpm-lock.yaml ./
RUN pnpm install

COPY . .

EXPOSE 3005

CMD ["pnpm", "start"]
