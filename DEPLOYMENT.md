# VAUL AI Deployment Guide

This guide walks you through deploying VAUL AI to production on various platforms.

## Pre-Deployment Checklist

- [ ] All environment variables are set
- [ ] Supabase database tables are created
- [ ] Supabase Storage bucket "vault" is created
- [ ] RLS policies are applied
- [ ] OpenAI API key is obtained
- [ ] Application builds successfully locally
- [ ] All tests pass (if applicable)

## Deploy to Vercel (Recommended)

Vercel offers seamless deployment for Next.js applications with automatic CI/CD.

### Steps:

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Next.js

3. **Configure Environment Variables**
   In the Vercel project settings, add:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   OPENAI_API_KEY=your_openai_api_key
   ```

4. **Deploy**
   - Click "Deploy"
   - Vercel will build and deploy your application
   - You'll get a production URL (e.g., `your-app.vercel.app`)

5. **Custom Domain (Optional)**
   - Go to Project Settings → Domains
   - Add your custom domain (e.g., `vaul.me`)
   - Follow DNS configuration instructions

### Vercel Configuration

The project includes optimal settings for Vercel:
- Automatic HTTPS
- Edge network CDN
- Serverless functions for API routes
- Automatic preview deployments for PRs

## Deploy to DigitalOcean App Platform

DigitalOcean App Platform provides easy deployment with automatic scaling.

### Steps:

1. **Push code to GitHub**
   ```bash
   git push origin main
   ```

2. **Create New App**
   - Go to [DigitalOcean App Platform](https://cloud.digitalocean.com/apps)
   - Click "Create App"
   - Connect your GitHub repository

3. **Configure Build Settings**
   ```
   Build Command: npm run build
   Run Command: npm start
   HTTP Port: 3000
   ```

4. **Add Environment Variables**
   Under "Environment Variables" section:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   OPENAI_API_KEY=your_openai_api_key
   ```

5. **Deploy**
   - Click "Create Resources"
   - Wait for build and deployment
   - Access your app at the provided URL

### Pricing
- Basic plan: $5/month
- Professional: $12/month
- Scales automatically based on traffic

## Deploy to Netlify

### Steps:

1. **Push to GitHub**
   ```bash
   git push origin main
   ```

2. **Import to Netlify**
   - Go to [netlify.com](https://netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Connect to GitHub and select your repository

3. **Build Settings**
   ```
   Build command: npm run build
   Publish directory: .next
   ```

4. **Environment Variables**
   Add in Site settings → Environment variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL
   NEXT_PUBLIC_SUPABASE_ANON_KEY
   OPENAI_API_KEY
   ```

5. **Deploy**
   - Click "Deploy site"
   - Netlify will build and deploy

## Deploy with Docker

### Dockerfile

Create a `Dockerfile` in your project root:

```dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Set environment variables for build
ENV NEXT_TELEMETRY_DISABLED 1

RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

### docker-compose.yml

```yaml
version: '3.8'

services:
  vaul-ai:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_SUPABASE_URL=${NEXT_PUBLIC_SUPABASE_URL}
      - NEXT_PUBLIC_SUPABASE_ANON_KEY=${NEXT_PUBLIC_SUPABASE_ANON_KEY}
      - OPENAI_API_KEY=${OPENAI_API_KEY}
    restart: unless-stopped
```

### Deploy with Docker

```bash
# Build the image
docker build -t vaul-ai .

# Run the container
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_SUPABASE_URL=your_url \
  -e NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key \
  -e OPENAI_API_KEY=your_openai_key \
  vaul-ai

# Or use docker-compose
docker-compose up -d
```

## Self-Hosted VPS Deployment

For deployment on your own VPS (Ubuntu/Debian):

### 1. Prepare Server

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2 for process management
sudo npm install -g pm2
```

### 2. Clone and Build

```bash
# Clone repository
git clone https://github.com/Azoussin/Azoussin.github.io.git
cd Azoussin.github.io

# Install dependencies
npm install

# Create .env.local
nano .env.local
# Add your environment variables

# Build
npm run build
```

### 3. Run with PM2

```bash
# Start the application
pm2 start npm --name "vaul-ai" -- start

# Save PM2 configuration
pm2 save

# Set PM2 to start on boot
pm2 startup
```

### 4. Configure Nginx

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 5. SSL with Let's Encrypt

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

## Environment Variables for Production

Make sure to set these in your deployment platform:

```bash
# Supabase Configuration (Required)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# OpenAI Configuration (Required)
OPENAI_API_KEY=sk-your-openai-api-key

# Optional: Node environment
NODE_ENV=production
```

## Post-Deployment Steps

1. **Test All Features**
   - [ ] User registration
   - [ ] User login
   - [ ] Create/edit/delete notes
   - [ ] Upload/download/delete files
   - [ ] AI assistant functionality
   - [ ] Profile updates
   - [ ] Dark/light mode toggle

2. **Monitor Performance**
   - Check application logs
   - Monitor API usage (OpenAI)
   - Check Supabase usage metrics
   - Set up error tracking (e.g., Sentry)

3. **Security Review**
   - Verify HTTPS is enabled
   - Check CORS settings
   - Review Supabase RLS policies
   - Ensure environment variables are secure

4. **SEO & Analytics (Optional)**
   - Add Google Analytics
   - Configure meta tags
   - Set up sitemap
   - Submit to search engines

## Continuous Deployment

### GitHub Actions (Vercel)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

## Troubleshooting

### Build Fails
- Check all environment variables are set
- Verify Node.js version (18+)
- Clear `.next` and `node_modules`, rebuild

### Database Connection Issues
- Verify Supabase URL and keys
- Check RLS policies are applied
- Ensure tables are created

### API Route Errors
- Check OpenAI API key is valid
- Verify API route permissions
- Check server logs for details

### Storage Issues
- Verify "vault" bucket exists
- Check storage RLS policies
- Ensure proper CORS settings

## Support

For deployment issues:
- Check the [Next.js deployment docs](https://nextjs.org/docs/deployment)
- Review [Supabase docs](https://supabase.com/docs)
- Contact your hosting provider support

---

Last updated: December 2025
