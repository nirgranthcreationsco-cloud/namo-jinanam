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

// These are the possible category focuses. We define them in an array to rotate through them.
export const INSPIRATION_TEMPLATES: InspirationCategory[] = [
  {
    id: "insp_food",
    categoryId: "food",
    multiplier: 2,
    blessingHi: "2× आहार पुण्य",
    blessingEn: "Double Food Punya",
    quoteHi: "आहार की शुद्धि से विचारों की शुद्धि होती है।",
    quoteEn: "Purity of food supports purity of thoughts."
  },
  {
    id: "insp_morning",
    categoryId: "morning",
    multiplier: 1.5,
    blessingHi: "1.5× प्रातः पुण्य",
    blessingEn: "1.5× Morning Punya",
    quoteHi: "प्रातः काल की शुरुआत संयम के साथ, दिन को सफल बनाती है।",
    quoteEn: "Starting the morning with discipline brings success to the day."
  },
  {
    id: "insp_tech",
    categoryId: "technology",
    multiplier: 2.5,
    blessingHi: "2.5× तकनीक संयम पुण्य",
    blessingEn: "2.5× Tech Discipline Punya",
    quoteHi: "स्क्रीन से दूरी, स्वयं से निकटता लाती है।",
    quoteEn: "Distance from the screen brings closeness to the self."
  },
  {
    id: "insp_spiritual",
    categoryId: "spiritual",
    multiplier: 2,
    blessingHi: "2× आध्यात्मिक पुण्य",
    blessingEn: "Double Spiritual Punya",
    quoteHi: "प्रभु की भक्ति और साधना ही आत्मा का सच्चा धन है।",
    quoteEn: "Devotion and sadhana are the true wealth of the soul."
  },
  {
    id: "insp_env",
    categoryId: "environment",
    multiplier: 1.75,
    blessingHi: "1.75× पर्यावरण पुण्य",
    blessingEn: "1.75× Environment Punya",
    quoteHi: "जीवों पर करुणा, जैन धर्म का मूलाधार है।",
    quoteEn: "Compassion towards all beings is the foundation of Jainism."
  },
  {
    id: "insp_lifestyle",
    categoryId: "lifestyle",
    multiplier: 1.5,
    blessingHi: "1.5× जीवनशैली पुण्य",
    blessingEn: "1.5× Lifestyle Punya",
    quoteHi: "सरल जीवन और सादगी से मन को शांति मिलती है।",
    quoteEn: "Simple living brings profound peace to the mind."
  },
  {
    id: "insp_memory",
    categoryId: "memory",
    multiplier: 2,
    blessingHi: "2× स्मृति पुण्य",
    blessingEn: "Double Memory Punya",
    quoteHi: "स्वाध्याय से अज्ञान मिटता है और ज्ञान का प्रकाश फैलता है।",
    quoteEn: "Swadhyay dispels ignorance and spreads the light of knowledge."
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
