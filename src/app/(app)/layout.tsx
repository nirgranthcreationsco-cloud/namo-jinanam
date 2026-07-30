"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAuthStore } from "@/store/authStore";
import { useLanguageStore } from "@/store/languageStore";
import { Home, CheckSquare, Trophy, User, Flame, Star, Share2, Crown } from "lucide-react";

const NAV_ITEMS = [
  { href: "/dashboard", icon: Home, label: "Home", labelHi: "होम" },
  { href: "/habits", icon: CheckSquare, label: "Habits", labelHi: "आदतें" },
  { href: "/bonus", icon: Crown, label: "Bonus", labelHi: "बोनस" },
  { href: "/leaderboard", icon: Trophy, label: "Rank", labelHi: "रैंकिंग" },
  { href: "/profile", icon: User, label: "Profile", labelHi: "प्रोफाइल" },
];

function BottomNav() {
  const pathname = usePathname();
  const { language } = useLanguageStore();

  return (
    <nav className="bottom-nav">
      <div className="container" style={{ padding: "0 8px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 0" }}>
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "4px",
                  padding: "8px 12px",
                  position: "relative",
                  color: isActive ? "var(--brand)" : "var(--text-muted)",
                  flex: 1,
                  textDecoration: "none"
                }}
              >
                {isActive && (
                  <motion.div
                    layoutId="nav-active"
                    style={{
                      position: "absolute",
                      inset: "0 8px",
                      background: "var(--brand-dim)",
                      borderRadius: "12px",
                      zIndex: 0,
                    }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <div style={{ position: "relative", zIndex: 1 }}>
                  <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                </div>
                <span
                  style={{
                    fontSize: "0.6875rem",
                    fontWeight: isActive ? 700 : 500,
                    position: "relative",
                    zIndex: 1,
                    fontFamily: language === "hi" ? "var(--font-devanagari)" : "var(--font-sans)"
                  }}
                >
                  {language === "hi" ? item.labelHi : item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

function TopBar() {
  const { profile, stats } = useAuthStore();
  const pathname = usePathname();
  const { language, setLanguage } = useLanguageStore();

  const pageTitleHi: Record<string, string> = {
    "/dashboard": "मुख्य पृष्ठ",
    "/habits": "आदतें",
    "/bonus": "बोनस",
    "/leaderboard": "रैंकिंग",
    "/profile": "प्रोफ़ाइल",
    "/calendar": "कैलेंडर",
    "/badges": "बैज",
    "/certificates": "प्रमाण पत्र",
  };

  const pageTitleEn: Record<string, string> = {
    "/dashboard": "Dashboard",
    "/habits": "Habits",
    "/bonus": "Bonus",
    "/leaderboard": "Leaderboard",
    "/profile": "Profile",
    "/calendar": "Calendar",
    "/badges": "Badges",
    "/certificates": "Certificates",
  };

  const pageTitle = language === "hi" ? pageTitleHi : pageTitleEn;
  const isHome = pathname === "/dashboard";
  const title = Object.entries(pageTitle).find(([path]) => pathname.startsWith(path))?.[1] ?? (language === "hi" ? "सन्मति" : "Sanmati");

  const handleShare = async () => {
    const shareData = {
      title: language === "hi" ? "सन्मति - सुनील - संस्कार अभियान" : "Sanmati Sunilam Sanskar Abhiyan",
      text: language === "hi"
        ? "सन्मति - सुनील - संस्कार अभियान - जैन चातुर्मास संस्कार अभियान। आइए, संयम और साधना के साथ जुड़ें!"
        : "Sanmati Sunilam Sanskar Abhiyan - Jain Chaturmas Sanskar Abhiyan. Let us connect with self-control and meditation!",
      url: window.location.origin
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
        alert(
          language === "hi"
            ? "अभियान लिंक क्लिपबोर्ड पर कॉपी हो गया है! अपने मित्रों के साथ साझा करें।"
            : "Campaign link copied to clipboard! Share it with your friends."
        );
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <header className="topbar">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: "60px", padding: "0 16px" }}>

        {/* Left: Logo + Title */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", flex: 1, minWidth: 0 }}>
          <div style={{ position: "relative", flexShrink: 0 }}>
            <img
              src="/logo.png" alt="Logo"
              style={{
                width: "38px", height: "38px", borderRadius: "12px",
                objectFit: "cover",
                border: "2px solid rgba(92,26,16,0.15)",
                boxShadow: "0 2px 8px rgba(92,26,16,0.15)"
              }}
            />
          </div>
          <div style={{ minWidth: 0 }}>
            {isHome ? (
              <>
                <div
                  className="font-devanagari"
                  style={{
                    fontSize: "0.65rem",
                    fontWeight: 700,
                    color: "var(--gold)",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    lineHeight: 1
                  }}
                >
                  {language === "hi" ? "जय जिनेन्द्र 🙏" : "Jai Jinendra 🙏"}
                </div>
                <div
                  className="font-devanagari"
                  style={{
                    fontSize: "0.8125rem",
                    fontWeight: 700,
                    color: "var(--brand)",
                    lineHeight: 1.3,
                    marginTop: "1px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap"
                  }}
                >
                  {language === "hi" ? "सन्मति · सुनील · संस्कार" : "Sanmati Sunil Sanskar"}
                </div>
              </>
            ) : (
              <div
                className="font-devanagari"
                style={{
                  fontSize: "1rem",
                  fontWeight: 700,
                  color: "var(--text-primary)",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap"
                }}
              >
                {title}
              </div>
            )}
          </div>
        </div>

        {/* Right: Actions */}
        <div style={{ display: "flex", alignItems: "center", gap: "6px", flexShrink: 0 }}>
          {/* Points */}
          <div
            style={{
              display: "flex", alignItems: "center", gap: "4px",
              padding: "5px 10px", borderRadius: "var(--r-pill)",
              background: "var(--gold-dim)",
              border: "1px solid rgba(160,98,42,0.2)"
            }}
          >
            <Star size={13} fill="var(--gold)" color="var(--gold)" />
            <span style={{ fontSize: "0.8125rem", fontWeight: 700, color: "#7A4A15", fontFamily: "var(--font-sans)" }}>
              {(stats?.total_points ?? 0)}
            </span>
          </div>

          {/* Streak */}
          <div
            style={{
              display: "flex", alignItems: "center", gap: "3px",
              padding: "5px 9px", borderRadius: "var(--r-pill)",
              background: "rgba(200,80,20,0.08)",
              border: "1px solid rgba(200,80,20,0.2)"
            }}
          >
            <Flame size={13} className="streak-flame" fill="#C85010" />
            <span style={{ fontSize: "0.8125rem", fontWeight: 700, color: "#9A3010", fontFamily: "var(--font-sans)" }}>
              {stats?.current_streak ?? 0}
            </span>
          </div>

          {/* Language Toggle */}
          <button
            onClick={() => setLanguage(language === "hi" ? "en" : "hi")}
            style={{
              width: "34px", height: "34px", borderRadius: "10px",
              background: "var(--surface-overlay)",
              border: "1px solid var(--surface-border)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "var(--brand)", fontWeight: 700, fontSize: "0.7rem",
              cursor: "pointer"
            }}
          >
            {language === "hi" ? "EN" : "अ"}
          </button>

          {/* Avatar */}
          <Link href="/profile" style={{ textDecoration: "none" }}>
            <div
              style={{
                width: "34px", height: "34px", borderRadius: "10px",
                background: "linear-gradient(135deg, var(--brand-light), var(--lotus))",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "white", fontWeight: 700, fontSize: "14px",
                boxShadow: "0 2px 8px var(--brand-glow)"
              }}
            >
              {profile?.full_name?.charAt(0) ?? "?"}
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user } = useAuthStore();

  useEffect(() => {
    if (!user) {
      router.replace("/login");
    }
  }, [user, router]);

  if (!user) return null;

  return (
    <div style={{ paddingBottom: "84px" }}>
      <TopBar />
      <main style={{ minHeight: "calc(100dvh - 144px)" }}>
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
