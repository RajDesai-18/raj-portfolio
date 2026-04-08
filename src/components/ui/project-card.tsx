"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { gsap, SplitText } from "@/lib/gsap";
import { Container } from "@/components/layout/container";
import { type Project } from "@/lib/projects-data";
import { Github, ArrowUpRight, ChevronDown } from "lucide-react";
import Image from "next/image";
import { PrSenseiThumbnail } from "@/components/ui/pr-sensei-thumbnail";
import { LlmCookbookThumbnail } from "@/components/ui/llm-cookbook-thumbnail";
import { FinancialSaasThumbnail } from "@/components/ui/financial-saas-thumbnail";
import { AnimatedThumbnail } from "@/components/ui/animated-thumbnail";

interface ProjectCardProps {
  project: Project;
  direction: "left" | "right";
  numberOffsetY?: string;
}

// ── Tech pills ──
function TechPills({ pills }: { pills: string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {pills.map((pill) => (
        <span
          key={pill}
          className="project-pill font-mono text-[0.625rem] sm:text-[0.6875rem] xl:text-[0.75rem] tracking-[0.04em] px-2.5 sm:px-3 py-1 sm:py-1.5"
          style={{ color: "var(--text-muted)", border: "1px solid var(--border-custom)" }}
        >
          {pill}
        </span>
      ))}
    </div>
  );
}

// ── Project links ──
function ProjectLinks({ project }: { project: Project }) {
  return (
    <div className="flex items-center gap-4 sm:gap-6">
      {project.links.live && (
        <a
          href={project.links.live}
          target="_blank"
          rel="noopener noreferrer"
          className="project-link group flex items-center gap-2 font-mono text-[0.6875rem] sm:text-[0.75rem] xl:text-[0.8125rem] uppercase tracking-[0.1em] transition-colors duration-300"
          style={{ color: "var(--text-muted)" }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "var(--accent-raw)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "var(--text-muted)";
          }}
        >
          <ArrowUpRight size={14} />
          Live Demo
        </a>
      )}
      <a
        href={project.links.github}
        target="_blank"
        rel="noopener noreferrer"
        className="project-link group flex items-center gap-2 font-mono text-[0.6875rem] sm:text-[0.75rem] xl:text-[0.8125rem] uppercase tracking-[0.1em] transition-colors duration-300"
        style={{ color: "var(--text-muted)" }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = "var(--accent-raw)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = "var(--text-muted)";
        }}
      >
        <Github size={14} />
        GitHub
      </a>
    </div>
  );
}

// ── "Why I built it" expandable ──
function WhyBuiltIt({ text }: { text: string }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="mt-5 sm:mt-6">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-2 font-mono text-[0.6875rem] sm:text-[0.75rem] xl:text-[0.8125rem] uppercase tracking-[0.12em] transition-colors duration-300 cursor-pointer"
        style={{ color: "var(--accent-raw)" }}
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
            className="project-why-reveal pt-4 font-body font-medium leading-[1.55] tracking-[-0.005em] max-w-145"
            style={{ color: "var(--text-muted)", fontSize: "clamp(0.9375rem, 1.8vw, 1.5rem)" }}
          >
            {text}
          </p>
        </div>
      </div>
    </div>
  );
}

