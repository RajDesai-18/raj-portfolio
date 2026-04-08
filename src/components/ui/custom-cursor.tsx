"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

/* ──────────────────────────────────────────────────────────
   CUSTOM CURSOR

   Default:              18px filled accent dot
   Links / buttons:      28px, 40% opacity
   [data-cursor-label]:  dot morphs into pill (camera + label)
   [data-cursor-hide]:   hides cursor entirely
   ────────────────────────────────────────────────────────── */

const DOT_SIZE = 18;
const DOT_HOVER_SIZE = 28;

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const pillRef = useRef<HTMLDivElement>(null);
  const visible = useRef(false);
  const isLabel = useRef(false);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const dot = dotRef.current;
    const pill = pillRef.current;
    if (!dot || !pill) return;

    const mouse = { x: 0, y: 0 };

    const resetDot = () => {
      gsap.to(dot, {
        width: DOT_SIZE,
        height: DOT_SIZE,
        backgroundColor: "var(--accent-raw)",
        border: "1.5px solid transparent",
        opacity: 1,
        scale: 1,
        duration: 0.25,
        ease: "power2.out",
      });
    };

    const hidePill = () => {
      gsap.to(pill, {
        opacity: 0,
        scale: 0.3,
        duration: 0.2,
        ease: "power2.in",
      });
    };

    /* ── Movement ── */
    const onMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;

      gsap.to(dot, { x: mouse.x, y: mouse.y, duration: 0.12, ease: "power2.out" });
      gsap.to(pill, { x: mouse.x, y: mouse.y, duration: 0.15, ease: "power2.out" });

      if (!visible.current) {
        visible.current = true;
        gsap.to(dot, { opacity: 1, duration: 0.3 });
      }
    };

    /* ── Leave window ── */
    const onMouseLeave = () => {
      visible.current = false;
      gsap.to(dot, { opacity: 0, duration: 0.3 });
      hidePill();
    };

    /* ── Click ── */
    const onMouseDown = () => {
      const target = isLabel.current ? pill : dot;
      gsap.to(target, { scale: 0.85, duration: 0.1, ease: "power2.out" });
    };

    const onMouseUp = () => {
      const target = isLabel.current ? pill : dot;
      gsap.to(target, { scale: 1, duration: 0.1, ease: "power2.out" });
    };

    /* ── Hover IN ── */
    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      if (target.closest("[data-cursor-hide]")) {
        gsap.to(dot, { opacity: 0, duration: 0.15 });
        return;
      }

      const labelEl = target.closest("[data-cursor-label]") as HTMLElement | null;
      if (labelEl) {
        const text = labelEl.getAttribute("data-cursor-label") || "";
        const span = pill.querySelector("[data-label-text]") as HTMLSpanElement;
        if (span) span.textContent = text;
        isLabel.current = true;

        gsap.to(dot, { opacity: 0, scale: 0.3, duration: 0.1, ease: "power2.in" });
        gsap.fromTo(
          pill,
          { opacity: 0, scale: 0.5 },
          { opacity: 1, scale: 1, duration: 0.2, ease: "back.out(1.5)", delay: 0 }
        );
        return;
      }

      if (
        target.closest("a") ||
        target.closest("button") ||
        target.closest("[data-cursor-hover]") ||
        target.closest("[data-cursor-view]")
      ) {
        gsap.to(dot, {
          width: DOT_HOVER_SIZE,
          height: DOT_HOVER_SIZE,
          backgroundColor: "transparent",
          border: "1.5px solid var(--accent-raw)",
          opacity: 1,
          duration: 0.25,
          ease: "power2.out",
        });
      }
    };

    /* ── Hover OUT ── */
    const onMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      if (target.closest("[data-cursor-hide]")) {
        gsap.to(dot, { opacity: 1, duration: 0.15 });
        return;
      }

      if (target.closest("[data-cursor-label]")) {
        isLabel.current = false;
        gsap.to(pill, { opacity: 0, scale: 0.5, duration: 0.1, ease: "power2.in" });
        gsap.to(dot, {
          opacity: 1,
          scale: 1,
          width: DOT_SIZE,
          height: DOT_SIZE,
          duration: 0.15,
          ease: "power2.out",
          delay: 0,
        });
        return;
      }

      if (
        target.closest("a") ||
        target.closest("button") ||
        target.closest("[data-cursor-hover]") ||
        target.closest("[data-cursor-view]")
      ) {
        resetDot();
      }
    };

    document.documentElement.style.cursor = "none";

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseleave", onMouseLeave);
    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("mouseup", onMouseUp);
    document.addEventListener("mouseover", onMouseOver);
    document.addEventListener("mouseout", onMouseOut);

    return () => {
      document.documentElement.style.cursor = "";
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("mouseover", onMouseOver);
      document.removeEventListener("mouseout", onMouseOut);
    };
  }, []);

  return (
    <>
      {/* ── Filled dot ── */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 z-[9998] pointer-events-none"
        style={{
          width: DOT_SIZE,
          height: DOT_SIZE,
          borderRadius: "50%",
          backgroundColor: "var(--accent-raw)",
          opacity: 0,
          transform: "translate(-50%, -50%)",
          willChange: "transform, width, height, opacity",
        }}
      />

      {/* ── Label pill ── */}
      <div
        ref={pillRef}
        className="fixed top-0 left-0 z-[9999] pointer-events-none"
        style={{
          opacity: 0,
          transform: "translate(-50%, -50%) scale(0.3)",
          willChange: "transform, opacity",
        }}
      >
        <div
          className="flex items-center gap-[5px]"
          style={{
            backgroundColor: "var(--accent-raw)",
            borderRadius: 100,
            padding: "5px 12px 5px 9px",
            boxShadow: "0 4px 16px rgba(0, 0, 0, 0.3)",
          }}
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--bg)"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="shrink-0"
          >
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
            <circle cx="12" cy="13" r="4" />
          </svg>
          <span
            data-label-text
            className="font-mono uppercase tracking-[0.06em]"
            style={{
              fontSize: 10,
              fontWeight: 600,
              color: "var(--bg)",
              lineHeight: 1,
            }}
          />
        </div>
      </div>
    </>
  );
}
