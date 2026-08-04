"use client";

import { useState, useCallback, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useHabitStore } from "@/store/habitStore";
import { useAuthStore } from "@/store/authStore";
import { CATEGORIES, QUESTIONS, getQuestionsByCategory } from "@/data/content";
import type { Category, Question } from "@/types";
import { IconResolver } from "@/components/IconResolver";
import { useLanguageStore } from "@/store/languageStore";
import { 
  Sunrise, Utensils, Smartphone, Feather, Leaf, 
  Gem, BookOpen, Crown, CheckCircle2, Circle, 
  Sparkles, Star, Square, CheckSquare, ChevronRight, X, Lock
} from "lucide-react";

import { getISTDateString } from "@/lib/date";

function getTodayStr() {
  return getISTDateString();
}

const CATEGORY_ICONS: Record<string, any> = {
  "morning": Sunrise,
  "food": Utensils,
  "technology": Smartphone,
  "spiritual": Feather,
  "environment": Leaf,
  "lifestyle": Gem,
  "memory": BookOpen,
  "bonus": Crown,
};

// ---- XP Coin animation component ----
export function XPBurst({ points, onDone }: { points: number; onDone: () => void }) {
  return (
    <motion.div
      style={{
        position: "fixed",
        right: "24px",
        top: "80px",
        background: "var(--gold)",
        color: "#fff",
        padding: "8px 16px",
        borderRadius: "999px",
        fontWeight: 800,
        fontSize: "1.125rem",
        zIndex: 100,
        boxShadow: "var(--shadow-glow)",
        display: "flex",
        alignItems: "center",
        gap: "4px"
      }}
      initial={{ opacity: 1, y: 0, scale: 0.5 }}
      animate={{ opacity: 0, y: -100, scale: 1.5 }}
      transition={{ duration: 0.9, ease: "easeOut" }}
      onAnimationComplete={onDone}
    >
      <Star fill="currentColor" size={20} /> +{points}
    </motion.div>
  );
}

// ---- Submission Receipt Component ----
function SubmissionReceipt({ breakdown, onComplete }: { breakdown: any, onComplete: () => void }) {
  const { language } = useLanguageStore();
  const [step, setStep] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setStep(1), 800); 
    const t2 = setTimeout(() => setStep(2), 1600); 
    const t3 = setTimeout(() => setStep(3), 2400); 
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: "fixed", inset: 0, zIndex: 9999,
        background: "rgba(10, 10, 10, 0.95)",
        backdropFilter: "blur(20px)",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        padding: "24px", color: "white"
      }}
    >
      <div style={{ width: "100%", maxWidth: "340px", display: "flex", flexDirection: "column", gap: "24px", textAlign: "center" }}>
        
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", damping: 12 }}>
          <div style={{ fontSize: "3rem", marginBottom: "8px" }}>🌸</div>
          <div className="font-devanagari" style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--gold)" }}>
            {language === "hi" ? "आज का टास्क पूरा हुआ" : "Today's Tasks Completed"}
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          style={{ width: "100%", height: "1px", background: "rgba(255,255,255,0.15)" }} 
        />

        <div style={{ display: "flex", flexDirection: "column", gap: "16px", padding: "0 16px" }}>
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: step >= 0 ? 1 : 0, x: step >= 0 ? 0 : -20 }} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span className="font-devanagari" style={{ color: "rgba(255,255,255,0.7)" }}>
              {language === "hi" ? "मूल अंक" : "Base Points"}
            </span>
            <span style={{ fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: "1.1rem" }}>{breakdown.baseXP}</span>
          </motion.div>

          {step >= 1 && (
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span className="font-devanagari" style={{ color: "var(--gold)", display: "flex", alignItems: "center", gap: "6px" }}>
                <IconResolver iconName={breakdown.focusIcon || "Sparkles"} size={14} color="var(--gold)" />
                {language === "hi" ? "आज का चैलेंज" : "Today's Challenge"}
              </span>
              <span style={{ fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: "1.1rem", color: "var(--gold)" }}>
                +{breakdown.bonusXP}
              </span>
            </motion.div>
          )}

          {/* Optional Perfect Discipline (if any other bonus exists, but we combined it in bonusXP for now) */}
          {/* If there was a separate perfect day bonus, we could show it here. For now, it's all in bonusXP. */}
        </div>

        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: step >= 2 ? 1 : 0 }} 
          style={{ width: "100%", height: "1px", background: "rgba(255,255,255,0.15)" }} 
        />

        {step >= 2 && (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 16px" }}>
            <span className="font-devanagari" style={{ fontWeight: 800, fontSize: "1.2rem" }}>
              {language === "hi" ? "कुल" : "Total"}
            </span>
            <span style={{ fontFamily: "var(--font-sans)", fontWeight: 900, fontSize: "1.5rem", color: "white" }}>
              {breakdown.finalXP}
            </span>
          </motion.div>
        )}

        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: step >= 2 ? 1 : 0 }} 
          style={{ width: "100%", height: "1px", background: "rgba(255,255,255,0.15)" }} 
        />

        {step >= 3 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ marginTop: "16px", display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
            <div style={{ color: "var(--emerald)", display: "flex", alignItems: "center", gap: "8px", fontWeight: 700 }}>
              <CheckCircle2 size={20} />
              {language === "hi" ? "सफलतापूर्वक सेव किया गया" : "Saved Successfully"}
            </div>
            <div className="font-devanagari" style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.9rem" }}>
              {language === "hi" ? "कल मिलते हैं।" : "See you tomorrow."}
            </div>

            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={onComplete}
              className="btn font-devanagari"
              style={{ marginTop: "24px", background: "white", color: "black", padding: "12px 32px", borderRadius: "30px", fontWeight: 700, fontSize: "1rem", border: "none" }}
            >
              {language === "hi" ? "बंद करें" : "Close"}
            </motion.button>
          </motion.div>
        )}

      </div>
    </motion.div>
  );
}


