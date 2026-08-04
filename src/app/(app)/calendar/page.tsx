"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useHabitStore } from "@/store/habitStore";
import { useLanguageStore } from "@/store/languageStore";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getISTDateString } from "@/lib/date";

export default function CalendarPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const { getDayCompletionPct } = useHabitStore();
  const { language } = useLanguageStore();

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };
  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const startDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();
  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();

  const days = [];
  for (let i = 0; i < startDay; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) {
    const d = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i);
    const dateStr = d.toISOString().split("T")[0];
    const pct = getDayCompletionPct(dateStr);
    days.push({ day: i, dateStr, pct, d });
  }

  const today = getISTDateString();

  return (
    <div className="page" style={{ padding: "20px 16px 100px" }}>
      
      {/* ── Header ── */}
      <div className="card" style={{ padding: "20px", marginBottom: "24px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
          <button onClick={prevMonth} className="btn-ghost" style={{ padding: "8px", borderRadius: "50%", background: "var(--surface-overlay)", color: "var(--text-primary)", border: "none" }}>
            <ChevronLeft size={20} />
          </button>
          <div className="font-devanagari heading-md" style={{ color: "var(--text-primary)" }}>
            {currentMonth.toLocaleDateString(language === "hi" ? "hi-IN" : "en-US", { month: "long", year: "numeric" })}
          </div>
          <button onClick={nextMonth} className="btn-ghost" style={{ padding: "8px", borderRadius: "50%", background: "var(--surface-overlay)", color: "var(--text-primary)", border: "none" }}>
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Calendar Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "8px", marginBottom: "12px" }}>
          {(language === "hi" 
            ? ["र", "सो", "मं", "बु", "गु", "शु", "श"] 
            : ["S", "M", "T", "W", "T", "F", "S"]
          ).map((day, i) => (
            <div key={i} className="font-devanagari" style={{ textAlign: "center", fontSize: "0.75rem", fontWeight: 600, color: "var(--text-muted)", paddingBottom: "8px" }}>
              {day}
            </div>
          ))}
        </div>
        
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "8px" }}>
          {days.map((item, i) => {
            if (!item) return <div key={i} />;
            
            const isToday = item.dateStr === today;
            const isFuture = item.d > new Date();
            let statusClass = "cal-future";
            let opacity = 1;

            if (isFuture) {
              opacity = 0.3;
            } else if (item.pct >= 100) {
              statusClass = "cal-done";
            } else if (item.pct >= 50) {
              statusClass = "cal-partial";
            } else if (item.pct > 0) {
              statusClass = "cal-missed";
            }

            if (isToday) statusClass = "cal-today";

            return (
              <motion.div
                key={i}
                whileHover={!isFuture ? { scale: 1.15, zIndex: 10 } : {}}
                className={`cal-cell ${statusClass}`}
                style={{
                  width: "100%", height: "auto", aspectRatio: "1",
                  fontSize: "0.875rem", opacity,
                  border: isToday ? "2px solid var(--brand-light)" : "none",
                  boxShadow: isToday ? "var(--shadow-glow)" : "none"
                }}
              >
                {item.day}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* ── Legend ── */}
      <div className="card" style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "12px" }}>
        <h3 className="heading-sm font-devanagari" style={{ color: "var(--text-secondary)", marginBottom: "4px" }}>
          {language === "hi" ? "संकेत" : "Legend"}
        </h3>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "0.8125rem", color: "var(--text-primary)" }}>
          <div className="cal-cell cal-done" style={{ width: "20px", height: "20px" }} /> 
          <span className="font-devanagari">{language === "hi" ? "100% पूर्ण" : "100% Completed"}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "0.8125rem", color: "var(--text-primary)" }}>
          <div className="cal-cell cal-partial" style={{ width: "20px", height: "20px" }} /> 
          <span className="font-devanagari">{language === "hi" ? "50%+ पूर्ण" : "50%+ Completed"}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "0.8125rem", color: "var(--text-primary)" }}>
          <div className="cal-cell cal-missed" style={{ width: "20px", height: "20px" }} /> 
          <span className="font-devanagari">{language === "hi" ? "आंशिक / छूटा" : "Partial / Missed"}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "0.8125rem", color: "var(--text-primary)" }}>
          <div className="cal-cell cal-today" style={{ width: "20px", height: "20px" }} /> 
          <span className="font-devanagari">{language === "hi" ? "आज" : "Today"}</span>
        </div>
      </div>

    </div>
  );
}
