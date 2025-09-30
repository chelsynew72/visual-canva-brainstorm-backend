# Dockerfile for gateway-service
FROM node:18-alpine

RUN npm install -g pnpm

WORKDIR /app

COPY package*.json ./
COPY pnpm-lock.yaml ./
RUN pnpm install

COPY . .

EXPOSE 3000

RUN pnpm install
RUN pnpm build
CMD ["pnpm", "start:prod"]
