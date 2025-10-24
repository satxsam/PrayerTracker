from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
import uvicorn

import models
import schemas
import crud
from database import engine, get_db

# Create database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Prayer Tracker API",
    description="API for managing prayer requests",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],  # Vite default port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    """Root endpoint"""
    return {"message": "Prayer Tracker API", "version": "1.0.0"}


@app.get("/api/prayers", response_model=List[schemas.PrayerRequest])
def get_prayers(
    skip: int = 0,
    limit: int = 100,
    include_private: bool = False,
    db: Session = Depends(get_db)
):
    """Get all prayer requests"""
    prayers = crud.get_prayer_requests(db, skip=skip, limit=limit, include_private=include_private)
    return prayers


@app.get("/api/prayers/{prayer_id}", response_model=schemas.PrayerRequest)
def get_prayer(prayer_id: int, db: Session = Depends(get_db)):
    """Get a specific prayer request by ID"""
    prayer = crud.get_prayer_request(db, prayer_id)
    if prayer is None:
        raise HTTPException(status_code=404, detail="Prayer request not found")
    return prayer


@app.post("/api/prayers", response_model=schemas.PrayerRequest, status_code=201)
def create_prayer(prayer: schemas.PrayerRequestCreate, db: Session = Depends(get_db)):
    """Create a new prayer request"""
    return crud.create_prayer_request(db, prayer)


@app.patch("/api/prayers/{prayer_id}", response_model=schemas.PrayerRequest)
def update_prayer(
    prayer_id: int,
    prayer_update: schemas.PrayerRequestUpdate,
    db: Session = Depends(get_db)
):
    """Update an existing prayer request"""
    prayer = crud.update_prayer_request(db, prayer_id, prayer_update)
    if prayer is None:
        raise HTTPException(status_code=404, detail="Prayer request not found")
    return prayer


@app.delete("/api/prayers/{prayer_id}", status_code=204)
def delete_prayer(prayer_id: int, db: Session = Depends(get_db)):
    """Delete a prayer request"""
    success = crud.delete_prayer_request(db, prayer_id)
    if not success:
        raise HTTPException(status_code=404, detail="Prayer request not found")
    return None


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
