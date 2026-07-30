"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuthStore } from "@/store/authStore";
import { useLanguageStore } from "@/store/languageStore";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const { setUser, setProfile, setStats } = useAuthStore();
  const { language, setLanguage } = useLanguageStore();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || !password) return;

    setUser({ id: "mock-id", email: `${phone}@namo.com` });
    setProfile({
      id: "mock-id",
      user_id: "mock-id",
      full_name: language === "hi" ? "अमित जैन" : "Amit Jain",
      phone: phone,
      gender: "male",
      age_group: "adult",
      dob: "2000-01-01",
      email: `${phone}@namo.com`,
      address: "Mumbai",
      state: "Maharashtra",
      city: "Mumbai",
      temple_id: "temple_01",
      father_name: language === "hi" ? "श्री रमेश जैन" : "Shri Ramesh Jain",
      mother_name: language === "hi" ? "श्रीमती कमला जैन" : "Smt. Kamla Jain",
      role: "participant",
      created_at: new Date().toISOString()
    });
    setStats({
      id: "mock-stats-id",
      user_id: "mock-id",
      total_points: 450,
      today_points: 0,
      current_streak: 3,
      longest_streak: 5,
      total_days_participated: 12,
      level: 2,
      level_name_hi: "उपासक",
      level_name_en: "Upasak",
      completion_percentage: 45,
      badges: []
    });
    router.replace("/dashboard");
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "var(--surface-bg)", color: "var(--text-primary)" }}>
      {/* Language Switcher Float */}
      <div style={{ position: "absolute", top: "16px", right: "16px", zIndex: 100 }}>
        <button
          onClick={() => setLanguage(language === "hi" ? "en" : "hi")}
          style={{
            padding: "8px 16px",
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
          🌐 {language === "hi" ? "English" : "हिन्दी"}
        </button>
      </div>

      {/* Top Banner */}
      <div
        style={{
          padding: "40px 20px 60px",
          textAlign: "center",
          background: "var(--surface-overlay)",
          position: "relative",
          overflow: "hidden"
        }}
      >
        <div style={{ position: "absolute", top: "-50px", left: "50%", transform: "translateX(-50%)", width: "300px", height: "300px", background: "radial-gradient(circle, var(--brand-glow) 0%, transparent 70%)", pointerEvents: "none" }} />
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          style={{
            width: "120px", height: "120px", borderRadius: "50%",
            margin: "0 auto 24px", overflow: "hidden",
            boxShadow: "0 12px 32px var(--brand-glow), 0 4px 12px rgba(0,0,0,0.1)",
            border: "4px solid var(--surface-bg)",
            position: "relative", zIndex: 2
          }}
        >
          <img src="/logo.png" alt="Logo" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </motion.div>
        
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="display-lg font-devanagari gradient-brand"
          style={{ marginBottom: "8px", fontSize: "2rem" }}
        >
          {language === "hi" ? "सन्मति - सुनील - संस्कार अभियान" : "Sanmati Sunil Sanskar Abhiyan"}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="body-md font-devanagari"
          style={{ color: "var(--text-secondary)", letterSpacing: "0.08em" }}
        >
          {language === "hi"
            ? "संस्कार · संयम · साधना · सफलता"
            : "Values · Restraint · Sadhana · Success"
          }
        </motion.p>
      </div>

      {/* Form */}
      <div style={{ flex: 1, padding: "0 20px", marginTop: "-30px", zIndex: 5 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card"
          style={{ padding: "32px 24px", maxWidth: "400px", margin: "0 auto", background: "var(--surface-raised)", boxShadow: "var(--shadow-lg)" }}
        >
          <h2 className="heading-lg font-devanagari" style={{ marginBottom: "24px", textAlign: "center" }}>
            {language === "hi" ? "लॉगिन करें" : "Login"}
          </h2>
          
          <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div>
              <label className="field-label font-devanagari">
                {language === "hi" ? "मोबाइल नंबर (Mobile Number)" : "Mobile Number"}
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, "");
                  if (val.length <= 10) setPhone(val);
                }}
                placeholder={language === "hi" ? "अपना 10 अंकों का मोबाइल नंबर दर्ज करें" : "Enter your 10-digit mobile number"}
                className="field"
                required
                style={{ fontSize: "1rem" }}
              />
            </div>
            
            <div>
              <label className="field-label font-devanagari">
                {language === "hi" ? "पासवर्ड (Password)" : "Password"}
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={language === "hi" ? "पासवर्ड दर्ज करें" : "Enter password"}
                className="field"
                required
                style={{ fontSize: "1rem" }}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: "100%", padding: "16px", marginTop: "8px", fontSize: "1rem" }}
            >
              <span className="font-devanagari">
                {language === "hi" ? "लॉगिन (Login)" : "Login"}
              </span>
              <ArrowRight size={18} />
            </button>
          </form>

          {/* Quick Demo Mode */}
          <div style={{ marginTop: "32px", textAlign: "center" }}>
            <div className="divider font-devanagari" style={{ marginBottom: "24px" }}>
              {language === "hi" ? "या" : "OR"}
            </div>
            <button
              onClick={() => {
                setPhone("9876543210");
                setPassword("password123");
                setTimeout(() => handleLogin({ preventDefault: () => {} } as any), 100);
              }}
              className="btn btn-secondary"
              style={{ width: "100%" }}
            >
              <span className="font-devanagari">
                {language === "hi" ? "डेमो खाता खोलें (Try Demo)" : "Try Demo Account"}
              </span>
            </button>
          </div>

          <div style={{ marginTop: "24px", textAlign: "center" }}>
            <span className="font-devanagari" style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>
              {language === "hi" ? "खाता नहीं है? " : "Don't have an account? "}
            </span>
            <Link href="/signup" className="font-devanagari" style={{ fontSize: "0.875rem", color: "var(--brand)", fontWeight: 700, textDecoration: "none" }}>
              {language === "hi" ? "रजिस्टर करें (Register Now)" : "Register Now"}
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
