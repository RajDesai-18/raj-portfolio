export interface Project {
  id: string;
  number: string;
  name: string;
  oneLiner: string;
  whyIBuiltIt: string;
  pills: string[];
  image?: {
    src: string;
    alt: string;
  };
  links: {
    live?: string;
    github: string;
  };
}

export const PROJECTS: Project[] = [
  {
    id: "yoru",
    number: "01",
    name: "YORU",
    oneLiner:
      "A cinematic ambient web experience built to make listening feel immersive, quiet, and intentional.",
    whyIBuiltIt:
      "I wanted to explore what happens when you design a music experience around atmosphere instead of utility. Yoru treats sound as environment, not content.",
    pills: ["Next.js 14", "TypeScript", "Framer Motion", "Howler.js", "Tailwind", "shadcn/ui"],
    image: {
      src: "/images/yoru-project.png",
      alt: "Yoru — cinematic ambient web experience",
    },
    links: {
      live: "https://yoru-sandy.vercel.app",
      github: "https://github.com/RajDesai-18/yoru",
    },
  },
  {
    id: "pr-sensei",
    number: "02",
    name: "PR SENSEI",
    oneLiner:
      "An AI-powered GitHub review tool built around async workflows and developer productivity.",
    whyIBuiltIt:
      "Code reviews are a bottleneck. I wanted to build something that gives developers fast, structured feedback without waiting on teammates.",
    pills: [
      "Next.js",
      "TypeScript",
      "FastAPI",
      "Redis",
      "BullMQ",
      "PostgreSQL",
      "OpenAI API",
      "OAuth 2.0",
    ],
    links: {
      github: "https://github.com/RajDesai-18/pr-sensei",
    },
  },
  {
    id: "llm-cookbook",
    number: "03",
    name: "LLM COOKBOOK",
    oneLiner:
      "A semantic recipe search system combining fast retrieval, embeddings, and structured LLM generation.",
    whyIBuiltIt:
      "I was curious how far you could push semantic search with embeddings and structured generation. Recipes were the perfect domain to test that.",
    pills: [
      "Python",
      "FastAPI",
      "FAISS",
      "Sentence Transformers",
      "OpenAI API",
      "React",
      "Tailwind",
    ],
    links: {
      github: "https://github.com/RajDesai-18/llm-cookbook",
    },
  },
  {
    id: "financial-saas",
    number: "04",
    name: "FINANCIAL SAAS",
    oneLiner:
      "A responsive finance dashboard built around real-time data flows, secure auth, and product-focused UX.",
    whyIBuiltIt:
      "I wanted to build a full product, not just a feature. This was about stitching together auth, real-time data, and polished UI into something that feels complete.",
    pills: [
      "Next.js",
      "TypeScript",
      "Prisma",
      "PostgreSQL",
      "Clerk Auth",
      "Tailwind",
      "shadcn/ui",
      "Recharts",
    ],
    links: {
      github: "https://github.com/RajDesai-18/financial-saas",
    },
  },
];
