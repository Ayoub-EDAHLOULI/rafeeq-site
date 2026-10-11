"use client";

import { THEME_INIT_SCRIPT } from "@/lib/theme";

// The <head> script that applies the saved theme before the first paint.
// In the server HTML it is a normal script and runs while the page parses.
// When React renders it in the browser (hydration, or a language switch that
// re-renders the layout) it becomes text/plain: the theme is already applied,
// and React warns about rendering executable <script> tags on the client.
// suppressHydrationWarning covers the type difference. Pattern from the
// Next.js guide "Preventing flash before hydration".
export default function ThemeScript() {
  return (
    <script
      type={typeof window === "undefined" ? "text/javascript" : "text/plain"}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }}
    />
  );
}
