# Этап 1: Сборка фронтенда
FROM node:22-alpine AS builder
WORKDIR /app

# Копируем package*.json и lock-файл
COPY package*.json ./
RUN npm ci

# Копируем исходный код фронтенда
COPY . .
RUN npm run build

# Сохраняем собранный фронтенд
RUN cp -r dist /frontend-build

# Этап 2: Финальный PHP‑образ
FROM php:8.4-fpm-alpine
WORKDIR /var/www/html

# Копируем PHP‑код
COPY . .

# Копируем собранный фронтенд из builder
COPY --from=builder /frontend-build/dist ./public

# Устанавливаем PHP‑зависимости и расширения
RUN apk add --no-cache \
    $PHPIZE_DEPS \
    git \
    zip \
    unzip \
    curl \
    icu-dev \
    libzip-dev \
    oniguruma-dev \
    libxml2-dev \
    openssh

RUN docker-php-ext-install pdo_mysql mbstring xml bcmath


# Composer и другие настройки...
COPY --from=composer:latest /usr/bin/composer /usr/local/bin/composer
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

USER root
ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["php-fpm"]
