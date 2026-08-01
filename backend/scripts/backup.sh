#!/usr/bin/env bash
set -euo pipefail

BACKUP_DIR="${BACKUP_DIR:-./backups}"
RETENTION="${BACKUP_RETENTION:-7}"
DB_CONTAINER="${DB_CONTAINER:-ecoflow_postgres}"
PGUSER="${POSTGRES_USER:-ecoflow_user}"
PGDB="${POSTGRES_DB:-ecoflow}"

mkdir -p "$BACKUP_DIR"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
OUTFILE="$BACKUP_DIR/ecoflow_$TIMESTAMP.sql"

echo "==> Backing up database '$PGDB' to $OUTFILE"
if docker ps --format '{{.Names}}' | grep -q "^$DB_CONTAINER$"; then
  docker exec "$DB_CONTAINER" pg_dump -U "$PGUSER" -d "$PGDB" --format=custom > "$OUTFILE"
else
  PGPASSWORD="${POSTGRES_PASSWORD:-ecoflow_password}" pg_dump -U "$PGUSER" -h localhost -d "$PGDB" --format=custom > "$OUTFILE"
fi
echo "==> Backup size: $(du -h "$OUTFILE" | cut -f1)"

COUNT=$(ls -1 "$BACKUP_DIR"/ecoflow_*.sql 2>/dev/null | wc -l)
if [ "$COUNT" -gt "$RETENTION" ]; then
  echo "==> Rotating: keeping last $RETENTION backups"
  ls -1t "$BACKUP_DIR"/ecoflow_*.sql | tail -n +$((RETENTION + 1)) | xargs -r rm -v
fi

echo "==> Backup complete"
