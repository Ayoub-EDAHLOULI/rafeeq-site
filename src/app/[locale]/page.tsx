import { useLocale, useTranslations } from "next-intl";
import ParticleField from "@/components/ParticleField";
import {
  AnimatedWords,
  Press,
  Reveal,
  Stagger,
  StaggerItem,
} from "@/components/motion/Reveal";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import { WindowsIcon } from "@/components/ui/icons";
import CtaBox from "@/components/CtaBox";
import FeatureBlock from "@/components/home/FeatureBlock";
import {
  CodeHelpVisual,
  DocumentVisual,
  ModelManagerVisual,
  OfflineSteps,
} from "@/components/home/BlockVisuals";
import { RELEASE, formatSize } from "@/lib/release";

export default function HomePage() {
  const t = useTranslations("home");
  const download = useTranslations("download");
  const cta = useTranslations("cta");
  const features = useTranslations("features");
  const modes = useTranslations("modes");
  const locale = useLocale();

  const pillars = [1, 2, 3].map((n) => ({
    n,
    title: t(`highlight${n}Title`),
    description: t(`highlight${n}Description`),
  }));

  return (
    <>
      {/* The particle canvas covers the hero only (decision D2). */}
      <div className="relative isolate overflow-hidden">
        <ParticleField />
        <section data-particle-focus className="relative">
          <Container className="pt-24 pb-16 text-center">
            <Stagger trigger="mount" interval={0.18} className="flex flex-col items-center">
              {/* On the Arabic page the tagline is "· Rafeeq" (decision D13). */}
              <StaggerItem className="flex flex-wrap items-center justify-center gap-2.5 font-medium">
                <span lang="ar" dir="rtl" className="text-xl text-accent-fg">
                  رفيق
                </span>
                <span className="text-muted">{t("tagline")}</span>
              </StaggerItem>
              <AnimatedWords
                text={t("title")}
                className="mt-5 max-w-[860px] text-hero font-semibold text-text"
              />
              <StaggerItem as="p" className="mt-6 max-w-[640px] text-lead text-muted">
                {t("subtitle")}
              </StaggerItem>
              <StaggerItem className="mt-9 flex flex-wrap justify-center gap-3">
                <Press>
                  <Button href="/download">
                    <WindowsIcon />
                    {download("downloadButton")}
                  </Button>
                </Press>
                <Press>
                  <Button href="/docs" variant="secondary">
                    {cta("docs")}
                  </Button>
                </Press>
              </StaggerItem>
              <StaggerItem as="p" className="mt-4.5 font-mono text-[13px] text-faint">
                {t("caption", {
                  size: formatSize(RELEASE.standard.exe.bytes, locale),
                })}
              </StaggerItem>
            </Stagger>
          </Container>
        </section>
      </div>

      <section className="border-y border-line bg-panel">
        <Container className="py-20">
          <Reveal>
            <h2 className="max-w-[760px] text-section font-semibold text-text">
              {t("bannerTitle")}
            </h2>
            <p className="mt-4 max-w-[640px] text-lead text-muted">
              {t("bannerSubtitle")}
            </p>
          </Reveal>
          <Stagger className="mt-12 flex flex-wrap gap-5">
            {pillars.map((pillar) => (
              <StaggerItem
                key={pillar.n}
                className="min-w-0 flex-[1_1_280px] border-t border-line pt-5"
              >
                <p className="font-mono text-[13px] text-accent-fg">
                  {String(pillar.n).padStart(2, "0")}
                </p>
                <h3 className="mt-2.5 text-lg font-semibold text-text">
                  {pillar.title}
                </h3>
                <p className="mt-2 text-muted">{pillar.description}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </Container>
      </section>

      <Container className="flex flex-col gap-24 pt-24">
        <FeatureBlock
          eyebrow={modes("code")}
          title={t("blockCodeTitle")}
          body={features("codeDescription")}
          visual={<CodeHelpVisual />}
        />
        <FeatureBlock
          reverse
          eyebrow={features("managerTitle")}
          title={t("blockManagerTitle")}
          body={features("managerDescription")}
          visual={<ModelManagerVisual />}
        />
        <FeatureBlock
          eyebrow={t("blockDocsEyebrow")}
          title={t("blockDocsTitle")}
          body={t("blockDocsBody")}
          visual={<DocumentVisual />}
        />
        <FeatureBlock
          reverse
          eyebrow={features("offlineTitle")}
          title={t("blockOfflineTitle")}
          body={features("offlineDescription")}
          visual={<OfflineSteps />}
        />
      </Container>

      <CtaBox title={t("ctaTitle")} body={t("ctaBody")} />
    </>
  );
}
