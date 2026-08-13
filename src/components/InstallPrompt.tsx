"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Share, Plus, MoreVertical } from "lucide-react";

type Platform = "ios" | "android" | "other";

function detectPlatform(): Platform {
  if (typeof window === "undefined") return "other";
  const ua = navigator.userAgent.toLowerCase();
  if (/iphone|ipad|ipod/.test(ua)) return "ios";
  if (/android/.test(ua)) return "android";
  return "other"; // defaults to ios style instructions for desktop testing
}

function isRunningStandalone(): boolean {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window.navigator as any).standalone === true
  );
}

export function InstallPrompt() {
  const [visible, setVisible] = useState(false);
  const [platform, setPlatform] = useState<Platform>("ios");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const detected = detectPlatform();
    setPlatform(detected === "android" ? "android" : "ios");

    // Native install prompt listener (Android/Chrome)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // Manual trigger listener
    const handleOpenTrigger = () => setVisible(true);
    window.addEventListener("open-install-prompt", handleOpenTrigger);

    // Auto-show logic
    if (!isRunningStandalone()) {
      // Check if user dismissed it in this session (so we don't annoy them on every page reload)
      const dismissed = sessionStorage.getItem("pwa_install_dismissed");
      if (!dismissed) {
        const timer = setTimeout(() => setVisible(true), 1500);
        return () => {
          clearTimeout(timer);
          window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
          window.removeEventListener("open-install-prompt", handleOpenTrigger);
        };
      }
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("open-install-prompt", handleOpenTrigger);
    };
  }, []);

  function handleDismiss() {
    setVisible(false);
    sessionStorage.setItem("pwa_install_dismissed", "1");
  }

  async function handleNativeInstall() {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setDeferredPrompt(null);
        setVisible(false);
      }
    }
  }

  const isAndroid = platform === "android";

  return (
    <AnimatePresence>
      {visible && (
        <>
          {/* Dark Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={handleDismiss}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0, 0, 0, 0.6)",
              backdropFilter: "blur(4px)",
              zIndex: 99998,
            }}
          />

          {/* Bottom Sheet Modal */}
          <motion.div
            initial={{ y: "100%", x: "-50%", opacity: 0 }}
            animate={{ y: 0, x: "-50%", opacity: 1 }}
            exit={{ y: "100%", x: "-50%", opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 220 }}
            style={{
              position: "fixed",
              bottom: 0,
              left: "50%",
              width: "100%",
              maxWidth: "480px",
              background: "#FFFFFF",
              borderRadius: "24px 24px 0 0",
              padding: "24px",
              zIndex: 99999,
              boxShadow: "0 -8px 40px rgba(0,0,0,0.2)",
            }}
          >
            {/* Close Button */}
            <button
              onClick={handleDismiss}
              style={{
                position: "absolute",
                top: "16px",
                right: "16px",
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                background: "#F3F4F6",
                border: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
            >
              <X size={18} color="#4B5563" />
            </button>

            {/* Header Content */}
            <div style={{ display: "flex", gap: "16px", alignItems: "center", marginBottom: "24px" }}>
              <div
                style={{
                  width: "60px",
                  height: "60px",
                  borderRadius: "14px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  overflow: "hidden",
                  flexShrink: 0,
                }}
              >
                <img src="/logo.png" alt="App Logo" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
              <div>
                <h2
                  className="font-devanagari"
                  style={{ fontSize: "1.125rem", fontWeight: 800, color: "#111827", margin: "0 0 4px" }}
                >
                  App इंस्टॉल करें
                </h2>
                <p
                  className="font-devanagari"
                  style={{ fontSize: "0.875rem", color: "#6B7280", margin: 0, lineHeight: 1.4 }}
                >
                  तेज़ और बेहतर अनुभव के लिए इसे अपनी Home Screen पर जोड़ें।
                </p>
              </div>
            </div>

            {/* If native install prompt is available (Android Chrome), show 1-click button */}
            {deferredPrompt ? (
              <button
                onClick={handleNativeInstall}
                style={{
                  width: "100%",
                  padding: "16px",
                  background: "#2563EB",
                  color: "#FFFFFF",
                  border: "none",
                  borderRadius: "12px",
                  fontSize: "1rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  marginBottom: "16px",
                }}
                className="font-devanagari"
              >
                📲 एक-क्लिक में इंस्टॉल करें (Install)
              </button>
            ) : (
              /* Otherwise show Manual Steps */
              <div
                style={{
                  background: "#F9FAFB",
                  border: "1px solid #E5E7EB",
                  borderRadius: "16px",
                  padding: "16px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                  marginBottom: "20px",
                }}
              >
                {isAndroid ? (
                  <>
                    <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
                      <MoreVertical size={24} color="#4B5563" style={{ flexShrink: 0, marginTop: "2px" }} />
                      <div>
                        <div className="font-devanagari" style={{ fontWeight: 700, color: "#374151", fontSize: "0.9375rem" }}>1. Chrome Menu खोलें</div>
                        <div className="font-devanagari" style={{ color: "#6B7280", fontSize: "0.8125rem", marginTop: "2px" }}>ऊपर दाईं ओर दिए 3-डॉट्स (⋮) पर टैप करें</div>
                      </div>
                    </div>
                    <div style={{ width: "1px", height: "12px", background: "#E5E7EB", marginLeft: "11px", marginTop: "-12px", marginBottom: "-12px" }} />
                    <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
                      <Plus size={24} color="#374151" style={{ flexShrink: 0, marginTop: "2px" }} />
                      <div>
                        <div className="font-devanagari" style={{ fontWeight: 700, color: "#374151", fontSize: "0.9375rem" }}>2. Add to Home Screen चुनें</div>
                        <div className="font-devanagari" style={{ color: "#6B7280", fontSize: "0.8125rem", marginTop: "2px" }}>"Install App" या "Add to Home Screen" दबाएँ</div>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
                      <Share size={24} color="#007AFF" style={{ flexShrink: 0, marginTop: "2px" }} />
                      <div>
                        <div className="font-devanagari" style={{ fontWeight: 700, color: "#374151", fontSize: "0.9375rem" }}>1. Share बटन दबाएँ</div>
                        <div className="font-devanagari" style={{ color: "#6B7280", fontSize: "0.8125rem", marginTop: "2px" }}>ब्राउज़र में नीचे दिए Share icon पर टैप करें</div>
                      </div>
                    </div>
                    <div style={{ width: "1px", height: "12px", background: "#E5E7EB", marginLeft: "11px", marginTop: "-12px", marginBottom: "-12px" }} />
                    <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
                      <Plus size={24} color="#374151" style={{ flexShrink: 0, marginTop: "2px" }} />
                      <div>
                        <div className="font-devanagari" style={{ fontWeight: 700, color: "#374151", fontSize: "0.9375rem" }}>2. Add to Home Screen चुनें</div>
                        <div className="font-devanagari" style={{ color: "#6B7280", fontSize: "0.8125rem", marginTop: "2px" }}>सूची में "Add to Home Screen" पर टैप करें</div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            <button
              onClick={handleDismiss}
              style={{
                width: "100%",
                padding: "14px",
                background: "transparent",
                color: "#6B7280",
                border: "none",
                fontSize: "0.9375rem",
                fontWeight: 600,
                cursor: "pointer",
              }}
              className="font-devanagari"
            >
              बाद में (Later)
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export function triggerInstallPrompt() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("open-install-prompt"));
  }
}
