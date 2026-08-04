"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useHabitStore } from "@/store/habitStore";
import { useAuthStore } from "@/store/authStore";
import { useLanguageStore } from "@/store/languageStore";
import { QUESTIONS } from "@/data/content";
import type { Question } from "@/types";
import { IconResolver } from "@/components/IconResolver";
import { fetchAcceptedSankalps, acceptSankalpAction } from "@/app/actions/sankalp";
import { 
  Sparkles, Lock, CheckCircle2, Search, ChevronDown, ChevronUp, 
  ShieldCheck, Heart, Landmark, Flower2, Award
} from "lucide-react";

// Categorize sankalps logically into meaningful spiritual categories
const CATEGORIES: { id: string; name_hi: string; name_en: string; ids: string[] }[] = [
  {
    id: "digital",
    name_hi: "डिजिटल एवं मनोरंजन संयम",
    name_en: "Digital & Entertainment Discipline",
    ids: ["q_sankalp_01", "q_sankalp_04"]
  },
  {
    id: "family",
    name_hi: "परिवार एवं संस्कार",
    name_en: "Family & Ethical Values",
    ids: ["q_sankalp_02", "q_sankalp_03", "q_sankalp_03b", "q_sankalp_06", "q_sankalp_07"]
  },
  {
    id: "spiritual",
    name_hi: "साधना एवं देव-शास्त्र-गुरु भक्ति",
    name_en: "Spiritual Practice & Devotion",
    ids: ["q_sankalp_05", "q_sankalp_09"]
  },
  {
    id: "lifestyle",
    name_hi: "आहार एवं आचरण शुद्धि",
    name_en: "Food & Conduct Purity",
    ids: ["q_sankalp_08"]
  }
];

