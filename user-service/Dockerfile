# Dockerfile for user-service
FROM node:18-alpine

RUN npm install -g pnpm

WORKDIR /app

COPY package*.json ./
COPY pnpm-lock.yaml ./
RUN pnpm install

COPY . .

EXPOSE 3004

CMD ["pnpm", "start"]
