import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User, UserStats } from "@/types";

interface AuthUser {
  id: string;
  phone?: string;
  email?: string;
}

interface AuthState {
  user: AuthUser | null;
  profile: User | null;
  stats: UserStats | null;
  isLoading: boolean;
  hasSeenOnboarding: boolean;

  setUser: (user: AuthUser | null) => void;
  setProfile: (profile: User | null) => void;
  setStats: (stats: UserStats | null) => void;
  setHasSeenOnboarding: (hasSeen: boolean) => void;
  logout: () => void;
  updatePoints: (points: number) => void;
  _hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
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
        const newTotal = Math.max(0, stats.total_xp + points);
        set({
          stats: {
            ...stats,
            total_xp: newTotal,
            last_submission_xp: points,
          },
        });
      },
      _hasHydrated: false,
      setHasHydrated: (state) => set({ _hasHydrated: state })
    }),
    {
      name: "namo-jinanam-auth",
      partialize: (state) => ({ user: state.user, profile: state.profile, stats: state.stats, hasSeenOnboarding: state.hasSeenOnboarding }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      }
    }
  )
);
