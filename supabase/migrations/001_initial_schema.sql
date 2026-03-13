-- ============================================================
-- DriveTree — Initial Schema
-- ============================================================

-- 1. User profiles (extends Supabase auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Connected Google Drive accounts
CREATE TABLE public.connected_drives (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  google_email TEXT NOT NULL,
  access_token TEXT,
  refresh_token TEXT,
  token_expires_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT TRUE,
  connected_at TIMESTAMPTZ DEFAULT NOW(),
  last_synced_at TIMESTAMPTZ,
  UNIQUE(user_id, google_email)
);

-- 3. Subscriptions
CREATE TABLE public.subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL UNIQUE,
  plan TEXT DEFAULT 'early_access' CHECK (plan IN ('early_access', 'free', 'pro', 'team')),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'past_due', 'trialing')),
  price_cents INTEGER DEFAULT 100,
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- Row Level Security
-- ============================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.connected_drives ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- Profiles
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Connected Drives
CREATE POLICY "Users can view own drives"
  ON public.connected_drives FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own drives"
  ON public.connected_drives FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own drives"
  ON public.connected_drives FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own drives"
  ON public.connected_drives FOR DELETE
  USING (auth.uid() = user_id);

-- Subscriptions
CREATE POLICY "Users can view own subscription"
  ON public.subscriptions FOR SELECT
  USING (auth.uid() = user_id);

-- ============================================================
-- Trigger: auto-create profile on signup
-- ============================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- Indexes
-- ============================================================

CREATE INDEX idx_connected_drives_user_id ON public.connected_drives(user_id);
CREATE INDEX idx_connected_drives_active ON public.connected_drives(user_id, is_active);
CREATE INDEX idx_subscriptions_user_id ON public.subscriptions(user_id);
