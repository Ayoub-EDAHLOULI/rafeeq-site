import type { Metadata } from "next";
import { routing } from "@/i18n/routing";

// Open Graph locale codes for the six site languages.
const OG_LOCALES: Record<string, string> = {
  en: "en_US",
  fr: "fr_FR",
  es: "es_ES",
  de: "de_DE",
  ar: "ar_AR",
  zh: "zh_CN",
};

export const SITE_PATHS = ["", "/features", "/download", "/docs"] as const;
export type SitePath = (typeof SITE_PATHS)[number];

// Public address of the site, e.g. https://rafeeq.example (no trailing
// slash). Set SITE_URL in the build environment once the domain exists.
// While it is unset, no canonical, hreflang or absolute URLs are emitted,
// so nothing points at a wrong domain.
export function siteUrl(): string | null {
  const raw = process.env.SITE_URL?.trim();
  return raw ? raw.replace(/\/+$/, "") : null;
}

export function localizedPath(locale: string, path: SitePath): string {
  return `/${locale}${path}`;
}

export function languageAlternates(path: SitePath): Record<string, string> {
  return {
    ...Object.fromEntries(
      routing.locales.map((locale) => [locale, localizedPath(locale, path)]),
    ),
    "x-default": localizedPath(routing.defaultLocale, path),
  };
}

// Metadata for one page in one language. `title` is the page title (the
// layout's "%s — Rafeeq" template adds the brand); leave it out on Home,
// which uses the layout's full default title. `socialTitle` is the full
// title for link previews, where the template does not apply.
export function pageMetadata({
  locale,
  path,
  title,
  socialTitle,
  description,
}: {
  locale: string;
  path: SitePath;
  title?: string;
  socialTitle: string;
  description: string;
}): Metadata {
  const base = siteUrl();

  return {
    ...(title ? { title } : {}),
    description,
    openGraph: {
      type: "website",
      siteName: "Rafeeq",
      title: socialTitle,
      description,
      locale: OG_LOCALES[locale],
      alternateLocale: routing.locales
        .filter((other) => other !== locale)
        .map((other) => OG_LOCALES[other]),
      ...(base ? { url: localizedPath(locale, path) } : {}),
    },
    twitter: {
      card: "summary",
      title: socialTitle,
      description,
    },
    ...(base
      ? {
          metadataBase: new URL(base),
          alternates: {
            canonical: localizedPath(locale, path),
            languages: languageAlternates(path),
          },
        }
      : {}),
  };
}
