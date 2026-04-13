"use client";

import { Moon, Sun } from "lucide-react";

import { type ThemeMode } from "@/hooks/use-theme";

type ThemeToggleProps = {
  themeMode: ThemeMode;
  onToggle: () => void;
};

export const ThemeToggle = ({ themeMode, onToggle }: ThemeToggleProps) => {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
    >
      {themeMode === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
      {themeMode === "light" ? "Dark" : "Light"}
    </button>
  );
};
