"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAuthStore } from "@/store/authStore";
import { useLanguageStore } from "@/store/languageStore";
import { Home, CheckSquare, Trophy, User, Flame, Star, Hexagon, Share2, BookOpen, Crown } from "lucide-react";

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
    "/dashboard": "डैशबोर्ड",
    "/habits": "आज की आदतें",
    "/bonus": "आजीवन नियम एवं बोनस",
    "/leaderboard": "लीडरबोर्ड",
    "/profile": "प्रोफाइल",
    "/calendar": "कैलेंडर",
    "/badges": "बैज",
    "/certificates": "प्रमाण पत्र",
  };

  const pageTitleEn: Record<string, string> = {
    "/dashboard": "Dashboard",
    "/habits": "Daily Habits",
    "/bonus": "Lifetime & Bonus",
    "/leaderboard": "Leaderboard",
    "/profile": "Profile",
    "/calendar": "Calendar",
    "/badges": "Badges",
    "/certificates": "Certificates",
  };

  const pageTitle = language === "hi" ? pageTitleHi : pageTitleEn;
  const fallbackTitle = language === "hi" ? "सन्मति - सुनील - संस्कार अभियान" : "Sanmati Sunilam Sanskar";
  const title = Object.entries(pageTitle).find(([path]) => pathname.startsWith(path))?.[1] ?? fallbackTitle;

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
      <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: "64px", padding: "0 16px" }}>
        
        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexShrink: 1, minWidth: 0 }}>
          <img src="/logo.png" alt="Logo" style={{ width: "36px", height: "36px", borderRadius: "50%", objectFit: "cover", boxShadow: "var(--shadow-sm)", border: "2px solid var(--brand-dim)" }} />
          <div className="heading-sm font-devanagari text-truncate" style={{ color: "var(--text-primary)", fontSize: "0.875rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {title}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
          <button 
            onClick={() => setLanguage(language === "hi" ? "en" : "hi")}
            style={{
              padding: "0 10px", height: "36px", borderRadius: "18px",
              background: "var(--surface-base)", border: "1px solid var(--surface-border)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "var(--brand)", fontWeight: 700, fontSize: "0.75rem", cursor: "pointer", gap: "4px"
            }}
            title={language === "hi" ? "Switch to English" : "हिंदी में बदलें"}
          >
            <span>🌐</span>
            <span>{language === "hi" ? "EN" : "हिं"}</span>
          </button>

          <button 
            onClick={handleShare}
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              background: "var(--surface-base)",
              border: "1px solid var(--surface-border)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              transition: "transform 0.2s"
            }}
            className="share-btn"
            title={language === "hi" ? "साझा करें" : "Share"}
          >
            <Share2 size={18} />
          </button>

          <div className="chip chip-gold">
            <Star size={14} fill="currentColor" />
            {(stats?.total_points ?? 0).toLocaleString(language === "hi" ? "hi-IN" : "en-US")}
          </div>

          <div className="chip chip-brand">
            <Flame size={14} className="streak-flame" fill="currentColor" />
            {stats?.current_streak ?? 0}
          </div>

          <Link href="/profile" style={{ marginLeft: "4px" }}>
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, var(--indigo), var(--lotus))",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontWeight: 700,
                fontSize: "14px"
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
    <div style={{ paddingBottom: "80px" }}>
      <TopBar />
      <main>
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
