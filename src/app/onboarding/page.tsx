"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "@/store/authStore";
import { useLanguageStore } from "@/store/languageStore";
import { ArrowRight, CheckCircle2 } from "lucide-react";

const IMAGES = [
  "/dailyniyam.png",
  "/dailychallenge.png",
  "/lifetime sankalp.png",
  "/certificate.png",
];

export default function OnboardingPage() {
  const [current, setCurrent] = useState(0);
  const router = useRouter();
  const { setHasSeenOnboarding } = useAuthStore();
  const { language } = useLanguageStore();

  const isLast = current === IMAGES.length - 1;

  const handleNext = () => {
    if (!isLast) {
      setCurrent((prev) => prev + 1);
    } else {
      setHasSeenOnboarding(true);
      router.push("/");
    }
  };

  const handleSkip = () => {
    setHasSeenOnboarding(true);
    router.push("/");
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "#000",
        overflow: "hidden",
      }}
    >
      {/* Full-screen image */}
      <AnimatePresence mode="wait">
        <motion.img
          key={current}
          src={IMAGES[current]}
          alt={`Slide ${current + 1}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "contain",
            objectPosition: "center",
          }}
        />
      </AnimatePresence>

      {/* Skip button — top right */}
      <button
        onClick={handleSkip}
        style={{
          position: "absolute",
          top: "20px",
          right: "20px",
          background: "rgba(0,0,0,0.45)",
          backdropFilter: "blur(8px)",
          border: "1px solid rgba(255,255,255,0.2)",
          color: "#fff",
          fontWeight: 600,
          fontSize: "0.8125rem",
          padding: "6px 14px",
          borderRadius: "999px",
          cursor: "pointer",
          zIndex: 20,
        }}
      >
        {language === "hi" ? "स्किप" : "Skip"}
      </button>

      {/* Bottom overlay: dots + Next button */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          padding: "32px 24px 48px",
          background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "20px",
          zIndex: 20,
        }}
      >
        {/* Progress dots */}
        <div style={{ display: "flex", gap: "6px" }}>
          {IMAGES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrent(idx)}
              style={{
                width: current === idx ? "24px" : "7px",
                height: "7px",
                borderRadius: "4px",
                background: current === idx ? "#fff" : "rgba(255,255,255,0.4)",
                border: "none",
                padding: 0,
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
            />
          ))}
        </div>

        {/* Next / Get Started button */}
        <button
          onClick={handleNext}
          style={{
            width: "100%",
            maxWidth: "360px",
            padding: "16px",
            borderRadius: "999px",
            background: isLast
              ? "linear-gradient(135deg, #B45309, #D97706)"
              : "rgba(255,255,255,0.95)",
            color: isLast ? "#fff" : "#1a1a1a",
            fontWeight: 700,
            fontSize: "1rem",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
          }}
        >
          <span className="font-devanagari">
            {isLast
              ? language === "hi" ? "अभियान से जुड़ें" : "Get Started"
              : language === "hi" ? "आगे बढ़ें" : "Next"}
          </span>
          {isLast ? <CheckCircle2 size={18} /> : <ArrowRight size={18} />}
        </button>
      </div>
    </div>
  );
}
