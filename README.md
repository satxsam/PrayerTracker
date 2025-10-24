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

### Frontend
- React 18
- TypeScript
- Vite - Build tool and dev server
- Axios - HTTP client

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

- Python 3.11 or higher
- Node.js 18 or higher
- uv (Python package manager) - [Installation](https://github.com/astral-sh/uv)
- npm or yarn

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
