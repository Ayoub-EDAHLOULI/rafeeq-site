import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { pageMetadata } from "@/lib/metadata";
import { useLocale, useTranslations } from "next-intl";
import {
  Press,
  Reveal,
  Stagger,
  StaggerItem,
} from "@/components/motion/Reveal";
import Container from "@/components/ui/Container";
import Eyebrow from "@/components/ui/Eyebrow";
import SmallLabel from "@/components/ui/SmallLabel";
import Button from "@/components/ui/Button";
import CopyButton from "@/components/ui/CopyButton";
import { WindowsIcon } from "@/components/ui/icons";
import { RELEASE, formatSize } from "@/lib/release";

const GITHUB_URL = "https://github.com/Ayoub-EDAHLOULI/Rafeeq";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "download" });
  return pageMetadata({
    locale,
    path: "/download",
    title: t("title"),
    socialTitle: `${t("title")} — Rafeeq`,
    description: t("subtitle"),
  });
}

export default function DownloadPage() {
  const t = useTranslations("download");
  const nav = useTranslations("nav");
  const locale = useLocale();

  const installers = [
    {
      name: t("standardName"),
      file: RELEASE.standard.exe,
      description: t("standardDescription"),
      bestFor: t("standardBestFor"),
    },
    {
      name: t("bundledName"),
      file: RELEASE.bundled.exe,
      description: t("bundledDescription"),
      bestFor: t("bundledBestFor"),
    },
  ];

  const offlineSteps = [1, 2, 3].map((n) => ({
    n,
    title: t(`offlineStep${n}Title`),
    body: t(`offlineStep${n}Body`),
  }));

  // Rows with no confirmed value are left out, never shown as placeholders.
  const { minWindows, minRamGb } = RELEASE.requirements;
  const requirements = [
    minWindows && { label: t("reqOs"), value: t("reqOsValue", { version: minWindows }) },
    { label: t("reqCpu"), value: t("reqCpuValue") },
    minRamGb && { label: t("reqMemory"), value: t("reqMemoryValue", { gb: minRamGb }) },
    {
      label: t("reqDisk"),
      value: t("reqDiskValue", { size: formatSize(RELEASE.standard.exe.bytes, locale) }),
    },
  ].filter((row): row is { label: string; value: string } => Boolean(row));

  const accentLink = (chunks: React.ReactNode) => (
    <a href={RELEASE.pageUrl} className="font-medium text-accent-fg hover:underline">
      {chunks}
    </a>
  );

  return (
    <>
      <Container className="pt-22 pb-12">
        <Stagger trigger="mount">
          <StaggerItem effect="scale">
            <Eyebrow>{nav("download")}</Eyebrow>
          </StaggerItem>
          <StaggerItem
            as="h1"
            effect="scale"
            className="mt-3.5 text-page font-semibold text-text"
          >
            {t("title")}
          </StaggerItem>
          <StaggerItem
            as="p"
            effect="scale"
            className="mt-4 max-w-[600px] text-lead text-muted"
          >
            {t("subtitle")}
          </StaggerItem>
        </Stagger>
      </Container>

      <Container className="pb-18">
        <Stagger className="flex flex-wrap gap-5" interval={0.2}>
          {installers.map((installer) => (
            <StaggerItem
              key={installer.file.name}
              effect="flip"
              className="flex min-w-0 flex-[1_1_460px] flex-col gap-4 rounded-[18px] border border-line bg-panel p-7"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-3">
                <h2 className="text-title font-semibold text-text">
                  {installer.name}
                </h2>
                <span className="font-mono text-sm text-muted">
                  {formatSize(installer.file.bytes, locale)}
                </span>
              </div>
              <p className="text-muted">{installer.description}</p>
              <div className="rounded-xl border border-line bg-bg px-4 py-3.5">
                <SmallLabel>{t("bestFor")}</SmallLabel>
                <p className="mt-1 text-text">{installer.bestFor}</p>
              </div>
              <Press className="mt-auto self-start">
                <Button href={installer.file.url}>
                  <WindowsIcon />
                  {t("downloadButton")}
                </Button>
              </Press>
            </StaggerItem>
          ))}
        </Stagger>
        <p className="mt-5 text-muted">
          {t.rich("otherFormats", { link: accentLink })}
        </p>
      </Container>

      <section className="border-y border-line bg-panel">
        <Container className="flex flex-wrap gap-x-16 gap-y-10 py-18">
          <Reveal className="min-w-0 flex-[1_1_280px]">
            <h2 className="text-section font-semibold text-text">
              {t("offlineTitle")}
            </h2>
            <p className="mt-3 text-muted">{t("offlineIntro")}</p>
          </Reveal>
          <ol className="flex min-w-0 flex-[2_1_460px] flex-col">
            {offlineSteps.map((step) => (
              <li
                key={step.n}
                className="flex gap-5 border-t border-line py-5 last:border-b"
              >
                <span className="font-mono text-sm text-accent-fg">{step.n}</span>
                <span>
                  <span className="block font-semibold text-text">
                    {step.title}
                  </span>
                  <span className="mt-1 block text-muted">{step.body}</span>
                </span>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <Container className="flex flex-wrap gap-5 pt-18 pb-24">
        <Reveal className="min-w-0 flex-[1_1_440px] rounded-[18px] border border-line bg-panel p-7">
          <h2 className="text-lg font-semibold text-text">{t("requirementsTitle")}</h2>
          <dl className="mt-5 grid grid-cols-[max-content_minmax(0,1fr)] gap-x-6 gap-y-3.5">
            {requirements.map((row) => (
              <div key={row.label} className="contents">
                <dt className="text-muted">{row.label}</dt>
                <dd className="text-text">{row.value}</dd>
              </div>
            ))}
          </dl>
        </Reveal>

        <Reveal
          delay={0.1}
          className="min-w-0 flex-[1_1_440px] rounded-[18px] border border-line bg-panel p-7"
        >
          <h2 className="text-lg font-semibold text-text">{t("verifyTitle")}</h2>
          <p className="mt-3 text-muted">{t("verifyBody")}</p>
          <ul className="mt-4 flex flex-col gap-4">
            {[RELEASE.standard.exe, RELEASE.bundled.exe].map((file) => (
              <li key={file.name}>
                <p dir="ltr" className="font-mono text-[13px] text-text">
                  {file.name}
                </p>
                <div className="mt-2 flex items-start gap-2">
                  <code
                    dir="ltr"
                    className="min-w-0 flex-1 rounded-[10px] border border-line bg-bg px-3.5 py-3 font-mono text-[13px] break-all text-muted"
                  >
                    {file.sha256}
                  </code>
                  <CopyButton
                    value={file.sha256}
                    label={t("copy")}
                    copiedLabel={t("copied")}
                  />
                </div>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-muted">
            {t("footer")}{" "}
            <a href={GITHUB_URL} className="font-medium text-accent-fg hover:underline">
              GitHub
            </a>
            .
          </p>
        </Reveal>
      </Container>
    </>
  );
}
