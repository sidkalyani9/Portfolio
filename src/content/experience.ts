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
    title: "GenAI Engineer / Forward Deployed Engineer",
    org: "Argusoft India Pvt. Ltd. · BidStreamAI",
    date: "Present",
    logo: "/media/argusoft-logo.png",
    bullets: [
      "Own end-to-end Proposal Scoring for BidStreamAI: multi-agent LLM workflow (visual asset extraction, gap analysis, evaluation-matrix extraction, specialised persona classification with DB-backed prompt cache, section scoring).",
      "Built RFP insights generation with long-document / context-window overflow handling on Gemini long-context.",
      "Shipped automatic Proposal CV generation mapping RFP resource needs to company knowledge-base experience.",
      "Added Level-2 AI validation scoring RFPs against a medical-domain client product catalog with explicit caching.",
      "Stack: LlamaIndex, Vertex AI, FastAPI, React.",
    ],
  },
  {
    type: "work",
    title: "Programmer Analyst",
    org: "Argusoft India Pvt. Ltd.",
    date: "Jan 2025 — transition into GenAI product work",
    logo: "/media/argusoft-logo.png",
    bullets: [
      "Early full-time focus included React Native training and a chat POC (pagination, batching, WebSocket, mobile OTP).",
      "Progressed into BidStreamAI GenAI engineering — multi-agent pipelines and production LLM workflows.",
    ],
  },
  {
    type: "work",
    title: "Programmer Analyst Trainee",
    org: "Argusoft India Pvt. Ltd.",
    date: "Jul 2024 — Dec 2024",
    logo: "/media/argusoft-logo.png",
    bullets: [
      "Mastered React, Java Spring Boot, and PostgreSQL under mentorship.",
      "Built FlightEase — secure responsive flight booking with Spring Security and Google login.",
    ],
  },
  {
    type: "work",
    title: "Programmer Analyst Intern",
    org: "Argusoft India Pvt. Ltd.",
    date: "Jan 2024 — Jun 2024",
    logo: "/media/argusoft-logo.png",
    bullets: [
      "Team of 9 building a full-stack Canteen Management WebApp.",
      "Angular, Java, PostgreSQL, Git, Chart.js; daily stand-ups.",
    ],
  },
  {
    type: "work",
    title: "Summer Intern",
    org: "Argusoft India Pvt. Ltd.",
    date: "May 2023 — Jul 2023",
    logo: "/media/argusoft-logo.png",
    bullets: [
      "Built Health Sync: Angular, Node.js, Chart.js, PrimeNG.",
      "Google login, BMI-based calorie calculation, food history charts.",
    ],
  },
  {
    type: "education",
    title: "B.Tech in Information Technology",
    org: "Vishwakarma Government Engineering College (VGEC)",
    date: "2021 — 2024",
    logo: "/media/vgec-logo.png",
    bullets: [
      "Core CS foundations with strong academic performance — 9.11 CGPA.",
      "Impactful projects and internship experience alongside coursework.",
    ],
  },
];
