FROM php:8.4-fpm-alpine

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

# 4. Установка PHP-зависимостей
# COPY composer.json composer.lock* ./
# RUN composer install \
#     --no-dev \
#     --optimize-autoloader \
#     --no-interaction \
#     --prefer-dist \
#     --no-scripts

# 5. Копируем весь проект
COPY . .

# 5.1 Сборка фронтенда Vite
# RUN npm install \
#  && npm run build

# 6. Копируем entrypoint-скрипт
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Важно: оставляем root, чтобы мог менять права при старте
USER root

ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["php-fpm"]