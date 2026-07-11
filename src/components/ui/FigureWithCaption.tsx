import { MediaFrame } from "@/components/ui/MediaFrame";
import { cn } from "@/lib/cn";

type Props = {
  src: string;
  alt: string;
  caption: string;
  credit?: string;
  className?: string;
  imgClassName?: string;
  wide?: boolean;
};

export function FigureWithCaption({
  src,
  alt,
  caption,
  credit,
  className,
  imgClassName,
  wide,
}: Props) {
  return (
    <figure
      className={cn(
        wide ? "w-full max-w-[1120px] mx-auto px-[clamp(20px,5vw,40px)] md:px-0" : "container-measure",
        className,
      )}
    >
      <MediaFrame src={src} alt={alt} imgClassName={imgClassName} className="rounded-xl shadow-none" />
      <figcaption className="mt-3 flex flex-col gap-1 border-t border-border pt-3 text-sm text-fg-2 md:flex-row md:items-baseline md:justify-between">
        <span className="max-w-[65ch] text-fg-1">{caption}</span>
        {credit ? (
          <span className="shrink-0 font-sans text-[11px] uppercase tracking-[0.16em] text-fg-2">
            {credit}
          </span>
        ) : null}
      </figcaption>
    </figure>
  );
}
