"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";

interface LoadingScreenProps {
  onComplete: () => void;
}

export function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const screenRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const [count, setCount] = useState(0);

  useEffect(() => {
    /* ── Block ALL scroll: wheel + touch + keyboard ── */
    const html = document.documentElement;
    const body = document.body;
    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    const blockWheel = (e: Event) => e.preventDefault();
    const blockTouch = (e: Event) => e.preventDefault();
    document.addEventListener("wheel", blockWheel, { passive: false });
    document.addEventListener("touchmove", blockTouch, { passive: false });

    const unlock = () => {
      html.style.overflow = "";
      body.style.overflow = "";
      document.removeEventListener("wheel", blockWheel);
      document.removeEventListener("touchmove", blockTouch);
      window.scrollTo(0, 0);
    };

    const obj = { val: 0 };

    const tl = gsap.timeline({
      onComplete: () => {
        /* Fade out loading elements */
        gsap.to([labelRef.current, counterRef.current, lineRef.current?.parentElement], {
          opacity: 0,
          scale: 0.9,
          duration: 0.5,
          ease: "power2.in",
          stagger: 0.05,
          onComplete: () => {
            unlock();
            sessionStorage.setItem("raj-portfolio-loaded", "true");
            onComplete();
          },
        });
      },
    });

    tl.to(obj, {
      val: 100,
      duration: 4,
      ease: "power4.inOut",
      onUpdate: () => {
        const rounded = Math.round(obj.val);
        setCount(rounded);
        if (lineRef.current) {
          lineRef.current.style.transform = `scaleX(${obj.val / 100})`;
        }
      },
    });

    return () => {
      tl.kill();
      unlock();
    };
  }, [onComplete]);

  return (
    <div
      ref={screenRef}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center gap-4"
      style={{ backgroundColor: "var(--bg)" }}
    >
      <span
        ref={labelRef}
        className="font-mono text-[0.75rem] uppercase tracking-[0.15em]"
        style={{ color: "var(--text)" }}
      >
        Raj Desai
      </span>
      <span
        ref={counterRef}
        className="font-mono font-medium tabular-nums uppercase tracking-[0.15em]"
        style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}
      >
        [ {String(count).padStart(3, "0")} ]
      </span>
      <div
        className="relative overflow-hidden"
        style={{
          width: "120px",
          height: "1px",
          backgroundColor: "var(--border-custom)",
        }}
      >
        <div
          ref={lineRef}
          className="absolute inset-0 origin-left"
          style={{
            backgroundColor: "var(--accent-raw)",
            transform: "scaleX(0)",
          }}
        />
      </div>
    </div>
  );
}
