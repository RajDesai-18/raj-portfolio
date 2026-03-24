import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { SmoothScrollProvider } from "@/components/providers/smooth-scroll-provider";
import { CustomCursor } from "@/components/ui/custom-cursor";
import { MeshGradient } from "@/components/background/mesh-gradient";
import { FloatingThemeToggle } from "@/components/ui/floating-theme-toggle";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "Raj Desai — Software Engineer",
  description:
    "Product-minded fullstack engineer building things that are both useful and enjoyable to use.",
  openGraph: {
    title: "Raj Desai — Software Engineer",
    description:
      "Product-minded fullstack engineer building things that are both useful and enjoyable to use.",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#1F1F1F",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="font-body antialiased">
        <ThemeProvider>
          <SmoothScrollProvider>
            <MeshGradient />
            <CustomCursor />
            <FloatingThemeToggle />
            <main className="relative" style={{ zIndex: 1 }}>
              {children}
            </main>
            <Toaster />
          </SmoothScrollProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}