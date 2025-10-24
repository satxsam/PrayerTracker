#!/bin/bash
set -e

# Configuration
PROJECT_ID=${GCP_PROJECT_ID:-"your-project-id"}
REGION=${GCP_REGION:-"us-central1"}
SERVICE_NAME="prayer-tracker-frontend"
BACKEND_URL=${BACKEND_URL}

if [ -z "$BACKEND_URL" ]; then
  echo "Error: BACKEND_URL environment variable is required"
  echo "Usage: BACKEND_URL=https://your-api-url.run.app ./deploy-frontend.sh"
  exit 1
fi

echo "Deploying Prayer Tracker Frontend to Cloud Run..."
echo "Project: $PROJECT_ID"
echo "Region: $REGION"
echo "Service: $SERVICE_NAME"
echo "Backend URL: $BACKEND_URL"

# Build Docker image with backend URL
docker build \
  --build-arg VITE_API_URL=$BACKEND_URL \
  -t gcr.io/$PROJECT_ID/$SERVICE_NAME:latest \
  ./frontend

# Push to Google Container Registry
docker push gcr.io/$PROJECT_ID/$SERVICE_NAME:latest

# Deploy to Cloud Run
gcloud run deploy $SERVICE_NAME \
  --image gcr.io/$PROJECT_ID/$SERVICE_NAME:latest \
  --platform managed \
  --region $REGION \
  --project $PROJECT_ID \
  --allow-unauthenticated \
  --max-instances 10 \
  --memory 256Mi \
  --cpu 1 \
  --port 8080

echo ""
echo "Deployment complete!"
echo "Your frontend is available at:"
gcloud run services describe $SERVICE_NAME \
  --platform managed \
  --region $REGION \
  --project $PROJECT_ID \
  --format 'value(status.url)'
