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
    title: "Multi-agent proposal scoring",
    priority: "P0",
    featured: true,
    layout: "text",
    cover: null,
    confidential: true,
    problem:
      "High-stakes bidding needs reliable multi-agent scoring, long-document insights, and catalog-grounded validation — without one-off chat prompts.",
    role: "Owned Proposal Scoring (6-agent workflow), RFP insights, Proposal CV generation, and Level-2 validation on BidStreamAI",
    tech: ["LlamaIndex", "Vertex AI", "FastAPI", "React", "Gemini long-context"],
    outcome:
      "Production multi-agent scoring with persona caching, long-document insights, KB-grounded CVs, and catalog-grounded validation.",
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
    title: "Authenticated Scraping Automation",
    priority: "P0",
    featured: true,
    layout: "text",
    cover: null,
    confidential: true,
    problem:
      "A client scraping platform needed reliable automated login with secure credentials and 2FA — without hardcoding secrets.",
    role: "Owned end-to-end automatic login solution",
    tech: ["AWS Secrets Manager", "Gmail API", "Automated auth"],
    outcome:
      "Secure automated authentication with Secrets Manager–backed credentials and Gmail API–driven 2FA OTP handling for reliable session access.",
    links: [
      {
        label: "Case study",
        href: "/work/authenticated-scraping-automation",
      },
    ],
  },
  {
    slug: "meeting-intelligence-pipeline",
    title: "Meeting Intelligence Pipeline",
    priority: "P0",
    featured: true,
    layout: "text",
    cover: null,
    confidential: true,
    problem:
      "A client messaging platform needed video-meeting speech captured as transcript and turned into usable summaries in product flow.",
    role: "Owned end-to-end speech-to-text → summarization integration",
    tech: ["Speech-to-text", "LLM summarization", "Messaging UX"],
    outcome:
      "Meeting speech pipeline into messaging UX: STT to summary with cost-efficient model choices (representative: Whisper-class STT + Flash/mini-class LLM).",
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
