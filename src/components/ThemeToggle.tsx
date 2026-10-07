"use client";

import { useSyncExternalStore } from "react";
import { useTranslations } from "next-intl";
import { THEME_STORAGE_KEY, type Theme } from "@/lib/theme";

const darkQuery = () => window.matchMedia("(prefers-color-scheme: dark)");

// The effective theme is the data-theme attribute (set by the head script
// or a click), or the OS preference when no choice has been made. Watch
// both so the icon stays correct when either changes.
function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });
  const query = darkQuery();
  query.addEventListener("change", onChange);
  return () => {
    observer.disconnect();
    query.removeEventListener("change", onChange);
  };
}

function getSnapshot(): Theme {
  const attr = document.documentElement.getAttribute("data-theme");
  if (attr === "light" || attr === "dark") return attr;
  return darkQuery().matches ? "dark" : "light";
}

// The server can't know the theme; render a same-size placeholder instead.
const getServerSnapshot = () => null;

export default function ThemeToggle() {
  const t = useTranslations("nav");
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  if (!theme) return <span aria-hidden className="h-8 w-8 shrink-0" />;

  function toggle() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // Storage unavailable (private mode): the choice lasts for this page.
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={t("theme")}
      className="flex h-8 w-8 items-center justify-center rounded-md text-subtext transition-colors hover:bg-input-bg hover:text-text"
    >
      {theme === "dark" ? (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.6" />
          <path
            d="M12 2v2M12 20v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M2 12h2M20 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path
            d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5Z"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </button>
  );
}
