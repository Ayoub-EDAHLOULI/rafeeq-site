import Image from "next/image";
import { useTranslations } from "next-intl";
import { Reveal } from "../motion/Reveal";
import chatDark from "@/assets/screens/home-chat-dark.png";
import chatLight from "@/assets/screens/home-chat-light.png";

// Real screenshots of the desktop app, one per theme (same content, same
// crop). CSS shows the one matching the active theme. Both are lazy-loaded,
// and a display:none image is never fetched, so visitors only download the
// one they see; the other loads on the first theme switch. Not mirrored in
// RTL: the app's interface is English and left-to-right.
const SIZES = "(min-width: 1120px) 1072px, calc(100vw - 48px)";

export default function ProductShot() {
  const t = useTranslations("home");

  return (
    <Reveal className="overflow-hidden rounded-[18px] border border-line bg-bg">
      <Image
        src={chatLight}
        alt={t("shotAlt")}
        sizes={SIZES}
        className="theme-light-only h-auto w-full"
      />
      <Image
        src={chatDark}
        alt={t("shotAlt")}
        sizes={SIZES}
        className="theme-dark-only h-auto w-full"
      />
    </Reveal>
  );
}
