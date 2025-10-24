import React, { useState } from 'react';
import type { PrayerRequestCreate } from '../types/PrayerRequest';

interface PrayerRequestFormProps {
  onSubmit: (prayer: PrayerRequestCreate) => void;
  onCancel?: () => void;
}

const PrayerRequestForm: React.FC<PrayerRequestFormProps> = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<PrayerRequestCreate>({
    title: '',
    description: '',
    requester_name: '',
    category: '',
    is_private: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      title: '',
      description: '',
      requester_name: '',
      category: '',
      is_private: false,
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="prayer-form">
      <div className="form-group">
        <label htmlFor="title">Prayer Title *</label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          placeholder="Enter a brief title"
        />
      </div>

      <div className="form-group">
        <label htmlFor="requester_name">Your Name *</label>
        <input
          type="text"
          id="requester_name"
          name="requester_name"
          value={formData.requester_name}
          onChange={handleChange}
          required
          placeholder="Your name"
        />
      </div>

      <div className="form-group">
        <label htmlFor="category">Category</label>
        <select
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
        >
          <option value="">Select a category</option>
          <option value="health">Health</option>
          <option value="family">Family</option>
          <option value="work">Work</option>
          <option value="spiritual">Spiritual Growth</option>
          <option value="financial">Financial</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={4}
          placeholder="Provide more details about your prayer request..."
        />
      </div>

      <div className="form-group checkbox-group">
        <label>
          <input
            type="checkbox"
            name="is_private"
            checked={formData.is_private}
            onChange={handleChange}
          />
          <span>Keep this request private</span>
        </label>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary">
          Submit Prayer Request
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} className="btn btn-secondary">
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default PrayerRequestForm;
