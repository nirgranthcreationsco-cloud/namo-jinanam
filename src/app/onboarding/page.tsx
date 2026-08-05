"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "@/store/authStore";
import { useLanguageStore } from "@/store/languageStore";
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles, BookOpen, Trophy, Award, CheckCircle2 } from "lucide-react";

const SLIDES = [
  {
    id: 1,
    image: "/dailyniyam.png",
    titleHi: "१. दैनिक नियम कैसे ट्रैक करें?",
    titleEn: "1. How to Track Daily Niyams?",
    descHi: "लॉगिन करें और अपने नियमों के आगे टिक करें। अंत में 'Submit' दबाएँ। ध्यान दें: एक बार सबमिट करने के बाद आप नियमों को बदल नहीं पाएंगे।",
    descEn: "Log in and check off your completed vows. Tap Submit to claim Punya points. Note: Once submitted, your choices are locked for the day.",
    badgeHi: "स्टेप १: नियम ट्रैकिंग",
    badgeEn: "Step 1: Habit Check",
    icon: BookOpen,
    color: "#D97706",
  },
  {
    id: 2,
    image: "/dailychallenge.png",
    titleHi: "२. आज का विशेष आशीर्वाद",
    titleEn: "2. Today's Special Blessing",
    descHi: "प्रतिदिन होम स्क्रीन पर एक विशेष अनुभाग की चुनौती मिलेगी। उस अनुभाग के सभी नियम पूरे करने पर आपको अतिरिक्त बोनस पुण्य मिलेगा!",
    descEn: "Every day features a special section challenge. Complete all niyams in that section to unlock extra bonus Punya points as a Blessing!",
    badgeHi: "स्टेप २: आज का आशीर्वाद",
    badgeEn: "Step 2: Today's Blessing",
    icon: Sparkles,
    color: "#059669",
  },
  {
    id: 3,
    image: "/lifetime sankalp.png",
    titleHi: "३. आजीवन एवं चातुर्मास संकल्प",
    titleEn: "3. Lifetime & Chaturmas Sankalp",
    descHi: "ऐसे संकल्प लें जिनका आप जीवन भर या चातुर्मास में पालन कर सकें। एक बार संकल्प लेने के बाद यह स्थायी रूप से लॉक हो जाएगा।",
    descEn: "Take vows you can follow for a lifetime or during Chaturmas. Once accepted, your Sankalp is permanently locked.",
    badgeHi: "स्टेप ३: संकल्प",
    badgeEn: "Step 3: Vows",
    icon: CheckCircle2,
    color: "#7C3AED",
  },
  {
    id: 4,
    image: "/certificate.png",
    titleHi: "४. डिजिटल सर्टिफिकेट",
    titleEn: "4. Digital Certificate",
    descHi: "अपना आध्यात्मिक सफर पूरा करने पर अपनी प्रोफाइल स्क्रीन से अपना डिजिटल सर्टिफिकेट डाउनलोड करें।",
    descEn: "After completing your spiritual journey, go to the Profile screen to download your customized digital certificate.",
    badgeHi: "स्टेप ४: सर्टिफिकेट",
    badgeEn: "Step 4: Certification",
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
