export type SocialPriority = "primary" | "secondary";

export type Social = {
  id: string;
  label: string;
  href: string;
  priority: SocialPriority;
};

export const resume = {
  path: "/resume.pdf",
  /** When PDF is missing, UI uses mailto with this subject */
  requestMailto:
    "mailto:sidkalyani9@gmail.com?subject=Resume%20request%20 · %20Siddharth%20Kalyani",
  exists: false, // set true when public/resume.pdf is added
} as const;

export const socials: Social[] = [
  {
    id: "email",
    label: "Email",
    href: "mailto:sidkalyani9@gmail.com",
    priority: "primary",
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/siddharth-kalyani/",
    priority: "primary",
  },
  {
    id: "github",
    label: "GitHub",
    href: "https://github.com/sidkalyani9",
    priority: "primary",
  },
  {
    id: "x",
    label: "X",
    href: "https://twitter.com/techybuffoon",
    priority: "secondary",
  },
  {
    id: "leetcode",
    label: "LeetCode",
    href: "https://leetcode.com/sidkalyani9/",
    priority: "secondary",
  },
  {
    id: "youtube",
    label: "YouTube",
    href: "https://youtube.com/@techybuffoon",
    priority: "secondary",
  },
];

export const primarySocials = socials.filter((s) => s.priority === "primary");
export const secondarySocials = socials.filter((s) => s.priority === "secondary");
