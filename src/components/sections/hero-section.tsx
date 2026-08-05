/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useRef, useState, Fragment } from "react";
import Image from "next/image";
import { gsap, SplitText } from "@/lib/gsap";
import { ScrollIndicator } from "@/components/ui/scroll-indicator";
import { LiveClock } from "@/components/ui/live-clock";
import { useTheme } from "@/components/providers/theme-provider";
import { Sun, Moon } from "lucide-react";

type HeroPhase = "waiting" | "revealing" | "ready";

interface HeroSectionProps {
  revealed?: boolean;
  skipReveal?: boolean;
  onReady?: () => void;
}

const MARQUEE_ITEMS = ["DESIGN", "BUILD", "AUTOMATE", "SHIP", "SCALE", "REFINE"];

const PAGE_LINKS = [
  { label: "Skills", href: "#skills" },
  { label: "Work", href: "#work" },
  { label: "Experience", href: "#experience" },
  { label: "Contact", href: "#contact" },
  { label: "Resume", href: "/RajDesai_Resume.pdf", external: true },
];

const FOOTER_LINKS = [
  { label: "GitHub", href: "https://github.com/RajDesai-18" },
  { label: "LinkedIn", href: "https://linkedin.com/in/rajdesai18" },
];

const RULE = "1px solid var(--rule-hairline)";

