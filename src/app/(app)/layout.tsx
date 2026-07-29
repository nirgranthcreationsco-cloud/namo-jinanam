"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAuthStore } from "@/store/authStore";
import { Home, CheckSquare, Trophy, User, MoreHorizontal, Flame, Star, Hexagon } from "lucide-react";

const NAV_ITEMS = [
  { href: "/dashboard", icon: Home, label: "Home", labelHi: "होम" },
  { href: "/habits", icon: CheckSquare, label: "Habits", labelHi: "आदतें" },
  { href: "/leaderboard", icon: Trophy, label: "Rank", labelHi: "रैंकिंग" },
  { href: "/profile", icon: User, label: "Profile", labelHi: "प्रोफाइल" },
  { href: "/more", icon: MoreHorizontal, label: "More", labelHi: "अधिक" },
];

function BottomNav() {
  const pathname = usePathname();

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
                    fontWeight: isActive ? 600 : 500,
                    position: "relative",
                    zIndex: 1,
                    fontFamily: "var(--font-devanagari)"
                  }}
                >
                  {item.labelHi}
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

  const pageTitle: Record<string, string> = {
    "/dashboard": "डैशबोर्ड",
    "/habits": "आज की आदतें",
    "/leaderboard": "लीडरबोर्ड",
    "/profile": "प्रोफाइल",
    "/calendar": "कैलेंडर",
    "/badges": "बैज",
    "/sankalp": "जीवन संकल्प",
    "/analytics": "विश्लेषण",
    "/certificates": "प्रमाण पत्र",
  };

  const title = Object.entries(pageTitle).find(([path]) => pathname.startsWith(path))?.[1] ?? "णमो जिणाणं";

  return (
    <header className="topbar">
      <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: "64px", padding: "0 16px" }}>
        
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <img src="/logo.png" alt="णमो जिणाणं" style={{ width: "36px", height: "36px", borderRadius: "50%", objectFit: "cover", boxShadow: "var(--shadow-sm)", border: "2px solid var(--brand-dim)" }} />
          <div className="heading-sm font-devanagari" style={{ color: "var(--text-primary)" }}>
            {title}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div className="chip chip-gold">
            <Star size={14} fill="currentColor" />
            {(stats?.total_points ?? 0).toLocaleString("hi-IN")}
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
