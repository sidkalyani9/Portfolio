export type ProjectPriority = "P0" | "P1" | "P2";
export type ProjectLayout = "full" | "half" | "text";

export type Project = {
  slug: string;
  title: string;
  priority: ProjectPriority;
  problem: string;
  role: string;
  tech: string[];
  outcome: string;
  links: { label: string; href: string }[];
  cover: string | null;
  layout: ProjectLayout;
  confidential?: boolean;
  featured?: boolean;
};

export const projects: Project[] = [
  {
    slug: "bidstream-ai",
    title: "Bidstream — RFP intelligence platform",
    priority: "P0",
    featured: true,
    layout: "text",
    cover: null,
    confidential: true,
    problem:
      "High-stakes bidding needs autonomous proposal generation, agentic compliance scoring, and retrieval over a massive RFP corpus — without one-off chat prompts.",
    role: "Multi-agent generation (Google ADK), 6-stage scoring engine, GraphRAG search, caching infrastructure, batch validation, LLMOps observability",
    tech: ["Google ADK", "Vertex AI", "Gemini", "GraphRAG", "FastAPI", "PostgreSQL"],
    outcome:
      "~50% → ~5% proposal rework · −95% compliance-review effort · −80% inference cost · 1B+ tokens observed across 5+ production pipelines.",
    links: [{ label: "Case study", href: "/work/bidstream-ai" }],
  },
  {
    slug: "grantflow",
    title: "GrantFlow · VibelySane",
    priority: "P0",
    featured: true,
    layout: "half",
    cover: "/media/hackathon.jpeg",
    problem:
      "Ship an industry-standard grant workflow product — including LLM scoring and a form-filling chatbot — in about eight hours.",
    role: "Team of 4 (VibelySane) — LLM integration, red-team scoring prompts, chatbot guardrails",
    tech: ["Claude Code", "LLM integration", "Prompt engineering"],
    outcome:
      "Organisation hackathon winner through prioritisation and resilient LLM UX.",
    links: [{ label: "Case study", href: "/work/grantflow" }],
  },
  {
    slug: "mealdash",
    title: "MealDash",
    priority: "P1",
    featured: true,
    layout: "full",
    cover: "/media/mealdash.webp",
    problem:
      "Food delivery needs a fluid mobile UX for menus, cart state, and delivery location.",
    role: "React Native developer — front-end product surfaces",
    tech: ["React Native", "Redux", "Maps"],
    outcome:
      "Mobile app with featured sections, Redux cart, menu flows, and delivery map pin behaviour.",
    links: [
      { label: "Case study", href: "/work/mealdash" },
      { label: "GitHub", href: "https://github.com/sidkalyani9/MealDash" },
    ],
  },
  {
    slug: "authenticated-scraping-automation",
    title: "Data Collection Platform",
    priority: "P0",
    featured: true,
    layout: "text",
    cover: null,
    confidential: true,
    problem:
      "RFP intelligence needs continuous collection from 30+ government and enterprise portals — through bot detection, CAPTCHAs and 2FA — without hardcoded secrets.",
    role: "Owned the scraping fleet and end-to-end automated authentication",
    tech: ["Playwright", "SeleniumBase", "Gemini multimodal", "AWS Secrets Manager", "Gmail API"],
    outcome:
      "30+ production scrapers with multimodal CAPTCHA solving; Secrets Manager credentials with Gmail API OTP handling for automated 2FA.",
    links: [
      {
        label: "Case study",
        href: "/work/authenticated-scraping-automation",
      },
    ],
  },
  {
    slug: "meeting-intelligence-pipeline",
    title: "MeghDoot Audio Intelligence",
    priority: "P0",
    featured: true,
    layout: "text",
    cover: null,
    confidential: true,
    problem:
      "An internal messaging platform needed meeting audio turned into searchable, attributable conversation transcripts automatically.",
    role: "Owned the end-to-end audio signal pipeline",
    tech: ["Audio processing", "Speech-to-text", "Speaker diarization"],
    outcome:
      "Noise reduction, silence trimming, STT and diarization auto-generate searchable transcripts for an internal Slack/Teams-style platform.",
    links: [
      { label: "Case study", href: "/work/meeting-intelligence-pipeline" },
    ],
  },
  {
    slug: "health-sync",
    title: "Health Sync",
    priority: "P1",
    featured: true,
    layout: "half",
    cover: "/media/healthsync.webp",
    problem:
      "People need a practical way to track diets, calories, BMI, and history with verified diet guidance.",
    role: "Full-stack builder (internship / early career project)",
    tech: ["Angular", "Node.js", "Chart.js", "PrimeNG", "Google login"],
    outcome:
      "Diet tracking web app with BMI-based calorie targets, verified diets, history, and chart visualisations.",
    links: [
      { label: "Case study", href: "/work/health-sync" },
      { label: "GitHub", href: "https://github.com/sidkalyani9/HealthSync" },
    ],
  },
  {
    slug: "lucky-shrub",
    title: "Lucky Shrub",
    priority: "P2",
    layout: "half",
    cover: "/media/lucky-shrub.webp",
    problem:
      "A plant nursery needed an e-commerce storefront with full front-end and PHP back-end.",
    role: "Full-stack student project",
    tech: ["HTML", "CSS", "Bootstrap", "jQuery", "JavaScript", "PHP"],
    outcome: "E-commerce experience for a hypothetical plant nursery.",
    links: [
      { label: "GitHub", href: "https://github.com/sidkalyani9/Lucky-Shrub" },
    ],
  },
  {
    slug: "portfolio-v1",
    title: "Portfolio v1",
    priority: "P2",
    layout: "half",
    cover: "/media/portfolio-v1.webp",
    problem: "Need a personal site to present bio, skills, and featured projects.",
    role: "Sole builder",
    tech: ["React", "Node.js", "MongoDB"],
    outcome: "First major React portfolio — evolved into this experience.",
    links: [
      { label: "GitHub", href: "https://github.com/sidkalyani9/Portfolio" },
    ],
  },
];

export const featuredProjects = projects.filter(
  (p) => p.featured || p.priority === "P0" || p.priority === "P1",
);

export const alsoProjects = projects.filter((p) => p.priority === "P2");