export function HeroSection({ revealed = false, skipReveal = false, onReady }: HeroSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<HeroPhase>(skipReveal ? "ready" : "waiting");
  const { theme, toggleTheme } = useTheme();

  // ── Trigger reveal when LoadingScreen completes ──
  useEffect(() => {
    if (revealed && phase === "waiting") {
      setPhase("revealing");
    }
  }, [revealed, phase]);

  // ── Reveal ──
  useEffect(() => {
    if (phase !== "revealing" || !sectionRef.current) return;

    const tl = gsap.timeline({
      onComplete: () => {
        setPhase("ready");
        onReady?.();
      },
    });

    tl.fromTo(contentRef.current, { opacity: 0 }, { opacity: 1, duration: 0.3, ease: "power2.out" }, 0);

    const allFade = sectionRef.current.querySelectorAll("[data-hero-fade]");
    const allLines = sectionRef.current.querySelectorAll("[data-hero-line]");
    const nameEl = sectionRef.current.querySelector("[data-hero-name]");
    const marqueeEl = sectionRef.current.querySelectorAll("[data-hero-marquee]");
    const infoBar = sectionRef.current.querySelectorAll("[data-hero-info]");
    const scrollInd = sectionRef.current.querySelector("[data-hero-scroll]");

    tl.fromTo(allLines, { scaleX: 0 }, { scaleX: 1, duration: 0.7, ease: "power3.out", stagger: 0.1 }, "-=0.1");

    tl.fromTo(
      allFade,
      { opacity: 0, y: 6 },
      { opacity: 1, y: 0, duration: 0.5, ease: "power3.out", stagger: 0.03 },
      "-=0.5"
    );

    const splits: InstanceType<typeof SplitText>[] = [];
    if (nameEl) {
      const split = new SplitText(nameEl, { type: "chars,words" });
      splits.push(split);
      tl.fromTo(
        split.chars,
        { y: "120%", opacity: 0 },
        { y: "0%", opacity: 1, duration: 0.6, stagger: 0.025, ease: "power3.out" },
        "-=0.3"
      );
    }

    if (marqueeEl.length > 0) {
      tl.fromTo(marqueeEl, { opacity: 0 }, { opacity: 1, duration: 0.5, ease: "power3.out" }, "-=0.4");
    }

    tl.fromTo(infoBar, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" }, "-=0.4");

    if (scrollInd) {
      tl.fromTo(scrollInd, { opacity: 0 }, { opacity: 1, duration: 0.4, ease: "power2.out" }, "-=0.2");
    }

    return () => {
      tl.kill();
      splits.forEach((s) => s.revert());
    };
  }, [phase, onReady]);

  // ── Skip phase (returning visitor) ──
  useEffect(() => {
    if (phase !== "ready" || !skipReveal || !sectionRef.current) return;
    const root = sectionRef.current;
    gsap.set(root.querySelectorAll("[data-hero-fade]"), { opacity: 1, y: 0 });
    gsap.set(root.querySelectorAll("[data-hero-line]"), { scaleX: 1, opacity: 1 });
    gsap.set(root.querySelectorAll("[data-hero-name]"), { opacity: 1 });
    gsap.set(root.querySelectorAll("[data-hero-marquee]"), { opacity: 1 });
    gsap.set(root.querySelectorAll("[data-hero-info]"), { opacity: 1, y: 0 });
    const scrollInd = root.querySelector("[data-hero-scroll]");
    if (scrollInd) gsap.set(scrollInd, { opacity: 1 });
    if (contentRef.current) contentRef.current.style.opacity = "1";
  }, [phase, skipReveal]);

  // ── Ticker ──
  const marqueeItems = Array.from({ length: 4 }, () => MARQUEE_ITEMS).flat();

  const renderMarqueeStrip = (copyIndex: number) => (
    <div key={copyIndex} className="flex items-center shrink-0" aria-hidden={copyIndex === 1}>
      {marqueeItems.map((item, i) => (
        <Fragment key={`${copyIndex}-${i}`}>
          <span
            className="font-mono uppercase whitespace-nowrap px-3 lg:px-[22px]"
            style={{
              fontSize: "var(--text-label)",
              letterSpacing: "0.2em",
              color: "var(--text)",
            }}
          >
            {item}
          </span>
          <span className="px-1" style={{ fontSize: "0.875rem", color: "var(--accent-raw)" }}>
            ✦
          </span>
        </Fragment>
      ))}
    </div>
  );

  const stripStyle = {
    fontSize: "var(--text-label)",
    letterSpacing: "0.15em",
    color: "var(--text)",
    opacity: 0.66,
  } as const;

  return (
    <section ref={sectionRef} id="hero" className="relative w-full">
      <div ref={contentRef} style={{ opacity: skipReveal ? 1 : 0 }}>
        {/* ── Masthead strip ── */}
        <div
          data-hero-fade
          className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 px-6 lg:px-10"
          style={{ paddingTop: "18px", paddingBottom: "18px", borderBottom: RULE }}
        >
          <span className="font-mono uppercase" style={stripStyle}>
            Fullstack Software Engineer
          </span>
          <span className="font-mono uppercase" style={{ ...stripStyle, opacity: 1 }}>
            <LiveClock />
          </span>
        </div>

        {/* ── Masthead ── */}
        <div className="px-6 lg:px-10 overflow-hidden" style={{ paddingTop: "clamp(24px, 3vw, 44px)" }}>
          <h1
            data-hero-name
            className="hero-name font-display font-bold text-center"
            style={{ color: "var(--text)", margin: 0 }}
          >
            <span className="block lg:inline">RAJ</span>{" "}
            <span className="block lg:inline">DESAI</span>
          </h1>
        </div>

        <div
          data-hero-fade
          className="flex justify-end px-6 lg:px-10"
          style={{ paddingTop: "clamp(16px, 1.8vw, 25px)", paddingBottom: "18px" }}
        >
          <span className="font-mono uppercase text-right" style={stripStyle}>
            MS Computer Science · UT Dallas · 2026
          </span>
        </div>

        {/* ── Ticker ── */}
        <div
          data-hero-marquee
          className="overflow-hidden"
          style={{ borderTop: RULE, borderBottom: RULE, paddingTop: "13px", paddingBottom: "13px" }}
        >
          <div className="flex hero-ticker">
            {renderMarqueeStrip(0)}
            {renderMarqueeStrip(1)}
          </div>
        </div>

        {/* ── Bed ── */}
        <div
          data-hero-info
          className="grid grid-cols-1 lg:grid-cols-[minmax(0,660px)_1px_minmax(0,1fr)_1px_380px]"
          style={{ minHeight: "430px" }}
        >
          {/* Thesis */}
          <div className="flex flex-col justify-center px-6 lg:pl-10 lg:pr-11 py-9">
            <p
              className="font-display font-medium"
              style={{
                fontSize: "clamp(2rem, 4vw, 3.75rem)",
                lineHeight: 1.04,
                letterSpacing: "-0.03em",
                color: "var(--text)",
                textWrap: "balance",
                margin: 0,
              }}
            >
              Exploring &amp; building{" "}
              <span className="whitespace-nowrap" style={{ color: "var(--accent-raw)" }}>
                good sh!t
              </span>{" "}
              since 2023.
            </p>
            <p
              className="font-body"
              style={{
                fontSize: "var(--text-body-sm)",
                lineHeight: 1.65,
                color: "var(--text)",
                opacity: 0.78,
                maxWidth: "520px",
                textWrap: "pretty",
                margin: "26px 0 0",
              }}
            >
              Fullstack, product-minded, and comfortable owning a thing end to end. Four projects below, all shipped, all live.
            </p>
          </div>

          <div className="hidden lg:block" style={{ backgroundColor: "var(--rule-hairline)" }} />
          <div className="lg:hidden h-px w-full" style={{ backgroundColor: "var(--rule-hairline)" }} />

          {/* What's below + availability */}
          <div className="px-6 lg:px-[34px] py-9">
            <div
              className="font-mono uppercase"
              style={{ ...stripStyle, letterSpacing: "0.18em", marginBottom: "20px" }}
            >
              What&apos;s below
            </div>

            <nav className="flex flex-col gap-3" aria-label="Page sections">
              {PAGE_LINKS.map((link, i) => (
                <a
                 key={link.href}
                  href={link.href}
                  data-cursor-hide
                  target={link.external ? "_blank" : undefined}
                  rel={link.external ? "noopener noreferrer" : undefined}
                  className="flex items-baseline justify-between cursor-pointer transition-colors duration-300"
                  style={{
                    fontSize: "var(--text-body-sm)",
                    lineHeight: 1.3,
                    color: "var(--text)",
                    paddingBottom: "11px",
                    borderBottom:
                      i === PAGE_LINKS.length - 1 ? "none" : "1px solid var(--rule-hairline)",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = "var(--accent-raw)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = "var(--text)"; }}
                >
                  <span>{link.label}</span>
                  <span className="font-mono" style={{ fontSize: "var(--text-label)", opacity: 0.66 }}>
                    {link.external ? "↗" : "–"}
                  </span>
                </a>
              ))}
            </nav>

            <div
              style={{
                marginTop: "30px",
                padding: "16px 18px",
                border: "1px solid var(--accent-raw)",
              }}
            >
              <div
                className="font-mono uppercase"
                style={{
                  fontSize: "var(--text-label)",
                  letterSpacing: "0.14em",
                  color: "var(--accent-raw)",
                }}
              >
                Available Now
              </div>
              <div
                className="font-body"
                style={{
                  fontSize: "var(--text-body-sm)",
                  lineHeight: 1.45,
                  color: "var(--text)",
                  opacity: 0.78,
                  marginTop: "8px",
                }}
              >
                Full-time &amp; contract, US-based.
              </div>
            </div>
          </div>

          <div className="hidden lg:block" style={{ backgroundColor: "rgba(242, 231, 220, 0.16)" }} />
          <div className="lg:hidden h-px w-full" style={{ backgroundColor: "rgba(242, 231, 220, 0.16)" }} />

          {/* Cloud plate */}
          <div className="relative min-h-[280px] lg:min-h-0" style={{ backgroundColor: "#141414" }}>
            <Image
              src="/images/about-13.jpeg"
              alt="Dramatic cloudscape"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 380px"
              style={{
                objectFit: "cover",
                filter: "grayscale(1) contrast(1.08)",
                opacity: 0.82,
              }}
            />
          </div>
        </div>

        {/* ── Footer strip ── */}
        <div
          data-hero-fade
          className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 px-6 lg:px-10"
          style={{ paddingTop: "14px", paddingBottom: "14px", borderTop: RULE }}
        >
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            {FOOTER_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target={link.href.startsWith("http") ? "_blank" : undefined}
                rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="font-mono uppercase cursor-pointer transition-opacity duration-300"
                data-cursor-hide
                style={stripStyle}
                onMouseEnter={(e) => { e.currentTarget.style.opacity = "1"; }}
                onMouseLeave={(e) => { e.currentTarget.style.opacity = "0.66"; }}
              >
                {link.label}
              </a>
            ))}

            <button
              type="button"
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
              className="hero-footer-link font-mono uppercase flex items-center gap-2"
              data-cursor-hide
              style={{
                ...stripStyle,
                padding: "5px 11px",
                border: "1px solid rgba(242, 231, 220, 0.24)",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.opacity = "1"; }}
              onMouseLeave={(e) => { e.currentTarget.style.opacity = "0.66"; }}
            >
              {theme === "dark" ? <Sun size={14} aria-hidden /> : <Moon size={14} aria-hidden />}
              {theme === "dark" ? "Light" : "Dark"}
            </button>
          </div>

          <div data-hero-scroll>
            <ScrollIndicator />
          </div>
        </div>
      </div>
    </section>
  );
}