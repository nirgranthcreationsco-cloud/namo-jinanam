"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useHabitStore } from "@/store/habitStore";
import { useAuthStore } from "@/store/authStore";
import { useLanguageStore } from "@/store/languageStore";
import { QUESTIONS } from "@/data/content";
import type { Question } from "@/types";
import { IconResolver } from "@/components/IconResolver";
import { fetchAcceptedSankalps, acceptSankalpAction } from "@/app/actions/sankalp";
import { getISTDateString } from "@/lib/date";
import { 
  Sparkles, Lock, CheckCircle2, Search, ChevronDown, ChevronUp, 
  ShieldCheck, Heart, Landmark, Flower2, Award, Sun, Sunrise, Crown
} from "lucide-react";

// Categorize sankalps logically into meaningful spiritual categories
const CATEGORIES: { id: string; name_hi: string; name_en: string; ids: string[] }[] = [
  {
    id: "digital",
    name_hi: "डिजिटल एवं मनोरंजन संयम",
    name_en: "Digital & Entertainment Discipline",
    ids: ["q_sankalp_01", "q_sankalp_04"]
  },
  {
    id: "family",
    name_hi: "परिवार एवं संस्कार",
    name_en: "Family & Ethical Values",
    ids: ["q_sankalp_02", "q_sankalp_03", "q_sankalp_03b", "q_sankalp_06", "q_sankalp_07", "q_sankalp_14"]
  },
  {
    id: "spiritual",
    name_hi: "साधना एवं देव-शास्त्र-गुरु भक्ति",
    name_en: "Spiritual Practice & Devotion",
    ids: ["q_sankalp_05", "q_sankalp_09"]
  },
  {
    id: "lifestyle",
    name_hi: "आहार एवं आचरण शुद्धि",
    name_en: "Food & Conduct Purity",
    ids: ["q_sankalp_08", "q_sankalp_10", "q_sankalp_11", "q_sankalp_12", "q_sankalp_13"]
  }
];

const CHATURMAS_CATEGORIES: { id: string; name_hi: string; name_en: string; ids: string[] }[] = [
  {
    id: "diet_conduct",
    name_hi: "आहार एवं आचरण शुद्धि",
    name_en: "Diet & Conduct Purity",
    ids: [
      "q_chaturmas_bonus_01",
      "q_chaturmas_bonus_02",
      "q_chaturmas_bonus_03",
      "q_chaturmas_bonus_06",
      "q_chaturmas_bonus_12",
      "q_chaturmas_bonus_13",
      "q_chaturmas_bonus_14"
    ]
  },
  {
    id: "knowledge_devotion",
    name_hi: "ज्ञान, स्वाध्याय एवं भक्ति",
    name_en: "Knowledge, Swadhyay & Devotion",
    ids: [
      "q_chaturmas_bonus_04",
      "q_chaturmas_bonus_05",
      "q_chaturmas_bonus_07",
      "q_chaturmas_bonus_15"
    ]
  },
  {
    id: "discipline_moderation",
    name_hi: "संयम एवं इन्द्रिय नियंत्रण",
    name_en: "Discipline & Moderation",
    ids: [
      "q_chaturmas_bonus_08",
      "q_chaturmas_bonus_09",
      "q_chaturmas_bonus_10",
      "q_chaturmas_bonus_11"
    ]
  }
];

