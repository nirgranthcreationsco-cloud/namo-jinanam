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

export interface Profile {
  id: string;
  user_id: string;
  full_name: string;
  father_name: string;
  mother_name: string;
  gender: Gender;
  dob: string;
  age_group: AgeGroup;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  temple_id: string;
  teacher_id?: string;
  guardian_name?: string;
  photo_url?: string;
  role: UserRole;
  created_at: string;
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
  id: string;
  user_id: string;
  total_points: number;
  current_streak: number;
  longest_streak: number;
  best_streak?: number;
  completion_percentage: number;
  today_points: number;
  total_days_participated: number;
  badges: string[];
}

export interface LeaderboardEntry {
  rank: number;
  user_id: string;
  full_name: string;
  photo_url?: string;
  city: string;
  temple_name: string;
  total_points: number;
  current_streak: number;
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
  father_name: string;
  mother_name: string;
  gender: Gender;
  dob: string;
  age_group: AgeGroup;
  phone: string;
  email: string;
  password: string;
  address: string;
  city: string;
  state: string;
  temple_id: string;
  teacher_id?: string;
  guardian_name?: string;
  photo_url?: string;
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