// ---- Habit Card ----
export function HabitCard({
  question,
  date,
  onToggle,
  isSubmitted = false,
}: {
  question: Question;
  date: string;
  onToggle: (q: Question) => void;
  isSubmitted?: boolean;
}) {
  const { getEntryForDate } = useHabitStore();
  const { language } = useLanguageStore();
  const entry = getEntryForDate(question.id, date);
  const isCompleted = entry?.completed ?? false;
  const [celebrating, setCelebrating] = useState(false);

  const handleToggle = () => {
    if (isSubmitted) return;
    if (!isCompleted) setCelebrating(true);
    onToggle(question);
    setTimeout(() => setCelebrating(false), 600);
  };

  const isBonus = question.category_id === "bonus";
  const isSankalp = question.category_id === "sankalp";
  const Icon = CATEGORY_ICONS[question.category_id] || CheckCircle2;

  // Custom styling based on category
  const cardBorder = isCompleted
    ? "1px solid var(--emerald)"
    : isSankalp
    ? "2px solid #E85D04" // Deep Saffron/Golden border
    : isBonus
    ? "1px solid rgba(217, 119, 6, 0.4)" // Soft gold border accent
    : "1px solid var(--surface-border)";

  const cardBg = isCompleted
    ? "var(--surface-base)"
    : isSankalp
    ? "linear-gradient(135deg, rgba(232, 93, 4, 0.05), var(--surface-base))"
    : isBonus
    ? "rgba(245, 158, 11, 0.05)" // Soft gold accent background
    : "var(--surface-raised)";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className={`habit-card ${isCompleted ? "is-done" : ""}`}
      style={{
        border: cardBorder,
        background: cardBg,
        padding: "20px 16px",
        borderRadius: "var(--r-lg)",
        boxShadow: isSankalp && !isCompleted ? "0 4px 14px rgba(232, 93, 4, 0.1)" : "var(--shadow-sm)",
        position: "relative",
        cursor: isSubmitted ? "default" : "pointer",
        opacity: isSubmitted && !isCompleted ? 0.7 : 1
      }}
      onClick={handleToggle}
    >
      {/* Celebration sparkle */}
      <AnimatePresence>
        {celebrating && (
          <motion.div
            style={{
              position: "absolute", inset: 0,
              display: "flex", alignItems: "center", justifyContent: "center",
              pointerEvents: "none", zIndex: 10
            }}
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 2.5, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Sparkles size={64} color="var(--emerald)" strokeWidth={1} />
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ display: "flex", alignItems: "flex-start", gap: "16px" }}>
        {/* Icon */}
        <div
          style={{
            width: "48px", height: "48px", borderRadius: "12px",
            background: isCompleted ? "var(--emerald-dim)" : isSankalp ? "rgba(232, 93, 4, 0.15)" : isBonus ? "var(--gold-dim)" : "var(--surface-base)",
            border: `1px solid ${isCompleted ? "rgba(16,185,129,0.3)" : isSankalp ? "rgba(232, 93, 4, 0.3)" : "var(--surface-border)"}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0, transition: "all var(--dur-base)"
          }}
        >
          {isCompleted ? (
            <CheckCircle2 size={24} color="var(--emerald)" />
          ) : isBonus || isSankalp ? (
            <IconResolver iconName={question.icon} size={24} color={isSankalp ? "#E85D04" : "var(--gold)"} />
          ) : (
            <Icon size={24} color="var(--text-muted)" />
          )}
        </div>

        {/* Content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "8px" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                <div className="font-devanagari" style={{ fontWeight: 700, fontSize: "1rem", lineHeight: 1.3, color: "var(--text-primary)" }}>
                  {language === "hi" ? question.title_hi : question.title_en}
                </div>
              </div>
            </div>

            {/* Points badge */}
            <div
              className={isCompleted ? "chip chip-emerald" : isSankalp ? "chip chip-gold" : "chip chip-brand"}
              style={{ flexShrink: 0, fontWeight: 700, background: !isCompleted && isSankalp ? "rgba(232, 93, 4, 0.15)" : undefined, color: !isCompleted && isSankalp ? "#E85D04" : undefined }}
            >
              +{question.points.toLocaleString(language === "hi" ? "hi-IN" : "en-US")} XP
            </div>
          </div>

          <p className="font-devanagari" style={{ fontSize: "0.8125rem", color: "var(--text-secondary)", marginTop: "8px", lineHeight: 1.5 }}>
            {language === "hi" ? question.description_hi : question.description_en}
          </p>
        </div>
      </div>

      {/* Toggle */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "16px", paddingTop: "16px", borderTop: "1px solid var(--surface-border)" }}>
        <div className="font-devanagari" style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "4px" }}>
          {isSubmitted ? (
            <>
              <Lock size={12} />
              <span>{isCompleted ? (language === "hi" ? "सबमिट और लॉक" : "Submitted & Locked") : (language === "hi" ? "अपूर्ण (लॉक)" : "Locked")}</span>
            </>
          ) : (
            isCompleted 
              ? (language === "hi" ? "पूर्ण किया गया" : "Completed") 
              : (language === "hi" ? "पूरा करने के लिए टैप करें" : "Tap to mark complete")
          )}
        </div>
        <div 
          onClick={(e) => { e.stopPropagation(); handleToggle(); }} 
          style={{ 
            cursor: isSubmitted ? "not-allowed" : "pointer", 
            color: isCompleted ? "var(--emerald)" : "var(--text-muted)", 
            display: "flex", alignItems: "center", justifyContent: "center",
            opacity: isSubmitted ? 0.8 : 1
          }}
        >
          {question.input_type === 'radio' ? (
            isCompleted ? <CheckCircle2 size={26} /> : <Circle size={26} />
          ) : (
            isCompleted ? <CheckSquare size={26} /> : <Square size={26} />
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ---- Category Tab ----
function CategoryTab({
  category,
  isActive,
  completedCount,
  totalCount,
  onClick,
}: {
  category: Category;
  isActive: boolean;
  completedCount: number;
  totalCount: number;
  onClick: () => void;
}) {
  const Icon = CATEGORY_ICONS[category.id] || CheckCircle2;
  const { language } = useLanguageStore();
  
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`cat-tab ${isActive ? "active" : ""}`}
      style={{
        display: "flex", alignItems: "center", gap: "8px",
        borderColor: isActive ? category.color : "transparent",
        color: isActive ? "#fff" : "var(--text-muted)",
        position: "relative"
      }}
    >
      <Icon size={16} color={isActive ? category.color : "currentColor"} />
      <span className="font-devanagari">
        {language === "hi" 
          ? category.name_hi.split("(")[0].trim() 
          : category.name_en.split("(")[0].trim()}
      </span>
      {totalCount > 0 && (
        <span
          style={{
            fontSize: "0.6875rem", fontWeight: 700,
            color: completedCount === totalCount ? "var(--emerald)" : "var(--text-muted)",
            background: isActive ? "var(--surface-bg)" : "var(--surface-raised)",
            padding: "2px 6px", borderRadius: "10px"
          }}
        >
          {completedCount}/{totalCount}
        </span>
      )}
    </motion.button>
  );
}

function HabitsContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");
  const today = getTodayStr();
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0].id);

  useEffect(() => {
    if (categoryParam && CATEGORIES.some(c => c.id === categoryParam)) {
      setActiveCategory(categoryParam);
    }
  }, [categoryParam]);

  const { toggleHabit, getEntryForDate, getDayPoints, isSubmittedForDate, setSubmittedDate } = useHabitStore();
  const { user, stats, updatePoints, setStats } = useAuthStore();
  const { language } = useLanguageStore();

  const questions = getQuestionsByCategory(activeCategory);
  const todayPoints = getDayPoints(today);

  const [isSubmittedToday, setIsSubmittedToday] = useState(false);

  // Check submission status on load (restores draft from localStorage, then checks backend)
  useEffect(() => {
    const checkStatus = async () => {
      const localSubmitted = isSubmittedForDate(today);
      const authSubmitted = stats?.last_submission_date === today;

      if (localSubmitted || authSubmitted) {
        setIsSubmittedToday(true);
      }

      // Check backend to enforce read-only state even if localStorage was cleared
      try {
        const { checkTodaySubmissionStatus } = await import("@/app/actions/habits");
        const res = await checkTodaySubmissionStatus(today);
        if (res.submitted) {
          setSubmittedDate(today, true);
          setIsSubmittedToday(true);
        }
      } catch (e) {
        console.error("Error verifying submission status:", e);
      }
    };
    checkStatus();
  }, [today, stats?.last_submission_date, isSubmittedForDate, setSubmittedDate]);

  const handleToggle = useCallback(
    (question: Question) => {
      if (isSubmittedToday) return;
      const result = toggleHabit(question.id, today);
      if (result.completed) {
        updatePoints(question.points);
      } else {
        updatePoints(-question.points);
      }
    },
    [toggleHabit, today, updatePoints, isSubmittedToday]
  );

  const getCompletedCount = (catId: string) => {
    return getQuestionsByCategory(catId).filter((q) => getEntryForDate(q.id, today)?.completed).length;
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rewardBreakdown, setRewardBreakdown] = useState<any>(null);

  const handleSubmitNiyams = async () => {
    setIsSubmitting(true);
    try {
      const completedQuestionIds = useHabitStore.getState().entries
        .filter(e => e.date === today && e.completed)
        .map(e => e.questionId);

      const payload = {
        date: today,
        completedQuestionIds
      };

      const { submitDailyNiyam } = await import("@/app/actions/habits");
      const result = await submitDailyNiyam(payload);

      if (result.success && result.stats && result.breakdown) {
        // Mark as submitted locally and lock controls immediately
        setSubmittedDate(today, true);
        setIsSubmittedToday(true);

        // Show reward reveal animation
        setRewardBreakdown(result.breakdown);
        
        // Update auth store with final stats
        setStats({
          user_id: user?.id || "",
          bonus_xp: stats?.bonus_xp || 0,
          ...result.stats,
          last_submission_date: today,
          last_submission_xp: result.breakdown.finalXP,
          updated_at: new Date().toISOString()
        });
      } else {
        // Safe Mode
        if (result.error === 'You have already submitted your Niyam for this date.') {
          alert(result.error);
        } else {
          alert(language === "hi" ? "सिंक करने में असमर्थ। आपकी प्रगति सुरक्षित रूप से सेव कर ली गई है। कृपया बाद में पुनः प्रयास करें।" : "Unable to sync. Your progress is safely saved locally. Retrying later.");
        }
      }
    } catch (e: any) {
      console.error("Submission error", e);
      alert(language === "hi" ? "सिंक करने में असमर्थ। आपकी प्रगति सुरक्षित रूप से सेव कर ली गई है।" : "Unable to sync. Your progress is safely saved locally.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRevealComplete = () => {
    setRewardBreakdown(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const activeCategories = CATEGORIES.filter((c) => c.id !== "bonus" && c.id !== "sankalp");
  const currentCategoryIndex = activeCategories.findIndex(c => c.id === activeCategory);
  const nextCategory = currentCategoryIndex >= 0 && currentCategoryIndex < activeCategories.length - 1 
    ? activeCategories[currentCategoryIndex + 1] 
    : null;

  return (
    <div className="page" style={{ paddingBottom: "100px" }}>
      
      {/* 🚀 Reward Reveal Overlay 🚀 */}
      <AnimatePresence>
        {rewardBreakdown && (
          <SubmissionReceipt breakdown={rewardBreakdown} onComplete={handleRevealComplete} />
        )}
      </AnimatePresence>

      {/* Header */}
      <div
        style={{
          position: "sticky", top: "64px", zIndex: 40,
          background: "rgba(253, 251, 247, 0.95)", backdropFilter: "blur(24px)",
          padding: "16px 16px 12px", borderBottom: "1px solid var(--surface-border)"
        }}
      >
        {/* Today's Submitted Score Prominent Banner */}
        {isSubmittedToday && (
          <div style={{
            background: "linear-gradient(135deg, rgba(245, 158, 11, 0.14) 0%, rgba(16, 185, 129, 0.12) 100%)",
            border: "1.5px solid rgba(245, 158, 11, 0.35)",
            borderRadius: "14px",
            padding: "12px 14px",
            marginBottom: "14px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            boxShadow: "0 4px 14px rgba(245, 158, 11, 0.1)"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{ width: "38px", height: "38px", borderRadius: "10px", background: "var(--gold-dim)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Crown size={20} color="var(--gold)" />
              </div>
              <div>
                <div className="font-devanagari" style={{ fontSize: "0.75rem", fontWeight: 700, color: "#9A6A15", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                  {language === "hi" ? "आज का अर्जित पुण्य अंक" : "Today's Submitted Score"}
                </div>
                <div className="font-devanagari" style={{ fontSize: "1.125rem", fontWeight: 800, color: "var(--text-primary)", lineHeight: 1.2 }}>
                  +{stats?.last_submission_date === today ? (stats?.last_submission_xp || todayPoints) : todayPoints} {language === "hi" ? "पुण्य अंक" : "Punya Points"}
                </div>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "0.75rem", fontWeight: 700, color: "var(--emerald)", background: "rgba(16,185,129,0.15)", padding: "6px 10px", borderRadius: "20px" }}>
              <Lock size={13} />
              <span>{language === "hi" ? "सबमिट लॉक" : "Locked"}</span>
            </div>
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "12px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <div className="font-devanagari heading-md">
                {new Date().toLocaleDateString(language === "hi" ? "hi-IN" : "en-US", { weekday: "long", day: "numeric", month: "long" })}
              </div>
              <div className="font-devanagari" style={{ fontSize: "0.8125rem", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "4px" }}>
                {language === "hi" ? "वर्तमान अंक: " : "Current points: "} <span style={{ fontWeight: 700, color: "var(--gold)", display: "flex", alignItems: "center", gap: "2px" }}><Star size={12} fill="currentColor" /> {todayPoints}</span>
              </div>
            </div>

            {isSubmittedToday ? (
              <div
                className="font-devanagari"
                style={{
                  padding: "8px 14px",
                  fontSize: "0.8125rem",
                  borderRadius: "var(--r-md)",
                  background: "rgba(16,185,129,0.1)",
                  color: "var(--emerald)",
                  border: "1px solid rgba(16, 185, 129, 0.3)",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  fontWeight: 700
                }}
              >
                <Lock size={14} />
                <span>{language === "hi" ? "सबमिटेड" : "Submitted"}</span>
              </div>
            ) : (
              <button
                onClick={handleSubmitNiyams}
                disabled={isSubmitting}
                className="btn btn-primary font-devanagari"
                style={{
                  padding: "8px 16px",
                  fontSize: "0.875rem",
                  borderRadius: "var(--r-md)",
                  background: "var(--brand)",
                  color: "#fff",
                  border: "none",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  cursor: "pointer",
                  boxShadow: "0 2px 8px rgba(162, 98, 42, 0.2)"
                }}
              >
                {isSubmitting ? (
                  <span className="spinner" style={{ width: "14px", height: "14px", border: "2px solid #fff", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
                ) : (
                  <>
                    <span>{language === "hi" ? "सबमिट करें" : "Submit"}</span>
                    <CheckCircle2 size={14} />
                  </>
                )}
              </button>
            )}
          </div>

          {isSubmittedToday ? (
            <div className="font-devanagari" style={{ fontSize: "0.75rem", color: "var(--emerald)", fontWeight: 600, borderLeft: "2px solid var(--emerald)", paddingLeft: "8px", marginTop: "2px" }}>
              {language === "hi" ? "🔒 आज का सबमिशन पूरा हो चुका है और आपका स्कोर लॉक हो गया है।" : "🔒 Today's score is locked & submitted."}
            </div>
          ) : (
            <div className="font-devanagari" style={{ fontSize: "0.75rem", color: "var(--brand)", fontWeight: 600, borderLeft: "2px solid var(--brand)", paddingLeft: "8px", marginTop: "2px" }}>
              {language === "hi" ? "⚠️ आज के नियम चेक करने के बाद सबमिट करना न भूलें" : "⚠️ Don't forget to submit after checking today's niyams"}
            </div>
          )}
        </div>

        <div className="no-scrollbar" style={{ display: "flex", gap: "8px", overflowX: "auto", paddingBottom: "4px" }}>
          {activeCategories.map((cat) => (
            <CategoryTab
              key={cat.id}
              category={cat}
              isActive={activeCategory === cat.id}
              completedCount={getCompletedCount(cat.id)}
              totalCount={getQuestionsByCategory(cat.id).length}
              onClick={() => setActiveCategory(cat.id)}
            />
          ))}
        </div>
      </div>

      <div style={{ padding: "20px 16px", display: "flex", flexDirection: "column", gap: "16px" }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            style={{ display: "flex", flexDirection: "column", gap: "12px" }}
          >
            {questions.map((question, i) => (
              <motion.div
                key={question.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
              >
                <HabitCard
                  question={question}
                  date={today}
                  onToggle={handleToggle}
                  isSubmitted={isSubmittedToday}
                />
              </motion.div>
            ))}

            {nextCategory ? (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={() => {
                  setActiveCategory(nextCategory.id);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="btn btn-primary font-devanagari"
                style={{
                  marginTop: "16px",
                  width: "100%",
                  padding: "16px",
                  background: "var(--surface-raised)",
                  color: "var(--text-primary)",
                  border: "1px solid var(--surface-border)",
                  boxShadow: "var(--shadow-sm)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between"
                }}
              >
                <span>
                  {language === "hi" ? "अगली श्रेणी: " : "Next: "}
                  {language === "hi" ? nextCategory.name_hi : nextCategory.name_en}
                </span>
                <ChevronRight size={20} />
              </motion.button>
            ) : isSubmittedToday ? (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                disabled
                className="btn font-devanagari"
                style={{
                  marginTop: "16px",
                  width: "100%",
                  padding: "16px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  background: "var(--surface-raised)",
                  color: "var(--text-muted)",
                  border: "1px solid var(--surface-border)",
                  cursor: "not-allowed"
                }}
              >
                <Lock size={18} />
                <span>{language === "hi" ? "आज के टास्क सबमिट हो चुकी है" : "Today's Submission Completed"}</span>
              </motion.button>
            ) : (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={handleSubmitNiyams}
                disabled={isSubmitting}
                className="btn btn-primary font-devanagari"
                style={{
                  marginTop: "16px",
                  width: "100%",
                  padding: "16px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  boxShadow: "var(--shadow-glow)"
                }}
              >
                {isSubmitting ? (
                  <span className="spinner" style={{ width: "20px", height: "20px", border: "2px solid #fff", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
                ) : (
                  <>
                    <span>{language === "hi" ? "नियम सेव करें" : "Submit Niyams"}</span>
                    <CheckCircle2 size={20} />
                  </>
                )}
              </motion.button>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function HabitsPage() {
  return (
    <Suspense fallback={<div className="page" style={{ padding: "20px" }}>Loading...</div>}>
      <HabitsContent />
    </Suspense>
  );
}
