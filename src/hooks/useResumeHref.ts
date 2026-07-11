import { resume } from "@/content/socials";

export function useResumeHref() {
  return {
    href: resume.exists ? resume.path : resume.requestMailto,
    label: resume.exists ? "Download resume" : "Request resume",
    isMailto: !resume.exists,
  };
}
