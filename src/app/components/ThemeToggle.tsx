"use client";

import { useEffect, useSyncExternalStore } from "react";
import { MoonStar, SunMedium } from "lucide-react";
import { motion } from "framer-motion";

function subscribeToTheme(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });
  return () => observer.disconnect();
}

const ThemeToggle = () => {
  const isDark = useSyncExternalStore(
    subscribeToTheme,
    () => document.documentElement.classList.contains("dark"),
    () => false,
  );

  useEffect(() => {
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)");
    const syncTheme = () => {
      let savedTheme: string | null = null;
      try {
        savedTheme = localStorage.getItem("theme");
      } catch {
        // Theme switching also works when browser storage is unavailable.
      }
      const prefersDark =
        savedTheme === "dark" ||
        (savedTheme !== "light" && systemTheme.matches);
      document.documentElement.classList.toggle("dark", prefersDark);
    };

    syncTheme();
    systemTheme.addEventListener("change", syncTheme);
    window.addEventListener("storage", syncTheme);
    return () => {
      systemTheme.removeEventListener("change", syncTheme);
      window.removeEventListener("storage", syncTheme);
    };
  }, []);

  const toggleTheme = () => {
    const newIsDark = document.documentElement.classList.toggle("dark");
    try {
      localStorage.setItem("theme", newIsDark ? "dark" : "light");
    } catch {
      // Keep the selected theme for this page when storage is unavailable.
    }
  };

  return (
    <motion.button
      onClick={toggleTheme}
      whileTap={{ scale: 0.92 }}
      className='inset-panel p-2 rounded-full hover:border-[color:var(--primary)]'
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      aria-pressed={isDark}>
      {isDark ? <SunMedium size={18} /> : <MoonStar size={18} />}
    </motion.button>
  );
};

export default ThemeToggle;
