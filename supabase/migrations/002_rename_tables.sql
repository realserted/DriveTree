-- ============================================================
-- DriveTree — Rename tables with drivetree_ prefix
-- ============================================================

-- Rename tables
ALTER TABLE public.profiles RENAME TO drivetree_profiles;
ALTER TABLE public.connected_drives RENAME TO drivetree_connected_drives;
ALTER TABLE public.subscriptions RENAME TO drivetree_subscriptions;

-- Rename indexes
ALTER INDEX idx_connected_drives_user_id RENAME TO idx_drivetree_connected_drives_user_id;
ALTER INDEX idx_connected_drives_active RENAME TO idx_drivetree_connected_drives_active;
ALTER INDEX idx_subscriptions_user_id RENAME TO idx_drivetree_subscriptions_user_id;

-- Update the trigger function to use the new table name
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.drivetree_profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
