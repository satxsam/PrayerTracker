import React from 'react';
import type { PrayerRequest } from '../types/PrayerRequest';

interface PrayerRequestCardProps {
  prayer: PrayerRequest;
  onMarkAnswered: (id: number) => void;
  onDelete: (id: number) => void;
}

const PrayerRequestCard: React.FC<PrayerRequestCardProps> = ({ prayer, onMarkAnswered, onDelete }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className={`prayer-card ${prayer.is_answered ? 'answered' : ''} ${prayer.is_private ? 'private' : ''}`}>
      <div className="prayer-card-header">
        <h3>{prayer.title}</h3>
        <div className="prayer-badges">
          {prayer.category && (
            <span className="badge category-badge">{prayer.category}</span>
          )}
          {prayer.is_private && (
            <span className="badge private-badge">Private</span>
          )}
          {prayer.is_answered && (
            <span className="badge answered-badge">Answered</span>
          )}
        </div>
      </div>

      <div className="prayer-card-body">
        <p className="requester">Requested by: <strong>{prayer.requester_name}</strong></p>
        {prayer.description && (
          <p className="description">{prayer.description}</p>
        )}
        <p className="date">Created: {formatDate(prayer.created_at)}</p>
        {prayer.answered_at && (
          <p className="date answered-date">Answered: {formatDate(prayer.answered_at)}</p>
        )}
      </div>

      <div className="prayer-card-actions">
        {!prayer.is_answered && (
          <button
            onClick={() => onMarkAnswered(prayer.id)}
            className="btn btn-success"
          >
            Mark as Answered
          </button>
        )}
        <button
          onClick={() => onDelete(prayer.id)}
          className="btn btn-danger"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default PrayerRequestCard;
