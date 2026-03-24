"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

interface GhostTextProps {
  text: string;
  speed?: number;
  align?: "left" | "right" | "center";
  offsetY?: string;
}

export function GhostText({ text, speed = 0.5, align = "left", offsetY = "15%" }: GhostTextProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const el = ref.current;
    const parent = el.closest("section") || el.parentElement;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      gsap.set(el, { opacity: 0.14 });
      return;
    }

    const ctx = gsap.context(() => {
      // ── Scroll parallax ──
      gsap.fromTo(
        el,
        { y: 150 * speed },
        {
          y: -150 * speed,
          ease: "none",
          scrollTrigger: {
            trigger: parent,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        }
      );

      // ── Opacity breathe on scroll ──
      gsap.fromTo(
        el,
        { opacity: 0.12 },
        {
          opacity: 0.16,
          ease: "none",
          scrollTrigger: {
            trigger: parent,
            start: "top bottom",
            end: "center center",
            scrub: true,
          },
        }
      );

      gsap.fromTo(
        el,
        { opacity: 0.16 },
        {
          opacity: 0.12,
          ease: "none",
          scrollTrigger: {
            trigger: parent,
            start: "center center",
            end: "bottom top",
            scrub: true,
          },
        }
      );
    }, el);

    return () => ctx.revert();
  }, [speed]);

  const alignClass =
    align === "right"
      ? "right-[64px] text-right"
      : align === "center"
        ? "left-1/2 -translate-x-1/2 text-center"
        : "left-[64px] text-left";

  return (
    <div
      ref={ref}
      className={`absolute ${alignClass} pointer-events-none select-none whitespace-nowrap`}
      style={{
        top: offsetY,
        color: "var(--text)",
        opacity: 0.18,
        fontSize: "clamp(8rem, 20vw, 18rem)",
        fontFamily: "var(--font-display)",
        fontWeight: 700,
        letterSpacing: "-0.05em",
        lineHeight: 0.85,
        zIndex: 0,
      }}
      aria-hidden="true"
    >
      {text}
    </div>
  );
}
