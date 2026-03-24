"use client";

import { TimelineSection } from "@/components/sections/timeline-section";
import { EXPERIENCE_ENTRIES } from "@/lib/experience-data";

export function ExperienceSection() {
  return (
    <TimelineSection
      id="experience"
      number="04"
      label="Experience"
      ghostText="EXP"
      ghostAlign="left"
      entries={EXPERIENCE_ENTRIES}
    />
  );
}
