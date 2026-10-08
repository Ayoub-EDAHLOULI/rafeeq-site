import type { ReactNode } from "react";
import { Link } from "@/i18n/navigation";

type Variant = "primary" | "secondary" | "inset";
type Size = "md" | "sm";

const VARIANTS: Record<Variant, string> = {
  // 90% opacity on hover keeps white text above 4.5:1 in both themes.
  primary: "bg-accent font-semibold text-on-accent hover:bg-accent/90",
  secondary:
    "border border-line bg-panel font-medium text-text hover:bg-panel-2",
  // Secondary button placed on a panel (closing call-to-action box).
  inset: "border border-line bg-bg font-medium text-text hover:bg-panel-2",
};

const SIZES: Record<Size, string> = {
  md: "h-12 rounded-xl px-6",
  sm: "h-11 rounded-[10px] px-5",
};

// Button-styled link: a locale-aware Link for site paths, a plain anchor
// for full URLs (release files, GitHub).
export default function Button({
  href,
  variant = "primary",
  size = "md",
  className = "",
  onClick,
  children,
}: {
  href: string;
  variant?: Variant;
  size?: Size;
  className?: string;
  onClick?: () => void;
  children: ReactNode;
}) {
  const classes = `inline-flex shrink-0 items-center justify-center gap-2.5 transition-colors ${VARIANTS[variant]} ${SIZES[size]} ${className}`;

  if (/^https?:\/\//.test(href)) {
    return (
      <a href={href} className={classes} onClick={onClick}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={classes} onClick={onClick}>
      {children}
    </Link>
  );
}
