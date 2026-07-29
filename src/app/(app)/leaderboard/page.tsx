"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useAuthStore } from "@/store/authStore";
import { Globe, Map, Building2, MapPin, Users, Crown, Flame, Star, Hexagon } from "lucide-react";

type FilterType = "global" | "state" | "city" | "temple" | "age_group";
type PeriodType = "today" | "week" | "month" | "overall";

const MOCK_LEADERS = [
  { rank: 1, name: "प्रिया जैन", city: "मुंबई", temple: "महावीर मंदिर", points: 28450, streak: 42, level: "जिनभक्त", avatar: "P", levelColor: "var(--brand)" },
  { rank: 2, name: "अमित शाह", city: "अहमदाबाद", temple: "आदिनाथ मंदिर", points: 24200, streak: 35, level: "धर्मरत्न", avatar: "A", levelColor: "var(--gold)" },
  { rank: 3, name: "सोनिया मेहता", city: "जयपुर", temple: "पार्श्वनाथ मंदिर", points: 21800, streak: 28, level: "धर्मरत्न", avatar: "S", levelColor: "var(--gold)" },
  { rank: 4, name: "राहुल देसाई", city: "सूरत", temple: "नेमिनाथ मंदिर", points: 18600, streak: 21, level: "संयमी", avatar: "R", levelColor: "#F59E0B" },
  { rank: 5, name: "अंजलि गुप्ता", city: "नागपुर", temple: "शांतिनाथ मंदिर", points: 16400, streak: 18, level: "संयमी", avatar: "A", levelColor: "#F59E0B" },
  { rank: 6, name: "विवेक पटेल", city: "पुणे", temple: "चंद्रप्रभु मंदिर", points: 14200, streak: 15, level: "उपासक", avatar: "V", levelColor: "#34D399" },
  { rank: 7, name: "नेहा सिंह", city: "भोपाल", temple: "महावीर मंदिर", points: 12800, streak: 12, level: "उपासक", avatar: "N", levelColor: "#34D399" },
  { rank: 8, name: "आयुष जैन", city: "इंदौर", temple: "आदिनाथ मंदिर", points: 11200, streak: 10, level: "साधक", avatar: "A", levelColor: "#6EE7B7" },
  { rank: 9, name: "कविता शर्मा", city: "उदयपुर", temple: "पार्श्वनाथ मंदिर", points: 9600, streak: 8, level: "साधक", avatar: "K", levelColor: "#6EE7B7" },
  { rank: 10, name: "देव शाह", city: "राजकोट", temple: "वासुपूज्य मंदिर", points: 8200, streak: 7, level: "श्रावक", avatar: "D", levelColor: "#94A3B8" },
];

const MY_RANK = {
  rank: 24,
  name: "राहुल जैन",
  city: "मुंबई",
  points: 4250,
  streak: 7,
  level: "साधक",
  avatar: "R",
  levelColor: "#6EE7B7",
};

const FILTERS: { id: FilterType; label: string; icon: any }[] = [
  { id: "global", label: "राष्ट्रीय", icon: Globe },
  { id: "state", label: "राज्य", icon: Map },
  { id: "city", label: "शहर", icon: Building2 },
  { id: "temple", label: "मंदिर", icon: MapPin },
  { id: "age_group", label: "आयु वर्ग", icon: Users },
];

const PERIODS: { id: PeriodType; label: string }[] = [
  { id: "today", label: "आज" },
  { id: "week", label: "सप्ताह" },
  { id: "month", label: "महीना" },
  { id: "overall", label: "सम्पूर्ण" },
];

