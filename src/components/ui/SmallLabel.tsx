import type { ReactNode } from "react";

// Small uppercase label (design "small label"). Letter spacing breaks the
// joins between Arabic letters, so it is dropped in RTL.
export default function SmallLabel({
  id,
  className = "",
  children,
}: {
  id?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <p
      id={id}
      className={`text-xs font-semibold uppercase tracking-[0.08em] text-faint rtl:tracking-normal ${className}`}
    >
      {children}
    </p>
  );
}
