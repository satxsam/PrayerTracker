# Prayer Tracker

A full-stack web application for collecting and tracking prayer requests, built with Python (FastAPI) backend and React TypeScript frontend.

## Features

- Create and manage prayer requests
- Mark prayers as answered
- Categorize prayer requests (health, family, work, spiritual, financial, etc.)
- Private prayer option
- Clean, modern UI with responsive design
- RESTful API with full CRUD operations
- Flexible database backend (SQLite by default, easily swap to PostgreSQL/MySQL)

## Tech Stack

### Backend
- Python 3.11+
- FastAPI - Modern web framework
- SQLAlchemy - SQL toolkit and ORM
- Uvicorn - ASGI server
- uv - Python package manager
- Docker - Containerization

### Frontend
- React 18
- TypeScript
- Vite - Build tool and dev server
- Axios - HTTP client
- Nginx - Production web server

### Deployment
- Docker & Docker Compose
- Google Cloud Run
- Cloud SQL (optional)

## Project Structure

```
PrayerTracker/
├── backend/
│   ├── main.py          # FastAPI application
│   ├── models.py        # SQLAlchemy models
│   ├── schemas.py       # Pydantic schemas
│   ├── crud.py          # Database operations
│   ├── database.py      # Database configuration
│   ├── pyproject.toml   # Python dependencies
│   └── .env.example     # Environment variables template
├── frontend/
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── services/    # API client
│   │   ├── types/       # TypeScript types
│   │   ├── App.tsx      # Main application
│   │   └── main.tsx     # Entry point
│   ├── package.json     # Node dependencies
│   └── .env.example     # Environment variables template
└── README.md
```

## Getting Started

### Prerequisites

**For Local Development:**
- Python 3.11 or higher
- Node.js 18 or higher
- uv (Python package manager) - [Installation](https://github.com/astral-sh/uv)
- npm or yarn

**For Docker Deployment:**
- Docker 20.10+
- Docker Compose 2.0+

**For Cloud Run Deployment:**
- Google Cloud SDK (gcloud CLI)
- Docker
- Google Cloud Project with billing enabled

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies (uv will create a virtual environment automatically):
   ```bash
   uv sync
   ```

3. (Optional) Configure environment variables:
   ```bash
   cp .env.example .env
   # Edit .env to configure database URL if needed
   ```

4. Run the backend server:
   ```bash
   uv run python main.py
   ```

   Or with uvicorn directly:
   ```bash
   uv run uvicorn main:app --reload
   ```

   The API will be available at `http://localhost:8000`
   API documentation: `http://localhost:8000/docs`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. (Optional) Configure environment variables:
   ```bash
   cp .env.example .env
   # Edit .env if your backend is running on a different URL
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:5173`

## Docker Deployment

### Quick Start with Docker Compose

For local development with Docker:

```bash
# Development mode (with hot reload)
docker-compose -f docker-compose.dev.yml up

# Production mode (with PostgreSQL)
docker-compose up -d
```

Access the application:
- **Backend API**: http://localhost:8000
- **Frontend**: http://localhost:8080 (production) or http://localhost:5173 (dev)
- **API Docs**: http://localhost:8000/docs

### Building Individual Containers

Backend:
```bash
cd backend
docker build -t prayer-tracker-api .
docker run -p 8000:8000 prayer-tracker-api
```

Frontend:
```bash
cd frontend
docker build --build-arg VITE_API_URL=http://localhost:8000 -t prayer-tracker-frontend .
docker run -p 8080:8080 prayer-tracker-frontend
```

## Synology NAS Deployment

Deploy to your Synology NAS with persistent SQLite storage:

```bash
# Copy .env.synology.example to .env and configure your NAS IP
cp .env.synology.example .env

# Deploy using Docker Compose
docker-compose -f docker-compose.synology.yml up -d
```

Features:
- **Persistent SQLite database** stored on your NAS
- **Automatic restart** on NAS reboot
- **Low resource usage** (perfect for home NAS)
- **Easy backup** with Synology Hyper Backup

The database file will be stored at `/volume1/docker/prayer-tracker/data/prayer_tracker.db` on your NAS.

For detailed Synology deployment instructions, including Container Manager UI setup, see [SYNOLOGY-DEPLOYMENT.md](SYNOLOGY-DEPLOYMENT.md).

## Google Cloud Run Deployment

Deploy to Google Cloud Run with a single command:

```bash
# Set your project ID
export GCP_PROJECT_ID="your-project-id"
export GCP_REGION="us-central1"

# Deploy both backend and frontend
./deploy-all.sh
```

Or deploy individually:

```bash
# Deploy backend only
./deploy-backend.sh

# Deploy frontend (requires backend URL)
export BACKEND_URL="https://your-backend-url.run.app"
./deploy-frontend.sh
```

For detailed deployment instructions, database setup, CI/CD configuration, and troubleshooting, see [DEPLOYMENT.md](DEPLOYMENT.md).

## API Endpoints

- `GET /api/prayers` - Get all prayer requests
- `GET /api/prayers/{id}` - Get a specific prayer request
- `POST /api/prayers` - Create a new prayer request
- `PATCH /api/prayers/{id}` - Update a prayer request
- `DELETE /api/prayers/{id}` - Delete a prayer request

## Database Configuration

The application uses SQLite by default, which requires no additional setup. The database file will be created automatically at `backend/prayer_tracker.db`.

To use a different database (PostgreSQL, MySQL, etc.), set the `DATABASE_URL` environment variable in `backend/.env`:

```bash
# PostgreSQL
DATABASE_URL=postgresql://user:password@localhost/prayer_tracker

# MySQL
DATABASE_URL=mysql://user:password@localhost/prayer_tracker
```

## Building for Production

### Backend

The backend can be deployed to any platform that supports Python ASGI applications (Heroku, Railway, Render, etc.):

```bash
cd backend
uv run uvicorn main:app --host 0.0.0.0 --port $PORT
```

### Frontend

Build the frontend for production:

```bash
cd frontend
npm run build
```

The built files will be in the `frontend/dist` directory and can be served by any static file server.

## Contributing

Feel free to submit issues and pull requests!

## License

MIT
