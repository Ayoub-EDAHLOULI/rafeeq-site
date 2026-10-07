"use client";

import { useId, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import Container from "./ui/Container";
import Logo from "./ui/Logo";
import Button from "./ui/Button";
import ThemeToggle from "./ThemeToggle";
import LocaleSwitcher from "./LocaleSwitcher";

const GITHUB_URL = "https://github.com/Ayoub-EDAHLOULI/Rafeeq";

export default function Nav() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const menuId = useId();
  const toggleRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);

  // Close the phone menu whenever the route changes (including back/forward).
  const [lastPathname, setLastPathname] = useState(pathname);
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setOpen(false);
  }

  const links = [
    { href: "/features", label: t("features") },
    { href: "/docs", label: t("docs") },
  ] as const;

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  function closeMenu(returnFocus = false) {
    setOpen(false);
    if (returnFocus) toggleRef.current?.focus();
  }

  const linkClass = (active: boolean) =>
    `flex h-11 items-center rounded-[10px] px-3 font-medium transition-colors hover:text-text ${
      active ? "text-text" : "text-muted"
    }`;

  return (
    <header
      className="border-b border-line"
      onKeyDown={(e) => {
        if (e.key === "Escape" && open) closeMenu(true);
      }}
    >
      <Container className="flex min-h-18 items-center justify-between gap-6">
        <Link
          href="/"
          className="flex min-h-11 shrink-0 items-center rounded-[10px]"
          onClick={() => closeMenu()}
        >
          <Logo />
        </Link>

        <nav className="hidden items-center gap-1.5 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActive(link.href) ? "page" : undefined}
              className={linkClass(isActive(link.href))}
            >
              {link.label}
            </Link>
          ))}
          <a href={GITHUB_URL} className={linkClass(false)}>
            GitHub
          </a>
          <div className="ms-2 flex items-center gap-1.5">
            <LocaleSwitcher />
            <ThemeToggle />
            <Button href="/download" size="sm">
              {t("download")}
            </Button>
          </div>
        </nav>

        <div className="flex items-center gap-2 md:hidden">
          <Button href="/download" size="sm" onClick={() => closeMenu()}>
            {t("download")}
          </Button>
          <button
            ref={toggleRef}
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? t("closeMenu") : t("openMenu")}
            aria-expanded={open}
            aria-controls={open ? menuId : undefined}
            className="flex h-11 w-11 items-center justify-center rounded-[10px] text-text transition-colors hover:bg-panel-2"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              aria-hidden
            >
              {open ? (
                <path d="M6 6l12 12M18 6L6 18" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" />
              )}
            </svg>
          </button>
        </div>
      </Container>

      {open && (
        <nav id={menuId} className="border-t border-line md:hidden">
          <Container className="flex flex-col py-3">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive(link.href) ? "page" : undefined}
                onClick={() => closeMenu()}
                className={linkClass(isActive(link.href))}
              >
                {link.label}
              </Link>
            ))}
            <a href={GITHUB_URL} className={linkClass(false)}>
              GitHub
            </a>
            <div className="mt-2 flex items-center justify-between border-t border-line pt-3">
              <LocaleSwitcher />
              <ThemeToggle />
            </div>
          </Container>
        </nav>
      )}
    </header>
  );
}
