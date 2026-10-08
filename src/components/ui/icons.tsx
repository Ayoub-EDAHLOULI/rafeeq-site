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

// Feature icons (design/preview Features page).
export function ChatIcon(props: IconProps) {
  return (
    <Stroke {...props}>
      <path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z" />
    </Stroke>
  );
}

export function CubeIcon(props: IconProps) {
  return (
    <Stroke {...props}>
      <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3z" />
      <path d="M12 12l8-4.5M12 12v9M12 12L4 7.5" />
    </Stroke>
  );
}

export function CodeIcon(props: IconProps) {
  return (
    <Stroke {...props}>
      <path d="M8 8l-5 4 5 4M16 8l5 4-5 4M14 5l-4 14" />
    </Stroke>
  );
}

export function DocumentIcon(props: IconProps) {
  return (
    <Stroke {...props}>
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5z" />
      <path d="M14 3v5h5M9 13h6M9 17h4" />
    </Stroke>
  );
}

export function LayersIcon(props: IconProps) {
  return (
    <Stroke {...props}>
      <path d="M12 3l9 5-9 5-9-5 9-5z" />
      <path d="M3 13l9 5 9-5" />
    </Stroke>
  );
}

export function ClockIcon(props: IconProps) {
  return (
    <Stroke {...props}>
      <circle cx="12" cy="12" r="8" />
      <path d="M12 8v4l3 2" />
    </Stroke>
  );
}
