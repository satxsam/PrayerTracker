import React from 'react';
import type { PrayerRequest } from '../types/PrayerRequest';
import PrayerRequestCard from './PrayerRequestCard';

interface PrayerRequestListProps {
  prayers: PrayerRequest[];
  onMarkAnswered: (id: number) => void;
  onDelete: (id: number) => void;
}

const PrayerRequestList: React.FC<PrayerRequestListProps> = ({ prayers, onMarkAnswered, onDelete }) => {
  const activePrayers = prayers.filter(p => !p.is_answered);
  const answeredPrayers = prayers.filter(p => p.is_answered);

  return (
    <div className="prayer-list">
      {activePrayers.length > 0 && (
        <div className="prayer-section">
          <h2>Active Prayer Requests ({activePrayers.length})</h2>
          <div className="prayer-grid">
            {activePrayers.map(prayer => (
              <PrayerRequestCard
                key={prayer.id}
                prayer={prayer}
                onMarkAnswered={onMarkAnswered}
                onDelete={onDelete}
              />
            ))}
          </div>
        </div>
      )}

      {answeredPrayers.length > 0 && (
        <div className="prayer-section">
          <h2>Answered Prayers ({answeredPrayers.length})</h2>
          <div className="prayer-grid">
            {answeredPrayers.map(prayer => (
              <PrayerRequestCard
                key={prayer.id}
                prayer={prayer}
                onMarkAnswered={onMarkAnswered}
                onDelete={onDelete}
              />
            ))}
          </div>
        </div>
      )}

      {prayers.length === 0 && (
        <div className="empty-state">
          <p>No prayer requests yet. Submit your first prayer request above!</p>
        </div>
      )}
    </div>
  );
};

export default PrayerRequestList;
