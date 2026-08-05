export interface Tool {
  name: string;
  /** Daily driver. Rendered heavier and at full opacity. */
  core?: boolean;
}

export interface Skill {
  id: string;
  number: string;
  name: string;
  tools: Tool[];
}

export const SKILLS: Skill[] = [
  {
    id: "frontend",
    number: "01",
    name: "FRONTEND",
    tools: [
      { name: "React", core: true },
      { name: "Next.js", core: true },
      { name: "TypeScript", core: true },
      { name: "Tailwind CSS" },
      { name: "Framer Motion" },
      { name: "GSAP" },
      { name: "shadcn/ui" },
      { name: "Recharts" },
      { name: "Flutter" },
      { name: "Figma" },
    ],
  },
  {
    id: "backend",
    number: "02",
    name: "BACKEND",
    tools: [
      { name: "Node.js", core: true },
      { name: "FastAPI", core: true },
      { name: "PostgreSQL", core: true },
      { name: "Redis", core: true },
      { name: "BullMQ", core: true },
      { name: "Express.js" },
      { name: "REST APIs" },
      { name: "MongoDB" },
      { name: "Prisma ORM" },
      { name: "OAuth 2.0" },
      { name: "JWT" },
    ],
  },
  {
    id: "ai",
    number: "03",
    name: "AI / ML",
    tools: [
      { name: "LLMs", core: true },
      { name: "FAISS", core: true },
      { name: "OpenAI / Gemini APIs" },
      { name: "Sentence Transformers" },
      { name: "Semantic Search" },
      { name: "Prompt Engineering" },
      { name: "NLP" },
      { name: "Scikit-learn" },
      { name: "PyTorch" },
    ],
  },
  {
    id: "architecture",
    number: "04",
    name: "ARCHITECTURE",
    tools: [
      { name: "System Design", core: true },
      { name: "Async Pipelines", core: true },
      { name: "API Design" },
      { name: "Real-time Data Flows" },
      { name: "Multi-tenant Systems" },
      { name: "Database Design" },
    ],
  },
  {
    id: "tooling",
    number: "05",
    name: "TOOLING",
    tools: [
      { name: "Git", core: true },
      { name: "Docker", core: true },
      { name: "GitHub Actions" },
      { name: "CI/CD" },
      { name: "Vitest" },
      { name: "React Testing Library" },
      { name: "WCAG 2.1 AA" },
      { name: "Vercel" },
    ],
  },
];

/** Total entries, derived so the header count can never drift from the data. */
export const SKILL_COUNT = SKILLS.reduce((n, s) => n + s.tools.length, 0);