function Podium({ leaders }: { leaders: typeof MOCK_LEADERS }) {
  const top3 = leaders.slice(0, 3);
  const order = [top3[1], top3[0], top3[2]]; // 2nd, 1st, 3rd
  const heights = ["120px", "160px", "100px"];
  const rankColors = ["#94A3B8", "var(--gold)", "#CD7C2A"];
  const rankNumbers = [2, 1, 3];

  return (
    <div
      className="card"
      style={{
        padding: "24px",
        marginBottom: "24px",
        background: "var(--surface-overlay)",
        borderColor: "var(--brand-glow)"
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "center", gap: "16px", paddingTop: "24px" }}>
        {order.map((leader, i) => (
          <motion.div
            key={leader.name}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.2, type: "spring", stiffness: 200 }}
            style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px", flex: 1 }}
          >
            {/* Avatar */}
            <div style={{ position: "relative" }}>
              {rankNumbers[i] === 1 && (
                <div style={{ position: "absolute", top: "-20px", left: "50%", transform: "translateX(-50%)", color: "var(--gold)" }}>
                  <Crown size={24} fill="currentColor" />
                </div>
              )}
              <div
                style={{
                  width: rankNumbers[i] === 1 ? "64px" : "48px",
                  height: rankNumbers[i] === 1 ? "64px" : "48px",
                  borderRadius: "50%",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: rankNumbers[i] === 1 ? "24px" : "18px",
                  fontWeight: 700,
                  border: `2px solid ${rankColors[i]}`,
                  background: "var(--surface-base)",
                  color: "var(--text-primary)"
                }}
              >
                {leader.avatar}
              </div>
            </div>

            <div style={{ textAlign: "center" }}>
              <div className="font-devanagari" style={{ fontWeight: 700, fontSize: "0.8125rem" }}>{leader.name.split(" ")[0]}</div>
              <div style={{ fontSize: "0.6875rem", color: "var(--gold)", fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", gap: "2px" }}>
                <Star size={10} fill="currentColor" /> {(leader.points / 1000).toFixed(1)}k
              </div>
            </div>

            {/* Bar */}
            <div
              style={{
                width: "100%", maxWidth: "70px",
                height: heights[i],
                background: rankNumbers[i] === 1
                  ? "linear-gradient(180deg, var(--gold-light), var(--gold))"
                  : rankNumbers[i] === 2
                  ? "linear-gradient(180deg, #94A3B8, #64748B)"
                  : "linear-gradient(180deg, #CD7C2A, #92400E)",
                borderRadius: "8px 8px 0 0",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "var(--surface-bg)", fontWeight: 900, fontSize: "1.5rem"
              }}
            >
              {rankNumbers[i]}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function LeaderRow({
  entry,
  isMe,
  delay = 0,
}: {
  entry: (typeof MOCK_LEADERS)[0] & { rank: number };
  isMe?: boolean;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.3 }}
      className="card"
      style={{
        display: "flex", alignItems: "center", gap: "16px", padding: "16px",
        background: isMe ? "var(--brand-dim)" : "var(--surface-raised)",
        borderColor: isMe ? "var(--brand)" : "var(--surface-border)",
        boxShadow: isMe ? "var(--shadow-glow)" : "none",
        marginBottom: "8px"
      }}
    >
      {/* Rank */}
      <div
        style={{
          width: "32px", height: "32px", borderRadius: "8px",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontWeight: 800, fontSize: "0.875rem", flexShrink: 0,
          background: entry.rank <= 3
            ? entry.rank === 1 ? "linear-gradient(135deg, var(--gold-light), var(--gold))"
              : entry.rank === 2 ? "linear-gradient(135deg, #94A3B8, #64748B)"
              : "linear-gradient(135deg, #CD7C2A, #92400E)"
            : "var(--surface-overlay)",
          color: entry.rank <= 3 ? "var(--surface-bg)" : "var(--text-secondary)",
        }}
      >
        {entry.rank}
      </div>

      {/* Avatar */}
      <div
        style={{
          width: "40px", height: "40px", borderRadius: "50%",
          background: "linear-gradient(135deg, var(--indigo), var(--lotus))",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "white", fontWeight: 700, fontSize: "1.125rem", flexShrink: 0
        }}
      >
        {entry.avatar}
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span className="font-devanagari" style={{ fontWeight: 700, fontSize: "0.9375rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {entry.name}
          </span>
          {isMe && (
            <span className="chip chip-brand" style={{ fontSize: "0.6875rem", padding: "2px 8px" }}>
              आप
            </span>
          )}
        </div>
        <div className="font-devanagari" style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ display: "flex", alignItems: "center", gap: "4px" }}><Hexagon size={10} /> {entry.temple}</span>
          <span style={{ display: "flex", alignItems: "center", gap: "4px", color: "var(--brand)" }}><Flame size={12} fill="currentColor" /> {entry.streak}</span>
        </div>
      </div>

      {/* Points */}
      <div style={{ textAlign: "right", flexShrink: 0 }}>
        <div style={{ fontWeight: 800, fontSize: "0.9375rem", color: "var(--gold)", display: "flex", alignItems: "center", gap: "4px", justifyContent: "flex-end" }}>
          <Star size={12} fill="currentColor" /> {entry.points.toLocaleString("hi-IN")}
        </div>
        <div
          className="font-devanagari"
          style={{ fontSize: "0.6875rem", fontWeight: 600, color: entry.levelColor }}
        >
          {entry.level}
        </div>
      </div>
    </motion.div>
  );
}

export default function LeaderboardPage() {
  const [activeFilter, setActiveFilter] = useState<FilterType>("global");
  const [activePeriod, setActivePeriod] = useState<PeriodType>("overall");

  return (
    <div className="page" style={{ padding: "16px 16px 40px" }}>
      {/* Filter tabs */}
      <div className="no-scrollbar" style={{ display: "flex", gap: "8px", overflowX: "auto", paddingBottom: "12px", marginBottom: "8px" }}>
        {FILTERS.map((f) => {
          const Icon = f.icon;
          const isActive = activeFilter === f.id;
          return (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id)}
              className="font-devanagari"
              style={{
                flexShrink: 0, display: "flex", alignItems: "center", gap: "8px",
                padding: "8px 16px", borderRadius: "var(--r-pill)",
                fontSize: "0.875rem", fontWeight: 600, transition: "all var(--dur-fast)",
                background: isActive ? "var(--brand)" : "var(--surface-raised)",
                color: isActive ? "#fff" : "var(--text-secondary)",
                border: `1px solid ${isActive ? "var(--brand)" : "var(--surface-border)"}`,
                boxShadow: isActive ? "var(--shadow-glow)" : "none",
                cursor: "pointer"
              }}
            >
              <Icon size={16} /> {f.label}
            </button>
          )
        })}
      </div>

      {/* Period tabs */}
      <div
        style={{
          display: "flex", gap: "4px", padding: "4px", borderRadius: "16px",
          background: "var(--surface-overlay)", marginBottom: "24px"
        }}
      >
        {PERIODS.map((p) => {
          const isActive = activePeriod === p.id;
          return (
            <button
              key={p.id}
              onClick={() => setActivePeriod(p.id)}
              className="font-devanagari"
              style={{
                flex: 1, padding: "8px", borderRadius: "12px",
                fontSize: "0.8125rem", fontWeight: 600, transition: "all var(--dur-fast)",
                background: isActive ? "var(--surface-raised)" : "transparent",
                color: isActive ? "var(--text-primary)" : "var(--text-muted)",
                border: "1px solid",
                borderColor: isActive ? "var(--surface-border)" : "transparent",
                cursor: "pointer"
              }}
            >
              {p.label}
            </button>
          );
        })}
      </div>

      {/* Podium (top 3) */}
      <Podium leaders={MOCK_LEADERS} />

      {/* List */}
      <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "16px" }}>
        {MOCK_LEADERS.map((entry, i) => (
          <LeaderRow key={entry.rank} entry={entry} delay={i * 0.04} />
        ))}
      </div>

      {/* My rank (sticky) */}
      <div
        style={{
          position: "sticky", bottom: "80px", zIndex: 30,
          background: "rgba(253, 251, 247, 0.95)", backdropFilter: "blur(20px)",
          borderRadius: "var(--r-xl)", padding: "12px",
          border: "1px solid var(--surface-border)",
          boxShadow: "var(--shadow-lg)"
        }}
      >
        <div className="font-devanagari" style={{ marginBottom: "8px", textAlign: "center", fontSize: "0.75rem", fontWeight: 600, color: "var(--text-muted)" }}>
          — आपकी रैंकिंग —
        </div>
        <LeaderRow entry={MY_RANK as any} isMe />
      </div>
    </div>
  );
}
