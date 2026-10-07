export type Theme = "light" | "dark";

export const THEME_STORAGE_KEY = "rafeeq-site-theme";

// Runs in <head> before the first paint: applies a saved choice so the page
// never flashes the wrong theme. Without a saved choice, data-theme stays
// unset and globals.css follows the OS preference.
export const THEME_INIT_SCRIPT = `(function(){try{var t=localStorage.getItem(${JSON.stringify(
  THEME_STORAGE_KEY,
)});if(t==="light"||t==="dark")document.documentElement.setAttribute("data-theme",t)}catch(e){}})()`;
