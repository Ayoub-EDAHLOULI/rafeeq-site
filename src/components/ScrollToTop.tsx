"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { AnimatePresence, m, useReducedMotion } from "motion/react";
import { ArrowUpIcon } from "./ui/icons";

// Floating "back to top" button in the bottom corner opposite the assistant
// (bottom-left in LTR, bottom-right in Arabic). Appears after about one
// screen of scrolling.
export default function ScrollToTop() {
  const t = useTranslations("common");
  const reduceMotion = useReducedMotion();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      setVisible(window.scrollY > window.innerHeight);
    };
    // At most one check per animation frame.
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    onScroll(); // The page may load already scrolled (back/forward, anchors).
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  function backToTop() {
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
    // Keyboard and screen-reader users continue from the top of the page.
    document.querySelector<HTMLElement>("header a")?.focus({ preventScroll: true });
  }

  return (
    <AnimatePresence>
      {visible && (
        <m.button
          type="button"
          onClick={backToTop}
          aria-label={t("backToTop")}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-s-6 bottom-6 z-40 flex h-11 w-11 items-center justify-center rounded-full border border-line bg-panel text-text shadow-lg transition-colors hover:bg-panel-2"
        >
          <ArrowUpIcon />
        </m.button>
      )}
    </AnimatePresence>
  );
}
