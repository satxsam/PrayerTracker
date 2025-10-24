from pydantic import BaseModel, ConfigDict
from datetime import datetime
from typing import Optional


class PrayerRequestBase(BaseModel):
    title: str
    description: Optional[str] = None
    requester_name: str
    category: Optional[str] = None
    is_private: bool = False


class PrayerRequestCreate(PrayerRequestBase):
    pass


class PrayerRequestUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    requester_name: Optional[str] = None
    category: Optional[str] = None
    is_answered: Optional[bool] = None
    is_private: Optional[bool] = None
    answered_at: Optional[datetime] = None


class PrayerRequest(PrayerRequestBase):
    id: int
    is_answered: bool
    created_at: datetime
    updated_at: datetime
    answered_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)
