import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Question } from "@/types";
import { QUESTIONS } from "@/data/content";

interface HabitEntry {
  questionId: string;
  date: string;
  completed: boolean;
  completedAt?: string;
}

interface HabitState {
  entries: HabitEntry[];
  totalPointsToday: number;
  lastUpdated: string;

  toggleHabit: (questionId: string, date: string) => { completed: boolean; points: number };
  getEntryForDate: (questionId: string, date: string) => HabitEntry | undefined;
  getDayEntries: (date: string) => HabitEntry[];
  getDayCompletionPct: (date: string) => number;
  getDayPoints: (date: string) => number;
  isCompletedToday: (questionId: string) => boolean;
  resetDay: (date: string) => void;
}

function getTodayStr() {
  return new Date().toISOString().split("T")[0];
}

function getQuestion(id: string): Question | undefined {
  return QUESTIONS.find((q) => q.id === id);
}

const DAILY_QUESTIONS = QUESTIONS.filter((q) => q.type === "daily");

export const useHabitStore = create<HabitState>()(
  persist(
    (set, get) => ({
      entries: [],
      totalPointsToday: 0,
      lastUpdated: "",

      toggleHabit: (questionId, date) => {
        const { entries } = get();
        const existing = entries.find((e) => e.questionId === questionId && e.date === date);
        const question = getQuestion(questionId);
        const points = question?.points ?? 0;

        if (existing) {
          // Toggle off
          set({
            entries: entries.map((e) =>
              e.questionId === questionId && e.date === date
                ? { ...e, completed: !e.completed, completedAt: !e.completed ? new Date().toISOString() : undefined }
                : e
            ),
          });
          return { completed: !existing.completed, points: existing.completed ? -points : points };
        } else {
          // Create new entry
          const newEntry: HabitEntry = {
            questionId,
            date,
            completed: true,
            completedAt: new Date().toISOString(),
          };
          set({ entries: [...entries, newEntry], lastUpdated: date });
          return { completed: true, points };
        }
      },

      getEntryForDate: (questionId, date) => {
        return get().entries.find((e) => e.questionId === questionId && e.date === date);
      },

      getDayEntries: (date) => {
        return get().entries.filter((e) => e.date === date && e.completed);
      },

      getDayCompletionPct: (date) => {
        const dayEntries = get().entries.filter((e) => e.date === date && e.completed);
        return Math.round((dayEntries.length / DAILY_QUESTIONS.length) * 100);
      },

      getDayPoints: (date) => {
        const dayEntries = get().entries.filter((e) => e.date === date && e.completed);
        return dayEntries.reduce((acc, entry) => {
          const q = getQuestion(entry.questionId);
          return acc + (q?.points ?? 0);
        }, 0);
      },

      isCompletedToday: (questionId) => {
        const today = getTodayStr();
        const entry = get().entries.find((e) => e.questionId === questionId && e.date === today);
        return entry?.completed ?? false;
      },

      resetDay: (date) => {
        set({ entries: get().entries.filter((e) => e.date !== date) });
      },
    }),
    {
      name: "namo-jinanam-habits",
    }
  )
);
