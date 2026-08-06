"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "@/store/authStore";
import { useLanguageStore } from "@/store/languageStore";
import { ArrowRight, ChevronLeft, CheckCircle2, User as UserIcon, MapPin, Activity, ShieldCheck, Globe } from "lucide-react";
import { signupAction } from "@/app/actions/auth";
import { SignupFormData } from "@/types";

export default function SignupPage() {
  const router = useRouter();
  const { hasSeenOnboarding, user, setUser, setProfile, setStats, _hasHydrated } = useAuthStore();
  const { language, setLanguage } = useLanguageStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState(1);
  const [errorMsg, setErrorMsg] = useState("");
  const [formData, setFormData] = useState({
    fullName: "",
    identifier: "",
    password: "",
    gender: "",
    ageGroup: "",
    city: "",
    guardianName: "",
    guardianPhone: "",
  });

  useEffect(() => {
    setMounted(true);
    if (_hasHydrated) {
      if (!hasSeenOnboarding) {
        router.push("/onboarding");
      }
    }
  }, [hasSeenOnboarding, _hasHydrated, router]);

  if (!mounted || !_hasHydrated) return null;

  const handleNext = () => setStep((s) => Math.min(s + 1, 5));
  const handlePrev = () => setStep((s) => Math.max(s - 1, 1));

  const updateForm = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setErrorMsg("");

    const genderMap: Record<string, "male" | "female" | "other"> = {
      "पुरुष (Male)": "male",
      "महिला (Female)": "female",
      "Male": "male",
      "Female": "female",
    };
    const mappedGender = genderMap[formData.gender] || "other";

    let mappedAgeGroup: "6-12" | "13-23" | "24-40" = "24-40";
    if (formData.ageGroup === "6-12") mappedAgeGroup = "6-12";
    else if (formData.ageGroup === "13-23") mappedAgeGroup = "13-23";
    else if (formData.ageGroup === "24-40") mappedAgeGroup = "24-40";

    const isEmail = formData.identifier.includes("@");
    const cleanPhone = !isEmail ? formData.identifier.replace(/\D/g, "") : "";
    const emailVal = isEmail ? formData.identifier.trim() : "";
    const cleanGuardianPhone = formData.guardianPhone.replace(/\D/g, "");

    const payload: SignupFormData = {
      full_name: formData.fullName,
      guardian_name: formData.guardianName,
      guardian_phone: cleanGuardianPhone || undefined,
      gender: mappedGender,
      age_group: mappedAgeGroup,
      phone: cleanPhone || undefined,
      email: emailVal || undefined,
      password: formData.password || "Password123!",
      city: formData.city,
    };

    const result = await signupAction(payload);
    
    setIsSubmitting(false);

    if (result.success && result.user) {
      setStep(5);
      
      // Update store after Step 5 mounts
      setTimeout(() => {
        if (result.user) {
          setUser({ id: result.user.id, phone: result.user.phone, email: result.user.email });
          setProfile(result.user);
          if (result.stats) {
            setStats(result.stats);
          }
        }
      }, 100);

      setTimeout(() => {
        router.push("/dashboard");
      }, 2500);
    } else {
      setErrorMsg(result.error || "Signup failed");
    }
  };

  const getStepContent = () => {
    const isEmail = formData.identifier.includes("@");
    const cleanPhone = !isEmail ? formData.identifier.replace(/\D/g, "") : "";
    const isPhoneValid = !isEmail && cleanPhone.length === 10;
    const isEmailValid = isEmail && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.identifier.trim());
    const isIdentifierValid = isPhoneValid || isEmailValid;
    const isNameValid = formData.fullName.trim().length >= 2;
    const isPasswordValid = formData.password.length >= 6;
    const isGuardianPhoneValid = formData.guardianPhone.length === 0 || formData.guardianPhone.length === 10;
    const isCityValid = formData.city.trim().length >= 2;

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

            {/* Full Name */}
            <div>
              <label className="field-label font-devanagari">
                {language === "hi" ? "पूरा नाम (Full Name)" : "Full Name"}
              </label>
              <input
                type="text"
                className="field"
                placeholder={language === "hi" ? "आपका पूरा नाम" : "Your full name"}
                value={formData.fullName}
                onChange={(e) => {
                  const cleaned = e.target.value.replace(/[0-9]/g, "");
                  updateForm("fullName", cleaned);
                }}
              />
              {formData.fullName.length > 0 && (
                <div style={{ fontSize: "0.75rem", marginTop: "4px", color: isNameValid ? "#059669" : "#DC2626", fontWeight: 600 }} className="font-devanagari">
                  {isNameValid
                    ? (language === "hi" ? "✓ नाम सही है" : "✓ Valid name")
                    : (language === "hi" ? "✕ नाम कम से कम 2 अक्षरों का होना चाहिए" : "✕ Name must be at least 2 characters")}
                </div>
              )}
            </div>

            {/* Identifier: 10-digit Phone or Email */}
            <div>
              <label className="field-label font-devanagari">
                {language === "hi" ? "मोबाइल नंबर या ईमेल (Mobile Number or Email)" : "Mobile Number or Email"}
              </label>
              <input
                type="text"
                className="field"
                placeholder={language === "hi" ? "10 अंकों का मोबाइल नंबर या ईमेल" : "Enter 10-digit mobile or email"}
                value={formData.identifier}
                onChange={(e) => {
                  const val = e.target.value;
                  if (!val.includes("@")) {
                    // Smart phone formatting: keep only digits and cap at 10
                    const digits = val.replace(/\D/g, "").slice(0, 10);
                    updateForm("identifier", digits);
                  } else {
                    updateForm("identifier", val);
                  }
                }}
              />
              {/* Helper/Validation Text */}
              {formData.identifier.length > 0 && (
                <div style={{ fontSize: "0.75rem", marginTop: "4px", color: isIdentifierValid ? "#059669" : "#DC2626", fontWeight: 600 }} className="font-devanagari">
                  {!isEmail ? (
                    cleanPhone.length === 10
                      ? (language === "hi" ? "✓ 10 अंकों का मोबाइल नंबर सही है" : "✓ Valid 10-digit mobile number")
                      : (language === "hi" ? `✕ मोबाइल नंबर 10 अंकों का होना चाहिए (अभी ${cleanPhone.length}/10 अंक हैं)` : `✕ Mobile number must be 10 digits (currently ${cleanPhone.length}/10)`)
                  ) : (
                    isEmailValid
                      ? (language === "hi" ? "✓ ईमेल सही है" : "✓ Valid email address")
                      : (language === "hi" ? "✕ कृपया सही ईमेल पता दर्ज करें (उदा. user@domain.com)" : "✕ Please enter a valid email address")
                  )}
                </div>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="field-label font-devanagari">
                {language === "hi" ? "पासवर्ड (Password)" : "Password"}
              </label>
              <input
                type="password"
                className="field"
                placeholder={language === "hi" ? "कम से कम 6 अक्षरों का पासवर्ड" : "Create password (min 6 chars)"}
                value={formData.password}
                onChange={(e) => updateForm("password", e.target.value)}
              />
              {formData.password.length > 0 && (
                <div style={{ fontSize: "0.75rem", marginTop: "4px", color: isPasswordValid ? "#059669" : "#DC2626", fontWeight: 600 }} className="font-devanagari">
                  {isPasswordValid
                    ? (language === "hi" ? "✓ पासवर्ड सुरक्षित है" : "✓ Valid password")
                    : (language === "hi" ? `✕ पासवर्ड कम से कम 6 अक्षरों का होना चाहिए (अभी ${formData.password.length}/6 हैं)` : `✕ Password must be at least 6 characters (currently ${formData.password.length}/6)`)}
                </div>
              )}
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
                <option value="6-12">6 - 12</option>
                <option value="13-23">13 - 23</option>
                <option value="24-40">24 - 40</option>
              </select>
            </div>
            <div>
              <label className="field-label font-devanagari">
                {language === "hi" ? "अभिभावक का नाम (Guardian's Name)" : "Guardian's Name"}
              </label>
              <input
                type="text"
                className="field"
                placeholder={language === "hi" ? "अभिभावक का नाम (ऐच्छिक)" : "Guardian's name (optional)"}
                value={formData.guardianName}
                onChange={(e) => {
                  const cleaned = e.target.value.replace(/[0-9]/g, "");
                  updateForm("guardianName", cleaned);
                }}
              />
            </div>
            <div>
              <label className="field-label font-devanagari">
                {language === "hi" ? "अभिभावक का मोबाइल नंबर (Guardian's Phone)" : "Guardian's Phone"}
              </label>
              <input
                type="tel"
                className="field"
                placeholder={language === "hi" ? "10 अंकों का मोबाइल नंबर (ऐच्छिक)" : "10-digit phone number (optional)"}
                value={formData.guardianPhone}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, "").slice(0, 10);
                  updateForm("guardianPhone", val);
                }}
              />
              {formData.guardianPhone.length > 0 && (
                <div style={{ fontSize: "0.75rem", marginTop: "4px", color: isGuardianPhoneValid ? "#059669" : "#DC2626", fontWeight: 600 }} className="font-devanagari">
                  {isGuardianPhoneValid
                    ? (language === "hi" ? "✓ 10 अंकों का मोबाइल नंबर" : "✓ Valid 10-digit phone")
                    : (language === "hi" ? `✕ अभिभावक का मोबाइल नंबर 10 अंकों का होना चाहिए (अभी ${formData.guardianPhone.length}/10 अंक हैं)` : `✕ Guardian phone must be 10 digits (currently ${formData.guardianPhone.length}/10)`)}
                </div>
              )}
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
              <input
                type="text"
                className="field"
                placeholder={language === "hi" ? "उदा. मुंबई" : "e.g. Mumbai"}
                value={formData.city}
                onChange={(e) => updateForm("city", e.target.value)}
              />
              {formData.city.length > 0 && (
                <div style={{ fontSize: "0.75rem", marginTop: "4px", color: isCityValid ? "#059669" : "#DC2626", fontWeight: 600 }} className="font-devanagari">
                  {isCityValid
                    ? (language === "hi" ? "✓ शहर दर्ज हुआ" : "✓ City entered")
                    : (language === "hi" ? "✕ शहर का नाम दर्ज करें" : "✕ Please enter city name")}
                </div>
              )}
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
            
            <div style={{ width: "100%", borderRadius: "16px", overflow: "hidden", marginBottom: "2px", boxShadow: "0 10px 25px rgba(0,0,0,0.05)", border: "1px solid var(--surface-border)" }}>
               <img src="/punya-rising.png" alt="Spiritual Growth" style={{ width: "100%", height: "180px", objectFit: "cover", display: "block" }} />
            </div>
            <div style={{ textAlign: "center", fontSize: "0.75rem", color: "var(--brand)", fontWeight: 600, fontStyle: "italic", marginBottom: "8px" }} className="font-devanagari">
              {language === "hi" ? "✨ साधना से आत्म-कल्याण और पुण्य का संचय ✨" : "✨ Spiritual growth & Punya rising through self-discipline ✨"}
            </div>

            <div className="card" style={{ padding: "18px", background: "var(--surface-base)", border: "1px solid var(--surface-border)", borderRadius: "14px", height: "140px", overflowY: "auto", fontSize: "0.8125rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
              <p className="font-devanagari">
                {language === "hi" ? (
                  <>
                    1. मैं संकल्प लेता/लेती हूँ कि इस चातुर्मास अभियान में मैं पूरी ईमानदारी और निष्ठा से भाग लूँगा/लूँगी।<br/><br/>
                    2. मैं प्रतिदिन अपनी आदतों को सत्यनिष्ठा से ट्रैक करूँगा/करूँगी।<br/><br/>
                    3. मुझे ज्ञात है कि एक बार दैनिक नियम सबमिट करने के बाद, वे उस दिन के लिए लॉक हो जाएंगे और उन्हें बदला नहीं जा सकेगा।<br/><br/>
                    4. मेरे द्वारा दी गई सभी जानकारी सत्य है।
                  </>
                ) : (
                  <>
                    1. I resolve that I will participate in this Chaturmas campaign with absolute honesty and commitment.<br/><br/>
                    2. I will track my habits daily with integrity.<br/><br/>
                    3. I understand that once daily niyams are submitted, they are permanently locked for the day and cannot be modified.<br/><br/>
                    4. All information provided by me is accurate and true.
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
        const isEmail = formData.identifier.includes("@");
        const cleanPhone = !isEmail ? formData.identifier.replace(/\D/g, "") : "";
        const isPhoneValid = !isEmail && cleanPhone.length === 10;
        const isEmailValid = isEmail && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.identifier.trim());
        const isIdentifierValid = isPhoneValid || isEmailValid;
        const isNameValid = formData.fullName.trim().length >= 2;
        const isPasswordValid = formData.password.length >= 6;

        return isNameValid && isIdentifierValid && isPasswordValid;
      }
      case 2: {
        const isGuardianPhoneValid = formData.guardianPhone.length === 0 || formData.guardianPhone.length === 10;
        return formData.gender !== "" && formData.ageGroup !== "" && isGuardianPhoneValid;
      }
      case 3: 
        return formData.city.trim().length >= 2;
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
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="btn btn-primary"
              style={{ width: "100%", padding: "16px", fontSize: "1rem", background: "var(--emerald)", boxShadow: "0 4px 12px rgba(16,185,129,0.3)" }}
            >
              <span className="font-devanagari">
                {isSubmitting ? (language === "hi" ? "कृपया प्रतीक्षा करें..." : "Please wait...") : (language === "hi" ? "मैं सहमत हूँ (I Agree)" : "I Agree")}
              </span>
              {!isSubmitting && <ArrowRight size={18} />}
            </button>
          ) : (
            <button
              onClick={() => router.push("/dashboard")}
              className="btn btn-primary"
              style={{ width: "100%", padding: "16px", fontSize: "1rem" }}
            >
              <span className="font-devanagari">
                {language === "hi" ? "डैशबोर्ड पर जाएँ (Go to Dashboard)" : "Go to Dashboard"}
              </span>
              <ArrowRight size={18} />
            </button>
          )}
          {errorMsg && (
            <div style={{ color: "var(--danger)", marginTop: "12px", textAlign: "center", fontSize: "0.875rem" }}>
              {errorMsg}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
