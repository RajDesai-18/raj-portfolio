"use client";

import { TimelineSection } from "@/components/sections/timeline-section";
import { EDUCATION_ENTRIES } from "@/lib/education-data";

export function EducationSection() {
    return (
        <TimelineSection
            id="education"
            number="05"
            label="Education"
            ghostText="EDU"
            ghostAlign="right"
            entries={EDUCATION_ENTRIES}
        />
    );
}