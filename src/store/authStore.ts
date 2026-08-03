import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Profile, UserStats } from "@/types";

interface AuthUser {
  id: string;
  email: string;
}

interface AuthState {
  user: AuthUser | null;
  profile: Profile | null;
  stats: UserStats | null;
  isLoading: boolean;
  hasSeenOnboarding: boolean;

  setUser: (user: AuthUser | null) => void;
  setProfile: (profile: Profile | null) => void;
  setStats: (stats: UserStats | null) => void;
  setHasSeenOnboarding: (hasSeen: boolean) => void;
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
      hasSeenOnboarding: false,

      setUser: (user) => set({ user }),
      setProfile: (profile) => set({ profile }),
      setStats: (stats) => set({ stats }),
      setHasSeenOnboarding: (hasSeenOnboarding) => set({ hasSeenOnboarding }),

      logout: () =>
        set({ user: null, profile: null, stats: null }),

      updatePoints: (points) => {
        const stats = get().stats;
        if (!stats) return;
        const newTotal = Math.max(0, stats.total_points + points);
        set({
          stats: {
            ...stats,
            total_points: newTotal,
            today_points: Math.max(0, stats.today_points + points),
          },
        });
      },
    }),
    {
      name: "namo-jinanam-auth",
      partialize: (state) => ({ user: state.user, profile: state.profile, stats: state.stats, hasSeenOnboarding: state.hasSeenOnboarding }),
    }
  )
);
