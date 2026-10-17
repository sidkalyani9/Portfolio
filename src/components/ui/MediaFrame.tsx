import { useState } from "react";
import { cn } from "@/lib/cn";

export function MediaFrame({
  src,
  alt,
  className,
  imgClassName,
}: {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
}) {
  const [failed, setFailed] = useState(false);

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-border bg-bg-2 shadow-soft",
        className,
      )}
    >
      {failed ? (
        <div className="flex aspect-video items-center justify-center bg-bg-1 text-sm text-fg-2">
          {alt || "Media unavailable"}
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          onError={() => setFailed(true)}
          className={cn("h-full w-full object-cover", imgClassName)}
        />
      )}
      <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-fg-0/5" />
    </div>
  );
}
