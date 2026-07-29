"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useAuthStore } from "@/store/authStore";
import { 
  UserCircle, Bell, Shield, Settings, 
  HelpCircle, LogOut, FileText, Share2, 
  Info, ChevronRight, Award, Flame
} from "lucide-react";

export default function MorePage() {
  const { logout, profile } = useAuthStore();

  const SECTIONS = [
    {
      title: "खाता (Account)",
      items: [
        { icon: UserCircle, label: "प्रोफाइल संपादित करें", href: "/profile" },
        { icon: Bell, label: "सूचनाएं (Notifications)", href: "#" },
        { icon: Shield, label: "गोपनीयता (Privacy)", href: "#" },
      ],
    },
    {
      title: "सामान्य (General)",
      items: [
        { icon: Settings, label: "सेटिंग्स", href: "#" },
        { icon: Share2, label: "ऐप साझा करें", href: "#" },
        { icon: FileText, label: "नियम और शर्तें", href: "#" },
        { icon: Info, label: "हमारे बारे में", href: "#" },
      ],
    },
    {
      title: "सहायता (Support)",
      items: [
        { icon: HelpCircle, label: "सामान्य प्रश्न (FAQ)", href: "#" },
      ],
    },
  ];

  return (
    <div className="page" style={{ padding: "16px 16px 100px" }}>
      
      {/* ── User Card ── */}
      <Link href="/profile" style={{ textDecoration: "none" }}>
        <div
          className="card card-interactive"
          style={{
            padding: "20px", marginBottom: "24px", display: "flex", alignItems: "center", gap: "16px",
            background: "var(--surface-overlay)",
            borderColor: "var(--brand-glow)"
          }}
        >
          <div
            style={{
              width: "56px", height: "56px", borderRadius: "16px",
              background: "linear-gradient(135deg, var(--indigo), var(--lotus))",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "1.5rem", fontWeight: 800, color: "white"
            }}
          >
            {profile?.full_name?.charAt(0) ?? "U"}
          </div>
          <div style={{ flex: 1 }}>
            <h2 className="heading-md font-devanagari" style={{ color: "var(--text-primary)", marginBottom: "4px" }}>
              {profile?.full_name}
            </h2>
            <div className="font-devanagari" style={{ fontSize: "0.8125rem", color: "var(--text-secondary)" }}>
              {profile?.city}, {profile?.state}
            </div>
          </div>
          <ChevronRight size={20} color="var(--brand)" />
        </div>
      </Link>

      {/* ── Settings Sections ── */}
      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        {SECTIONS.map((section, sIdx) => (
          <div key={sIdx}>
            <div className="font-devanagari" style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--text-muted)", marginBottom: "12px", paddingLeft: "4px" }}>
              {section.title}
            </div>
            <div className="card" style={{ background: "var(--surface-raised)", overflow: "hidden" }}>
              {section.items.map((item, i) => (
                <Link key={i} href={item.href} style={{ textDecoration: "none" }}>
                  <motion.div
                    whileHover={{ background: "var(--surface-overlay)" }}
                    style={{
                      display: "flex", alignItems: "center", padding: "16px",
                      borderBottom: i < section.items.length - 1 ? "1px solid var(--surface-border)" : "none",
                      gap: "16px"
                    }}
                  >
                    <div style={{ color: "var(--text-muted)" }}>
                      <item.icon size={20} />
                    </div>
                    <div className="font-devanagari" style={{ flex: 1, fontSize: "0.9375rem", fontWeight: 500, color: "var(--text-primary)" }}>
                      {item.label}
                    </div>
                    <ChevronRight size={18} color="var(--surface-border-md)" />
                  </motion.div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* ── Logout ── */}
      <div style={{ marginTop: "32px", textAlign: "center" }}>
        <button
          onClick={logout}
          className="btn"
          style={{
            width: "100%", padding: "16px",
            background: "rgba(239,68,68,0.1)",
            border: "1px solid rgba(239,68,68,0.2)", color: "#EF4444",
            fontWeight: 600, fontSize: "0.9375rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px"
          }}
        >
          <LogOut size={18} /> <span className="font-devanagari">लॉगआउट करें (Log Out)</span>
        </button>
        <div className="font-devanagari" style={{ marginTop: "16px", fontSize: "0.75rem", color: "var(--text-muted)" }}>
          संस्करण 1.0.0 (Beta)<br />
          © 2025 णमो जिणाणं
        </div>
      </div>
    </div>
  );
}
