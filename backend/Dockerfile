FROM php:8.4-fpm-alpine

WORKDIR /var/www/html

RUN apk --no-cache add \
    git \
    zip \
    unzip \
    curl \
    oniguruma-dev \
    libxml2-dev \
    nodejs \
    npm \
    icu-dev \
    oniguruma-dev \
    libzip-dev

# Устанавливаем только реально поддерживаемые ext
RUN docker-php-ext-install \
    pdo_mysql \
    mbstring \
    xml \
    bcmath

COPY --from=composer:latest /usr/bin/composer /usr/local/bin/composer

CMD ["php-fpm"]