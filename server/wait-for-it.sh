#!/bin/sh

set -e

HOST="$1"
PORT="$2"
TIMEOUT="$3"

shift 3

echo "Waiting for $HOST:$PORT for $TIMEOUT seconds..."

for i in $(seq $TIMEOUT); do
    if nc -z "$HOST" "$PORT"; then
        echo "$HOST:$PORT is available after $i seconds"
        break
    fi
    echo "Waiting for $HOST:$PORT..."
    sleep 1
done

if ! nc -z "$HOST" "$PORT"; then
    echo "Operation timed out" >&2
    exit 1
fi

exec "$@"
