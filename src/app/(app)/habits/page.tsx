"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useHabitStore } from "@/store/habitStore";
import { useAuthStore } from "@/store/authStore";
import { CATEGORIES, QUESTIONS, getQuestionsByCategory } from "@/data/content";
import type { Category, Question } from "@/types";
import { IconResolver } from "@/components/IconResolver";
import { useLanguageStore } from "@/store/languageStore";
import { supabase } from "@/lib/supabase";
import { 
  Sunrise, Utensils, Smartphone, Feather, Leaf, 
  Gem, BookOpen, Crown, CheckCircle2, Circle, 
  Sparkles, Save, Star, ChevronDown, ChevronUp, Square, CheckSquare, ChevronRight
} from "lucide-react";

function getTodayStr() {
  return new Date().toISOString().split("T")[0];
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

// ---- Habit Card ----
export function HabitCard({
  question,
  date,
  onToggle,
}: {
  question: Question;
  date: string;
  onToggle: (q: Question) => void;
}) {
  const { getEntryForDate } = useHabitStore();
  const { language } = useLanguageStore();
  const entry = getEntryForDate(question.id, date);
  const isCompleted = entry?.completed ?? false;
  const [celebrating, setCelebrating] = useState(false);

  const handleToggle = () => {
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
        cursor: "pointer"
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
                {isSankalp && (
                  <span className="font-devanagari" style={{ fontSize: "0.6875rem", background: "#E85D04", color: "white", padding: "1px 6px", borderRadius: "4px", fontWeight: 700 }}>
                    {language === "hi" ? "आजीवन" : "Lifetime"}
                  </span>
                )}
              </div>
              {language === "hi" && (
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "2px" }}>
                  {question.title_en}
                </div>
              )}
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

          {/* Motivational quote on completion */}
          <AnimatePresence>
            {isCompleted && question.motivational_quote && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                animate={{ opacity: 1, height: "auto", marginTop: 12 }}
                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                style={{ overflow: "hidden" }}
              >
                <div className="font-devanagari" style={{ fontSize: "0.75rem", fontStyle: "italic", color: "var(--emerald)", paddingLeft: "10px", borderLeft: "2px solid var(--emerald)" }}>
                  "{question.motivational_quote}"
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Toggle */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "16px", paddingTop: "16px", borderTop: "1px solid var(--surface-border)" }}>
        <div className="font-devanagari" style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
          {isCompleted 
            ? (isSankalp ? (language === "hi" ? "आजीवन संकल्प स्वीकृत" : "Lifetime pledge accepted") : (language === "hi" ? "पूर्ण किया गया" : "Completed")) 
            : (isSankalp ? (language === "hi" ? "संकल्प लेने के लिए टैप करें" : "Tap to take lifetime vow") : (language === "hi" ? "पूरा करने के लिए टैप करें" : "Tap to mark complete"))
          }
        </div>
        <div 
          onClick={(e) => { e.stopPropagation(); handleToggle(); }} 
          style={{ cursor: "pointer", color: isCompleted ? "var(--emerald)" : "var(--text-muted)", display: "flex", alignItems: "center", justifyContent: "center" }}
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

// ---- Main Habits Page ----
export default function HabitsPage() {
  const today = getTodayStr();
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0].id);
  const [xpBursts, setXpBursts] = useState<{ id: string; points: number }[]>([]);

  const { toggleHabit, getEntryForDate, getDayEntries, getDayPoints, getDayCompletionPct } = useHabitStore();
  const { user, stats, updatePoints } = useAuthStore();
  const { language } = useLanguageStore();

  const questions = getQuestionsByCategory(activeCategory);
  const todayPoints = getDayPoints(today);
  const todayPct = getDayCompletionPct(today);

  const handleToggle = useCallback(
    (question: Question) => {
      const result = toggleHabit(question.id, today);
      if (result.completed) {
        // Add XP burst animation
        const burstId = Date.now().toString();
        setXpBursts((prev) => [...prev, { id: burstId, points: question.points }]);
        updatePoints(question.points);
      } else {
        updatePoints(-question.points);
      }
    },
    [toggleHabit, today, updatePoints]
  );

  const getCompletedCount = (catId: string) => {
    return getQuestionsByCategory(catId).filter((q) => getEntryForDate(q.id, today)?.completed).length;
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const activeCategories = CATEGORIES.filter((c) => c.id !== "bonus" && c.id !== "sankalp");
  const currentCategoryIndex = activeCategories.findIndex(c => c.id === activeCategory);
  const nextCategory = currentCategoryIndex >= 0 && currentCategoryIndex < activeCategories.length - 1 
    ? activeCategories[currentCategoryIndex + 1] 
    : null;

  return (
    <div className="page" style={{ paddingBottom: "100px" }}>
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

      {/* Header */}
      <div
        style={{
          position: "sticky", top: "64px", zIndex: 40,
          background: "rgba(253, 251, 247, 0.9)", backdropFilter: "blur(24px)",
          padding: "16px 16px 12px", borderBottom: "1px solid var(--surface-border)"
        }}
      >
        {/* Day progress */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
          <div>
            <div className="font-devanagari heading-md">
              {new Date().toLocaleDateString(language === "hi" ? "hi-IN" : "en-US", { weekday: "long", day: "numeric", month: "long" })}
            </div>
            <div className="font-devanagari" style={{ fontSize: "0.8125rem", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "4px" }}>
              {language === "hi" ? "आज के अंक: " : "Today's points: "} <span style={{ fontWeight: 700, color: "var(--gold)", display: "flex", alignItems: "center", gap: "2px" }}><Star size={12} fill="currentColor" /> {todayPoints}</span>
            </div>
          </div>
          <div className={`chip ${todayPct === 100 ? "chip-emerald" : "chip-brand"}`}>
            {todayPct}% {language === "hi" ? "पूर्ण" : "Completed"}
          </div>
        </div>

        {/* Overall progress bar */}
        <div className="progress-track" style={{ marginBottom: "20px" }}>
          <motion.div
            className="progress-fill"
            style={{ background: "linear-gradient(90deg, var(--brand), var(--gold))" }}
            animate={{ width: `${todayPct}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>

        {/* Category tabs */}
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

      {/* Questions */}
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
            {/* Habit cards */}
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
                />
              </motion.div>
            ))}

            {/* Next Category Button */}
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
            ) : (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={async () => {
                  setIsSubmitting(true);
                  try {
                    const userId = user?.id;
                    if (userId) {
                      const dayEntries = getDayEntries(today);
                      const currentDayPoints = getDayPoints(today);

                      // 1. Sync entries to Supabase
                      if (dayEntries.length > 0) {
                        const rows = dayEntries.map((e) => ({
                          user_id: userId,
                          question_id: e.questionId,
                          date: today,
                          completed: true,
                        }));
                        await supabase.from("habit_entries").upsert(rows, { onConflict: "user_id,question_id,date" });
                      }

                      // 2. Sync user stats total points
                      const totalPts = stats?.total_points ?? currentDayPoints;
                      await supabase.from("user_stats").upsert({
                        user_id: userId,
                        total_points: totalPts,
                        current_streak: stats?.current_streak ?? 1,
                        best_streak: stats?.best_streak ?? 1,
                        updated_at: new Date().toISOString(),
                      });
                    }
                  } catch (e) {
                    console.warn("Supabase habit sync notice", e);
                  } finally {
                    setIsSubmitting(false);
                    alert(language === "hi" ? "नियम सफलतापूर्वक क्लाउड पर सेव हो गए!" : "Niyams successfully synced to cloud!");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }
                }}
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

