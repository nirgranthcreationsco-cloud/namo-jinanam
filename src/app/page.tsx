"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Trophy, Star, MapPin, Award, Heart } from "lucide-react";
import { WINNERS_13_23 } from "@/data/winners";

// ── Medal colours ──────────────────────────────────────────
const medalStyle = (rank: number) => {
  if (rank === 1) return { bg: "linear-gradient(135deg,#FFD700 0%,#FFA500 100%)", border: "2px solid #E6AC00", shadow: "0 6px 24px rgba(255,200,0,0.45)" };
  if (rank === 2) return { bg: "linear-gradient(135deg,#E8E8E8 0%,#C0C0C0 100%)", border: "2px solid #A8A8A8", shadow: "0 4px 16px rgba(180,180,180,0.40)" };
  if (rank === 3) return { bg: "linear-gradient(135deg,#F0A060 0%,#CD7F32 100%)", border: "2px solid #B06820", shadow: "0 4px 16px rgba(180,120,50,0.40)" };
  return { bg: "linear-gradient(135deg,#FFFFFF 0%,#F0EBE3 100%)", border: "1.5px solid rgba(92,26,16,0.18)", shadow: "0 2px 10px rgba(92,26,16,0.08)" };
};

export default function CompetitionOverPage() {
  const [lang, setLang] = useState<"hi" | "en">("hi");
  const isHi = lang === "hi";

  return (
    <div style={{ minHeight: "100vh", background: "#FAF6F0", overflowX: "hidden", paddingBottom: "60px" }}>

      {/* ── Minimal Navbar ── */}
      <nav style={{
        padding: "14px 20px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        position: "sticky",
        top: 0,
        background: "rgba(250,246,240,0.92)",
        backdropFilter: "blur(14px)",
        zIndex: 50,
        borderBottom: "1px solid rgba(92,26,16,0.1)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <img src="/logo.png" alt="Logo" style={{ width: "34px", height: "34px", borderRadius: "50%", objectFit: "cover", boxShadow: "0 2px 8px rgba(92,26,16,0.15)" }} />
          <span className="font-devanagari" style={{ fontSize: "0.9375rem", fontWeight: 800, color: "#5C1A10" }}>
            {isHi ? "सन्मति · सुनील · संस्कार" : "Sanmati Sunil Sanskar"}
          </span>
        </div>
        <button
          onClick={() => setLang(isHi ? "en" : "hi")}
          style={{
            padding: "7px 14px", borderRadius: "20px",
            background: "rgba(92,26,16,0.07)",
            border: "1px solid rgba(92,26,16,0.15)",
            color: "#5C1A10", fontWeight: 700, fontSize: "0.75rem", cursor: "pointer"
          }}
        >
          {isHi ? "English" : "हिन्दी"}
        </button>
      </nav>

      {/* ── Hero Banner ── */}
      <div style={{
        background: "linear-gradient(160deg,#4B1D15 0%,#7C2D12 48%,#B45309 100%)",
        padding: "52px 20px 44px",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* glow */}
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 0%,rgba(255,200,80,0.22) 0%,transparent 68%)", pointerEvents: "none" }} />

        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", damping: 14, delay: 0.1 }}
          style={{
            width: "110px", height: "110px", borderRadius: "50%", margin: "0 auto 22px",
            overflow: "hidden",
            boxShadow: "0 10px 40px rgba(255,200,80,0.5),0 0 0 4px rgba(255,255,255,0.5)",
            border: "3px solid rgba(255,255,255,0.9)",
            background: "#FFFFFF",
          }}
        >
          <img src="/logo.png" alt="Logo" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <div className="font-devanagari" style={{ fontSize: "0.75rem", fontWeight: 800, color: "rgba(255,220,130,0.95)", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: "8px" }}>
            {isHi ? "आध्यात्मिक महा-अभियान 2026" : "Spiritual Campaign 2026"}
          </div>

          <h1 className="font-devanagari" style={{ fontSize: "1.625rem", fontWeight: 800, color: "#FFFFFF", lineHeight: 1.25, marginBottom: "10px", textShadow: "0 2px 16px rgba(0,0,0,0.3)" }}>
            {isHi ? "सन्मति - सुनील - संस्कार अभियान" : "Sanmati Sunil Sanskar Abhiyan"}
          </h1>

          {/* CLOSED BADGE */}
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.35, type: "spring" }}
            style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              background: "rgba(255,255,255,0.18)", backdropFilter: "blur(12px)",
              padding: "10px 22px", borderRadius: "24px",
              border: "1.5px solid rgba(255,255,255,0.35)",
              marginBottom: "18px",
            }}
          >
            <Trophy size={18} color="#FFD700" fill="#FFD700" />
            <span className="font-devanagari" style={{ fontSize: "1rem", fontWeight: 800, color: "#FFF" }}>
              {isHi ? "अभियान समाप्त — परिणाम घोषित!" : "Campaign Over — Results Declared!"}
            </span>
          </motion.div>

          <div className="font-devanagari" style={{ fontSize: "0.875rem", color: "rgba(255,240,210,0.9)", fontWeight: 600 }}>
            {isHi
              ? "60-दिवसीय आध्यात्मिक यात्रा सफलतापूर्वक सम्पन्न हुई 🙏"
              : "The 60-day spiritual journey has successfully concluded 🙏"}
          </div>
        </motion.div>
      </div>

      {/* ── Body ── */}
      <div style={{ maxWidth: "480px", margin: "0 auto", padding: "28px 18px 0" }}>

        {/* Blessings Card */}
        <motion.section
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}
          style={{ marginBottom: "24px" }}
        >
          <div style={{
            background: "linear-gradient(135deg,#FFFFFF 0%,#FAF3EA 100%)",
            borderRadius: "20px", padding: "22px 20px",
            border: "1.5px solid rgba(92,26,16,0.12)",
            boxShadow: "0 6px 24px rgba(92,26,16,0.08)",
            textAlign: "center",
          }}>
            <div style={{ fontSize: "2rem", marginBottom: "6px" }}>🙏</div>
            <div className="font-devanagari" style={{ fontSize: "0.75rem", fontWeight: 800, color: "#A07828", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "4px" }}>
              {isHi ? "परम पूज्य गुरुदेव का मंगल आशीर्वाद" : "With Divine Blessings"}
            </div>
            <h3 className="font-devanagari" style={{ fontSize: "1.0625rem", fontWeight: 800, color: "#5C1A10", margin: "6px 0 2px" }}>
              {isHi ? "चर्या चक्रवर्ती आचार्यश्री सुनीलसागर जी महाराज" : "Acharyashri Sunilsagar Ji Maharaj"}
            </h3>
            <div style={{ height: "1px", background: "rgba(92,26,16,0.1)", margin: "14px 0" }} />
            <div className="font-devanagari" style={{ fontSize: "0.75rem", fontWeight: 700, color: "#7A5A3A", marginBottom: "8px" }}>
              {isHi ? "परिकल्पना एवं आध्यात्मिक मार्गदर्शन" : "Concept & Spiritual Guidance"}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              <div className="font-devanagari" style={{ fontSize: "0.875rem", fontWeight: 700, color: "#3D1A0E" }}>
                {isHi ? "आर्यिका 105 सुदृढ़मती माताजी" : "Aaryika Sudradhmati Mataji"}
              </div>
              <div className="font-devanagari" style={{ fontSize: "0.875rem", fontWeight: 700, color: "#3D1A0E" }}>
                {isHi ? "आर्यिका 105 सुस्वरमती माताजी" : "Aaryika Suswarmati Mataji"}
              </div>
            </div>
          </div>
        </motion.section>

        {/* Campaign Stats */}
        <motion.section
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}
          style={{ marginBottom: "24px" }}
        >
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            {[
              { icon: "🧘", num: "60", labelHi: "दिवसीय यात्रा", labelEn: "Day Journey" },
              { icon: "👥", num: "~100", labelHi: "प्रतिभागी", labelEn: "Participants" },
              { icon: "🏅", num: "8", labelHi: "विजेता", labelEn: "Winners" },
              { icon: "🌟", num: "13–23", labelHi: "आयु वर्ग (वर्ष)", labelEn: "Age Group (yrs)" },
            ].map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.92 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                style={{
                  background: "#FFFFFF", borderRadius: "16px", padding: "18px 14px",
                  textAlign: "center", border: "1px solid rgba(92,26,16,0.1)",
                  boxShadow: "0 2px 12px rgba(92,26,16,0.06)",
                }}
              >
                <div style={{ fontSize: "1.6rem", marginBottom: "4px" }}>{s.icon}</div>
                <div style={{ fontSize: "1.375rem", fontWeight: 800, color: "#5C1A10", fontFamily: "var(--font-sans)" }}>{s.num}</div>
                <div className="font-devanagari" style={{ fontSize: "0.7rem", fontWeight: 700, color: "#7A5A3A" }}>
                  {isHi ? s.labelHi : s.labelEn}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* ── Winners Section ── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}
          style={{ marginBottom: "28px" }}
        >
          {/* Section header */}
          <div style={{
            background: "linear-gradient(135deg,#5C1A10 0%,#7C2D12 60%,#B45309 100%)",
            borderRadius: "20px 20px 0 0",
            padding: "20px 20px 18px",
            textAlign: "center",
          }}>
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
              <Trophy size={22} color="#FFD700" fill="#FFD700" />
              <span className="font-devanagari" style={{ fontSize: "1.125rem", fontWeight: 800, color: "#FFFFFF" }}>
                {isHi ? "अभियान विजेता" : "Campaign Winners"}
              </span>
              <Trophy size={22} color="#FFD700" fill="#FFD700" />
            </div>
            <div className="font-devanagari" style={{ fontSize: "0.8125rem", color: "rgba(255,220,140,0.95)", fontWeight: 600 }}>
              {isHi ? "आयु वर्ग: 13–23 वर्ष · लगभग 100 प्रतिभागियों में टॉप 8" : "Age Group: 13–23 yrs · Top 8 among ~100 participants"}
            </div>
          </div>

          {/* Winner cards */}
          <div style={{ background: "#FFFBF6", borderRadius: "0 0 20px 20px", border: "1.5px solid rgba(92,26,16,0.12)", borderTop: "none", padding: "16px 16px 20px", boxShadow: "0 8px 32px rgba(92,26,16,0.1)" }}>
            {WINNERS_13_23.map((w, i) => {
              const ms = medalStyle(w.rank);
              const isTop3 = w.rank <= 3;
              return (
                <motion.div
                  key={w.rank}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07 }}
                  style={{
                    display: "flex", alignItems: "center", gap: "14px",
                    background: ms.bg,
                    border: ms.border,
                    borderRadius: "14px",
                    padding: isTop3 ? "14px 16px" : "11px 16px",
                    marginBottom: i < WINNERS_13_23.length - 1 ? "10px" : 0,
                    boxShadow: ms.shadow,
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  {/* Shimmer for top 3 */}
                  {isTop3 && (
                    <div style={{
                      position: "absolute", inset: 0,
                      background: "linear-gradient(120deg,transparent 30%,rgba(255,255,255,0.28) 50%,transparent 70%)",
                      pointerEvents: "none",
                    }} />
                  )}

                  {/* Rank badge */}
                  <div style={{
                    width: isTop3 ? "44px" : "36px",
                    height: isTop3 ? "44px" : "36px",
                    borderRadius: "50%",
                    background: "rgba(255,255,255,0.7)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: isTop3 ? "1.5rem" : "1.15rem",
                    flexShrink: 0,
                    border: isTop3 ? "2px solid rgba(255,255,255,0.9)" : "1px solid rgba(255,255,255,0.6)",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  }}>
                    {w.badge}
                  </div>

                  {/* Name + City */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontSize: isTop3 ? "1rem" : "0.9rem",
                      fontWeight: 800,
                      color: w.rank === 1 ? "#7A4500" : w.rank <= 3 ? "#3D1A0E" : "#4A2010",
                      fontFamily: "var(--font-sans)",
                      letterSpacing: "-0.01em",
                      lineHeight: 1.2,
                    }}>
                      {w.name}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "4px", marginTop: "3px" }}>
                      <MapPin size={11} color={w.rank === 1 ? "#A06010" : "#7A5A3A"} />
                      <span className="font-devanagari" style={{ fontSize: "0.75rem", fontWeight: 600, color: w.rank === 1 ? "#8B5510" : "#6B4A2A" }}>
                        {w.city}
                      </span>
                    </div>
                  </div>

                  {/* Rank number */}
                  <div style={{
                    fontSize: "0.6875rem", fontWeight: 800,
                    color: w.rank === 1 ? "#A07020" : "#7A5A3A",
                    fontFamily: "var(--font-sans)",
                    opacity: 0.8,
                  }}>
                    #{w.rank}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.section>

        {/* Thank you note */}
        <motion.section
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}
          style={{ marginBottom: "24px" }}
        >
          <div style={{
            background: "linear-gradient(135deg,#FFFFFF 0%,#FAF3EA 100%)",
            borderRadius: "20px", padding: "24px 20px",
            border: "1.5px solid rgba(92,26,16,0.12)",
            boxShadow: "0 4px 20px rgba(92,26,16,0.06)",
            textAlign: "center",
          }}>
            <div style={{ fontSize: "2rem", marginBottom: "10px" }}>🌸</div>
            <h2 className="font-devanagari" style={{ fontSize: "1.0625rem", fontWeight: 800, color: "#5C1A10", margin: "0 0 8px" }}>
              {isHi ? "सभी प्रतिभागियों का हार्दिक धन्यवाद!" : "Heartfelt Thanks to All Participants!"}
            </h2>
            <p className="font-devanagari" style={{ fontSize: "0.875rem", color: "#6B4A2A", lineHeight: 1.6, margin: "0 0 14px", fontWeight: 600 }}>
              {isHi
                ? "आपकी सच्ची साधना, निष्ठा और समर्पण ने इस अभियान को सार्थक बनाया। यह आध्यात्मिक यात्रा आपके जीवन में सदा प्रेरणास्रोत बने।"
                : "Your sincere dedication and devotion made this campaign truly meaningful. May this spiritual journey always be a source of inspiration in your life."}
            </p>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: "6px",
              background: "rgba(92,26,16,0.07)",
              padding: "8px 18px", borderRadius: "20px",
              border: "1px solid rgba(92,26,16,0.12)",
            }}>
              <Heart size={14} fill="#C85010" color="#C85010" />
              <span className="font-devanagari" style={{ fontSize: "0.8125rem", fontWeight: 800, color: "#5C1A10" }}>
                {isHi ? "जय जिनेन्द्र 🙏" : "Jai Jinendra 🙏"}
              </span>
            </div>
          </div>
        </motion.section>

        {/* Footer credit */}
        <div style={{ textAlign: "center", padding: "16px", fontSize: "0.6875rem", color: "#9A8A7A" }}>
          Created by <strong>Nirgranth Creations</strong>
        </div>
      </div>
    </div>
  );
}
