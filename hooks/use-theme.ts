"use client";

import { useEffect, useState } from "react";

export type ThemeMode = "light" | "dark";

const THEME_KEY = "vocabmaster.theme";

export const useTheme = () => {
  const [themeMode, setThemeMode] = useState<ThemeMode>("light");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem(THEME_KEY);
    if (saved === "light" || saved === "dark") {
      setThemeMode(saved);
      setReady(true);
      return;
    }

    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setThemeMode(prefersDark ? "dark" : "light");
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) {
      return;
    }

    document.documentElement.classList.toggle("dark", themeMode === "dark");
    window.localStorage.setItem(THEME_KEY, themeMode);
  }, [themeMode, ready]);

  const toggleTheme = () => {
    setThemeMode((prev) => (prev === "light" ? "dark" : "light"));
  };

  return {
    themeMode,
    toggleTheme
  };
};