export default function SankalpPage() {
  const { language } = useLanguageStore();
  const { user, stats, setStats } = useAuthStore();
  const { toggleHabit, getEntryForDate } = useHabitStore();

  const [acceptedMap, setAcceptedMap] = useState<Record<string, string>>({}); // rule_id -> accepted_at
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sankalpToConfirm, setSankalpToConfirm] = useState<Question | null>(null);
  const [acceptedToast, setAcceptedToast] = useState<string | null>(null);
  const [collapsedCats, setCollapsedCats] = useState<Record<string, boolean>>({});

  // Daily changing inspirational quote for the top hero card
  const dailyQuote = useMemo(() => {
    const quotes = [
      {
        en: "A promise made to yourself is the first step toward transformation.",
        hi: "स्वयं से की गई प्रतिज्ञा आत्म-रूपांतरण का प्रथम चरण है।"
      },
      {
        en: "Great journeys begin with a single sincere commitment.",
        hi: "महान यात्राओं का प्रारंभ एक सच्चे संकल्प से होता है।"
      },
      {
        en: "Discipline is the quiet bridge between your vows and spiritual growth.",
        hi: "संयम ही संकल्प और साधना के बीच का पवित्र पथ है।"
      },
      {
        en: "Awareness transforms every small habit into sacred Sadhana.",
        hi: "जागरूकता ही साधारण नियम को पवित्र साधना बनाती है।"
      },
      {
        en: "Purity of intention transforms small actions into sacred achievements.",
        hi: "मंशा की पवित्रता ही छोटे प्रयासों को महान साधना बनाती है।"
      }
    ];
    const todayStr = getISTDateString();
    const parts = todayStr.split('-');
    const epochDay = Math.floor(Date.UTC(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10)) / 86400000);
    return quotes[epochDay % quotes.length];
  }, []);

  // All Sankalps (includes Lifetime and Chaturmas bonus commitments)
  const allSankalps = useMemo(() => {
    return QUESTIONS.filter(
      (q) => 
        q.category_id === "sankalp" || 
        q.type === "sankalp" || 
        q.category_id === "bonus" || 
        q.type === "bonus"
    );
  }, []);

  const [activeTab, setActiveTab] = useState<"lifetime" | "chaturmas">("lifetime");

  // Fetch accepted sankalps on mount from Supabase
  useEffect(() => {
    const loadAccepted = async () => {
      setLoading(true);
      const res = await fetchAcceptedSankalps();
      const map: Record<string, string> = {};
      
      if (res.success && res.data) {
        res.data.forEach((row: any) => {
          map[row.rule_id] = row.accepted_at;
        });
      }
      
      // Also merge with local store entries for immediate offline availability
      allSankalps.forEach((q) => {
        const entry = getEntryForDate(q.id, "lifetime_sankalp");
        if (entry?.completed && !map[q.id]) {
          map[q.id] = entry.completedAt || new Date().toISOString();
        }
      });

      setAcceptedMap(map);
      setLoading(false);
    };

    loadAccepted();
  }, [allSankalps, getEntryForDate]);

  const acceptedCount = Object.keys(acceptedMap).length;
  const totalCount = allSankalps.length;
  const remainingCount = Math.max(0, totalCount - acceptedCount);

  // Filtered by search
  const filteredSankalps = useMemo(() => {
    if (!searchQuery.trim()) return allSankalps;
    const q = searchQuery.toLowerCase();
    return allSankalps.filter(
      (item) =>
        item.title_hi.toLowerCase().includes(q) ||
        item.title_en.toLowerCase().includes(q) ||
        item.description_hi.toLowerCase().includes(q) ||
        item.description_en.toLowerCase().includes(q)
    );
  }, [allSankalps, searchQuery]);

  const handleConfirmAccept = async () => {
    if (!sankalpToConfirm) return;
    const target = sankalpToConfirm;
    setSankalpToConfirm(null);

    // Optimistic local state update
    const nowIso = new Date().toISOString();
    setAcceptedMap((prev) => ({ ...prev, [target.id]: nowIso }));
    
    // Update local habitStore
    toggleHabit(target.id, "lifetime_sankalp");

    // Show confirmation success message
    setAcceptedToast(
      language === "hi"
        ? "🌸 आपका संकल्प स्वीकार हो गया है। ईश्वर आपको आपकी यात्रा में स्थिर रहने का बल दें।"
        : "🌸 Your Sankalp has been accepted. May you remain steadfast throughout your journey."
    );
    setTimeout(() => setAcceptedToast(null), 6000);

    // Call server action
    const res = await acceptSankalpAction(target.id, target.points);
    if (res.success && res.newTotalXp !== undefined && stats) {
      setStats({
        ...stats,
        total_xp: res.newTotalXp,
        updated_at: new Date().toISOString()
      });
    }
  };

  const toggleCategory = (catId: string) => {
    setCollapsedCats((prev) => ({ ...prev, [catId]: !prev[catId] }));
  };

  const formatDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString(language === "hi" ? "hi-IN" : "en-US", {
        day: "numeric",
        month: "long",
        year: "numeric"
      });
    } catch {
      return isoString;
    }
  };

  return (
    <div className="page" style={{ padding: "20px 16px 120px", background: "linear-gradient(180deg, #FDFCFB 0%, #F4ECE1 100%)", minHeight: "100dvh" }}>
      
      {/* 🌸 Success Banner Toast 🌸 */}
      <AnimatePresence>
        {acceptedToast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            style={{
              position: "fixed", top: "80px", left: "16px", right: "16px", zIndex: 1000,
              background: "linear-gradient(135deg, #15803D 0%, #166534 100%)",
              color: "white", padding: "16px 20px", borderRadius: "16px",
              boxShadow: "0 10px 30px rgba(22,101,52,0.3)",
              border: "1px solid rgba(255,255,255,0.2)",
              display: "flex", alignItems: "center", gap: "12px"
            }}
          >
            <Sparkles size={24} color="#FDE047" style={{ flexShrink: 0 }} />
            <div className="font-devanagari" style={{ fontSize: "0.875rem", lineHeight: 1.4, fontWeight: 600 }}>
              {acceptedToast}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🪷 Confirmation Modal 🪷 */}
      <AnimatePresence>
        {sankalpToConfirm && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(15, 12, 10, 0.75)", backdropFilter: "blur(12px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 10000, padding: "20px" }}>
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              style={{
                maxWidth: "420px", width: "100%",
                background: "#FAF7F2",
                padding: "28px 24px",
                border: "2px solid var(--gold)",
                borderRadius: "24px",
                boxShadow: "0 20px 40px rgba(0,0,0,0.2)"
              }}
            >
              <div style={{ textAlign: "center", marginBottom: "16px" }}>
                <div style={{ width: "56px", height: "56px", borderRadius: "50%", background: "var(--gold-dim)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
                  <Flower2 size={28} color="var(--gold)" />
                </div>
                <h3 className="font-devanagari" style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--text-primary)" }}>
                  {language === "hi" ? "🪷 आजीवन संकल्प प्रतिज्ञा" : "🪷 Take Lifetime Sankalp"}
                </h3>
              </div>

              <div className="font-devanagari" style={{ background: "rgba(217, 119, 6, 0.08)", padding: "16px", borderRadius: "14px", borderLeft: "4px solid var(--gold)", marginBottom: "20px" }}>
                <p style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--text-primary)" }}>
                  {language === "hi" ? sankalpToConfirm.title_hi : sankalpToConfirm.title_en}
                </p>
                <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginTop: "4px" }}>
                  {language === "hi" ? sankalpToConfirm.description_hi : sankalpToConfirm.description_en}
                </p>
              </div>

              <p className="font-devanagari" style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "24px", lineHeight: 1.6, textAlign: "center" }}>
                {language === "hi" 
                  ? "आप एक व्यक्तिगत और अटूट प्रतिज्ञा ले रहे हैं। इस संकल्प को तभी स्वीकार करें जब आप इसे जीवनभर निभाने के प्रति पूर्णतः निष्ठावान हों। एक बार स्वीकार करने के बाद इसे बदला या हटाया नहीं जा सकता।"
                  : "You are making a personal commitment. This promise should only be accepted if you sincerely intend to follow it. Once accepted, this Sankalp cannot be modified."
                }
              </p>

              <div style={{ display: "flex", gap: "12px" }}>
                <button 
                  className="btn font-devanagari" 
                  style={{ flex: 1, padding: "12px", background: "var(--surface-raised)", border: "1px solid var(--surface-border)", color: "var(--text-primary)", borderRadius: "12px", fontWeight: 600 }} 
                  onClick={() => setSankalpToConfirm(null)}
                >
                  {language === "hi" ? "रद्द करें" : "Cancel"}
                </button>
                <button 
                  className="btn font-devanagari" 
                  style={{ flex: 1.4, padding: "12px", background: "linear-gradient(135deg, var(--brand) 0%, #8A2B1A 100%)", color: "white", border: "none", borderRadius: "12px", fontWeight: 700, boxShadow: "0 4px 14px rgba(138,43,26,0.3)" }} 
                  onClick={handleConfirmAccept}
                >
                  {language === "hi" ? "संकल्प स्वीकार करें" : "I Accept This Sankalp"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Sacred Introduction Hero Card (Apple Glassmorphism Style) ── */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }} 
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        style={{
          background: "linear-gradient(150deg, #2D1500 0%, #4D230B 50%, #1F0D02 100%)",
          borderRadius: "28px",
          padding: "32px 24px",
          color: "white",
          boxShadow: "0 20px 48px rgba(45, 21, 0, 0.3)",
          border: "1px solid rgba(245, 158, 11, 0.3)",
          marginBottom: "24px",
          position: "relative",
          overflow: "hidden"
        }}
      >
        {/* Background Ambient Glow & Icon */}
        <div style={{ position: "absolute", top: -40, right: -40, opacity: 0.06, pointerEvents: "none" }}>
          <Landmark size={240} color="white" />
        </div>
        <div style={{
          position: "absolute",
          top: "10%",
          left: "5%",
          width: "250px",
          height: "250px",
          background: "radial-gradient(circle, rgba(245, 158, 11, 0.15) 0%, rgba(0,0,0,0) 70%)",
          pointerEvents: "none",
          filter: "blur(40px)"
        }} />

        <div style={{ position: "relative", zIndex: 1 }}>
          
          {/* ⭐ Top Daily Inspirational Quote Badge ⭐ */}
          <div style={{ textAlign: "center", marginBottom: "20px" }}>
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "8px 16px",
                borderRadius: "30px",
                background: "rgba(245, 158, 11, 0.15)",
                border: "1px solid rgba(245, 158, 11, 0.35)",
                color: "#FDE68A",
                fontSize: "0.8125rem",
                fontWeight: 600,
                boxShadow: "0 4px 12px rgba(0,0,0,0.2)"
              }}
            >
              <Sparkles size={14} color="#F59E0B" />
              <span className="font-devanagari">"{language === "hi" ? dailyQuote.hi : dailyQuote.en}"</span>
            </motion.div>
          </div>

          {/* Hero Header */}
          <div style={{ textAlign: "center", marginBottom: "24px" }}>
            <div style={{ 
              width: "52px", height: "52px", borderRadius: "50%", 
              background: "linear-gradient(135deg, rgba(245, 158, 11, 0.25) 0%, rgba(255, 255, 255, 0.05) 100%)", 
              display: "flex", alignItems: "center", justifyContent: "center", 
              margin: "0 auto 14px", border: "1px solid rgba(245, 158, 11, 0.4)",
              boxShadow: "0 8px 20px rgba(0,0,0,0.2)"
            }}>
              <Flower2 size={26} color="var(--gold)" />
            </div>

            <h1 className="heading-xl font-devanagari" style={{ color: "#FFFDF9", marginBottom: "10px", fontSize: "1.625rem" }}>
              {language === "hi" ? "🪷 आजीवन एवं चातुर्मास संकल्प" : "🪷 Lifetime & Chaturmas Sankalp"}
            </h1>
            
            <p className="font-devanagari" style={{ opacity: 0.9, fontSize: "0.9rem", lineHeight: 1.6, maxWidth: "420px", margin: "0 auto", color: "#FCE7D0" }}>
              {language === "hi"
                ? "“संकल्प विवेक और भक्ति के साथ ली गई एक पावन प्रतिज्ञा है। यह केवल पूरा करने वाला टास्क नहीं, बल्कि जीने का एक मार्ग है।”"
                : "“A Sankalp is a sincere promise made with awareness and devotion. It is not a task to complete, but a commitment to live by.”"
              }
            </p>
          </div>

          {/* Divider */}
          <div style={{ height: "1px", background: "linear-gradient(90deg, transparent 0%, rgba(245, 158, 11, 0.3) 50%, transparent 100%)", margin: "24px 0" }} />

          {/* 🌸 Section: Understanding Sankalp 🌸 */}
          <div style={{ marginBottom: "28px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
              <Flower2 size={18} color="var(--gold)" />
              <h2 className="font-devanagari" style={{ fontSize: "1.0625rem", fontWeight: 700, color: "#FDE68A" }}>
                {language === "hi" ? "🌸 संकल्प को समझें" : "🌸 Understanding Sankalp"}
              </h2>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {[
                {
                  en: "Accept only those Sankalps that you genuinely intend to follow.",
                  hi: "केवल उन्हीं संकल्पों को स्वीकार करें जिन्हें आप सच्चे मन से निभाना चाहते हैं।",
                  icon: Heart,
                  color: "#F43F5E"
                },
                {
                  en: "Once accepted, a Sankalp becomes a permanent commitment.",
                  hi: "एक बार स्वीकार करने के बाद, संकल्प एक स्थायी प्रतिबद्धता बन जाता है।",
                  icon: Lock,
                  color: "#F59E0B"
                },
                {
                  en: "Complete your Daily Niyams to receive daily bonus points as blessings.",
                  hi: "दैनिक नियम पूरे करने पर उस दिन के बोनस पुण्य अंक (Bonus Points) प्राप्त होंगे।",
                  icon: Sparkles,
                  color: "#10B981"
                },
                {
                  en: "If you miss tracking your Niyams on any day, that day's bonus points will not be added.",
                  hi: "यदि आप किसी दिन नियम ट्रैक करना भूल जाते हैं, तो उस दिन के बोनस अंक नहीं जोड़े जाएंगे।",
                  icon: Sun,
                  color: "#3B82F6"
                }
              ].map((rule, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 + idx * 0.08 }}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "12px",
                    padding: "12px 14px",
                    borderRadius: "14px",
                    background: "rgba(255, 255, 255, 0.05)",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    backdropFilter: "blur(10px)"
                  }}
                >
                  <div style={{
                    width: "28px", height: "28px", borderRadius: "8px",
                    background: `${rule.color}20`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0, marginTop: "2px"
                  }}>
                    <CheckCircle2 size={16} color={rule.color} />
                  </div>
                  <div className="font-devanagari" style={{ fontSize: "0.875rem", color: "#F3F4F6", lineHeight: 1.5, fontWeight: 500 }}>
                    {language === "hi" ? rule.hi : rule.en}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* 🌸 Section: Journey Timeline 🌸 */}
          <div style={{ marginBottom: "28px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
              <Crown size={18} color="var(--gold)" />
              <h2 className="font-devanagari" style={{ fontSize: "1.0625rem", fontWeight: 700, color: "#FDE68A" }}>
                {language === "hi" ? "🌸 यात्रा का क्रम (Journey Overview)" : "🌸 Journey Overview"}
              </h2>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
              {[
                {
                  step: "1",
                  titleHi: "संकल्प स्वीकार करें",
                  titleEn: "Accept Sankalp",
                  icon: Flower2,
                  color: "#F59E0B"
                },
                {
                  step: "2",
                  titleHi: "दैनिक बोनस अंक पाएं",
                  titleEn: "Receive Daily Bonus Points",
                  icon: Sparkles,
                  color: "#10B981"
                },
                {
                  step: "3",
                  titleHi: "60-दिवसीय यात्रा",
                  titleEn: "60-Day Journey",
                  icon: Sunrise,
                  color: "#3B82F6"
                },
                {
                  step: "4",
                  titleHi: "अभियान पूर्णता",
                  titleEn: "Complete Campaign",
                  icon: Award,
                  color: "#8B5CF6"
                }
              ].map((stepItem, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + idx * 0.08 }}
                  style={{
                    padding: "14px 12px",
                    borderRadius: "16px",
                    background: "rgba(0, 0, 0, 0.25)",
                    border: "1px solid rgba(245, 158, 11, 0.2)",
                    textAlign: "center",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "6px"
                  }}
                >
                  <div style={{
                    width: "32px", height: "32px", borderRadius: "10px",
                    background: `${stepItem.color}25`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: stepItem.color
                  }}>
                    <stepItem.icon size={18} />
                  </div>
                  <div className="font-devanagari" style={{ fontSize: "0.8125rem", fontWeight: 700, color: "#FFFDF9" }}>
                    {language === "hi" ? stepItem.titleHi : stepItem.titleEn}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Highlighted Bottom Info Banner */}
          <div style={{
            background: "linear-gradient(135deg, rgba(245, 158, 11, 0.18) 0%, rgba(217, 119, 6, 0.08) 100%)",
            borderLeft: "4px solid var(--gold)",
            borderRadius: "0 16px 16px 0",
            padding: "14px 16px",
            display: "flex",
            alignItems: "flex-start",
            gap: "10px"
          }}>
            <Flower2 size={18} color="var(--gold)" style={{ flexShrink: 0, marginTop: "2px" }} />
            <p className="font-devanagari" style={{ fontSize: "0.8125rem", color: "#FCE7D0", lineHeight: 1.5, margin: 0, fontWeight: 500 }}>
              {language === "hi"
                ? "“संकल्प का आशीर्वाद संपूर्ण अभियान के दौरान आपकी दैनिक साधना का संबल बनता है। प्रतिदिन अपने नियम पूरे करने पर बोनस अंक हर दिन जोड़े जाते हैं।”"
                : "“The blessings of a Sankalp accompany your daily journey throughout the campaign. By completing your Daily Niyams, bonus points are awarded every day rather than all at once.”"
              }
            </p>
          </div>

        </div>
      </motion.div>

      {/* ── Active Blessings Summary Counter ── */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        style={{
          background: "rgba(255,255,255,0.85)",
          backdropFilter: "blur(16px)",
          borderRadius: "20px",
          padding: "16px 20px",
          border: "1px solid var(--surface-border)",
          boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
          marginBottom: "24px"
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-around", alignItems: "center" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--gold)", fontFamily: "var(--font-sans)", lineHeight: 1 }}>{acceptedCount}</div>
            <div className="font-devanagari" style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700, marginTop: "4px" }}>
              {language === "hi" ? "स्वीकृत संकल्प" : "Accepted"}
            </div>
          </div>
          <div style={{ width: "1px", height: "32px", background: "var(--surface-border)" }} />
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--text-primary)", fontFamily: "var(--font-sans)", lineHeight: 1 }}>{remainingCount}</div>
            <div className="font-devanagari" style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700, marginTop: "4px" }}>
              {language === "hi" ? "शेष संकल्प" : "Remaining"}
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── Search Bar ── */}
      <div style={{ marginBottom: "20px" }}>
        <div style={{ position: "relative" }}>
          <Search size={18} color="var(--text-muted)" style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)" }} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={language === "hi" ? "संकल्प खोजें..." : "Search Sankalp..."}
            className="font-devanagari"
            style={{
              width: "100%",
              padding: "12px 16px 12px 42px",
              borderRadius: "14px",
              background: "rgba(255,255,255,0.8)",
              border: "1px solid var(--surface-border)",
              fontSize: "0.9rem",
              outline: "none",
              boxShadow: "0 2px 8px rgba(0,0,0,0.02)"
            }}
          />
        </div>
      </div>

      {/* ── Segmented Tab Selector (Apple Style) ── */}
      <div style={{
        background: "rgba(255, 255, 255, 0.6)",
        borderRadius: "14px",
        padding: "4px",
        display: "flex",
        marginBottom: "20px",
        border: "1px solid var(--surface-border)",
        backdropFilter: "blur(8px)"
      }}>
        <button
          onClick={() => setActiveTab("lifetime")}
          style={{
            flex: 1,
            padding: "10px 12px",
            borderRadius: "10px",
            border: "none",
            background: activeTab === "lifetime" ? "#ffffff" : "transparent",
            color: activeTab === "lifetime" ? "var(--text-primary)" : "var(--text-muted)",
            fontWeight: activeTab === "lifetime" ? 700 : 500,
            fontSize: "0.875rem",
            boxShadow: activeTab === "lifetime" ? "0 2px 8px rgba(0,0,0,0.06)" : "none",
            cursor: "pointer",
            transition: "all 0.2s ease"
          }}
          className="font-devanagari"
        >
          {language === "hi" ? "🪷 आजीवन संकल्प" : "🪷 Lifetime Sankalp"}
        </button>
        <button
          onClick={() => setActiveTab("chaturmas")}
          style={{
            flex: 1,
            padding: "10px 12px",
            borderRadius: "10px",
            border: "none",
            background: activeTab === "chaturmas" ? "#ffffff" : "transparent",
            color: activeTab === "chaturmas" ? "var(--text-primary)" : "var(--text-muted)",
            fontWeight: activeTab === "chaturmas" ? 700 : 500,
            fontSize: "0.875rem",
            boxShadow: activeTab === "chaturmas" ? "0 2px 8px rgba(0,0,0,0.06)" : "none",
            cursor: "pointer",
            transition: "all 0.2s ease"
          }}
          className="font-devanagari"
        >
          {language === "hi" ? "🌸 चातुर्मास संकल्प" : "🌸 Chaturmas Sankalp"}
        </button>
      </div>

      {/* ── Categories & Cards ── */}
      {filteredSankalps.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px 20px", background: "rgba(255,255,255,0.6)", borderRadius: "20px", border: "1px dashed var(--surface-border)" }}>
          <Flower2 size={40} color="var(--brand)" style={{ margin: "0 auto 12px", opacity: 0.5 }} />
          <p className="font-devanagari" style={{ fontSize: "0.95rem", color: "var(--text-secondary)", fontWeight: 600 }}>
            {language === "hi" 
              ? "🪷 हर महान यात्रा एक सच्चे संकल्प से शुरू होती है। अपना पहला संकल्प चुनें।"
              : "🪷 Every great journey begins with one sincere promise. Choose your first Sankalp."
            }
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {(activeTab === "lifetime" ? CATEGORIES : CHATURMAS_CATEGORIES).map((category) => {
            const catSankalps = filteredSankalps.filter((q) => category.ids.includes(q.id));
            if (catSankalps.length === 0) return null;
            
            const isCollapsed = !!collapsedCats[category.id];

            return (
              <div key={category.id} style={{ background: "rgba(255,255,255,0.7)", backdropFilter: "blur(12px)", borderRadius: "20px", border: "1px solid rgba(255,255,255,0.6)", padding: "16px", boxShadow: "0 4px 16px rgba(0,0,0,0.02)" }}>
                <div 
                  onClick={() => toggleCategory(category.id)}
                  style={{ display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", padding: "4px 0" }}
                >
                  <h3 className="font-devanagari" style={{ fontSize: "1rem", fontWeight: 700, color: "var(--text-primary)", display: "flex", alignItems: "center", gap: "8px" }}>
                    <ShieldCheck size={18} color="var(--brand)" />
                    {language === "hi" ? category.name_hi : category.name_en}
                  </h3>
                  <div style={{ color: "var(--text-muted)" }}>
                    {isCollapsed ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
                  </div>
                </div>

                <AnimatePresence>
                  {!isCollapsed && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      style={{ overflow: "hidden", display: "flex", flexDirection: "column", gap: "14px", marginTop: "16px" }}
                    >
                      {catSankalps.map((sankalp) => {
                        const acceptedAt = acceptedMap[sankalp.id];
                        const isAccepted = !!acceptedAt;

                        return (
                          <motion.div
                            key={sankalp.id}
                            layout
                            style={{
                              background: isAccepted ? "linear-gradient(135deg, rgba(217,119,6,0.04) 0%, rgba(255,255,255,0.9) 100%)" : "white",
                              border: isAccepted ? "1.5px solid var(--gold)" : "1px solid var(--surface-border)",
                              borderRadius: "16px",
                              padding: "20px",
                              boxShadow: isAccepted ? "0 4px 16px rgba(217,119,6,0.1)" : "0 2px 8px rgba(0,0,0,0.02)",
                              position: "relative"
                            }}
                          >
                            <div style={{ display: "flex", alignItems: "flex-start", gap: "16px" }}>
                              <div style={{ 
                                width: "48px", height: "48px", borderRadius: "14px", 
                                background: isAccepted ? "var(--gold-dim)" : "var(--surface-raised)", 
                                border: `1px solid ${isAccepted ? "rgba(217,119,6,0.3)" : "var(--surface-border)"}`,
                                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 
                              }}>
                                <IconResolver iconName={sankalp.icon} size={24} color={isAccepted ? "#7A4A15" : "var(--brand)"} />
                              </div>

                              <div style={{ flex: 1 }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "8px", marginBottom: "4px" }}>
                                  <h4 className="font-devanagari text-primary" style={{ fontWeight: 700, fontSize: "1rem", lineHeight: 1.3 }}>
                                    {language === "hi" ? sankalp.title_hi : sankalp.title_en}
                                  </h4>
                                </div>

                                <p className="font-devanagari text-secondary" style={{ fontSize: "0.825rem", lineHeight: 1.5, marginBottom: "16px" }}>
                                  {language === "hi" ? sankalp.description_hi : sankalp.description_en}
                                </p>

                                {/* Acceptance Details */}
                                <div style={{ display: "flex", flexDirection: "column", gap: "10px", borderTop: "1px solid var(--surface-border)", paddingTop: "12px" }}>
                                  <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", flexWrap: "wrap", gap: "8px" }}>
                                    {isAccepted ? (
                                      <div style={{ display: "flex", alignItems: "center", gap: "6px", background: "rgba(22,163,74,0.1)", padding: "6px 12px", borderRadius: "20px" }}>
                                        <CheckCircle2 size={14} color="#16A34A" />
                                        <span className="font-devanagari" style={{ fontSize: "0.75rem", fontWeight: 700, color: "#16A34A" }}>
                                          {language === "hi" ? `स्वीकृत (${formatDate(acceptedAt)})` : `Accepted (${formatDate(acceptedAt)})`}
                                        </span>
                                      </div>
                                    ) : (
                                      <button
                                        onClick={() => setSankalpToConfirm(sankalp)}
                                        className="btn font-devanagari"
                                        style={{
                                          padding: "8px 16px",
                                          fontSize: "0.825rem",
                                          borderRadius: "10px",
                                          background: "linear-gradient(135deg, var(--brand) 0%, #8A2B1A 100%)",
                                          color: "white",
                                          border: "none",
                                          fontWeight: 700,
                                          boxShadow: "0 2px 8px rgba(138,43,26,0.2)"
                                        }}
                                      >
                                        {language === "hi" ? "यह संकल्प स्वीकार करें" : "Take This Sankalp"}
                                      </button>
                                    )}
                                  </div>

                                  {isAccepted && (
                                    <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "0.7rem", color: "var(--text-muted)", fontWeight: 600 }}>
                                      <Lock size={12} />
                                      <span className="font-devanagari">{language === "hi" ? "🔒 स्थायी संकल्प (अपरिवर्तनीय)" : "🔒 Permanent Commitment"}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
