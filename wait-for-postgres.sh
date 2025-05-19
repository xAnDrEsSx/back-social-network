#!/bin/sh

set -e

host="$DB_HOST"
port="$DB_PORT"

echo "Esperando a que PostgreSQL ($host:$port) esté disponible..."

until nc -z "$host" "$port"; do
  sleep 1
done

echo "PostgreSQL está disponible. Ejecutando migraciones..."
exec "$@"
