import type { Metadata } from "next";
import type { ReactNode } from "react";
import { getTranslations } from "next-intl/server";
import { useTranslations } from "next-intl";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import Container from "@/components/ui/Container";
import Eyebrow from "@/components/ui/Eyebrow";
import CtaBox from "@/components/CtaBox";
import {
  ChatIcon,
  ClockIcon,
  CodeIcon,
  CubeIcon,
  DocumentIcon,
  LayersIcon,
  ShieldCheckIcon,
} from "@/components/ui/icons";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "features" });
  return { title: t("title"), description: t("subtitle") };
}

type Feature = {
  key: string;
  icon: ReactNode;
  // flex-basis decides how many cards share a row (2, 3, then 2).
  basis: "wide" | "narrow";
  highlight?: boolean;
};

const ROWS: Feature[][] = [
  [
    { key: "chat", icon: <ChatIcon size={22} />, basis: "wide" },
    { key: "manager", icon: <CubeIcon size={22} />, basis: "wide" },
  ],
  [
    { key: "code", icon: <CodeIcon size={22} />, basis: "narrow" },
    { key: "doc", icon: <DocumentIcon size={22} />, basis: "narrow" },
    { key: "rag", icon: <LayersIcon size={22} />, basis: "narrow" },
  ],
  [
    { key: "session", icon: <ClockIcon size={22} />, basis: "wide" },
    { key: "offline", icon: <ShieldCheckIcon size={22} />, basis: "wide", highlight: true },
  ],
];

export default function FeaturesPage() {
  const t = useTranslations("features");
  const nav = useTranslations("nav");

  const goodToKnow = [1, 2, 3, 4, 5].map((n) => ({
    n,
    title: t(`good${n}Title`),
    body: t(`good${n}Body`),
  }));


  return (
    <>
      <Container className="pt-22 pb-14">
        <Stagger trigger="mount">
          <StaggerItem effect="focus">
            <Eyebrow>{nav("features")}</Eyebrow>
          </StaggerItem>
          <StaggerItem
            as="h1"
            effect="focus"
            className="mt-3.5 max-w-[760px] text-page font-semibold text-text"
          >
            {t("title")}
          </StaggerItem>
          <StaggerItem
            as="p"
            effect="focus"
            className="mt-4 max-w-[600px] text-lead text-muted"
          >
            {t("subtitle")}
          </StaggerItem>
        </Stagger>
      </Container>

      <Container className="pb-24">
        <Stagger className="flex flex-col gap-5" interval={0.12}>
          {ROWS.map((row, r) => (
            <div key={r} className="flex flex-wrap gap-5">
              {row.map((feature, i) => {
                // Alternate the slide direction across all seven cards.
                const position =
                  ROWS.slice(0, r).reduce((sum, prev) => sum + prev.length, 0) + i;
                const from = position % 2 === 0 ? "start" : "end";
                return (
                  <StaggerItem
                    key={feature.key}
                    effect="slide"
                    from={from}
                    className={`min-w-0 rounded-[18px] border bg-panel p-7 ${
                      feature.basis === "wide" ? "flex-[1_1_440px]" : "flex-[1_1_300px]"
                    } ${feature.highlight ? "border-accent" : "border-line"}`}
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-panel-2 text-accent-fg">
                      {feature.icon}
                    </div>
                    <h2 className="mt-5 text-title font-semibold text-text">
                      {t(`${feature.key}Title`)}
                    </h2>
                    <p className="mt-2 text-muted">
                      {t(`${feature.key}Description`)}
                    </p>
                  </StaggerItem>
                );
              })}
            </div>
          ))}
        </Stagger>
      </Container>

      <section className="border-y border-line bg-panel">
        <Container className="flex flex-wrap gap-x-16 gap-y-10 py-20">
          <Reveal className="min-w-0 flex-[1_1_280px]">
            <h2 className="text-section font-semibold text-text">
              {t("goodTitle")}
            </h2>
            <p className="mt-3 text-muted">{t("goodIntro")}</p>
          </Reveal>
          <ul className="flex min-w-0 flex-[2_1_460px] flex-col">
            {goodToKnow.map((item) => (
              <li key={item.n} className="border-t border-line py-5 last:border-b">
                <p className="font-semibold text-text">{item.title}</p>
                <p className="mt-1.5 text-muted">{item.body}</p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <CtaBox title={t("ctaTitle")} body={t("ctaBody")} />
    </>
  );
}
