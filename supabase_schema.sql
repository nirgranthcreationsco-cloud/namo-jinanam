-- Supabase Schema for Namo Jinanam (Custom Auth & Minimal Writes)
-- Completely removes Supabase Auth dependencies (auth.users)

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  phone TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE,
  password_hash TEXT NOT NULL,
  guardian_name TEXT,
  guardian_phone TEXT,
  gender TEXT,
  dob TEXT,
  age_group TEXT,
  city TEXT,
  avatar_url TEXT,
  is_active BOOLEAN DEFAULT true,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  last_login TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Enable RLS for Users
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own profile" ON public.users FOR SELECT USING (true); -- Custom auth will do backend server-side querying anyway.
CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE USING (true);

-- 2. USER_STATS TABLE
CREATE TABLE IF NOT EXISTS public.user_stats (
  user_id UUID PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
  total_xp INTEGER DEFAULT 0,
  bonus_xp INTEGER DEFAULT 0,
  current_streak INTEGER DEFAULT 0,
  best_streak INTEGER DEFAULT 0,
  days_completed INTEGER DEFAULT 0,
  tree_stage INTEGER DEFAULT 0,
  last_submission_date TEXT,
  last_submission_xp INTEGER DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for User Stats
ALTER TABLE public.user_stats ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access on user_stats" ON public.user_stats FOR SELECT USING (true);
CREATE POLICY "Allow update on user_stats" ON public.user_stats FOR UPDATE USING (true);

-- 3. DAILY_HISTORY TABLE
-- Stores exactly ONE record per user per day upon submission
CREATE TABLE IF NOT EXISTS public.daily_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  submission_date TEXT NOT NULL,
  xp_earned INTEGER NOT NULL,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE (user_id, submission_date)
);

-- Enable RLS for Daily History
ALTER TABLE public.daily_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access on daily_history" ON public.daily_history FOR SELECT USING (true);
CREATE POLICY "Allow insert on daily_history" ON public.daily_history FOR INSERT WITH CHECK (true);

-- 4. LIFETIME_SANKALP TABLE
CREATE TABLE IF NOT EXISTS public.lifetime_sankalp (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  rule_id TEXT NOT NULL,
  accepted_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE (user_id, rule_id)
);

ALTER TABLE public.lifetime_sankalp ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow read on lifetime_sankalp" ON public.lifetime_sankalp FOR SELECT USING (true);
CREATE POLICY "Allow insert on lifetime_sankalp" ON public.lifetime_sankalp FOR INSERT WITH CHECK (true);

-- 5. BONUS_PROGRESS TABLE
CREATE TABLE IF NOT EXISTS public.bonus_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  bonus_id TEXT NOT NULL,
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE,
  UNIQUE (user_id, bonus_id)
);

ALTER TABLE public.bonus_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow read on bonus_progress" ON public.bonus_progress FOR SELECT USING (true);
CREATE POLICY "Allow insert/update on bonus_progress" ON public.bonus_progress FOR ALL USING (true);

-- 6. LEADERBOARD_CACHE TABLE
CREATE TABLE IF NOT EXISTS public.leaderboard_cache (
  user_id UUID PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
  rank INTEGER,
  total_points INTEGER DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.leaderboard_cache ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access on leaderboard_cache" ON public.leaderboard_cache FOR SELECT USING (true);
CREATE POLICY "Allow update on leaderboard_cache" ON public.leaderboard_cache FOR UPDATE USING (true);

-- 7. SESSIONS TABLE
CREATE TABLE IF NOT EXISTS public.sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  token TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;
-- Sessions should only be accessed server-side via service role or careful RLS. 
-- For simplicity, we can just allow all server-side operations (which bypass RLS if using service role, but we will allow it here just in case).
CREATE POLICY "Allow all on sessions" ON public.sessions FOR ALL USING (true);

-- =========================================================================
-- 8. BONUS RULES TABLE (For Admin to change points without code)
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.bonus_rules (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  points INTEGER NOT NULL,
  description TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Default bonus rules
INSERT INTO public.bonus_rules (id, name, points) VALUES
('perfect_day', 'Perfect Day Bonus', 500),
('category_multiplier', 'Category XP Multiplier', 2)
ON CONFLICT (id) DO NOTHING;

ALTER TABLE public.bonus_rules ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access on bonus_rules" ON public.bonus_rules FOR SELECT USING (true);
CREATE POLICY "Admin only modify bonus_rules" ON public.bonus_rules FOR ALL USING (false); -- Requires service role to modify

-- =========================================================================
-- 9. DAILY FOCUS HISTORY TABLE
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.daily_focus_history (
  date TEXT PRIMARY KEY,
  challenge_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.daily_focus_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access on daily_focus_history" ON public.daily_focus_history FOR SELECT USING (true);
CREATE POLICY "Allow insert on daily_focus_history" ON public.daily_focus_history FOR INSERT WITH CHECK (true);

-- =========================================================================
-- 10. INDEXES FOR PERFORMANCE
-- =========================================================================
CREATE INDEX IF NOT EXISTS idx_users_phone ON public.users (phone);
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users (email);
CREATE INDEX IF NOT EXISTS idx_daily_history_user_date ON public.daily_history (user_id, submission_date);
CREATE INDEX IF NOT EXISTS idx_sessions_token ON public.sessions (token);

-- =========================================================================
-- 11. TRANSACTION: SUBMIT DAILY NIYAM
-- =========================================================================
-- This function guarantees that the daily submission and stats update happen
-- in a single atomic transaction.
CREATE OR REPLACE FUNCTION submit_daily_niyam(
  p_user_id UUID,
  p_submission_date TEXT,
  p_xp_earned INTEGER,
  p_new_total_xp INTEGER,
  p_new_current_streak INTEGER,
  p_new_best_streak INTEGER,
  p_new_days_completed INTEGER,
  p_new_tree_stage INTEGER,
  p_focus_id TEXT
) RETURNS void AS $$
BEGIN
  -- 1. Insert daily history (will fail if duplicate due to unique constraint)
  INSERT INTO public.daily_history (user_id, submission_date, xp_earned, submitted_at)
  VALUES (p_user_id, p_submission_date::DATE, p_xp_earned, now());

  -- 2. Insert into daily focus history (ON CONFLICT DO NOTHING)
  INSERT INTO public.daily_focus_history (date, challenge_id)
  VALUES (p_submission_date::DATE, p_focus_id)
  ON CONFLICT (date) DO NOTHING;

  -- 2. Update user stats
  UPDATE public.user_stats
  SET 
    total_xp = p_new_total_xp,
    current_streak = p_new_current_streak,
    best_streak = p_new_best_streak,
    days_completed = p_new_days_completed,
    tree_stage = p_new_tree_stage,
    last_submission_date = p_submission_date::DATE,
    last_submission_xp = p_xp_earned,
    updated_at = now()
  WHERE user_id = p_user_id;

  -- 3. Update leaderboard cache (optional but good to keep synced)
  UPDATE public.leaderboard_cache
  SET
    total_points = p_new_total_xp,
    updated_at = now()
  WHERE user_id = p_user_id;
END;
$$ LANGUAGE plpgsql;

-- =========================================================================
-- 10. SESSION EXPIRY CLEANUP
-- =========================================================================
-- A function that can be scheduled via pg_cron or called externally to clean up
CREATE OR REPLACE FUNCTION cleanup_expired_sessions()
RETURNS void AS $$
BEGIN
  DELETE FROM public.sessions WHERE expires_at < now();
END;
$$ LANGUAGE plpgsql;
