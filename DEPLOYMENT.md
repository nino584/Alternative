# Alternative — Production Deployment Checklist

## Pre-Deploy Checklist

### 1. Environment Variables

**Server (`server/.env`):**
```env
PORT=3001
NODE_ENV=production
JWT_SECRET=<generate with: node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))">
JWT_REFRESH_SECRET=<generate with the same command — use a DIFFERENT value>
CORS_ORIGIN=https://alternative.ge,https://admin.alternative.ge
SITE_URL=https://alternative.ge
```

**Store Frontend (`Alternative/.env`):**
```env
VITE_ADMIN_URL=https://admin.alternative.ge
VITE_PLAUSIBLE_DOMAIN=alternative.ge
```

**Admin Frontend (`admin/.env`):**
```env
VITE_STORE_URL=https://alternative.ge
```

> CRITICAL: Generate new JWT secrets for production. Never reuse development secrets.

---

### 2. Build Process

```bash
# Install dependencies
cd Alternative && npm ci
cd ../admin && npm ci
cd ../server && npm ci

# Build frontends
cd ../Alternative && npm run build   # → Alternative/dist/
cd ../admin && npm run build         # → admin/dist/

# Seed database (first time only)
cd ../server && node db/seed.js
```

---

### 3. Recommended Architecture

```
                    ┌─────────────────┐
                    │   Nginx / CDN   │ ← SSL termination
                    │ (reverse proxy) │
                    └────┬───────┬────┘
                         │       │
              ┌──────────┘       └──────────┐
              ▼                              ▼
    ┌──────────────────┐          ┌──────────────────┐
    │  Static hosting  │          │  Node.js server  │
    │  (Vercel/Netlify)│          │  (Railway/Render) │
    │                  │          │                  │
    │  Alternative/dist│          │  server/         │
    │  admin/dist      │          │  PORT=3001       │
    └──────────────────┘          └──────────────────┘
```

**Option A: Fully managed (recommended for starting out)**
- Store frontend → Vercel (free tier, connect GitHub repo, set root to `Alternative`)
- Admin frontend → Vercel (separate project, root set to `admin`)
- Server → Railway or Render (connect GitHub, root set to `server`, start command: `node index.js`)

**Option B: VPS (full control)**
- Single VPS with Nginx reverse proxy
- PM2 for Node.js process management
- Let's Encrypt for SSL

---

### 4. Hosting Setup

#### Vercel (Frontend)
1. Connect GitHub repo
2. Set root directory: `Alternative` (or `admin`)
3. Build command: `npm run build`
4. Output directory: `dist`
5. Add environment variables in Vercel dashboard
6. Add custom domain

#### Railway (Server)
1. Connect GitHub repo
2. Set root directory: `server`
3. Start command: `node index.js`
4. Add environment variables in Railway dashboard
5. Add custom domain (e.g., api.alternative.ge)

#### VPS with PM2 + Nginx
```bash
# Install PM2
npm install -g pm2

# Start server
cd server
pm2 start index.js --name alternative-api
pm2 save
pm2 startup

# Nginx config (/etc/nginx/sites-available/alternative)
server {
    listen 80;
    server_name alternative.ge www.alternative.ge;

    location / {
        root /var/www/alternative/Alternative/dist;
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    location /images/products {
        proxy_pass http://localhost:3001;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

# SSL with Let's Encrypt
sudo certbot --nginx -d alternative.ge -d www.alternative.ge
```

---

### 5. Database Backups

The app uses a JSON file database (`server/db/data.json`). Set up automated backups:

```bash
# Manual backup
node server/scripts/backup.js

# Automated daily backup via cron (3 AM)
crontab -e
# Add: 0 3 * * * cd /path/to/Alternative && node server/scripts/backup.js >> server/logs/backup.log 2>&1
```

Backups are stored in `server/backups/` (last 30 kept automatically).

---

### 6. DNS Configuration

Set up these DNS records:
| Type  | Name    | Value                          |
|-------|---------|--------------------------------|
| A     | @       | Your server IP                 |
| A     | www     | Your server IP                 |
| CNAME | admin   | Your admin hosting URL         |
| CNAME | api     | Your API hosting URL (if separate) |

---

### 7. Security Final Checks

- [ ] JWT secrets are unique, random, 48+ bytes
- [ ] `NODE_ENV=production` is set on server
- [ ] CORS_ORIGIN uses `https://` URLs only
- [ ] `.env` files are NOT committed to git
- [ ] Source maps disabled in production builds (already done in vite.config.js)
- [ ] HTTPS redirect is active (automatic when `NODE_ENV=production`)
- [ ] HSTS header is present (check with `curl -I https://alternative.ge`)
- [ ] Rate limiting is active on all endpoints
- [ ] Admin accounts exist only via seed (no public admin registration)

---

### 8. Monitoring

- **Health check:** `GET /api/health` — returns uptime, memory, env info
- **Error logs:** `server/logs/errors.log` — frontend + server errors
- **Contact logs:** `server/logs/contacts.log` — contact form submissions
- **Plausible analytics:** Configure `VITE_PLAUSIBLE_DOMAIN` and sign up at https://plausible.io

Set up uptime monitoring (free options):
- [UptimeRobot](https://uptimerobot.com) — ping `/api/health` every 5 min
- [Betterstack](https://betterstack.com) — alerts via email/Slack

---

### 9. CI/CD (GitHub Actions)

The CI pipeline (`.github/workflows/ci.yml`) runs automatically on push/PR to `main`:
- Builds store frontend
- Builds admin frontend
- Validates server starts and health check passes

For auto-deploy, add deployment steps to the workflow for your hosting provider:
- **Vercel/Netlify:** Auto-deploys on push to main (configure in their dashboard)
- **Railway:** Auto-deploys on push to main (configure in dashboard)
- **VPS:** Add SSH deploy step to the workflow

---

### 10. Go-Live Steps (in order)

1. [ ] Generate production JWT secrets
2. [ ] Set up hosting (server + 2 frontends)
3. [ ] Configure environment variables on all services
4. [ ] Run `node db/seed.js` to create initial data + admin user
5. [ ] Build and deploy frontends
6. [ ] Deploy server
7. [ ] Configure DNS records
8. [ ] Verify SSL certificates are active
9. [ ] Test full flow: register → login → browse → checkout
10. [ ] Test admin panel: login as admin → manage products/orders
11. [ ] Set up database backup cron job
12. [ ] Set up uptime monitoring
13. [ ] Enable Plausible analytics (set `VITE_PLAUSIBLE_DOMAIN`)
14. [ ] Submit sitemap to Google Search Console (`/api/sitemap.xml`)
15. [ ] Monitor error logs for first 48 hours
