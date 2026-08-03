"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "@/store/authStore";
import { useLanguageStore } from "@/store/languageStore";
import { CertificateGenerator } from "@/components/CertificateGenerator";
import { BADGES } from "@/data/content";
import { 
  BarChart2, History, LogOut, 
  Award, Flame, Calendar, Star,
  Download, ShieldCheck, User as UserIcon,
  MapPin, Phone
} from "lucide-react";

export default function ProfilePage() {
  const { profile, stats, logout } = useAuthStore();
  const { language } = useLanguageStore();
  const [activeTab, setActiveTab] = useState<"stats" | "badges" | "history">("stats");

  if (!profile || !stats) return null;



  const TABS = [
    { id: "stats", labelHi: "आँकड़े", labelEn: "Stats", icon: BarChart2 },
    { id: "history", labelHi: "इतिहास", labelEn: "History", icon: History },
  ] as const;

  const StatItem = ({ label, value, icon: Icon }: { label: string; value: string | number; icon: any }) => (
    <div
      style={{
        display: "flex", alignItems: "center", gap: "12px",
        padding: "16px", borderRadius: "var(--r-xl)",
        background: "var(--surface-raised)",
        border: "1px solid var(--surface-border)"
      }}
    >
      <div style={{ color: "var(--brand)" }}><Icon size={20} /></div>
      <div style={{ flex: 1 }}>
        <div className="font-devanagari" style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "2px" }}>{label}</div>
        <div className="font-devanagari" style={{ fontWeight: 600, color: "var(--text-primary)" }}>{value}</div>
      </div>
    </div>
  );

  return (
    <div style={{ paddingBottom: "100px" }}>
      {/* ── Profile Header ── */}
      <div
        style={{
          background: "var(--surface-overlay)",
          borderBottom: "1px solid var(--surface-border)",
          padding: "32px 16px 24px",
          position: "relative",
          overflow: "hidden"
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", gap: "20px" }}>
          {/* Avatar */}
          <div style={{ position: "relative" }}>
            <div
              style={{
                width: "80px", height: "80px", borderRadius: "24px",
                background: "linear-gradient(135deg, var(--indigo), var(--lotus))",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "2rem", fontWeight: 800, color: "white",
                boxShadow: "var(--shadow-lg)"
              }}
            >
              {profile.full_name.charAt(0)}
            </div>
 
          </div>

          {/* Info */}
          <div style={{ flex: 1 }}>
            <h1 className="heading-xl font-devanagari" style={{ color: "var(--text-primary)" }}>{profile.full_name}</h1>
            <div className="font-devanagari" style={{ fontSize: "0.875rem", color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: "4px", marginTop: "4px" }}>
              <MapPin size={14} /> {profile.city}, {profile.state}
            </div>
 
          </div>
        </div>



        {/* Quick Stats row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "12px", marginTop: "24px" }}>
          {[
            { value: stats.current_streak, labelHi: "स्ट्रीक", labelEn: "Streak", icon: Flame, color: "var(--brand)" },
            { value: stats.total_days_participated, labelHi: "दिन", labelEn: "Days", icon: Calendar, color: "var(--emerald)" },
          ].map((s, i) => (
            <div key={i} style={{ textAlign: "center", padding: "12px", background: "var(--surface-overlay)", borderRadius: "var(--r-lg)", border: "1px solid var(--surface-border)" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", color: s.color, marginBottom: "4px" }}>
                <s.icon size={16} />
              </div>
              <div className="stat-num" style={{ fontSize: "1.25rem", color: "var(--text-primary)" }}>{s.value}</div>
              <div className="font-devanagari" style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                {language === "hi" ? s.labelHi : s.labelEn}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Tabs ── */}
      <div style={{ padding: "16px" }}>
        <div style={{ display: "flex", gap: "4px", padding: "4px", background: "var(--surface-overlay)", borderRadius: "16px" }}>
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="font-devanagari"
                style={{
                  flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
                  padding: "10px", borderRadius: "12px", fontSize: "0.8125rem", fontWeight: 600,
                  background: isActive ? "var(--surface-raised)" : "transparent",
                  color: isActive ? "var(--text-primary)" : "var(--text-muted)",
                  border: "1px solid", borderColor: isActive ? "var(--surface-border)" : "transparent",
                  cursor: "pointer", transition: "all var(--dur-fast)"
                }}
              >
                <Icon size={16} /> {language === "hi" ? tab.labelHi : tab.labelEn}
              </button>
            )
          })}
        </div>
      </div>

      {/* ── Tab Content ── */}
      <div style={{ padding: "0 16px" }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* Stats Tab */}
            {activeTab === "stats" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <StatItem label={language === "hi" ? "कुल अंक" : "Total XP"} value={`${stats.total_points.toLocaleString(language === "hi" ? "hi-IN" : "en-US")} XP`} icon={Star} />
                <StatItem label={language === "hi" ? "वर्तमान स्ट्रीक" : "Current Streak"} value={`${stats.current_streak} ${language === "hi" ? "दिन" : "Days"}`} icon={Flame} />
                <StatItem label={language === "hi" ? "सबसे लंबी स्ट्रीक" : "Longest Streak"} value={`${stats.longest_streak} ${language === "hi" ? "दिन" : "Days"}`} icon={Award} />
                <StatItem label={language === "hi" ? "कुल दिन भाग लिया" : "Total Days Active"} value={`${stats.total_days_participated} ${language === "hi" ? "दिन" : "Days"}`} icon={Calendar} />
                <StatItem label={language === "hi" ? "पिता का नाम" : "Father's Name"} value={profile.father_name} icon={UserIcon} />
                <StatItem label={language === "hi" ? "माता का नाम" : "Mother's Name"} value={profile.mother_name} icon={UserIcon} />
                <StatItem label={language === "hi" ? "मोबाइल" : "Phone"} value={profile.phone} icon={Phone} />

                {/* Certificates */}
                <div style={{ marginTop: "24px" }}>
                  <h3 className="heading-sm font-devanagari" style={{ marginBottom: "12px", color: "var(--text-secondary)" }}>
                    {language === "hi" ? "प्रमाण पत्र" : "Certificates"}
                  </h3>
                  <button
                    onClick={() => {
                      if (typeof window !== "undefined") {
                        (window as any).downloadSanmatiCertificate?.();
                      }
                    }}
                    className="card card-interactive"
                    style={{ width: "100%", padding: "16px", textAlign: "center", background: "var(--surface-overlay)", display: "flex", flexDirection: "column", alignItems: "center" }}
                  >
                    <ShieldCheck size={32} color="var(--gold)" style={{ marginBottom: "8px" }} />
                    <div className="font-devanagari" style={{ fontSize: "1rem", fontWeight: 700, color: "var(--text-primary)" }}>
                      {language === "hi" ? "भागीदारी प्रमाण पत्र" : "Certificate of Completion"}
                    </div>
                    <div className="font-devanagari" style={{ fontSize: "0.8125rem", color: "var(--brand)", marginTop: "6px", display: "flex", alignItems: "center", gap: "6px" }}>
                      <Download size={14} /> {language === "hi" ? "डाउनलोड करें" : "Download Now"}
                    </div>
                  </button>
                  {profile && <CertificateGenerator userName={profile.full_name || "Sadhak"} />}
                </div>

                {/* About & Contact Developer */}
                <div style={{
                  marginTop: "24px", padding: "16px", borderRadius: "var(--r-xl)",
                  background: "var(--surface-overlay)", border: "1px solid var(--surface-border)",
                  display: "flex", flexDirection: "column", gap: "8px"
                }}>
                  <div className="font-devanagari" style={{ fontSize: "0.875rem", fontWeight: 700, color: "var(--text-primary)" }}>
                    {language === "hi" ? "डेवलपर के बारे में" : "About Developer"}
                  </div>
                  <div className="font-devanagari" style={{ fontSize: "0.75rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                    {language === "hi" ? (
                      <>
                        यह ऐप <strong>Nirgranth Creations</strong> द्वारा विकसित किया गया है।<br/>
                        किसी भी तकनीकी सहायता या प्रतिक्रिया के लिए हमसे संपर्क करें।
                      </>
                    ) : (
                      <>
                        This app is developed by <strong>Nirgranth Creations</strong>.<br/>
                        For any technical support or feedback, feel free to contact us.
                      </>
                    )}
                  </div>
                  <a
                    href="tel:8109224176"
                    style={{
                      display: "flex", alignItems: "center", gap: "8px",
                      textDecoration: "none", color: "var(--brand)",
                      fontSize: "0.8125rem", fontWeight: 600, marginTop: "4px"
                    }}
                  >
                    <Phone size={14} /> +91 8109224176
                  </a>
                </div>

                {/* Logout */}
                <button
                  onClick={logout}
                  style={{
                    width: "100%", padding: "16px", marginTop: "24px",
                    borderRadius: "var(--r-xl)", background: "rgba(239,68,68,0.1)",
                    border: "1px solid rgba(239,68,68,0.2)", color: "#EF4444",
                    fontWeight: 600, fontSize: "0.9375rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                    cursor: "pointer", transition: "all var(--dur-fast)"
                  }}
                >
                  <LogOut size={18} /> {language === "hi" ? "लॉगआउट" : "Logout"}
                </button>
              </div>
            )}



            {/* History Tab */}
            {activeTab === "history" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <h3 className="heading-sm font-devanagari" style={{ marginBottom: "4px", color: "var(--text-secondary)" }}>
                  {language === "hi" ? "गतिविधि इतिहास" : "Activity History"}
                </h3>
                {Array.from({ length: 10 }, (_, i) => {
                  const d = new Date();
                  d.setDate(d.getDate() - i);
                  const pts = Math.floor(Math.random() * 2000) + 500;
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04 }}
                      className="card"
                      style={{ padding: "16px", display: "flex", alignItems: "center", gap: "16px", background: "var(--surface-raised)" }}
                    >
                      <div
                        style={{
                          width: "12px", height: "12px", borderRadius: "50%", flexShrink: 0,
                          background: pts > 1500 ? "var(--emerald)" : pts > 800 ? "var(--gold)" : "var(--brand)"
                        }}
                      />
                      <div style={{ flex: 1 }}>
                        <div className="font-devanagari" style={{ fontWeight: 600, fontSize: "0.875rem", color: "var(--text-primary)" }}>
                          {d.toLocaleDateString(language === "hi" ? "hi-IN" : "en-US", { day: "numeric", month: "short" })}
                        </div>
                        <div className="font-devanagari" style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "2px" }}>
                          {Math.floor(Math.random() * 30) + 10} {language === "hi" ? "आदतें पूरी" : "habits completed"}
                        </div>
                      </div>
                      <div style={{ fontWeight: 700, fontSize: "0.875rem", color: "var(--gold)", display: "flex", alignItems: "center", gap: "4px" }}>
                        <Star size={12} fill="currentColor" /> {pts}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
