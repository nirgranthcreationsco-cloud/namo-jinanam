import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "सन्मति - सुनील - संस्कार अभियान",
  description: "संस्कार • संयम • साधना • सफलता — एक प्रीमियम जैन आध्यात्मिक अभ्यास ट्रैकर",
  keywords: ["jain", "chaturmas", "sanskar", "habit tracker", "spiritual", "namo jinanam", "sanmati sunilam"],
  authors: [{ name: "Sanmati Sunilam" }],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    title: "सन्मति-सुनील-संस्कार",
    statusBarStyle: "default",
  },
  openGraph: {
    title: "सन्मति - सुनील - संस्कार अभियान",
    description: "संस्कार • संयम • साधना • सफलता",
    type: "website",
  },
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#4B1D15",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="hi" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Mukta:wght@300;400;500;600;700;800&family=Noto+Sans+Devanagari:wght@300;400;500;600;700;800&family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased" style={{ 
        backgroundColor: "#EFE8DD", 
        height: "100dvh", 
        overflow: "hidden", 
        display: "flex", 
        justifyContent: "center",
        alignItems: "center",
        padding: "12px"
      }}>
        <div style={{
          width: "100%",
          maxWidth: "480px",
          height: "100%",
          maxHeight: "900px",
          backgroundColor: "var(--surface-bg)",
          borderRadius: "32px",
          boxShadow: "0 24px 80px rgba(92, 26, 16, 0.15), 0 0 0 8px rgba(255, 255, 255, 0.6)",
          overflow: "hidden",
          position: "relative",
          display: "flex",
          flexDirection: "column",
          transform: "translateZ(0)"
        }}>
          <div style={{ flex: 1, overflowX: "hidden", overflowY: "auto" }}>
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
