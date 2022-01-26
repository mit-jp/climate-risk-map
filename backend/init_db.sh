#!/usr/bin/env bash
set -eo pipefail

if ! [ -x "$(command -v psql)" ]; then
  echo >&2 "Error: psql is not installed."
  exit 1
fi

if ! [ -x "$(command -v sqlx)" ]; then
  echo >&2 "Error: sqlx is not installed."
  exit 1
fi

if [[ -z ${DATABASE_USER} ]]; then
  echo >&2 "Error: DATABASE_USER is not set."
  exit 1
fi

if [[ -z ${DATABASE_PASSWORD} ]]; then
  echo >&2 "Error: DATABASE_PASSWORD is not set."
  exit 1
fi

if [[ -z ${DATABASE_NAME} ]]; then
  echo >&2 "Error: DATABASE_NAME is not set."
  exit 1
fi

if [[ -z ${DATABASE_PORT} ]]; then
  echo >&2 "Error: DATABASE_PORT is not set."
  exit 1
fi

if [[ -z ${DATABASE_HOST} ]]; then
  echo >&2 "Error: DATABASE_HOST is not set."
  exit 1
fi

# Allow to skip Docker if a dockerized Postgres database is already running
if [[ -z "${SKIP_DOCKER}" ]]
then
  # if a postgres container is running, print instructions to kill it and exit
  RUNNING_POSTGRES_CONTAINER=$(docker ps --filter 'name=postgres' --format '{{.ID}}')
  if [[ -n $RUNNING_POSTGRES_CONTAINER ]]; then
    echo >&2 "there is a postgres container already running, kill it with"
    echo >&2 "    docker kill ${RUNNING_POSTGRES_CONTAINER}"
    exit 1
  fi
  # Launch postgres using Docker
  docker run \
      -e POSTGRES_USER=${DATABASE_USER} \
      -e POSTGRES_PASSWORD=${DATABASE_PASSWORD} \
      -e POSTGRES_DB=${DATABASE_NAME} \
      -p "${DATABASE_PORT}":5432 \
      -d \
      --name "postgres_$(date '+%s')" \
      postgres -N 1000
      # ^ Increased maximum number of connections for testing purposes
fi

# Keep pinging Postgres until it's ready to accept commands
until PGPASSWORD="${DATABASE_PASSWORD}" psql -h "${DATABASE_HOST}" -U "${DATABASE_USER}" -p "${DATABASE_PORT}" -d "postgres" -c '\q'; do
  >&2 echo "Postgres is still unavailable - sleeping"
  sleep 1
done

>&2 echo "Postgres is running. Running migrations..."

export DATABASE_URL=postgres://${DATABASE_USER}:${DATABASE_PASSWORD}@localhost:${DATABASE_PORT}/${DATABASE_NAME}
sqlx database create
sqlx migrate run

>&2 echo "Postgres has been migrated, and is ready to go."