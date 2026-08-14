"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguageStore } from "@/store/languageStore";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { Users, UserPlus, Share2, CheckCircle2, Globe, Sparkles } from "lucide-react";
import {
  CAMPAIGN_START,
  CAMPAIGN_END,
  isCampaignAccessible,
  CAMPAIGN_START_DISPLAY_HI,
  CAMPAIGN_START_DISPLAY_EN,
  CAMPAIGN_END_DISPLAY_HI,
  CAMPAIGN_END_DISPLAY_EN,
} from "@/config/campaign";

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

// ─────────────── Cards Data ───────────────
const CARDS = [
  {
    emoji: "🌸",
    titleHi: "आपकी दैनिक यात्रा",
    titleEn: "Your Daily Journey",
    bodyHi: [
      "अभियान अवधि: 19 अगस्त → 19 अक्टूबर",
      "प्रतिदिन ऐप खोलें।",
      "अपने दैनिक नियम पूरे करें।",
      "प्रतिदिन एक बार अपनी यात्रा सबमिट करें।",
      "प्रत्येक सच्चा प्रयास आपकी आध्यात्मिक उन्नति में सहायक है।",
    ],
    bodyEn: [
      "Campaign Duration: 19 August → 19 October",
      "Open the app every day.",
      "Complete your Daily Niyams.",
      "Submit your journey once every day.",
      "Every sincere effort contributes to your spiritual growth.",
    ],
  },
  {
    emoji: "🤍",
    titleHi: "ईमानदारी ही आधार है",
    titleEn: "Honesty is the Foundation",
    bodyHi: [
      "यह अभियान ईमानदारी पर आधारित है।",
      "यदि आज आपने कोई नियम सच्चाई से पालन किया — तो उसे टिक करें।",
      "यदि नहीं कर पाए — तो उसे खाली छोड़ दें।",
      "यह यात्रा स्वयं से की गई एक प्रतिज्ञा है।",
    ],
    bodyEn: [
      "This campaign is built upon honesty.",
      "If you sincerely followed a Niyam today — simply tick it.",
      "If you could not follow it — leave it unticked.",
      "Your journey is a commitment to yourself.",
    ],
  },
  {
    emoji: "🌱",
    titleHi: "दैनिक भागीदारी",
    titleEn: "Daily Participation",
    bodyHi: [
      "प्रत्येक पूर्ण नियम से पुण्य अर्जित होता है।",
      "प्रतिदिन अपने नियम सबमिट करें।",
      "एक दिन छूटने का अर्थ है उस दिन के लिए कोई अंक नहीं।",
      "दैनिक अभ्यास द्वारा अपनी निरंतरता बनाएं।",
    ],
    bodyEn: [
      "Every completed Niyam earns Punya.",
      "Submit your Daily Niyams every day.",
      "Missing a day simply means no points are earned for that day.",
      "Build your consistency through daily practice.",
    ],
  },
  {
    emoji: "👨‍👩‍👧",
    titleHi: "माता-पिता और युवा प्रतिभागी",
    titleEn: "Parents & Young Participants",
    bodyHi: [
      "माता-पिता से अनुरोध है कि वे छोटे प्रतिभागियों को दैनिक नियम पूरे करते समय मार्गदर्शन दें।",
    ],
    bodyEn: [
      "Parents are encouraged to guide younger participants while completing their Daily Niyams.",
    ],
  },
  {
    emoji: "⏰",
    titleHi: "दैनिक दिनचर्या बनाएं",
    titleEn: "Build a Daily Routine",
    bodyHi: [
      "प्रतिदिन सायं एक निश्चित समय चुनें।",
      "उसी समय अपने दैनिक नियम पूरे करें।",
      "एक सरल दैनिक दिनचर्या जीवनभर का अनुशासन विकसित करती है।",
    ],
    bodyEn: [
      "Choose a fixed time every evening to complete your Daily Niyams.",
      "A simple daily routine develops lifelong discipline.",
    ],
  },
  {
    emoji: "🪷",
    titleHi: "संकल्प",
    titleEn: "Sankalp",
    bodyHi: [
      "जीवनभर और चातुर्मास संकल्प केवल एक बार स्वीकार किए जा सकते हैं।",
      "इनका अर्थ समझकर सच्चे मन से स्वीकार करें।",
    ],
    bodyEn: [
      "Lifetime and Chaturmas Sankalps can only be accepted once.",
      "Accept them sincerely after understanding their meaning.",
    ],
  },
  {
    emoji: "📈",
    titleHi: "आपकी प्रगति",
    titleEn: "Your Progress",
    bodyHi: [
      "अभियान के दौरान आपकी प्रगति दर्शाती है —",
      "आपकी निरंतरता, अनुशासन, ईमानदारी, और प्रतिबद्धता।",
    ],
    bodyEn: [
      "Throughout the campaign, your progress reflects your consistency, discipline, honesty, and commitment.",
    ],
  },
  {
    emoji: "🏆",
    titleHi: "पहचान",
    titleEn: "Recognition",
    bodyHi: [
      "तीनों आयु वर्गों के शीर्ष प्रतिभागियों को विशेष सम्मान मिलेगा।",
      "प्रत्येक प्रतिभागी जो सच्चे मन से अभियान पूरा करेगा उसे एक सुंदर डिजिटल प्रमाण-पत्र प्राप्त होगा।",
    ],
    bodyEn: [
      "Top participants from all three age groups will receive special recognition.",
      "Every sincere participant will receive a beautiful Digital Certificate of Participation.",
    ],
  },
];

