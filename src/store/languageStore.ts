import { create } from "zustand";
import { persist } from "zustand/middleware";

interface LanguageState {
  language: "hi" | "en";
  setLanguage: (lang: "hi" | "en") => void;
  t: (hi: string, en: string) => string;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set, get) => ({
      language: "hi",
      setLanguage: (language) => set({ language }),
      t: (hi, en) => (get().language === "hi" ? hi : en),
    }),
    {
      name: "sanmati-sunilam-language",
    }
  )
);
