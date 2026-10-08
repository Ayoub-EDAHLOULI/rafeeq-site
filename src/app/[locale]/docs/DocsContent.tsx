"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import Container from "@/components/ui/Container";
import Eyebrow from "@/components/ui/Eyebrow";
import SmallLabel from "@/components/ui/SmallLabel";
import { ShieldCheckIcon } from "@/components/ui/icons";

const GITHUB_URL = "https://github.com/Ayoub-EDAHLOULI/Rafeeq";
// Standard build only; the starter-model build's identifier ends in .bundled
// (see the hint below the path).
const MODELS_PATH = "%LOCALAPPDATA%\\com.ayoubedahlouli.rafeeq\\models";

const SECTIONS = ["install", "model", "chat", "rag", "offline", "more"] as const;
type SectionId = (typeof SECTIONS)[number];

// Highlights the menu item for the section nearest the top of the viewport.
// At the very bottom of the page the last section wins, because the short
// final sections can never reach the top on a tall screen.
function useActiveSection(): SectionId {
  const [active, setActive] = useState<SectionId>(SECTIONS[0]);

  useEffect(() => {
    const visible = new Map<string, boolean>();
    const update = () => {
      const atBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 2;
      if (atBottom) {
        setActive(SECTIONS[SECTIONS.length - 1]);
        return;
      }
      const first = SECTIONS.find((id) => visible.get(id));
      if (first) setActive(first);
    };

    // A section counts as current while it overlaps the top 40% of the screen.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          visible.set(entry.target.id, entry.isIntersecting);
        }
        update();
      },
      { rootMargin: "0px 0px -60% 0px" },
    );
    for (const id of SECTIONS) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }
    window.addEventListener("scroll", update, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", update);
    };
  }, []);

  return active;
}

const LINK = "font-medium text-accent-fg hover:underline";

function CodeChip({ children }: { children: ReactNode }) {
  return (
    <code
      dir="ltr"
      className="rounded-md bg-panel-2 px-2 py-0.5 font-mono text-sm text-text"
    >
      {children}
    </code>
  );
}

// Section heading with an optional step number, rendered by the layout
// rather than written into the translated title.
function SectionTitle({
  step,
  note,
  children,
}: {
  step?: number;
  note?: string;
  children: ReactNode;
}) {
  return (
    <h2 className="text-title font-semibold text-text">
      {step !== undefined && (
        <>
          <span className="me-2 font-mono text-base text-accent-fg">{step}</span>{" "}
        </>
      )}
      {children}
      {note && (
        <>
          {" "}
          <span className="ms-1 text-base font-medium text-faint">{note}</span>
        </>
      )}
    </h2>
  );
}

