import { Link } from "react-router-dom";
import { cn } from "@/lib/cn";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

type Variant = "primary" | "ghost" | "outline";

type Common = {
  children: ReactNode;
  className?: string;
  variant?: Variant;
};

const styles: Record<Variant, string> = {
  primary:
    "bg-accent text-bg-0 hover:brightness-110 shadow-[0_0_0_1px_rgba(199,125,255,0.25),0_10px_40px_rgba(199,125,255,0.12)]",
  ghost: "bg-transparent text-fg-0 hover:bg-white/5",
  outline:
    "bg-transparent text-fg-0 border border-border hover:border-accent/40 hover:bg-accent-dim",
};

/** Display is omitted so callers can pass `hidden` without fighting inline-flex. */
const base =
  "items-center justify-center gap-2 rounded-full px-5 py-2.5 font-sans text-sm font-semibold tracking-tight transition-[transform,background,border-color,filter] duration-500 ease-out active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-bg-0";

function buttonClasses(variant: Variant, className?: string) {
  // Default to inline-flex unless caller sets a display utility (hidden, flex, etc.)
  const hasDisplay =
    className != null &&
    /\b(hidden|block|inline|inline-block|flex|inline-flex|grid|contents|table)\b/.test(
      className,
    );
  return cn(!hasDisplay && "inline-flex", base, styles[variant], className);
}

export function ButtonLink({
  to,
  children,
  className,
  variant = "primary",
  ...rest
}: Common & {
  to: string;
  download?: boolean | string;
} & Omit<ComponentPropsWithoutRef<typeof Link>, "to" | "className">) {
  const external = to.startsWith("http") || to.startsWith("mailto:") || to.endsWith(".pdf");
  if (external) {
    return (
      <a
        href={to}
        className={buttonClasses(variant, className)}
        {...(to.startsWith("http")
          ? { target: "_blank", rel: "noopener noreferrer" }
          : {})}
        {...(rest as ComponentPropsWithoutRef<"a">)}
      >
        {children}
      </a>
    );
  }
  return (
    <Link to={to} className={buttonClasses(variant, className)} {...rest}>
      {children}
    </Link>
  );
}

export function Button({
  children,
  className,
  variant = "primary",
  ...rest
}: Common & ComponentPropsWithoutRef<"button">) {
  return (
    <button type="button" className={buttonClasses(variant, className)} {...rest}>
      {children}
    </button>
  );
}
