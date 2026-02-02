# Deployment Guide

This guide covers deploying the Attendance Tracker application using Docker containers.

## Deployment Options

- **Railway** (Recommended) - Simplest setup, see [RAILWAY.md](RAILWAY.md)
- **Azure Container Apps** - Enterprise option, detailed below

## Architecture

- **Backend**: Node.js/Express API with SQLite database
- **Frontend**: React SPA served by Nginx
- **Deployment**: Two separate container apps

## Local Testing with Docker Compose

Before deploying to Azure, test locally:

```bash
# Build and run both containers
docker-compose up --build

# Access the application
# Frontend: http://localhost
# Backend API: http://localhost:3001/api/health
```

To stop:
```bash
docker-compose down
```

To remove volumes (deletes database):
```bash
docker-compose down -v
```

## Building Individual Containers

### Backend
```bash
cd attendance-tracker-backend
docker build -t attendance-backend:latest .
```

### Frontend
```bash
cd attendance-tracker-frontend
docker build -t attendance-frontend:latest .
```

## Azure Deployment Options

### Option 1: Two Separate Azure Container Apps (Recommended)

#### Prerequisites
- Azure CLI installed
- Azure Container Registry (ACR) created
- Resource Group created

#### Step 1: Push Images to Azure Container Registry

```bash
# Login to Azure
az login

# Login to ACR
az acr login --name <your-acr-name>

# Tag and push backend
docker tag attendance-backend:latest <your-acr-name>.azurecr.io/attendance-backend:latest
docker push <your-acr-name>.azurecr.io/attendance-backend:latest

# Tag and push frontend
docker tag attendance-frontend:latest <your-acr-name>.azurecr.io/attendance-frontend:latest
docker push <your-acr-name>.azurecr.io/attendance-frontend:latest
```

#### Step 2: Create Container Apps Environment

```bash
az containerapp env create \
  --name attendance-env \
  --resource-group <your-resource-group> \
  --location eastus
```

#### Step 3: Create Azure Files Share for SQLite Database

```bash
# Create storage account
az storage account create \
  --name <storage-account-name> \
  --resource-group <your-resource-group> \
  --location eastus \
  --sku Standard_LRS

# Create file share
az storage share create \
  --name attendance-data \
  --account-name <storage-account-name>

# Get storage key
az storage account keys list \
  --account-name <storage-account-name> \
  --query "[0].value" -o tsv
```

#### Step 4: Deploy Backend Container App

```bash
az containerapp create \
  --name attendance-backend \
  --resource-group <your-resource-group> \
  --environment attendance-env \
  --image <your-acr-name>.azurecr.io/attendance-backend:latest \
  --target-port 3001 \
  --ingress external \
  --env-vars "NODE_ENV=production" "PORT=3001" "CORS_ORIGIN=https://<frontend-url>" \
  --cpu 0.5 --memory 1.0Gi \
  --registry-server <your-acr-name>.azurecr.io
```

Add the Azure Files volume:
```bash
az containerapp update \
  --name attendance-backend \
  --resource-group <your-resource-group> \
  --set-env-vars \
    "AZURE_STORAGE_ACCOUNT=<storage-account-name>" \
    "AZURE_STORAGE_KEY=<storage-key>" \
  --azure-file-volume-name attendance-volume \
  --azure-file-volume-account-name <storage-account-name> \
  --azure-file-volume-account-key <storage-key> \
  --azure-file-volume-share-name attendance-data \
  --azure-file-volume-mount-path /app/data
```

#### Step 5: Deploy Frontend Container App

```bash
# Get backend URL
BACKEND_URL=$(az containerapp show \
  --name attendance-backend \
  --resource-group <your-resource-group> \
  --query properties.configuration.ingress.fqdn -o tsv)

# Deploy frontend
az containerapp create \
  --name attendance-frontend \
  --resource-group <your-resource-group> \
  --environment attendance-env \
  --image <your-acr-name>.azurecr.io/attendance-frontend:latest \
  --target-port 80 \
  --ingress external \
  --env-vars "VITE_API_URL=https://${BACKEND_URL}" \
  --cpu 0.25 --memory 0.5Gi \
  --registry-server <your-acr-name>.azurecr.io
```

