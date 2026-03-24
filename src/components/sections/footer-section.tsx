"use client";

import { useEffect, useRef, useCallback } from "react";
import { gsap } from "@/lib/gsap";
import { Container } from "@/components/layout/container";
import { Magnetic } from "@/components/ui/magnetic";
import { ArrowUp } from "lucide-react";

export function FooterSection() {
    const footerRef = useRef<HTMLElement>(null);
    const ghostRef = useRef<HTMLDivElement>(null);
    const barRef = useRef<HTMLDivElement>(null);

    // ── Back to top ──
    const scrollToTop = useCallback(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, []);

    // ── GSAP Entrance ──
    useEffect(() => {
        if (!footerRef.current) return;

        const prefersReducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

        if (prefersReducedMotion) {
            gsap.set([ghostRef.current, barRef.current], { opacity: 1 });
            return;
        }

        const ctx = gsap.context(() => {
            // Ghost name fade in
            gsap.fromTo(
                ghostRef.current,
                { opacity: 0 },
                {
                    opacity: 1,
                    duration: 1.2,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: footerRef.current,
                        start: "top 85%",
                        toggleActions: "play none none none",
                    },
                }
            );

            // Footer bar fade up
            gsap.fromTo(
                barRef.current,
                { opacity: 0, y: 16 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.7,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: footerRef.current,
                        start: "top 80%",
                        toggleActions: "play none none none",
                    },
                }
            );
        }, footerRef);

        return () => ctx.revert();
    }, []);

    return (
        <footer
            ref={footerRef}
            className="relative w-full pb-8 pt-4 overflow-hidden"
            style={{ zIndex: 1 }}
        >
            <Container>
                {/* ── Ghost Bookend: RAJ DESAI ── */}
                <div
                    ref={ghostRef}
                    className="pointer-events-none select-none text-center"
                    style={{ opacity: 0 }}
                    aria-hidden="true"
                >
                    <span
                        className="font-display font-bold block leading-[0.85] tracking-[-0.04em]"
                        style={{
                            color: "var(--text)",
                            opacity: 0.085,
                            fontSize: "clamp(5rem, 18vw, 16.75rem)",
                        }}
                    >
                        RAJ DESAI
                    </span>
                </div>

                {/* ── Footer Bar ── */}
                <div
                    ref={barRef}
                    className="mt-8 pt-6 flex items-center justify-between"
                    style={{
                        borderTop: "1px solid var(--border-custom)",
                        opacity: 0,
                    }}
                >
                    {/* Left: Copyright */}
                    <p
                        className="font-mono text-[0.625rem] uppercase tracking-[0.1em]"
                        style={{ color: "var(--text-muted)" }}
                    >
                        All rights reserved &copy; {new Date().getFullYear()} Raj Desai
                    </p>

                    {/* Center: Back to top */}
                    <Magnetic strength={0.3} radius={60}>
                        <button
                            onClick={scrollToTop}
                            className="footer-top-btn flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300"
                            style={{
                                border: "1.5px solid var(--border-custom)",
                                color: "var(--text-muted)",
                            }}
                            aria-label="Back to top"
                            data-cursor-hover
                        >
                            <ArrowUp size={16} />
                        </button>
                    </Magnetic>

                    {/* Right: Credit */}
                    <p
                        className="font-mono text-[0.625rem] uppercase tracking-[0.1em]"
                        style={{ color: "var(--text-muted)" }}
                    >
                        Designed &amp; built with{" "}
                        <span style={{ color: "var(--accent-raw)" }}>&#10084;</span> by Raj
                    </p>
                </div>
            </Container>
        </footer>
    );
}