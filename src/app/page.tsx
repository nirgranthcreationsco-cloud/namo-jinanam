"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, BookOpen, Heart, Trophy, MapPin, Hexagon } from "lucide-react";

export default function LandingPage() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--surface-bg)", color: "var(--text-primary)" }}>
      {/* ── Navbar ── */}
      <nav style={{ padding: "16px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, background: "rgba(253, 251, 247, 0.9)", backdropFilter: "blur(12px)", zIndex: 50, borderBottom: "1px solid var(--surface-border)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <img src="/logo.png" alt="नमो जिनाणं Logo" style={{ width: "36px", height: "36px", borderRadius: "50%", objectFit: "cover", boxShadow: "var(--shadow-sm)" }} />
          <span className="heading-md font-devanagari text-brand">णमो जिणाणं</span>
        </div>
        <Link href="/login" style={{ textDecoration: "none" }}>
          <button className="btn btn-primary" style={{ padding: "8px 20px", fontSize: "0.9375rem" }}>
            लॉगिन
          </button>
        </Link>
      </nav>

      {/* ── Hero Section ── */}
      <section style={{ padding: "60px 20px 40px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        {/* Decorative background mandalas/gradients */}
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
          <img src="/logo.png" alt="णमो जिणाणं Logo" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{ position: "relative", zIndex: 1, maxWidth: "600px", margin: "0 auto" }}
        >
          <div className="chip chip-gold" style={{ marginBottom: "24px" }}>
            <Sparkles size={14} fill="currentColor" />
            <span className="font-devanagari">चातुर्मास संस्कार अभियान २०२५</span>
          </div>
          
          <h1 className="display-lg font-devanagari text-brand" style={{ marginBottom: "16px" }}>
            संस्कार <span className="text-gold">•</span> संयम <br />
            साधना <span className="text-gold">•</span> सफलता
          </h1>
          
          <p className="body-lg font-devanagari text-muted" style={{ marginBottom: "40px", maxWidth: "480px", margin: "0 auto 40px" }}>
            आधुनिक जीवनशैली में जैन धर्म के शाश्वत मूल्यों को अपनाएं। अपनी दैनिक साधना को ट्रैक करें, बैज जीतें और आध्यात्मिक उन्नति की ओर बढ़ें।
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px", alignItems: "center" }}>
            <Link href="/signup" style={{ textDecoration: "none", width: "100%", maxWidth: "300px" }}>
              <button className="btn btn-primary" style={{ width: "100%", padding: "16px 32px", fontSize: "1.125rem", borderRadius: "var(--r-xl)", background: "linear-gradient(135deg, var(--brand), var(--brand-light))", boxShadow: "0 8px 24px var(--brand-glow)" }}>
                <span className="font-devanagari" style={{ fontWeight: 700 }}>अभी रजिस्टर करें 🚀</span>
                <ArrowRight size={20} />
              </button>
            </Link>
            <div className="font-devanagari text-dimmed" style={{ fontSize: "0.875rem", fontWeight: 500 }}>
              युवाओं की नई आध्यात्मिक क्रांति का हिस्सा बनें! 🔥
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── Features Grid ── */}
      <section style={{ padding: "40px 20px 80px", maxWidth: "800px", margin: "0 auto" }}>
        <h2 className="heading-xl font-devanagari text-brand" style={{ textAlign: "center", marginBottom: "32px" }}>
          आपकी साधना का डिजिटल साथी
        </h2>
        
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px" }}>
          
          {/* Card 1 */}
          <motion.div whileHover={{ y: -4 }} className="card" style={{ padding: "24px", display: "flex", gap: "16px", background: "var(--surface-base)" }}>
            <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "var(--brand-dim)", color: "var(--brand)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <BookOpen size={24} />
            </div>
            <div>
              <h3 className="heading-md font-devanagari" style={{ marginBottom: "8px", color: "var(--text-primary)" }}>दैनिक नियम</h3>
              <p className="body-sm font-devanagari text-muted">
                आहार, स्वाध्याय, और देव दर्शन जैसे दैनिक नियमों का सरलता से पालन करें।
              </p>
            </div>
          </motion.div>

          {/* Card 2 */}
          <motion.div whileHover={{ y: -4 }} className="card" style={{ padding: "24px", display: "flex", gap: "16px", background: "var(--surface-base)" }}>
            <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "var(--emerald-dim)", color: "var(--emerald)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Heart size={24} />
            </div>
            <div>
              <h3 className="heading-md font-devanagari" style={{ marginBottom: "8px", color: "var(--text-primary)" }}>आजीवन संकल्प</h3>
              <p className="body-sm font-devanagari text-muted">
                आजीवन व्यसन मुक्ति और सात्विक आहार के दृढ़ संकल्प लें।
              </p>
            </div>
          </motion.div>

          {/* Card 3 */}
          <motion.div whileHover={{ y: -4 }} className="card" style={{ padding: "24px", display: "flex", gap: "16px", background: "var(--surface-base)" }}>
            <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "var(--gold-dim)", color: "var(--gold)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Trophy size={24} />
            </div>
            <div>
              <h3 className="heading-md font-devanagari" style={{ marginBottom: "8px", color: "var(--text-primary)" }}>उपलब्धि बैज</h3>
              <p className="body-sm font-devanagari text-muted">
                अपनी निरंतर साधना के लिए विशेष आध्यात्मिक बैज और XP अर्जित करें।
              </p>
            </div>
          </motion.div>

          {/* Card 4 */}
          <motion.div whileHover={{ y: -4 }} className="card" style={{ padding: "24px", display: "flex", gap: "16px", background: "var(--surface-base)" }}>
            <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "var(--lotus-dim)", color: "var(--lotus)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <MapPin size={24} />
            </div>
            <div>
              <h3 className="heading-md font-devanagari" style={{ marginBottom: "8px", color: "var(--text-primary)" }}>समाज से जुड़ाव</h3>
              <p className="body-sm font-devanagari text-muted">
                अपने स्थानीय मंदिर और जैन समाज के साथ मिलकर धर्म प्रभावना करें।
              </p>
            </div>
          </motion.div>
          
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: "40px 20px", textAlign: "center", borderTop: "1px solid var(--surface-border)", background: "var(--surface-overlay)" }}>
        <div className="font-devanagari text-dimmed" style={{ marginBottom: "12px" }}>
          आयोजक: श्री दिगम्बर जैन समाज
        </div>
        <div className="font-devanagari label text-gold">
          जय जिनेन्द्र
        </div>
      </footer>
    </div>
  );
}
