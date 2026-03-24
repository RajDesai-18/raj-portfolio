"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { gsap, SplitText } from "@/lib/gsap";
import { Container } from "@/components/layout/container";
import { SectionLabel } from "@/components/layout/section-label";
import { GhostText } from "@/components/background/ghost-text";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { CONTACT_LINKS } from "@/lib/contact-data";
import { ArrowRight, Send, CheckCircle2, AlertCircle } from "lucide-react";
import { toast } from "sonner";

// ─── EmailJS Config ───
// Replace with your actual EmailJS credentials
const EMAILJS_SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!;
const EMAILJS_TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!;
const EMAILJS_PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!;

export function ContactSection() {
    const sectionRef = useRef<HTMLElement>(null);
    const headingRef = useRef<HTMLHeadingElement>(null);
    const sublineRef = useRef<HTMLParagraphElement>(null);
    const formRef = useRef<HTMLFormElement>(null);
    const dividerRef = useRef<HTMLDivElement>(null);
    const stripsRef = useRef<HTMLDivElement>(null);
    const labelRef = useRef<HTMLDivElement>(null);

    const [formState, setFormState] = useState({
        name: "",
        email: "",
        message: "",
    });
    const [sending, setSending] = useState(false);

    // ── Form handlers ──
    const handleChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            setFormState((prev) => ({ ...prev, [e.target.name]: e.target.value }));
        },
        []
    );

    const handleSubmit = useCallback(
        async (e: React.FormEvent) => {
            e.preventDefault();

            // Basic validation
            if (!formState.name.trim() || !formState.email.trim() || !formState.message.trim()) {
                toast.error("Please fill in all fields.", {
                    icon: <AlertCircle size={18} />,
                });
                return;
            }

            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formState.email)) {
                toast.error("Please enter a valid email address.", {
                    icon: <AlertCircle size={18} />,
                });
                return;
            }

            setSending(true);

            try {
                // Dynamic import for EmailJS (code-split)
                const emailjs = await import("@emailjs/browser");

                await emailjs.send(
                    EMAILJS_SERVICE_ID,
                    EMAILJS_TEMPLATE_ID,
                    {
                        name: formState.name,
                        email: formState.email,
                        message: formState.message,
                    },
                    EMAILJS_PUBLIC_KEY
                );

                toast.success("Message sent. I'll get back to you soon.", {
                    icon: <CheckCircle2 size={18} />,
                });

                setFormState({ name: "", email: "", message: "" });
            } catch {
                toast.error("Something went wrong. Try emailing me directly.", {
                    icon: <AlertCircle size={18} />,
                    description: "desai.raj1807@gmail.com",
                });
            } finally {
                setSending(false);
            }
        },
        [formState]
    );

    // ── GSAP Scroll Animations ──
    useEffect(() => {
        if (!sectionRef.current || !headingRef.current) return;

        const prefersReducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

        if (prefersReducedMotion) {
            gsap.set(
                [
                    labelRef.current,
                    headingRef.current,
                    sublineRef.current,
                    formRef.current,
                    dividerRef.current,
                    stripsRef.current,
                ],
                { opacity: 1, y: 0 }
            );
            return;
        }

        // Split heading into words
        const headingSplit = new SplitText(headingRef.current, {
            type: "words",
            wordsClass: "contact-word",
        });

        const ctx = gsap.context(() => {
            // ── Section label entrance ──
            gsap.fromTo(
                labelRef.current,
                { opacity: 0, y: 20 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.6,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top 80%",
                        toggleActions: "play none none none",
                    },
                }
            );

            // ── Heading word stagger ──
            gsap.fromTo(
                headingSplit.words,
                { opacity: 0, y: 30 },
                {
                    opacity: 1,
                    y: 0,
                    stagger: 0.04,
                    duration: 0.7,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top 70%",
                        toggleActions: "play none none none",
                    },
                }
            );

            // ── Subline fade ──
            gsap.fromTo(
                sublineRef.current,
                { opacity: 0, y: 16 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.6,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top 65%",
                        toggleActions: "play none none none",
                    },
                }
            );

            // ── Form entrance ──
            gsap.fromTo(
                formRef.current,
                { opacity: 0, y: 30 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: formRef.current,
                        start: "top 80%",
                        toggleActions: "play none none none",
                    },
                }
            );

            // ── Divider draw ──
            gsap.fromTo(
                dividerRef.current,
                { scaleX: 0 },
                {
                    scaleX: 1,
                    ease: "power2.inOut",
                    duration: 1,
                    scrollTrigger: {
                        trigger: dividerRef.current,
                        start: "top 85%",
                        toggleActions: "play none none none",
                    },
                }
            );

            // ── Link strips stagger ──
            if (stripsRef.current) {
                const strips = stripsRef.current.querySelectorAll(".contact-strip");
                gsap.fromTo(
                    strips,
                    { opacity: 0, y: 24, x: -16 },
                    {
                        opacity: 1,
                        y: 0,
                        x: 0,
                        stagger: 0.1,
                        duration: 0.6,
                        ease: "power3.out",
                        scrollTrigger: {
                            trigger: stripsRef.current,
                            start: "top 85%",
                            toggleActions: "play none none none",
                        },
                    }
                );
            }
        }, sectionRef);

        return () => {
            ctx.revert();
            headingSplit.revert();
        };
    }, []);

    return (
        <section
            ref={sectionRef}
            id="contact"
            className="relative w-full overflow-hidden py-[clamp(6rem,12vh,10rem)]"
        >
            {/* Ghost text */}
            <GhostText text="SAY HI" align="center" speed={0.45} offsetY="-2%" />

            <Container className="relative" style={{ zIndex: 1 }}>
                {/* Section label */}
                <div ref={labelRef} style={{ opacity: 0 }}>
                    <SectionLabel number="06">Contact</SectionLabel>
                </div>

                {/* ── Heading ── */}
                <h2
                    ref={headingRef}
                    className="font-display font-bold leading-[1.1] tracking-[-0.02em]"
                    style={{
                        color: "var(--text)",
                        fontSize: "clamp(2.5rem, 5vw, 4rem)",
                    }}
                >
                    Got something interesting to build, discuss, or explore?
                </h2>

                {/* ── Subline ── */}
                <p
                    ref={sublineRef}
                    className="mt-4 font-body font-medium text-xl"
                    style={{ color: "var(--text-muted)", opacity: 0 }}
                >
                    I&apos;d love to hear from you.
                </p>

                {/* ── Contact Form ── */}
                <form
                    ref={formRef}
                    onSubmit={handleSubmit}
                    className="mt-12"
                    style={{ opacity: 0 }}
                    noValidate
                >
                    {/* Name + Email row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                        <div className="space-y-2.5">
                            <Label htmlFor="contact-name">Name</Label>
                            <Input
                                id="contact-name"
                                name="name"
                                placeholder="Your name"
                                value={formState.name}
                                onChange={handleChange}
                                className="contact-field"
                                autoComplete="name"
                            />
                        </div>
                        <div className="space-y-2.5">
                            <Label htmlFor="contact-email">Email</Label>
                            <Input
                                id="contact-email"
                                name="email"
                                type="email"
                                placeholder="you@email.com"
                                value={formState.email}
                                onChange={handleChange}
                                className="contact-field"
                                autoComplete="email"
                            />
                        </div>
                    </div>

                    {/* Message */}
                    <div className="space-y-2.5 mb-8">
                        <Label htmlFor="contact-message">Message</Label>
                        <Textarea
                            id="contact-message"
                            name="message"
                            placeholder="What's on your mind?"
                            value={formState.message}
                            onChange={handleChange}
                            className="contact-field"
                        />
                    </div>

                    {/* Submit */}
                    <Button
                        type="submit"
                        disabled={sending}
                        className="contact-submit h-12 px-8 rounded-lg font-body font-medium text-[0.9375rem] transition-all duration-300 disabled:opacity-50"
                        style={{
                            backgroundColor: "var(--accent-raw)",
                            color: "var(--bg)",
                            border: "none",
                        }}
                        data-cursor-hover
                    >
                        <Send size={16} className="mr-2" />
                        {sending ? "Sending..." : "Send Message"}
                    </Button>
                </form>

                {/* ── Accent Divider ── */}
                <div
                    ref={dividerRef}
                    className="mt-16 h-0.5 w-full origin-left"
                    style={{
                        backgroundColor: "var(--accent-raw)",
                        opacity: 0.4,
                    }}
                />

                {/* ── Link Strips ── */}
                <div ref={stripsRef} className="mt-0">
                    {CONTACT_LINKS.map((link) => (
                        <a
                            key={link.id}
                            href={link.href}
                            target={link.external ? "_blank" : undefined}
                            rel={link.external ? "noopener noreferrer" : undefined}
                            className="contact-strip group"
                            data-cursor-hover
                            aria-label={`Visit ${link.name}`}
                        >
                            {/* Left: Number + Name + Icon */}
                            <div className="flex items-center gap-5">
                                <span className="contact-strip-num font-mono text-[0.6875rem] tracking-widest">
                                    {link.number}
                                </span>
                                <link.icon
                                    size={20}
                                    className="contact-strip-icon transition-colors duration-300"
                                    style={{ color: "var(--text-muted)" }}
                                />
                                <span
                                    className="contact-strip-name font-display font-semibold tracking-[0.04em] uppercase"
                                    style={{ fontSize: "clamp(1.5rem, 2.5vw, 1.75rem)" }}
                                >
                                    {link.name}
                                </span>
                            </div>

                            {/* Right: Arrow */}
                            <ArrowRight
                                size={22}
                                className="contact-strip-arrow transition-all duration-300"
                                style={{ color: "var(--text-muted)" }}
                            />
                        </a>
                    ))}
                </div>
            </Container>
        </section>
    );
}