// ── Desktop thumbnail (image, custom component, or placeholder) ──
function DesktopThumbnail({ project, imageHovered }: { project: Project; imageHovered: boolean }) {
  if (project.image) {
    return (
      <div
        className="relative overflow-hidden rounded-xl"
        style={{ border: "1px solid var(--border-custom)", aspectRatio: "16 / 10" }}
      >
        <Image
          src={project.image.src}
          alt={project.image.alt}
          fill
          className="object-cover transition-all duration-700 ease-out"
          sizes="(max-width: 1280px) 60vw, 55vw"
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
  return (
    <div
      className="relative overflow-hidden rounded-xl"
      style={{ border: "1px solid var(--border-custom)", aspectRatio: "16 / 10" }}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <span
          className="font-mono text-[0.6875rem] uppercase tracking-[0.2em]"
          style={{ color: "var(--text-muted)", opacity: 0.4 }}
        >
          Coming Soon
        </span>
      </div>
    </div>
  );
}

// ── Mobile thumbnail — renders directly, no nesting issues ──
function MobileThumbnail({ project }: { project: Project }) {
  if (project.image) {
    return (
      <Image
        src={project.image.src}
        alt={project.image.alt}
        fill
        className="object-cover"
        sizes="100vw"
        priority={false}
      />
    );
  }
  if (project.id === "pr-sensei")
    return (
      <AnimatedThumbnail aspectRatio="4/3">
        <PrSenseiThumbnail />
      </AnimatedThumbnail>
    );
  if (project.id === "llm-cookbook")
    return (
      <AnimatedThumbnail aspectRatio="4/3">
        <LlmCookbookThumbnail />
      </AnimatedThumbnail>
    );
  if (project.id === "financial-saas")
    return (
      <AnimatedThumbnail aspectRatio="4/3">
        <FinancialSaasThumbnail />
      </AnimatedThumbnail>
    );
  return null;
}

// ══════════════════════════════════════════════
// MAIN COMPONENT
// ══════════════════════════════════════════════
export function ProjectCard({ project, direction, numberOffsetY }: ProjectCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const imageWrapRef = useRef<HTMLDivElement>(null);
  const imageInnerRef = useRef<HTMLDivElement>(null);
  const tiltRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);
  const numberRef = useRef<HTMLSpanElement>(null);
  const quoteRef = useRef<HTMLDivElement>(null);
  const pillsRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<HTMLDivElement>(null);
  const [imageHovered, setImageHovered] = useState(false);

  // ── 3D Tilt (desktop only) ──
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!tiltRef.current || window.matchMedia("(pointer: coarse)").matches) return;
    const rect = tiltRef.current.getBoundingClientRect();
    const rotateY = ((e.clientX - rect.left - rect.width / 2) / (rect.width / 2)) * 3;
    const rotateX = ((rect.height / 2 - (e.clientY - rect.top)) / (rect.height / 2)) * 3;
    gsap.to(tiltRef.current, {
      rotateX,
      rotateY,
      duration: 0.4,
      ease: "power2.out",
      overwrite: "auto",
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (!tiltRef.current) return;
    setImageHovered(false);
    gsap.to(tiltRef.current, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.6,
      ease: "elastic.out(1, 0.5)",
      overwrite: "auto",
    });
  }, []);

  const handleMouseEnter = useCallback(() => {
    setImageHovered(true);
  }, []);

  // ── Scroll animations ──
  useEffect(() => {
    if (!cardRef.current || !nameRef.current) return;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      gsap.set([imageWrapRef.current, quoteRef.current, pillsRef.current, linksRef.current], {
        opacity: 1,
        y: 0,
        x: 0,
      });
      gsap.set(numberRef.current, { opacity: 0.1 });
      return;
    }

    const split = new SplitText(nameRef.current, { type: "chars", charsClass: "project-char" });
    const imageFromX = direction === "left" ? -40 : 40;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        imageWrapRef.current,
        { opacity: 0, y: 50, x: imageFromX * 0.3 },
        {
          opacity: 1,
          y: 0,
          x: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: cardRef.current,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );
      gsap.fromTo(
        imageInnerRef.current,
        { y: 40 },
        {
          y: -40,
          ease: "none",
          scrollTrigger: {
            trigger: cardRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        }
      );
      gsap.fromTo(
        numberRef.current,
        { opacity: 0, scale: 0.95 },
        {
          opacity: 0.1,
          scale: 1,
          duration: 1.2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: cardRef.current,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );
      gsap.fromTo(
        numberRef.current,
        { y: 60 },
        {
          y: -60,
          ease: "none",
          scrollTrigger: {
            trigger: cardRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        }
      );
      gsap.fromTo(
        split.chars,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.035,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: cardRef.current,
            start: "top 78%",
            toggleActions: "play none none none",
          },
        }
      );
      gsap.fromTo(
        quoteRef.current,
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: cardRef.current,
            start: "top 68%",
            toggleActions: "play none none none",
          },
        }
      );
      if (pillsRef.current) {
        const pillEls = pillsRef.current.querySelectorAll(".project-pill");
        gsap.fromTo(
          pillEls,
          { opacity: 0, y: 12 },
          {
            opacity: 1,
            y: 0,
            stagger: 0.05,
            duration: 0.5,
            ease: "power2.out",
            scrollTrigger: {
              trigger: cardRef.current,
              start: "top 62%",
              toggleActions: "play none none none",
            },
          }
        );
      }
      gsap.fromTo(
        linksRef.current,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.6,
          ease: "power2.out",
          scrollTrigger: {
            trigger: cardRef.current,
            start: "top 58%",
            toggleActions: "play none none none",
          },
        }
      );
    }, cardRef);

    return () => {
      ctx.revert();
      split.revert();
    };
  }, [direction]);

  const isLeft = direction === "left";

  return (
    <div ref={cardRef} className="relative mb-[8vh] sm:mb-[12vh] md:mb-[20vh]">
      <Container className="relative">
        {/* ── Desktop bleed number ── */}
        <span
          ref={numberRef}
          className={`absolute pointer-events-none select-none font-display font-bold leading-[0.85] tracking-[-0.05em] hidden md:block ${isLeft ? "right-2 sm:right-4 lg:right-16" : "left-2 sm:left-4 lg:left-16"}`}
          style={{
            color: "var(--text)",
            opacity: 0,
            fontSize: "clamp(7rem, 18vw, 20rem)",
            top: numberOffsetY ?? "10%",
          }}
          aria-hidden="true"
        >
          {project.number}
        </span>

        {/* ── Image wrapper ── */}
        <div
          ref={imageWrapRef}
          className={`relative w-full md:w-[60%] xl:w-[55%] ${isLeft ? "md:mr-auto" : "md:ml-auto"}`}
          style={{ opacity: 0 }}
        >
          {/* ─ MOBILE: Full-bleed image with name overlay ─ */}
          <div className="md:hidden -mx-5 sm:-mx-6">
            <div ref={imageInnerRef}>
              <div className="relative overflow-hidden" style={{ aspectRatio: "4/3" }}>
                <MobileThumbnail project={project} />
                {/* Gradient scrim */}
                <div
                  className="absolute inset-x-0 bottom-0 pointer-events-none"
                  style={{
                    height: "60%",
                    background:
                      "linear-gradient(to top, var(--bg) 5%, rgba(31,31,31,0.7) 50%, transparent)",
                  }}
                />
                {/* Name + number overlay */}
                <div className="absolute bottom-0 left-0 right-0 px-5 sm:px-6 pb-3">
                  <span
                    className="font-mono text-[0.5rem] tracking-[0.14em] uppercase"
                    style={{ color: "var(--accent-raw)" }}
                  >
                    {project.number}
                  </span>
                  <h3
                    className="font-display font-bold tracking-[-0.04em] leading-[0.85] mt-1"
                    style={{ color: "var(--text)", fontSize: "clamp(2.25rem, 10vw, 3.5rem)" }}
                  >
                    {project.name}
                  </h3>
                </div>
              </div>
            </div>
          </div>

          {/* ─ DESKTOP: Standard thumbnail with tilt ─ */}
          <div className="hidden md:block">
            <div ref={imageInnerRef}>
              <div style={{ perspective: "800px" }}>
                <div
                  ref={tiltRef}
                  className="project-tilt-card relative"
                  style={{ transformStyle: "preserve-3d" }}
                  onMouseMove={handleMouseMove}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                  data-cursor-view
                >
                  <DesktopThumbnail project={project} imageHovered={imageHovered} />
                  <div
                    className="absolute inset-0 rounded-xl pointer-events-none transition-opacity duration-700"
                    style={{
                      boxShadow: "inset 0 0 0 1.5px var(--accent-raw)",
                      opacity: imageHovered ? 1 : 0,
                      zIndex: 10,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Desktop project name ── */}
        <h3
          ref={nameRef}
          className={`relative font-display font-bold tracking-[-0.04em] leading-[0.85] hidden md:block -mt-14 z-2 ${isLeft ? "md:ml-[2%]" : "md:text-right md:mr-[2%]"}`}
          style={{
            color: "var(--text)",
            fontSize: "clamp(2.25rem, 8vw, 9rem)",
            WebkitTextStroke: "2px var(--bg)",
            paintOrder: "stroke fill",
          }}
        >
          {project.name}
        </h3>

        {/* ── Content block ── */}
        <div
          className={`mt-4 sm:mt-6 md:mt-10 max-w-140 ${isLeft ? "md:ml-[2%]" : "md:ml-auto md:mr-[2%]"}`}
        >
          <div
            ref={quoteRef}
            className="pl-4 sm:pl-5"
            style={{ borderLeft: "2px solid var(--accent-raw)", opacity: 0 }}
          >
            <p
              className="font-body font-medium leading-[1.55] tracking-[-0.005em]"
              style={{ color: "var(--text)", fontSize: "clamp(0.875rem, 1.8vw, 1.5rem)" }}
            >
              {project.oneLiner}
            </p>
          </div>
          <div ref={pillsRef} className="mt-4 sm:mt-5 md:mt-7">
            <TechPills pills={project.pills} />
          </div>
          <div ref={linksRef} className="mt-4 sm:mt-5 md:mt-6" style={{ opacity: 0 }}>
            <ProjectLinks project={project} />
          </div>
          <WhyBuiltIt text={project.whyIBuiltIt} />
        </div>
      </Container>
    </div>
  );
}
