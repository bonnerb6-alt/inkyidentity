#!/usr/bin/env bash
# Run from your local machine: bash scripts/deploy.sh
set -e

SERVER="root@77.68.97.196"
APP="/var/www/inkyidentity"

echo "==> Syncing files to server"
rsync -az --delete \
  --exclude node_modules \
  --exclude .next \
  --exclude .env.local \
  --exclude '*.db' \
  ./ "$SERVER:$APP/"

echo "==> Syncing env"
ssh "$SERVER" "cat > $APP/.env.production" << 'ENV'
NODE_ENV=production
NEXT_PUBLIC_BASE_URL=https://inkyidentity.com
JWT_SECRET=CHANGE_THIS_TO_A_LONG_RANDOM_STRING
RESEND_API_KEY=re_a1o6dR8Y_MsYbrGNxSPXeg3fViQo5xm7M
STRIPE_SECRET_KEY=sk_test_51TMbXzLU7r1cTCoQ2aH7QFXFIkcZ4CUjuSMWbm2MzkcMddUAWBJoZiGKAw0hK03d39woRKuC58LdDvL4Aol3ElMs00tqb2nLoT
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51TMbXzLU7r1cTCoQ1U8KliQaku5VXvEWEFYyNU6FpOfeBU7S3p8SkZMBFc4FIMUFDj1QUgEZ4ItxQZQOSs2lrFum006gdWu9zg
STRIPE_WEBHOOK_SECRET=whsec_010dba13f9fc1744bedef6dc5a9827e8bdff639af3c01f9b439d7deb99619476
PRODIGI_API_KEY=855f79c3-31b1-413d-92c0-b9fc2d7f4c88
PRODIGI_ENV=api
ENV

echo "==> Building and starting on server"
ssh "$SERVER" bash << ENDSSH
  set -e
  cd $APP

  # first-time setup
  if ! command -v node &>/dev/null; then
    apt-get update -q && apt-get install -y -q curl nginx certbot python3-certbot-nginx
    curl -fsSL https://deb.nodesource.com/setup_22.x | bash - > /dev/null
    apt-get install -y -q nodejs
    npm install -g pm2 -q
    pm2 startup systemd -u root --hp /root | tail -1 | bash

    # nginx
    cat > /etc/nginx/sites-available/inkyidentity << 'NGINX'
server {
    listen 80;
    server_name inkyidentity.com www.inkyidentity.com;
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host \$host;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_set_header X-Real-IP \$remote_addr;
    }
}
NGINX
    ln -sf /etc/nginx/sites-available/inkyidentity /etc/nginx/sites-enabled/inkyidentity
    rm -f /etc/nginx/sites-enabled/default
    nginx -t && systemctl reload nginx

    certbot --nginx -d inkyidentity.com -d www.inkyidentity.com \
      --non-interactive --agree-tos -m admin@inkyidentity.com --redirect

    ufw --force reset -q
    ufw default deny incoming
    ufw default allow outgoing
    ufw allow OpenSSH
    ufw allow 'Nginx Full'
    ufw --force enable
  fi

  npm ci
  npm run build
  pm2 restart inkyidentity 2>/dev/null || pm2 start npm --name inkyidentity -- start
  pm2 save
ENDSSH

echo ""
echo "Live at https://inkyidentity.com"
