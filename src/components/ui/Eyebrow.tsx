import type { ReactNode } from "react";

// Small accent label above a title. Letter spacing breaks the joins between
// Arabic letters, so it is dropped in RTL.
export default function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="text-[13px] font-semibold uppercase tracking-[0.08em] text-accent-fg rtl:tracking-normal">
      {children}
    </p>
  );
}
