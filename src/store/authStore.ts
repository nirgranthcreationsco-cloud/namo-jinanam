import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Profile, UserStats } from "@/types";
import { getLevelByXP } from "@/data/content";

interface AuthUser {
  id: string;
  email: string;
}

interface AuthState {
  user: AuthUser | null;
  profile: Profile | null;
  stats: UserStats | null;
  isLoading: boolean;

  setUser: (user: AuthUser | null) => void;
  setProfile: (profile: Profile | null) => void;
  setStats: (stats: UserStats | null) => void;
  logout: () => void;
  updatePoints: (points: number) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      profile: null,
      stats: null,
      isLoading: false,

      setUser: (user) => set({ user }),
      setProfile: (profile) => set({ profile }),
      setStats: (stats) => set({ stats }),

      logout: () =>
        set({ user: null, profile: null, stats: null }),

      updatePoints: (points) => {
        const stats = get().stats;
        if (!stats) return;
        const newTotal = Math.max(0, stats.total_points + points);
        const level = getLevelByXP(newTotal);
        set({
          stats: {
            ...stats,
            total_points: newTotal,
            today_points: Math.max(0, stats.today_points + points),
            level: level.level,
            level_name_hi: level.name_hi,
            level_name_en: level.name_en,
          },
        });
      },
    }),
    {
      name: "namo-jinanam-auth",
      partialize: (state) => ({ user: state.user, profile: state.profile, stats: state.stats }),
    }
  )
);
