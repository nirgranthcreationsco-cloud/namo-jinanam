"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "@/store/authStore";
import { useLanguageStore } from "@/store/languageStore";
import { ArrowRight, ChevronLeft, CheckCircle2, User as UserIcon, MapPin, Activity, ShieldCheck, Globe } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: "",
    password: "",
    phone: "",
    gender: "",
    ageGroup: "",
    city: "",
  });
  const { setUser, setProfile, setStats } = useAuthStore();
  const { language, setLanguage } = useLanguageStore();

  const handleNext = () => setStep((s) => Math.min(s + 1, 5));
  const handlePrev = () => setStep((s) => Math.max(s - 1, 1));

  const updateForm = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = () => {
    setUser({ id: "new-user-1", email: `${formData.phone}@namo.com` });
    const genderMap: Record<string, "male" | "female" | "other"> = {
      "पुरुष (Male)": "male",
      "महिला (Female)": "female",
      "Male": "male",
      "Female": "female",
    };
    const mappedGender = genderMap[formData.gender] || "other";

    let mappedAgeGroup: "children" | "youth" | "adult" | "senior" = "adult";
    if (formData.ageGroup === "under_10") mappedAgeGroup = "children";
    else if (formData.ageGroup === "11-20") mappedAgeGroup = "youth";
    else if (formData.ageGroup === "60_plus") mappedAgeGroup = "senior";

    setProfile({
      id: "new-user-1",
      user_id: "new-user-1",
      full_name: formData.fullName,
      phone: formData.phone,
      gender: mappedGender,
      age_group: mappedAgeGroup,
      dob: "2000-01-01",
      email: `${formData.phone}@namo.com`,
      address: formData.city,
      state: "",
      city: formData.city,
      temple_id: "temple_01",
      father_name: "",
      mother_name: "",
      role: "participant",
      created_at: new Date().toISOString()
    });
    setStats({
      id: "new-user-stats-1",
      user_id: "new-user-1",
      total_points: 0,
      today_points: 0,
      current_streak: 0,
      longest_streak: 0,
      total_days_participated: 0,
      level: 1,
      level_name_hi: "श्रावक",
      level_name_en: "Shravak",
      completion_percentage: 0,
      badges: [],
    });
    router.replace("/dashboard");
  };

  const getStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div style={{ textAlign: "center", marginBottom: "8px" }}>
              <UserIcon size={48} color="var(--brand)" style={{ margin: "0 auto 16px" }} />
              <h2 className="heading-lg font-devanagari">
                {language === "hi" ? "मूल जानकारी" : "Basic Info"}
              </h2>
              <p className="body-sm font-devanagari" style={{ color: "var(--text-muted)" }}>
                {language === "hi" ? "आपका नाम और संपर्क विवरण" : "Your name and contact details"}
              </p>
            </div>
            <div>
              <label className="field-label font-devanagari">
                {language === "hi" ? "पूरा नाम (Full Name)" : "Full Name"}
              </label>
              <input type="text" className="field" placeholder={language === "hi" ? "आपका पूरा नाम" : "Your full name"} value={formData.fullName} onChange={(e) => updateForm("fullName", e.target.value)} />
            </div>
            <div>
              <label className="field-label font-devanagari">
                {language === "hi" ? "मोबाइल नंबर (Mobile Number)" : "Mobile Number"}
              </label>
              <input type="tel" className="field" placeholder={language === "hi" ? "अपना 10 अंकों का मोबाइल नंबर दर्ज करें" : "Enter your 10-digit mobile number"} value={formData.phone} onChange={(e) => {
                const val = e.target.value.replace(/\D/g, "");
                if (val.length <= 10) updateForm("phone", val);
              }} />
            </div>
            <div>
              <label className="field-label font-devanagari">
                {language === "hi" ? "पासवर्ड (Password)" : "Password"}
              </label>
              <input type="password" className="field" placeholder={language === "hi" ? "नया पासवर्ड बनाएँ" : "Create new password"} value={formData.password} onChange={(e) => updateForm("password", e.target.value)} />
            </div>
          </div>
        );
      case 2:
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div style={{ textAlign: "center", marginBottom: "8px" }}>
              <Activity size={48} color="var(--gold)" style={{ margin: "0 auto 16px" }} />
              <h2 className="heading-lg font-devanagari">
                {language === "hi" ? "व्यक्तिगत विवरण" : "Personal Details"}
              </h2>
            </div>
            <div>
              <label className="field-label font-devanagari">
                {language === "hi" ? "लिंग (Gender)" : "Gender"}
              </label>
              <div style={{ display: "flex", gap: "12px" }}>
                {(language === "hi" ? ["पुरुष (Male)", "महिला (Female)"] : ["Male", "Female"]).map((opt) => (
                  <button
                    key={opt}
                    onClick={() => updateForm("gender", opt)}
                    className="font-devanagari"
                    style={{
                      flex: 1, padding: "12px", borderRadius: "var(--r-md)",
                      border: `1px solid ${formData.gender === opt ? "var(--brand)" : "var(--surface-border-md)"}`,
                      background: formData.gender === opt ? "var(--brand-dim)" : "var(--surface-base)",
                      color: formData.gender === opt ? "var(--brand)" : "var(--text-primary)",
                      fontWeight: 500, transition: "all var(--dur-fast)", cursor: "pointer"
                    }}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="field-label font-devanagari">
                {language === "hi" ? "आयु वर्ग (Age Group)" : "Age Group"}
              </label>
              <select className="field" value={formData.ageGroup} onChange={(e) => updateForm("ageGroup", e.target.value)}>
                <option value="">{language === "hi" ? "चुनें..." : "Select..."}</option>
                <option value="under_10">{language === "hi" ? "10 से कम" : "Under 10"}</option>
                <option value="11-20">11 - 20</option>
                <option value="21-30">21 - 30</option>
                <option value="31-45">31 - 45</option>
                <option value="46-60">46 - 60</option>
                <option value="60_plus">{language === "hi" ? "60 से अधिक" : "60+"}</option>
              </select>
            </div>
          </div>
        );
      case 3:
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div style={{ textAlign: "center", marginBottom: "8px" }}>
              <MapPin size={48} color="var(--emerald)" style={{ margin: "0 auto 16px" }} />
              <h2 className="heading-lg font-devanagari">
                {language === "hi" ? "स्थान (Location)" : "Location"}
              </h2>
            </div>
            <div>
              <label className="field-label font-devanagari">
                {language === "hi" ? "शहर (City)" : "City"}
              </label>
              <input type="text" className="field" placeholder={language === "hi" ? "उदा. मुंबई" : "e.g. Mumbai"} value={formData.city} onChange={(e) => updateForm("city", e.target.value)} />
            </div>
          </div>
        );
      case 4:
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div style={{ textAlign: "center", marginBottom: "8px" }}>
              <ShieldCheck size={48} color="var(--brand)" style={{ margin: "0 auto 16px" }} />
              <h2 className="heading-lg font-devanagari">
                {language === "hi" ? "नियम एवं शर्तें" : "Terms & Conditions"}
              </h2>
            </div>
            <div className="card" style={{ padding: "16px", background: "var(--surface-base)", height: "200px", overflowY: "auto", fontSize: "0.8125rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
              <p className="font-devanagari">
                {language === "hi" ? (
                  <>
                    1. मैं संकल्प लेता/लेती हूँ कि इस चातुर्मास अभियान में मैं पूरी ईमानदारी और निष्ठा से भाग लूँगा/लूँगी।<br/><br/>
                    2. मैं प्रतिदिन अपनी आदतों को सत्यनिष्ठा से ट्रैक करूँगा/करूँगी।<br/><br/>
                    3. मेरे द्वारा दी गई सभी जानकारी सत्य है।
                  </>
                ) : (
                  <>
                    1. I resolve that I will participate in this Chaturmas campaign with absolute honesty and commitment.<br/><br/>
                    2. I will track my habits daily with integrity.<br/><br/>
                    3. All information provided by me is accurate and true.
                  </>
                )}
              </p>
            </div>
          </div>
        );
      case 5:
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: "20px", textAlign: "center", padding: "20px 0" }}>
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", damping: 15 }}>
              <CheckCircle2 size={80} color="var(--emerald)" style={{ margin: "0 auto 16px" }} />
            </motion.div>
            <h2 className="heading-lg font-devanagari" style={{ color: "var(--text-primary)" }}>
              {language === "hi" ? "पंजीकरण पूर्ण" : "Registration Complete"}
            </h2>
            <p className="body-md font-devanagari" style={{ color: "var(--text-secondary)" }}>
              {language === "hi"
                ? `स्वागत है, ${formData.fullName || "साधक"} जी! आपकी साधना यात्रा शुरू होने वाली है।`
                : `Welcome, ${formData.fullName || "Sadhak"} Ji! Your spiritual journey is about to begin.`
              }
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  const canProceed = () => {
    switch (step) {
      case 1: {
        const cleanPhone = formData.phone.replace(/\D/g, "");
        return formData.fullName.trim().length >= 2 && cleanPhone.length >= 10 && formData.password.length >= 6;
      }
      case 2: 
        return formData.gender !== "" && formData.ageGroup !== "";
      case 3: 
        return formData.city.trim().length > 1;
      default: 
        return true;
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--surface-bg)", color: "var(--text-primary)", display: "flex", flexDirection: "column" }}>
      {/* ── Top Nav ── */}
      <div style={{ padding: "20px", display: "flex", alignItems: "center", borderBottom: "1px solid var(--surface-border)" }}>
        {step > 1 && step < 5 && (
          <button onClick={handlePrev} className="btn-ghost" style={{ padding: "8px", border: "none", background: "transparent", cursor: "pointer", color: "var(--text-primary)" }}>
            <ChevronLeft size={24} />
          </button>
        )}
        <div className="font-devanagari heading-sm" style={{ flex: 1, textAlign: "center", paddingRight: step > 1 && step < 5 ? "40px" : "0" }}>
          {language === "hi" ? "नया खाता बनाएँ" : "Create New Account"}
        </div>
        <div style={{ position: "absolute", top: "16px", right: "16px" }}>
          <button
            onClick={() => setLanguage(language === "hi" ? "en" : "hi")}
            style={{
              padding: "6px 12px",
              borderRadius: "var(--r-pill)",
              background: "var(--surface-overlay)",
              border: "1px solid var(--surface-border)",
              color: "var(--text-primary)",
              fontWeight: 700,
              fontSize: "0.75rem",
              cursor: "pointer"
            }}
          >
            <Globe size={14} style={{ display: "inline" }} /> {language === "hi" ? "EN" : "हिं"}
          </button>
        </div>
      </div>

      {/* ── Progress Bar ── */}
      {step < 5 && (
        <div style={{ padding: "16px 20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "8px" }} className="font-devanagari">
            <span>{language === "hi" ? "प्रगति" : "Progress"}</span>
            <span>{step} / 4</span>
          </div>
          <div className="progress-track" style={{ background: "var(--surface-overlay)", height: "6px" }}>
            <motion.div
              className="progress-fill"
              style={{ background: "var(--brand)" }}
              initial={{ width: `${((step - 1) / 4) * 100}%` }}
              animate={{ width: `${(step / 4) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      )}

      {/* ── Form Content ── */}
      <div style={{ flex: 1, padding: "24px 20px" }}>
        <div className="card" style={{ padding: "32px 24px", maxWidth: "440px", margin: "0 auto", background: "var(--surface-raised)" }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {getStepContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* ── Bottom Action ── */}
      <div style={{ padding: "20px", borderTop: "1px solid var(--surface-border)", background: "var(--surface-raised)", position: "sticky", bottom: 0 }}>
        <div style={{ maxWidth: "440px", margin: "0 auto" }}>
          {step < 4 ? (
            <button
              onClick={handleNext}
              disabled={!canProceed()}
              className="btn btn-primary"
              style={{ width: "100%", padding: "16px", fontSize: "1rem" }}
            >
              <span className="font-devanagari">
                {language === "hi" ? "आगे बढ़ें (Next)" : "Proceed (Next)"}
              </span>
              <ArrowRight size={18} />
            </button>
          ) : step === 4 ? (
            <button
              onClick={handleNext}
              className="btn btn-primary"
              style={{ width: "100%", padding: "16px", fontSize: "1rem", background: "var(--emerald)", boxShadow: "0 4px 12px rgba(16,185,129,0.3)" }}
            >
              <span className="font-devanagari">
                {language === "hi" ? "मैं सहमत हूँ (I Agree)" : "I Agree"}
              </span>
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="btn btn-primary"
              style={{ width: "100%", padding: "16px", fontSize: "1rem" }}
            >
              <span className="font-devanagari">
                {language === "hi" ? "डैशबोर्ड पर जाएँ (Go to Dashboard)" : "Go to Dashboard"}
              </span>
              <ArrowRight size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
