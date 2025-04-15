#!/bin/sh

echo "⏳ Waiting for MySQL at mysql:3306..."

until nc -z mysql 3306; do
  sleep 2
done

echo "✅ MySQL is ready! Starting app..."
exec "$@"