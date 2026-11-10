# Этап 1. Сборка frontend
FROM node:20-alpine AS builder

WORKDIR /app

# Копируем файлы зависимостей
COPY package*.json ./

# Устанавливаем зависимости
RUN npm ci

# Копируем исходный код
COPY . .

# Собираем frontend
RUN npm run build

# Копируем собранные файлы в общий volume
CMD ["sh", "-c", "cp -r /app/dist/. /frontend/"]