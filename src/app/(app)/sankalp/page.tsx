"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getQuestionsByCategory } from "@/data/content";
import { Heart, Info, CheckCircle2, Shield, Gem, AlertTriangle, ShieldCheck } from "lucide-react";

export default function SankalpPage() {
  const SANKALPAS = getQuestionsByCategory("sankalp");
  const [accepted, setAccepted] = useState<Record<string, boolean>>({});
  const [showConfirm, setShowConfirm] = useState<string | null>(null);

  const activeSankalp = SANKALPAS.find((s) => s.id === showConfirm);

  const toggleSankalp = (id: string) => {
    if (accepted[id]) {
      setAccepted((prev) => ({ ...prev, [id]: false }));
    } else {
      setShowConfirm(id);
    }
  };

  const confirmAccept = () => {
    if (showConfirm) {
      setAccepted((prev) => ({ ...prev, [showConfirm]: true }));
      setShowConfirm(null);
    }
  };

  return (
    <div className="page" style={{ padding: "16px 16px 100px" }}>
      
      {/* ── Intro ── */}
      <div
        className="card"
        style={{
          padding: "24px", marginBottom: "24px",
          background: "var(--surface-overlay)",
          borderColor: "var(--brand-glow)", textAlign: "center"
        }}
      >
        <Shield size={40} color="var(--brand)" style={{ margin: "0 auto 16px" }} />
        <h2 className="heading-lg font-devanagari" style={{ color: "var(--brand)", marginBottom: "8px" }}>
          आजीवन संकल्प
        </h2>
        <p className="body-sm font-devanagari" style={{ color: "var(--text-secondary)" }}>
          संकल्प आत्मा की शक्ति है। जो संकल्प आप यहाँ लेंगे, वह केवल चातुर्मास के लिए नहीं, बल्कि आजीवन है। कृपया सोच-समझकर निर्णय लें।
        </p>
      </div>

      {/* ── List ── */}
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {SANKALPAS.map((sankalp, i) => {
          const isAccepted = accepted[sankalp.id];

          return (
            <motion.div
              key={sankalp.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`sankalp-card ${isAccepted ? "accepted" : ""}`}
              style={{ position: "relative", overflow: "hidden" }}
            >
              {isAccepted && (
                <div style={{ position: "absolute", top: "-10px", right: "-10px", opacity: 0.05, transform: "scale(3)" }}>
                  <ShieldCheck size={100} color="var(--emerald)" />
                </div>
              )}
              
              <div style={{ display: "flex", alignItems: "flex-start", gap: "16px" }}>
                <div
                  style={{
                    width: "48px", height: "48px", borderRadius: "12px",
                    background: isAccepted ? "var(--emerald-dim)" : "var(--surface-base)",
                    border: `1px solid ${isAccepted ? "rgba(16,185,129,0.3)" : "var(--surface-border)"}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: isAccepted ? "var(--emerald)" : "var(--gold)"
                  }}
                >
                  {isAccepted ? <ShieldCheck size={24} /> : <Gem size={24} />}
                </div>
                
                <div style={{ flex: 1 }}>
                  <div className="font-devanagari" style={{ fontWeight: 700, fontSize: "1.0625rem", color: isAccepted ? "var(--text-primary)" : "var(--text-primary)", marginBottom: "4px" }}>
                    {sankalp.title_hi}
                  </div>
                  <div className="font-devanagari" style={{ fontSize: "0.875rem", color: "var(--text-secondary)", lineHeight: 1.5, marginBottom: "16px" }}>
                    {sankalp.description_hi}
                  </div>
                  
                  <button
                    onClick={() => toggleSankalp(sankalp.id)}
                    className="btn"
                    style={{
                      width: "100%", padding: "12px",
                      background: isAccepted ? "rgba(16,185,129,0.15)" : "var(--brand)",
                      color: isAccepted ? "var(--emerald)" : "#fff",
                      border: isAccepted ? "1px solid rgba(16,185,129,0.3)" : "none",
                      display: "flex", alignItems: "center", justifyContent: "center", gap: "8px"
                    }}
                  >
                    {isAccepted ? (
                      <>
                        <CheckCircle2 size={18} />
                        <span className="font-devanagari">संकल्प लिया गया</span>
                      </>
                    ) : (
                      <>
                        <Heart size={18} />
                        <span className="font-devanagari">यह संकल्प लें</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* ── Confirmation Modal ── */}
      <AnimatePresence>
        {showConfirm && activeSankalp && (
          <div style={{ position: "fixed", inset: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ position: "absolute", inset: 0, background: "rgba(253, 251, 247, 0.8)", backdropFilter: "blur(4px)" }}
              onClick={() => setShowConfirm(null)}
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="card"
              style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: "400px", padding: "24px", background: "var(--surface-raised)", border: "1px solid var(--surface-border)" }}
            >
              <div style={{ display: "flex", justifyContent: "center", marginBottom: "16px", color: "var(--brand)" }}>
                <AlertTriangle size={48} strokeWidth={1.5} />
              </div>
              
              <h3 className="heading-lg font-devanagari" style={{ textAlign: "center", marginBottom: "8px", color: "var(--text-primary)" }}>
                कृपया पुष्टि करें
              </h3>
              
              <div className="card" style={{ padding: "16px", background: "var(--surface-base)", marginBottom: "20px", textAlign: "center" }}>
                <div className="font-devanagari heading-sm" style={{ color: "var(--gold)", marginBottom: "4px" }}>
                  {activeSankalp.title_hi}
                </div>
                <div className="font-devanagari body-sm" style={{ color: "var(--text-muted)" }}>
                  {activeSankalp.description_hi}
                </div>
              </div>
              
              <p className="font-devanagari" style={{ fontSize: "0.875rem", color: "var(--text-secondary)", textAlign: "center", marginBottom: "24px" }}>
                क्या आप दृढ़तापूर्वक आजीवन इस नियम का पालन करने का संकल्प लेते हैं?
              </p>
              
              <div style={{ display: "flex", gap: "12px" }}>
                <button
                  onClick={() => setShowConfirm(null)}
                  className="btn btn-secondary"
                  style={{ flex: 1 }}
                >
                  <span className="font-devanagari">रद्द करें</span>
                </button>
                <button
                  onClick={confirmAccept}
                  className="btn btn-primary"
                  style={{ flex: 1, background: "var(--emerald)", boxShadow: "0 4px 12px rgba(16,185,129,0.3)" }}
                >
                  <span className="font-devanagari">हाँ, संकल्प लेता हूँ</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
