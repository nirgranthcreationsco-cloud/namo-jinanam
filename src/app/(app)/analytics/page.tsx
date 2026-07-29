"use client";

import { motion } from "framer-motion";
import { useAuthStore } from "@/store/authStore";
import { TrendingUp, Calendar, Zap, PieChart, Activity, BarChart3, Hexagon } from "lucide-react";

export default function AnalyticsPage() {
  const { stats } = useAuthStore();

  if (!stats) return null;

  // Mock chart data
  const days = ["सोम", "मंगल", "बुध", "गुरु", "शुक्र", "शनि", "रवि"];
  const weeklyData = [12, 18, 15, 22, 14, 25, 20];
  const maxVal = Math.max(...weeklyData);

  const categories = [
    { name: "आहार", pct: 85, color: "var(--emerald)" },
    { name: "तकनीक", pct: 60, color: "var(--indigo)" },
    { name: "आध्यात्म", pct: 90, color: "var(--lotus)" },
    { name: "सुबह", pct: 75, color: "var(--brand)" },
  ];

  return (
    <div className="page" style={{ padding: "16px 16px 40px", display: "flex", flexDirection: "column", gap: "24px" }}>
      
      {/* ── Key Metrics ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "12px" }}>
        <div className="card" style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "12px" }}>
          <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "var(--brand-dim)", color: "var(--brand)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <TrendingUp size={20} />
          </div>
          <div>
            <div className="stat-num" style={{ fontSize: "1.5rem" }}>82%</div>
            <div className="font-devanagari" style={{ fontSize: "0.8125rem", color: "var(--text-muted)", marginTop: "4px" }}>औसत पूर्णता</div>
          </div>
        </div>

        <div className="card" style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "12px" }}>
          <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "rgba(16,185,129,0.15)", color: "var(--emerald)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Calendar size={20} />
          </div>
          <div>
            <div className="stat-num" style={{ fontSize: "1.5rem" }}>{stats.total_days_participated}</div>
            <div className="font-devanagari" style={{ fontSize: "0.8125rem", color: "var(--text-muted)", marginTop: "4px" }}>सक्रिय दिन</div>
          </div>
        </div>
      </div>

      {/* ── Weekly Performance Chart ── */}
      <div className="card" style={{ padding: "24px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "32px" }}>
          <div>
            <h2 className="heading-sm font-devanagari">साप्ताहिक प्रगति</h2>
            <div className="font-devanagari" style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "2px" }}>अंतिम 7 दिन</div>
          </div>
          <div className="chip chip-gold">
            <Zap size={14} fill="currentColor" /> +140 XP
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", height: "160px", gap: "8px", position: "relative" }}>
          {/* Grid lines */}
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", justifyContent: "space-between", pointerEvents: "none", opacity: 0.1 }}>
            <div style={{ height: "1px", background: "var(--text-primary)", width: "100%" }} />
            <div style={{ height: "1px", background: "var(--text-primary)", width: "100%" }} />
            <div style={{ height: "1px", background: "var(--text-primary)", width: "100%" }} />
          </div>

          {weeklyData.map((val, i) => {
            const heightPct = (val / maxVal) * 100;
            const isToday = i === 6;
            
            return (
              <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "12px", zIndex: 1 }}>
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: `${heightPct}%`, opacity: 1 }}
                  transition={{ duration: 0.8, delay: i * 0.1, ease: "easeOut" }}
                  style={{
                    width: "100%", maxWidth: "32px", borderRadius: "6px 6px 0 0",
                    background: isToday ? "var(--brand)" : "var(--surface-overlay)",
                    border: isToday ? "none" : "1px solid var(--surface-border)",
                    borderBottom: "none"
                  }}
                />
                <div className="font-devanagari" style={{ fontSize: "0.6875rem", fontWeight: isToday ? 700 : 500, color: isToday ? "var(--brand)" : "var(--text-muted)" }}>
                  {days[i]}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Category Breakdown ── */}
      <div className="card" style={{ padding: "24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "24px" }}>
          <PieChart size={20} color="var(--text-secondary)" />
          <h2 className="heading-sm font-devanagari">श्रेणी विश्लेषण</h2>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {categories.map((cat, i) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              style={{ display: "flex", alignItems: "center", gap: "16px" }}
            >
              <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: `${cat.color}15`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Activity size={16} color={cat.color} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                  <span className="font-devanagari" style={{ fontSize: "0.875rem", fontWeight: 600 }}>{cat.name}</span>
                  <span style={{ fontSize: "0.8125rem", fontWeight: 700, color: cat.color }}>{cat.pct}%</span>
                </div>
                <div className="progress-track" style={{ background: "var(--surface-overlay)" }}>
                  <motion.div
                    className="progress-fill"
                    style={{ background: cat.color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${cat.pct}%` }}
                    transition={{ duration: 1, delay: 0.5 + i * 0.1 }}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── Heatmap Placeholder ── */}
      <div className="card" style={{ padding: "24px", textAlign: "center" }}>
        <BarChart3 size={32} color="var(--surface-border-md)" style={{ margin: "0 auto 16px" }} />
        <h3 className="heading-sm font-devanagari" style={{ marginBottom: "8px", color: "var(--text-primary)" }}>
          विस्तृत रिपोर्ट
        </h3>
        <p className="body-sm font-devanagari" style={{ color: "var(--text-muted)" }}>
          चार्ट डेटा अपडेट हो रहा है...
        </p>
      </div>
    </div>
  );
}
