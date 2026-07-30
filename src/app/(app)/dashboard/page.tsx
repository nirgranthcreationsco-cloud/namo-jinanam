"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAuthStore } from "@/store/authStore";
import { useHabitStore } from "@/store/habitStore";
import { useLanguageStore } from "@/store/languageStore";
import { LEVELS, getLevelByXP } from "@/data/content";
import { 
  Moon, Sunrise, Sun, Sunset, 
  Flame, CalendarDays, Award, 
  CheckCircle2, ChevronRight, Sparkles, Crown
} from "lucide-react";

function getGreeting(language: "hi" | "en") {
  const h = new Date().getHours();
  if (language === "hi") {
    if (h < 6) return { text: "जय जिनेन्द्र", sub: "ब्रह्म मुहूर्त में जागरण करें", icon: Moon };
    if (h < 12) return { text: "जय जिनेन्द्र", sub: "आज की साधना शुरू करें", icon: Sunrise };
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
  const { getDayCompletionPct } = useHabitStore();
  const { language } = useLanguageStore();
  
  const today = new Date().toISOString().split("T")[0];
  const greeting = getGreeting(language);
  const GreetingIcon = greeting.icon;

  const todayPct = getDayCompletionPct(today);
  const level = stats ? getLevelByXP(stats.total_points) : LEVELS[0];

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
            {language === "hi" ? " जी 🙏" : ""}
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
            <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <Crown size={12} color="var(--gold)" />
              <span className="font-devanagari" style={{ fontSize: "0.625rem", fontWeight: 700, color: "var(--gold)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                {language === "hi" ? "स्तर" : "Level"}
              </span>
            </div>
            <span className="font-devanagari" style={{ fontSize: "0.875rem", fontWeight: 700, color: "#7A4A15" }}>
              {language === "hi" ? level.name_hi : level.name_en}
            </span>
          </div>
        </Link>
      </motion.div>

      {/* ── Progress Ring Card ── */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }} 
        animate={{ opacity: 1, scale: 1 }} 
        transition={{ delay: 0.08 }}
        className="card"
        style={{
          padding: "24px",
          background: "linear-gradient(160deg, #fff 0%, #FDF6EE 100%)",
          border: "1px solid var(--surface-border)"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
          {/* Ring */}
          <div style={{ position: "relative", flexShrink: 0 }}>
            <ProgressRing percentage={todayPct} size={120} color="var(--brand)" trackColor="var(--surface-overlay)" />
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <div style={{ fontSize: "1.625rem", fontWeight: 800, color: "var(--brand)", lineHeight: 1, fontFamily: "var(--font-sans)" }}>
                {todayPct}%
              </div>
            </div>
          </div>

          {/* Text */}
          <div style={{ flex: 1 }}>
            <div className="font-devanagari" style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "4px" }}>
              {language === "hi" ? "आज की साधना" : "Today's Sadhana"}
            </div>
            <div className="font-devanagari" style={{ fontSize: "1.125rem", fontWeight: 700, color: "var(--text-primary)", lineHeight: 1.3, marginBottom: "12px" }}>
              {todayPct === 0
                ? (language === "hi" ? "साधना शुरू करें!" : "Start your sadhana!")
                : todayPct === 100
                ? (language === "hi" ? "शत-प्रतिशत! वाह! 🎉" : "Perfect day! 🎉")
                : (language === "hi" ? "बढ़िया जा रहे हैं 👍" : "Keep going! 👍")
              }
            </div>

            <Link href="/habits" style={{ textDecoration: "none" }}>
              <button className="btn btn-primary btn-sm" style={{ borderRadius: "10px", padding: "9px 18px", fontSize: "0.875rem" }}>
                <CheckCircle2 size={15} />
                <span className="font-devanagari">{language === "hi" ? "आदतें ट्रैक करें" : "Track Habits"}</span>
                <ChevronRight size={14} />
              </button>
            </Link>
          </div>
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
          { icon: Flame, iconBg: "rgba(200,80,20,0.1)", iconColor: "#C85010", value: stats?.current_streak ?? 0, labelHi: "स्ट्रीक", labelEn: "Streak", unit: language === "hi" ? "🔥" : "🔥" },
          { icon: Award, iconBg: "var(--gold-dim)", iconColor: "var(--gold)", value: stats?.total_points ?? 0, labelHi: "कुल अंक", labelEn: "Total XP", unit: "⭐" },
          { icon: CalendarDays, iconBg: "var(--emerald-dim)", iconColor: "var(--emerald)", value: stats?.total_days_participated ?? 0, labelHi: "कुल दिन", labelEn: "Days", unit: "📅" },
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
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}
      >
        <Link href="/bonus" style={{ textDecoration: "none" }}>
          <div className="card card-interactive" style={{
            padding: "16px",
            background: "linear-gradient(140deg, rgba(160,98,42,0.06) 0%, rgba(160,98,42,0.02) 100%)",
            borderColor: "rgba(160,98,42,0.2)"
          }}>
            <Crown size={22} color="var(--gold)" style={{ marginBottom: "8px" }} />
            <div className="font-devanagari" style={{ fontSize: "0.9375rem", fontWeight: 700, color: "var(--text-primary)", lineHeight: 1.3 }}>
              {language === "hi" ? "बोनस पॉइंट्स" : "Bonus Points"}
            </div>
            <div className="font-devanagari" style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "4px" }}>
              {language === "hi" ? "विशेष संकल्प देखें" : "View special vows"}
            </div>
          </div>
        </Link>
        <Link href="/leaderboard" style={{ textDecoration: "none" }}>
          <div className="card card-interactive" style={{
            padding: "16px",
            background: "linear-gradient(140deg, rgba(92,26,16,0.06) 0%, rgba(92,26,16,0.02) 100%)",
            borderColor: "rgba(92,26,16,0.15)"
          }}>
            <Award size={22} color="var(--brand)" style={{ marginBottom: "8px" }} />
            <div className="font-devanagari" style={{ fontSize: "0.9375rem", fontWeight: 700, color: "var(--text-primary)", lineHeight: 1.3 }}>
              {language === "hi" ? "रैंकिंग" : "Leaderboard"}
            </div>
            <div className="font-devanagari" style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "4px" }}>
              {language === "hi" ? "अपनी रैंक देखें" : "Check your rank"}
            </div>
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
