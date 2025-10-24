#!/bin/bash
set -e

# Configuration
PROJECT_ID=${GCP_PROJECT_ID:-"your-project-id"}
REGION=${GCP_REGION:-"us-central1"}

echo "========================================="
echo "Prayer Tracker - Full Deployment"
echo "========================================="
echo "Project: $PROJECT_ID"
echo "Region: $REGION"
echo ""

# Deploy backend first
echo "Step 1/2: Deploying Backend..."
echo "========================================="
./deploy-backend.sh

# Get backend URL
BACKEND_URL=$(gcloud run services describe prayer-tracker-api \
  --platform managed \
  --region $REGION \
  --project $PROJECT_ID \
  --format 'value(status.url)')

echo ""
echo "Backend deployed at: $BACKEND_URL"
echo ""

# Deploy frontend with backend URL
echo "Step 2/2: Deploying Frontend..."
echo "========================================="
BACKEND_URL=$BACKEND_URL ./deploy-frontend.sh

# Get frontend URL
FRONTEND_URL=$(gcloud run services describe prayer-tracker-frontend \
  --platform managed \
  --region $REGION \
  --project $PROJECT_ID \
  --format 'value(status.url)')

echo ""
echo "========================================="
echo "Deployment Complete!"
echo "========================================="
echo "Backend API: $BACKEND_URL"
echo "Frontend:    $FRONTEND_URL"
echo ""
echo "Don't forget to update CORS_ORIGINS on the backend:"
echo "gcloud run services update prayer-tracker-api \\"
echo "  --set-env-vars CORS_ORIGINS=$FRONTEND_URL \\"
echo "  --region $REGION \\"
echo "  --project $PROJECT_ID"
