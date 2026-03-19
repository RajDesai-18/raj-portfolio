"use client";

import { MeshGradient as MeshGradientShader } from "@paper-design/shaders-react";
import { useTheme } from "@/components/providers/theme-provider";

const DARK_COLORS = ["#2a2a2a", "#7faf9b", "#1f1f1f", "#3a3530"];

const LIGHT_COLORS = ["#e8d8c3", "#e4572e", "#d4c4af", "#c9b99a"];

export function MeshGradient() {
  const { theme } = useTheme();
  const colors = theme === "dark" ? DARK_COLORS : LIGHT_COLORS;

  return (
    <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }} aria-hidden="true">
      <MeshGradientShader
        width="100%"
        height="100%"
        colors={colors}
        speed={0.8}
        distortion={0.4}
        swirl={0.05}
        grainMixer={0}
        grainOverlay={0.03}
        style={{ opacity: 0.6 }}
      />
    </div>
  );
}
