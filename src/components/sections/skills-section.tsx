"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { Container } from "@/components/layout/container";
import { SKILLS, type Skill } from "@/lib/skills-data";

/* ──────────────────────────────────────────────────────────
   TOOL ROW — name, dotted leader, weight carries the ranking
   ────────────────────────────────────────────────────────── */

function ToolRow({ name, core }: { name: string; core?: boolean }) {
  return (
    <div className="tool-row flex items-baseline">
      <span
        className="tool-name font-mono"
        data-core={core ? "true" : undefined}
        style={{ fontSize: "var(--text-body-sm)", letterSpacing: "0.01em" }}
      >
        {name}
      </span>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────
   GROUP — numbered category with its tools in sub-columns
   ────────────────────────────────────────────────────────── */

function SkillGroup({ skill, columns = 2 }: { skill: Skill; columns?: number }) {
  return (
    <div
      className="skill-group"
      style={{
        paddingTop: "clamp(22px, 2vw, 30px)",
        paddingBottom: "clamp(26px, 2.4vw, 34px)",
        borderTop: "1px solid var(--rule-strong)",
      }}
    >
      <div
        className="flex items-baseline justify-between"
        style={{ marginBottom: "clamp(14px, 1.4vw, 20px)", gap: "16px" }}
      >
        <h3
          className="font-display font-semibold"
          style={{
            fontSize: "clamp(2rem, 3vw, 2.875rem)",
            letterSpacing: "-0.03em",
            color: "var(--text)",
            lineHeight: 1,
          }}
        >
          {skill.name}
        </h3>

        <span
          className="font-mono shrink-0"
          style={{
            fontSize: "var(--text-label)",
            letterSpacing: "0.14em",
            color: "var(--text)",
            opacity: 0.55,
          }}
        >
          {skill.tools.length}
        </span>
      </div>

      <div
        className="grid"
        style={{
          gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
          columnGap: "clamp(24px, 2.6vw, 40px)",
        }}
      >
        {skill.tools.map((tool) => (
          <ToolRow key={tool.name} name={tool.name} core={tool.core} />
        ))}
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
      if (gridRef.current) {
        gsap.set(gridRef.current.querySelectorAll(".skill-group"), { opacity: 1, y: 0 });
      }
      return;
    }

    const ctx = gsap.context(() => {
      if (!gridRef.current) return;

      const groups = gridRef.current.querySelectorAll(".skill-group");
      gsap.set(groups, { opacity: 0, y: 24 });

      gsap
        .timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 88%",
            end: "top 25%",
            scrub: 0.6,
          },
        })
        .to(groups, { opacity: 1, y: 0, duration: 0.25, stagger: 0.05, ease: "none" }, 0);
    }, sectionRef);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <section ref={sectionRef} id="skills" className="relative w-full overflow-hidden">
      <div className="py-[6vh] sm:py-[8vh] lg:py-[10vh]">
        <Container>
          <div ref={gridRef}>
            {/* ── Rows 1 and 2: two columns on desktop ── */}
            <div
              className="grid grid-cols-1 md:grid-cols-2"
              style={{ columnGap: "clamp(40px, 5.3vw, 80px)" }}
            >
              <SkillGroup skill={SKILLS[0]} />
              <SkillGroup skill={SKILLS[1]} />
              <SkillGroup skill={SKILLS[2]} />
              <SkillGroup skill={SKILLS[3]} />
            </div>

            {/* ── Row 3: Tooling, full width, four sub-columns ── */}
            <div className="hidden lg:block">
              <SkillGroup skill={SKILLS[4]} columns={4} />
            </div>
            <div className="hidden md:block lg:hidden">
              <SkillGroup skill={SKILLS[4]} columns={3} />
            </div>
            <div className="md:hidden">
              <SkillGroup skill={SKILLS[4]} columns={1} />
            </div>

            <div style={{ borderTop: "1px solid rgba(242, 231, 220, 0.35)" }} />
          </div>
        </Container>
      </div>
    </section>
  );
}