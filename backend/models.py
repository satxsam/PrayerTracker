from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean
from datetime import datetime
from database import Base


class PrayerRequest(Base):
    __tablename__ = "prayer_requests"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)
    requester_name = Column(String(100), nullable=False)
    category = Column(String(50), nullable=True)
    is_answered = Column(Boolean, default=False)
    is_private = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    answered_at = Column(DateTime, nullable=True)

    def __repr__(self):
        return f"<PrayerRequest(id={self.id}, title='{self.title}', requester='{self.requester_name}')>"
