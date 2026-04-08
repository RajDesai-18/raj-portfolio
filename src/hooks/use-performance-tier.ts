/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";

export type PerformanceTier = "high" | "low";

/**
 * Detects device performance capability.
 *
 * LOW triggers on:
 * - hardwareConcurrency <= 4 (low core count)
 * - deviceMemory <= 4 (low RAM, Chrome-only API)
 * - Mobile devices (pointer: coarse)
 * - WebGL not available or software renderer
 *
 * Conservative: only used to disable WebGL mesh gradient.
 * Everything else (Lenis, GSAP, animations) stays enabled.
 */
export function usePerformanceTier(): PerformanceTier {
  const [tier, setTier] = useState<PerformanceTier>("high");

  useEffect(() => {
    function detect(): PerformanceTier {
      // Check hardware concurrency
      const cores = navigator.hardwareConcurrency ?? 8;
      if (cores <= 4) return "low";

      // Check device memory (Chrome/Edge only)
      const mem = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
      if (mem !== undefined && mem <= 4) return "low";

      // Check for software WebGL renderer (integrated/low-end GPU)
      try {
        const canvas = document.createElement("canvas");
        const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
        if (!gl) return "low";

        const debugInfo = (gl as WebGLRenderingContext).getExtension("WEBGL_debug_renderer_info");
        if (debugInfo) {
          const renderer = (gl as WebGLRenderingContext).getParameter(
            debugInfo.UNMASKED_RENDERER_WEBGL
          );
          const rendererStr = (renderer as string).toLowerCase();
          // Software renderers or known low-end
          if (
            rendererStr.includes("swiftshader") ||
            rendererStr.includes("llvmpipe") ||
            rendererStr.includes("software")
          ) {
            return "low";
          }
        }
      } catch {
        return "low";
      }

      return "high";
    }

    setTier(detect());
  }, []);

  return tier;
}
