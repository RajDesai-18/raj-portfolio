"use client";

import { CareerSection } from "@/components/sections/career-section";
import { EXPERIENCE_ENTRIES } from "@/lib/experience-data";

export function ExperienceSection() {
  return <CareerSection id="experience" entries={EXPERIENCE_ENTRIES} />;
}
