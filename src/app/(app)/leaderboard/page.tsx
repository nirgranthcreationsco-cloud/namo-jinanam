"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useAuthStore } from "@/store/authStore";
import { useLanguageStore } from "@/store/languageStore";
import { Globe, Map, Building2, MapPin, Users, Crown, Flame, Star, Hexagon } from "lucide-react";

type FilterType = "global" | "state" | "city" | "temple" | "age_group";
type PeriodType = "today" | "week" | "month" | "overall";

const LEVEL_TRANSLATIONS: Record<string, { hi: string; en: string }> = {
  "जिनभक्त": { hi: "जिनभक्त", en: "Jinbhakt" },
  "धर्मरत्न": { hi: "धर्मरत्न", en: "Dharmaratna" },
  "संयमी": { hi: "संयमी", en: "Samyami" },
  "उपासक": { hi: "उपासक", en: "Upasak" },
  "साधक": { hi: "साधक", en: "Sadhak" },
  "श्रावक": { hi: "श्रावक", en: "Shravak" },
};

const MOCK_LEADERS = [
  { rank: 1, name: "प्रिया जैन", name_en: "Priya Jain", city: "मुंबई", city_en: "Mumbai", temple: "महावीर मंदिर", temple_en: "Mahavir Temple", points: 28450, streak: 42, level: "जिनभक्त", avatar: "P", levelColor: "var(--brand)" },
  { rank: 2, name: "अमित शाह", name_en: "Amit Shah", city: "अहमदाबाद", city_en: "Ahmedabad", temple: "आदिनाथ मंदिर", temple_en: "Adinath Temple", points: 24200, streak: 35, level: "धर्मरत्न", avatar: "A", levelColor: "var(--gold)" },
  { rank: 3, name: "सोनिया मेहता", name_en: "Sonia Mehta", city: "जयपुर", city_en: "Jaipur", temple: "पार्श्वनाथ मंदिर", temple_en: "Parshvanath Temple", points: 21800, streak: 28, level: "धर्मरत्न", avatar: "S", levelColor: "var(--gold)" },
  { rank: 4, name: "राहुल देसाई", name_en: "Rahul Desai", city: "सूरत", city_en: "Surat", temple: "नेमिनाथ मंदिर", temple_en: "Neminath Temple", points: 18600, streak: 21, level: "संयमी", avatar: "R", levelColor: "#F59E0B" },
  { rank: 5, name: "अंजलि गुप्ता", name_en: "Anjali Gupta", city: "नागपुर", city_en: "Nagpur", temple: "शांतिनाथ मंदिर", temple_en: "Shantinath Temple", points: 16400, streak: 18, level: "संयमी", avatar: "A", levelColor: "#F59E0B" },
  { rank: 6, name: "विवेक पटेल", name_en: "Vivek Patel", city: "पुणे", city_en: "Pune", temple: "चंद्रप्रभु मंदिर", temple_en: "Chandraprabhu Temple", points: 14200, streak: 15, level: "उपासक", avatar: "V", levelColor: "#34D399" },
  { rank: 7, name: "नेहा सिंह", name_en: "Neha Singh", city: "भोपाल", city_en: "Bhopal", temple: "महावीर मंदिर", temple_en: "Mahavir Temple", points: 12800, streak: 12, level: "उपासक", avatar: "N", levelColor: "#34D399" },
  { rank: 8, name: "आयुष जैन", name_en: "Ayush Jain", city: "इंदौर", city_en: "Indore", temple: "आदिनाथ मंदिर", temple_en: "Adinath Temple", points: 11200, streak: 10, level: "साधक", avatar: "A", levelColor: "#6EE7B7" },
  { rank: 9, name: "कविता शर्मा", name_en: "Kavita Sharma", city: "उदयपुर", city_en: "Udaipur", temple: "पार्श्वनाथ मंदिर", temple_en: "Parshvanath Temple", points: 9600, streak: 8, level: "साधक", avatar: "K", levelColor: "#6EE7B7" },
  { rank: 10, name: "देव शाह", name_en: "Dev Shah", city: "राजकोट", city_en: "Rajkot", temple: "वासुपूज्य मंदिर", temple_en: "Vasupujya Temple", points: 8200, streak: 7, level: "श्रावक", avatar: "D", levelColor: "#94A3B8" },
];

const MY_RANK = {
  rank: 24,
  name: "राहुल जैन",
  name_en: "Rahul Jain",
  city: "मुंबई",
  city_en: "Mumbai",
  temple: "महावीर मंदिर",
  temple_en: "Mahavir Temple",
  points: 4250,
  streak: 7,
  level: "साधक",
  avatar: "R",
  levelColor: "#6EE7B7",
};

