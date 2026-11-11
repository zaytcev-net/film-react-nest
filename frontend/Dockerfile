# Этап 1. Сборка frontend
FROM node:20-alpine AS builder

WORKDIR /app

# Копируем файлы зависимостей
COPY package*.json ./

# Устанавливаем зависимости
RUN npm ci

# Копируем исходный код
COPY . .

# Для адресов
ARG VITE_API_URL
ARG VITE_CDN_URL

ENV VITE_API_URL=$VITE_API_URL
ENV VITE_CDN_URL=$VITE_CDN_URL

# Собираем frontend
RUN npm run build

# Копируем собранные файлы в общий volume
CMD ["sh", "-c", "cp -r /app/dist/. /frontend/"]