"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, SplitText } from "@/lib/gsap";
import { ScrollIndicator } from "@/components/ui/scroll-indicator";
import { Magnetic } from "@/components/ui/magnetic";
import { LiveClock } from "@/components/ui/live-clock";
import { Github, Linkedin } from "lucide-react";

type HeroPhase = "loading" | "revealing" | "ready";

interface HeroSectionProps {
  skipLoading?: boolean;
  onReady?: () => void;
}

export function HeroSection({ skipLoading = false, onReady }: HeroSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const loadingLabelRef = useRef<HTMLSpanElement>(null);
  const loadingLineRef = useRef<HTMLDivElement>(null);
  const heroContentRef = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<HeroPhase>(skipLoading ? "ready" : "loading");
  const [count, setCount] = useState(0);

  // ── Phase 1: Loading counter + lock scroll ──
  useEffect(() => {
    if (phase !== "loading") return;

    document.body.style.overflow = "hidden";

    const obj = { val: 0 };
    const tl = gsap.timeline({
      onComplete: () => {
        gsap.delayedCall(0.4, () => setPhase("revealing"));
      },
    });

    tl.to(obj, {
      val: 100,
      duration: 6,
      ease: "power4.inOut",
      onUpdate: () => {
        setCount(Math.round(obj.val));
        if (loadingLineRef.current) {
          loadingLineRef.current.style.transform = `scaleX(${obj.val / 100})`;
        }
      },
    });

    return () => {
      tl.kill();
    };
  }, [phase]);

  // ── Phase 2: Reveal — counter exits, hero enters ──
  useEffect(() => {
    if (phase !== "revealing" || !sectionRef.current) return;

    const tl = gsap.timeline({
      onComplete: () => {
        document.body.style.overflow = "";
        sessionStorage.setItem("raj-portfolio-loaded", "true");
        setPhase("ready");
        onReady?.();
      },
    });

    // Counter + label + line exit
    tl.to([counterRef.current, loadingLabelRef.current, loadingLineRef.current], {
      opacity: 0,
      scale: 0.9,
      duration: 0.5,
      ease: "power2.in",
      stagger: 0.05,
    });

    // Hero content enters
    tl.fromTo(
      heroContentRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.3, ease: "power2.out" },
      "-=0.1"
    );

    // Staggered reveal of hero elements
    const allFade = sectionRef.current.querySelectorAll("[data-hero-fade]");
    const allLines = sectionRef.current.querySelectorAll("[data-hero-line]");
    const name1 = sectionRef.current.querySelector("[data-hero-name-1]");
    const name2 = sectionRef.current.querySelector("[data-hero-name-2]");
    const infoBar = sectionRef.current.querySelector("[data-hero-info]");
    const scrollInd = sectionRef.current.querySelector("[data-hero-scroll]");

    // Lines draw
    tl.fromTo(
      allLines,
      { scaleX: 0 },
      { scaleX: 1, duration: 0.7, ease: "power2.inOut", stagger: 0.08 },
      "-=0.1"
    );

    // Fade elements
    tl.fromTo(
      allFade,
      { opacity: 0, y: 8 },
      { opacity: 1, y: 0, duration: 0.5, ease: "power2.out", stagger: 0.03 },
      "-=0.5"
    );

    // RAJ
    const split1 = new SplitText(name1, { type: "chars" });
    tl.fromTo(
      split1.chars,
      { y: "120%", opacity: 0 },
      {
        y: "0%",
        opacity: 1,
        duration: 0.8,
        stagger: 0.04,
        ease: "power3.out",
      },
      "-=0.3"
    );

    // Info bar
    tl.fromTo(
      infoBar,
      { opacity: 0, y: 15 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
      "-=0.5"
    );

    // DESAI
    const split2 = new SplitText(name2, { type: "chars" });
    tl.fromTo(
      split2.chars,
      { y: "120%", opacity: 0 },
      {
        y: "0%",
        opacity: 1,
        duration: 0.8,
        stagger: 0.04,
        ease: "power3.out",
      },
      "-=0.6"
    );

    // Scroll indicator
    tl.fromTo(
      scrollInd,
      { opacity: 0 },
      { opacity: 1, duration: 0.4, ease: "power2.out" },
      "-=0.2"
    );

    return () => {
      tl.kill();
      split1.revert();
      split2.revert();
    };
  }, [phase, onReady]);

  // ── Phase: Skip (returning visit) — show everything instantly ──
  useEffect(() => {
    if (phase !== "ready" || !skipLoading || !sectionRef.current) return;

    const allFade = sectionRef.current.querySelectorAll("[data-hero-fade]");
    const allLines = sectionRef.current.querySelectorAll("[data-hero-line]");
    const name1 = sectionRef.current.querySelector("[data-hero-name-1]");
    const name2 = sectionRef.current.querySelector("[data-hero-name-2]");
    const infoBar = sectionRef.current.querySelector("[data-hero-info]");
    const scrollInd = sectionRef.current.querySelector("[data-hero-scroll]");

    gsap.set(allFade, { opacity: 1, y: 0 });
    gsap.set(allLines, { scaleX: 1, opacity: 1 });
    gsap.set([name1, name2], { opacity: 1 });
    gsap.set(infoBar, { opacity: 1, y: 0 });
    gsap.set(scrollInd, { opacity: 1 });

    if (heroContentRef.current) {
      heroContentRef.current.style.opacity = "1";
    }
  }, [phase, skipLoading]);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative w-full h-screen overflow-hidden"
      style={{ backgroundColor: "transparent" }}
    >
      {/* ── Loading State: Counter ── */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center gap-4 transition-opacity duration-300"
        style={{
          opacity: phase === "loading" ? 1 : 0,
          pointerEvents: phase === "loading" ? "auto" : "none",
          zIndex: phase === "loading" ? 10 : 0,
        }}
      >
        <span
          ref={loadingLabelRef}
          className="font-mono text-[0.75rem] uppercase tracking-[0.15em]"
          style={{ color: "var(--text)" }}
        >
          Raj Desai
        </span>
        <span
          ref={counterRef}
          className="font-mono font-medium tabular-nums uppercase tracking-[0.15em]"
          style={{
            color: "var(--text-muted)",
            fontSize: "0.875rem",
          }}
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
            ref={loadingLineRef}
            className="absolute inset-0 origin-left"
            style={{
              backgroundColor: "var(--accent-raw)",
              transform: "scaleX(0)",
            }}
          />
        </div>
      </div>

      {/* ── Hero Content ── */}
      <div
        ref={heroContentRef}
        className="h-full flex flex-col justify-between px-[64px] pt-[100px] pb-[28px]"
        style={{ opacity: skipLoading ? 1 : 0 }}
      >
        {/* Top: live clock + line */}
        <div>
          <div data-hero-fade className="mb-3 opacity-0">
            <LiveClock />
          </div>
          <div
            data-hero-line
            className="w-full h-px origin-left scale-x-0"
            style={{ backgroundColor: "var(--border-custom)" }}
          />
        </div>

        {/* Center: Name sandwich */}
        <div className="flex flex-col">
          <h1
            data-hero-name-1
            className="hero-name-line font-display font-bold leading-[0.82] tracking-[-0.05em] whitespace-nowrap"
            style={{
              color: "var(--text)",
              fontSize: "clamp(6rem, 20vw, 18rem)",
            }}
          >
            RAJ
          </h1>

          <div
            data-hero-info
            className="flex items-center justify-between py-[14px] my-[2px] opacity-0"
            style={{
              borderTop: "1px solid var(--border-custom)",
              borderBottom: "1px solid var(--border-custom)",
            }}
          >
            <span
              className="font-mono text-[0.8125rem] uppercase tracking-[0.12em]"
              style={{ color: "var(--text-muted)" }}
            >
              Software Engineer · UTD &apos;26
            </span>
            <span className="font-body text-[1.0625rem]" style={{ color: "var(--text-muted)" }}>
              designing &amp; building{" "}
              <span className="font-semibold" style={{ color: "var(--accent-raw)" }}>
                good shit
              </span>{" "}
              since 2023
            </span>
          </div>

          <h1
            data-hero-name-2
            className="hero-name-line font-display font-bold leading-[0.82] tracking-[-0.05em] whitespace-nowrap"
            style={{
              color: "var(--text)",
              fontSize: "clamp(6rem, 20vw, 18rem)",
            }}
          >
            DESAI
          </h1>
        </div>

        {/* Bottom: line + details row */}
        <div>
          <div
            data-hero-line
            className="w-full h-px origin-left scale-x-0 mb-4"
            style={{ backgroundColor: "var(--accent-raw)", opacity: 0.3 }}
          />
          <div className="flex items-end justify-between">
            {/* Left: Social + theme toggle with magnetic pull */}
            <div data-hero-fade className="flex items-center gap-5 opacity-0">
              <Magnetic strength={0.4} radius={60}>
                <a
                  href="https://github.com/RajDesai-18"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cursor-pointer transition-colors duration-300 flex items-center justify-center w-[36px] h-[36px]"
                  style={{ color: "var(--text-muted)" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "var(--accent-raw)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "var(--text-muted)";
                  }}
                  aria-label="GitHub"
                >
                  <Github size={18} />
                </a>
              </Magnetic>
              <Magnetic strength={0.4} radius={60}>
                <a
                  href="https://linkedin.com/in/rajdesai18"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cursor-pointer transition-colors duration-300 flex items-center justify-center w-[36px] h-[36px]"
                  style={{ color: "var(--text-muted)" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "var(--accent-raw)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "var(--text-muted)";
                  }}
                  aria-label="LinkedIn"
                >
                  <Linkedin size={18} />
                </a>
              </Magnetic>
            </div>

            {/* Center: Scroll indicator */}
            <div data-hero-scroll className="opacity-0">
              <ScrollIndicator />
            </div>

            {/* Right: Status */}
            <div data-hero-fade className="flex flex-col items-end gap-1 opacity-0">
              <span
                className="font-mono text-[0.6875rem] uppercase tracking-[0.1em]"
                style={{ color: "var(--accent-raw)" }}
              >
                [ Available for work ]
              </span>
              <span
                className="font-mono text-[0.6875rem] uppercase tracking-[0.1em]"
                style={{ color: "var(--text-muted)" }}
              >
                Dallas, TX · 2026
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
