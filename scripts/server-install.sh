#!/usr/bin/env bash
set -e

APP="/var/www/inkyidentity"
DOMAIN="inkyidentity.com"

echo "==> Installing packages"
apt-get update -q
apt-get install -y -q curl git nginx certbot python3-certbot-nginx

echo "==> Installing Node.js"
curl -fsSL https://deb.nodesource.com/setup_22.x | bash - > /dev/null
apt-get install -y -q nodejs

echo "==> Installing PM2"
npm install -g pm2 -q
pm2 startup systemd -u root --hp /root | tail -1 | bash

echo "==> Cloning app"
mkdir -p "$APP"
if [ -d "$APP/.git" ]; then
  git -C "$APP" pull origin main
else
  git clone https://github.com/bonnerb6-alt/inkyidentity.git "$APP"
fi

echo "==> Building app"
cd "$APP"
npm ci
npm run build

echo "==> Starting app"
pm2 delete inkyidentity 2>/dev/null || true
pm2 start npm --name inkyidentity -- start
pm2 save

echo "==> Configuring Nginx"
cat > /etc/nginx/sites-available/inkyidentity <<NGINX
server {
    listen 80;
    server_name ${DOMAIN} www.${DOMAIN};
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

echo "==> Getting SSL certificate"
certbot --nginx -d "$DOMAIN" -d "www.$DOMAIN" --non-interactive --agree-tos -m "bonnerb6@gmail.com" --redirect

echo "==> Firewall"
ufw --force reset -q
ufw default deny incoming
ufw default allow outgoing
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw --force enable

echo ""
echo "Almost done! Now run the second command to set your API keys, then: pm2 restart inkyidentity"
