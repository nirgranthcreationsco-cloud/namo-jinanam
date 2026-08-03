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
        const question = getQuestion(questionId);
        const points = question?.points ?? 0;

        let newEntries = [...entries];
        let netPoints = 0;

        // Handle radio logic: turn off other items in same group
        if (question?.input_type === 'radio' && question.group_id) {
          const otherRadios = QUESTIONS.filter(q => q.group_id === question.group_id && q.id !== questionId);
          for (const other of otherRadios) {
            const existingOtherIdx = newEntries.findIndex(e => e.questionId === other.id && e.date === date);
            if (existingOtherIdx >= 0 && newEntries[existingOtherIdx].completed) {
              newEntries[existingOtherIdx] = { ...newEntries[existingOtherIdx], completed: false, completedAt: undefined };
              netPoints -= (other.points ?? 0);
            }
          }
        }

        const existingIdx = newEntries.findIndex((e) => e.questionId === questionId && e.date === date);
        const existing = existingIdx >= 0 ? newEntries[existingIdx] : null;

        if (existing) {
          const isCompleting = !existing.completed;
          newEntries[existingIdx] = { 
            ...existing, 
            completed: isCompleting, 
            completedAt: isCompleting ? new Date().toISOString() : undefined 
          };
          netPoints += isCompleting ? points : -points;
          
          set({ entries: newEntries, lastUpdated: date });
          return { completed: isCompleting, points: netPoints };
        } else {
          const newEntry: HabitEntry = {
            questionId,
            date,
            completed: true,
            completedAt: new Date().toISOString(),
          };
          newEntries.push(newEntry);
          netPoints += points;
          set({ entries: newEntries, lastUpdated: date });
          return { completed: true, points: netPoints };
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