export default function SankalpPage() {
  const { language } = useLanguageStore();
  const { user, stats, setStats } = useAuthStore();
  const { toggleHabit, getEntryForDate } = useHabitStore();

  const [acceptedMap, setAcceptedMap] = useState<Record<string, string>>({}); // rule_id -> accepted_at
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sankalpToConfirm, setSankalpToConfirm] = useState<Question | null>(null);
  const [acceptedToast, setAcceptedToast] = useState<string | null>(null);
  const [collapsedCats, setCollapsedCats] = useState<Record<string, boolean>>({});

  // All Sankalps
  const allSankalps = useMemo(() => {
    return QUESTIONS.filter((q) => q.category_id === "sankalp" || q.type === "sankalp");
  }, []);

  // Fetch accepted sankalps on mount from Supabase
  useEffect(() => {
    const loadAccepted = async () => {
      setLoading(true);
      const res = await fetchAcceptedSankalps();
      const map: Record<string, string> = {};
      
      if (res.success && res.data) {
        res.data.forEach((row: any) => {
          map[row.rule_id] = row.accepted_at;
        });
      }
      
      // Also merge with local store entries for immediate offline availability
      allSankalps.forEach((q) => {
        const entry = getEntryForDate(q.id, "lifetime_sankalp");
        if (entry?.completed && !map[q.id]) {
          map[q.id] = entry.completedAt || new Date().toISOString();
        }
      });

      setAcceptedMap(map);
      setLoading(false);
    };

    loadAccepted();
  }, [allSankalps, getEntryForDate]);

  const acceptedCount = Object.keys(acceptedMap).length;
  const totalCount = allSankalps.length;
  const remainingCount = Math.max(0, totalCount - acceptedCount);

  // Filtered by search
  const filteredSankalps = useMemo(() => {
    if (!searchQuery.trim()) return allSankalps;
    const q = searchQuery.toLowerCase();
    return allSankalps.filter(
      (item) =>
        item.title_hi.toLowerCase().includes(q) ||
        item.title_en.toLowerCase().includes(q) ||
        item.description_hi.toLowerCase().includes(q) ||
        item.description_en.toLowerCase().includes(q)
    );
  }, [allSankalps, searchQuery]);

  const handleConfirmAccept = async () => {
    if (!sankalpToConfirm) return;
    const target = sankalpToConfirm;
    setSankalpToConfirm(null);

    // Optimistic local state update
    const nowIso = new Date().toISOString();
    setAcceptedMap((prev) => ({ ...prev, [target.id]: nowIso }));
    
    // Update local habitStore
    toggleHabit(target.id, "lifetime_sankalp");

    // Show confirmation success message
    setAcceptedToast(
      language === "hi"
        ? "🌸 आपका संकल्प स्वीकार हो गया है। ईश्वर आपको आपकी यात्रा में स्थिर रहने का बल दें।"
        : "🌸 Your Sankalp has been accepted. May you remain steadfast throughout your journey."
    );
    setTimeout(() => setAcceptedToast(null), 6000);

    // Call server action
    const res = await acceptSankalpAction(target.id, target.points);
    if (res.success && res.newTotalXp !== undefined && stats) {
      setStats({
        ...stats,
        total_xp: res.newTotalXp,
        updated_at: new Date().toISOString()
      });
    }
  };

  const toggleCategory = (catId: string) => {
    setCollapsedCats((prev) => ({ ...prev, [catId]: !prev[catId] }));
  };

  const formatDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString(language === "hi" ? "hi-IN" : "en-US", {
        day: "numeric",
        month: "long",
        year: "numeric"
      });
    } catch {
      return isoString;
    }
  };

  return (
    <div className="page" style={{ padding: "20px 16px 120px", background: "linear-gradient(180deg, #FDFCFB 0%, #F4ECE1 100%)", minHeight: "100dvh" }}>
      
      {/* 🌸 Success Banner Toast 🌸 */}
      <AnimatePresence>
        {acceptedToast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            style={{
              position: "fixed", top: "80px", left: "16px", right: "16px", zIndex: 1000,
              background: "linear-gradient(135deg, #15803D 0%, #166534 100%)",
              color: "white", padding: "16px 20px", borderRadius: "16px",
              boxShadow: "0 10px 30px rgba(22,101,52,0.3)",
              border: "1px solid rgba(255,255,255,0.2)",
              display: "flex", alignItems: "center", gap: "12px"
            }}
          >
            <Sparkles size={24} color="#FDE047" style={{ flexShrink: 0 }} />
            <div className="font-devanagari" style={{ fontSize: "0.875rem", lineHeight: 1.4, fontWeight: 600 }}>
              {acceptedToast}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🪷 Confirmation Modal 🪷 */}
      <AnimatePresence>
        {sankalpToConfirm && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(15, 12, 10, 0.75)", backdropFilter: "blur(12px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 10000, padding: "20px" }}>
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              style={{
                maxWidth: "420px", width: "100%",
                background: "#FAF7F2",
                padding: "28px 24px",
                border: "2px solid var(--gold)",
                borderRadius: "24px",
                boxShadow: "0 20px 40px rgba(0,0,0,0.2)"
              }}
            >
              <div style={{ textAlign: "center", marginBottom: "16px" }}>
                <div style={{ width: "56px", height: "56px", borderRadius: "50%", background: "var(--gold-dim)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
                  <Flower2 size={28} color="var(--gold)" />
                </div>
                <h3 className="font-devanagari" style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--text-primary)" }}>
                  {language === "hi" ? "🪷 आजीवन संकल्प प्रतिज्ञा" : "🪷 Take Lifetime Sankalp"}
                </h3>
              </div>

              <div className="font-devanagari" style={{ background: "rgba(217, 119, 6, 0.08)", padding: "16px", borderRadius: "14px", borderLeft: "4px solid var(--gold)", marginBottom: "20px" }}>
                <p style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--text-primary)" }}>
                  {language === "hi" ? sankalpToConfirm.title_hi : sankalpToConfirm.title_en}
                </p>
                <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginTop: "4px" }}>
                  {language === "hi" ? sankalpToConfirm.description_hi : sankalpToConfirm.description_en}
                </p>
              </div>

              <p className="font-devanagari" style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "24px", lineHeight: 1.6, textAlign: "center" }}>
                {language === "hi" 
                  ? "आप एक व्यक्तिगत और अटूट प्रतिज्ञा ले रहे हैं। इस संकल्प को तभी स्वीकार करें जब आप इसे जीवनभर निभाने के प्रति पूर्णतः निष्ठावान हों। एक बार स्वीकार करने के बाद इसे बदला या हटाया नहीं जा सकता।"
                  : "You are making a personal commitment. This promise should only be accepted if you sincerely intend to follow it. Once accepted, this Sankalp cannot be modified."
                }
              </p>

              <div style={{ display: "flex", gap: "12px" }}>
                <button 
                  className="btn font-devanagari" 
                  style={{ flex: 1, padding: "12px", background: "var(--surface-raised)", border: "1px solid var(--surface-border)", color: "var(--text-primary)", borderRadius: "12px", fontWeight: 600 }} 
                  onClick={() => setSankalpToConfirm(null)}
                >
                  {language === "hi" ? "रद्द करें" : "Cancel"}
                </button>
                <button 
                  className="btn font-devanagari" 
                  style={{ flex: 1.4, padding: "12px", background: "linear-gradient(135deg, var(--brand) 0%, #8A2B1A 100%)", color: "white", border: "none", borderRadius: "12px", fontWeight: 700, boxShadow: "0 4px 14px rgba(138,43,26,0.3)" }} 
                  onClick={handleConfirmAccept}
                >
                  {language === "hi" ? "संकल्प स्वीकार करें" : "I Accept This Sankalp"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Page Header & Hero Section ── */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }} 
        animate={{ opacity: 1, y: 0 }}
        style={{
          background: "linear-gradient(135deg, #2D1500 0%, #5A270B 100%)",
          borderRadius: "24px",
          padding: "28px 24px",
          color: "white",
          boxShadow: "0 12px 32px rgba(45,21,0,0.25)",
          marginBottom: "24px",
          position: "relative",
          overflow: "hidden"
        }}
      >
        <div style={{ position: "absolute", top: -30, right: -30, opacity: 0.08 }}>
          <Landmark size={180} color="white" />
        </div>

        <div style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
          <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px", border: "1px solid rgba(255,255,255,0.2)" }}>
            <Flower2 size={24} color="var(--gold)" />
          </div>

          <h1 className="heading-xl font-devanagari" style={{ color: "white", marginBottom: "8px" }}>
            {language === "hi" ? "🪷 मेरे आजीवन संकल्प" : "🪷 My Lifetime Sankalp"}
          </h1>
          
          <p className="font-devanagari" style={{ opacity: 0.9, fontSize: "0.85rem", lineHeight: 1.5, maxWidth: "340px", margin: "0 auto 24px", fontStyle: "italic", color: "#FCE7D0" }}>
            {language === "hi"
              ? "“संकल्प विवेक के साथ ली जाने वाली प्रतिज्ञा है। केवल उन्हीं संकल्पों को स्वीकार करें जिन्हें आप निष्ठापूर्वक निभाना चाहते हैं।”"
              : "“A Sankalp is a promise made with awareness. Accept only those commitments you genuinely intend to follow.”"
            }
          </p>

          {/* Progress Indicator (No percentages) */}
          <div style={{ background: "rgba(0,0,0,0.25)", borderRadius: "16px", padding: "16px", border: "1px solid rgba(255,255,255,0.1)" }}>
            <div style={{ display: "flex", justifyContent: "space-around", marginBottom: "12px" }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "var(--gold)", fontFamily: "var(--font-sans)" }}>{acceptedCount}</div>
                <div className="font-devanagari" style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.7)", textTransform: "uppercase", fontWeight: 600 }}>
                  {language === "hi" ? "स्वीकृत संकल्प" : "Accepted"}
                </div>
              </div>
              <div style={{ width: "1px", background: "rgba(255,255,255,0.15)" }} />
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "white", fontFamily: "var(--font-sans)" }}>{remainingCount}</div>
                <div className="font-devanagari" style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.7)", textTransform: "uppercase", fontWeight: 600 }}>
                  {language === "hi" ? "शेष संकल्प" : "Remaining"}
                </div>
              </div>
            </div>

            {/* Minimal progress bar */}
            <div style={{ height: "6px", background: "rgba(255,255,255,0.15)", borderRadius: "3px", overflow: "hidden" }}>
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: totalCount > 0 ? `${(acceptedCount / totalCount) * 100}%` : "0%" }}
                transition={{ duration: 0.8 }}
                style={{ height: "100%", background: "var(--gold)", borderRadius: "3px" }}
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── Search Bar ── */}
      <div style={{ marginBottom: "20px" }}>
        <div style={{ position: "relative" }}>
          <Search size={18} color="var(--text-muted)" style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)" }} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={language === "hi" ? "संकल्प खोजें..." : "Search Sankalp..."}
            className="font-devanagari"
            style={{
              width: "100%",
              padding: "12px 16px 12px 42px",
              borderRadius: "14px",
              background: "rgba(255,255,255,0.8)",
              border: "1px solid var(--surface-border)",
              fontSize: "0.9rem",
              outline: "none",
              boxShadow: "0 2px 8px rgba(0,0,0,0.02)"
            }}
          />
        </div>
      </div>

      {/* ── Categories & Cards ── */}
      {filteredSankalps.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px 20px", background: "rgba(255,255,255,0.6)", borderRadius: "20px", border: "1px dashed var(--surface-border)" }}>
          <Flower2 size={40} color="var(--brand)" style={{ margin: "0 auto 12px", opacity: 0.5 }} />
          <p className="font-devanagari" style={{ fontSize: "0.95rem", color: "var(--text-secondary)", fontWeight: 600 }}>
            {language === "hi" 
              ? "🪷 हर महान यात्रा एक सच्चे संकल्प से शुरू होती है। अपना पहला संकल्प चुनें।"
              : "🪷 Every great journey begins with one sincere promise. Choose your first Sankalp."
            }
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {CATEGORIES.map((category) => {
            const catSankalps = filteredSankalps.filter((q) => category.ids.includes(q.id));
            if (catSankalps.length === 0) return null;
            
            const isCollapsed = !!collapsedCats[category.id];

            return (
              <div key={category.id} style={{ background: "rgba(255,255,255,0.7)", backdropFilter: "blur(12px)", borderRadius: "20px", border: "1px solid rgba(255,255,255,0.6)", padding: "16px", boxShadow: "0 4px 16px rgba(0,0,0,0.02)" }}>
                <div 
                  onClick={() => toggleCategory(category.id)}
                  style={{ display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", padding: "4px 0" }}
                >
                  <h3 className="font-devanagari" style={{ fontSize: "1rem", fontWeight: 700, color: "var(--text-primary)", display: "flex", alignItems: "center", gap: "8px" }}>
                    <ShieldCheck size={18} color="var(--brand)" />
                    {language === "hi" ? category.name_hi : category.name_en}
                  </h3>
                  <div style={{ color: "var(--text-muted)" }}>
                    {isCollapsed ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
                  </div>
                </div>

                <AnimatePresence>
                  {!isCollapsed && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      style={{ overflow: "hidden", display: "flex", flexDirection: "column", gap: "14px", marginTop: "16px" }}
                    >
                      {catSankalps.map((sankalp) => {
                        const acceptedAt = acceptedMap[sankalp.id];
                        const isAccepted = !!acceptedAt;

                        return (
                          <motion.div
                            key={sankalp.id}
                            layout
                            style={{
                              background: isAccepted ? "linear-gradient(135deg, rgba(217,119,6,0.04) 0%, rgba(255,255,255,0.9) 100%)" : "white",
                              border: isAccepted ? "1.5px solid var(--gold)" : "1px solid var(--surface-border)",
                              borderRadius: "16px",
                              padding: "20px",
                              boxShadow: isAccepted ? "0 4px 16px rgba(217,119,6,0.1)" : "0 2px 8px rgba(0,0,0,0.02)",
                              position: "relative"
                            }}
                          >
                            <div style={{ display: "flex", alignItems: "flex-start", gap: "16px" }}>
                              <div style={{ 
                                width: "48px", height: "48px", borderRadius: "14px", 
                                background: isAccepted ? "var(--gold-dim)" : "var(--surface-raised)", 
                                border: `1px solid ${isAccepted ? "rgba(217,119,6,0.3)" : "var(--surface-border)"}`,
                                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 
                              }}>
                                <IconResolver iconName={sankalp.icon} size={24} color={isAccepted ? "#7A4A15" : "var(--brand)"} />
                              </div>

                              <div style={{ flex: 1 }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "8px", marginBottom: "4px" }}>
                                  <h4 className="font-devanagari text-primary" style={{ fontWeight: 700, fontSize: "1rem", lineHeight: 1.3 }}>
                                    {language === "hi" ? sankalp.title_hi : sankalp.title_en}
                                  </h4>
                                </div>

                                <p className="font-devanagari text-secondary" style={{ fontSize: "0.825rem", lineHeight: 1.5, marginBottom: "16px" }}>
                                  {language === "hi" ? sankalp.description_hi : sankalp.description_en}
                                </p>

                                {/* Blessing & Acceptance Details */}
                                <div style={{ display: "flex", flexDirection: "column", gap: "10px", borderTop: "1px solid var(--surface-border)", paddingTop: "12px" }}>
                                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px" }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                                      <Award size={14} color="var(--gold)" />
                                      <span className="font-devanagari" style={{ fontSize: "0.75rem", fontWeight: 700, color: "#7A4A15" }}>
                                        {language === "hi" ? "आशीर्वाद: " : "Blessing: "} +{sankalp.points.toLocaleString(language === "hi" ? "hi-IN" : "en-US")} {language === "hi" ? "पुण्य अंक" : "Punya"}
                                      </span>
                                    </div>

                                    {isAccepted ? (
                                      <div style={{ display: "flex", alignItems: "center", gap: "6px", background: "rgba(22,163,74,0.1)", padding: "4px 10px", borderRadius: "20px" }}>
                                        <CheckCircle2 size={14} color="#16A34A" />
                                        <span className="font-devanagari" style={{ fontSize: "0.75rem", fontWeight: 700, color: "#16A34A" }}>
                                          {language === "hi" ? `स्वीकृत (${formatDate(acceptedAt)})` : `Accepted (${formatDate(acceptedAt)})`}
                                        </span>
                                      </div>
                                    ) : (
                                      <button
                                        onClick={() => setSankalpToConfirm(sankalp)}
                                        className="btn font-devanagari"
                                        style={{
                                          padding: "8px 16px",
                                          fontSize: "0.825rem",
                                          borderRadius: "10px",
                                          background: "linear-gradient(135deg, var(--brand) 0%, #8A2B1A 100%)",
                                          color: "white",
                                          border: "none",
                                          fontWeight: 700,
                                          boxShadow: "0 2px 8px rgba(138,43,26,0.2)"
                                        }}
                                      >
                                        {language === "hi" ? "यह संकल्प स्वीकार करें" : "Take This Sankalp"}
                                      </button>
                                    )}
                                  </div>

                                  {isAccepted && (
                                    <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "0.7rem", color: "var(--text-muted)", fontWeight: 600 }}>
                                      <Lock size={12} />
                                      <span className="font-devanagari">{language === "hi" ? "🔒 स्थायी संकल्प (अपरिवर्तनीय)" : "🔒 Permanent Commitment"}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
