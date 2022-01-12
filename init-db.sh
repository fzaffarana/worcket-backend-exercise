#!/bin/sh
set -e

PGPASSWORD="$POSTGRES_PASSWORD" psql -h postgres --username="$POSTGRES_USER" --dbname "$POSTGRES_DB" -tc "SELECT 1 FROM pg_database WHERE datname = 'public'" | grep -q 1 || PGPASSWORD="$POSTGRES_PASSWORD" psql -h postgres --username="$POSTGRES_USER" --dbname "$POSTGRES_DB" -c "CREATE USER karen; CREATE DATABASE public; GRANT ALL PRIVILEGES ON DATABASE public TO karen;"

PGPASSWORD="$POSTGRES_PASSWORD" psql -h postgres --username="$POSTGRES_USER" --dbname "$POSTGRES_DB" -tc "SELECT 1 FROM public.actions" | grep -q 1 || (cat funnels | PGPASSWORD=postgres psql -h postgres --username=postgres public)