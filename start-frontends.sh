#!/bin/sh

set -eu

script_dir=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
client_dir="$script_dir/client"
admin_dir="$script_dir/admin"
client_pid=''
admin_pid=''

install_dependencies() {
  project_dir=$1
  project_name=$2

  if [ ! -d "$project_dir/node_modules" ]; then
    echo "[$project_name] 首次运行，正在安装依赖..."
    (cd "$project_dir" && npm install)
  fi
}

cleanup() {
  trap - EXIT INT TERM

  [ -z "$client_pid" ] || kill "$client_pid" 2>/dev/null || true
  [ -z "$admin_pid" ] || kill "$admin_pid" 2>/dev/null || true
  [ -z "$client_pid" ] || wait "$client_pid" 2>/dev/null || true
  [ -z "$admin_pid" ] || wait "$admin_pid" 2>/dev/null || true
}

stop_on_signal() {
  cleanup
  exit 130
}

trap cleanup EXIT
trap stop_on_signal INT TERM

install_dependencies "$client_dir" "client"
install_dependencies "$admin_dir" "admin"

echo "[client] http://localhost:5173"
(cd "$client_dir" && npm run dev -- --host 0.0.0.0 --port 5173 --strictPort) &
client_pid=$!

echo "[admin]  http://localhost:5172"
(cd "$admin_dir" && npm run dev -- --host 0.0.0.0 --port 5172 --strictPort) &
admin_pid=$!

echo "两个 Vue 项目已启动，按 Ctrl+C 同时停止。"
wait "$client_pid" "$admin_pid"
