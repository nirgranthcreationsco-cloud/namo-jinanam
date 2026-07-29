"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuthStore } from "@/store/authStore";
import { ArrowRight, Hexagon } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setUser, setProfile, setStats } = useAuthStore();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    // In a real app, this would verify Email & Password with Supabase
    // For now, mock a successful login
    setUser({ id: "mock-id", email: email });
    setProfile({
      id: "mock-id",
      user_id: "mock-id",
      full_name: "अमित जैन",
      phone: "9876543210",
      gender: "male",
      age_group: "adult",
      dob: "2000-01-01",
      email: "mock@example.com",
      address: "Mumbai",
      state: "Maharashtra",
      city: "Mumbai",
      temple_id: "temple_01",
      father_name: "श्री रमेश जैन",
      mother_name: "श्रीमती कमला जैन",
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
          <img src="/logo.png" alt="णमो जिणाणं Logo" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </motion.div>
        
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="display-lg font-devanagari gradient-brand"
          style={{ marginBottom: "8px" }}
        >
          णमो जिणाणं
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="body-md font-devanagari"
          style={{ color: "var(--text-secondary)", letterSpacing: "0.08em" }}
        >
          संस्कार · संयम · साधना · सफलता
        </motion.p>
      </div>

      {/* Form */}
      <div style={{ flex: 1, padding: "0 20px", marginTop: "-30px" }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card"
          style={{ padding: "32px 24px", maxWidth: "400px", margin: "0 auto", background: "var(--surface-raised)", boxShadow: "var(--shadow-lg)" }}
        >
          <h2 className="heading-lg font-devanagari" style={{ marginBottom: "24px", textAlign: "center" }}>लॉगिन करें</h2>
          
          <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div>
              <label className="field-label font-devanagari">ईमेल (Email ID)</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="अपना ईमेल दर्ज करें"
                className="field"
                required
                style={{ fontSize: "1rem" }}
              />
            </div>
            
            <div>
              <label className="field-label font-devanagari">पासवर्ड (Password)</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="पासवर्ड दर्ज करें"
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
              <span className="font-devanagari">लॉगिन (Login)</span>
              <ArrowRight size={18} />
            </button>
          </form>

          {/* Quick Demo Mode */}
          <div style={{ marginTop: "32px", textAlign: "center" }}>
            <div className="divider font-devanagari" style={{ marginBottom: "24px" }}>या</div>
            <button
              onClick={() => {
                setEmail("demo@namo.com");
                setPassword("password123");
                setTimeout(() => handleLogin({ preventDefault: () => {} } as any), 100);
              }}
              className="btn btn-secondary"
              style={{ width: "100%" }}
            >
              <span className="font-devanagari">डेमो खाता खोलें (Try Demo)</span>
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
