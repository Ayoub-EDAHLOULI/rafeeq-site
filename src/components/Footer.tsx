import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import Container from "./ui/Container";
import Logo from "./ui/Logo";

const GITHUB_URL = "https://github.com/Ayoub-EDAHLOULI/Rafeeq";

// Letter spacing breaks the joins between Arabic letters, so labels drop it
// in RTL. Uppercase has no effect on Arabic or Chinese.
const LABEL =
  "text-xs font-semibold uppercase tracking-[0.08em] text-faint rtl:tracking-normal";
const LINK = "flex min-h-11 items-center text-muted transition-colors hover:text-text";

export default function Footer() {
  const t = useTranslations("footer");
  const nav = useTranslations("nav");

  return (
    <footer className="mt-auto border-t border-line">
      <Container className="flex flex-wrap gap-x-16 gap-y-10 pt-14 pb-10">
        <div className="min-w-0 flex-[2_1_260px]">
          <Logo size="sm" />
          <p className="mt-3.5 max-w-xs text-muted">{t("description")}</p>
        </div>

        <nav aria-labelledby="footer-product" className="flex-[1_1_140px]">
          <p id="footer-product" className={LABEL}>
            {t("product")}
          </p>
          <ul className="mt-2">
            <li>
              <Link href="/features" className={LINK}>
                {nav("features")}
              </Link>
            </li>
            <li>
              <Link href="/download" className={LINK}>
                {nav("download")}
              </Link>
            </li>
            <li>
              <Link href="/docs" className={LINK}>
                {nav("docs")}
              </Link>
            </li>
          </ul>
        </nav>

        <nav aria-labelledby="footer-project" className="flex-[1_1_140px]">
          <p id="footer-project" className={LABEL}>
            {t("project")}
          </p>
          <ul className="mt-2">
            <li>
              <a href={GITHUB_URL} className={LINK}>
                GitHub
              </a>
            </li>
            <li>
              <a href={`${GITHUB_URL}#readme`} className={LINK}>
                README
              </a>
            </li>
          </ul>
        </nav>
      </Container>

      {/* Extra bottom padding on phones keeps this row clear of the
          floating assistant button. */}
      <Container className="flex flex-wrap justify-between gap-2 pb-24 text-sm text-muted sm:pb-10">
        <p>
          &copy; {new Date().getFullYear()} Rafeeq. {t("rights")}
        </p>
        <p>
          {t("builtBy")}{" "}
          <a
            href="https://ayoubedahlouli.com"
            className="font-medium text-text transition-colors hover:text-accent-fg"
          >
            Ayoub Edahlouli
          </a>
        </p>
      </Container>
    </footer>
  );
}
