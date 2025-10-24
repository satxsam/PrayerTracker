export interface PrayerRequest {
  id: number;
  title: string;
  description?: string;
  requester_name: string;
  category?: string;
  is_answered: boolean;
  is_private: boolean;
  created_at: string;
  updated_at: string;
  answered_at?: string;
}

export interface PrayerRequestCreate {
  title: string;
  description?: string;
  requester_name: string;
  category?: string;
  is_private?: boolean;
}

export interface PrayerRequestUpdate {
  title?: string;
  description?: string;
  requester_name?: string;
  category?: string;
  is_answered?: boolean;
  is_private?: boolean;
}
