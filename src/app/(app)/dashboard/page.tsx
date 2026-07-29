"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAuthStore } from "@/store/authStore";
import { useHabitStore } from "@/store/habitStore";
import { LEVELS, getLevelByXP } from "@/data/content";
import { 
  Moon, Sunrise, Sun, Sunset, 
  Flame, CalendarDays, Award, 
  CheckCircle2, ChevronRight
} from "lucide-react";

function getGreeting() {
  const h = new Date().getHours();
  if (h < 6) return { text: "शुभ रात्रि", sub: "भगवान आपकी रक्षा करें", icon: Moon };
  if (h < 12) return { text: "जय जिनेन्द्र", sub: "आज की साधना शुरू करें", icon: Sunrise };
  if (h < 17) return { text: "नमोऽस्तु", sub: "साधना में एकाग्र रहें", icon: Sun };
  if (h < 20) return { text: "शाम का नमन", sub: "संध्या वंदना का समय", icon: Sunset };
  return { text: "जय जिनेन्द्र", sub: "प्रतिक्रमण करें और सोएं", icon: Moon };
}

function ProgressRing({ percentage, size = 140, color = "var(--brand)" }: { percentage: number; size?: number; color?: string }) {
  const radius = (size - 20) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle
        cx={size / 2} cy={size / 2} r={radius}
        fill="none" stroke="var(--surface-overlay)" strokeWidth="12"
      />
      <circle
        cx={size / 2} cy={size / 2} r={radius}
        fill="none" stroke={color} strokeWidth="12"
        strokeDasharray={circumference} strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transform: `rotate(-90deg)`, transformOrigin: "center", transition: "stroke-dashoffset 1s ease-out" }}
      />
    </svg>
  );
}

function MiniCalendar() {
  const today = new Date();
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() - 6 + i);
    return d;
  });

  const dayNames = ["र", "सो", "मं", "बु", "गु", "शु", "श"];

  return (
    <div style={{ display: "flex", gap: "8px", justifyContent: "space-between" }}>
      {days.map((day, i) => {
        const isToday = day.toDateString() === today.toDateString();
        const isPast = day < today && !isToday;
        // In a real app, this status would come from the store. 
        // For now, we mock the past days.
        const rand = Math.random();
        const status = isPast ? (rand > 0.3 ? "cal-done" : rand > 0.15 ? "cal-partial" : "cal-missed") : isToday ? "cal-today" : "cal-future";

        return (
          <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
            <span className="font-devanagari" style={{ fontSize: "0.6875rem", color: isToday ? "var(--brand)" : "var(--text-muted)", fontWeight: isToday ? 700 : 500 }}>
              {dayNames[day.getDay()]}
            </span>
            <div className={`cal-cell ${status}`} style={{ width: "36px", height: "36px", fontSize: "0.875rem" }}>
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
  
  const today = new Date().toISOString().split("T")[0];
  const greeting = getGreeting();
  const GreetingIcon = greeting.icon;

  const todayPct = getDayCompletionPct(today);
  const level = stats ? getLevelByXP(stats.total_points) : LEVELS[0];

  return (
    <div className="page" style={{ padding: "16px 16px 40px", display: "flex", flexDirection: "column", gap: "24px" }}>
      
      {/* ── Top Header Section (Clean & Minimal) ── */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px", color: "var(--brand)" }}>
            <GreetingIcon size={16} />
            <span className="font-devanagari" style={{ fontSize: "0.875rem", fontWeight: 600 }}>{greeting.text}</span>
          </div>
          <h1 className="heading-xl font-devanagari" style={{ color: "var(--text-primary)" }}>
            {profile?.full_name?.split(" ")[0] ?? "साधक"} जी
          </h1>
        </div>
        
        {/* Level Badge */}
        <div style={{ textAlign: "right" }}>
          <Link href="/profile" style={{ textDecoration: "none" }}>
            <div className="chip chip-gold" style={{ display: "inline-flex", padding: "6px 12px", borderRadius: "100px" }}>
              <Award size={14} />
              <span className="font-devanagari">{level.name_hi}</span>
            </div>
          </Link>
        </div>
      </motion.div>

      {/* ── Main Daily Ring (Apple Fitness Style) ── */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}
        style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "32px 0 16px" }}
      >
        <div style={{ position: "relative" }}>
          <ProgressRing percentage={todayPct} size={180} color="var(--brand)" />
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <div style={{ fontSize: "2.5rem", fontWeight: 800, color: "var(--brand)", lineHeight: 1 }}>{todayPct}%</div>
            <div className="font-devanagari" style={{ fontSize: "0.875rem", color: "var(--text-muted)", fontWeight: 500, marginTop: "4px" }}>
              आज की साधना
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── Primary CTA ── */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Link href="/habits" style={{ textDecoration: "none" }}>
          <button className="btn btn-primary" style={{ width: "100%", padding: "18px", borderRadius: "var(--r-xl)", display: "flex", justifyContent: "space-between", alignItems: "center", background: "var(--brand)", boxShadow: "0 8px 24px var(--brand-glow)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <CheckCircle2 size={24} />
              <span className="font-devanagari" style={{ fontSize: "1.125rem", fontWeight: 600 }}>आदतें ट्रैक करें</span>
            </div>
            <ChevronRight size={20} />
          </button>
        </Link>
      </motion.div>

      {/* ── Mini Stats Row (Ultra Clean) ── */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        style={{ display: "flex", gap: "12px" }}
      >
        <div className="card" style={{ flex: 1, padding: "16px", display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
          <Flame size={20} color="var(--brand)" />
          <div style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--text-primary)" }}>{stats?.current_streak ?? 0}</div>
          <div className="font-devanagari text-muted" style={{ fontSize: "0.75rem" }}>स्ट्रीक</div>
        </div>
        <div className="card" style={{ flex: 1, padding: "16px", display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
          <Award size={20} color="var(--gold)" />
          <div style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--text-primary)" }}>{stats?.total_points ?? 0}</div>
          <div className="font-devanagari text-muted" style={{ fontSize: "0.75rem" }}>कुल अंक</div>
        </div>
        <div className="card" style={{ flex: 1, padding: "16px", display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
          <CalendarDays size={20} color="var(--emerald)" />
          <div style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--text-primary)" }}>{stats?.total_days_participated ?? 0}</div>
          <div className="font-devanagari text-muted" style={{ fontSize: "0.75rem" }}>कुल दिन</div>
        </div>
      </motion.div>

      {/* ── Mini Calendar ── */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
        className="card" style={{ padding: "20px" }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
          <h2 className="heading-sm font-devanagari">साप्ताहिक प्रगति</h2>
          <Link href="/calendar" style={{ fontSize: "0.8125rem", color: "var(--brand)", fontWeight: 600, textDecoration: "none" }}>
            कैलेंडर देखें
          </Link>
        </div>
        <MiniCalendar />
      </motion.div>

    </div>
  );
}
