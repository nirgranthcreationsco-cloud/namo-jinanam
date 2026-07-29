"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "@/store/authStore";
import { ArrowRight, ChevronLeft, CheckCircle2, User as UserIcon, Phone, MapPin, Activity, ShieldCheck } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    phone: "",
    gender: "",
    ageGroup: "",
    state: "",
    city: "",
    pincode: "",
    temple: "",
    fatherName: "",
    motherName: "",
  });
  const { setUser, setProfile, setStats } = useAuthStore();

  const handleNext = () => setStep((s) => Math.min(s + 1, 7));
  const handlePrev = () => setStep((s) => Math.max(s - 1, 1));

  const updateForm = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = () => {
    // Mock user creation
    setUser({ id: "new-user-1", email: formData.email });
    const genderMap: Record<string, "male" | "female" | "other"> = {
      "पुरुष (Male)": "male",
      "महिला (Female)": "female",
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
      email: formData.email,
      address: `${formData.city}, ${formData.state}`,
      state: formData.state,
      city: formData.city,
      temple_id: "temple_01",
      father_name: formData.fatherName,
      mother_name: formData.motherName,
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
              <h2 className="heading-lg font-devanagari">मूल जानकारी</h2>
              <p className="body-sm font-devanagari" style={{ color: "var(--text-muted)" }}>आपका नाम और संपर्क विवरण</p>
            </div>
            <div>
              <label className="field-label font-devanagari">पूरा नाम (Full Name)</label>
              <input type="text" className="field" placeholder="आपका पूरा नाम" value={formData.fullName} onChange={(e) => updateForm("fullName", e.target.value)} />
            </div>
            <div>
              <label className="field-label font-devanagari">ईमेल (Email ID)</label>
              <input type="email" className="field" placeholder="आपका ईमेल" value={formData.email} onChange={(e) => updateForm("email", e.target.value)} />
            </div>
            <div>
              <label className="field-label font-devanagari">पासवर्ड (Password)</label>
              <input type="password" className="field" placeholder="नया पासवर्ड बनाएँ" value={formData.password} onChange={(e) => updateForm("password", e.target.value)} />
            </div>
          </div>
        );
      case 2:
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div style={{ textAlign: "center", marginBottom: "8px" }}>
              <Activity size={48} color="var(--gold)" style={{ margin: "0 auto 16px" }} />
              <h2 className="heading-lg font-devanagari">व्यक्तिगत विवरण</h2>
            </div>
            <div>
              <label className="field-label font-devanagari">मोबाइल नंबर (Mobile)</label>
              <input type="tel" className="field" placeholder="10 अंकों का नंबर" value={formData.phone} onChange={(e) => updateForm("phone", e.target.value)} maxLength={10} />
            </div>
            <div>
              <label className="field-label font-devanagari">लिंग (Gender)</label>
              <div style={{ display: "flex", gap: "12px" }}>
                {["पुरुष (Male)", "महिला (Female)"].map((opt) => (
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
              <label className="field-label font-devanagari">आयु वर्ग (Age Group)</label>
              <select className="field" value={formData.ageGroup} onChange={(e) => updateForm("ageGroup", e.target.value)}>
                <option value="">चुनें...</option>
                <option value="under_10">10 से कम</option>
                <option value="11-20">11 - 20</option>
                <option value="21-30">21 - 30</option>
                <option value="31-45">31 - 45</option>
                <option value="46-60">46 - 60</option>
                <option value="60_plus">60 से अधिक</option>
              </select>
            </div>
          </div>
        );
      case 3:
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div style={{ textAlign: "center", marginBottom: "8px" }}>
              <MapPin size={48} color="var(--emerald)" style={{ margin: "0 auto 16px" }} />
              <h2 className="heading-lg font-devanagari">स्थान (Location)</h2>
            </div>
            <div>
              <label className="field-label font-devanagari">राज्य (State)</label>
              <input type="text" className="field" placeholder="उदा. महाराष्ट्र" value={formData.state} onChange={(e) => updateForm("state", e.target.value)} />
            </div>
            <div style={{ display: "flex", gap: "12px" }}>
              <div style={{ flex: 2 }}>
                <label className="field-label font-devanagari">शहर (City)</label>
                <input type="text" className="field" placeholder="उदा. मुंबई" value={formData.city} onChange={(e) => updateForm("city", e.target.value)} />
              </div>
              <div style={{ flex: 1 }}>
                <label className="field-label font-devanagari">पिनकोड</label>
                <input type="text" className="field" placeholder="000000" value={formData.pincode} onChange={(e) => updateForm("pincode", e.target.value)} maxLength={6} />
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div style={{ textAlign: "center", marginBottom: "8px" }}>
              <MapPin size={48} color="var(--lotus)" style={{ margin: "0 auto 16px" }} />
              <h2 className="heading-lg font-devanagari">आपका मंदिर</h2>
            </div>
            <div>
              <label className="field-label font-devanagari">नजदीकी जैन मंदिर का नाम</label>
              <input type="text" className="field" placeholder="पूरा नाम लिखें" value={formData.temple} onChange={(e) => updateForm("temple", e.target.value)} />
            </div>
            <p className="font-devanagari" style={{ fontSize: "0.8125rem", color: "var(--text-muted)", textAlign: "center" }}>
              यह हमें आपको आपके स्थानीय समुदाय से जोड़ने में मदद करेगा।
            </p>
          </div>
        );
      case 5:
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div style={{ textAlign: "center", marginBottom: "8px" }}>
              <UserIcon size={48} color="var(--indigo)" style={{ margin: "0 auto 16px" }} />
              <h2 className="heading-lg font-devanagari">पारिवारिक जानकारी</h2>
            </div>
            <div>
              <label className="field-label font-devanagari">पिता का नाम (Father's Name)</label>
              <input type="text" className="field" placeholder="श्री ..." value={formData.fatherName} onChange={(e) => updateForm("fatherName", e.target.value)} />
            </div>
            <div>
              <label className="field-label font-devanagari">माता का नाम (Mother's Name)</label>
              <input type="text" className="field" placeholder="श्रीमती ..." value={formData.motherName} onChange={(e) => updateForm("motherName", e.target.value)} />
            </div>
          </div>
        );
      case 6:
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div style={{ textAlign: "center", marginBottom: "8px" }}>
              <ShieldCheck size={48} color="var(--brand)" style={{ margin: "0 auto 16px" }} />
              <h2 className="heading-lg font-devanagari">नियम एवं शर्तें</h2>
            </div>
            <div className="card" style={{ padding: "16px", background: "var(--surface-base)", height: "200px", overflowY: "auto", fontSize: "0.8125rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
              <p className="font-devanagari">
                1. मैं संकल्प लेता/लेती हूँ कि इस चातुर्मास अभियान में मैं पूरी ईमानदारी और निष्ठा से भाग लूँगा/लूँगी।<br/><br/>
                2. मैं प्रतिदिन अपनी आदतों को सत्यनिष्ठा से ट्रैक करूँगा/करूँगी।<br/><br/>
                3. मेरे द्वारा दी गई सभी जानकारी सत्य है।
              </p>
            </div>
          </div>
        );
      case 7:
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: "20px", textAlign: "center", padding: "20px 0" }}>
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", damping: 15 }}>
              <CheckCircle2 size={80} color="var(--emerald)" style={{ margin: "0 auto 16px" }} />
            </motion.div>
            <h2 className="heading-lg font-devanagari" style={{ color: "var(--text-primary)" }}>पंजीकरण पूर्ण</h2>
            <p className="body-md font-devanagari" style={{ color: "var(--text-secondary)" }}>
              स्वागत है, {formData.fullName || "साधक"} जी!<br />आपकी साधना यात्रा शुरू होने वाली है।
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  const canProceed = () => {
    switch (step) {
      case 1: return formData.fullName.length > 2 && formData.phone.length === 10;
      case 2: return formData.gender !== "" && formData.ageGroup !== "";
      case 3: return formData.state !== "" && formData.city !== "" && formData.pincode.length === 6;
      case 4: return formData.temple !== "";
      case 5: return formData.fatherName !== "" && formData.motherName !== "";
      default: return true;
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--surface-bg)", color: "var(--text-primary)", display: "flex", flexDirection: "column" }}>
      {/* ── Top Nav ── */}
      <div style={{ padding: "20px", display: "flex", alignItems: "center", borderBottom: "1px solid var(--surface-border)" }}>
        {step > 1 && step < 7 && (
          <button onClick={handlePrev} className="btn-ghost" style={{ padding: "8px", border: "none", background: "transparent", cursor: "pointer", color: "var(--text-primary)" }}>
            <ChevronLeft size={24} />
          </button>
        )}
        <div className="font-devanagari heading-sm" style={{ flex: 1, textAlign: "center", paddingRight: step > 1 && step < 7 ? "40px" : "0" }}>
          नया खाता बनाएँ
        </div>
      </div>

      {/* ── Progress Bar ── */}
      {step < 7 && (
        <div style={{ padding: "16px 20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "8px" }} className="font-devanagari">
            <span>प्रगति</span>
            <span>{step} / 6</span>
          </div>
          <div className="progress-track" style={{ background: "var(--surface-overlay)", height: "6px" }}>
            <motion.div
              className="progress-fill"
              style={{ background: "var(--brand)" }}
              initial={{ width: `${((step - 1) / 6) * 100}%` }}
              animate={{ width: `${(step / 6) * 100}%` }}
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
          {step < 6 ? (
            <button
              onClick={handleNext}
              disabled={!canProceed()}
              className="btn btn-primary"
              style={{ width: "100%", padding: "16px", fontSize: "1rem" }}
            >
              <span className="font-devanagari">आगे बढ़ें (Next)</span>
              <ArrowRight size={18} />
            </button>
          ) : step === 6 ? (
            <button
              onClick={handleNext}
              className="btn btn-primary"
              style={{ width: "100%", padding: "16px", fontSize: "1rem", background: "var(--emerald)", boxShadow: "0 4px 12px rgba(16,185,129,0.3)" }}
            >
              <span className="font-devanagari">मैं सहमत हूँ (I Agree)</span>
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="btn btn-primary"
              style={{ width: "100%", padding: "16px", fontSize: "1rem" }}
            >
              <span className="font-devanagari">डैशबोर्ड पर जाएँ (Go to Dashboard)</span>
              <ArrowRight size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
