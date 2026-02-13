#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$ROOT_DIR/backend"
FRONTEND_DIR="$ROOT_DIR/frontend"
backend_pid=""
frontend_pid=""
cleanup_done=0

ensure_dependencies() {
  local project_dir="$1"
  if [ ! -d "$project_dir/node_modules" ]; then
    echo "Installing dependencies for $(basename "$project_dir")..."
    npm --prefix "$project_dir" install
  fi
}

cleanup() {
  if [ "${cleanup_done}" -ne 0 ]; then
    return
  fi
  cleanup_done=1
  echo "Stopping frontend and backend"
  for pid in "$backend_pid" "$frontend_pid"; do
    if [ -n "${pid}" ] && kill -0 "$pid" >/dev/null 2>&1; then
      kill "$pid" >/dev/null 2>&1 || true
    fi
  done
}

trap cleanup EXIT

ensure_dependencies "$BACKEND_DIR"
ensure_dependencies "$FRONTEND_DIR"

echo "Starting backend"
npm --prefix "$BACKEND_DIR" run dev &
backend_pid=$!

echo "Starting frontend"
npm --prefix "$FRONTEND_DIR" run dev &
frontend_pid=$!

echo "Backend PID:$backend_pid  Frontend PID:$frontend_pid"
echo "Press Ctrl+C to stop both services"

set +e
wait -n
status=$?
set -e

exit "$status"
