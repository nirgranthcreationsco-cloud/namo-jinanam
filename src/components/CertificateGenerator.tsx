"use client";

import React, { useRef } from "react";
import html2canvas from "html2canvas";

interface CertificateGeneratorProps {
  userName: string;
  onDownloaded?: () => void;
}

export function CertificateGenerator({ userName, onDownloaded }: CertificateGeneratorProps) {
  const certRef = useRef<HTMLDivElement>(null);

  const downloadCertificate = async () => {
    if (!certRef.current) return;

    try {
      const canvas = await html2canvas(certRef.current, {
        scale: 3, // High resolution
        useCORS: true,
        backgroundColor: "#ffffff",
      });

      const image = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = image;
      link.download = `Sanmati_Certificate_${userName.replace(/\s+/g, "_")}.png`;
      link.click();

      if (onDownloaded) onDownloaded();
    } catch (error) {
      console.error("Error generating certificate", error);
    }
  };

  // Expose the download method globally or via ref. 
  if (typeof window !== "undefined") {
    (window as any).downloadSanmatiCertificate = downloadCertificate;
  }

  return (
    <div
      style={{
        position: "absolute",
        top: "-9999px",
        left: "-9999px",
        zIndex: -9999,
        pointerEvents: "none"
      }}
    >
      <div
        ref={certRef}
        style={{
          width: "900px",
          height: "640px",
          background: "linear-gradient(135deg, #FFFAF0 0%, #FFF5E1 100%)",
          padding: "24px",
          fontFamily: "'Inter', sans-serif",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            border: "10px solid #D4AF37",
            padding: "40px",
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-between",
            position: "relative",
            background: "#fff",
            boxShadow: "inset 0 0 40px rgba(212, 175, 55, 0.15)",
          }}
        >
          {/* Top Logo / Branding */}
          <div style={{ textAlign: "center" }}>
            <h1 style={{ margin: 0, color: "#C85010", fontSize: "2.8rem", fontWeight: 800 }}>
              सन्मति सुनीलम् संस्कार अभियान
            </h1>
            <p style={{ margin: "5px 0 0", color: "#D4AF37", fontSize: "1.2rem", fontWeight: 700, letterSpacing: "3px" }}>
              JAIN CHATURMAS SANSKAR ABHIYAN
            </p>
          </div>

          {/* Body */}
          <div style={{ textAlign: "center", margin: "20px 0" }}>
            <h2 style={{ fontSize: "3.5rem", margin: "0 0 20px", color: "#251710", fontStyle: "italic", fontFamily: "serif" }}>
              Certificate of Completion
            </h2>
            <p style={{ fontSize: "1.3rem", color: "#555", margin: "0 0 16px", textTransform: "uppercase", letterSpacing: "2px" }}>
              This is to proudly certify that
            </p>
            <h3 style={{ fontSize: "3.2rem", margin: "0 0 20px", color: "#C85010", borderBottom: "3px solid #D4AF37", paddingBottom: "10px", display: "inline-block", minWidth: "500px", fontFamily: "serif" }}>
              {userName}
            </h3>
            <p style={{ fontSize: "1.25rem", color: "#444", maxWidth: "650px", lineHeight: "1.6", margin: "20px auto 0" }}>
              has successfully participated in the Sanmati Sunilam Sanskar Abhiyan with absolute honesty, tracking their daily Niyams and committing to spiritual growth and the accumulation of Punya.
            </p>
          </div>

          {/* Footer / Signature */}
          <div style={{ display: "flex", justifyContent: "space-between", width: "100%", marginTop: "30px", padding: "0 40px", boxSizing: "border-box" }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ width: "180px", borderBottom: "2px solid #251710", marginBottom: "10px" }}></div>
              <p style={{ margin: 0, fontSize: "1.1rem", color: "#251710", fontWeight: 600 }}>Date</p>
              <p style={{ margin: 0, fontSize: "1rem", color: "#555" }}>{new Date().toLocaleDateString('en-IN')}</p>
            </div>
            
            <div style={{ textAlign: "center" }}>
              <div style={{ width: "240px", borderBottom: "2px solid #251710", marginBottom: "10px" }}>
                <span style={{ fontSize: "1.8rem", fontFamily: "cursive", color: "#C85010" }}>Nirgranth Creations</span>
              </div>
              <p style={{ margin: 0, fontSize: "1.1rem", color: "#251710", fontWeight: 600 }}>Created by</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
