"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "@/store/authStore";

export default function SplashScreen() {
  const router = useRouter();
  const { user, hasSeenOnboarding, _hasHydrated } = useAuthStore();
  const [phase, setPhase] = useState<"splash" | "fading">("splash");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !_hasHydrated) return;

    let isCancelled = false;

    async function initApp() {
      // 1. Minimum branding duration promise (800ms)
      const minDisplayPromise = new Promise((resolve) => setTimeout(resolve, 800));

      // 2. Async session validation task
      let isValidSession = false;
      const validateSessionTask = (async () => {
        if (user?.id) {
          try {
            const resp = await fetch("/api/session");
            const data = await resp.json();
            isValidSession = !!data.valid;
          } catch {
            isValidSession = false;
          }
        }
      })();

      // 3. Concurrently await minimum branding duration and all async tasks
      await Promise.all([minDisplayPromise, validateSessionTask]);

      if (isCancelled) return;

      // 4. Trigger smooth fade-out animation
      setPhase("fading");
      await new Promise((res) => setTimeout(res, 300));

      if (isCancelled) return;

      // 5. Event-driven route dispatching
      if (!hasSeenOnboarding) {
        router.replace("/onboarding");
      } else if (user?.id && isValidSession) {
        router.replace("/dashboard");
      } else {
        router.replace("/login");
      }
    }

    initApp();

    return () => {
      isCancelled = true;
    };
  }, [mounted, _hasHydrated, hasSeenOnboarding, user, router]);

  if (!mounted) return null;

  return (
    <AnimatePresence>
      {phase === "splash" && (
        <motion.div
          key="splash"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          style={{
            position: "fixed",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: "linear-gradient(160deg, #4B1D15 0%, #7C2D12 40%, #B45309 100%)",
            zIndex: 9999,
            gap: "24px",
          }}
        >
          {/* Logo */}
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", damping: 14, delay: 0.1 }}
            style={{
              width: "110px",
              height: "110px",
              borderRadius: "50%",
              overflow: "hidden",
              boxShadow: "0 0 0 4px rgba(255,255,255,0.2), 0 20px 60px rgba(0,0,0,0.4)",
              border: "3px solid rgba(255,255,255,0.35)",
            }}
          >
            <img
              src="/logo.png"
              alt="Namo Jinanam"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </motion.div>

          {/* App Name */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.5 }}
            style={{ textAlign: "center" }}
          >
            <div
              className="font-devanagari"
              style={{
                fontSize: "1.375rem",
                fontWeight: 800,
                color: "#fff",
                letterSpacing: "-0.01em",
                lineHeight: 1.3,
                textShadow: "0 2px 12px rgba(0,0,0,0.3)",
              }}
            >
              सन्मति - सुनील
            </div>
            <div
              className="font-devanagari"
              style={{
                fontSize: "1.125rem",
                fontWeight: 700,
                color: "rgba(255,245,220,0.9)",
                marginTop: "2px",
              }}
            >
              संस्कार अभियान
            </div>
            <div
              className="font-devanagari"
              style={{
                fontSize: "0.78rem",
                fontWeight: 500,
                color: "rgba(255,235,180,0.7)",
                marginTop: "6px",
                letterSpacing: "0.04em",
              }}
            >
              संस्कार • संयम • साधना • सफलता
            </div>
          </motion.div>

          {/* Loading dots */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            style={{ display: "flex", gap: "8px", marginTop: "12px" }}
          >
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.4, 1, 0.4],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 1,
                  delay: i * 0.2,
                  ease: "easeInOut",
                }}
                style={{
                  width: "7px",
                  height: "7px",
                  borderRadius: "50%",
                  background: "rgba(255,220,130,0.85)",
                }}
              />
            ))}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