const FILTERS: { id: FilterType; labelHi: string; labelEn: string; icon: any }[] = [
  { id: "global", labelHi: "राष्ट्रीय", labelEn: "Global", icon: Globe },
  { id: "state", labelHi: "राज्य", labelEn: "State", icon: Map },
  { id: "city", labelHi: "शहर", labelEn: "City", icon: Building2 },
  { id: "temple", labelHi: "मंदिर", labelEn: "Temple", icon: MapPin },
  { id: "age_group", labelHi: "आयु वर्ग", labelEn: "Age Group", icon: Users },
];

const PERIODS: { id: PeriodType; labelHi: string; labelEn: string }[] = [
  { id: "today", labelHi: "आज", labelEn: "Today" },
  { id: "week", labelHi: "सप्ताह", labelEn: "Week" },
  { id: "month", labelHi: "महीना", labelEn: "Month" },
  { id: "overall", labelHi: "सम्पूर्ण", labelEn: "Overall" },
];

function Podium({ leaders, language }: { leaders: typeof MOCK_LEADERS; language: "hi" | "en" }) {
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
              <div className="font-devanagari" style={{ fontWeight: 700, fontSize: "0.8125rem" }}>
                {language === "hi" ? leader.name.split(" ")[0] : leader.name_en.split(" ")[0]}
              </div>
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
  language,
}: {
  entry: (typeof MOCK_LEADERS)[0] & { rank: number; name_en: string; temple_en: string };
  isMe?: boolean;
  delay?: number;
  language: "hi" | "en";
}) {
  const levelText = LEVEL_TRANSLATIONS[entry.level]
    ? (language === "hi" ? LEVEL_TRANSLATIONS[entry.level].hi : LEVEL_TRANSLATIONS[entry.level].en)
    : entry.level;

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
            {language === "hi" ? entry.name : entry.name_en}
          </span>
          {isMe && (
            <span className="chip chip-brand" style={{ fontSize: "0.6875rem", padding: "2px 8px" }}>
              {language === "hi" ? "आप" : "You"}
            </span>
          )}
        </div>
        <div className="font-devanagari" style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ display: "flex", alignItems: "center", gap: "4px" }}><Hexagon size={10} /> {language === "hi" ? entry.temple : entry.temple_en}</span>
          <span style={{ display: "flex", alignItems: "center", gap: "4px", color: "var(--brand)" }}><Flame size={12} fill="currentColor" /> {entry.streak}</span>
        </div>
      </div>

      {/* Points */}
      <div style={{ textAlign: "right", flexShrink: 0 }}>
        <div style={{ fontWeight: 800, fontSize: "0.9375rem", color: "var(--gold)", display: "flex", alignItems: "center", gap: "4px", justifyContent: "flex-end" }}>
          <Star size={12} fill="currentColor" /> {entry.points.toLocaleString(language === "hi" ? "hi-IN" : "en-US")}
        </div>
        <div
          className="font-devanagari"
          style={{ fontSize: "0.6875rem", fontWeight: 600, color: entry.levelColor }}
        >
          {levelText}
        </div>
      </div>
    </motion.div>
  );
}

export default function LeaderboardPage() {
  const [activeFilter, setActiveFilter] = useState<FilterType>("global");
  const [activePeriod, setActivePeriod] = useState<PeriodType>("overall");
  const { language } = useLanguageStore();

  return (
    <div className="page" style={{ padding: "16px 16px 100px" }}>
      {/* Title */}
      <div style={{ textAlign: "center", marginBottom: "24px", padding: "12px", background: "var(--surface-overlay)", borderRadius: "var(--r-xl)", border: "1px solid var(--surface-border)" }}>
        <h1 className="heading-lg font-devanagari" style={{ color: "var(--brand)", marginBottom: "4px" }}>
          {language === "hi" ? "आयु वर्ग रैंकिंग" : "Age Group Ranking"}
        </h1>
        <p className="font-devanagari" style={{ fontSize: "0.8125rem", color: "var(--text-secondary)" }}>
          {language === "hi" ? "समान आयु वर्ग के प्रतिभागियों के साथ आपकी रैंकिंग" : "Your ranking among participants in your age group"}
        </p>
      </div>

      {/* Podium (top 3) */}
      <Podium leaders={MOCK_LEADERS} language={language} />

      {/* List */}
      <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "16px" }}>
        {MOCK_LEADERS.map((entry, i) => (
          <LeaderRow key={entry.rank} entry={entry as any} delay={i * 0.04} language={language} />
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
          {language === "hi" ? "— आपकी रैंकिंग —" : "— Your Ranking —"}
        </div>
        <LeaderRow entry={MY_RANK as any} isMe language={language} />
      </div>
    </div>
  );
}
