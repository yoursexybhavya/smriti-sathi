#!/usr/bin/env bash
mkdir -p /tmp/herodotus_tunnel
LOGFILE="/tmp/herodotus_tunnel/tunnel.log"
URLFILE="/tmp/herodotus_tunnel/current_url.txt"

echo "Starting persistent tunnel daemon..." > "$LOGFILE"

while true; do
  ssh -o StrictHostKeyChecking=no -o ServerAliveInterval=15 -o ServerAliveCountMax=4 -R 80:localhost:5173 nokey@localhost.run 2>&1 | while IFS= read -r line; do
    echo "$line" >> "$LOGFILE"
    if [[ "$line" =~ (https://[a-zA-Z0-9.-]+\.lhr\.life) ]]; then
      MATCH="${BASH_REMATCH[1]}"
      echo "$MATCH" > "$URLFILE"
      echo "[FOUND URL] $MATCH" >> "$LOGFILE"
    fi
  done
  echo "Tunnel disconnected at $(date), restarting in 2 seconds..." >> "$LOGFILE"
  sleep 2
done
