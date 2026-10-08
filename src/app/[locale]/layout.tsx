import type { Metadata, Viewport } from "next";
import { Hanken_Grotesk, JetBrains_Mono } from "next/font/google";
import localFont from "next/font/local";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import MotionProvider from "@/components/motion/MotionProvider";
import ChatWidget from "@/components/assistant/ChatWidget";
import ScrollToTop from "@/components/ScrollToTop";
import { routing, rtlLocales } from "@/i18n/routing";
import { THEME_INIT_SCRIPT } from "@/lib/theme";
import "./globals.css";

// Fonts are downloaded at build time and served from this site; the browser
// never contacts Google. See --font-sans in globals.css for the stack order.
const hanken = Hanken_Grotesk({
  variable: "--font-hanken",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500"],
});

// IBM Plex Sans Arabic, Arabic subset only (files from Google Fonts, OFL
// license in src/assets/fonts/OFL.txt). Loaded locally because
// next/font/google always declares every subset and, in this Next version,
// ignores adjustFontFallback: false; an Arial fallback face would capture
// Arabic text on Windows. Not preloaded: only pages with Arabic text fetch it.
const plexArabic = localFont({
  variable: "--font-plex-arabic",
  src: [
    { path: "../../assets/fonts/IBMPlexSansArabic-400-arabic.woff2", weight: "400" },
    { path: "../../assets/fonts/IBMPlexSansArabic-500-arabic.woff2", weight: "500" },
    { path: "../../assets/fonts/IBMPlexSansArabic-600-arabic.woff2", weight: "600" },
  ],
  // Arabic blocks only (single literal: next/font requires literal values).
  declarations: [
    {
      prop: "unicode-range",
      value:
        "U+0600-06FF, U+0750-077F, U+0870-08FF, U+200C-200E, U+2010-2011, U+204F, U+2E41, U+FB50-FDFF, U+FE70-FEFC",
    },
  ],
  preload: false,
  adjustFontFallback: false,
});

// Mobile browser bar color; follows the OS setting. Keep in sync with --bg
// in globals.css.
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f5f6f8" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0c10" },
  ],
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });
  return {
    title: {
      default: t("title"),
      template: `%s — Rafeeq`,
    },
    description: t("description"),
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);

  const dir = rtlLocales.includes(locale) ? "rtl" : "ltr";

  return (
    <html
      lang={locale}
      dir={dir}
      className={`${hanken.variable} ${jetbrainsMono.variable} ${plexArabic.variable} h-full antialiased`}
      // The head script sets data-theme before React hydrates.
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body className="flex min-h-full flex-col bg-bg text-text">
        <NextIntlClientProvider>
          <MotionProvider>
            <Nav />
            <main className="flex-1">{children}</main>
            <Footer />
            <ScrollToTop />
            <ChatWidget />
          </MotionProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
