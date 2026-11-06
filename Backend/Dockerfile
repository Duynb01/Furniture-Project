# Stage 1: Build
FROM node:22-alpine AS builder
WORKDIR /app

# Tăng khả năng chịu lỗi và retry cho npm khi mạng yếu
RUN npm config set fetch-retries 5 && \
    npm config set fetch-retry-mintimeout 20000 && \
    npm config set fetch-retry-maxtimeout 120000

COPY package*.json ./
COPY prisma ./prisma/

RUN npm install --prefer-offline --no-audit --no-fund
RUN npx prisma generate
COPY . .
RUN npm run build

# Giữ lại chỉ production dependencies, loại bỏ devDependencies
RUN npm prune --omit=dev

# Stage 2: Production (Không tải qua mạng nữa, lấy trực tiếp từ builder)
FROM node:22-alpine
WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

ENV PORT=3000
EXPOSE 3000
CMD ["node", "dist/src/main.js"]
