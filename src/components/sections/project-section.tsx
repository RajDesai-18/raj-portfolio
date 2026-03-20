"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { Container } from "@/components/layout/container";
import { SectionLabel } from "@/components/layout/section-label";
import { PROJECTS } from "@/lib/projects-data";
import { ProjectCard } from "@/components/ui/project-card";

export function ProjectsSection() {
    const sectionRef = useRef<HTMLElement>(null);
    const labelRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!sectionRef.current) return;

        const prefersReducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

        if (prefersReducedMotion) {
            gsap.set(labelRef.current, { opacity: 1, y: 0 });
            return;
        }

        const ctx = gsap.context(() => {
            gsap.fromTo(
                labelRef.current,
                { opacity: 0, y: 16 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.6,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top 85%",
                        toggleActions: "play none none none",
                    },
                }
            );
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section
            ref={sectionRef}
            id="work"
            className="relative w-full pt-[10vh] md:pt-[15vh]"
        >
            {/* ═══ STICKY LAYER — ghost text + label, stays pinned while cards scroll ═══ */}
            <div
                className="sticky top-0 pointer-events-none"
                style={{ height: 0, overflow: "visible", zIndex: 0 }}
            >
                <div className="relative" style={{ height: "100vh" }}>
                    {/* Ghost text — WORK */}
                    <div
                        className="absolute pointer-events-none select-none whitespace-nowrap"
                        style={{
                            right: "64px",
                            top: ".8%",
                            color: "var(--text)",
                            opacity: 0.14,
                            fontSize: "clamp(8rem, 20vw, 18rem)",
                            fontFamily: "var(--font-display)",
                            fontWeight: 700,
                            letterSpacing: "-0.05em",
                            lineHeight: 0.85,
                            textAlign: "right",
                        }}
                        aria-hidden="true"
                    >
                        WORK
                    </div>

                    {/* Section label — pinned */}
                    <div
                        className="absolute top-[10vh] left-0 right-0 pointer-events-auto"
                        style={{ zIndex: 2 }}
                    >
                        <Container>
                            <div ref={labelRef} style={{ opacity: 1 }}>
                                <SectionLabel number="03">Work</SectionLabel>
                            </div>
                        </Container>
                    </div>
                </div>
            </div>

            {/* ═══ PROJECT CARDS — scroll naturally through the sticky layer ═══ */}
            <div className="relative pt-[18vh]" style={{ zIndex: 1 }}>
                {PROJECTS.map((project, i) => {
                    const directions: ("left" | "right")[] = ["left", "right", "left", "right"];
                    return (
                        <ProjectCard
                            key={project.id}
                            project={project}
                            direction={directions[i] ?? "left"}
                            {...(i === 0 || i === 2 ? { numberOffsetY: "45%" } : {})}
                        />
                    );
                })}
            </div>
        </section>
    );
}