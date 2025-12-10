FROM php:8.4-fpm-alpine

WORKDIR /var/www/html

RUN apk --no-cache add \
        git \
        zip \
        unzip \
        curl

RUN docker-php-ext-install pdo_mysql

COPY --from=composer:latest /usr/bin/composer /usr/local/bin/composer

COPY . .

RUN composer install --no-interaction --optimize-autoloader

EXPOSE 8000

CMD ["php", "artisan", "serve", "--host", "0.0.0.0", "--port", "8000"]