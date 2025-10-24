# Deployment Guide

This guide covers deploying the Prayer Tracker application using Docker and Google Cloud Run.

## Table of Contents

- [Docker Deployment](#docker-deployment)
  - [Local Docker Development](#local-docker-development)
  - [Production Docker Compose](#production-docker-compose)
- [Google Cloud Run Deployment](#google-cloud-run-deployment)
  - [Prerequisites](#prerequisites)
  - [Quick Deployment](#quick-deployment)
  - [Manual Deployment](#manual-deployment)
  - [Database Setup](#database-setup)
  - [Environment Variables](#environment-variables)
- [CI/CD with Cloud Build](#cicd-with-cloud-build)

## Docker Deployment

### Local Docker Development

For local development with hot reload:

```bash
# Start development environment
docker-compose -f docker-compose.dev.yml up

# Access the application
# Backend API: http://localhost:8000
# Frontend: http://localhost:5173
# API Docs: http://localhost:8000/docs
```

This configuration uses SQLite and mounts your local code for hot reloading.

### Production Docker Compose

For production-like environment with PostgreSQL:

```bash
# Start production environment
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

Production configuration includes:
- PostgreSQL database
- Backend API on port 8000
- Frontend on port 8080
- Persistent database storage

## Google Cloud Run Deployment

### Prerequisites

1. **Google Cloud SDK**: Install and authenticate
   ```bash
   # Install gcloud CLI
   # https://cloud.google.com/sdk/docs/install

   # Authenticate
   gcloud auth login

   # Set your project
   gcloud config set project YOUR_PROJECT_ID

   # Enable required APIs
   gcloud services enable run.googleapis.com
   gcloud services enable containerregistry.googleapis.com
   ```

2. **Docker**: Required for building images
   ```bash
   # Configure Docker for GCR
   gcloud auth configure-docker
   ```

3. **Environment Variables**: Set your project configuration
   ```bash
   export GCP_PROJECT_ID="your-project-id"
   export GCP_REGION="us-central1"
   ```

### Quick Deployment

Deploy both backend and frontend with a single command:

```bash
# Set environment variables
export GCP_PROJECT_ID="your-project-id"
export GCP_REGION="us-central1"

# Run deployment script
./deploy-all.sh
```

This script will:
1. Deploy the backend API to Cloud Run
2. Deploy the frontend with the correct backend URL
3. Output the URLs for both services

### Manual Deployment

#### Deploy Backend Only

```bash
export GCP_PROJECT_ID="your-project-id"
export GCP_REGION="us-central1"
export DATABASE_URL="sqlite:///./prayer_tracker.db"  # Optional

./deploy-backend.sh
```

Or manually:

```bash
gcloud run deploy prayer-tracker-api \
  --source ./backend \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars DATABASE_URL="sqlite:///./prayer_tracker.db" \
  --set-env-vars CORS_ORIGINS="*" \
  --max-instances 10 \
  --memory 512Mi
```

#### Deploy Frontend Only

```bash
export GCP_PROJECT_ID="your-project-id"
export GCP_REGION="us-central1"
export BACKEND_URL="https://your-backend-url.run.app"

./deploy-frontend.sh
```

Or manually:

```bash
# Build with backend URL
docker build \
  --build-arg VITE_API_URL=https://your-backend-url.run.app \
  -t gcr.io/YOUR_PROJECT_ID/prayer-tracker-frontend:latest \
  ./frontend

# Push to GCR
docker push gcr.io/YOUR_PROJECT_ID/prayer-tracker-frontend:latest

# Deploy to Cloud Run
gcloud run deploy prayer-tracker-frontend \
  --image gcr.io/YOUR_PROJECT_ID/prayer-tracker-frontend:latest \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --port 8080
```

### Database Setup

#### Option 1: SQLite (Default)

SQLite works for small deployments but note:
- Data is stored in container filesystem
- Data persists between requests but not deployments
- Not recommended for production

```bash
DATABASE_URL="sqlite:///./prayer_tracker.db"
```

#### Option 2: Cloud SQL (PostgreSQL)

For production, use Cloud SQL:

1. **Create Cloud SQL Instance**:
   ```bash
   gcloud sql instances create prayer-tracker-db \
     --database-version=POSTGRES_15 \
     --tier=db-f1-micro \
     --region=us-central1
   ```

2. **Create Database**:
   ```bash
   gcloud sql databases create prayer_tracker \
     --instance=prayer-tracker-db
   ```

3. **Set Password**:
   ```bash
   gcloud sql users set-password postgres \
     --instance=prayer-tracker-db \
     --password=YOUR_SECURE_PASSWORD
   ```

4. **Get Connection String**:
   ```bash
   gcloud sql instances describe prayer-tracker-db \
     --format='value(connectionName)'
   ```

5. **Deploy with Cloud SQL**:
   ```bash
   gcloud run deploy prayer-tracker-api \
     --source ./backend \
     --add-cloudsql-instances=YOUR_CONNECTION_NAME \
     --set-env-vars DATABASE_URL="postgresql://postgres:PASSWORD@/prayer_tracker?host=/cloudsql/YOUR_CONNECTION_NAME" \
     --region us-central1
   ```

### Environment Variables

#### Backend Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `DATABASE_URL` | Database connection string | `sqlite:///./prayer_tracker.db` | No |
| `CORS_ORIGINS` | Comma-separated allowed origins | `http://localhost:5173,http://localhost:3000` | No |
| `PORT` | Server port (Cloud Run sets this) | `8000` | No |

Example:
```bash
gcloud run services update prayer-tracker-api \
  --set-env-vars DATABASE_URL="postgresql://user:pass@host/db" \
  --set-env-vars CORS_ORIGINS="https://your-frontend.run.app,https://custom-domain.com"
```

#### Frontend Build Arguments

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_API_URL` | Backend API URL | Yes |

Set during build:
```bash
docker build --build-arg VITE_API_URL=https://your-api.run.app ./frontend
```

### Post-Deployment

After deployment, update the backend CORS settings:

```bash
# Get frontend URL
FRONTEND_URL=$(gcloud run services describe prayer-tracker-frontend \
  --format='value(status.url)')

# Update backend CORS
gcloud run services update prayer-tracker-api \
  --set-env-vars CORS_ORIGINS="$FRONTEND_URL" \
  --region us-central1
```

## CI/CD with Cloud Build

### Setup Cloud Build Trigger

1. **Connect Repository**:
   - Go to Cloud Build > Triggers
   - Connect your GitHub/GitLab repository

2. **Create Trigger**:
   ```bash
   gcloud builds triggers create github \
     --repo-name=PrayerTracker \
     --repo-owner=YOUR_GITHUB_USERNAME \
     --branch-pattern="^main$" \
     --build-config=cloudbuild.yaml
   ```

3. **Configure Substitution Variables**:
   Edit `cloudbuild.yaml` and set:
   - `_REGION`: Your Cloud Run region
   - `_DATABASE_URL`: Your database URL
   - `_BACKEND_URL`: Your backend URL (after first deploy)

### Manual Build Trigger

```bash
gcloud builds submit \
  --config cloudbuild.yaml \
  --substitutions _REGION=us-central1,_DATABASE_URL=sqlite:///./prayer_tracker.db
```

## Custom Domain

To use a custom domain:

1. **Map domain to Cloud Run**:
   ```bash
   gcloud run domain-mappings create \
     --service prayer-tracker-frontend \
     --domain your-domain.com \
     --region us-central1
   ```

2. **Update DNS** records as shown in Cloud Console

3. **Update CORS** on backend:
   ```bash
   gcloud run services update prayer-tracker-api \
     --set-env-vars CORS_ORIGINS="https://your-domain.com"
   ```

## Monitoring and Logs

View logs:
```bash
# Backend logs
gcloud run services logs read prayer-tracker-api --limit 50

# Frontend logs
gcloud run services logs read prayer-tracker-frontend --limit 50

# Follow logs
gcloud run services logs tail prayer-tracker-api
```

## Cost Optimization

Cloud Run charges for:
- CPU and memory while handling requests
- Container storage in GCR
- Egress traffic

Tips:
- Set `--max-instances` to limit concurrent containers
- Use `--cpu-throttling` for cost savings
- Set `--min-instances=0` to scale to zero
- Use Cloud SQL only for production (f1-micro tier is cheapest)

## Troubleshooting

### Backend won't start
- Check logs: `gcloud run services logs read prayer-tracker-api`
- Verify DATABASE_URL format
- Ensure port 8000 is exposed

### Frontend can't connect to backend
- Verify VITE_API_URL was set during build
- Check CORS_ORIGINS includes frontend URL
- Use browser DevTools to check network requests

### Database connection errors
- Verify Cloud SQL connection string format
- Check Cloud SQL instance is running
- Ensure Cloud Run service has Cloud SQL client role

## Support

For issues, please check:
- [Google Cloud Run Documentation](https://cloud.google.com/run/docs)
- [Docker Documentation](https://docs.docker.com/)
- Project README.md
