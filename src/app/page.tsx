"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useLanguageStore } from "@/store/languageStore";
import { useAuthStore } from "@/store/authStore";
import { isCampaignAccessible } from "@/config/campaign";
import { ArrowRight, Sparkles, Heart, Trophy, Globe, Rocket, Flame } from "lucide-react";

export default function LandingPage() {
  const { language, setLanguage } = useLanguageStore();
  const { user, hasSeenOnboarding, _hasHydrated } = useAuthStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (_hasHydrated) {
      if (user?.id) {
        // Logged in: campaign live → dashboard; pre-launch → registration-success
        router.replace(isCampaignAccessible() ? "/dashboard" : "/registration-success");
      } else if (!isCampaignAccessible()) {
        // Pre-launch: unregistered users should register first
        router.replace("/signup");
      } else if (!hasSeenOnboarding) {
        router.replace("/onboarding");
      }
    }
  }, [user, hasSeenOnboarding, _hasHydrated, router]);

  // Don't show landing page during pre-launch
  if (!mounted || !_hasHydrated || user?.id || !isCampaignAccessible()) {
    return null;
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--surface-bg)", color: "var(--text-primary)" }}>
      {/* ── Navbar ── */}
      <nav style={{ padding: "16px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, background: "rgba(253, 251, 247, 0.9)", backdropFilter: "blur(12px)", zIndex: 50, borderBottom: "1px solid var(--surface-border)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <img src="/logo.png" alt="सन्मति - सुनील - संस्कार अभियान Logo" style={{ width: "36px", height: "36px", borderRadius: "50%", objectFit: "cover", boxShadow: "var(--shadow-sm)" }} />
          <span className="heading-md font-devanagari text-brand" style={{ fontSize: "1rem" }}>
            {language === "hi" ? "सन्मति - सुनील - संस्कार अभियान" : "Sanmati Sunil Sanskar Abhiyan"}
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {/* Language Toggle Button */}
          <button
            onClick={() => setLanguage(language === "hi" ? "en" : "hi")}
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
              gap: "4px"
            }}
          >
            <Globe size={14} style={{ display: "inline" }} /> {language === "hi" ? "English" : "हिन्दी"}
          </button>
          
          <Link href="/login" style={{ textDecoration: "none" }}>
            <button className="btn btn-primary" style={{ padding: "8px 20px", fontSize: "0.9375rem" }}>
              {language === "hi" ? "लॉगिन" : "Login"}
            </button>
          </Link>
        </div>
      </nav>

      {/* ── Hero Section ── */}
      <section style={{ padding: "60px 20px 40px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, type: "spring" }}
          style={{
            width: "140px", height: "140px", borderRadius: "50%",
            margin: "0 auto 24px", overflow: "hidden",
            boxShadow: "0 12px 40px var(--brand-glow), 0 4px 12px rgba(0,0,0,0.1)",
            border: "4px solid var(--surface-bg)",
            position: "relative", zIndex: 2
          }}
        >
          <img src="/logo.png" alt="सन्मति - सुनील - संस्कार अभियान Logo" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{ position: "relative", zIndex: 1, maxWidth: "600px", margin: "0 auto" }}
        >
          <div className="chip chip-gold" style={{ marginBottom: "24px" }}>
            <Sparkles size={14} fill="currentColor" />
            <span className="font-devanagari">
              {language === "hi" ? "चातुर्मास संस्कार अभियान २०२६" : "Chaturmas Sanskar Campaign 2026"}
            </span>
          </div>
          
          <h1 className="display-lg font-devanagari text-brand" style={{ marginBottom: "16px", lineHeight: 1.2 }}>
            {language === "hi" ? (
              <>
                संस्कार <span className="text-gold">•</span> संयम <br />
                साधना <span className="text-gold">•</span> सफलता
              </>
            ) : (
              <>
                Values <span className="text-gold">•</span> Restraint <br />
                Sadhana <span className="text-gold">•</span> Success
              </>
            )}
          </h1>
          
          <p className="body-lg font-devanagari text-muted" style={{ marginBottom: "40px", maxWidth: "480px", margin: "0 auto 40px" }}>
            {language === "hi"
              ? "आधुनिक जीवनशैली में जैन धर्म के शाश्वत मूल्यों को अपनाएं। अपनी दैनिक साधना को ट्रैक करें और आध्यात्मिक उन्नति की ओर बढ़ें।"
              : "Embrace the eternal values of Jainism in modern lifestyle. Track your daily sadhana and progress towards spiritual growth."
            }
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px", alignItems: "center" }}>
            <Link href="/signup" style={{ textDecoration: "none", width: "100%", maxWidth: "300px" }}>
              <button className="btn btn-primary" style={{ width: "100%", padding: "16px 32px", fontSize: "1.125rem", borderRadius: "var(--r-xl)", background: "linear-gradient(135deg, var(--brand), var(--brand-light))", boxShadow: "0 8px 24px var(--brand-glow)" }}>
                <span className="font-devanagari">
                  {language === "hi" ? "अभी रजिस्टर करें " : "Register Now "}
                </span>
                <Rocket size={18} style={{ display: "inline", verticalAlign: "middle", marginLeft: "4px" }} />
                <ArrowRight size={20} />
              </button>
            </Link>
            <div className="font-devanagari text-dimmed" style={{ fontSize: "0.875rem", fontWeight: 500 }}>
              {language === "hi"
                ? "युवाओं की नई आध्यात्मिक क्रांति का हिस्सा बनें!"
                : "Become part of the new spiritual revolution for youth!"
              } <Flame size={14} style={{ display: "inline", verticalAlign: "middle", marginLeft: "4px" }} />
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── Features Grid ── */}
      <section style={{ padding: "40px 20px 80px", maxWidth: "800px", margin: "0 auto" }}>
        <h2 className="heading-xl font-devanagari text-brand" style={{ textAlign: "center", marginBottom: "32px" }}>
          {language === "hi" ? "आपकी साधना का डिजिटल साथी" : "Digital Companion for your Sadhana"}
        </h2>
        
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px" }}>
          {/* Card 1 */}
          <motion.div whileHover={{ y: -4 }} className="card" style={{ padding: "24px", display: "flex", gap: "16px", background: "var(--surface-base)" }}>
            <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "var(--brand-dim)", color: "var(--brand)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Heart size={24} />
            </div>
            <div>
              <h3 className="heading-md font-devanagari" style={{ marginBottom: "8px", color: "var(--text-primary)" }}>
                {language === "hi" ? "स्वस्थ जीवनशैली" : "Healthy Lifestyle"}
              </h3>
              <p className="body-sm font-devanagari text-muted">
                {language === "hi"
                  ? "सात्विक आहार और संयम के साथ अपने शारीरिक और मानसिक स्वास्थ्य को बेहतर बनाएं।"
                  : "Improve your physical and mental health with a pure diet and mindful living."
                }
              </p>
            </div>
          </motion.div>

          {/* Card 2 */}
          <motion.div whileHover={{ y: -4 }} className="card" style={{ padding: "24px", display: "flex", gap: "16px", background: "var(--surface-base)" }}>
            <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "var(--emerald-dim)", color: "var(--emerald)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Sparkles size={24} />
            </div>
            <div>
              <h3 className="heading-md font-devanagari" style={{ marginBottom: "8px", color: "var(--text-primary)" }}>
                {language === "hi" ? "डिजिटल डिटॉक्स" : "Digital Detox"}
              </h3>
              <p className="body-sm font-devanagari text-muted">
                {language === "hi"
                  ? "स्क्रीन टाइम कम करें, ध्यान केंद्रित करें और अपनी एकाग्रता को बढ़ाएं।"
                  : "Reduce screen time, improve focus, and enhance your concentration."
                }
              </p>
            </div>
          </motion.div>

          {/* Card 3 */}
          <motion.div whileHover={{ y: -4 }} className="card" style={{ padding: "24px", display: "flex", gap: "16px", background: "var(--surface-base)" }}>
            <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "var(--lotus-dim)", color: "var(--lotus)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Trophy size={24} />
            </div>
            <div>
              <h3 className="heading-md font-devanagari" style={{ marginBottom: "8px", color: "var(--text-primary)" }}>
                {language === "hi" ? "व्यक्तिगत विकास" : "Personal Growth"}
              </h3>
              <p className="body-sm font-devanagari text-muted">
                {language === "hi"
                  ? "नियमित स्वाध्याय से आत्म-विकास करें और एक बेहतर इंसान बनें।"
                  : "Achieve self-improvement through regular study and become a better you."
                }
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: "40px 20px", textAlign: "center", borderTop: "1px solid var(--surface-border)", background: "var(--surface-overlay)" }}>
        <div className="font-devanagari text-dimmed" style={{ marginBottom: "12px" }}>
          {language === "hi" ? "टीम नमो जिनाणम" : "Team NAMO JINANAM"}
        </div>
        <div className="font-devanagari label text-gold">
          {language === "hi" ? "जय जिनेन्द्र" : "Jai Jinendra"}
        </div>
      </footer>
    </div>
  );
}
