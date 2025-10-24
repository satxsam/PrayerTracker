#!/bin/bash
set -e

# Configuration
PROJECT_ID=${GCP_PROJECT_ID:-"your-project-id"}
REGION=${GCP_REGION:-"us-central1"}
SERVICE_NAME="prayer-tracker-api"
DATABASE_URL=${DATABASE_URL:-"sqlite:///./prayer_tracker.db"}

echo "Deploying Prayer Tracker Backend to Cloud Run..."
echo "Project: $PROJECT_ID"
echo "Region: $REGION"
echo "Service: $SERVICE_NAME"

# Build and deploy
gcloud run deploy $SERVICE_NAME \
  --source ./backend \
  --platform managed \
  --region $REGION \
  --project $PROJECT_ID \
  --allow-unauthenticated \
  --set-env-vars DATABASE_URL="$DATABASE_URL" \
  --set-env-vars CORS_ORIGINS="*" \
  --max-instances 10 \
  --memory 512Mi \
  --cpu 1 \
  --port 8000

echo ""
echo "Deployment complete!"
echo "Your API is available at:"
gcloud run services describe $SERVICE_NAME \
  --platform managed \
  --region $REGION \
  --project $PROJECT_ID \
  --format 'value(status.url)'
