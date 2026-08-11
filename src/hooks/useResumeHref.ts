import { resume } from "@/content/socials";

export function useResumeHref() {
  return {
    href: resume.exists ? resume.path : resume.requestMailto,
    label: resume.exists ? "Download resume" : "Request resume",
    isMailto: !resume.exists,
    /** Pass to <a download={...}> when serving a real PDF */
    download: resume.exists ? resume.downloadName : undefined,
  };
}
