"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

/* ──────────────────────────────────────────────────────────
   SECTION MARQUEE
   Continuous scrolling text band placed between sections.
   Creates visual rhythm and announces upcoming content.
   ────────────────────────────────────────────────────────── */

interface SectionMarqueeProps {
  /** The text to display (e.g., "ABOUT", "WORK") */
  text: string;
  /** Scroll direction — alternate between sections for texture */
  direction?: "left" | "right";
  /** Animation duration in seconds (lower = faster) */
  speed?: number;
  /** Optional className for the outer wrapper */
  className?: string;
}

export function SectionMarquee({
  text,
  direction = "left",
  speed = 20,
  className = "",
}: SectionMarqueeProps) {
  const wrapRef = useRef<HTMLDivElement>(null);

  /* ── Scroll entrance — fade in ── */
  useEffect(() => {
    if (!wrapRef.current) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      gsap.set(wrapRef.current, { opacity: 1 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        wrapRef.current,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.4,
          ease: "none",
          scrollTrigger: {
            trigger: wrapRef.current,
            start: "top 92%",
            end: "top 60%",
            scrub: 0.5,
          },
        }
      );
    }, wrapRef);

    return () => ctx.revert();
  }, []);

  /* ── Build repeated copies for seamless loop ── */
  const copies = 6;

  const renderTrack = (key: number) => (
    <div key={key} className="flex shrink-0 items-center" aria-hidden={key > 0}>
      {Array.from({ length: copies }).map((_, i) => (
        <span key={i} className="flex items-center shrink-0">
          <span
            className="font-display whitespace-nowrap tracking-[-0.04em] uppercase"
            style={{
              fontSize: "clamp(3rem, 8vw, 7.5rem)",
              fontWeight: 400,
              lineHeight: 1,
              color: "var(--text)",
              opacity: i % 2 === 0 ? 0.32 : 0.16,
            }}
          >
            {text}
          </span>
          <span className="shrink-0" style={{ width: "clamp(32px, 4vw, 64px)" }} />
        </span>
      ))}
    </div>
  );

  const animationClass = direction === "left" ? "section-marquee-left" : "section-marquee-right";

  return (
    <div
      ref={wrapRef}
      className={`relative w-full overflow-hidden ${className}`}
      style={{ opacity: 0 }}
      role="presentation"
      aria-hidden="true"
    >
      {/* Top HR */}
      <div className="h-px w-full" style={{ backgroundColor: "var(--border-custom)" }} />

      {/* Marquee band */}
      <div
        className="overflow-hidden"
        style={{
          padding: "clamp(20px, 3vh, 36px) 0",
        }}
      >
        <div
          className={`flex ${animationClass}`}
          style={{ "--marquee-speed": `${speed}s` } as React.CSSProperties}
        >
          {renderTrack(0)}
          {renderTrack(1)}
        </div>
      </div>

      {/* Bottom HR */}
      <div className="h-px w-full" style={{ backgroundColor: "var(--border-custom)" }} />
    </div>
  );
}
