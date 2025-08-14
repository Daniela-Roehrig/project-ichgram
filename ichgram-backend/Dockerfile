FROM node:22-alpine AS builder
WORKDIR /app

COPY package*.json tsconfig*.json ./
RUN yarn install --frozen-lockfile

COPY src ./src

RUN yarn build        # WICHTIG: Build ausführen, damit dist entsteht

FROM node:22-alpine
WORKDIR /app

COPY package*.json ./
RUN yarn install --frozen-lockfile

COPY --from=builder /app/dist ./dist

RUN mkdir -p /app/temp

EXPOSE 3000 5000
CMD ["node", "dist/index.js"]
