import type { ReactNode } from "react";
import { Reveal } from "../motion/Reveal";
import Eyebrow from "../ui/Eyebrow";

// One Home feature row. Text always comes first in the DOM (so screen
// readers read label, heading, body, then the visual); `reverse` swaps the
// sides on wide screens only, and mirrors automatically in RTL.
export default function FeatureBlock({
  eyebrow,
  title,
  body,
  visual,
  reverse = false,
}: {
  eyebrow: string;
  title: string;
  body: string;
  visual: ReactNode;
  reverse?: boolean;
}) {
  return (
    <Reveal
      className={`flex flex-col gap-10 lg:items-center ${
        reverse ? "lg:flex-row-reverse" : "lg:flex-row"
      }`}
    >
      <div className="min-w-0 lg:flex-[1_1_380px]">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h2 className="mt-3 text-feature font-semibold text-text">{title}</h2>
        <p className="mt-4 text-lead text-muted">{body}</p>
      </div>
      <div className="min-w-0 lg:flex-[1_1_420px]">{visual}</div>
    </Reveal>
  );
}
