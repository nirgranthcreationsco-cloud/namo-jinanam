"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Share, MoreVertical, Plus, Laptop, Download } from "lucide-react";

type Platform = "ios" | "android" | "desktop";

function detectPlatform(): Platform {
  if (typeof window === "undefined") return "desktop";
  const ua = navigator.userAgent.toLowerCase();
  if (/iphone|ipad|ipod/.test(ua)) return "ios";
  if (/android/.test(ua)) return "android";
  return "desktop";
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
  const [platform, setPlatform] = useState<Platform>("desktop");
  const [step, setStep] = useState(0);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    // Detect platform
    const detected = detectPlatform();
    setPlatform(detected);

    // Listen for Chrome / Android native PWA install prompt event
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      console.log("[PWA] beforeinstallprompt event captured!");
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // Listen for manual trigger event from buttons
    const handleOpenTrigger = () => {
      setVisible(true);
    };

    window.addEventListener("open-install-prompt", handleOpenTrigger);

    // Auto-show prompt if not in standalone mode
    if (!isRunningStandalone()) {
      const timer = setTimeout(() => {
        setVisible(true);
      }, 1000);

      return () => {
        clearTimeout(timer);
        window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
        window.removeEventListener("open-install-prompt", handleOpenTrigger);
      };
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("open-install-prompt", handleOpenTrigger);
    };
  }, []);

  function handleDismiss() {
    setVisible(false);
    localStorage.setItem("namo_install_dismissed", "1");
  }

  async function handleNativeInstall() {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`[PWA] User choice outcome: ${outcome}`);
      setDeferredPrompt(null);
      setVisible(false);
    }
  }

  const iosSteps = [
    {
      icon: <Share size={26} strokeWidth={1.8} style={{ color: "#007AFF" }} />,
      label: "1. Share बटन दबाएँ",
      desc: "Safari ब्राउज़र में नीचे दिए गए Share icon पर टैप करें",
    },
    {
      icon: <Plus size={26} strokeWidth={1.8} style={{ color: "#34C759" }} />,
      label: '2. "Add to Home Screen" चुनें',
      desc: "मेनू सूची को स्क्रॉल करके 'Add to Home Screen' पर टैप करें",
    },
    {
      icon: <span style={{ fontSize: "1.5rem" }}>🏠</span>,
      label: '3. "Add" पर टैप करें',
      desc: "ऊपर दाईं ओर 'Add' दबाएँ, ऐप आपकी होम स्क्रीन पर जुड़ जाएगा!",
    },
  ];

  const androidSteps = [
    {
      icon: <MoreVertical size={26} strokeWidth={1.8} style={{ color: "#4285F4" }} />,
      label: "1. Chrome Menu दबाएँ",
      desc: "Chrome ब्राउज़र में ऊपर-दाईं ओर दिए गए 3-डॉट्स (⋮) मेनू पर टैप करें",
    },
    {
      icon: <Plus size={26} strokeWidth={1.8} style={{ color: "#34A853" }} />,
      label: '2. "Install App" चुनें',
      desc: "'Install App' या 'Add to Home Screen' विकल्प पर टैप करें",
    },
    {
      icon: <span style={{ fontSize: "1.5rem" }}>🏠</span>,
      label: '3. "Install" दबाएँ',
      desc: "पुष्टि करके 'Install' दबाएँ, ऐप होम स्क्रीन पर इंस्टॉल हो जाएगा!",
    },
  ];

  const desktopSteps = [
    {
      icon: <Download size={26} strokeWidth={1.8} style={{ color: "#4285F4" }} />,
      label: "1. Install आइकन दबाएँ",
      desc: "Chrome ब्राउज़र में एड्रेस बार (URL) के दाईं ओर Install (⊕) बटन दबाएँ",
    },
    {
      icon: <Laptop size={26} strokeWidth={1.8} style={{ color: "#A0622A" }} />,
      label: '2. "Install" चुनें',
      desc: "पॉपअप में 'Install' पर क्लिक करें",
    },
    {
      icon: <span style={{ fontSize: "1.5rem" }}>🖥️</span>,
      label: "3. डेस्कटॉप पर चालू करें",
      desc: "ऐप आपके कंप्यूटर / मैक के ऐप लॉन्चर में इंस्टॉल हो जाएगा!",
    },
  ];

  const steps = platform === "ios" ? iosSteps : platform === "android" ? androidSteps : desktopSteps;

  return (
    <AnimatePresence>
      {visible && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={handleDismiss}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(25, 15, 10, 0.65)",
              backdropFilter: "blur(6px)",
              zIndex: 9998,
            }}
          />

          {/* Dialog Container */}
          <motion.div
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 240 }}
            style={{
              position: "fixed",
              bottom: 0,
              left: "50%",
              transform: "translateX(-50%)",
              width: "100%",
              maxWidth: "480px",
              background: "#FFFFFF",
              borderRadius: "28px 28px 0 0",
              padding: "20px 20px 24px",
              zIndex: 9999,
              boxShadow: "0 -12px 60px rgba(0,0,0,0.3)",
              overflow: "hidden",
            }}
          >
            {/* Top Drag Indicator */}
            <div
              style={{
                width: "42px",
                height: "4px",
                background: "var(--surface-border-md)",
                borderRadius: "2px",
                margin: "0 auto 16px",
              }}
            />

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
                background: "rgba(37,23,16,0.06)",
                border: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
            >
              <X size={18} color="#574638" />
            </button>

            {/* Header */}
            <div style={{ textAlign: "center", marginBottom: "18px" }}>
              <div
                style={{
                  width: "64px",
                  height: "64px",
                  borderRadius: "50%",
                  margin: "0 auto 10px",
                  background: "#FFFFFF",
                  boxShadow: "0 6px 20px rgba(92,26,16,0.15)",
                  border: "2px solid var(--surface-border)",
                  overflow: "hidden",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <img src="/logo.png" alt="App Logo" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>

              <h2
                className="font-devanagari"
                style={{ fontSize: "1.125rem", fontWeight: 800, color: "var(--brand)", margin: "0 0 4px" }}
              >
                Home Screen पर ऐप इंस्टॉल करें
              </h2>
              <p
                className="font-devanagari"
                style={{ fontSize: "0.8125rem", color: "var(--text-muted)", margin: 0 }}
              >
                बिना डाउनलोड किए 1-क्लिक में होम स्क्रीन पर जोड़ें
              </p>
            </div>

            {/* Native 1-Click Install Button (if browser supports it) */}
            {deferredPrompt && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleNativeInstall}
                style={{
                  width: "100%",
                  padding: "14px",
                  background: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
                  color: "#FFFFFF",
                  border: "none",
                  borderRadius: "var(--r-xl)",
                  fontSize: "1rem",
                  fontWeight: 800,
                  cursor: "pointer",
                  marginBottom: "16px",
                  boxShadow: "0 4px 16px rgba(16,185,129,0.3)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                }}
                className="font-devanagari"
              >
                <Download size={20} /> 📲 डायरेक्ट इंस्टॉल करें (Install Now)
              </motion.button>
            )}

            {/* Step-by-Step Guide */}
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "18px" }}>
              {steps.map((s, idx) => (
                <div
                  key={idx}
                  onClick={() => setStep(idx)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    background: idx === step ? "rgba(92,26,16,0.06)" : "#FAF6F0",
                    border: idx === step ? "1.5px solid var(--brand)" : "1px solid var(--surface-border)",
                    borderRadius: "14px",
                    padding: "10px 14px",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                >
                  <div style={{ flexShrink: 0 }}>{s.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div
                      className="font-devanagari"
                      style={{ fontSize: "0.875rem", fontWeight: 700, color: "var(--brand)" }}
                    >
                      {s.label}
                    </div>
                    <div
                      className="font-devanagari"
                      style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}
                    >
                      {s.desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Actions */}
            <div style={{ display: "flex", gap: "10px" }}>
              <button
                onClick={handleDismiss}
                style={{
                  flex: 1,
                  padding: "12px",
                  background: "linear-gradient(135deg, #5C1A10 0%, #7C2D12 100%)",
                  color: "#FFFFFF",
                  border: "none",
                  borderRadius: "var(--r-pill)",
                  fontSize: "0.875rem",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
                className="font-devanagari"
              >
                🌸 ठीक है, समझ गया!
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/**
 * Helper function that any component can call to trigger the Install Prompt manually!
 */
export function triggerInstallPrompt() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("open-install-prompt"));
  }
}
