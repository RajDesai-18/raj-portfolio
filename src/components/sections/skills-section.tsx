"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { Container } from "@/components/layout/container";
import { SectionLabel } from "@/components/layout/section-label";
import { SKILLS } from "@/lib/skills-data";

// ── Sticky float: holds at each panel, fast transitions between ──
function stickyFloat(innerProgress: number, count: number): number {
    const segments = count - 1;
    const raw = innerProgress * segments;
    const idx = Math.min(Math.floor(raw), segments - 1);
    const frac = raw - idx;

    // 65% hold, 35% transition
    const holdPortion = 0.65;

    if (frac <= holdPortion) {
        return idx;
    }

    const transT = (frac - holdPortion) / (1 - holdPortion);
    const eased = transT * transT * (3 - 2 * transT);
    return idx + eased;
}

// ── Math-driven width interpolation ──
function calcPanelWidths(progress: number, count: number): number[] {
    const expandedW = 52;
    const compressedW = (100 - expandedW) / (count - 1);
    const baseW = 100 / count;

    const entryZone = 0.06;
    const exitZone = 0.04;

    if (progress <= entryZone) {
        const t = progress / entryZone;
        const easedT = t * t * (3 - 2 * t);
        return Array.from({ length: count }, (_, i) => {
            const target = i === 0 ? expandedW : compressedW;
            return baseW + (target - baseW) * easedT;
        });
    }

    if (progress >= 1 - exitZone) {
        return Array.from({ length: count }, (_, i) =>
            i === count - 1 ? expandedW : compressedW
        );
    }

    const innerProgress = (progress - entryZone) / (1 - entryZone - exitZone);
    const activeFloat = stickyFloat(innerProgress, count);

    // Interpolate between two valid panel states
    // This guarantees widths always sum to 100%
    const lower = Math.floor(activeFloat);
    const upper = Math.min(lower + 1, count - 1);
    const blend = activeFloat - lower;

    return Array.from({ length: count }, (_, i) => {
        if (lower === upper) {
            return i === lower ? expandedW : compressedW;
        }
        const lowerW = i === lower ? expandedW : compressedW;
        const upperW = i === upper ? expandedW : compressedW;
        return lowerW + (upperW - lowerW) * blend;
    });
}

function getActiveIndex(progress: number, count: number): number {
    if (progress <= 0.03) return -1;
    const entryZone = 0.06;
    const exitZone = 0.04;
    if (progress <= entryZone) return 0;
    if (progress >= 1 - exitZone) return count - 1;
    const innerProgress = (progress - entryZone) / (1 - entryZone - exitZone);
    return Math.round(stickyFloat(innerProgress, count));
}

