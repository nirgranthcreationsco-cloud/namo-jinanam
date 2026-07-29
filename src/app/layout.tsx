import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "णमो जिणाणं — जैन चातुर्मास संस्कार अभियान",
  description: "संस्कार • संयम • साधना • सफलता — एक प्रीमियम जैन आध्यात्मिक अभ्यास ट्रैकर",
  keywords: ["jain", "chaturmas", "sanskar", "habit tracker", "spiritual", "namo jinanam"],
  authors: [{ name: "Namo Jinanam" }],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    title: "णमो जिणाणं",
    statusBarStyle: "default",
  },
  openGraph: {
    title: "णमो जिणाणं — जैन चातुर्मास संस्कार अभियान",
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
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
