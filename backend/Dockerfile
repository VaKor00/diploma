# Этап 1: Установка npm‑зависимостей
FROM node:22-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm config set registry https://registry.npmjs.org/ && \
    npm install --omit=dev

# Этап 2: Сборка фронтенда
FROM node:22-alpine AS builder
WORKDIR /app
COPY . .
COPY --from=deps /app/node_modules ./node_modules
RUN npm run build

# Этап 3: Финальный образ с PHP
FROM php:8.4-fpm-alpine
WORKDIR /var/www/html
COPY --from=builder /app/build ./public

# ... остальные шаги для PHP

WORKDIR /var/www/html

# 1. Системные зависимости + PHPIZE_DEPS + node/npm
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
    nodejs \
    npm \
    openssh

# 2. PHP-расширения
RUN docker-php-ext-install \
    pdo_mysql \
    mbstring \
    xml \
    bcmath

# 3. Composer
COPY --from=composer:latest /usr/bin/composer /usr/local/bin/composer

# 4. Копируем package.json и package-lock.json (если есть)
COPY package*.json ./

# 5. Устанавливаем npm-зависимости
# Важно: очищаем кэш и используем --production для минимизации образа
RUN npm config set cache /var/www/html/.npm-cache --global && \
    npm install --production && \
    rm -rf /var/www/html/.npm-cache

# 6. Копируем фронтенд-код (после установки зависимостей!)
COPY . .

# 7. Собираем фронтенд (для React/Vite)
# Проверяем наличие конфигурационных файлов перед сборкой
RUN if [ -f "vite.config.js" ] || [ -f "webpack.config.js" ]; then \
      npm run build; \
    else \
      echo "No build config found, skipping frontend build"; \
    fi

# 8. Очищаем ненужные файлы после сборки
# Удаляем dev-зависимости и временные файлы
RUN if [ -d "node_modules" ]; then \
      rm -rf node_modules/.cache; \
    fi

# 9. Установка PHP-зависимостей (если нужно)
# COPY composer.json composer.lock* ./
# RUN composer install \
#     --no-dev \
#     --optimize-autoloader \
#     --no-interaction \
#     --prefer-dist \
#     --no-scripts

# 10. Копируем entrypoint-скрипт
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

USER root

ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["php-fpm"]