export function SkillsSection() {
    const sectionRef = useRef<HTMLElement>(null);
    const pinWrapRef = useRef<HTMLDivElement>(null);
    const labelRef = useRef<HTMLDivElement>(null);
    const accordionRef = useRef<HTMLDivElement>(null);
    const panelRefs = useRef<(HTMLDivElement | null)[]>([]);
    const expandedRefs = useRef<(HTMLDivElement | null)[]>([]);
    const compressedRefs = useRef<(HTMLDivElement | null)[]>([]);
    const ghostRef = useRef<HTMLDivElement>(null);

    const [activeIndex, setActiveIndex] = useState(-1);
    const isTouchRef = useRef(false);
    const isClickedRef = useRef(false);
    const clickedIndexRef = useRef(-1);

    useEffect(() => {
        isTouchRef.current = window.matchMedia("(pointer: coarse)").matches;
    }, []);

    // ── Apply widths directly to DOM ──
    const applyWidths = useCallback((widths: number[], activeIdx: number) => {
        const count = SKILLS.length;
        for (let i = 0; i < count; i++) {
            const panel = panelRefs.current[i];
            if (!panel) continue;
            panel.style.width = `${widths[i]}%`;

            const expanded = expandedRefs.current[i];
            const compressed = compressedRefs.current[i];

            const expandRatio = Math.max(
                0,
                (widths[i] - 100 / count) / (52 - 100 / count)
            );
            const easedOpacity = expandRatio * expandRatio;

            if (expanded) {
                expanded.style.opacity = `${easedOpacity}`;
                expanded.style.pointerEvents = activeIdx === i ? "auto" : "none";
            }
            if (compressed) {
                compressed.style.opacity = `${1 - easedOpacity}`;
            }
        }
    }, []);

    // ── Scroll-driven pin ──
    useEffect(() => {
        if (!sectionRef.current || !pinWrapRef.current || !accordionRef.current)
            return;
        if (window.innerWidth < 1024) return;

        const prefersReducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

        if (prefersReducedMotion) {
            gsap.set(labelRef.current, { opacity: 1 });
            gsap.set(accordionRef.current, { opacity: 1 });
            return;
        }

        const count = SKILLS.length;
        const initialWidths = Array(count).fill(100 / count);
        applyWidths(initialWidths, -1);

        const ctx = gsap.context(() => {
            // Label entrance
            gsap.fromTo(
                labelRef.current,
                { opacity: 0, y: 20 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.7,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top 80%",
                        toggleActions: "play none none none",
                    },
                }
            );

            // Accordion entrance
            gsap.fromTo(
                accordionRef.current,
                { opacity: 0, y: 40 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.9,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top 70%",
                        toggleActions: "play none none none",
                    },
                }
            );

            // Ghost parallax
            if (ghostRef.current) {
                gsap.fromTo(
                    ghostRef.current,
                    { y: 80 },
                    {
                        y: -80,
                        ease: "none",
                        scrollTrigger: {
                            trigger: sectionRef.current,
                            start: "top bottom",
                            end: "bottom top",
                            scrub: true,
                        },
                    }
                );
            }

            // Pin
            const totalScroll = count * 100;

            ScrollTrigger.create({
                trigger: sectionRef.current,
                start: "top top",
                end: `+=${totalScroll}%`,
                pin: pinWrapRef.current,
                pinSpacing: true,
            });

            // Scroll-driven widths
            ScrollTrigger.create({
                trigger: sectionRef.current,
                start: "top top",
                end: `+=${totalScroll}%`,
                onUpdate: (self) => {
                    // If user clicked a panel, don't override
                    if (isClickedRef.current) return;

                    const progress = self.progress;
                    const widths = calcPanelWidths(progress, count);
                    const activeIdx = getActiveIndex(progress, count);

                    applyWidths(widths, activeIdx);
                    setActiveIndex(activeIdx);
                },
            });
        }, sectionRef);

        return () => ctx.revert();
    }, [applyWidths]);

    // ── Click to expand (override scroll) ──
    const handleClick = useCallback(
        (index: number) => {
            if (window.innerWidth < 1024) return;

            const count = SKILLS.length;
            const expandedW = 52;
            const compressedW = (100 - expandedW) / (count - 1);

            // If clicking the same panel, release back to scroll control
            if (isClickedRef.current && clickedIndexRef.current === index) {
                isClickedRef.current = false;
                clickedIndexRef.current = -1;
                // Scroll will resume on next tick
                return;
            }

            isClickedRef.current = true;
            clickedIndexRef.current = index;

            const targetWidths = Array.from({ length: count }, (_, i) =>
                i === index ? expandedW : compressedW
            );

            // Animate to clicked state
            SKILLS.forEach((_, i) => {
                const panel = panelRefs.current[i];
                if (!panel) return;

                gsap.to(panel, {
                    width: `${targetWidths[i]}%`,
                    duration: 0.6,
                    ease: "power3.inOut",
                    overwrite: "auto",
                });

                const expanded = expandedRefs.current[i];
                const compressed = compressedRefs.current[i];
                if (expanded) {
                    gsap.to(expanded, {
                        opacity: i === index ? 1 : 0,
                        duration: 0.4,
                        ease: "power2.inOut",
                        overwrite: "auto",
                    });
                    expanded.style.pointerEvents = i === index ? "auto" : "none";
                }
                if (compressed) {
                    gsap.to(compressed, {
                        opacity: i === index ? 0 : 1,
                        duration: 0.4,
                        ease: "power2.inOut",
                        overwrite: "auto",
                    });
                }
            });

            setActiveIndex(index);
        },
        []
    );

    // Release click lock on scroll
    useEffect(() => {
        const handleScroll = () => {
            if (isClickedRef.current) {
                isClickedRef.current = false;
                clickedIndexRef.current = -1;
            }
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <section
            ref={sectionRef}
            id="skills"
            className="relative w-full overflow-hidden"
        >
            <div
                ref={pinWrapRef}
                className="relative w-full"
                style={{ height: "100vh" }}
            >
                {/* Ghost text — top-left */}
                <div
                    ref={ghostRef}
                    className="absolute pointer-events-none select-none whitespace-nowrap"
                    style={{
                        top: "10%",
                        left: "64px",
                        color: "var(--text)",
                        opacity: 0.05,
                        fontSize: "clamp(8rem, 20vw, 18rem)",
                        fontFamily: "var(--font-display)",
                        fontWeight: 700,
                        letterSpacing: "-0.05em",
                        lineHeight: 0.85,
                        zIndex: 0,
                    }}
                    aria-hidden="true"
                >
                    SKILLS
                </div>

                {/* Content layer */}
                <div
                    className="absolute inset-0 flex flex-col"
                    style={{ zIndex: 1 }}
                >
                    {/* Label */}
                    <div style={{ padding: "clamp(2rem, 4vh, 3.5rem) 0 0" }}>
                        <Container>
                            <div ref={labelRef} style={{ opacity: 0 }}>
                                <SectionLabel number="02">What I Do</SectionLabel>
                            </div>
                        </Container>
                    </div>

                    {/* ─── Desktop: Full-viewport Horizontal Accordion ─── */}
                    <div
                        className="hidden lg:block flex-1"
                        style={{ padding: "0.75rem 64px 1.5rem" }}
                    >
                        <div
                            ref={accordionRef}
                            className="flex w-full h-full overflow-hidden"
                            style={{ opacity: 0 }}
                        >
                            {SKILLS.map((skill, i) => (
                                <div
                                    key={skill.id}
                                    ref={(el) => {
                                        panelRefs.current[i] = el;
                                    }}
                                    className="skill-h-panel relative h-full shrink-0 overflow-hidden"
                                    style={{
                                        width: `${100 / SKILLS.length}%`,
                                        borderRight:
                                            i < SKILLS.length - 1
                                                ? "1px solid var(--text)"
                                                : "none",
                                    }}
                                    role="button"
                                    tabIndex={0}
                                    aria-expanded={activeIndex === i}
                                    aria-label={`${skill.name} skill details`}
                                    data-cursor-hover
                                    onClick={() => handleClick(i)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter" || e.key === " ") {
                                            e.preventDefault();
                                            handleClick(i);
                                        }
                                    }}
                                >
                                    {/* ── Compressed state ── */}
                                    <div
                                        ref={(el) => {
                                            compressedRefs.current[i] = el;
                                        }}
                                        className="absolute inset-0 flex flex-col items-center"
                                        style={{
                                            padding:
                                                "clamp(1.25rem, 2.5vh, 2rem) 0 clamp(2.5rem, 5vh, 4rem)",
                                        }}
                                    >
                                        {/* Number — horizontal, top */}
                                        <span
                                            className="font-mono tracking-[0.14em] uppercase"
                                            style={{
                                                fontSize: "clamp(0.6875rem, 0.85vw, 0.8125rem)",
                                                color: "var(--accent-raw)",
                                            }}
                                        >
                                            {skill.number}
                                        </span>

                                        {/* Spacer */}
                                        <div className="flex-1" />

                                        {/* Name — vertical, bottom */}
                                        <span
                                            className="font-display font-bold tracking-[-0.02em]"
                                            style={{
                                                fontSize: "clamp(2rem, 3vw, 3rem)",
                                                color: "var(--text)",
                                                opacity: 0.3,
                                                writingMode: "vertical-rl",
                                                transform: "rotate(180deg)",
                                                whiteSpace: "nowrap",
                                            }}
                                        >
                                            {skill.name}
                                        </span>
                                    </div>

                                    {/* ── Expanded state ── */}
                                    <div
                                        ref={(el) => {
                                            expandedRefs.current[i] = el;
                                        }}
                                        className="absolute inset-0 flex flex-col justify-between"
                                        style={{
                                            padding:
                                                "clamp(1.5rem, 3vh, 2.5rem) clamp(2rem, 3vw, 3rem) clamp(1.5rem, 3vh, 2.5rem)",
                                            opacity: 0,
                                        }}
                                    >
                                        {/* Top: number + large name */}
                                        <div>
                                            <span
                                                className="font-mono tracking-[0.12em] uppercase"
                                                style={{
                                                    fontSize: "clamp(0.6875rem, 0.85vw, 0.8125rem)",
                                                    color: "var(--accent-raw)",
                                                }}
                                            >
                                                {skill.number}
                                            </span>
                                            <h3
                                                className="font-display font-bold leading-[0.9] tracking-[-0.04em] mt-4"
                                                style={{
                                                    fontSize: "clamp(4.5rem, 8vw, 7.5rem)",
                                                    color: "var(--text)",
                                                }}
                                            >
                                                {skill.name}
                                            </h3>
                                        </div>

                                        {/* Middle: description (matches About paragraph size) */}
                                        <p
                                            className="font-body font-medium leading-[1.5] tracking-[-0.01em]"
                                            style={{
                                                color: "var(--text)",
                                                fontSize: "clamp(1.375rem, 2.8vw, 2rem)",
                                                maxWidth: "36rem",
                                            }}
                                        >
                                            {skill.description}
                                        </p>

                                        {/* Bottom: tech boxes */}
                                        <div className="flex flex-wrap gap-3">
                                            {skill.pills.map((pill) => (
                                                <span
                                                    key={pill}
                                                    className="skill-box font-mono tracking-[0.04em] uppercase rounded-lg"
                                                    style={{
                                                        fontSize: "clamp(0.75rem, 1vw, 0.875rem)",
                                                        padding: "0.625rem 1rem",
                                                        color: "var(--text)",
                                                    }}
                                                >
                                                    {pill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Active accent line — top */}
                                    <div
                                        className="absolute top-0 left-3 right-3 h-0.5"
                                        style={{
                                            backgroundColor: "var(--accent-raw)",
                                            opacity: activeIndex === i ? 1 : 0,
                                            transform:
                                                activeIndex === i ? "scaleX(1)" : "scaleX(0)",
                                            transformOrigin: "left",
                                            transition:
                                                "transform 0.5s cubic-bezier(0.65, 0, 0.35, 1), opacity 0.35s ease",
                                        }}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ─── Mobile: Vertical Accordion ─── */}
                    <div className="lg:hidden flex-1 overflow-y-auto px-6 pt-4">
                        {SKILLS.map((skill, i) => {
                            const isActive = activeIndex === i;
                            return (
                                <div key={skill.id}>
                                    <div
                                        className="h-px w-full"
                                        style={{
                                            backgroundColor: "var(--text)",
                                            opacity: 0.12,
                                        }}
                                    />
                                    <div
                                        className="py-5"
                                        role="button"
                                        tabIndex={0}
                                        aria-expanded={isActive}
                                        aria-label={`${skill.name} skill details`}
                                        onClick={() =>
                                            setActiveIndex((prev) => (prev === i ? -1 : i))
                                        }
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter" || e.key === " ") {
                                                e.preventDefault();
                                                setActiveIndex((prev) => (prev === i ? -1 : i));
                                            }
                                        }}
                                    >
                                        <div className="flex items-baseline gap-3">
                                            <span
                                                className="font-mono text-[0.625rem] tracking-[0.12em] uppercase"
                                                style={{ color: "var(--accent-raw)" }}
                                            >
                                                {skill.number}
                                            </span>
                                            <h3
                                                className="font-display font-bold leading-none tracking-[-0.02em]"
                                                style={{
                                                    fontSize: "clamp(1.75rem, 7vw, 2.5rem)",
                                                    color: isActive
                                                        ? "var(--accent-raw)"
                                                        : "var(--text)",
                                                    transition: "color 0.35s ease",
                                                }}
                                            >
                                                {skill.name}
                                            </h3>
                                        </div>
                                        <div
                                            className="skill-mobile-expand"
                                            data-expanded={isActive ? "true" : "false"}
                                        >
                                            <div>
                                                <div className="skill-mobile-reveal pt-4 pb-1">
                                                    <p
                                                        className="font-body font-medium text-[1.0625rem] leading-relaxed"
                                                        style={{ color: "var(--text)" }}
                                                    >
                                                        {skill.description}
                                                    </p>
                                                    <div className="flex flex-wrap gap-2 mt-4">
                                                        {skill.pills.map((pill) => (
                                                            <span
                                                                key={pill}
                                                                className="skill-box font-mono text-[0.6875rem] tracking-[0.04em] uppercase px-3 py-1.5 rounded-lg"
                                                                style={{ color: "var(--text)" }}
                                                            >
                                                                {pill}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                        <div
                            className="h-px w-full"
                            style={{ backgroundColor: "var(--text)", opacity: 0.12 }}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}