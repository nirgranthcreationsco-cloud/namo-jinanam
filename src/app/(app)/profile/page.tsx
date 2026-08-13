"use client";

import { motion } from "framer-motion";
import { useAuthStore } from "@/store/authStore";
import { useLanguageStore } from "@/store/languageStore";
import { CertificateGenerator } from "@/components/CertificateGenerator";
import { 
  LogOut, Flame, Calendar, Star, 
  Download, ShieldCheck, Lock 
} from "lucide-react";
import { 
  isCertificateDownloadUnlocked, 
  CERTIFICATE_UNLOCK_DISPLAY_HI, 
  CERTIFICATE_UNLOCK_DISPLAY_EN 
} from "@/config/campaign";

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
          textAlign: "center",
          position: "relative",
          overflow: "hidden"
        }}
      >
        {isCertificateDownloadUnlocked() ? (
          <>
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
          </>
        ) : (
          <>
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "50%",
                background: "rgba(160, 98, 42, 0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 10px"
              }}
            >
              <Lock size={22} color="var(--gold)" />
            </div>
            <h3 className="font-devanagari" style={{ fontSize: "0.9375rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "4px" }}>
              {language === "hi" ? "भागीदारी प्रमाण पत्र (लॉक्ड)" : "Certificate of Completion (Locked)"}
            </h3>
            <p className="font-devanagari" style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "12px", lineHeight: 1.4 }}>
              {language === "hi"
                ? `प्रमाण पत्र अभियान के अंतिम सप्ताह (${CERTIFICATE_UNLOCK_DISPLAY_HI}) से डाउनलोड के लिए उपलब्ध होगा।`
                : `Certificate will unlock for download in the final week of campaign (${CERTIFICATE_UNLOCK_DISPLAY_EN}).`}
            </p>
            <div
              className="font-devanagari"
              style={{
                width: "100%",
                padding: "10px",
                fontSize: "0.8125rem",
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px",
                background: "rgba(0,0,0,0.04)",
                border: "1px dashed var(--surface-border)",
                borderRadius: "10px",
                color: "var(--text-muted)"
              }}
            >
              <Lock size={14} />
              {language === "hi"
                ? `अनलॉक: ${CERTIFICATE_UNLOCK_DISPLAY_HI} (अंतिम सप्ताह)`
                : `Unlocks: ${CERTIFICATE_UNLOCK_DISPLAY_EN} (Final Week)`}
            </div>
          </>
        )}
      </motion.div>

      {/* Help & Support Developer Contact Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.18 }}
        className="card"
        style={{
          padding: "20px",
          background: "linear-gradient(135deg, rgba(92, 26, 16, 0.03) 0%, var(--surface-raised) 100%)",
          border: "1px solid var(--surface-border)",
          borderRadius: "var(--r-xl)",
          marginBottom: "20px"
        }}
      >
        <h3 className="font-devanagari" style={{ fontSize: "0.875rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "8px", display: "flex", alignItems: "center", gap: "6px" }}>
          📞 {language === "hi" ? "मदद एवं सहायता" : "Help & Support"}
        </h3>
        <p className="font-devanagari" style={{ fontSize: "0.75rem", color: "var(--text-secondary)", lineHeight: 1.5, margin: 0 }}>
          {language === "hi"
            ? "किसी भी शंका या सहायता के लिए डेवलपर “निर्ग्रंथ क्रिएशन्स” से संपर्क करें:"
            : "For any doubts or help, please contact the developer “Nirgranth Creations”:"}
        </p>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "12px", background: "var(--surface-overlay)", padding: "10px 14px", borderRadius: "12px", border: "1px solid var(--surface-border)" }}>
          <span className="font-devanagari" style={{ fontSize: "0.8125rem", fontWeight: 700, color: "var(--text-primary)" }}>
            Nirgranth Creations
          </span>
          <a 
            href="tel:8109224176" 
            style={{ 
              fontSize: "0.8125rem", 
              fontWeight: 800, 
              color: "var(--brand)", 
              textDecoration: "none" 
            }}
          >
            +91 8109224176
          </a>
        </div>
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
