"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuthStore } from "@/store/authStore";
import { useLanguageStore } from "@/store/languageStore";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { ArrowRight, Globe } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const { setUser, setProfile, setStats } = useAuthStore();
  const { language, setLanguage } = useLanguageStore();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier || !password) return;

    const isEmail = identifier.includes("@");
    const emailStr = isEmail ? identifier : `${identifier.replace(/\D/g, "")}@namojinanam.com`;
    const phoneStr = isEmail ? "" : identifier;

    let userId = "user-" + Date.now();
    let fetchedProfile: any = null;
    let fetchedStats: any = null;

    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: emailStr,
        password: password,
      });

      if (authData?.user) {
        userId = authData.user.id;

        // Fetch user profile from Supabase Cloud
        const { data: prof } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", userId)
          .single();

        if (prof) fetchedProfile = prof;

        // Fetch user stats from Supabase Cloud
        const { data: st } = await supabase
          .from("user_stats")
          .select("*")
          .eq("user_id", userId)
          .single();

        if (st) fetchedStats = st;
      }
    } catch (e) {
      console.warn("Supabase auth login fallback", e);
    }

    setUser({ id: userId, email: emailStr });
    setProfile({
      id: userId,
      user_id: userId,
      full_name: fetchedProfile?.full_name || (language === "hi" ? "अमित जैन" : "Amit Jain"),
      phone: fetchedProfile?.phone || phoneStr,
      gender: fetchedProfile?.gender || "male",
      age_group: fetchedProfile?.age_group || "24-40",
      dob: fetchedProfile?.dob || "2000-01-01",
      email: emailStr,
      address: fetchedProfile?.city || "Mumbai",
      state: "",
      city: fetchedProfile?.city || "Mumbai",
      temple_id: "temple_01",
      father_name: fetchedProfile?.father_name || (language === "hi" ? "श्री रमेश जैन" : "Shri Ramesh Jain"),
      mother_name: fetchedProfile?.mother_name || (language === "hi" ? "श्रीमती कमला जैन" : "Smt. Kamla Jain"),
      role: "participant",
      created_at: new Date().toISOString()
    });

    setStats({
      id: "stats-" + userId,
      user_id: userId,
      total_points: fetchedStats?.total_points ?? 0,
      today_points: 0,
      current_streak: fetchedStats?.current_streak ?? 0,
      longest_streak: fetchedStats?.best_streak ?? 0,
      best_streak: fetchedStats?.best_streak ?? 0,
      total_days_participated: 0,
      completion_percentage: 0,
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
          <Globe size={14} style={{ display: "inline" }} /> {language === "hi" ? "English" : "हिन्दी"}
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
                {language === "hi" ? "ईमेल या मोबाइल नंबर (Email or Mobile Number)" : "Email or Mobile Number"}
              </label>
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder={language === "hi" ? "अपना ईमेल या मोबाइल नंबर दर्ज करें" : "Enter your email or mobile number"}
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
                setIdentifier("9876543210");
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
