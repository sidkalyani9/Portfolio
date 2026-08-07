export type Award = {
  rank: string;
  title: string;
  detail: string;
  year: string;
};

export const awards: Award[] = [
  {
    rank: "01",
    title: "1st Place — Argusoft AI Hackathon",
    detail:
      "8-hour build: a conversational form-filling chatbot with real-time input validation, mid-dialogue slot correction, and red-team-hardened scoring prompts.",
    year: "2025",
  },
  {
    rank: "02",
    title: "Top 5 — Argusoft ML Competition",
    detail: "Organisation-wide machine learning competition.",
    year: "2024",
  },
  {
    rank: "03",
    title: "2nd Prize — TechXIT Web Developer Competition",
    detail: "VGEC inter-college web development competition.",
    year: "2022",
  },
];

export const certifications = [
  {
    title: "Meta Front-End Developer",
    detail: "Specialization in React — Coursera",
  },
] as const;
