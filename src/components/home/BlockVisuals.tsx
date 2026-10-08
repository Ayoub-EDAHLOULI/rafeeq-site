import { useTranslations } from "next-intl";
import { DocumentIcon, ShieldCheckIcon } from "../ui/icons";

// Small pictures of the desktop app for the Home feature blocks.
//
// CodeHelpVisual, ModelManagerVisual and DocumentVisual depict the app's
// interface, which is English and left-to-right. They are decorative
// (aria-hidden), stay English on every locale and keep dir="ltr" (decision
// D6). Their sample content is illustrative, not real output.
//
// OfflineSteps holds real instructions, so it is translated and readable.

const CARD =
  "flex flex-col rounded-2xl border border-line bg-panel p-5 text-[15px] text-text";
const INSET = "rounded-xl border border-line bg-bg";
const CHIP =
  "rounded-full bg-panel-2 px-2.5 py-0.5 font-mono text-xs text-muted";

const MODES = ["General", "Code help", "Document", "RAG"];

export function CodeHelpVisual() {
  return (
    <div aria-hidden dir="ltr" className={`${CARD} gap-3.5`}>
      <div className={`${INSET} flex flex-wrap gap-0.5 self-start p-[3px]`}>
        {MODES.map((mode) => (
          <span
            key={mode}
            className={`rounded-[9px] px-3.5 py-2 text-sm ${
              mode === "Code help"
                ? "bg-accent font-semibold text-on-accent"
                : "font-medium text-muted"
            }`}
          >
            {mode}
          </span>
        ))}
      </div>
      <div
        className={`${INSET} overflow-x-auto px-4 py-3.5 font-mono text-[13px] leading-relaxed whitespace-pre`}
      >
        {'const slug = title.trim().toLowerCase().replace(/\\s+/g, "-");'}
      </div>
      <div className={`${INSET} rounded-ss-sm px-4 py-3 leading-relaxed`}>
        It trims the title, lowercases it and replaces each run of spaces with
        a hyphen, so &ldquo;Hello World&rdquo; becomes{" "}
        <span className="font-mono text-[13px]">hello-world</span>.
      </div>
    </div>
  );
}

// Names follow the app's model list: file name without the quantization,
// dashes shown as spaces.
const MODELS = [
  {
    name: "Phi 4 mini instruct",
    file: "Phi-4-mini-instruct-Q4_K_M.gguf",
    size: "2.3 GB",
    loaded: true,
  },
  {
    name: "nomic embed text v1.5",
    file: "nomic-embed-text-v1.5.Q4_K_M.gguf",
    size: null,
    loaded: false,
  },
];

export function ModelManagerVisual() {
  return (
    <div aria-hidden dir="ltr" className={`${CARD} gap-3`}>
      <div className="flex flex-wrap items-center gap-2.5">
        <span className="text-xs font-semibold tracking-[0.08em] text-faint uppercase">
          Profile
        </span>
        <span className="rounded-full border border-accent bg-panel-2 px-3.5 py-1.5 text-sm font-medium text-accent-fg">
          work-vm
        </span>
      </div>
      {MODELS.map((model) => (
        <div
          key={model.file}
          className={`flex flex-wrap items-center gap-x-4 gap-y-2.5 rounded-xl border bg-bg px-4 py-3.5 ${
            model.loaded ? "border-accent" : "border-line"
          }`}
        >
          <div className="min-w-0 flex-[1_1_200px]">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-semibold">{model.name}</span>
              {model.loaded && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-panel-2 px-2.5 py-0.5 text-xs font-semibold text-accent-fg">
                  <span className="h-1.5 w-1.5 rounded-full bg-dot" />
                  Loaded
                </span>
              )}
            </div>
            <div className="truncate font-mono text-xs text-faint">{model.file}</div>
          </div>
          <span className={CHIP}>Q4_K_M</span>
          {model.size && (
            <span className="font-mono text-[13px] text-muted">{model.size}</span>
          )}
        </div>
      ))}
    </div>
  );
}

export function DocumentVisual() {
  return (
    <div aria-hidden dir="ltr" className={`${CARD} gap-3.5`}>
      <div className={`${INSET} flex items-center gap-3 px-3.5 py-2.5`}>
        <DocumentIcon className="text-accent-fg" />
        <span className="font-mono text-[13px]">project-notes.md</span>
      </div>
      <div className="max-w-[85%] self-end rounded-2xl rounded-ee-sm bg-accent px-3.5 py-2.5 text-on-accent">
        What are the open action items?
      </div>
      <ul className={`${INSET} rounded-ss-sm px-4 py-3 leading-relaxed`}>
        <li>Test the installer on a clean offline VM</li>
        <li>Publish SHA-256 checksums with each release</li>
        <li>Confirm the minimum RAM on an 8 GB machine</li>
      </ul>
    </div>
  );
}

export function OfflineSteps() {
  const t = useTranslations("home");
  const common = useTranslations("common");
  const steps = [t("offlineStep1"), t("offlineStep2"), t("offlineStep3")];

  return (
    <div className={`${CARD} gap-4.5 p-6`}>
      <p className={`${INSET} flex items-center gap-2.5 px-4 py-3 font-medium text-accent-fg`}>
        <ShieldCheckIcon />
        {common("offlineBadge")}
      </p>
      <ol className="flex flex-col gap-3">
        {steps.map((step, i) => (
          <li key={i} className="flex items-baseline gap-3.5">
            <span className="font-mono text-[13px] text-accent-fg">{i + 1}</span>
            <span>{step}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
