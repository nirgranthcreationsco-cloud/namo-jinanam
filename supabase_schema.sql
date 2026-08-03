-- Supabase Schema for Namo Jinanam / Sanmati Sunilam Sanskar Abhiyan

-- 1. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  father_name TEXT,
  mother_name TEXT,
  email TEXT,
  phone TEXT,
  gender TEXT,
  age_group TEXT,
  dob TEXT,
  city TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for Profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access on profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Allow authenticated insert on profiles" ON public.profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow users to update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- 2. USER_STATS TABLE
CREATE TABLE IF NOT EXISTS public.user_stats (
  user_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  total_points INTEGER DEFAULT 0,
  current_streak INTEGER DEFAULT 0,
  best_streak INTEGER DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for User Stats
ALTER TABLE public.user_stats ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access on user_stats" ON public.user_stats FOR SELECT USING (true);
CREATE POLICY "Allow users to insert own stats" ON public.user_stats FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow users to update own stats" ON public.user_stats FOR UPDATE USING (true);

-- 3. HABIT_ENTRIES TABLE
CREATE TABLE IF NOT EXISTS public.habit_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  question_id TEXT NOT NULL,
  date TEXT NOT NULL,
  completed BOOLEAN DEFAULT true,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE (user_id, question_id, date)
);

-- Enable RLS for Habit Entries
ALTER TABLE public.habit_entries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access on habit_entries" ON public.habit_entries FOR SELECT USING (true);
CREATE POLICY "Allow users to insert/update habit_entries" ON public.habit_entries FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow users to update habit_entries" ON public.habit_entries FOR UPDATE USING (true);
