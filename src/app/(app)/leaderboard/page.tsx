"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "@/store/authStore";
import { useLanguageStore } from "@/store/languageStore";
import { TreePine, Info, Star, CalendarDays, Lock, X, Sparkles, Wind } from "lucide-react";

// Growth Stages mapping
const GROWTH_STAGES = [
  { id: 0, minStreak: 0, emoji: "🌱", labelHi: "बीज (Seed)", labelEn: "Seed", color: "#84CC16", size: 60 },
  { id: 1, minStreak: 1, emoji: "🌿", labelHi: "अंकुर (Sprout)", labelEn: "Sprout", color: "#65A30D", size: 80 },
  { id: 2, minStreak: 4, emoji: "🪴", labelHi: "पौधा (Young Tree)", labelEn: "Young Tree", color: "#4D7C0F", size: 100 },
  { id: 3, minStreak: 11, emoji: "🌳", labelHi: "वृक्ष (Flourishing Tree)", labelEn: "Flourishing Tree", color: "#15803D", size: 130 },
  { id: 4, minStreak: 21, emoji: "🌸", labelHi: "पुष्पित वृक्ष (Blossoming)", labelEn: "Blossoming Tree", color: "#BE185D", size: 160 },
  { id: 5, minStreak: 31, emoji: "🪷", labelHi: "संयम वृक्ष (Tree of Discipline)", labelEn: "Tree of Discipline", color: "#9333EA", size: 190 },
];

const QUOTES = [
  { hi: "छोटे-छोटे नियम जीवन का महान चरित्र बनाते हैं।", en: "Small habits become lifelong character." },
  { hi: "संयम का एक दिन भी कभी व्यर्थ नहीं जाता।", en: "One disciplined day is never wasted." },
  { hi: "निरंतरता, प्रेरणा से अधिक शक्तिशाली है।", en: "Consistency is stronger than motivation." },
  { hi: "हर बार जब आप संयम चुनते हैं, आपका वृक्ष बढ़ता है।", en: "Your tree grows every time you choose discipline." }
];

function Particles() {
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 0 }}>
      {Array.from({ length: 15 }).map((_, i) => (
        <motion.div
          key={i}
          initial={{
            opacity: 0,
            x: Math.random() * 100 + "%",
            y: Math.random() * 100 + "%",
          }}
          animate={{
            opacity: [0, 0.6, 0],
            y: ["-5%", "-20%"],
            x: `${(Math.random() - 0.5) * 20}%`
          }}
          transition={{
            duration: 4 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: "easeInOut"
          }}
          style={{
            position: "absolute",
            width: "6px",
            height: "6px",
            borderRadius: "50%",
            background: "var(--gold-light)",
            filter: "blur(2px)"
          }}
        />
      ))}
    </div>
  );
}

function CommunityTrees() {
  // Random small trees in the background
  const emojis = ["🌳", "🌲", "🪴", "🌿", "🌸"];
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 1, opacity: 0.5 }}>
      {Array.from({ length: 25 }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.1, duration: 1 }}
          style={{
            position: "absolute",
            bottom: `${20 + Math.random() * 40}%`,
            left: `${Math.random() * 100}%`,
            fontSize: `${16 + Math.random() * 24}px`,
            filter: `blur(${Math.random() * 2}px)`,
            transform: `scaleX(${Math.random() > 0.5 ? 1 : -1})` // Random flip
          }}
        >
          {emojis[Math.floor(Math.random() * emojis.length)]}
        </motion.div>
      ))}
    </div>
  );
}

