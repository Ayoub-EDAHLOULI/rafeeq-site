import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import {
  SITE_PATHS,
  languageAlternates,
  localizedPath,
  siteUrl,
} from "@/lib/metadata";

// Every page in every language, each with its language alternates. Empty
// until SITE_URL is set, because sitemap URLs must be absolute.
export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl();
  if (!base) return [];

  const absolute = (path: string) => `${base}${path}`;
  return routing.locales.flatMap((locale) =>
    SITE_PATHS.map((path) => ({
      url: absolute(localizedPath(locale, path)),
      alternates: {
        languages: Object.fromEntries(
          Object.entries(languageAlternates(path)).map(([lang, href]) => [
            lang,
            absolute(href),
          ]),
        ),
      },
    })),
  );
}
