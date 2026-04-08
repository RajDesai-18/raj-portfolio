import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { SmoothScrollProvider } from "@/components/providers/smooth-scroll-provider";
import { CustomCursor } from "@/components/ui/custom-cursor";
import { MeshGradient } from "@/components/background/mesh-gradient";
import { FloatingThemeToggle } from "@/components/ui/floating-theme-toggle";
import { Toaster } from "@/components/ui/sonner";
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';


export const metadata: Metadata = {
  title: "Raj Desai — Fullstack Software Engineer",
  description:
    "Product-minded fullstack engineer building things that are both useful and enjoyable to use. MS CS at UT Dallas, open to full-time roles July 2026.",
  metadataBase: new URL("https://rajdesai.io"),
  keywords: [
    "Raj Desai",
    "software engineer",
    "fullstack developer",
    "portfolio",
    "React",
    "Next.js",
    "TypeScript",
    "UT Dallas",
  ],
  authors: [{ name: "Raj Desai" }],
  creator: "Raj Desai",
  openGraph: {
    title: "Raj Desai — Fullstack Software Engineer",
    description:
      "Product-minded fullstack engineer building things that are both useful and enjoyable to use.",
    url: "https://rajdesai.dev",
    siteName: "Raj Desai",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Raj Desai — Fullstack Software Engineer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Raj Desai — Fullstack Software Engineer",
    description:
      "Product-minded fullstack engineer building things that are both useful and enjoyable to use.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0D0D0D",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        {/* Favicon */}
        <link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <meta name="apple-mobile-web-app-title" content="Raj Desai" />
        <link rel="manifest" href="/site.webmanifest" />

        {/* Critical font preloads */}
        <link
          rel="preload"
          href="/fonts/ClashDisplay-Bold.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/Satoshi-Medium.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/AzeretMono-Regular.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />

        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Raj Desai",
              url: "https://rajdesai.io",
              jobTitle: "Fullstack Software Engineer",
              description:
                "Product-minded fullstack engineer building things that are both useful and enjoyable to use.",
              alumniOf: [
                {
                  "@type": "CollegeOrUniversity",
                  name: "University of Texas at Dallas",
                },
                {
                  "@type": "CollegeOrUniversity",
                  name: "University of Mumbai",
                },
              ],
              sameAs: ["https://github.com/RajDesai-18", "https://linkedin.com/in/rajdesai18"],
            }),
          }}
        />
      </head>
      <body className="font-body antialiased">
        <ThemeProvider>
          <SmoothScrollProvider>
            {/* Skip-to-content — visible only on keyboard focus */}
            <a href="#main-content" className="skip-to-content">
              Skip to content
            </a>
            <MeshGradient />
            <CustomCursor />
            <FloatingThemeToggle />
            <main id="main-content" className="relative" style={{ zIndex: 1 }}>
              {children}
            </main>
            <Toaster />
          </SmoothScrollProvider>
        </ThemeProvider>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
