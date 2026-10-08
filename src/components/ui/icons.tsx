// Inline icons on a 24px grid (design/TOKENS.md): stroke currentColor,
// width 1.75, round caps and joins. Decorative; label the control instead.

type IconProps = { size?: number; className?: string };

function Stroke({
  size = 18,
  className,
  children,
}: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={className}
    >
      {children}
    </svg>
  );
}

// Filled four-pane Windows logo.
export function WindowsIcon({ size = 18, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
      className={className}
    >
      <path d="M3 5.5l7-1v7H3zM11 4.3l10-1.5v8.7H11zM3 12.5h7v7l-7-1zM11 12.5h10v8.7l-10-1.5z" />
    </svg>
  );
}

export function CopyIcon(props: IconProps) {
  return (
    <Stroke {...props}>
      <rect x="9" y="9" width="11" height="11" rx="2" />
      <path d="M5 15V6a2 2 0 0 1 2-2h8" />
    </Stroke>
  );
}

export function ShieldCheckIcon(props: IconProps) {
  return (
    <Stroke {...props}>
      <path d="M12 3l8 3v6c0 4.5-3.2 7.8-8 9-4.8-1.2-8-4.5-8-9V6l8-3z" />
      <path d="M9 12l2 2 4-4" />
    </Stroke>
  );
}

export function CheckIcon(props: IconProps) {
  return (
    <Stroke {...props}>
      <path d="M5 12.5l4.5 4.5L19 7" />
    </Stroke>
  );
}
