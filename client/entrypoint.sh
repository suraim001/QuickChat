#!/bin/sh
set -eu

BACKEND_URL="${BACKEND_URL:-}"

cat > /usr/share/nginx/html/config.js <<EOF
window.__APP_CONFIG__ = {
  BACKEND_URL: "${BACKEND_URL}"
};
EOF

exec nginx -g 'daemon off;'
