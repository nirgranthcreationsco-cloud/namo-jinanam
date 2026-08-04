"use client";

import { motion } from "framer-motion";
import { useAuthStore } from "@/store/authStore";
import { useLanguageStore } from "@/store/languageStore";
import { CertificateGenerator } from "@/components/CertificateGenerator";
import { 
  LogOut, Flame, Calendar, Star, 
  Download, ShieldCheck 
} from "lucide-react";

export default function ProfilePage() {
  const { profile, stats, logout } = useAuthStore();
  const { language } = useLanguageStore();

  if (!profile || !stats) return null;

  return (
    <div style={{ paddingBottom: "100px", maxWidth: "480px", margin: "0 auto", padding: "24px 16px 100px" }}>
      {/* Profile Header Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="card"
        style={{
          padding: "24px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "16px",
          textAlign: "center",
          background: "var(--surface-raised)",
          border: "1px solid var(--surface-border)",
          borderRadius: "var(--r-xl)",
          marginBottom: "20px"
        }}
      >
        {/* Avatar letter */}
        <div
          style={{
            width: "72px",
            height: "72px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, var(--brand), var(--gold))",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1.75rem",
            fontWeight: 800,
            color: "white",
            boxShadow: "var(--shadow-md)"
          }}
        >
          {profile.full_name.charAt(0)}
        </div>

        <div>
          <h2 className="heading-lg font-devanagari" style={{ color: "var(--text-primary)", marginBottom: "4px" }}>
            {profile.full_name}
          </h2>
          <p className="font-devanagari" style={{ fontSize: "0.8125rem", color: "var(--text-muted)" }}>
            📍 {profile.city} • {profile.age_group} Group
          </p>
        </div>

        {/* Core Stats row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px", width: "100%", marginTop: "8px", borderTop: "1px solid var(--surface-border)", paddingTop: "16px" }}>
          {[
            { value: stats.total_xp, label: language === "hi" ? "कुल अंक" : "Total XP", icon: Star, color: "var(--gold)" },
            { value: stats.current_streak, label: language === "hi" ? "स्ट्रीक" : "Streak", icon: Flame, color: "var(--brand)" },
            { value: stats.days_completed, label: language === "hi" ? "कुल दिन" : "Days Active", icon: Calendar, color: "var(--emerald)" },
          ].map((s, i) => (
            <div key={i} style={{ textAlign: "center" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", color: s.color, marginBottom: "4px" }}>
                <s.icon size={16} fill={s.icon === Star || s.icon === Flame ? "currentColor" : "none"} />
              </div>
              <div style={{ fontSize: "1.125rem", fontWeight: 700, color: "var(--text-primary)" }}>{s.value}</div>
              <div className="font-devanagari" style={{ fontSize: "0.6875rem", color: "var(--text-muted)", marginTop: "2px" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Account Info Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card"
        style={{
          padding: "20px",
          background: "var(--surface-raised)",
          border: "1px solid var(--surface-border)",
          borderRadius: "var(--r-xl)",
          marginBottom: "20px"
        }}
      >
        <h3 className="font-devanagari" style={{ fontSize: "0.875rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "14px", borderBottom: "1px solid var(--surface-border)", paddingBottom: "8px" }}>
          {language === "hi" ? "विवरण (Details)" : "Profile Details"}
        </h3>
        
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {profile.phone && (
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8125rem" }}>
              <span className="font-devanagari" style={{ color: "var(--text-muted)" }}>{language === "hi" ? "मोबाइल नंबर" : "Phone"}</span>
              <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>{profile.phone}</span>
            </div>
          )}
          {profile.email && (
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8125rem" }}>
              <span className="font-devanagari" style={{ color: "var(--text-muted)" }}>{language === "hi" ? "ईमेल" : "Email"}</span>
              <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>{profile.email}</span>
            </div>
          )}
          {profile.guardian_name && (
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8125rem" }}>
              <span className="font-devanagari" style={{ color: "var(--text-muted)" }}>{language === "hi" ? "अभिभावक" : "Guardian"}</span>
              <span className="font-devanagari" style={{ fontWeight: 600, color: "var(--text-primary)" }}>{profile.guardian_name}</span>
            </div>
          )}
          {profile.guardian_phone && (
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8125rem" }}>
              <span className="font-devanagari" style={{ color: "var(--text-muted)" }}>{language === "hi" ? "अभिभावक मोबाइल" : "Guardian Phone"}</span>
              <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>{profile.guardian_phone}</span>
            </div>
          )}
        </div>
      </motion.div>

      {/* Certificate Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="card"
        style={{
          padding: "20px",
          background: "var(--surface-raised)",
          border: "1px solid var(--surface-border)",
          borderRadius: "var(--r-xl)",
          marginBottom: "20px",
          textAlign: "center"
        }}
      >
        <ShieldCheck size={28} color="var(--gold)" style={{ margin: "0 auto 8px" }} />
        <h3 className="font-devanagari" style={{ fontSize: "0.9375rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "4px" }}>
          {language === "hi" ? "भागीदारी प्रमाण पत्र" : "Certificate of Completion"}
        </h3>
        <p className="font-devanagari" style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "12px" }}>
          {language === "hi" ? "अपनी भागीदारी का प्रमाण पत्र डाउनलोड करें" : "Download your participation certificate"}
        </p>
        <button
          onClick={() => {
            if (typeof window !== "undefined") {
              (window as any).downloadSanmatiCertificate?.();
            }
          }}
          className="btn btn-primary font-devanagari"
          style={{ width: "100%", padding: "10px", fontSize: "0.8125rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", background: "var(--surface-overlay)", border: "1px solid var(--surface-border)", color: "var(--brand)", cursor: "pointer" }}
        >
          <Download size={14} /> {language === "hi" ? "डाउनलोड करें" : "Download Now"}
        </button>
        {profile && <CertificateGenerator userName={profile.full_name || "Sadhak"} />}
      </motion.div>

      {/* Logout */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        onClick={logout}
        style={{
          width: "100%", padding: "14px",
          borderRadius: "var(--r-xl)", background: "rgba(239,68,68,0.08)",
          border: "1px solid rgba(239,68,68,0.15)", color: "#EF4444",
          fontWeight: 600, fontSize: "0.875rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
          cursor: "pointer", transition: "all var(--dur-fast)"
        }}
      >
        <LogOut size={16} /> {language === "hi" ? "लॉगआउट" : "Logout"}
      </motion.button>
    </div>
  );
}
