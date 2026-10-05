#!/bin/sh
set -eu

BACKEND_URL="${BACKEND_URL:-}"
BACKEND_SERVICE="${BACKEND_SERVICE:-quick-chat-server-service}"
BACKEND_PORT="${BACKEND_PORT:-5000}"

cat > /usr/share/nginx/html/config.js <<EOF
window.__APP_CONFIG__ = {
  BACKEND_URL: "${BACKEND_URL}"
};
EOF

cat > /etc/nginx/conf.d/default.conf <<EOF
server {
    listen 80;
    server_name _;

    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files \$uri \$uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://${BACKEND_SERVICE}:${BACKEND_PORT}/api/;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
    }
}
EOF

exec nginx -g 'daemon off;'
