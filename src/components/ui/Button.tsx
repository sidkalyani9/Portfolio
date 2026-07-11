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
    "bg-accent text-bg-0 hover:brightness-110 shadow-[0_0_0_1px_rgba(46,230,166,0.25),0_10px_40px_rgba(46,230,166,0.12)]",
  ghost: "bg-transparent text-fg-0 hover:bg-white/5",
  outline:
    "bg-transparent text-fg-0 border border-border hover:border-accent/40 hover:bg-accent-dim",
};

const base =
  "inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 font-sans text-sm font-semibold tracking-tight transition-[transform,background,border-color,filter] duration-300 ease-out active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-bg-0";

export function ButtonLink({
  to,
  children,
  className,
  variant = "primary",
  ...rest
}: Common & {
  to: string;
  download?: boolean;
} & Omit<ComponentPropsWithoutRef<typeof Link>, "to" | "className">) {
  const external = to.startsWith("http") || to.startsWith("mailto:") || to.endsWith(".pdf");
  if (external) {
    return (
      <a
        href={to}
        className={cn(base, styles[variant], className)}
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
    <Link to={to} className={cn(base, styles[variant], className)} {...rest}>
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
    <button type="button" className={cn(base, styles[variant], className)} {...rest}>
      {children}
    </button>
  );
}
