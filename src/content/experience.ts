export type ExperienceItem = {
  title: string;
  org: string;
  date: string;
  bullets: string[];
  logo?: string;
  type: "work" | "education";
};

export const experience: ExperienceItem[] = [
  {
    type: "work",
    title: "AI/GenAI & Forward-Deployed Engineer",
    org: "Argusoft India Ltd. · Bidstream",
    date: "Jul 2024 — Present",
    logo: "/media/argusoft-logo.png",
    bullets: [
      "Architected an autonomous multi-agent proposal system (Google ADK, Vertex AI) — Planner, Writer and Reviewer agents with RAG, multimodal ingestion and context caching. Proposal rework fell from ~50% of sections to ~5% minor edits.",
      "Built a 6-stage agentic scoring engine — rubric extraction, compliance auditing, persona-driven evaluation — cutting manual compliance review effort by 95%.",
      "Designed the LLM caching platform on Vertex AI CachedContent, cutting generation costs 80%; standardised 100+ prompt templates for a further 20% via implicit caching.",
      "Shipped a GraphRAG search layer for natural-language structured queries across 100,000+ RFP insights, replacing noisy vector retrieval.",
      "LLMOps observability across 5+ production pipelines — 1B+ tokens, quality and cost tracked into daily PostgreSQL reports.",
      "Fault-tolerant multimodal ingestion for 1M+-token documents: latency −60%, token cost −50%.",
    ],
  },
  {
    type: "work",
    title: "Programmer Analyst Intern",
    org: "Argusoft India Ltd.",
    date: "Jan 2024 — Jun 2024",
    logo: "/media/argusoft-logo.png",
    bullets: [
      "Intensive AI/ML upskilling, then joined the RFP automation team's earliest pipeline work.",
      "Built Playwright scrapers, then engineered a SeleniumBase pipeline that defeated advanced bot detection (Cloudflare) on key procurement portals.",
      "Built HealthSync — diet & health tracking POC (Angular 15, Node.js, PostgreSQL).",
    ],
  },
  {
    type: "education",
    title: "B.Tech — Information Technology",
    org: "Vishwakarma Government Engineering College (VGEC)",
    date: "2021 — 2024",
    logo: "/media/vgec-logo.png",
    bullets: [
      "9.11 CGPA. 2nd Prize, TechXIT 2022 Web Developer Competition.",
    ],
  },
  {
    type: "education",
    title: "Diploma — Information Technology",
    org: "Tolani FG Polytechnic",
    date: "2018 — 2021",
    bullets: ["Foundations in programming, databases and web development."],
  },
];
