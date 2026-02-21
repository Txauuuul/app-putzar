// Database Types and Interfaces

export interface Accusation {
  id: string;
  user_id: string;
  accused_name: string;
  reason: string;
  created_at: string;
  updated_at: string;
}

export interface Photo {
  id: string;
  user_id: string;
  accusation_id?: string;
  photo_url: string;
  created_at: string;
}

export interface Settings {
  id: string;
  notifications_enabled: boolean;
  updated_at: string;
}

export interface AdminCredentials {
  pin: string;
}

// SQL Schema (for reference - execute in Supabase SQL Editor):

/*

-- Accusations table
CREATE TABLE IF NOT EXISTS accusations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  accused_name TEXT NOT NULL,
  reason TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Photos table
CREATE TABLE IF NOT EXISTS photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  accusation_id UUID REFERENCES accusations(id) ON DELETE CASCADE,
  photo_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Settings table (global)
CREATE TABLE IF NOT EXISTS settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  notifications_enabled BOOLEAN DEFAULT TRUE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX idx_accusations_user_id ON accusations(user_id);
CREATE INDEX idx_accusations_created_at ON accusations(created_at);
CREATE INDEX idx_photos_user_id ON photos(user_id);
CREATE INDEX idx_photos_accusation_id ON photos(accusation_id);

-- RLS Policies
ALTER TABLE accusations ENABLE ROW LEVEL SECURITY;
ALTER TABLE photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Users can only view their own accusations
CREATE POLICY "Users can view own accusations"
  ON accusations FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own accusations
CREATE POLICY "Users can insert own accusations"
  ON accusations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can only view their own photos
CREATE POLICY "Users can view own photos"
  ON photos FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own photos
CREATE POLICY "Users can insert own photos"
  ON photos FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Everyone can view settings
CREATE POLICY "Everyone can view settings"
  ON settings FOR SELECT
  USING (true);

-- Only admins can update settings (enforced via application logic)
CREATE POLICY "Settings are read-only from app"
  ON settings FOR UPDATE
  USING (false);

*/
