import { CATEGORIES } from "@/data/content";

export interface InspirationCategory {
  id: string;
  categoryId: string; // The ID matching the category in CATEGORIES
  multiplier: number;
  blessingHi: string;
  blessingEn: string;
  quoteHi: string;
  quoteEn: string;
}

// These are the 4 active daily category focuses for rotation.
export const INSPIRATION_TEMPLATES: InspirationCategory[] = [
  {
    id: "insp_morning",
    categoryId: "morning",
    multiplier: 1.5,
    blessingHi: "1.5× सुप्रभातम पुण्य",
    blessingEn: "1.5× Morning Punya",
    quoteHi: "प्रातः काल की शुरुआत संयम के साथ, दिन को सफल बनाती है।",
    quoteEn: "Starting the morning with discipline brings success to the day."
  },
  {
    id: "insp_food",
    categoryId: "food",
    multiplier: 2,
    blessingHi: "2× सात्विक आहार पुण्य",
    blessingEn: "Double Food Punya",
    quoteHi: "आहार की शुद्धि से विचारों और आत्मा की शुद्धि होती है।",
    quoteEn: "Purity of food supports purity of thoughts and soul."
  },
  {
    id: "insp_discipline",
    categoryId: "technology",
    multiplier: 2.5,
    blessingHi: "2.5× आत्म अनुशासन पुण्य",
    blessingEn: "2.5× Self Discipline Punya",
    quoteHi: "इंद्रिय संयम और आत्म-अनुशासन ही महानता का आधार है।",
    quoteEn: "Self discipline and control over senses is the pillar of greatness."
  },
  {
    id: "insp_spiritual",
    categoryId: "spiritual",
    multiplier: 2,
    blessingHi: "2× आध्यात्मिक भक्ति पुण्य",
    blessingEn: "Double Spiritual Punya",
    quoteHi: "प्रभु की भक्ति और स्वाध्याय ही आत्मा का सच्चा धन है।",
    quoteEn: "Devotion and Swadhyay are the true wealth of the soul."
  }
];

/**
 * Deterministically returns EXACTLY ONE category challenge for a given date string (YYYY-MM-DD).
 * Guarantees a rotation without repeats for the length of the array.
 */
export function getTodayInspiration(dateStr: string): InspirationCategory {
  // Ensure strict deterministic parsing of YYYY-MM-DD
  const parts = dateStr.split('-');
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const day = parseInt(parts[2], 10);
  
  const epochDay = Math.floor(Date.UTC(year, month, day) / 86400000);
  
  // Pick one category deterministically
  const index = epochDay % INSPIRATION_TEMPLATES.length;
  return INSPIRATION_TEMPLATES[index];
}
