export interface Skill {
  id: string;
  number: string;
  name: string;
  description: string;
  pills: string[];
}

export const SKILLS: Skill[] = [
  {
    id: "frontend",
    number: "01",
    name: "FRONTEND",
    description: "",
    pills: [
      "React",
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "Framer Motion",
      "GSAP",
      "shadcn/ui",
      "Recharts",
      "Flutter",
      "Figma",
    ],
  },
  {
    id: "backend",
    number: "02",
    name: "BACKEND",
    description: "",
    pills: [
      "Node.js",
      "Express.js",
      "FastAPI",
      "REST APIs",
      "Redis",
      "BullMQ",
      "PostgreSQL",
      "MongoDB",
      "Prisma ORM",
      "OAuth 2.0",
      "JWT",
    ],
  },
  {
    id: "ai",
    number: "03",
    name: "AI / ML",
    description: "",
    pills: [
      "LLMs",
      "OpenAI/Gemini APIs",
      "FAISS",
      "Sentence Transformers",
      "Prompt Engineering",
      "Semantic Search",
      "NLP",
      "Scikit-learn",
      "PyTorch",
    ],
  },
  {
    id: "design",
    number: "04",
    name: "ARCHITECTURE",
    description: "",
    pills: [
      "System Design",
      "API Design",
      "Async Pipelines",
      "Multi-tenant Systems",
      "Real-time Data Flows",
      "Database Design",
    ],
  },
  {
    id: "mobile",
    number: "05",
    name: "TOOLING",
    description: "",
    pills: [
      "Git",
      "GitHub Actions",
      "Docker",
      "CI/CD",
      "Vitest",
      "React Testing Library",
      "WCAG 2.1 AA",
      "Vercel",
    ],
  },
];
