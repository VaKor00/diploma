FROM php:8.1-fpm-alpine

WORKDIR /var/www/html

# Указываем mirror (опционально)
#RUN echo "http://dl-cdn.alpinelinux.org/alpine/v3.18/main" > /etc/apk/repositories
#RUN echo "http://dl-cdn.alpinelinux.org/alpine/v3.18/community" >> /etc/apk/repositories

# Проверяем DNS (для отладки)
RUN ping -c 3 google.com

# Устанавливаем расширения PHP
RUN docker-php-ext-install pdo pdo_mysql

# Копируем Composer из официального образа
COPY --from=composer:latest /usr/bin/composer /usr/local/bin/composer

# Запускаем PHP-FPM
CMD ["php-fpm"]
