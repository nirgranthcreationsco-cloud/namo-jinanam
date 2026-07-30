"use client";

import { motion } from "framer-motion";
import { BADGES } from "@/data/content";
import { useAuthStore } from "@/store/authStore";
import { useLanguageStore } from "@/store/languageStore";
import { Medal, Star, Lock, Award, ShieldCheck } from "lucide-react";

export default function BadgesPage() {
  const { stats } = useAuthStore();
  const { language } = useLanguageStore();
  const earnedBadgeIds = new Set(stats?.badges ?? []);

  return (
    <div className="page" style={{ padding: "20px 16px 100px" }}>
      
      {/* ── Intro ── */}
      <div className="card" style={{ padding: "24px", marginBottom: "24px", textAlign: "center", background: "var(--surface-overlay)", borderColor: "var(--brand-glow)" }}>
        <Award size={40} color="var(--gold)" style={{ margin: "0 auto 12px" }} />
        <h2 className="heading-lg font-devanagari" style={{ color: "var(--gold)", marginBottom: "8px" }}>
          {language === "hi" ? "उपलब्धि बैज" : "Achievement Badges"}
        </h2>
        <p className="body-sm font-devanagari" style={{ color: "var(--text-secondary)" }}>
          {language === "hi"
            ? "अपनी साधना में निरंतरता और विशुद्धता के लिए 19 विशेष बैज अर्जित करें।"
            : "Earn 19 special badges for consistency and purity in your sadhana."
          }
        </p>
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
        <h3 className="heading-sm font-devanagari" style={{ color: "var(--text-primary)" }}>
          {language === "hi" ? `सभी बैज (${BADGES.length})` : `All Badges (${BADGES.length})`}
        </h3>
        <div className="chip chip-gold">
          {earnedBadgeIds.size} {language === "hi" ? "अर्जित" : "Earned"}
        </div>
      </div>

      {/* ── Grid ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "12px" }}>
        {BADGES.map((badge, i) => {
          const earned = earnedBadgeIds.has(badge.id);

          return (
            <motion.div
              key={badge.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -2 }}
              className="card"
              style={{
                padding: "20px 16px", textAlign: "center",
                background: earned ? "var(--surface-raised)" : "var(--surface-base)",
                borderColor: earned ? `rgba(201,150,58,0.3)` : "var(--surface-border)",
                opacity: earned ? 1 : 0.5,
                filter: earned ? "none" : "grayscale(100%)",
                display: "flex", flexDirection: "column", alignItems: "center",
                position: "relative"
              }}
            >
              {earned && (
                <div style={{ position: "absolute", top: "12px", right: "12px", color: "var(--emerald)" }}>
                  <ShieldCheck size={16} />
                </div>
              )}
              
              <div
                style={{
                  width: "56px", height: "56px", borderRadius: "16px",
                  background: earned ? `rgba(201,150,58,0.15)` : "var(--surface-overlay)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  marginBottom: "12px", color: earned ? "var(--gold)" : "var(--text-muted)"
                }}
              >
                <Medal size={28} />
              </div>
              
              <div className="font-devanagari" style={{ fontWeight: 700, fontSize: "0.875rem", marginBottom: "4px", color: "var(--text-primary)" }}>
                {language === "hi" ? badge.name_hi : badge.name_en}
              </div>
              <div className="font-devanagari" style={{ fontSize: "0.75rem", color: "var(--text-secondary)", lineHeight: 1.4 }}>
                {language === "hi" ? badge.description_hi : badge.description_en}
              </div>
              
              {!earned && (
                <div style={{ marginTop: "12px", fontSize: "0.75rem", fontWeight: 600, color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "4px" }}>
                  <Lock size={12} /> {language === "hi" ? "लॉक" : "Locked"}
                </div>
              )}
              
              {earned && badge.is_rare && (
                <div className="chip chip-gold" style={{ marginTop: "12px", fontSize: "0.6875rem", padding: "2px 8px" }}>
                  <Star size={10} fill="currentColor" /> {language === "hi" ? "दुर्लभ" : "Rare"}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
