"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAuthStore } from "@/store/authStore";
import { useHabitStore } from "@/store/habitStore";
import { useLanguageStore } from "@/store/languageStore";
import { getTodayInspiration } from "@/data/challenges";
import { CATEGORIES, QUESTIONS } from "@/data/content";

import { 
  Moon, Sunrise, Sun, Sunset, 
  Star, Crown, ChevronRight, CheckCircle2, Flame, Award, CalendarDays, PartyPopper, ThumbsUp, Sparkles, TreePine, Clock, Target, Info, Leaf, Salad, Smartphone, Brain, HeartHandshake, Gem
} from "lucide-react";

function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const midnight = new Date(now);
      midnight.setHours(24, 0, 0, 0);
      const diff = midnight.getTime() - now.getTime();
      
      const h = Math.floor(diff / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);
      
      setTimeLeft(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`);
    };
    
    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--brand)", fontSize: "0.875rem", fontWeight: 700, fontFamily: "var(--font-sans)" }}>
      <Clock size={16} />
      <span>{timeLeft}</span>
    </div>
  );
}

function getGreeting(language: "hi" | "en") {
  const h = new Date().getHours();
  if (language === "hi") {
    if (h < 6) return { text: "जय जिनेन्द्र", sub: "ब्रह्म मुहूर्त में जागरण करें", icon: Moon };
    if (h < 12) return { text: "जय जिनेन्द्र", sub: "आज के टास्क शुरू करें", icon: Sunrise };
    if (h < 17) return { text: "जय जिनेन्द्र", sub: "साधना में एकाग्र रहें", icon: Sun };
    if (h < 20) return { text: "जय जिनेन्द्र", sub: "संध्या वंदना का समय", icon: Sunset };
    return { text: "जय जिनेन्द्र", sub: "प्रतिक्रमण करें और सोएं", icon: Moon };
  } else {
    if (h < 6) return { text: "Jai Jinendra", sub: "Rise early in Brahma Muhurta", icon: Moon };
    if (h < 12) return { text: "Jai Jinendra", sub: "Start your daily sadhana", icon: Sunrise };
    if (h < 17) return { text: "Jai Jinendra", sub: "Stay focused on sadhana", icon: Sun };
    if (h < 20) return { text: "Jai Jinendra", sub: "Time for evening prayers", icon: Sunset };
    return { text: "Jai Jinendra", sub: "Perform Pratikraman and rest", icon: Moon };
  }
}

function ProgressRing({ percentage, size = 160, color = "var(--brand)", trackColor = "var(--surface-overlay)" }: { percentage: number; size?: number; color?: string; trackColor?: string }) {
  const radius = (size - 24) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle
        cx={size / 2} cy={size / 2} r={radius}
        fill="none" stroke={trackColor} strokeWidth="14"
      />
      <circle
        cx={size / 2} cy={size / 2} r={radius}
        fill="none" stroke={color} strokeWidth="14"
        strokeDasharray={circumference} strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transform: `rotate(-90deg)`, transformOrigin: "center", transition: "stroke-dashoffset 1.2s cubic-bezier(0.16,1,0.3,1)" }}
      />
    </svg>
  );
}

function MiniCalendar({ language }: { language: "hi" | "en" }) {
  const today = new Date();
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() - 6 + i);
    return d;
  });

  const dayNames = language === "hi" 
    ? ["र", "सो", "मं", "बु", "गु", "शु", "श"] 
    : ["S", "M", "T", "W", "T", "F", "S"];

  return (
    <div style={{ display: "flex", gap: "8px", justifyContent: "space-between" }}>
      {days.map((day, i) => {
        const isToday = day.toDateString() === today.toDateString();
        const isPast = day < today && !isToday;
        const rand = Math.random();
        const status = isPast ? (rand > 0.3 ? "cal-done" : rand > 0.15 ? "cal-partial" : "cal-missed") : isToday ? "cal-today" : "cal-future";

        return (
          <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", flex: 1 }}>
            <span className="font-devanagari" style={{ fontSize: "0.625rem", color: isToday ? "var(--brand)" : "var(--text-muted)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em" }}>
              {dayNames[day.getDay()]}
            </span>
            <div className={`cal-cell ${status}`} style={{ width: "100%", aspectRatio: "1", fontSize: "0.8125rem" }}>
              {day.getDate()}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function DashboardPage() {
  const { profile, stats } = useAuthStore();
  const { getDayCompletionPct, entries } = useHabitStore();
  const { language } = useLanguageStore();
  
  const today = new Date().toISOString().split("T")[0];
  const greeting = getGreeting(language);
  const GreetingIcon = greeting.icon;

  const todayPct = getDayCompletionPct(today);
  const inspiration = getTodayInspiration(today);
  const category = CATEGORIES.find(c => c.id === inspiration.categoryId) || CATEGORIES[0];
  
  const todayEntry = (entries as any)[today] || { selectedIds: [], isSubmitted: false };
  
  const categoryQuestions = QUESTIONS.filter(q => q.category_id === inspiration.categoryId && q.type === 'daily' && q.is_active !== false);
  const totalCategoryQuestions = categoryQuestions.length;
  const completedCategoryQuestions = categoryQuestions.filter(q => todayEntry.selectedIds.includes(q.id)).length;
  const categoryProgressPct = totalCategoryQuestions === 0 ? 0 : Math.round((completedCategoryQuestions / totalCategoryQuestions) * 100);
  const isCategoryComplete = completedCategoryQuestions === totalCategoryQuestions && totalCategoryQuestions > 0;

  // Simple icon mapper
  const IconMap: Record<string, any> = {
    'Sunrise': Sunrise, 'Salad': Salad, 'Smartphone': Smartphone, 'Om': Sparkles, 'Leaf': Leaf, 'Gem': Gem, 'Brain': Brain, 'HeartHandshake': HeartHandshake
  };
  const CategoryIcon = IconMap[category.icon] || Star;


  return (
    <div className="page" style={{ padding: "20px 16px 100px", display: "flex", flexDirection: "column", gap: "20px" }}>
      
      {/* ── Greeting Header ── */}
      <motion.div 
        initial={{ opacity: 0, y: 12 }} 
        animate={{ opacity: 1, y: 0 }} 
        style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "5px", marginBottom: "3px" }}>
            <GreetingIcon size={14} color="var(--gold)" />
            <span className="font-devanagari" style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--gold)", letterSpacing: "0.04em" }}>
              {greeting.text}
            </span>
          </div>
          <h1 className="font-devanagari" style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--text-primary)", lineHeight: 1.2, letterSpacing: "-0.01em" }}>
            {profile?.full_name?.split(" ")[0] ?? (language === "hi" ? "साधक" : "Seeker")}
            {language === "hi" ? " जी" : ""}
          </h1>
          <p className="font-devanagari" style={{ fontSize: "0.8125rem", color: "var(--text-muted)", marginTop: "2px" }}>
            {greeting.sub}
          </p>
        </div>
        
        <Link href="/profile" style={{ textDecoration: "none" }}>
          <div style={{
            background: "linear-gradient(135deg, var(--gold-dim), rgba(160,98,42,0.15))",
            border: "1px solid rgba(160,98,42,0.25)",
            borderRadius: "14px", padding: "8px 12px",
            display: "flex", flexDirection: "column", alignItems: "center", gap: "1px",
            boxShadow: "0 2px 8px rgba(160,98,42,0.1)"
          }}>
            <span className="font-devanagari" style={{ fontSize: "0.875rem", fontWeight: 700, color: "#7A4A15" }}>
              {language === "hi" ? "प्रोफ़ाइल" : "Profile"}
            </span>
          </div>
        </Link>
      </motion.div>

      {/* ── Today's Inspiration Hero ── */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }} 
        animate={{ opacity: 1, scale: 1 }} 
        transition={{ delay: 0.08 }}
        className="card"
        style={{
          padding: "20px",
          background: `linear-gradient(145deg, #ffffff 0%, ${category.color}12 100%)`,
          border: `1.5px solid ${category.color}40`,
          boxShadow: `0 8px 28px ${category.color}15`,
          position: "relative",
          overflow: "hidden"
        }}
      >
        {/* Header Bar */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <Sparkles size={16} color="var(--gold)" />
            <span className="font-devanagari" style={{ fontSize: "0.8125rem", fontWeight: 700, color: "var(--brand)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
              {language === "hi" ? "आज का विशेष लक्ष्य" : "Today's Challenge Focus"}
            </span>
          </div>
          <CountdownTimer />
        </div>

        {/* Clear Simple Instruction Headline */}
        <div style={{
          background: `${category.color}15`,
          border: `1px solid ${category.color}30`,
          borderRadius: "14px",
          padding: "14px 16px",
          marginBottom: "16px"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
            <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: category.color, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>
              <CategoryIcon size={20} />
            </div>
            <div>
              <div className="font-devanagari" style={{ fontSize: "1.125rem", fontWeight: 800, color: "var(--text-primary)" }}>
                {language === "hi" ? category.name_hi : category.name_en}
              </div>
              <div className="font-devanagari" style={{ fontSize: "0.8125rem", color: "var(--gold)", fontWeight: 700 }}>
                🎁 {language === "hi" ? `इनाम: ${inspiration.blessingHi}` : `Reward: ${inspiration.blessingEn}`}
              </div>
            </div>
          </div>

          <p className="font-devanagari" style={{ fontSize: "0.875rem", color: "var(--text-primary)", fontWeight: 600, margin: 0, lineHeight: 1.4 }}>
            {language === "hi" 
              ? `आज "${category.name_hi}" सेक्शन के सभी ${totalCategoryQuestions} नियम पूरे करें और पाएँ ${inspiration.blessingHi}!`
              : `Complete ALL ${totalCategoryQuestions} Niyams in "${category.name_en}" today to get ${inspiration.blessingEn}!`}
          </p>
        </div>

        {/* Niyams Status List in this Category */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "16px" }}>
          <div className="font-devanagari" style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}>
            {language === "hi" ? `इस सेक्शन के नियम (${completedCategoryQuestions}/${totalCategoryQuestions} पूरे)` : `Niyams in this section (${completedCategoryQuestions}/${totalCategoryQuestions} done)`}
          </div>
          {categoryQuestions.map((q) => {
            const isDone = todayEntry.selectedIds.includes(q.id);
            return (
              <div 
                key={q.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "10px 12px",
                  borderRadius: "10px",
                  background: isDone ? "var(--emerald-dim)" : "var(--surface-overlay)",
                  border: `1px solid ${isDone ? "rgba(16, 185, 129, 0.25)" : "var(--surface-border)"}`,
                  fontSize: "0.875rem"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <div style={{ color: isDone ? "var(--emerald)" : "var(--text-muted)" }}>
                    {isDone ? <CheckCircle2 size={16} /> : <div style={{ width: "16px", height: "16px", borderRadius: "50%", border: "2px solid var(--text-muted)" }} />}
                  </div>
                  <span className="font-devanagari" style={{ fontWeight: isDone ? 700 : 500, color: isDone ? "var(--emerald)" : "var(--text-primary)" }}>
                    {language === "hi" ? q.title_hi : q.title_en}
                  </span>
                </div>
                <span style={{ fontSize: "0.75rem", fontWeight: 700, color: isDone ? "var(--emerald)" : "var(--brand)" }}>
                  +{q.points} XP
                </span>
              </div>
            );
          })}
        </div>

        {/* Progress Bar */}
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
            <span className="font-devanagari" style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-muted)" }}>
              {language === "hi" ? "सेक्शन प्रगति" : "Section Progress"}
            </span>
            <span className="font-devanagari" style={{ fontSize: "0.8125rem", fontWeight: 800, color: isCategoryComplete ? "var(--emerald)" : "var(--brand)" }}>
              {categoryProgressPct}%
            </span>
          </div>
          <div style={{ height: "10px", background: "var(--surface-border)", borderRadius: "5px", overflow: "hidden" }}>
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${categoryProgressPct}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              style={{ 
                height: "100%", 
                background: isCategoryComplete ? "var(--emerald)" : category.color,
                borderRadius: "5px"
              }}
            />
          </div>
          
          {/* Action Button */}
          <Link href="/habits" style={{ textDecoration: "none", display: "block", marginTop: "14px" }}>
            <button className="btn btn-primary" style={{ width: "100%", background: isCategoryComplete ? "var(--emerald)" : "var(--brand)", color: "#fff", padding: "12px" }}>
              {isCategoryComplete ? (
                <>
                  <CheckCircle2 size={18} />
                  <span className="font-devanagari">{language === "hi" ? "आशीर्वाद अनलॉक हो गया! (100% पूरा)" : "Blessing Unlocked! (100% Complete)"}</span>
                </>
              ) : (
                <>
                  <span className="font-devanagari">
                    {language === "hi" 
                      ? `नियम ट्रैक करें (${completedCategoryQuestions}/${totalCategoryQuestions} पूरे)`
                      : `Track Niyams (${completedCategoryQuestions}/${totalCategoryQuestions} complete)`}
                  </span>
                  <ChevronRight size={18} />
                </>
              )}
            </button>
          </Link>
        </div>
      </motion.div>

      {/* ── Stats Row ── */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ delay: 0.15 }}
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px" }}
      >
        {[
          { icon: Flame, iconBg: "rgba(200,80,20,0.1)", iconColor: "#C85010", value: stats?.current_streak ?? 0, labelHi: "स्ट्रीक", labelEn: "Streak" },
          { icon: Award, iconBg: "var(--gold-dim)", iconColor: "var(--gold)", value: stats?.total_xp ?? 0, labelHi: "कुल अंक", labelEn: "Total XP" },
          { icon: CalendarDays, iconBg: "var(--emerald-dim)", iconColor: "var(--emerald)", value: stats?.days_completed ?? 0, labelHi: "कुल दिन", labelEn: "Days" },
        ].map((stat, i) => (
          <div key={i} className="card" style={{ padding: "14px 10px", display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", textAlign: "center" }}>
            <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: stat.iconBg, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <stat.icon size={18} color={stat.iconColor} />
            </div>
            <div style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--text-primary)", fontFamily: "var(--font-sans)", lineHeight: 1 }}>
              {stat.value}
            </div>
            <div className="font-devanagari" style={{ fontSize: "0.6875rem", color: "var(--text-muted)", fontWeight: 600, letterSpacing: "0.03em" }}>
              {language === "hi" ? stat.labelHi : stat.labelEn}
            </div>
          </div>
        ))}
      </motion.div>

      {/* ── Quick Actions ── */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ delay: 0.2 }}
        style={{ display: "grid", gridTemplateColumns: "1fr", gap: "10px" }}
      >
        <Link href="/bonus" style={{ textDecoration: "none" }}>
          <div className="card card-interactive" style={{
            padding: "16px",
            background: "linear-gradient(140deg, rgba(160,98,42,0.06) 0%, rgba(160,98,42,0.02) 100%)",
            borderColor: "rgba(160,98,42,0.2)",
            display: "flex",
            alignItems: "center",
            gap: "16px"
          }}>
            <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "rgba(160,98,42,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Crown size={24} color="var(--gold)" />
            </div>
            <div style={{ flex: 1 }}>
              <div className="font-devanagari" style={{ fontSize: "1rem", fontWeight: 700, color: "var(--text-primary)", lineHeight: 1.3 }}>
                {language === "hi" ? "बोनस संकल्प" : "Bonus Sankalp"}
              </div>
              <div className="font-devanagari" style={{ fontSize: "0.8125rem", color: "var(--text-muted)", marginTop: "2px" }}>
                {language === "hi" ? "विशेष संकल्प देखें और स्वीकारें" : "View and accept special vows"}
              </div>
            </div>
            <ChevronRight size={18} color="var(--text-muted)" />
          </div>
        </Link>
      </motion.div>

      {/* ── Weekly Progress ── */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ delay: 0.25 }}
        className="card" 
        style={{ padding: "20px" }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
          <div>
            <h2 className="font-devanagari" style={{ fontSize: "0.9375rem", fontWeight: 700, color: "var(--text-primary)" }}>
              {language === "hi" ? "साप्ताहिक प्रगति" : "Weekly Progress"}
            </h2>
            <p className="font-devanagari" style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "1px" }}>
              {language === "hi" ? "पिछले ७ दिन" : "Past 7 days"}
            </p>
          </div>
          <Link href="/calendar" style={{ fontSize: "0.8125rem", color: "var(--brand)", fontWeight: 700, textDecoration: "none", display: "flex", alignItems: "center", gap: "3px" }}>
            <span className="font-devanagari">{language === "hi" ? "देखें" : "View"}</span>
            <ChevronRight size={14} />
          </Link>
        </div>
        <MiniCalendar language={language} />
      </motion.div>

      {/* ── Inspirational Banner ── */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ delay: 0.3 }}
        style={{
          background: "linear-gradient(135deg, var(--brand) 0%, #8B2418 100%)",
          borderRadius: "var(--r-xl)",
          padding: "20px",
          display: "flex", alignItems: "center", gap: "16px",
          boxShadow: "0 8px 28px var(--brand-glow)",
          position: "relative", overflow: "hidden"
        }}
      >
        <div style={{ position: "absolute", top: "-20px", right: "-20px", width: "100px", height: "100px", borderRadius: "50%", background: "rgba(255,255,255,0.06)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "-30px", left: "40%", width: "80px", height: "80px", borderRadius: "50%", background: "rgba(255,255,255,0.04)", pointerEvents: "none" }} />
        <Sparkles size={28} color="rgba(255,255,255,0.85)" />
        <div>
          <div className="font-devanagari" style={{ fontSize: "0.6875rem", color: "rgba(255,255,255,0.65)", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700, marginBottom: "3px" }}>
            {language === "hi" ? "आज का प्रेरणा वाक्य" : "Thought for the Day"}
          </div>
          <div className="font-devanagari" style={{ fontSize: "0.9375rem", fontWeight: 600, color: "#FFFFFF", lineHeight: 1.4 }}>
            {language === "hi" 
              ? "संयम ही सच्चा धर्म है।"
              : "Restraint is the truest dharma."
            }
          </div>
        </div>
      </motion.div>

    </div>
  );
}
