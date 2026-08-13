"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguageStore } from "@/store/languageStore";
import { useAuthStore } from "@/store/authStore";
import { triggerInstallPrompt } from "@/components/InstallPrompt";
import {
  CAMPAIGN_START,
  isCampaignAccessible,
  isTestModeEnabled,
  CAMPAIGN_START_DISPLAY_HI,
  CAMPAIGN_START_DISPLAY_EN,
  CAMPAIGN_END_DISPLAY_HI,
  CAMPAIGN_END_DISPLAY_EN,
} from "@/config/campaign";
import {
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Trophy,
  Globe,
  Flame,
  Sunrise,
  Heart,
  TrendingUp,
  Award,
  ShieldCheck,
  ChevronDown,
} from "lucide-react";

// ─────────────── Countdown Hook ───────────────
function useCountdown(target: Date) {
  const calcDiff = () => {
    const diff = Math.max(0, target.getTime() - Date.now());
    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / (1000 * 60)) % 60),
      seconds: Math.floor((diff / 1000) % 60),
      done: diff === 0,
    };
  };
  const [time, setTime] = useState(calcDiff);
  useEffect(() => {
    const t = setInterval(() => setTime(calcDiff()), 1000);
    return () => clearInterval(t);
  }, []);
  return time;
}

// ─────────────── Countdown Block Component ───────────────
function CountdownBlock({ value, label }: { value: number; label: string }) {
  return (
    <motion.div
      key={value}
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "4px",
      }}
    >
      <div
        style={{
          background: "rgba(255, 255, 255, 0.16)",
          backdropFilter: "blur(14px)",
          border: "1.5px solid rgba(255, 255, 255, 0.35)",
          borderRadius: "14px",
          padding: "10px 14px",
          fontSize: "1.65rem",
          fontWeight: 800,
          color: "#FFFFFF",
          fontFamily: "var(--font-sans)",
          lineHeight: 1,
          minWidth: "52px",
          textAlign: "center",
          boxShadow: "0 6px 20px rgba(0,0,0,0.18)",
        }}
      >
        {String(value).padStart(2, "0")}
      </div>
      <span
        style={{
          fontSize: "0.625rem",
          fontWeight: 700,
          color: "rgba(255, 240, 210, 0.9)",
          textTransform: "uppercase",
          letterSpacing: "0.08em",
        }}
        className="font-devanagari"
      >
        {label}
      </span>
    </motion.div>
  );
}

