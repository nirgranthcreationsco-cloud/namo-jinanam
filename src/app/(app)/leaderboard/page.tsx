"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getLeaderboard, LeaderboardUser } from "@/app/actions/leaderboard";
import { useLanguageStore } from "@/store/languageStore";
import { Trophy, Crown, Flame, Star, Award, MapPin, Sparkles } from "lucide-react";

export default function LeaderboardPage() {
  const { language } = useLanguageStore();
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  const [userRank, setUserRank] = useState<LeaderboardUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const res = await getLeaderboard();
      if (res.success) {
        setLeaderboard(res.leaderboard);
        setUserRank(res.currentUserRank);
      }
      setLoading(false);
    }
    loadData();
  }, []);

  const firstPlace = leaderboard[0];
  const secondPlace = leaderboard[1];
  const thirdPlace = leaderboard[2];
  const remainingList = leaderboard.slice(3);

  return (
    <div className="page" style={{ padding: "20px 16px 120px", display: "flex", flexDirection: "column", gap: "20px" }}>
      {/* ── Top Header Banner ── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="card"
        style={{
          padding: "24px 20px",
          textAlign: "center",
          background: "linear-gradient(135deg, #4B1D15 0%, #7C2D12 100%)",
          color: "#fff",
          boxShadow: "0 12px 32px rgba(92,26,16,0.25)",
          borderRadius: "20px",
          position: "relative",
          overflow: "hidden"
        }}
      >
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
          <Crown size={24} color="#FBBF24" />
          <span className="font-devanagari" style={{ fontSize: "0.8125rem", fontWeight: 700, color: "#FDE68A", letterSpacing: "0.08em", textTransform: "uppercase" }}>
            {language === "hi" ? "६०-दिवसीय साधना महाभियान" : "60-Day Sadhana Campaign"}
          </span>
          <Crown size={24} color="#FBBF24" />
        </div>

        <h1 className="font-devanagari" style={{ fontSize: "1.5rem", fontWeight: 800, margin: "0 0 6px", textShadow: "0 2px 10px rgba(0,0,0,0.3)" }}>
          {language === "hi" ? "शीर्ष साधक (Top Performers)" : "Top Performers Leaderboard"}
        </h1>

        <p className="font-devanagari" style={{ fontSize: "0.8125rem", color: "rgba(255,245,220,0.85)", margin: 0 }}>
          {language === "hi"
            ? "चातुर्मास अभियान में उच्चतम अंक अर्जित करने वाले शीर्ष साधक"
            : "Top seekers earning the highest spiritual points during Chaturmas"}
        </p>
      </motion.div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "40px 0", color: "var(--text-muted)" }} className="font-devanagari">
          {language === "hi" ? "शीर्ष साधकों की सूची लोड हो रही है..." : "Loading top performers..."}
        </div>
      ) : (
        <>
          {/* ── Top 3 Podium ── */}
          {leaderboard.length > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "flex-end",
                gap: "10px",
                margin: "10px 0 10px",
                padding: "0 4px"
              }}
            >
              {/* 2nd Place (Silver) */}
              {secondPlace && (
                <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <div style={{ fontSize: "1.5rem", marginBottom: "-6px" }}>🥈</div>
                  <div
                    style={{
                      width: "56px",
                      height: "56px",
                      borderRadius: "50%",
                      background: "linear-gradient(135deg, #E2E8F0, #94A3B8)",
                      border: "3px solid #CBD5E1",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 6px 16px rgba(0,0,0,0.15)",
                      fontWeight: 800,
                      fontSize: "1.25rem",
                      color: "#334155"
                    }}
                  >
                    {secondPlace.fullName.charAt(0)}
                  </div>
                  <div className="font-devanagari" style={{ fontSize: "0.8125rem", fontWeight: 700, marginTop: "6px", textAlign: "center", maxWidth: "90px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {secondPlace.fullName.split(" ")[0]}
                  </div>
                  <div className="font-devanagari" style={{ fontSize: "0.6875rem", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "2px" }}>
                    <MapPin size={10} /> {secondPlace.city}
                  </div>
                  <div
                    className="card"
                    style={{
                      width: "100%",
                      height: "75px",
                      marginTop: "8px",
                      background: "linear-gradient(180deg, #F1F5F9 0%, #CBD5E1 100%)",
                      borderRadius: "12px 12px 0 0",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      border: "1px solid #CBD5E1"
                    }}
                  >
                    <span style={{ fontSize: "1rem", fontWeight: 800, color: "#334155" }}>#2</span>
                    <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#475569" }}>{secondPlace.totalXp} XP</span>
                  </div>
                </div>
              )}

              {/* 1st Place (Gold) */}
              {firstPlace && (
                <div style={{ flex: 1.1, display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <Crown size={28} color="#F59E0B" fill="#FBBF24" style={{ marginBottom: "-4px" }} />
                  <div
                    style={{
                      width: "68px",
                      height: "68px",
                      borderRadius: "50%",
                      background: "linear-gradient(135deg, #FEF3C7, #F59E0B)",
                      border: "3.5px solid #FBBF24",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 8px 24px rgba(245,158,11,0.35)",
                      fontWeight: 800,
                      fontSize: "1.5rem",
                      color: "#78350F"
                    }}
                  >
                    {firstPlace.fullName.charAt(0)}
                  </div>
                  <div className="font-devanagari" style={{ fontSize: "0.9375rem", fontWeight: 800, marginTop: "6px", textAlign: "center", maxWidth: "100px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: "var(--brand)" }}>
                    {firstPlace.fullName.split(" ")[0]}
                  </div>
                  <div className="font-devanagari" style={{ fontSize: "0.6875rem", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "2px" }}>
                    <MapPin size={10} /> {firstPlace.city}
                  </div>
                  <div
                    className="card"
                    style={{
                      width: "100%",
                      height: "95px",
                      marginTop: "8px",
                      background: "linear-gradient(180deg, #FEF3C7 0%, #F59E0B 100%)",
                      borderRadius: "14px 14px 0 0",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      border: "1.5px solid #FBBF24",
                      boxShadow: "0 6px 20px rgba(245,158,11,0.25)"
                    }}
                  >
                    <span style={{ fontSize: "1.25rem", fontWeight: 800, color: "#78350F" }}>👑 #1</span>
                    <span style={{ fontSize: "0.875rem", fontWeight: 800, color: "#78350F" }}>{firstPlace.totalXp} XP</span>
                  </div>
                </div>
              )}

              {/* 3rd Place (Bronze) */}
              {thirdPlace && (
                <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <div style={{ fontSize: "1.5rem", marginBottom: "-6px" }}>🥉</div>
                  <div
                    style={{
                      width: "56px",
                      height: "56px",
                      borderRadius: "50%",
                      background: "linear-gradient(135deg, #FFEDD5, #D97706)",
                      border: "3px solid #F59E0B",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 6px 16px rgba(0,0,0,0.12)",
                      fontWeight: 800,
                      fontSize: "1.25rem",
                      color: "#78350F"
                    }}
                  >
                    {thirdPlace.fullName.charAt(0)}
                  </div>
                  <div className="font-devanagari" style={{ fontSize: "0.8125rem", fontWeight: 700, marginTop: "6px", textAlign: "center", maxWidth: "90px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {thirdPlace.fullName.split(" ")[0]}
                  </div>
                  <div className="font-devanagari" style={{ fontSize: "0.6875rem", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "2px" }}>
                    <MapPin size={10} /> {thirdPlace.city}
                  </div>
                  <div
                    className="card"
                    style={{
                      width: "100%",
                      height: "60px",
                      marginTop: "8px",
                      background: "linear-gradient(180deg, #FFEDD5 0%, #D97706 100%)",
                      borderRadius: "12px 12px 0 0",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      border: "1px solid #D97706"
                    }}
                  >
                    <span style={{ fontSize: "1rem", fontWeight: 800, color: "#fff" }}>#3</span>
                    <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#fff" }}>{thirdPlace.totalXp} XP</span>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* ── Remaining Top Performers (#4+) ── */}
          <div className="card" style={{ padding: "8px 14px", display: "flex", flexDirection: "column", gap: "8px" }}>
            <div className="font-devanagari" style={{ fontSize: "0.875rem", fontWeight: 700, color: "var(--text-secondary)", padding: "8px 4px 4px", borderBottom: "1px solid var(--surface-border)" }}>
              {language === "hi" ? "रैंकिंग सूची (Top 50)" : "Rankings (Top 50)"}
            </div>

            {remainingList.length === 0 && leaderboard.length <= 3 && (
              <div style={{ textAlign: "center", padding: "20px", color: "var(--text-muted)" }} className="font-devanagari">
                {language === "hi" ? "अन्य साधक जल्द ही जुड़ेंगे!" : "More seekers joining soon!"}
              </div>
            )}

            {remainingList.map((item) => (
              <div
                key={item.userId}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "10px 8px",
                  borderRadius: "10px",
                  background: item.userId === userRank?.userId ? "var(--brand-dim)" : "transparent",
                  border: item.userId === userRank?.userId ? "1px solid var(--brand)" : "none"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{ width: "28px", textAlign: "center", fontWeight: 800, fontSize: "0.875rem", color: "var(--text-muted)" }}>
                    #{item.rank}
                  </div>
                  <div>
                    <div className="font-devanagari" style={{ fontWeight: 700, fontSize: "0.9375rem", color: "var(--text-primary)" }}>
                      {item.fullName}
                    </div>
                    <div className="font-devanagari" style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "4px" }}>
                      <MapPin size={10} /> {item.city || "भारत"}
                    </div>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  {item.currentStreak > 0 && (
                    <div style={{ display: "flex", alignItems: "center", gap: "2px", fontSize: "0.75rem", fontWeight: 700, color: "#C85010" }}>
                      <Flame size={12} fill="#C85010" /> {item.currentStreak}
                    </div>
                  )}
                  <div style={{ display: "flex", alignItems: "center", gap: "4px", background: "var(--gold-dim)", padding: "4px 8px", borderRadius: "8px", fontWeight: 800, fontSize: "0.8125rem", color: "#7A4A15" }}>
                    <Star size={12} fill="var(--gold)" color="var(--gold)" />
                    {item.totalXp} XP
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ── Sticky Bottom Card: Your Rank ── */}
          {userRank && (
            <div
              style={{
                position: "fixed",
                bottom: "70px",
                left: "50%",
                transform: "translateX(-50%)",
                width: "calc(100% - 32px)",
                maxWidth: "440px",
                background: "linear-gradient(135deg, #4B1D15 0%, #7C2D12 100%)",
                color: "#fff",
                padding: "12px 18px",
                borderRadius: "16px",
                boxShadow: "0 8px 30px rgba(75, 29, 21, 0.4)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                zIndex: 40,
                border: "1.5px solid rgba(255,255,255,0.2)"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{ width: "34px", height: "34px", borderRadius: "50%", background: "#F59E0B", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, color: "#78350F" }}>
                  #{userRank.rank}
                </div>
                <div>
                  <div className="font-devanagari" style={{ fontWeight: 700, fontSize: "0.875rem", color: "#FFF" }}>
                    {userRank.fullName} ({language === "hi" ? "आपकी रैंक" : "Your Rank"})
                  </div>
                  <div className="font-devanagari" style={{ fontSize: "0.75rem", color: "rgba(255,245,220,0.8)" }}>
                    {language === "hi" ? `कुल अंक: ${userRank.totalXp} XP` : `Total XP: ${userRank.totalXp}`}
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "4px", background: "rgba(255,255,255,0.15)", padding: "6px 12px", borderRadius: "10px", fontWeight: 800, fontSize: "0.8125rem", color: "#FDE68A" }}>
                <Trophy size={14} />
                #{userRank.rank}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
