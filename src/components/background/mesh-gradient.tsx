"use client";

import { MeshGradient as MeshGradientShader } from "@paper-design/shaders-react";
import { useTheme } from "@/components/providers/theme-provider";
import { usePerformanceTier } from "@/hooks/use-performance-tier";

/* ──────────────────────────────────────────────────────────
   Monochrome mesh gradient
   Dark:  #0D0D0D (5%) → #352F28 (20%) — 15% lightness spread
   Light: #F2E7DC (91%) → #A89880 (63%) — 28% lightness spread
   Both warm-neutral, no accent color in the gradient.
   ────────────────────────────────────────────────────────── */

const DARK_COLORS = ["#0D0D0D", "#2C2620", "#181614", "#352F28"];
const LIGHT_COLORS = ["#F2E7DC", "#BFAD96", "#DDD0C0", "#A89880"];

function CSSGradientFallback({ theme }: { theme: string }) {
  const isDark = theme === "dark";

  return (
    <div
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0, opacity: 0.5 }}
      aria-hidden="true"
    >
      <div
        className="absolute"
        style={{
          width: "60vw",
          height: "60vw",
          maxWidth: "600px",
          maxHeight: "600px",
          borderRadius: "50%",
          background: `radial-gradient(circle, ${isDark ? "rgba(53,47,40,0.35)" : "rgba(168,152,128,0.35)"} 0%, transparent 70%)`,
          filter: "blur(80px)",
          top: "30%",
          right: "-10%",
          animation: "css-orb-drift-1 25s ease-in-out infinite alternate",
        }}
      />
      <div
        className="absolute"
        style={{
          width: "50vw",
          height: "50vw",
          maxWidth: "500px",
          maxHeight: "500px",
          borderRadius: "50%",
          background: `radial-gradient(circle, ${isDark ? "rgba(44,38,32,0.35)" : "rgba(191,173,150,0.35)"} 0%, transparent 70%)`,
          filter: "blur(80px)",
          bottom: "10%",
          left: "-5%",
          animation: "css-orb-drift-2 30s ease-in-out infinite alternate",
        }}
      />
    </div>
  );
}

export function MeshGradient() {
  const { theme } = useTheme();
  const tier = usePerformanceTier();
  const colors = theme === "dark" ? DARK_COLORS : LIGHT_COLORS;

  if (tier === "low") {
    return <CSSGradientFallback theme={theme} />;
  }

  return (
    <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }} aria-hidden="true">
      <MeshGradientShader
        width="100%"
        height="100%"
        colors={colors}
        speed={0.25}
        distortion={0.45}
        swirl={0.03}
        grainMixer={0.02}
        grainOverlay={0.04}
        style={{ opacity: 0.65 }}
      />
    </div>
  );
}
