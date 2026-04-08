"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, SplitText } from "@/lib/gsap";
import { Container } from "@/components/layout/container";
import { PROJECTS, type Project } from "@/lib/projects-data";
import { Github, ArrowUpRight, ChevronDown } from "lucide-react";
import Image from "next/image";
import { PrSenseiThumbnail } from "@/components/ui/pr-sensei-thumbnail";
import { LlmCookbookThumbnail } from "@/components/ui/llm-cookbook-thumbnail";
import { FinancialSaasThumbnail } from "@/components/ui/financial-saas-thumbnail";
import { AnimatedThumbnail } from "@/components/ui/animated-thumbnail";

/* ──────────────────────────────────────────────────────────
   THUMBNAIL RENDERER
   ────────────────────────────────────────────────────────── */

function ProjectThumbnail({ project }: { project: Project }) {
  if (project.image) {
    return (
      <div
        className="relative overflow-hidden rounded-lg"
        style={{ border: "1px solid var(--border-custom)", aspectRatio: "16 / 10" }}
      >
        <Image
          src={project.image.src}
          alt={project.image.alt}
          fill
          className="object-cover"
          sizes="(max-width: 1023px) 100vw, 45vw"
          priority={false}
        />
      </div>
    );
  }
  if (project.id === "pr-sensei")
    return (
      <AnimatedThumbnail>
        <PrSenseiThumbnail />
      </AnimatedThumbnail>
    );
  if (project.id === "llm-cookbook")
    return (
      <AnimatedThumbnail>
        <LlmCookbookThumbnail />
      </AnimatedThumbnail>
    );
  if (project.id === "financial-saas")
    return (
      <AnimatedThumbnail>
        <FinancialSaasThumbnail />
      </AnimatedThumbnail>
    );
  return null;
}

/* ──────────────────────────────────────────────────────────
   TECH PILLS
   ────────────────────────────────────────────────────────── */

function TechPills({ pills }: { pills: string[] }) {
  return (
    <div className="flex flex-wrap gap-1.5 sm:gap-2">
      {pills.map((pill) => (
        <span
          key={pill}
          className="project-pill font-mono tracking-[0.04em] px-3 py-1.5 rounded-full transition-colors duration-300"
          style={{
            fontSize: "var(--text-micro)",
            color: "var(--text)",
            opacity: 0.65,
            border: "1px solid var(--border-custom)",
          }}
        >
          {pill}
        </span>
      ))}
    </div>
  );
}

/* ──────────────────────────────────────────────────────────
   PROJECT LINKS
   ────────────────────────────────────────────────────────── */

