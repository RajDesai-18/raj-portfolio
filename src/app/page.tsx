/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { ScrollTrigger } from "@/lib/gsap";
import { LoadingScreen } from "@/components/loading/loading-screen";
import { HeroSection } from "@/components/sections/hero-section";
import { Navigation } from "@/components/layout/navigation";
import { SectionMarquee } from "@/components/layout/section-marquee";
import { AboutSection } from "@/components/sections/about-section";
import { SkillsSection } from "@/components/sections/skills-section";
import { ProjectsSection } from "@/components/sections/project-section";
import { ExperienceSection } from "@/components/sections/experience-section";
import { EducationSection } from "@/components/sections/education-section";
import { ContactSection } from "@/components/sections/contact-section";
import { FooterSection } from "@/components/sections/footer-section";

export default function Home() {
  const hasChecked = useRef(false);
  const [isReturningVisitor, setIsReturningVisitor] = useState<boolean | null>(null);
  const [showLoading, setShowLoading] = useState(false);
  const [heroRevealed, setHeroRevealed] = useState(false);
  const [heroReady, setHeroReady] = useState(false);

  useEffect(() => {
    if (hasChecked.current) return;
    hasChecked.current = true;
    const returning = !!sessionStorage.getItem("raj-portfolio-loaded");
    setIsReturningVisitor(returning);

    if (returning) {
      // Returning visitor: skip everything
      setHeroRevealed(true);
      setHeroReady(true);
    } else {
      // First visit: show loading screen
      setShowLoading(true);
    }
  }, []);

  // ── LoadingScreen completed ──
  const handleLoadingComplete = useCallback(() => {
    setShowLoading(false);
    setHeroRevealed(true);
  }, []);

  // ── Hero entrance animation completed ──
  const handleHeroReady = useCallback(() => {
    setHeroReady(true);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        ScrollTrigger.refresh();
      });
    });
  }, []);

  if (isReturningVisitor === null) return null;

  return (
    <>
      {/* ─── Page-level Loading Screen ─── */}
      {showLoading && <LoadingScreen onComplete={handleLoadingComplete} />}

      <Navigation visible={heroReady} />

      <HeroSection
        revealed={heroRevealed}
        skipReveal={isReturningVisitor}
        onReady={handleHeroReady}
      />

      {/* ─── Marquee: About ─── */}
      <SectionMarquee text="ABOUT" direction="left" speed={22} />

      {/* ─── About ─── */}
      <AboutSection />

      {/* ─── Marquee: Skills ─── */}
      <SectionMarquee text="SKILLS" direction="right" speed={18} />

      {/* ─── Skills ─── */}
      <SkillsSection />

      {/* ─── Marquee: Work ─── */}
      <SectionMarquee text="WORK" direction="left" speed={16} />

      {/* ─── Work ─── */}
      <ProjectsSection />

      {/* ─── Marquee: Experience ─── */}
      <SectionMarquee text="EXPERIENCE" direction="right" speed={24} />

      {/* ─── Experience ─── */}
      <ExperienceSection />

      <SectionMarquee text="EDUCATION" direction="left" speed={24} />

      {/* ─── Education ─── */}
      <EducationSection />

      {/* ─── Marquee: Contact ─── */}
      <SectionMarquee text="GET IN TOUCH" direction="right" speed={26} />

      {/* ─── Contact ─── */}
      <ContactSection />

      {/* ─── Footer ─── */}
      <FooterSection />
    </>
  );
}
