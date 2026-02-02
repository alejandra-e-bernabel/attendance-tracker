# Railway Deployment Guide

Railway is a simpler alternative to Azure for deploying both the backend and frontend.

## Architecture

- **Backend**: Deployed as a Railway service with persistent volume for SQLite
- **Frontend**: Deployed as a separate Railway service OR use Azure Static Web Apps/Vercel/Netlify

## Prerequisites

1. [Railway account](https://railway.app) (free tier available)
2. Railway CLI (optional): `npm install -g @railway/cli`
3. Git repository pushed to GitHub/GitLab

## Option 1: Deploy via Railway Dashboard (Easiest)

### Step 1: Deploy Backend

1. Go to [railway.app](https://railway.app) and create a new project
2. Click **"Deploy from GitHub repo"**
3. Select your repository
4. Railway will auto-detect the backend, or manually set:
   - **Root Directory**: `attendance-tracker-backend`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`

### Step 2: Configure Backend

1. Go to your backend service settings
2. Add **Environment Variables**:
   ```
   NODE_ENV=production
   PORT=3001
   CORS_ORIGIN=*
   ```
   (Update `CORS_ORIGIN` after deploying frontend)

3. Add **Persistent Volume**:
   - Go to **Storage** tab
   - Click **"Add Volume"**
   - Mount Path: `/app/data`
   - Size: 1GB (or as needed)

4. Get your backend URL:
   - Go to **Settings** → **Networking**
   - Copy the public domain (e.g., `https://your-app.up.railway.app`)

### Step 3: Deploy Frontend

1. In the same Railway project, click **"New Service"**
2. Select **"Deploy from GitHub repo"** again
3. Select the same repository
4. Configure:
   - **Root Directory**: `attendance-tracker-frontend`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: Leave empty (we'll use Dockerfile)
   - Or use **Nixpacks** with Dockerfile

5. Add **Environment Variables**:
   ```
   VITE_API_URL=https://your-backend.up.railway.app
   ```

### Step 4: Update CORS

Go back to backend service and update `CORS_ORIGIN`:
```
CORS_ORIGIN=https://your-frontend.up.railway.app
```

## Option 2: Deploy via Railway CLI

### Step 1: Install Railway CLI

```bash
npm install -g @railway/cli
```

### Step 2: Login

```bash
railway login
```

### Step 3: Initialize Project

```bash
cd attendance-tracker
railway init
```

### Step 4: Deploy Backend

```bash
cd attendance-tracker-backend
railway up
```

### Step 5: Add Volume

```bash
railway volume add
# Name: attendance-data
# Mount Path: /app/data
```

### Step 6: Set Environment Variables

```bash
railway variables set NODE_ENV=production
railway variables set PORT=3001
railway variables set CORS_ORIGIN=*
```

### Step 7: Deploy Frontend

```bash
cd ../attendance-tracker-frontend
railway link  # Link to same project
railway up
```

Set frontend variables:
```bash
railway variables set VITE_API_URL=https://your-backend.up.railway.app
```

## Option 3: Using Dockerfile (Recommended for Frontend)

Railway automatically detects and uses Dockerfiles. Since we already have Dockerfiles:

### Backend (Dockerfile deployment)

Railway.json configuration is optional but recommended:

**`attendance-tracker-backend/railway.json`**:
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "DOCKERFILE",
    "dockerfilePath": "Dockerfile"
  },
  "deploy": {
    "numReplicas": 1,
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

### Frontend (Dockerfile deployment)

**`attendance-tracker-frontend/railway.json`**:
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "DOCKERFILE",
    "dockerfilePath": "Dockerfile"
  },
  "deploy": {
    "numReplicas": 1,
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

## Alternative: Frontend on Vercel/Netlify + Backend on Railway

This is often the best option:

### Deploy Backend on Railway (as above)

### Deploy Frontend on Vercel

1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Configure:
   - **Root Directory**: `attendance-tracker-frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Framework Preset**: Vite

4. Add Environment Variable:
   ```
   VITE_API_URL=https://your-backend.up.railway.app
   ```

5. Deploy

### Update Backend CORS

Update Railway backend environment variable:
```
CORS_ORIGIN=https://your-app.vercel.app
```

## Environment Variables Reference

### Backend (Railway)
| Variable | Value | Description |
|----------|-------|-------------|
| `NODE_ENV` | `production` | Enables production mode |
| `PORT` | `3001` | API port (Railway auto-assigns if not set) |
| `CORS_ORIGIN` | Frontend URL or `*` | CORS allowed origin |

### Frontend (Railway/Vercel/Netlify)
| Variable | Value | Description |
|----------|-------|-------------|
| `VITE_API_URL` | Backend URL | API endpoint |

## Database Management

### Access Database

Railway provides a CLI to access your volume:

```bash
railway run bash
cd /app/data
ls -la  # See attendance.db
```

### Backup Database

```bash
# Connect to your Railway project
railway link

# Download database
railway run cat /app/data/attendance.db > backup-$(date +%Y%m%d).db
```

### Restore Database

```bash
# Upload database
cat backup.db | railway run 'cat > /app/data/attendance.db'

# Restart service
railway restart
```

## Monitoring and Logs

### View Logs (Dashboard)
1. Go to your Railway project
2. Click on the service
3. Go to **Deployments** tab
4. Click on latest deployment to see logs

### View Logs (CLI)
```bash
railway logs
```

## Custom Domain

1. Go to service **Settings**
2. Click **Networking**
3. Add **Custom Domain**
4. Follow Railway's DNS instructions

## Costs

Railway offers:
- **Free Tier**: $5 of usage per month (includes egress, compute)
- **Pro Plan**: $20/month + usage

Estimated monthly cost for this app:
- Backend: ~$2-5 (24/7 running)
- Frontend: ~$1-2 (if deployed on Railway)
- Volume: Included

**Tip**: Deploy frontend on Vercel/Netlify (free) and only backend on Railway to minimize costs.

## Troubleshooting

### Backend not starting
Check logs for errors:
```bash
railway logs
```

Common issues:
- Missing build step: Ensure TypeScript is compiled
- Port binding: Railway assigns `PORT` env var automatically

### Database not persisting
Verify volume is mounted:
```bash
railway run ls -la /app/data
```

### CORS errors
Ensure `CORS_ORIGIN` matches your frontend URL exactly (including `https://`)

### Build fails
Check Railway build logs. Common fixes:
- Ensure `package.json` has all dependencies
- Verify Node.js version compatibility
- Check `railway.json` configuration

## Advantages of Railway vs Azure

✅ **Simpler setup** - No complex Azure CLI commands
✅ **Auto-detect** - Detects Dockerfile and Node.js automatically
✅ **Free tier** - $5/month free usage
✅ **Built-in volumes** - Easy persistent storage
✅ **Better DX** - Excellent dashboard and CLI
✅ **Git integration** - Auto-deploy on push
✅ **No registry needed** - Builds images automatically

## Next Steps

1. Deploy backend to Railway
2. Add volume for database
3. Deploy frontend to Vercel (free) or Railway
4. Update CORS configuration
5. Test the application
6. Set up custom domain (optional)
