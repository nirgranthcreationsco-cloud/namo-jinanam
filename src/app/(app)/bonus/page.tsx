"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useHabitStore } from "@/store/habitStore";
import { useAuthStore } from "@/store/authStore";
import { useLanguageStore } from "@/store/languageStore";
import { QUESTIONS } from "@/data/content";
import type { Question } from "@/types";
import { HabitCard, XPBurst } from "../habits/page";
import { ChevronDown, ChevronUp, Star, Shield, Trophy, Lock, Landmark } from "lucide-react";

export default function BonusPage() {
  const [xpBursts, setXpBursts] = useState<{ id: string; points: number }[]>([]);
  const [sankalpToConfirm, setSankalpToConfirm] = useState<Question | null>(null);
  const [showLockedPopup, setShowLockedPopup] = useState(false);

  // Collapse states for special sections
  const [isBonusExpanded, setIsBonusExpanded] = useState(true);
  const [isSankalpExpanded, setIsSankalpExpanded] = useState(true);

  const { toggleHabit, getEntryForDate } = useHabitStore();
  const { updatePoints } = useAuthStore();
  const { language } = useLanguageStore();

  const bonusQuestions = QUESTIONS.filter((q) => q.category_id === "bonus");
  const sankalpQuestions = QUESTIONS.filter((q) => q.category_id === "sankalp");

  const handleToggleSpecial = useCallback(
    (question: Question, dateType: string) => {
      if (dateType === "chaturmas_bonus") {
        setShowLockedPopup(true);
        return;
      }

      const isCompleted = getEntryForDate(question.id, dateType)?.completed ?? false;
      if (dateType === "lifetime_sankalp" && !isCompleted) {
        setSankalpToConfirm(question);
        return;
      }

      const result = toggleHabit(question.id, dateType);
      if (result.completed) {
        const burstId = Date.now().toString();
        setXpBursts((prev) => [...prev, { id: burstId, points: question.points }]);
        updatePoints(question.points);
      } else {
        updatePoints(-question.points);
      }
    },
    [toggleHabit, getEntryForDate, updatePoints]
  );

  const confirmSankalp = () => {
    if (!sankalpToConfirm) return;
    const result = toggleHabit(sankalpToConfirm.id, "lifetime_sankalp");
    if (result.completed) {
      const burstId = Date.now().toString();
      setXpBursts((prev) => [...prev, { id: burstId, points: sankalpToConfirm.points }]);
      updatePoints(sankalpToConfirm.points);
    }
    setSankalpToConfirm(null);
  };

  return (
    <div className="page" style={{ padding: "20px 16px 100px" }}>
      {/* XP Animations */}
      <AnimatePresence>
        {xpBursts.map((burst) => (
          <XPBurst
            key={burst.id}
            points={burst.points}
            onDone={() => setXpBursts((prev) => prev.filter((b) => b.id !== burst.id))}
          />
        ))}
      </AnimatePresence>

      {/* Confirmation Modal for Lifetime Vows */}
      <AnimatePresence>
        {sankalpToConfirm && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(9, 9, 11, 0.7)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "20px" }}>
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="card" 
              style={{ maxWidth: "420px", background: "var(--surface-base)", padding: "28px 24px", border: "2px solid #E85D04", borderRadius: "var(--r-xl)", boxShadow: "var(--shadow-lg)" }}
            >
              <h3 className="font-devanagari heading-lg" style={{ color: "#E85D04", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
                <Landmark size={24} /> {language === "hi" ? "आजीवन संकल्प प्रतिज्ञा" : "Lifetime Vow Pledge"}
              </h3>
              <div className="font-devanagari" style={{ background: "rgba(232, 93, 4, 0.06)", padding: "16px", borderRadius: "var(--r-md)", borderLeft: "4px solid #E85D04", marginBottom: "20px" }}>
                <p style={{ fontWeight: 700, fontSize: "1rem", color: "var(--text-primary)" }}>
                  {language === "hi" ? sankalpToConfirm.title_hi : sankalpToConfirm.title_en}
                </p>
                {language === "hi" && (
                  <p style={{ fontSize: "0.8125rem", color: "var(--text-secondary)", marginTop: "4px" }}>
                    {sankalpToConfirm.title_en}
                  </p>
                )}
              </div>
              <p className="font-devanagari body-sm" style={{ color: "var(--text-secondary)", marginBottom: "24px", lineHeight: 1.6 }}>
                {language === "hi" 
                  ? "क्या आप पूरे जीवन के लिए इस नियम का पालन करने का दृढ़ संकल्प लेते हैं? यह एक अखंड आत्म-संकल्प है जो आपकी आध्यात्मिक उन्नति का मार्ग प्रशस्त करेगा।"
                  : "Do you firmly pledge to follow this rule for the rest of your life? This is an unbroken self-pledge that will pave the path for your spiritual progress."
                }
              </p>
              <div style={{ display: "flex", gap: "12px" }}>
                <button 
                  className="btn btn-secondary font-devanagari" 
                  style={{ flex: 1, padding: "12px" }} 
                  onClick={() => setSankalpToConfirm(null)}
                >
                  {language === "hi" ? "रद्द करें" : "Cancel"}
                </button>
                <button 
                  className="btn btn-primary font-devanagari" 
                  style={{ flex: 1, padding: "12px", background: "#E85D04", border: "none", boxShadow: "0 4px 12px rgba(232,93,4,0.3)" }} 
                  onClick={confirmSankalp}
                >
                  {language === "hi" ? "स्वीकार है" : "I Accept"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Locked Alert Modal for Chaturmas Bonus */}
      <AnimatePresence>
        {showLockedPopup && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(9, 9, 11, 0.7)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "20px" }}>
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="card" 
              style={{ maxWidth: "420px", background: "var(--surface-base)", padding: "28px 24px", border: "2px solid var(--gold)", borderRadius: "var(--r-xl)", boxShadow: "var(--shadow-lg)", textAlign: "center" }}
            >
              <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "var(--gold-dim)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                <Lock size={32} color="var(--gold)" />
              </div>
              <h3 className="font-devanagari heading-lg" style={{ color: "var(--gold)", marginBottom: "12px" }}>
                {language === "hi" ? "यह विकल्प अभी बंद है" : "This Option is Locked"}
              </h3>
              <p className="font-devanagari body-md" style={{ color: "var(--text-primary)", fontWeight: 600, marginBottom: "8px" }}>
                {language === "hi" ? "चातुर्मास विशेष बोनस उपलब्धियाँ" : "Chaturmas Special Bonus Achievements"}
              </p>
              <p className="font-devanagari body-sm" style={{ color: "var(--text-secondary)", marginBottom: "24px", lineHeight: 1.6 }}>
                {language === "hi"
                  ? "यह विकल्प चातुर्मास प्रतियोगिता के अंतिम दिन खुलेगा। तब तक अपने संकल्पों का निष्ठापूर्वक पालन करें और अंत में अपने अंक अर्जित करें!"
                  : "This option will unlock on the last day of the Chaturmas competition. Piously follow your vows until then and claim your points at the end!"
                }
              </p>
              <button 
                className="btn btn-primary font-devanagari" 
                style={{ width: "100%", padding: "12px", background: "var(--gold)", border: "none", boxShadow: "0 4px 12px var(--gold-dim)" }} 
                onClick={() => setShowLockedPopup(false)}
              >
                {language === "hi" ? "ठीक है" : "Understand"}
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Intro Banner */}
      <div
        className="card"
        style={{
          padding: "24px", marginBottom: "28px",
          background: "var(--surface-overlay)",
          borderColor: "var(--surface-border-md)", textAlign: "center"
        }}
      >
        <Trophy size={40} color="var(--brand)" style={{ margin: "0 auto 16px" }} />
        <h1 className="heading-xl font-devanagari" style={{ color: "var(--brand)", marginBottom: "8px" }}>
          {language === "hi" ? "आजीवन नियम एवं बोनस पॉइंट्स" : "Lifetime Rules & Bonus Points"}
        </h1>
        <p className="body-sm font-devanagari" style={{ color: "var(--text-secondary)", lineHeight: 1.5 }}>
          {language === "hi" 
            ? "ये नियम दैनिक नहीं हैं। ये विशेष संकल्प एवं पूरे चातुर्मास में निरंतर पालन करने पर मिलने वाले अतिरिक्त पुण्य अंक हैं।"
            : "These rules are not daily. These are special vows and extra merit points awarded for continuous observance throughout Chaturmas."
          }
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        {/* 🌟 Section A — पूरे चातुर्मास बोनस पॉइंट्स */}
        <div style={{ background: "rgba(245, 158, 11, 0.06)", padding: "20px", borderRadius: "var(--r-xl)", border: "1px solid rgba(245, 158, 11, 0.2)", boxShadow: "var(--shadow-sm)" }}>
          <div 
            style={{ display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", marginBottom: isBonusExpanded ? "20px" : 0 }}
            onClick={() => setIsBonusExpanded(!isBonusExpanded)}
          >
            <div>
              <h2 className="heading-md font-devanagari" style={{ color: "var(--gold)", display: "flex", alignItems: "center", gap: "8px", fontWeight: 700 }}>
                <Star size={20} fill="currentColor" /> {language === "hi" ? "चातुर्मास विशेष बोनस उपलब्धियाँ" : "Chaturmas Special Bonus"}
              </h2>
              <p className="font-devanagari" style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: "4px" }}>
                {language === "hi" 
                  ? "पूरे चातुर्मास में नियमित रूप से पालन करने पर अतिरिक्त पुण्य अंक"
                  : "Extra merit points for regular observance throughout Chaturmas"
                }
              </p>
            </div>
            {isBonusExpanded ? <ChevronUp size={22} color="var(--gold)" /> : <ChevronDown size={22} color="var(--gold)" />}
          </div>

          <AnimatePresence>
            {isBonusExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                style={{ overflow: "hidden", display: "flex", flexDirection: "column", gap: "12px" }}
              >
                {bonusQuestions.map((q) => (
                  <HabitCard
                    key={q.id}
                    question={q}
                    date="chaturmas_bonus"
                    onToggle={(question) => handleToggleSpecial(question, "chaturmas_bonus")}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 🛕 Section B — आजीवन नियम */}
        <div style={{ background: "rgba(232, 93, 4, 0.04)", padding: "20px", borderRadius: "var(--r-xl)", border: "1px solid rgba(232, 93, 4, 0.2)", boxShadow: "var(--shadow-sm)" }}>
          <div 
            style={{ display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", marginBottom: isSankalpExpanded ? "20px" : 0 }}
            onClick={() => setIsSankalpExpanded(!isSankalpExpanded)}
          >
            <div>
              <h2 className="heading-md font-devanagari" style={{ color: "#E85D04", display: "flex", alignItems: "center", gap: "8px", fontWeight: 700 }}>
                <Landmark size={20} /> {language === "hi" ? "आजीवन नियम (Lifetime Sankalp)" : "Lifetime Vows (Sankalp)"}
              </h2>
              <p className="font-devanagari" style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: "4px" }}>
                {language === "hi"
                  ? "स्वीकार करने के बाद जीवनभर पालन करने का अखंड संकल्प"
                  : "An unbroken lifetime vow to be piously followed after acceptance"
                }
              </p>
            </div>
            {isSankalpExpanded ? <ChevronUp size={22} color="#E85D04" /> : <ChevronDown size={22} color="#E85D04" />}
          </div>

          <AnimatePresence>
            {isSankalpExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                style={{ overflow: "hidden", display: "flex", flexDirection: "column", gap: "12px" }}
              >
                {sankalpQuestions.map((q) => (
                  <HabitCard
                    key={q.id}
                    question={q}
                    date="lifetime_sankalp"
                    onToggle={(question) => handleToggleSpecial(question, "lifetime_sankalp")}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
