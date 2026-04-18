#!/usr/bin/env bash
# Serve chapters/pain-NN/exercises or chapters/pain-NN/solutions over HTTP.
#   npm run exercise -- --pain 2              # student stub (exercises/)
#   npm run solution -- --pain 2              # reference (solutions/)
#   npm run exercise -- 2
#   PAIN=2 npm run exercise
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
PAIN="${PAIN:-}"
MODE="exercises"
PORT="${PORT:-8080}"

while [[ $# -gt 0 ]]; do
  case "$1" in
    --pain | -p) PAIN="${2:-}"; shift 2 ;;
    --solution | -s) MODE="solutions"; shift ;;
    *) [[ -z "$PAIN" && "$1" =~ ^[0-9]+$ ]] && PAIN="$1"; shift ;;
  esac
done

NN=$(printf '%02d' "$PAIN")
DIR="$ROOT/chapters/pain-$NN/$MODE"

echo "Serving $DIR ($MODE) → http://127.0.0.1:$PORT/  (Ctrl+C to stop)"
cd "$DIR"
exec python3 -m http.server "$PORT"
