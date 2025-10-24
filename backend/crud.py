from sqlalchemy.orm import Session
from datetime import datetime
from typing import List, Optional
import models
import schemas


def get_prayer_request(db: Session, prayer_id: int) -> Optional[models.PrayerRequest]:
    """Get a single prayer request by ID"""
    return db.query(models.PrayerRequest).filter(models.PrayerRequest.id == prayer_id).first()


def get_prayer_requests(
    db: Session,
    skip: int = 0,
    limit: int = 100,
    include_private: bool = False
) -> List[models.PrayerRequest]:
    """Get all prayer requests with pagination"""
    query = db.query(models.PrayerRequest)

    if not include_private:
        query = query.filter(models.PrayerRequest.is_private == False)

    return query.offset(skip).limit(limit).all()


def create_prayer_request(db: Session, prayer: schemas.PrayerRequestCreate) -> models.PrayerRequest:
    """Create a new prayer request"""
    db_prayer = models.PrayerRequest(**prayer.model_dump())
    db.add(db_prayer)
    db.commit()
    db.refresh(db_prayer)
    return db_prayer


def update_prayer_request(
    db: Session,
    prayer_id: int,
    prayer_update: schemas.PrayerRequestUpdate
) -> Optional[models.PrayerRequest]:
    """Update an existing prayer request"""
    db_prayer = get_prayer_request(db, prayer_id)

    if db_prayer is None:
        return None

    update_data = prayer_update.model_dump(exclude_unset=True)

    # If marking as answered, set answered_at timestamp
    if update_data.get("is_answered") and not db_prayer.is_answered:
        update_data["answered_at"] = datetime.utcnow()

    for field, value in update_data.items():
        setattr(db_prayer, field, value)

    db.commit()
    db.refresh(db_prayer)
    return db_prayer


def delete_prayer_request(db: Session, prayer_id: int) -> bool:
    """Delete a prayer request"""
    db_prayer = get_prayer_request(db, prayer_id)

    if db_prayer is None:
        return False

    db.delete(db_prayer)
    db.commit()
    return True
