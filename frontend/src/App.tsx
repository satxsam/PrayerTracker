import { useState, useEffect } from 'react';
import './App.css';
import PrayerRequestForm from './components/PrayerRequestForm';
import PrayerRequestList from './components/PrayerRequestList';
import { prayerRequestsApi } from './services/api';
import type { PrayerRequest, PrayerRequestCreate } from './types/PrayerRequest';

function App() {
  const [prayers, setPrayers] = useState<PrayerRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    loadPrayers();
  }, []);

  const loadPrayers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await prayerRequestsApi.getAll();
      setPrayers(data);
    } catch (err) {
      setError('Failed to load prayer requests. Please make sure the backend server is running.');
      console.error('Error loading prayers:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (prayer: PrayerRequestCreate) => {
    try {
      setError(null);
      const newPrayer = await prayerRequestsApi.create(prayer);
      setPrayers(prev => [newPrayer, ...prev]);
      setShowForm(false);
    } catch (err) {
      setError('Failed to create prayer request. Please try again.');
      console.error('Error creating prayer:', err);
    }
  };

  const handleMarkAnswered = async (id: number) => {
    try {
      setError(null);
      const updatedPrayer = await prayerRequestsApi.markAsAnswered(id);
      setPrayers(prev =>
        prev.map(p => (p.id === id ? updatedPrayer : p))
      );
    } catch (err) {
      setError('Failed to mark prayer as answered. Please try again.');
      console.error('Error updating prayer:', err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this prayer request?')) {
      return;
    }

    try {
      setError(null);
      await prayerRequestsApi.delete(id);
      setPrayers(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      setError('Failed to delete prayer request. Please try again.');
      console.error('Error deleting prayer:', err);
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Prayer Tracker</h1>
        <p className="subtitle">Share your prayer requests and celebrate answered prayers</p>
      </header>

      <main className="app-main">
        {error && (
          <div className="alert alert-error">
            {error}
            <button onClick={() => setError(null)} className="alert-close">&times;</button>
          </div>
        )}

        <div className="form-section">
          {!showForm ? (
            <button onClick={() => setShowForm(true)} className="btn btn-primary btn-large">
              + New Prayer Request
            </button>
          ) : (
            <div className="form-container">
              <h2>Submit a Prayer Request</h2>
              <PrayerRequestForm
                onSubmit={handleSubmit}
                onCancel={() => setShowForm(false)}
              />
            </div>
          )}
        </div>

        {loading ? (
          <div className="loading">Loading prayer requests...</div>
        ) : (
          <PrayerRequestList
            prayers={prayers}
            onMarkAnswered={handleMarkAnswered}
            onDelete={handleDelete}
          />
        )}
      </main>

      <footer className="app-footer">
        <p>Prayer Tracker &copy; {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}

export default App;
