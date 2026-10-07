import type { ReactNode } from "react";

// Page-width wrapper from the redesign: 1120px max, 24px side padding.
export default function Container({
  className = "",
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={`mx-auto w-full max-w-[1120px] px-6 ${className}`}>
      {children}
    </div>
  );
}
