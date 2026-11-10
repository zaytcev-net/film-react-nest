# Этап 1. Сборка приложения
FROM node:20-alpine AS builder

WORKDIR /app

# Копируем файлы зависимостей
COPY package*.json ./

# Устанавливаем все зависимости, включая devDependencies
RUN npm ci

# Копируем исходный код
COPY . .

# Собираем NestJS
RUN npm run build


# Этап 2. Production
FROM node:20-alpine AS production

WORKDIR /app

# Копируем файлы зависимостей
COPY package*.json ./

# Устанавливаем только production-зависимости
RUN npm ci --omit=dev && npm cache clean --force

# Копируем результат сборки
COPY --from=builder /app/dist ./dist

# Копируем статические файлы
COPY --from=builder /app/public ./public

# Запускаем приложение
CMD ["node", "dist/main"]