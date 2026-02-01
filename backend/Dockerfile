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

# 4. Копируем package.json и package-lock.json (если есть)
COPY package*.json ./

# 5. Устанавливаем npm-зависимости
RUN npm install

# 6. Копируем фронтенд-код (если нужен)
COPY . .

# 7. Собираем фронтенд (пример для Vite)
RUN if [ -f "vite.config.js" ]; then \
      npm run build; \
    fi

# 8. Установка PHP-зависимостей (если нужно)
# COPY composer.json composer.lock* ./
# RUN composer install \
#     --no-dev \
#     --optimize-autoloader \
#     --no-interaction \
#     --prefer-dist \
#     --no-scripts

# 9. Копируем entrypoint-скрипт
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

USER root

ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["php-fpm"]
