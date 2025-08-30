FROM php:8.2-fpm-alpine

RUN apk add --no-cache \
        git curl zip unzip libpng-dev oniguruma-dev libxml2-dev \
    && docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd

# Set working directory
WORKDIR /var/www

# Copy composer first for caching
COPY composer.json composer.lock ./

# Install PHP dependencies
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer \
    && composer install --no-scripts --no-autoloader

# Copy the rest of the app
COPY . .

# Run composer autoload
RUN composer dump-autoload

CMD ["php-fpm"]