// ─────────────── Main Pre-Launch Welcome Page ───────────────
export default function LandingPage() {
  const { language, setLanguage } = useLanguageStore();
  const { user, _hasHydrated } = useAuthStore();
  const router = useRouter();
  const countdown = useCountdown(CAMPAIGN_START);
  const [mounted, setMounted] = useState(false);
  const [testMode, setTestMode] = useState(false);

  useEffect(() => {
    setMounted(true);
    setTestMode(isTestModeEnabled());
    if (_hasHydrated) {
      if (user?.id) {
        // Registered / Logged in:
        // Before launch → registration-success; After launch → dashboard
        router.replace(isCampaignAccessible() ? "/dashboard" : "/registration-success");
      }
      // Unregistered visitors stay on this page to experience the Campaign Welcome Page!
    }
  }, [user, _hasHydrated, router]);

  const enableTestMode = useCallback(() => {
    localStorage.setItem("campaign_test_mode", "true");
    setTestMode(true);
    router.replace(user?.id ? "/dashboard" : "/login");
  }, [user, router]);

  const disableTestMode = useCallback(() => {
    localStorage.removeItem("campaign_test_mode");
    setTestMode(false);
    window.location.reload();
  }, []);

  if (!mounted || !_hasHydrated || user?.id) {
    return null;
  }

  const isHi = language === "hi";
  const countdown_labels = isHi
    ? ["दिन", "घंटे", "मिनट", "सेकंड"]
    : ["Days", "Hours", "Minutes", "Seconds"];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#FAF6F0",
        color: "var(--text-primary)",
        overflowX: "hidden",
        paddingBottom: "110px",
      }}
    >
      {/* ── Navbar ── */}
      <nav
        style={{
          padding: "14px 20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          position: "sticky",
          top: 0,
          background: "rgba(250, 246, 240, 0.92)",
          backdropFilter: "blur(14px)",
          zIndex: 50,
          borderBottom: "1px solid var(--surface-border)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <img
            src="/logo.png"
            alt="सन्मति अभियान Logo"
            style={{
              width: "34px",
              height: "34px",
              borderRadius: "50%",
              objectFit: "cover",
              boxShadow: "0 2px 8px rgba(92,26,16,0.15)",
            }}
          />
          <span
            className="heading-md font-devanagari text-brand"
            style={{ fontSize: "0.9375rem", fontWeight: 800 }}
          >
            {isHi ? "सन्मति - सुनील - संस्कार" : "Sanmati Sunil Sanskar"}
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <button
            onClick={triggerInstallPrompt}
            style={{
              padding: "6px 10px",
              borderRadius: "var(--r-pill)",
              background: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
              border: "none",
              color: "#FFFFFF",
              fontWeight: 800,
              fontSize: "0.71875rem",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "4px",
              boxShadow: "0 2px 8px rgba(16,185,129,0.3)",
            }}
            className="font-devanagari"
          >
            📲 {isHi ? "ऐप इंस्टॉल करें" : "Install App"}
          </button>

          <button
            onClick={() => setLanguage(isHi ? "en" : "hi")}
            style={{
              padding: "6px 12px",
              borderRadius: "var(--r-pill)",
              background: "var(--surface-overlay)",
              border: "1px solid var(--surface-border)",
              color: "var(--text-primary)",
              fontWeight: 700,
              fontSize: "0.75rem",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            <Globe size={13} /> {isHi ? "English" : "हिन्दी"}
          </button>
        </div>
      </nav>

      {/* ── HERO SECTION ── */}
      <div
        style={{
          background: "linear-gradient(160deg, #4B1D15 0%, #7C2D12 45%, #B45309 100%)",
          padding: "48px 20px 40px",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "radial-gradient(ellipse at 50% 0%, rgba(255,200,80,0.2) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1, rotate: 360 }}
          transition={{
            scale: { type: "spring", damping: 14, delay: 0.1 },
            opacity: { duration: 0.5 },
            rotate: { repeat: Infinity, duration: 15, ease: "linear" },
          }}
          style={{
            width: "116px",
            height: "116px",
            borderRadius: "50%",
            margin: "0 auto 20px",
            overflow: "hidden",
            boxShadow: "0 10px 40px rgba(255, 200, 80, 0.45), 0 0 0 4px rgba(255, 255, 255, 0.5)",
            border: "3px solid rgba(255, 255, 255, 0.9)",
            display: "inline-block",
            background: "#FFFFFF",
          }}
        >
          <img
            src="/logo.png"
            alt="सन्मति - सुनील - संस्कार अभियान Logo"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{ maxWidth: "480px", margin: "0 auto" }}
        >
          <div
            className="font-devanagari"
            style={{
              fontSize: "0.75rem",
              fontWeight: 800,
              color: "rgba(255, 220, 130, 0.95)",
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              marginBottom: "8px",
            }}
          >
            {isHi ? "आध्यात्मिक महा-अभियान 2026" : "Spiritual Campaign 2026"}
          </div>

          <h1
            className="font-devanagari"
            style={{
              fontSize: "1.65rem",
              fontWeight: 800,
              color: "#FFFFFF",
              lineHeight: 1.25,
              marginBottom: "8px",
              textShadow: "0 2px 16px rgba(0,0,0,0.3)",
            }}
          >
            {isHi ? "सन्मति - सुनील - संस्कार अभियान" : "Sanmati Sunil Sanskar Abhiyan"}
          </h1>

          <div
            className="font-devanagari"
            style={{
              fontSize: "0.9375rem",
              fontWeight: 700,
              color: "rgba(255, 240, 210, 0.95)",
              marginBottom: "6px",
            }}
          >
            {isHi
              ? "संस्कार • संयम • साधना की 60-दिवसीय यात्रा"
              : "A 60-Day Journey of Sanskar • Sanyam • Sadhana"}
          </div>

          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              background: "rgba(255, 255, 255, 0.15)",
              backdropFilter: "blur(10px)",
              padding: "4px 14px",
              borderRadius: "20px",
              border: "1px solid rgba(255,255,255,0.25)",
              fontSize: "0.8125rem",
              color: "#FFF",
              fontWeight: 700,
              marginBottom: "24px",
            }}
            className="font-devanagari"
          >
            📅 {isHi ? `${CAMPAIGN_START_DISPLAY_HI} – ${CAMPAIGN_END_DISPLAY_HI}` : `${CAMPAIGN_START_DISPLAY_EN} – ${CAMPAIGN_END_DISPLAY_EN}`}
          </div>

          {/* Countdown */}
          <div style={{ marginBottom: "24px" }}>
            <div
              className="font-devanagari"
              style={{
                fontSize: "0.7rem",
                fontWeight: 700,
                color: "rgba(255, 220, 130, 0.85)",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                marginBottom: "12px",
              }}
            >
              {isHi ? "अभियान शुरू होने में अवशेष" : "Campaign Begins In"}
            </div>
            {countdown.done ? (
              <div
                className="font-devanagari"
                style={{ fontSize: "1.2rem", color: "#86efac", fontWeight: 800 }}
              >
                {isHi ? "🎉 अभियान प्रारंभ हो चुका है!" : "🎉 The Campaign Has Begun!"}
              </div>
            ) : (
              <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
                <CountdownBlock value={countdown.days} label={countdown_labels[0]} />
                <CountdownBlock value={countdown.hours} label={countdown_labels[1]} />
                <CountdownBlock value={countdown.minutes} label={countdown_labels[2]} />
                <CountdownBlock value={countdown.seconds} label={countdown_labels[3]} />
              </div>
            )}
          </div>

          {/* Quote Card */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            style={{
              background: "rgba(0, 0, 0, 0.22)",
              backdropFilter: "blur(12px)",
              borderRadius: "16px",
              padding: "14px 18px",
              border: "1px solid rgba(255, 255, 255, 0.2)",
            }}
          >
            <p
              className="font-devanagari"
              style={{
                fontSize: "0.875rem",
                fontWeight: 600,
                color: "rgba(255, 245, 225, 0.95)",
                lineHeight: 1.5,
                margin: 0,
                fontStyle: "italic",
              }}
            >
              {isHi
                ? "“प्रतिदिन एक सच्चा कदम जीवन बदल सकता है।”"
                : "“One sincere step every day can transform a lifetime.”"}
            </p>
          </motion.div>
        </motion.div>
      </div>

      <div style={{ padding: "28px 18px 0", maxWidth: "480px", margin: "0 auto" }}>

        {/* ── DIVINE BLESSINGS (INSPIRATION) ── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{ marginBottom: "28px" }}
        >
          <div
            style={{
              background: "linear-gradient(135deg, #FFFFFF 0%, #FAF3EA 100%)",
              borderRadius: "20px",
              padding: "24px 20px",
              border: "1.5px solid var(--surface-border-md)",
              boxShadow: "0 6px 24px rgba(92,26,16,0.08)",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "2rem", marginBottom: "8px" }}>🙏</div>
            <div
              className="font-devanagari"
              style={{
                fontSize: "0.75rem",
                fontWeight: 800,
                color: "var(--gold)",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                marginBottom: "4px",
              }}
            >
              {isHi ? "परम पूज्य गुरुदेव का मंगल आशीर्वाद" : "With Divine Blessings"}
            </div>

            <h3
              className="font-devanagari"
              style={{ fontSize: "1.125rem", fontWeight: 800, color: "var(--brand)", margin: "8px 0 2px" }}
            >
              {isHi ? "चर्या चक्रवर्ती आचार्यश्री सुनीलसागर जी महाराज" : "Charya Chakravarti Acharyashri Sunilsagar Ji Maharaj"}
            </h3>
            <p
              className="font-devanagari"
              style={{ fontSize: "0.78125rem", color: "var(--text-muted)", margin: "0 0 16px" }}
            >
              {isHi ? "परम पूज्य आचार्यश्री सुनीलसागर जी महाराज" : "Charya Chakravarti Acharyashri Sunilsagar Ji Maharaj"}
            </p>

            <div style={{ height: "1px", background: "var(--surface-border)", margin: "14px 0" }} />

            <div
              className="font-devanagari"
              style={{
                fontSize: "0.75rem",
                fontWeight: 700,
                color: "var(--text-muted)",
                marginBottom: "8px",
              }}
            >
              {isHi ? "परिकल्पना एवं आध्यात्मिक मार्गदर्शन" : "Concept & Spiritual Guidance"}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <div
                className="font-devanagari"
                style={{ fontSize: "0.875rem", fontWeight: 700, color: "var(--text-primary)" }}
              >
                {isHi ? "आर्यिका 105 सुदृढ़मती माताजी" : "Aaryika Sudradhmati Mataji"}
              </div>
              <div
                className="font-devanagari"
                style={{ fontSize: "0.875rem", fontWeight: 700, color: "var(--text-primary)" }}
              >
                {isHi ? "आर्यिका 105 सुस्वरमती माताजी" : "Aaryika Suswarmati Mataji"}
              </div>
            </div>
          </div>
        </motion.section>

        {/* ── SECTION 1: YOUR JOURNEY ── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{ marginBottom: "28px" }}
        >
          <div style={{ textAlign: "center", marginBottom: "18px" }}>
            <h2
              className="font-devanagari"
              style={{ fontSize: "1.125rem", fontWeight: 800, color: "var(--brand)", margin: 0 }}
            >
              {isHi ? "आपकी 5-चरणीय यात्रा" : "Your Journey"}
            </h2>
            <p
              className="font-devanagari"
              style={{ fontSize: "0.78125rem", color: "var(--text-muted)", margin: "4px 0 0" }}
            >
              {isHi ? "सरल, सुंदर और फलदायी मार्ग" : "Simple, meaningful, and rewarding"}
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {[
              {
                emoji: "🌅",
                titleHi: "दैनिक नियम पूरे करें",
                titleEn: "Complete Daily Niyams",
                descHi: "प्रतिदिन सरल धार्मिक नियमों का पालन करें",
                descEn: "Practice simple daily spiritual habits",
              },
              {
                emoji: "🌸",
                titleHi: "पुण्य अर्जित करें",
                titleEn: "Earn Punya",
                descHi: "प्रत्येक सच्चे प्रयास से आध्यात्मिक अंक प्राप्त करें",
                descEn: "Every sincere effort earns spiritual points",
              },
              {
                emoji: "🔥",
                titleHi: "दैनिक स्ट्रिक बनाएं",
                titleEn: "Build Your Daily Streak",
                descHi: "निरंतरता बनाए रखें और अपनी साधना बढ़ाएं",
                descEn: "Maintain day-to-day spiritual consistency",
              },
              {
                emoji: "🪷",
                titleHi: "60-दिवसीय यात्रा पूर्ण करें",
                titleEn: "Complete the 60-Day Journey",
                descHi: "जीवन में संयम और संस्कार की स्थापना करें",
                descEn: "Establish discipline & Sanskar in your life",
              },
              {
                emoji: "🏆",
                titleHi: "डिजिटल प्रमाण-पत्र प्राप्त करें",
                titleEn: "Receive Your Digital Certificate",
                descHi: "सफलतापूर्वक पूर्ण करने पर विशेष सम्मान",
                descEn: "Official certificate of achievement",
              },
            ].map((step, idx, arr) => (
              <div key={idx}>
                <div
                  style={{
                    background: "#FFFFFF",
                    borderRadius: "16px",
                    padding: "16px 18px",
                    display: "flex",
                    alignItems: "center",
                    gap: "14px",
                    border: "1px solid var(--surface-border)",
                    boxShadow: "0 2px 12px rgba(92,26,16,0.05)",
                  }}
                >
                  <div
                    style={{
                      width: "44px",
                      height: "44px",
                      borderRadius: "12px",
                      background: "var(--surface-bg)",
                      border: "1px solid var(--surface-border-md)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "1.375rem",
                      flexShrink: 0,
                    }}
                  >
                    {step.emoji}
                  </div>
                  <div>
                    <h3
                      className="font-devanagari"
                      style={{ fontSize: "0.9375rem", fontWeight: 800, color: "var(--brand)", margin: "0 0 2px" }}
                    >
                      {isHi ? step.titleHi : step.titleEn}
                    </h3>
                    <p
                      className="font-devanagari"
                      style={{ fontSize: "0.78125rem", color: "var(--text-secondary)", margin: 0, lineHeight: 1.4 }}
                    >
                      {isHi ? step.descHi : step.descEn}
                    </p>
                  </div>
                </div>

                {idx < arr.length - 1 && (
                  <div style={{ textAlign: "center", padding: "4px 0", color: "var(--gold)", opacity: 0.6 }}>
                    ↓
                  </div>
                )}
              </div>
            ))}
          </div>
        </motion.section>

        {/* ── SECTION 2: THREE THINGS TO REMEMBER ── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{ marginBottom: "28px" }}
        >
          <div
            style={{
              background: "linear-gradient(135deg, #FFF 0%, #FAF3EA 100%)",
              borderRadius: "20px",
              padding: "22px 20px",
              border: "1.5px solid var(--surface-border-md)",
              boxShadow: "0 4px 20px rgba(92,26,16,0.06)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
              <ShieldCheck size={22} color="var(--brand)" />
              <h2
                className="font-devanagari"
                style={{ fontSize: "1.0625rem", fontWeight: 800, color: "var(--brand)", margin: 0 }}
              >
                {isHi ? "तीन मुख्य बातें" : "Three Things To Remember"}
              </h2>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "16px" }}>
              {[
                { hi: "सत्यनिष्ठ और ईमानदार रहें", en: "Be Honest" },
                { hi: "प्रतिदिन केवल एक बार सबमिट करें", en: "Submit only once every day" },
                { hi: "संकल्प सच्चे मन से स्वीकार करें", en: "Accept Sankalps sincerely" },
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div
                    style={{
                      width: "22px",
                      height: "22px",
                      borderRadius: "50%",
                      background: "var(--emerald-dim)",
                      color: "var(--emerald)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "0.75rem",
                      fontWeight: 800,
                      flexShrink: 0,
                    }}
                  >
                    ✓
                  </div>
                  <span
                    className="font-devanagari"
                    style={{ fontSize: "0.875rem", fontWeight: 700, color: "var(--text-primary)" }}
                  >
                    {isHi ? item.hi : item.en}
                  </span>
                </div>
              ))}
            </div>

            <div
              className="font-devanagari"
              style={{
                fontSize: "0.78125rem",
                color: "var(--text-muted)",
                lineHeight: 1.5,
                borderTop: "1px solid var(--surface-border)",
                paddingTop: "12px",
                fontStyle: "italic",
              }}
            >
              {isHi
                ? "यह अभियान आत्म-अनुशासन, सत्यनिष्ठा और निरंतरता पर आधारित है।"
                : "This campaign is based on self-discipline, honesty and consistency."}
            </div>
          </div>
        </motion.section>

        {/* ── SECTION 3: INSIDE THE APP ── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{ marginBottom: "28px" }}
        >
          <div style={{ textAlign: "center", marginBottom: "18px" }}>
            <h2
              className="font-devanagari"
              style={{ fontSize: "1.125rem", fontWeight: 800, color: "var(--brand)", margin: 0 }}
            >
              {isHi ? "ऐप के मुख्य अनुभव" : "Inside the App"}
            </h2>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {[
              {
                icon: "🌅",
                titleHi: "दैनिक नियम",
                titleEn: "Daily Niyams",
                descHi: "अपने दैनिक आध्यात्मिक अभ्यासों को सरलता से दर्ज करें।",
                descEn: "Track your daily spiritual habits & discipline easily.",
              },
              {
                icon: "✨",
                titleHi: "दैनिक प्रेरणा",
                titleEn: "Today's Inspiration",
                descHi: "प्रतिदिन श्रेणीबद्ध धार्मिक नियम एवं मंगल भावनाएँ।",
                descEn: "Daily category challenges with special spiritual blessings.",
              },
              {
                icon: "🪷",
                titleHi: "आजीवन संकल्प",
                titleEn: "Lifetime Sankalp",
                descHi: "सद्जीवन हेतु आजीवन एवं चातुर्मास व्रत स्वीकार करें।",
                descEn: "Sacred long-term vows for a noble lifestyle.",
              },
              {
                icon: "📈",
                titleHi: "आपकी प्रगति",
                titleEn: "Track Your Progress",
                descHi: "अपने पुण्य, स्ट्रिक और निरंतरता का सुंदर लेखा-जोखा।",
                descEn: "Visual analytics of your Punya and consistency.",
              },
              {
                icon: "🏆",
                titleHi: "प्रमाण-पत्र एवं सम्मान",
                titleEn: "Certificates & Recognition",
                descHi: "60-दिवसीय साधना पूर्ण करने पर डिजिटल प्रमाण-पत्र।",
                descEn: "Earn digital certificates upon successful completion.",
              },
            ].map((feature, i) => (
              <div
                key={i}
                style={{
                  background: "#FFFFFF",
                  borderRadius: "16px",
                  padding: "14px 16px",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "12px",
                  border: "1px solid var(--surface-border)",
                }}
              >
                <span style={{ fontSize: "1.375rem", lineHeight: 1 }}>{feature.icon}</span>
                <div>
                  <h3
                    className="font-devanagari"
                    style={{ fontSize: "0.875rem", fontWeight: 800, color: "var(--brand)", margin: "0 0 2px" }}
                  >
                    {isHi ? feature.titleHi : feature.titleEn}
                  </h3>
                  <p
                    className="font-devanagari"
                    style={{ fontSize: "0.78125rem", color: "var(--text-secondary)", margin: 0, lineHeight: 1.4 }}
                  >
                    {isHi ? feature.descHi : feature.descEn}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.section>

        {/* ── SECTION 4: RECOGNITION ── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{ marginBottom: "28px" }}
        >
          <div
            style={{
              background: "linear-gradient(135deg, #5C1A10 0%, #7C2D12 100%)",
              borderRadius: "20px",
              padding: "24px 20px",
              color: "#FFFFFF",
              boxShadow: "0 8px 28px rgba(92,26,16,0.2)",
              textAlign: "center",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "radial-gradient(ellipse at 50% 0%, rgba(255,200,80,0.18) 0%, transparent 70%)",
                pointerEvents: "none",
              }}
            />
            <Award size={36} color="#FBBF24" style={{ margin: "0 auto 10px" }} />
            <h2
              className="font-devanagari"
              style={{ fontSize: "1.1875rem", fontWeight: 800, color: "#FFFFFF", margin: "0 0 10px" }}
            >
              {isHi ? "विशेष सम्मान एवं प्रमाण-पत्र" : "Recognition & Certificates"}
            </h2>

            <div
              className="font-devanagari"
              style={{
                fontSize: "0.8125rem",
                color: "rgba(255,240,210,0.9)",
                lineHeight: 1.6,
                marginBottom: "14px",
              }}
            >
              {isHi
                ? "60-दिवसीय यात्रा पूर्ण करें • निरंतरता बनाएं • पुण्य अर्जित करें • डिजिटल प्रमाण-पत्र प्राप्त करें"
                : "Complete the journey • Build your consistency • Earn Punya • Receive a Digital Certificate"}
            </div>

            <div
              className="font-devanagari"
              style={{
                fontSize: "0.8125rem",
                fontWeight: 700,
                color: "#FDE68A",
                background: "rgba(255,255,255,0.12)",
                padding: "10px 14px",
                borderRadius: "12px",
                border: "1px solid rgba(255,255,255,0.2)",
              }}
            >
              {isHi
                ? "प्रत्येक आयु वर्ग के उत्कृष्ट प्रतिभागियों को विशेष सम्मान प्रदान किया जाएगा।"
                : "Outstanding participants from every age group will receive special recognition."}
            </div>
          </div>
        </motion.section>

        {/* ── SECTION 6: CAMPAIGN CREDITS ── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{ marginBottom: "32px" }}
        >
          <div
            style={{
              background: "rgba(255,255,255,0.6)",
              borderRadius: "16px",
              padding: "18px 16px",
              border: "1px solid var(--surface-border)",
              textAlign: "center",
            }}
          >
            <div
              className="font-devanagari"
              style={{ fontSize: "0.6875rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}
            >
              {isHi ? "पावन सानिध्य" : "Held Under"}
            </div>
            <div
              className="font-devanagari"
              style={{ fontSize: "0.84375rem", fontWeight: 800, color: "var(--brand)", marginBottom: "12px" }}
            >
              इंद्रपुरी चातुर्मास उत्सव 2026
            </div>

            <div
              className="font-devanagari"
              style={{ fontSize: "0.6875rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}
            >
              {isHi ? "आयोजक" : "Organized By"}
            </div>
            <div
              className="font-devanagari"
              style={{ fontSize: "0.84375rem", fontWeight: 700, color: "var(--text-primary)" }}
            >
              इंद्रपुरी चातुर्मास उत्सव समिति
            </div>
            <div
              className="font-devanagari"
              style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "12px" }}
            >
              नेमीनगर, जैन कॉलोनी, इंदौर
            </div>

            <div style={{ height: "1px", background: "var(--surface-border)", margin: "10px 0" }} />

            <div
              className="font-devanagari"
              style={{ fontSize: "0.6875rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}
            >
              {isHi ? "तकनीकी निर्माण एवं संपादन" : "Designed & Developed By"}
            </div>
            <div
              className="font-devanagari"
              style={{ fontSize: "0.8125rem", fontWeight: 700, color: "var(--text-primary)" }}
            >
              {isHi ? "प्रथम गंगवाल • निर्ग्रन्थ क्रिएशंस" : "Pratham Gangwal • Nirgranth Creations"}
            </div>
          </div>
        </motion.section>

        {/* Developer Test Mode Toggle Footer */}
        <div style={{ textAlign: "center", paddingBottom: "20px" }}>
          {testMode ? (
            <button
              onClick={disableTestMode}
              style={{
                background: "none",
                border: "none",
                color: "#DC2626",
                fontSize: "0.6875rem",
                cursor: "pointer",
                textDecoration: "underline",
                fontWeight: 600,
              }}
            >
              Exit Test Mode
            </button>
          ) : (
            <button
              onClick={enableTestMode}
              style={{
                background: "none",
                border: "none",
                color: "var(--text-muted)",
                fontSize: "0.625rem",
                cursor: "pointer",
                opacity: 0.45,
              }}
            >
              Developer Test Mode
            </button>
          )}
        </div>
      </div>

      {/* ── PRIMARY STICKY BOTTOM ACTION ── */}
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          padding: "14px 20px",
          background: "rgba(250, 246, 240, 0.94)",
          backdropFilter: "blur(16px)",
          borderTop: "1px solid var(--surface-border)",
          zIndex: 100,
          boxShadow: "0 -8px 24px rgba(92,26,16,0.1)",
        }}
      >
        <div style={{ maxWidth: "480px", margin: "0 auto" }}>
          <button
            onClick={() => router.push("/signup")}
            className="font-devanagari"
            style={{
              width: "100%",
              padding: "16px",
              borderRadius: "16px",
              background: "linear-gradient(135deg, #5C1A10 0%, #7C2D12 50%, #B45309 100%)",
              color: "#FFFFFF",
              fontSize: "1.0625rem",
              fontWeight: 800,
              border: "none",
              cursor: "pointer",
              boxShadow: "0 8px 24px rgba(92,26,16,0.25)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              letterSpacing: "0.01em",
            }}
          >
            <span>🌸 {isHi ? "पंजीकरण शुरू करें" : "Begin Registration"}</span>
            <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