function ProjectLinks({ project }: { project: Project }) {
  return (
    <div className="flex items-center gap-5 sm:gap-6">
      {project.links.live && (
        <a
          href={project.links.live}
          target="_blank"
          rel="noopener noreferrer"
          className="project-link flex items-center gap-2 font-mono uppercase tracking-[0.1em] transition-colors duration-300"
          style={{ color: "var(--accent-raw)", fontSize: "var(--text-label)" }}
        >
          <ArrowUpRight size={14} />
          Live Demo
        </a>
      )}
      <a
        href={project.links.github}
        target="_blank"
        rel="noopener noreferrer"
        className="project-link flex items-center gap-2 font-mono uppercase tracking-[0.1em] transition-colors duration-300"
        style={{ color: "var(--accent-raw)", fontSize: "var(--text-label)" }}
      >
        <Github size={14} />
        GitHub
      </a>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────
   WHY I BUILT IT
   ────────────────────────────────────────────────────────── */

function WhyBuiltIt({ text }: { text: string }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="mt-5">
      <button
        onClick={(e) => {
          e.stopPropagation();
          setExpanded(!expanded);
        }}
        className="flex items-center gap-2 font-mono uppercase tracking-[0.12em] transition-colors duration-300 cursor-pointer"
        style={{ color: "var(--accent-raw)", fontSize: "var(--text-label)" }}
      >
        <ChevronDown
          size={12}
          className="transition-transform duration-300"
          style={{ transform: expanded ? "rotate(180deg)" : "rotate(0deg)" }}
        />
        Why I built it
      </button>
      <div className="project-why-expand" data-expanded={expanded ? "true" : "false"}>
        <div>
          <p
            className="project-why-reveal pt-3 font-body font-medium leading-[1.6] tracking-[-0.005em]"
            style={{
              color: "var(--text)",
              opacity: 0.7,
              fontSize: "var(--text-body-sm)",
              fontStyle: "italic",
              maxWidth: "520px",
            }}
          >
            {text}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────
   EXPANDED DETAIL PANEL (shown on click)
   ────────────────────────────────────────────────────────── */

function ExpandedDetails({ project }: { project: Project }) {
  return (
    <div className="split-e-expand-inner pt-6 pb-2 lg:pt-8 lg:pb-4">
      {/* Two-col: thumbnail left, details right on desktop */}
      <div className="lg:grid lg:grid-cols-[1fr_1fr] lg:gap-10 xl:gap-14">
        {/* Thumbnail */}
        <div className="mb-5 lg:mb-0">
          <ProjectThumbnail project={project} />
        </div>

        {/* Details */}
        <div className="flex flex-col justify-center">
          <p
            className="font-body font-medium leading-[1.6] tracking-[-0.005em]"
            style={{
              color: "var(--text)",
              fontSize: "var(--text-body)",
              marginBottom: "clamp(16px, 2vw, 24px)",
            }}
          >
            {project.detailedDescription}
          </p>

          <div style={{ marginBottom: "clamp(14px, 1.5vw, 20px)" }}>
            <TechPills pills={project.pills} />
          </div>

          <ProjectLinks project={project} />
          <WhyBuiltIt text={project.whyIBuiltIt} />
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────
   MOBILE PROJECT CARD
   ────────────────────────────────────────────────────────── */

function MobileProjectCard({ project }: { project: Project }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div>
      {/* Tappable header */}
      <button className="w-full text-left cursor-pointer" onClick={() => setExpanded(!expanded)}>
        <div className="flex items-baseline justify-between gap-4">
          <div>
            <span
              className="block font-mono tracking-[0.12em]"
              style={{
                fontSize: "var(--text-micro)",
                color: "var(--accent-raw)",
                marginBottom: "6px",
              }}
            >
              {project.number}
            </span>
            <h3
              className="font-display font-bold tracking-[-0.04em] leading-[0.88] transition-colors duration-300"
              style={{
                color: expanded ? "var(--accent-raw)" : "var(--text)",
                fontSize: "clamp(2rem, 8vw, 3rem)",
              }}
            >
              {project.name}
            </h3>
          </div>
          <ChevronDown
            size={18}
            className="shrink-0 transition-transform duration-400"
            style={{
              color: "var(--accent-raw)",
              transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
            }}
          />
        </div>
      </button>

      {/* Expandable details */}
      <div className="project-why-expand" data-expanded={expanded ? "true" : "false"}>
        <div>
          <div className="project-why-reveal">
            <ExpandedDetails project={project} />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   MAIN COMPONENT — Typographic List Projects
   ══════════════════════════════════════════════════════════ */

export function ProjectsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);

  /* ── Cursor-following preview state ── */
  const previewRef = useRef<HTMLDivElement>(null);
  const previewXRef = useRef({ current: -200, target: -200 });
  const previewYRef = useRef({ current: -200, target: -200 });
  const activePreview = useRef<number>(-1);
  const rafRef = useRef<number>(0);

  /* ── Expanded project state ── */
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  /* ── Cursor preview: smooth follow loop ── */
  useEffect(() => {
    if (typeof window === "undefined" || window.innerWidth < 1024) return;

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const tick = () => {
      const px = previewXRef.current;
      const py = previewYRef.current;
      px.current = lerp(px.current, px.target, 0.12);
      py.current = lerp(py.current, py.target, 0.12);

      if (previewRef.current) {
        previewRef.current.style.transform = `translate3d(${px.current}px, ${py.current}px, 0)`;
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  /* ── Mouse handlers for preview ── */
  const handleRowEnter = (index: number) => {
    if (typeof window === "undefined" || window.innerWidth < 1024) return;
    if (expandedIndex === index) return;

    activePreview.current = index;

    if (previewRef.current) {
      const thumbs = previewRef.current.querySelectorAll<HTMLDivElement>("[data-preview-thumb]");
      thumbs.forEach((t, i) => {
        t.style.opacity = i === index ? "1" : "0";
      });
      gsap.to(previewRef.current, {
        opacity: 1,
        scale: 1,
        duration: 0.35,
        ease: "power3.out",
        overwrite: true,
      });
    }
  };

  const handleRowLeave = () => {
    activePreview.current = -1;
    if (previewRef.current) {
      gsap.to(previewRef.current, {
        opacity: 0,
        scale: 0.92,
        duration: 0.25,
        ease: "power2.in",
        overwrite: true,
      });
    }
  };

  const handleRowMove = (e: React.MouseEvent) => {
    previewXRef.current.target = e.clientX + 24;
    previewYRef.current.target = e.clientY - 140;
  };

  const handleRowClick = (index: number) => {
    setExpandedIndex((prev) => (prev === index ? null : index));
    handleRowLeave();
  };

  /* ── GSAP Scroll Entrance ── */
  useEffect(() => {
    if (!sectionRef.current) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) return;

    const splits: InstanceType<typeof SplitText>[] = [];

    const ctx = gsap.context(() => {
      /* Section-level entrance: top HR */
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 88%",
          end: "top 40%",
          scrub: 0.6,
        },
      });

      const topHR = sectionRef.current?.querySelector(".split-hr-top");
      if (topHR) {
        gsap.set(topHR, { scaleX: 0 });
        tl.to(topHR, { scaleX: 1, duration: 0.3, ease: "none" }, 0);
      }

      /* Per-row entrance */
      rowRefs.current.forEach((row) => {
        if (!row) return;

        const hr = row.querySelector(".typo-row-hr");
        const nameEl = row.querySelector(".typo-row-name");
        const numEl = row.querySelector(".typo-row-num");
        const rightEl = row.querySelector(".typo-row-right");

        const rowTl = gsap.timeline({
          scrollTrigger: {
            trigger: row,
            start: "top 95%",
            end: "top 78%",
            scrub: 0.5,
          },
        });

        if (hr) {
          gsap.set(hr, { scaleX: 0 });
          rowTl.to(hr, { scaleX: 1, duration: 0.3, ease: "none" }, 0);
        }

        if (numEl) {
          gsap.set(numEl, { opacity: 0, y: 10 });
          rowTl.to(numEl, { opacity: 1, y: 0, duration: 0.25, ease: "none" }, 0.1);
        }

        if (nameEl) {
          const nameSplit = new SplitText(nameEl, { type: "chars", charsClass: "project-char" });
          splits.push(nameSplit);
          gsap.set(nameSplit.chars, { opacity: 0, y: 40 });
          rowTl.to(
            nameSplit.chars,
            { opacity: 1, y: 0, stagger: 0.02, duration: 0.25, ease: "none" },
            0.12
          );
        }

        if (rightEl) {
          gsap.set(rightEl, { opacity: 0, y: 14 });
          rowTl.to(rightEl, { opacity: 1, y: 0, duration: 0.25, ease: "none" }, 0.2);
        }
      });
    }, sectionRef);

    return () => {
      ctx.revert();
      splits.forEach((s) => s.revert());
    };
  }, []);

  return (
    <section ref={sectionRef} id="work" className="relative w-full overflow-hidden">
      <div className="py-[6vh] sm:py-[8vh] lg:py-[10vh]">
        <Container>
          {/* ── Top HR ── */}
          <div
            className="split-hr-top h-px w-full origin-left"
            style={{ backgroundColor: "var(--border-custom)" }}
          />

          {/* ══════════════════════════════════════════
              DESKTOP: Typographic rows (lg+)
              ══════════════════════════════════════════ */}
          <div className="hidden lg:block">
            {PROJECTS.map((project, i) => {
              const isExpanded = expandedIndex === i;
              return (
                <div
                  key={project.id}
                  ref={(el) => {
                    rowRefs.current[i] = el;
                  }}
                >
                  {/* HR between rows */}
                  {i > 0 && (
                    <div
                      className="typo-row-hr h-px w-full origin-left"
                      style={{ backgroundColor: "var(--border-custom)" }}
                    />
                  )}

                  {/* Row */}
                  <div
                    className="typo-list-row cursor-pointer"
                    style={{
                      padding: "clamp(32px, 3.5vw, 52px) clamp(12px, 2vw, 24px)",
                      transition:
                        "background-color 0.4s cubic-bezier(0.16, 1, 0.3, 1), padding 0.3s ease",
                      backgroundColor: isExpanded ? "var(--surface)" : "transparent",
                    }}
                    onMouseEnter={() => handleRowEnter(i)}
                    onMouseLeave={handleRowLeave}
                    onMouseMove={handleRowMove}
                    onClick={() => handleRowClick(i)}
                  >
                    {/* Main row: number + name left, one-liner + chevron right */}
                    <div className="flex items-baseline justify-between gap-8">
                      <div className="flex items-baseline gap-6 min-w-0">
                        <span
                          className="typo-row-num shrink-0 font-mono tracking-[0.14em]"
                          style={{ fontSize: "var(--text-label)", color: "var(--accent-raw)" }}
                        >
                          {project.number}
                        </span>
                        <h3
                          className="typo-row-name font-display font-bold tracking-[-0.04em] leading-[0.85] transition-colors duration-400"
                          style={{
                            color: isExpanded ? "var(--accent-raw)" : "var(--text)",
                            fontSize: "clamp(2.5rem, 5.5vw, 4.5rem)",
                          }}
                        >
                          {project.name}
                        </h3>
                      </div>

                      <div className="typo-row-right shrink-0 text-right flex items-center gap-6">
                        <span
                          className="font-body font-medium leading-[1.5] hidden xl:block text-right"
                          style={{
                            color: "var(--text)",
                            opacity: 0.7,
                            fontSize: "var(--text-body-sm)",
                            maxWidth: "440px",
                          }}
                        >
                          {project.oneLiner}
                        </span>

                        <ChevronDown
                          size={20}
                          className="shrink-0 transition-transform duration-400"
                          style={{
                            color: "var(--accent-raw)",
                            transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
                          }}
                        />
                      </div>
                    </div>

                    {/* Expanded details */}
                    <div
                      className="project-why-expand"
                      data-expanded={isExpanded ? "true" : "false"}
                    >
                      <div>
                        <div className="project-why-reveal">
                          <ExpandedDetails project={project} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Bottom HR */}
            <div className="h-px w-full" style={{ backgroundColor: "var(--border-custom)" }} />
          </div>

          {/* ══════════════════════════════════════════
              MOBILE: Stacked accordion (<lg)
              ══════════════════════════════════════════ */}
          <div className="lg:hidden">
            {PROJECTS.map((project, i) => (
              <div key={project.id}>
                {i > 0 && (
                  <div
                    className="h-px w-full"
                    style={{ backgroundColor: "var(--border-custom)" }}
                  />
                )}
                <div style={{ padding: "clamp(24px, 5vw, 40px) 0" }}>
                  <MobileProjectCard project={project} />
                </div>
              </div>
            ))}
            <div className="h-px w-full" style={{ backgroundColor: "var(--border-custom)" }} />
          </div>
        </Container>
      </div>

      {/* ══════════════════════════════════════════
          CURSOR-FOLLOWING PREVIEW (desktop only)
          ══════════════════════════════════════════ */}
      <div
        ref={previewRef}
        className="fixed top-0 left-0 z-40 pointer-events-none hidden lg:block"
        style={{
          width: "clamp(260px, 22vw, 360px)",
          opacity: 0,
          transform: "translate3d(-200px, -200px, 0)",
          willChange: "transform, opacity",
        }}
      >
        {PROJECTS.map((project, i) => (
          <div
            key={project.id}
            data-preview-thumb
            className="absolute inset-0 transition-opacity duration-200"
            style={{ opacity: 0 }}
          >
            <div
              className="rounded-xl overflow-hidden"
              style={{
                border: "1px solid var(--border-custom)",
                boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
              }}
            >
              <ProjectThumbnail project={project} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
