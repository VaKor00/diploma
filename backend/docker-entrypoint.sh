#!/bin/sh
set -e

cd /var/www/html

# Права на storage и cache
chown -R www-data:www-data storage bootstrap/cache || true
chmod -R 775 storage/bootstrap/cache || true

echo "Waiting for DB..."
until php -r "try {
    new PDO(
        sprintf('mysql:host=%s;port=%s;dbname=%s', getenv('DB_HOST'), getenv('DB_PORT') ?: 3306, getenv('DB_DATABASE')),
        getenv('DB_USERNAME'),
        getenv('DB_PASSWORD')
    );
    exit(0);
} catch (Exception \$e) {
    fwrite(STDERR, \$e->getMessage() . PHP_EOL);
    exit(1);
}"; do
  echo "  DB is not ready yet, retrying in 5 seconds..."
  sleep 5
done

echo 'DB is up, running AdminUserSeeder...'
php artisan db:seed --class=Database\\Seeders\\AdminUserSeeder --force

echo 'Seeders finished, starting php-fpm...'
exec "$@"