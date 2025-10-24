import axios from 'axios';
import type { PrayerRequest, PrayerRequestCreate, PrayerRequestUpdate } from '../types/PrayerRequest';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const prayerRequestsApi = {
  getAll: async (includePrivate = false): Promise<PrayerRequest[]> => {
    const response = await api.get<PrayerRequest[]>('/api/prayers', {
      params: { include_private: includePrivate },
    });
    return response.data;
  },

  getById: async (id: number): Promise<PrayerRequest> => {
    const response = await api.get<PrayerRequest>(`/api/prayers/${id}`);
    return response.data;
  },

  create: async (prayer: PrayerRequestCreate): Promise<PrayerRequest> => {
    const response = await api.post<PrayerRequest>('/api/prayers', prayer);
    return response.data;
  },

  update: async (id: number, prayer: PrayerRequestUpdate): Promise<PrayerRequest> => {
    const response = await api.patch<PrayerRequest>(`/api/prayers/${id}`, prayer);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/api/prayers/${id}`);
  },

  markAsAnswered: async (id: number): Promise<PrayerRequest> => {
    const response = await api.patch<PrayerRequest>(`/api/prayers/${id}`, {
      is_answered: true,
    });
    return response.data;
  },
};

export default api;