// ─────────────── Timeline Steps ───────────────
const TIMELINE_STEPS_HI = ["पंजीकरण", "लॉन्च का इंतजार", "अभियान शुरू\n19 अगस्त", "60 दिन की यात्रा", "अभियान समाप्त\n19 अक्टूबर", "प्रमाण-पत्र"];
const TIMELINE_STEPS_EN = ["Registration", "Waiting for Launch", "Campaign Begins\n19 August", "60 Day Journey", "Campaign Ends\n19 October", "Certificates"];

// ─────────────── Countdown Block ───────────────
function CountdownBlock({ value, label }: { value: number; label: string }) {
  return (
    <motion.div
      key={value}
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "4px",
        minWidth: "56px",
      }}
    >
      <div
        style={{
          background: "rgba(255,255,255,0.15)",
          backdropFilter: "blur(12px)",
          border: "1.5px solid rgba(255,255,255,0.3)",
          borderRadius: "14px",
          padding: "10px 14px",
          fontSize: "1.75rem",
          fontWeight: 800,
          color: "#fff",
          fontFamily: "var(--font-sans)",
          lineHeight: 1,
          minWidth: "52px",
          textAlign: "center",
          boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
        }}
      >
        {String(value).padStart(2, "0")}
      </div>
      <span
        style={{
          fontSize: "0.6rem",
          fontWeight: 700,
          color: "rgba(255,240,200,0.9)",
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

// ─────────────── Main Page ───────────────
export default function RegistrationSuccessPage() {
  const { language, setLanguage } = useLanguageStore();
  const { user, profile, logout, _hasHydrated } = useAuthStore();
  const router = useRouter();
  const countdown = useCountdown(CAMPAIGN_START);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Guard: if not logged in, send to appropriate auth page
  useEffect(() => {
    if (mounted && _hasHydrated && !user?.id) {
      // Pre-launch: register first; post-launch: login
      router.replace(isCampaignAccessible() ? "/login" : "/signup");
    }
  }, [mounted, _hasHydrated, user, router]);

  // If campaign is now live, redirect to appropriate page
  useEffect(() => {
    if (mounted && _hasHydrated && user?.id && isCampaignAccessible()) {
      router.replace("/dashboard");
    }
  }, [mounted, _hasHydrated, user, router]);

  const handleRegisterAnother = useCallback(() => {
    logout();
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem("namo-jinanam-auth");
      } catch (e) {
        console.error(e);
      }
      window.location.href = "/signup?new=1";
    }
  }, [logout]);

  const handleShare = async () => {
    const text = isHi
      ? `🙏 जय जिनेन्द्र! मैंने "सन्मति - सुनील - संस्कार अभियान" (चातुर्मास 2026) में अपना पंजीकरण कर लिया है। आप भी आज ही अपने परिवार सहित जुड़ें और आध्यात्मिक लाभ प्राप्त करें:\n${typeof window !== "undefined" ? window.location.origin : "https://sanmati-sanskar.vercel.app"}`
      : `🙏 Jai Jinendra! I have registered for the "Sanmati Sunil Sanskar Abhiyan" (Chaturmas 2026). Join with your family today:\n${typeof window !== "undefined" ? window.location.origin : "https://sanmati-sanskar.vercel.app"}`;

    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: "सन्मति - सुनील - संस्कार अभियान",
          text,
          url: window.location.origin,
        });
      } catch (e) {
        console.log(e);
      }
    } else if (typeof window !== "undefined") {
      window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
    }
  };

  // Don't render until hydrated, mounted, and user is confirmed logged in
  if (!mounted || !_hasHydrated || !user?.id) return null;

  const isHi = language === "hi";
  const countdown_labels = isHi
    ? ["दिन", "घंटे", "मिनट", "सेकंड"]
    : ["Days", "Hours", "Minutes", "Seconds"];

  return (
    <div style={{ minHeight: "100vh", background: "#FAF6F0", color: "var(--text-primary)", overflowX: "hidden" }}>

      {/* ─── Hero: Gradient Glass Banner ─── */}
      <div
        style={{
          background: "linear-gradient(160deg, #4B1D15 0%, #7C2D12 45%, #B45309 100%)",
          padding: "44px 20px 40px",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative radial glow */}
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 0%, rgba(255,200,80,0.18) 0%, transparent 70%)", pointerEvents: "none" }} />

        {/* Top Floating Controls: Language Toggle & User Chip */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", position: "relative", zIndex: 10 }}>
          {profile?.full_name ? (
            <div
              className="font-devanagari"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "6px 12px",
                borderRadius: "var(--r-pill)",
                background: "rgba(255, 255, 255, 0.15)",
                backdropFilter: "blur(8px)",
                color: "#fff",
                fontSize: "0.75rem",
                fontWeight: 700,
                border: "1px solid rgba(255, 255, 255, 0.2)",
              }}
            >
              <span>👤</span>
              <span style={{ maxWidth: "160px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {profile.full_name}
              </span>
            </div>
          ) : (
            <div />
          )}

          <button
            onClick={() => setLanguage(isHi ? "en" : "hi")}
            style={{
              padding: "6px 12px",
              borderRadius: "var(--r-pill)",
              background: "rgba(255, 255, 255, 0.15)",
              backdropFilter: "blur(8px)",
              color: "#fff",
              fontWeight: 700,
              fontSize: "0.75rem",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            <Globe size={13} /> {isHi ? "English" : "हिन्दी"}
          </button>
        </div>

        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", damping: 14, delay: 0.1 }}
          style={{ fontSize: "3.25rem", marginBottom: "12px" }}
        >
          🪷
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <div
            className="font-devanagari"
            style={{
              fontSize: "0.8rem",
              fontWeight: 700,
              color: "rgba(255,220,130,0.95)",
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              marginBottom: "8px",
            }}
          >
            {isHi ? "✓ पंजीकरण सफलतापूर्वक पूर्ण" : "✓ Registration Successful"}
          </div>
          <h1
            className="font-devanagari"
            style={{
              fontSize: "1.5rem",
              fontWeight: 800,
              color: "#fff",
              lineHeight: 1.25,
              marginBottom: "6px",
              textShadow: "0 2px 16px rgba(0,0,0,0.25)",
            }}
          >
            {isHi ? "सन्मति - सुनील - संस्कार अभियान" : "Sanmati Sunil Sanskar Abhiyan"}
          </h1>
          <p
            className="font-devanagari"
            style={{
              fontSize: "0.875rem",
              color: "rgba(255,240,210,0.88)",
              lineHeight: 1.5,
              maxWidth: "340px",
              margin: "0 auto 24px",
            }}
          >
            {profile?.full_name ? `${profile.full_name}, ` : ""}
            {isHi
              ? "आपका पंजीकरण हो गया है। अभियान 19 अगस्त 2026 से शुरू होगा।"
              : "your registration is confirmed. The campaign starts on 19 August 2026."}
          </p>
        </motion.div>

        {/* Countdown */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div
            className="font-devanagari"
            style={{
              fontSize: "0.75rem",
              fontWeight: 700,
              color: "rgba(255,220,130,0.8)",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              marginBottom: "12px",
            }}
          >
            {isHi ? "अभियान शुरू होने में" : "Campaign starts in"}
          </div>
          {countdown.done ? (
            <div className="font-devanagari" style={{ fontSize: "1.25rem", color: "#86efac", fontWeight: 800 }}>
              {isHi ? "🎉 अभियान शुरू हो गया!" : "🎉 Campaign has begun!"}
            </div>
          ) : (
            <div style={{ display: "flex", justifyContent: "center", gap: "8px" }}>
              <CountdownBlock value={countdown.days} label={countdown_labels[0]} />
              <CountdownBlock value={countdown.hours} label={countdown_labels[1]} />
              <CountdownBlock value={countdown.minutes} label={countdown_labels[2]} />
              <CountdownBlock value={countdown.seconds} label={countdown_labels[3]} />
            </div>
          )}
        </motion.div>
      </div>

      <div style={{ padding: "24px 20px 100px", maxWidth: "480px", margin: "0 auto" }}>

        {/* ─── Action Card: Register Another Family Member ─── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          style={{
            background: "linear-gradient(135deg, rgba(160,98,42,0.09) 0%, rgba(92,26,16,0.04) 100%)",
            borderRadius: "20px",
            padding: "20px",
            marginBottom: "24px",
            border: "1.5px dashed rgba(160,98,42,0.4)",
            textAlign: "center",
            boxShadow: "0 4px 16px rgba(92,26,16,0.04)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", marginBottom: "6px" }}>
            <Users size={20} color="var(--gold)" />
            <h3 className="font-devanagari" style={{ fontSize: "1rem", fontWeight: 800, color: "var(--brand)", margin: 0 }}>
              {isHi ? "परिवार के अन्य सदस्य को जोड़ें" : "Register Another Family Member"}
            </h3>
          </div>
          <p className="font-devanagari" style={{ fontSize: "0.8125rem", color: "var(--text-secondary)", marginBottom: "14px", lineHeight: 1.45 }}>
            {isHi
              ? "क्या आप परिवार के किसी अन्य सदस्य, बच्चे या मित्र का भी पंजीकरण करना चाहते हैं?"
              : "Would you like to register other family members, children, or friends?"}
          </p>
          <button
            onClick={handleRegisterAnother}
            className="font-devanagari"
            style={{
              width: "100%",
              padding: "13px 18px",
              borderRadius: "14px",
              background: "#fff",
              color: "var(--brand)",
              fontSize: "0.9375rem",
              fontWeight: 800,
              border: "1.5px solid var(--brand)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              boxShadow: "0 4px 12px rgba(92,26,16,0.08)",
            }}
          >
            <UserPlus size={18} />
            {isHi ? "+ किसी अन्य सदस्य का पंजीकरण करें" : "+ Register Another Person"}
          </button>
        </motion.div>

        {/* ─── Timeline ─── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          style={{
            background: "#fff",
            borderRadius: "20px",
            padding: "24px 20px",
            marginBottom: "24px",
            boxShadow: "0 4px 24px rgba(92,26,16,0.07)",
            border: "1px solid var(--surface-border)",
          }}
        >
          <h2
            className="font-devanagari"
            style={{
              fontSize: "1rem",
              fontWeight: 800,
              color: "var(--brand)",
              textAlign: "center",
              marginBottom: "24px",
            }}
          >
            {isHi ? "आपकी यात्रा का मार्ग" : "Your Journey Path"}
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {(isHi ? TIMELINE_STEPS_HI : TIMELINE_STEPS_EN).map((step, i, arr) => {
              const isDone = i === 0;
              const isCurrent = i === 1;
              return (
                <div key={i} style={{ display: "flex", gap: "14px", alignItems: "flex-start" }}>
                  {/* Dot + line */}
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "18px", flexShrink: 0, paddingTop: "3px" }}>
                    <div
                      style={{
                        width: "14px",
                        height: "14px",
                        borderRadius: "50%",
                        background: isDone ? "var(--emerald)" : isCurrent ? "var(--gold)" : "var(--surface-border)",
                        border: isDone ? "2px solid #059669" : isCurrent ? "2px solid var(--gold-light)" : "2px solid var(--surface-border-md)",
                        flexShrink: 0,
                        boxShadow: isCurrent ? "0 0 0 4px rgba(160,98,42,0.15)" : "none",
                      }}
                    />
                    {i < arr.length - 1 && (
                      <div style={{ width: "2px", minHeight: "28px", background: isDone ? "var(--emerald)" : "var(--surface-border)", margin: "4px 0", flex: 1 }} />
                    )}
                  </div>
                  {/* Label */}
                  <div style={{ paddingBottom: "12px" }}>
                    <div
                      className="font-devanagari"
                      style={{
                        fontSize: "0.875rem",
                        fontWeight: isDone || isCurrent ? 700 : 500,
                        color: isDone ? "var(--emerald)" : isCurrent ? "var(--gold)" : "var(--text-muted)",
                        whiteSpace: "pre-line",
                        lineHeight: 1.4,
                      }}
                    >
                      {step}
                      {isDone && (
                        <span style={{ marginLeft: "8px", fontSize: "0.7rem", background: "var(--emerald-dim)", color: "var(--emerald)", borderRadius: "6px", padding: "1px 6px", fontWeight: 700 }}>
                          ✓ {isHi ? "पूर्ण" : "Done"}
                        </span>
                      )}
                      {isCurrent && (
                        <span style={{ marginLeft: "8px", fontSize: "0.7rem", background: "var(--gold-dim)", color: "var(--gold)", borderRadius: "6px", padding: "1px 6px", fontWeight: 700 }}>
                          {isHi ? "अभी" : "Now"}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* ─── Info Cards ─── */}
        {CARDS.map((card, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 + i * 0.06 }}
            style={{
              background: "#fff",
              borderRadius: "18px",
              padding: "20px",
              marginBottom: "14px",
              boxShadow: "0 2px 16px rgba(92,26,16,0.06)",
              border: "1px solid var(--surface-border)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
              <span style={{ fontSize: "1.375rem" }}>{card.emoji}</span>
              <h3
                className="font-devanagari"
                style={{ fontSize: "0.9375rem", fontWeight: 800, color: "var(--brand)", margin: 0 }}
              >
                {isHi ? card.titleHi : card.titleEn}
              </h3>
            </div>
            <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: "6px" }}>
              {(isHi ? card.bodyHi : card.bodyEn).map((line, j) => (
                <li
                  key={j}
                  className="font-devanagari"
                  style={{
                    fontSize: "0.8125rem",
                    color: "var(--text-secondary)",
                    lineHeight: 1.6,
                    display: "flex",
                    gap: "8px",
                    alignItems: "flex-start",
                  }}
                >
                  <span style={{ color: "var(--gold)", marginTop: "2px", flexShrink: 0 }}>•</span>
                  {line}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}

        {/* ─── Closing Quote ─── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.05 }}
          style={{
            background: "linear-gradient(135deg, #4B1D15 0%, #7C2D12 100%)",
            borderRadius: "20px",
            padding: "28px 24px",
            textAlign: "center",
            marginBottom: "20px",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 0%, rgba(255,200,80,0.12) 0%, transparent 70%)", pointerEvents: "none" }} />
          <div style={{ fontSize: "2rem", marginBottom: "12px" }}>🪷</div>
          <p
            className="font-devanagari"
            style={{
              fontSize: "1rem",
              fontWeight: 700,
              color: "rgba(255,240,200,0.95)",
              lineHeight: 1.6,
              fontStyle: "italic",
              margin: 0,
            }}
          >
            {isHi
              ? '"प्रतिदिन एक अच्छा कार्य आपका जीवन बदल सकता है।"'
              : '"One Good Deed Every Day Can Change Your Life."'}
          </p>
        </motion.div>

        {/* ─── Bottom Actions Stack ─── */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "36px" }}>
          {/* Action 1: Share on WhatsApp / Invite Family */}
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleShare}
            className="font-devanagari"
            style={{
              width: "100%",
              padding: "16px",
              borderRadius: "16px",
              background: "#25D366",
              color: "#fff",
              fontSize: "1.0625rem",
              fontWeight: 800,
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              boxShadow: "0 8px 24px rgba(37,211,102,0.3)",
              letterSpacing: "0.01em",
            }}
          >
            <Share2 size={20} />
            {isHi ? "📲 परिजनों व मित्रों के साथ शेयर करें (WhatsApp)" : "📲 Share with Family & Friends (WhatsApp)"}
          </motion.button>

          {/* Action 2: Register Another Person */}
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleRegisterAnother}
            className="font-devanagari"
            style={{
              width: "100%",
              padding: "14px",
              borderRadius: "16px",
              background: "var(--surface-raised)",
              color: "var(--brand)",
              fontSize: "0.9375rem",
              fontWeight: 800,
              border: "1.5px solid var(--surface-border)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.04)",
            }}
          >
            <UserPlus size={18} />
            {isHi ? "+ परिवार / अन्य सदस्य का पंजीकरण करें" : "+ Register Another Family Member"}
          </motion.button>

          {/* Action 3: I Understand (Dismiss/Acknowledge) */}
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.15 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => {
              alert(isHi ? "अभियान 19 अगस्त से शुरू होगा। प्रतिदिन ऐप खोलकर अपने नियम भरें।" : "The campaign starts on 19 August. Open daily to log your Niyams.");
            }}
            className="font-devanagari"
            style={{
              width: "100%",
              padding: "13px",
              borderRadius: "16px",
              background: "transparent",
              color: "var(--text-muted)",
              fontSize: "0.875rem",
              fontWeight: 600,
              border: "none",
              cursor: "pointer",
            }}
          >
            {isHi ? "मैं समझ गया / समझी ✓" : "I Understand ✓"}
          </motion.button>
        </div>

        {/* ─── Footer ─── */}
        <div style={{ textAlign: "center", paddingBottom: "24px" }}>
          <div
            className="font-devanagari"
            style={{ fontSize: "0.6875rem", color: "var(--text-muted)" }}
          >
            {isHi ? "Nirgranth Creations द्वारा निर्मित" : "Created by Nirgranth Creations"}
          </div>
        </div>
      </div>
    </div>
  );
}
