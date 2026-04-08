"use client";

import { useEffect, useRef, useCallback } from "react";
import { gsap } from "@/lib/gsap";
import { Container } from "@/components/layout/container";
import { SKILLS } from "@/lib/skills-data";

/* ──────────────────────────────────────────────────────────
   SKILL CELL — category name + grid blocks with proximity glow
   ────────────────────────────────────────────────────────── */

function SkillCell({ skill }: { skill: (typeof SKILLS)[number] }) {
  const blocksRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!blocksRef.current) return;
    const blocks = blocksRef.current.children;
    const rect = blocksRef.current.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    for (let i = 0; i < blocks.length; i++) {
      const block = blocks[i] as HTMLElement;
      const br = block.getBoundingClientRect();
      const bx = br.left - rect.left + br.width / 2;
      const by = br.top - rect.top + br.height / 2;
      const dist = Math.sqrt((mx - bx) ** 2 + (my - by) ** 2);
      const maxDist = 200;
      const intensity = Math.max(0, 1 - dist / maxDist);

      block.style.backgroundColor = `rgba(3, 140, 127, ${(intensity * 0.18).toFixed(3)})`;
      block.style.opacity = `${(0.4 + intensity * 0.6).toFixed(2)}`;
      block.style.color = intensity > 0.5 ? "var(--accent-raw)" : "";
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (!blocksRef.current) return;
    const blocks = blocksRef.current.children;
    for (let i = 0; i < blocks.length; i++) {
      const block = blocks[i] as HTMLElement;
      block.style.backgroundColor = "rgba(242, 231, 220, 0.04)";
      block.style.opacity = "0.55";
      block.style.color = "";
    }
  }, []);

  return (
    <div
      className="skill-cell"
      style={{ padding: "clamp(24px, 2.5vw, 36px) clamp(20px, 2vw, 32px)" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <h3
        className="font-display font-bold tracking-[-0.03em]"
        style={{
          fontSize: "var(--text-subheading)",
          color: "var(--text)",
          marginBottom: "clamp(14px, 1.2vw, 20px)",
        }}
      >
        {skill.name}
      </h3>

      <div
        ref={blocksRef}
        className="grid gap-[2px]"
        style={{
          gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
        }}
      >
        {skill.pills.map((tech) => (
          <div
            key={tech}
            className="skill-block font-mono tracking-[0.02em]"
            style={{
              padding: "10px 12px",
              fontSize: "var(--text-micro)",
              color: "var(--text)",
              opacity: 0.55,
              backgroundColor: "rgba(242, 231, 220, 0.04)",
              transition:
                "background-color 0.15s ease-out, opacity 0.15s ease-out, color 0.15s ease-out",
            }}
          >
            {tech}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────
   SOLO CELL — full-width Tooling row (name left, blocks right)
   ────────────────────────────────────────────────────────── */

function SoloCell({ skill }: { skill: (typeof SKILLS)[number] }) {
  const blocksRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!blocksRef.current) return;
    const blocks = blocksRef.current.children;
    const rect = blocksRef.current.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    for (let i = 0; i < blocks.length; i++) {
      const block = blocks[i] as HTMLElement;
      const br = block.getBoundingClientRect();
      const bx = br.left - rect.left + br.width / 2;
      const by = br.top - rect.top + br.height / 2;
      const dist = Math.sqrt((mx - bx) ** 2 + (my - by) ** 2);
      const maxDist = 200;
      const intensity = Math.max(0, 1 - dist / maxDist);

      block.style.backgroundColor = `rgba(3, 140, 127, ${(intensity * 0.18).toFixed(3)})`;
      block.style.opacity = `${(0.4 + intensity * 0.6).toFixed(2)}`;
      block.style.color = intensity > 0.5 ? "var(--accent-raw)" : "";
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (!blocksRef.current) return;
    const blocks = blocksRef.current.children;
    for (let i = 0; i < blocks.length; i++) {
      const block = blocks[i] as HTMLElement;
      block.style.backgroundColor = "rgba(242, 231, 220, 0.04)";
      block.style.opacity = "0.55";
      block.style.color = "";
    }
  }, []);

  return (
    <div
      className="skill-cell"
      style={{ padding: "clamp(24px, 2.5vw, 36px) clamp(20px, 2vw, 32px)" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className="grid grid-cols-[1fr_1fr] gap-10 items-start">
        <h3
          className="font-display font-bold tracking-[-0.03em]"
          style={{
            fontSize: "var(--text-subheading)",
            color: "var(--text)",
          }}
        >
          {skill.name}
        </h3>

        <div
          ref={blocksRef}
          className="grid gap-[2px]"
          style={{
            gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
          }}
        >
          {skill.pills.map((tech) => (
            <div
              key={tech}
              className="skill-block font-mono tracking-[0.02em]"
              style={{
                padding: "10px 12px",
                fontSize: "var(--text-micro)",
                color: "var(--text)",
                opacity: 0.55,
                backgroundColor: "rgba(242, 231, 220, 0.04)",
                transition:
                  "background-color 0.15s ease-out, opacity 0.15s ease-out, color 0.15s ease-out",
              }}
            >
              {tech}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────
   MAIN COMPONENT
   ────────────────────────────────────────────────────────── */

export function SkillsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      if (gridRef.current) gsap.set(gridRef.current, { opacity: 1, y: 0, scaleX: 1 });
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 88%",
          end: "top 20%",
          scrub: 0.6,
        },
      });

      if (gridRef.current) {
        const cells = gridRef.current.querySelectorAll(".skill-cell");
        const hrs = gridRef.current.querySelectorAll(".skill-hr");
        const vrs = gridRef.current.querySelectorAll(".skill-vr");

        gsap.set(cells, { opacity: 0, y: 24 });
        gsap.set(hrs, { scaleX: 0 });
        gsap.set(vrs, { scaleY: 0 });

        tl.to(hrs, { scaleX: 1, duration: 0.25, stagger: 0.04, ease: "none" }, 0);
        tl.to(vrs, { scaleY: 1, duration: 0.25, stagger: 0.04, ease: "none" }, 0.02);
        tl.to(cells, { opacity: 1, y: 0, duration: 0.2, stagger: 0.04, ease: "none" }, 0.08);
      }
    }, sectionRef);

    return () => {
      ctx.revert();
    };
  }, []);

  const row1 = [SKILLS[0], SKILLS[1]];
  const row2 = [SKILLS[2], SKILLS[3]];
  const solo = SKILLS[4];

  return (
    <section ref={sectionRef} id="skills" className="relative w-full overflow-hidden">
      <div className="py-[6vh] sm:py-[8vh] lg:py-[10vh]">
        <Container>
          <div ref={gridRef}>
            {/* ── Row 1: Frontend | Backend ── */}
            <div
              className="skill-hr h-px w-full origin-left"
              style={{ backgroundColor: "var(--border-custom)" }}
            />
            <div className="grid grid-cols-1 md:grid-cols-[1fr_1px_1fr]">
              <SkillCell skill={row1[0]} />
              <div
                className="skill-vr hidden md:block origin-top"
                style={{ backgroundColor: "var(--border-custom)" }}
              />
              <div
                className="md:hidden h-px w-full"
                style={{ backgroundColor: "var(--border-custom)" }}
              />
              <SkillCell skill={row1[1]} />
            </div>

            {/* ── Row 2: AI/ML | Architecture ── */}
            <div
              className="skill-hr h-px w-full origin-left"
              style={{ backgroundColor: "var(--border-custom)" }}
            />
            <div className="grid grid-cols-1 md:grid-cols-[1fr_1px_1fr]">
              <SkillCell skill={row2[0]} />
              <div
                className="skill-vr hidden md:block origin-top"
                style={{ backgroundColor: "var(--border-custom)" }}
              />
              <div
                className="md:hidden h-px w-full"
                style={{ backgroundColor: "var(--border-custom)" }}
              />
              <SkillCell skill={row2[1]} />
            </div>

            {/* ── Row 3: Tooling (full width) ── */}
            <div
              className="skill-hr h-px w-full origin-left"
              style={{ backgroundColor: "var(--border-custom)" }}
            />
            <div className="hidden md:block">
              <SoloCell skill={solo} />
            </div>
            <div className="md:hidden">
              <SkillCell skill={solo} />
            </div>

            <div
              className="skill-hr h-px w-full origin-left"
              style={{ backgroundColor: "var(--border-custom)" }}
            />
          </div>
        </Container>
      </div>
    </section>
  );
}
