"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "@/store/authStore";
import { useLanguageStore } from "@/store/languageStore";
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles, BookOpen, Trophy, Award, CheckCircle2, TreePine } from "lucide-react";

const SLIDES = [
  {
    id: 1,
    image: "/onboarding_niyams.png",
    titleHi: "१. दैनिक नियम कैसे ट्रैक करें?",
    titleEn: "1. How to Track Daily Niyams?",
    descHi: "लॉगिन करें, होम स्क्रीन पर जाएँ और अपने नियमों (जैसे स्वाध्याय, सात्विक भोजन) के आगे टिक करें। अंत में 'Submit' दबाकर अपने पुण्य अंक जोड़ें।",
    descEn: "Log in, open the Habits screen, check off your completed vows (like pure diet or self-study), and tap Submit to claim your daily Punya points.",
    badgeHi: "स्टेप १: नियम ट्रैकिंग",
    badgeEn: "Step 1: Habit Check",
    icon: BookOpen,
    color: "#D97706",
  },
  {
    id: 2,
    image: "/onboarding_leaderboard.png",
    titleHi: "२. अपना संयम वन बढ़ाएं",
    titleEn: "2. Grow Your Forest",
    descHi: "लगातार नियम पूरे करके अपनी स्ट्रीक (Streak) बढ़ाएँ। संयम वन में अपने पेड़ को बढ़ते हुए देखें और समाज के साथ प्रगति करें।",
    descEn: "Maintain daily streaks by completing rules. Visit the Forest of Discipline to watch your personal tree grow alongside the community.",
    badgeHi: "स्टेप २: संयम वन",
    badgeEn: "Step 2: Forest of Discipline",
    icon: TreePine,
    color: "#059669",
  },
  {
    id: 3,
    image: "/onboarding_certificate.png",
    titleHi: "३. डिजिटल सर्टिफिकेट डाउनलोड करें",
    titleEn: "3. Download Your Certificate",
    descHi: "अभियान समाप्त होने पर प्रोफाइल स्क्रीन पर जाएँ और 'Download Certificate' बटन दबाकर अपने नाम के साथ अपना डिजिटल सर्टिफिकेट प्राप्त करें।",
    descEn: "After completing your vows, go to the Profile screen and tap 'Download Certificate' to generate your customized digital certificate of completion.",
    badgeHi: "स्टेप ३: सर्टिफिकेट प्राप्त करें",
    badgeEn: "Step 3: Certification",
    icon: Award,
    color: "#2563EB",
  },
];

export default function OnboardingPage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const router = useRouter();
  const { setHasSeenOnboarding } = useAuthStore();
  const { language } = useLanguageStore();

  const handleNext = () => {
    if (currentSlide < SLIDES.length - 1) {
      setCurrentSlide((prev) => prev + 1);
    } else {
      finishOnboarding();
    }
  };

  const handlePrev = () => {
    if (currentSlide > 0) {
      setCurrentSlide((prev) => prev - 1);
    }
  };

  const finishOnboarding = () => {
    setHasSeenOnboarding(true);
    router.push("/");
  };

  const slide = SLIDES[currentSlide];
  const IconComponent = slide.icon;

  return (
    <div
      style={{
        height: "100dvh",
        maxHeight: "100dvh",
        background: "var(--surface-bg)",
        color: "var(--text-primary)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "16px 20px 16px",
        maxWidth: "480px",
        margin: "0 auto",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Top Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", zIndex: 10, height: "40px" }}>
        {currentSlide > 0 ? (
          <button
            onClick={handlePrev}
            style={{
              background: "var(--surface-overlay)",
              border: "1px solid var(--surface-border)",
              borderRadius: "50%",
              width: "36px",
              height: "36px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: "var(--text-primary)",
            }}
          >
            <ChevronLeft size={18} />
          </button>
        ) : (
          <div style={{ width: "36px" }} />
        )}

        {/* Progress dots */}
        <div style={{ display: "flex", gap: "6px" }}>
          {SLIDES.map((_, idx) => (
            <div
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              style={{
                width: currentSlide === idx ? "20px" : "6px",
                height: "6px",
                borderRadius: "3px",
                background: currentSlide === idx ? "var(--brand)" : "var(--surface-border)",
                transition: "all 0.3s ease",
                cursor: "pointer",
              }}
            />
          ))}
        </div>

        {/* Skip Button */}
        <button
          onClick={finishOnboarding}
          style={{
            background: "none",
            border: "none",
            color: "var(--text-muted)",
            fontWeight: 600,
            fontSize: "0.8125rem",
            cursor: "pointer",
          }}
        >
          {language === "hi" ? "स्किप" : "Skip"}
        </button>
      </div>

      {/* Main Slide Content */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", margin: "8px 0" }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}
          >
            {/* Image Preview */}
            <div
              style={{
                position: "relative",
                width: "100%",
                maxHeight: "200px",
                aspectRatio: "1.6/1",
                borderRadius: "16px",
                overflow: "hidden",
                boxShadow: "0 12px 24px rgba(0,0,0,0.12)",
                marginBottom: "12px",
                border: "1px solid var(--surface-border)",
              }}
            >
              <img
                src={slide.image}
                alt={language === "hi" ? slide.titleHi : slide.titleEn}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>

            {/* Badge */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "4px 10px",
                borderRadius: "var(--r-pill)",
                background: "var(--brand-dim)",
                color: slide.color,
                fontWeight: 700,
                fontSize: "0.75rem",
                marginBottom: "8px",
              }}
            >
              <IconComponent size={14} />
              <span>{language === "hi" ? slide.badgeHi : slide.badgeEn}</span>
            </div>

            {/* Title */}
            <h2 className="heading-lg font-devanagari text-brand" style={{ marginBottom: "8px", lineHeight: 1.2, fontSize: "1.25rem" }}>
              {language === "hi" ? slide.titleHi : slide.titleEn}
            </h2>

            {/* Description */}
            <p className="body-sm font-devanagari text-muted" style={{ maxWidth: "320px", lineHeight: 1.5, fontSize: "0.875rem" }}>
              {language === "hi" ? slide.descHi : slide.descEn}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Navigation / Action Button */}
      <div style={{ zIndex: 10 }}>
        <button
          onClick={handleNext}
          className="btn btn-primary"
          style={{
            width: "100%",
            padding: "14px",
            fontSize: "0.9375rem",
            borderRadius: "var(--r-lg)",
            background: "linear-gradient(135deg, var(--brand), var(--brand-light))",
            boxShadow: "0 6px 18px var(--brand-glow)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
          }}
        >
          <span>
            {currentSlide === SLIDES.length - 1
              ? language === "hi"
                ? "अभियान से जुड़ें"
                : "Get Started"
              : language === "hi"
              ? "आगे बढ़ें"
              : "Next"}
          </span>
          {currentSlide === SLIDES.length - 1 ? <CheckCircle2 size={18} /> : <ArrowRight size={18} />}
        </button>
      </div>
    </div>
  );
}
