# Docker Quick Start Guide

This guide will get you up and running with Docker in minutes.

## Quick Commands

### Development (Hot Reload + SQLite)

```bash
docker-compose -f docker-compose.dev.yml up
```

Access at:
- Frontend: http://localhost:5173
- Backend: http://localhost:8000
- API Docs: http://localhost:8000/docs

### Production (PostgreSQL)

```bash
docker-compose up -d
```

Access at:
- Frontend: http://localhost:8080
- Backend: http://localhost:8000
- PostgreSQL: localhost:5432

### Synology NAS (SQLite on NAS)

```bash
# Configure your NAS IP first
cp .env.synology.example .env
# Edit .env with your NAS IP address

# Deploy to Synology
docker-compose -f docker-compose.synology.yml up -d
```

Access at:
- Frontend: http://YOUR_NAS_IP:8080
- Backend: http://YOUR_NAS_IP:8000
- Database: Stored at /volume1/docker/prayer-tracker/data/

See [SYNOLOGY-DEPLOYMENT.md](SYNOLOGY-DEPLOYMENT.md) for detailed instructions.

## Common Tasks

### View logs
```bash
docker-compose logs -f
```

### Stop services
```bash
docker-compose down
```

### Rebuild after code changes
```bash
docker-compose up --build
```

### Reset database
```bash
docker-compose down -v  # Removes volumes
docker-compose up -d
```

## Individual Container Commands

### Backend Only
```bash
cd backend
docker build -t prayer-tracker-api .
docker run -p 8000:8000 -e DATABASE_URL=sqlite:///./prayer_tracker.db prayer-tracker-api
```

### Frontend Only
```bash
cd frontend
docker build --build-arg VITE_API_URL=http://localhost:8000 -t prayer-tracker-frontend .
docker run -p 8080:8080 prayer-tracker-frontend
```

## Troubleshooting

### Port already in use
```bash
# Find process using port 8000
lsof -i :8000
# Kill it or change port in docker-compose.yml
```

### Container won't start
```bash
# Check logs
docker-compose logs backend
docker-compose logs frontend

# Remove all containers and start fresh
docker-compose down
docker system prune -a
docker-compose up
```

### Database connection errors
```bash
# Wait for database to be ready
docker-compose logs db

# Restart services
docker-compose restart backend
```

## Environment Variables

Create `.env` file in project root:

```bash
# Backend
DATABASE_URL=postgresql://prayer_user:prayer_pass@db:5432/prayer_tracker
CORS_ORIGINS=http://localhost:5173,http://localhost:8080

# Frontend (set during build)
VITE_API_URL=http://localhost:8000
```

## Platform-Specific Guides

- **Synology NAS**: See [SYNOLOGY-DEPLOYMENT.md](SYNOLOGY-DEPLOYMENT.md)
- **Google Cloud Run**: See [DEPLOYMENT.md](DEPLOYMENT.md)
- **Local Development**: See [README.md](README.md)

## Database Locations

- **Development**: `backend/prayer_tracker.db` (in container)
- **Production**: PostgreSQL in Docker volume
- **Synology**: `/volume1/docker/prayer-tracker/data/prayer_tracker.db` (on NAS)