#### Step 6: Update Backend CORS

```bash
# Get frontend URL
FRONTEND_URL=$(az containerapp show \
  --name attendance-frontend \
  --resource-group <your-resource-group> \
  --query properties.configuration.ingress.fqdn -o tsv)

# Update backend with correct CORS origin
az containerapp update \
  --name attendance-backend \
  --resource-group <your-resource-group> \
  --set-env-vars "CORS_ORIGIN=https://${FRONTEND_URL}"
```

### Option 2: Azure App Service for Containers

Alternatively, you can deploy using Azure App Service with Docker Compose:

```bash
az webapp create \
  --resource-group <your-resource-group> \
  --plan <your-app-service-plan> \
  --name <your-app-name> \
  --multicontainer-config-type compose \
  --multicontainer-config-file docker-compose.yml
```

Note: You'll need to modify `docker-compose.yml` to use ACR images instead of building locally.

## Environment Variables

### Backend
- `NODE_ENV`: Set to `production` for Docker
- `PORT`: API port (default: 3001)
- `CORS_ORIGIN`: Frontend URL for CORS (use `*` for development, specific URL for production)

### Frontend
- `VITE_API_URL`: Backend API URL (e.g., `https://attendance-backend.azurecontainerapps.io`)

## Database Persistence

The SQLite database is persisted using Azure Files volume mounted at `/app/data` in the backend container. The database file is `attendance.db`.

### Backup Database

```bash
# Download from Azure Files
az storage file download \
  --account-name <storage-account-name> \
  --account-key <storage-key> \
  --share-name attendance-data \
  --path attendance.db \
  --dest ./backup-attendance.db
```

### Restore Database

```bash
# Upload to Azure Files
az storage file upload \
  --account-name <storage-account-name> \
  --account-key <storage-key> \
  --share-name attendance-data \
  --source ./backup-attendance.db \
  --path attendance.db
```

## Monitoring

View logs:
```bash
# Backend logs
az containerapp logs show \
  --name attendance-backend \
  --resource-group <your-resource-group> \
  --follow

# Frontend logs
az containerapp logs show \
  --name attendance-frontend \
  --resource-group <your-resource-group> \
  --follow
```

## Scaling

```bash
# Scale backend
az containerapp update \
  --name attendance-backend \
  --resource-group <your-resource-group> \
  --min-replicas 1 \
  --max-replicas 5

# Scale frontend
az containerapp update \
  --name attendance-frontend \
  --resource-group <your-resource-group> \
  --min-replicas 1 \
  --max-replicas 5
```

## Updating Deployments

```bash
# Rebuild and push new images
docker-compose build
docker tag attendance-backend:latest <your-acr-name>.azurecr.io/attendance-backend:latest
docker push <your-acr-name>.azurecr.io/attendance-backend:latest
docker tag attendance-frontend:latest <your-acr-name>.azurecr.io/attendance-frontend:latest
docker push <your-acr-name>.azurecr.io/attendance-frontend:latest

# Update container apps
az containerapp update \
  --name attendance-backend \
  --resource-group <your-resource-group> \
  --image <your-acr-name>.azurecr.io/attendance-backend:latest

az containerapp update \
  --name attendance-frontend \
  --resource-group <your-resource-group> \
  --image <your-acr-name>.azurecr.io/attendance-frontend:latest
```

## Troubleshooting

### Container fails to start
Check logs using `az containerapp logs show` command above.

### Database not persisting
Verify Azure Files volume is correctly mounted:
```bash
az containerapp show \
  --name attendance-backend \
  --resource-group <your-resource-group> \
  --query properties.template.volumes
```

### CORS errors
Ensure `CORS_ORIGIN` in backend matches the frontend URL exactly.

### API connection errors
Verify `VITE_API_URL` in frontend is set correctly and backend is accessible.
