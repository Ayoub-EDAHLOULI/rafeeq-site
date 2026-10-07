Read CLAUDE.md and AGENTS.md first and follow them.

I added a design/ folder with the redesign of the Rafeeq marketing website (4 pages, dark and light). Your job right now is to turn it into a BUILD PLAN. Do not write or change any site code yet.

1. Read, in this order: design/README.md, design/TOKENS.md, design/preview/index.html, and the files in design/preview/dark/ (one per page). design/screens/ has the original sources if you need exact inline styles; they use template tags and will not render on their own.

2. Study the current site: src/app/ (including the [locale] routes and layout), src/components/ (Nav, Footer, LocaleSwitcher, ThemeToggle and anything else), the i18n setup, every locale file in messages/ (all six languages), the global styles and theme handling, the hero background component if there is one, proxy.ts, next.config.ts and package.json.

3. Produce a gap analysis: for each of the 4 pages, what already exists, what must change, and what is new. Separate three kinds of work:
   (a) visual only
   (b) new or changed components and layout
   (c) new copy that must be added to every locale file
   design/README.md lists what I believe is reused versus new. Verify that against the code and messages, and correct it.

4. Produce an ordered build plan:
   - Each step is small enough for one meaningful commit and leaves the site working and deployable.
   - For each step: goal, files you expect to touch, acceptance criteria (what I can see or test), how to verify it by hand (both themes, English and Arabic, phone width and desktop width), risks, and a suggested one-line commit message.
   - Suggested order: tokens and theme variables, fonts, nav and footer, Download, Docs, Features, Home sections, then the Home product window last. Change the order if the code says otherwise, and say why.

5. Be critical. Flag anything in the design that is a bad idea, too costly, or conflicts with the site's constraints. Flag decisions I need to make, and give your recommendation for each. Check specifically:
   - Every new string must go through the existing i18n system for all six locales. Write the English first. If you draft the other languages, mark them clearly as needing native review.
   - Arabic is right-to-left. Check which parts of the design assume left-to-right (flex order, text alignment, borders, arrows) and plan for logical CSS properties and dir handling.
   - Fonts must be self-hosted at build time (next/font). No runtime request to Google Fonts.
   - The product window in the Home design is an HTML stand-in. Plan it as an image slot with dark and light screenshots and a placeholder until real screenshots of the redesigned app exist. Say what screenshots I need to produce, with sizes.
   - The current Home page has an animated particle background that the design does not include. Give me options (keep subtle, keep only behind the hero, drop) with a recommendation, including performance and reduced-motion.
   - Download buttons are wired to real release assets. Do not regress that. Keep real links.
   - The design has bracketed placeholders (Windows versions, minimum RAM, checksums). Tell me how to handle them so they never ship as brackets.
   - The Features page says long documents are truncated. Check what the desktop app actually does and tell me if the site copy is accurate.
   - Mobile nav behavior, theme persistence without a flash on load, per-locale page titles and meta descriptions, and contrast in both themes.

6. Write the plan to design/BUILD_PLAN.md and summarize it in chat in under 40 lines. Do not create any other file.

Rules for working with me:
- Do not implement anything until I confirm the plan. After that, work one step at a time: show what you will do, wait for my OK, implement, then tell me how to verify it.
- Do not run git commit. Give me the commit message and I will paste it myself.
- Do not add dependencies without telling me why, and prefer none.
- Treat all sample text in the mockups, especially the chat inside the product window, as placeholder. Do not hardcode it into pages.
