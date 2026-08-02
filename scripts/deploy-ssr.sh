#!/usr/bin/env bash
set -euo pipefail

REMOTE="${REMOTE:-digitauro-prd}"
REMOTE_DIR="${REMOTE_DIR:-/www/wwwroot/digitauro-ssr}"
PM2_NAME="${PM2_NAME:-digitauro-www}"
PORT="${PORT:-3000}"
HOSTNAME="${HOSTNAME:-127.0.0.1}"

if ! git diff-index --quiet HEAD --; then
  echo "Refusing to deploy: tracked files have uncommitted changes." >&2
  exit 1
fi

REVISION="$(git rev-parse --short HEAD)"
WORKTREE="$(mktemp -d /tmp/digitauro-www-ssr.XXXXXX)"

cleanup() {
  git worktree remove --force "$WORKTREE" >/dev/null 2>&1 || rm -rf "$WORKTREE"
}
trap cleanup EXIT

git worktree add --detach "$WORKTREE" "$REVISION"

rsync -az --delete \
  --exclude node_modules \
  --exclude .next \
  --exclude dist-static \
  "$WORKTREE/" "$REMOTE:$REMOTE_DIR/"

ssh "$REMOTE" "set -e
  cd '$REMOTE_DIR'
  npm ci
  npm run build
  echo '$REVISION' > REVISION
  chmod 755 '$REMOTE_DIR'
  find public app .next/static -type d -exec chmod 755 {} +
  find public app .next/static -type f -exec chmod 644 {} +
  PORT='$PORT' HOSTNAME='$HOSTNAME' pm2 restart '$PM2_NAME' --update-env || PORT='$PORT' HOSTNAME='$HOSTNAME' pm2 start npm --name '$PM2_NAME' -- start
  pm2 save
  nginx -t
  nginx -s reload
  echo deployed '$REVISION'
"
