// =====================================================
// नमो जिनाणं — Core TypeScript Types
// =====================================================

export type AgeGroup = '6-12' | '13-23' | '24-40';
export type Gender = 'male' | 'female' | 'other';
export type UserRole = 'participant' | 'parent' | 'teacher' | 'coordinator' | 'admin' | 'super_admin';
export type QuestionType = 'daily' | 'bonus' | 'sankalp';
export type HabitStatus = 'completed' | 'partial' | 'missed' | 'pending';
export type LeaderboardFilter = 'global' | 'state' | 'city' | 'temple' | 'friends' | 'age_group';
export type LeaderboardPeriod = 'today' | 'week' | 'month' | 'overall';

export interface Temple {
  id: string;
  name: string;
  city: string;
  state: string;
  address?: string;
  phone?: string;
}

export interface Teacher {
  id: string;
  name: string;
  temple_id: string;
  phone?: string;
  email?: string;
}

export interface User {
  id: string;
  full_name: string;
  phone?: string;
  email?: string;
  guardian_name?: string;
  guardian_phone?: string;
  gender?: Gender;
  age_group?: AgeGroup;
  city?: string;
  is_active: boolean;
  joined_at: string;
  last_login?: string;
}

export interface Category {
  id: string;
  name_hi: string;
  name_en: string;
  icon: string;
  color: string;
  gradient: string;
  order: number;
  description_hi?: string;
}

export interface Question {
  id: string;
  category_id: string;
  title_hi: string;
  title_en: string;
  description_hi: string;
  description_en: string;
  points: number;
  icon: string;
  order: number;
  is_active: boolean;
  type: QuestionType;
  motivational_quote?: string;
  group_id?: string;
  input_type?: 'checkbox' | 'radio';
}

export interface DailyEntry {
  id: string;
  user_id: string;
  question_id: string;
  date: string;
  completed: boolean;
  notes?: string;
  points_earned: number;
}

export interface BonusAchievement {
  id: string;
  user_id: string;
  question_id: string;
  claimed_at: string;
  proof_url?: string;
}

export interface SankalpEntry {
  id: string;
  user_id: string;
  question_id: string;
  accepted_at: string;
  signature?: string;
}

export interface Badge {
  id: string;
  name_hi: string;
  name_en: string;
  description_hi: string;
  description_en: string;
  icon: string;
  color: string;
  condition_type: string;
  condition_value: number;
  is_rare: boolean;
}

export interface UserBadge {
  id: string;
  user_id: string;
  badge_id: string;
  earned_at: string;
  badge?: Badge;
}

export interface UserStats {
  user_id: string;
  total_xp: number;
  bonus_xp: number;
  current_streak: number;
  best_streak: number;
  days_completed: number;
  tree_stage: number;
  last_submission_date?: string;
  last_submission_xp: number;
  updated_at: string;
}

export interface LeaderboardEntry {
  user_id: string;
  rank: number;
  total_points: number;
  updated_at: string;
  user?: {
    full_name: string;
    city: string;
  };
}

export interface DayCalendar {
  date: string;
  status: HabitStatus;
  points: number;
  completion_pct: number;
  is_festival?: boolean;
  festival_name?: string;
}

export interface SignupFormData {
  full_name: string;
  guardian_name: string;
  guardian_phone?: string;
  gender: Gender;
  age_group: AgeGroup;
  phone?: string;
  email?: string;
  password?: string;
  city: string;
}

export interface CampaignSettings {
  id: string;
  name: string;
  name_hi: string;
  start_date: string;
  end_date: string;
  total_days: number;
  is_active: boolean;
}
