import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { pageMetadata } from "@/lib/metadata";
import DocsContent from "./DocsContent";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "docs" });
  return pageMetadata({
    locale,
    path: "/docs",
    title: t("title"),
    socialTitle: `${t("title")} — Rafeeq`,
    description: t("subtitle"),
  });
}

export default function DocsPage() {
  return <DocsContent />;
}