export default function DocsContent() {
  const t = useTranslations("docs");
  const nav = useTranslations("nav");
  const modes = useTranslations("modes");
  const common = useTranslations("common");
  const active = useActiveSection();

  const menu: Record<SectionId, string> = {
    install: t("step1Title"),
    model: t("step2Title"),
    chat: t("step3Title"),
    rag: t("ragTitle"),
    offline: t("offlineTitle"),
    more: t("moreTitle"),
  };

  const modeCards = (["general", "code", "document", "rag"] as const).map(
    (key) => ({
      key,
      name: modes(key),
      description: modes(`${key}Description`),
    }),
  );

  const modelSteps = [
    t("step2List1"),
    t.rich("step2List2", { code: (c) => <CodeChip>{c}</CodeChip> }),
    t("step2List3"),
  ];

  const section = "scroll-mt-8";

  return (
    <Container className="grid gap-x-16 gap-y-12 pt-18 pb-24 lg:grid-cols-[220px_minmax(0,760px)]">
      <Stagger trigger="mount" className="lg:col-start-2 lg:row-start-1">
        <StaggerItem>
          <Eyebrow>{nav("docs")}</Eyebrow>
        </StaggerItem>
        <StaggerItem as="h1" className="mt-3.5 text-page font-semibold text-text">
          {t("title")}
        </StaggerItem>
        <StaggerItem as="p" className="mt-4 text-lead text-muted">
          {t("subtitle")}
        </StaggerItem>
      </Stagger>

      <nav
        aria-labelledby="docs-on-this-page"
        className="lg:sticky lg:top-8 lg:col-start-1 lg:row-span-2 lg:row-start-1 lg:self-start"
      >
        <SmallLabel id="docs-on-this-page">{t("onThisPage")}</SmallLabel>
        <ul className="mt-2.5 border-s border-line">
          {SECTIONS.map((id) => (
            <li key={id}>
              <a
                href={`#${id}`}
                aria-current={active === id ? "location" : undefined}
                className={`flex min-h-11 items-center px-4 transition-colors hover:text-text ${
                  active === id ? "font-semibold text-accent-fg" : "text-muted"
                }`}
              >
                {menu[id]}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="min-w-0 lg:col-start-2 lg:row-start-2">
        <Reveal as="section" id="install" effect="slide" className={section}>
          <SectionTitle step={1}>{t("step1Title")}</SectionTitle>
          <p className="mt-3 text-muted">
            {t.rich("step1Description", {
              downloadLink: (chunks) => (
                <Link href="/download" className={LINK}>
                  {chunks}
                </Link>
              ),
            })}
          </p>
        </Reveal>

        <Reveal as="section" id="model" effect="slide" className={`mt-14 ${section}`}>
          <SectionTitle step={2} note={t("step2Note")}>
            {t("step2Title")}
          </SectionTitle>
          <p className="mt-3 text-muted">{t("step2Description")}</p>
          <ol className="mt-5">
            {modelSteps.map((item, i) => (
              <li
                key={i}
                className="flex gap-4 border-t border-line py-3.5 text-text last:border-b"
              >
                <span className="font-mono text-sm text-faint">{i + 1}</span>
                <span>{item}</span>
              </li>
            ))}
          </ol>
          <div className="mt-5 rounded-xl border border-line bg-panel px-4.5 py-4">
            <SmallLabel>{t("modelsFolderLabel")}</SmallLabel>
            <p dir="ltr" className="mt-2 font-mono text-[13px] break-all text-text">
              {MODELS_PATH}
            </p>
            <p className="mt-2 text-sm text-muted">
              {t.rich("modelsFolderHint", { code: (c) => <CodeChip>{c}</CodeChip> })}
            </p>
          </div>
        </Reveal>

        <Reveal as="section" id="chat" effect="slide" className={`mt-14 ${section}`}>
          <SectionTitle step={3}>{t("step3Title")}</SectionTitle>
          <p className="mt-3 text-muted">{t("step3Description")}</p>
          <ul className="mt-5 flex flex-wrap gap-3">
            {modeCards.map((mode) => (
              <li
                key={mode.key}
                className="min-w-0 flex-[1_1_160px] rounded-xl border border-line bg-panel px-4 py-3.5"
              >
                <p className="font-semibold text-text">{mode.name}</p>
                <p className="mt-0.5 text-sm text-muted">{mode.description}</p>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal
          as="section"
          id="rag"
          effect="slide"
          className={`mt-16 border-t border-line pt-10 ${section}`}
        >
          <SectionTitle>{t("ragTitle")}</SectionTitle>
          <p className="mt-3 text-muted">{t("ragDescription")}</p>
        </Reveal>

        <Reveal as="section" id="offline" effect="slide" className={`mt-14 ${section}`}>
          <SectionTitle>{t("offlineTitle")}</SectionTitle>
          <p className="mt-3 text-muted">{t("offlineDescription")}</p>
          <p className="mt-5 flex items-center gap-2.5 rounded-xl border border-line bg-panel px-4 py-3.5 font-medium text-accent-fg">
            <ShieldCheckIcon />
            {common("offlineBadge")}
          </p>
        </Reveal>

        <Reveal as="section" id="more" effect="slide" className={`mt-14 ${section}`}>
          <SectionTitle>{t("moreTitle")}</SectionTitle>
          <p className="mt-3 text-muted">
            {t("moreDescription")}{" "}
            <a href={GITHUB_URL} className={LINK}>
              {t("readmeLink")}
            </a>
            .
          </p>
        </Reveal>
      </div>
    </Container>
  );
}