export default function ForestPage() {
  const { language } = useLanguageStore();
  const { stats, profile } = useAuthStore();
  
  const [showIntro, setShowIntro] = useState(true);
  const [treeZoomed, setTreeZoomed] = useState(false);
  
  const streak = stats?.current_streak || 0;
  const quote = QUOTES[new Date().getDay() % QUOTES.length];
  
  // Determine current stage
  const currentStageIndex = GROWTH_STAGES.reduce((acc, stage, idx) => {
    if (streak >= stage.minStreak) return idx;
    return acc;
  }, 0);
  
  const currentStage = GROWTH_STAGES[currentStageIndex];
  const nextStage = GROWTH_STAGES[currentStageIndex + 1];
  
  return (
    <div className="page" style={{ paddingBottom: "100px", minHeight: "100dvh", background: "linear-gradient(180deg, #E0F2FE 0%, #F0FDF4 40%, var(--surface-bg) 100%)", position: "relative" }}>
      
      {/* Intro Modal Overlay */}
      <AnimatePresence>
        {showIntro && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "fixed", inset: 0, zIndex: 100,
              background: "rgba(0,0,0,0.4)", backdropFilter: "blur(8px)",
              display: "flex", alignItems: "center", justifyContent: "center",
              padding: "20px"
            }}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="card"
              style={{
                background: "rgba(255,255,255,0.9)",
                maxWidth: "400px", width: "100%", padding: "32px 24px",
                textAlign: "center", position: "relative"
              }}
            >
              <h2 className="heading-xl font-devanagari text-brand" style={{ marginBottom: "16px" }}>
                {language === "hi" ? "संयम वन" : "Forest of Discipline"}
              </h2>
              <p className="body-md font-devanagari text-muted" style={{ marginBottom: "24px", fontStyle: "italic" }}>
                {language === "hi" 
                  ? "हमारी सामूहिक साधना का एक जीवंत प्रतीक।" 
                  : "A living symbol of our collective discipline."}
              </p>
              <div className="body-sm font-devanagari text-primary" style={{ textAlign: "left", marginBottom: "24px", display: "flex", flexDirection: "column", gap: "12px" }}>
                <p>{language === "hi" ? "इस अभियान का हर प्रतिभागी एक डिजिटल वृक्ष लगाता है।" : "Every participant in Namo Jinanam plants a digital tree."}</p>
                <p>{language === "hi" ? "जैसे-जैसे आप अपने दैनिक नियम पूरे करते हैं, आपका वृक्ष मजबूत होता है।" : "As you complete your daily niyams, your tree grows stronger."}</p>
                <p>{language === "hi" ? "हजारों व्यक्तिगत संकल्प मिलकर एक सुंदर वन बनाते हैं। यह वन याद दिलाता है कि छोटी-सी साधना भी एक महान उद्देश्य में योगदान देती है।" : "Together, thousands of individual journeys create one beautiful forest. This forest is a reminder that even the smallest daily discipline contributes to something much greater than ourselves."}</p>
              </div>
              
              <div style={{ padding: "16px", background: "var(--brand-dim)", borderRadius: "12px", marginBottom: "24px" }}>
                <p className="font-devanagari text-brand" style={{ fontWeight: 700, fontSize: "0.875rem" }}>
                  "{language === "hi" ? "महान वन एक विशाल वृक्ष से नहीं, बल्कि प्रतिदिन बढ़ने वाले हजारों छोटे वृक्षों से बनता है।" : "Great forests are not built by one giant tree, but by thousands of small ones growing every day."}"
                </p>
              </div>

              <button 
                className="btn btn-primary" 
                style={{ width: "100%", padding: "14px" }}
                onClick={() => setShowIntro(false)}
              >
                {language === "hi" ? "अपना वृक्ष देखें" : "Explore My Tree"}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Main Scene ── */}
      <section style={{ height: "450px", position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end" }}>
        
        {/* Environment */}
        <Particles />
        <CommunityTrees />
        
        {/* Sun */}
        <motion.div 
          animate={{ opacity: [0.7, 1, 0.7], scale: [1, 1.05, 1] }} 
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          style={{ position: "absolute", top: "10%", right: "20%", width: "120px", height: "120px", borderRadius: "50%", background: "radial-gradient(circle, rgba(253,224,71,0.8) 0%, rgba(253,224,71,0) 70%)", filter: "blur(20px)", zIndex: 0 }} 
        />

        {/* User Tree */}
        <div style={{ position: "relative", zIndex: 10, cursor: "pointer", marginBottom: "40px" }} onClick={() => setTreeZoomed(true)}>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", damping: 15, stiffness: 100, delay: 0.2 }}
            style={{ 
              fontSize: `${currentStage.size}px`, 
              filter: `drop-shadow(0 20px 30px rgba(0,0,0,0.15)) drop-shadow(0 0 40px ${currentStage.color}40)`,
              lineHeight: 1,
              position: "relative"
            }}
          >
            {currentStage.emoji}
            
            {/* Soft Glow behind tree */}
            <div style={{ position: "absolute", bottom: "10%", left: "50%", transform: "translateX(-50%)", width: "50%", height: "20%", background: currentStage.color, filter: "blur(30px)", opacity: 0.4, zIndex: -1 }} />
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
            className="font-devanagari"
            style={{ position: "absolute", bottom: "-30px", left: "50%", transform: "translateX(-50%)", whiteSpace: "nowrap", background: "rgba(255,255,255,0.7)", padding: "4px 12px", borderRadius: "20px", fontSize: "0.75rem", fontWeight: 700, color: "var(--text-primary)", boxShadow: "0 2px 8px rgba(0,0,0,0.05)", backdropFilter: "blur(4px)" }}
          >
            {profile?.full_name?.split(" ")[0]}{language === "hi" ? " का वृक्ष" : "'s Tree"}
          </motion.div>
        </div>
        
        {/* Ground */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "120px", background: "linear-gradient(180deg, rgba(22,163,74,0) 0%, rgba(22,163,74,0.1) 100%)", borderTop: "1px solid rgba(22,163,74,0.2)", zIndex: 1, transform: "perspective(500px) rotateX(60deg)", transformOrigin: "bottom" }} />
      </section>

      {/* ── Content Below Scene ── */}
      <div style={{ padding: "0 16px", marginTop: "-20px", position: "relative", zIndex: 20 }}>
        
        {/* Daily Inspiration */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="card" style={{ padding: "20px", textAlign: "center", marginBottom: "16px", background: "linear-gradient(135deg, var(--surface-base) 0%, var(--surface-overlay) 100%)" }}
        >
          <Sparkles size={20} color="var(--gold)" style={{ margin: "0 auto 12px" }} />
          <p className="font-devanagari text-primary" style={{ fontSize: "1rem", fontWeight: 600, fontStyle: "italic", lineHeight: 1.4 }}>
            "{language === "hi" ? quote.hi : quote.en}"
          </p>
        </motion.div>

        {/* Educational Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          className="card" style={{ padding: "24px", marginBottom: "16px" }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
            <Info size={20} color="var(--brand)" />
            <h3 className="heading-md font-devanagari text-brand">
              {language === "hi" ? "संयम वन क्या है?" : "What is the Forest of Discipline?"}
            </h3>
          </div>
          <div className="body-sm font-devanagari text-muted" style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <p>{language === "hi" ? "संयम वन कोई प्रतियोगिता नहीं है। यह आपकी आध्यात्मिक और व्यक्तिगत प्रगति का दृश्य रूप है।" : "The Forest of Discipline is not a competition. It is a visual representation of your spiritual and personal growth."}</p>
            <p>{language === "hi" ? "आपका लक्ष्य किसी और से बेहतर बनना नहीं, बल्कि खुद से बेहतर बनना है।" : "Your goal isn't to become better than someone else. Your goal is to become better than you were yesterday."}</p>
          </div>
          
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "24px", padding: "16px", background: "var(--surface-overlay)", borderRadius: "12px" }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "24px", marginBottom: "4px" }}>📝</div>
              <div style={{ fontSize: "0.6875rem", fontWeight: 700 }}>{language === "hi" ? "दैनिक नियम" : "Daily Niyam"}</div>
            </div>
            <Wind size={16} color="var(--text-muted)" />
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "24px", marginBottom: "4px" }}>🌱</div>
              <div style={{ fontSize: "0.6875rem", fontWeight: 700 }}>{language === "hi" ? "वृक्ष बढ़ा" : "Tree Grows"}</div>
            </div>
            <Wind size={16} color="var(--text-muted)" />
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "24px", marginBottom: "4px" }}>🌳</div>
              <div style={{ fontSize: "0.6875rem", fontWeight: 700 }}>{language === "hi" ? "वन मजबूत हुआ" : "Forest Stronger"}</div>
            </div>
          </div>
        </motion.div>

        {/* Hall of Legends (Locked) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
          className="card" style={{ padding: "24px", textAlign: "center", border: "1px dashed var(--surface-border)", background: "rgba(255,255,255,0.4)" }}
        >
          <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: "var(--surface-overlay)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
            <Lock size={20} color="var(--text-muted)" />
          </div>
          <h3 className="heading-md font-devanagari text-primary" style={{ marginBottom: "8px" }}>
            {language === "hi" ? "महान विभूतियाँ" : "Hall of Legends"}
          </h3>
          <p className="body-sm font-devanagari text-muted" style={{ maxWidth: "280px", margin: "0 auto" }}>
            {language === "hi" 
              ? "जैसे-जैसे हमारा समाज आगे बढ़ेगा, सामूहिक उपलब्धियों का जश्न मनाने के नए तरीके सामने आएंगे।" 
              : "As our community grows, new ways to celebrate collective achievements will bloom."}
          </p>
        </motion.div>
      </div>

      {/* Tree Stats Overlay */}
      <AnimatePresence>
        {treeZoomed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setTreeZoomed(false)}
            style={{
              position: "fixed", inset: 0, zIndex: 200,
              background: "rgba(255,255,255,0.85)", backdropFilter: "blur(12px)",
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              padding: "24px"
            }}
          >
            <button 
              onClick={() => setTreeZoomed(false)}
              style={{ position: "absolute", top: "40px", right: "24px", width: "40px", height: "40px", borderRadius: "50%", background: "var(--surface-overlay)", display: "flex", alignItems: "center", justifyContent: "center", border: "none" }}
            >
              <X size={20} color="var(--text-primary)" />
            </button>

            <motion.div layoutId="tree-emoji" style={{ fontSize: "120px", marginBottom: "24px", filter: `drop-shadow(0 20px 40px ${currentStage.color}60)` }}>
              {currentStage.emoji}
            </motion.div>

            <motion.h2 
              initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}
              className="heading-xl font-devanagari" style={{ color: currentStage.color, marginBottom: "8px" }}
            >
              {language === "hi" ? currentStage.labelHi : currentStage.labelEn}
            </motion.h2>

            <motion.p 
              initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}
              className="font-devanagari text-muted" style={{ marginBottom: "32px" }}
            >
              {profile?.full_name}
            </motion.p>

            <motion.div 
              initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}
              style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", width: "100%", maxWidth: "320px" }}
            >
              <div className="card" style={{ padding: "16px", textAlign: "center", background: "var(--surface-base)" }}>
                <div style={{ color: "#C85010", fontSize: "24px", fontWeight: 800, marginBottom: "4px", display: "flex", alignItems: "center", justifyContent: "center", gap: "4px" }}>
                  <span style={{ fontSize: "16px" }}>🔥</span> {streak}
                </div>
                <div className="font-devanagari text-muted" style={{ fontSize: "0.75rem", fontWeight: 600 }}>
                  {language === "hi" ? "स्ट्रीक" : "Current Streak"}
                </div>
              </div>
              <div className="card" style={{ padding: "16px", textAlign: "center", background: "var(--surface-base)" }}>
                <div style={{ color: "var(--gold)", fontSize: "24px", fontWeight: 800, marginBottom: "4px", display: "flex", alignItems: "center", justifyContent: "center", gap: "4px" }}>
                  <Star size={16} fill="currentColor" /> {stats?.total_points || 0}
                </div>
                <div className="font-devanagari text-muted" style={{ fontSize: "0.75rem", fontWeight: 600 }}>
                  {language === "hi" ? "पुण्य XP" : "Total Punya XP"}
                </div>
              </div>
              <div className="card" style={{ padding: "16px", textAlign: "center", background: "var(--surface-base)", gridColumn: "span 2" }}>
                <div style={{ color: "var(--brand)", fontSize: "24px", fontWeight: 800, marginBottom: "4px", display: "flex", alignItems: "center", justifyContent: "center", gap: "4px" }}>
                  <CalendarDays size={18} /> {stats?.total_days_participated || 0}
                </div>
                <div className="font-devanagari text-muted" style={{ fontSize: "0.75rem", fontWeight: 600 }}>
                  {language === "hi" ? "कुल दिन" : "Days Completed"}
                </div>
              </div>
            </motion.div>

            {nextStage && (
              <motion.div 
                initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}
                style={{ marginTop: "32px", textAlign: "center" }}
              >
                <div className="font-devanagari text-muted" style={{ fontSize: "0.75rem", marginBottom: "8px" }}>
                  {language === "hi" ? "अगला पड़ाव" : "Next Milestone"}
                </div>
                <div className="chip" style={{ background: "var(--surface-base)", border: "1px solid var(--surface-border)", fontSize: "0.875rem", fontWeight: 600 }}>
                  {nextStage.emoji} {language === "hi" ? nextStage.labelHi : nextStage.labelEn} ({nextStage.minStreak} {language === "hi" ? "दिन" : "days"})
                </div>
              </motion.div>
            )}

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
