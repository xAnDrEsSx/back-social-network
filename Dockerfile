# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci

COPY tsconfig*.json ./
COPY src ./src
COPY environments ./environments
RUN npm run build

# Stage 2: Production image
FROM node:20-alpine AS production

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

# copio los archivos necesarios del builder
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/environments ./environments

# este archivo debe estar compilado en dist/database
COPY --from=builder /usr/src/app/dist/database/migrations ./dist/database/migrations

# este archivo también debe estar compilado
COPY --from=builder /usr/src/app/dist/database/typeorm.config.js ./dist/database/typeorm.config.js

COPY wait-for-postgres.sh /wait-for-postgres.sh
RUN chmod +x /wait-for-postgres.sh

COPY environments/.env.dev .env

EXPOSE 3000

CMD ["sh", "-c", "/wait-for-postgres.sh && npm run migration:run && node -r dotenv/config dist/main.js"]
