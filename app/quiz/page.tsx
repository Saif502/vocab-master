"use client";

import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, PlayCircle } from "lucide-react";

import { QuizSession } from "@/components/quiz-session";
import { ThemeToggle } from "@/components/theme-toggle";
import { useTheme } from "@/hooks/use-theme";
import { useVocabList } from "@/hooks/use-vocab-list";

export default function QuizPage() {
  const { words, hydrated } = useVocabList();
  const { themeMode, toggleTheme } = useTheme();

  return (
    <main className="mx-auto min-h-screen w-full max-w-6xl px-4 py-8 md:px-6 lg:py-10">
      <div className="mb-6 flex items-center justify-between">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-sky-300 hover:text-slate-900 dark:hover:text-sky-100 transition">
          <ChevronLeft className="h-4 w-4" />
          Back to Home
        </Link>
        <ThemeToggle themeMode={themeMode} onToggle={toggleTheme} />
      </div>

      <div className="mb-4 inline-flex items-center gap-2 rounded-lg border border-sky-200 dark:border-sky-700 bg-sky-50 dark:bg-sky-900/30 px-3 py-2 text-sky-700 dark:text-sky-300 shadow-sm">
        <Image src="/start-quiz-icon.svg" alt="Start quiz icon" width={24} height={24} className="h-6 w-6" />
        <span className="text-sm font-semibold">Start Quiz</span>
      </div>

      {hydrated ? (
        <QuizSession wordsPool={words} title="Start Quiz" description="Answer 10 words with mistake-priority spaced repetition." enableCategoryFilter />
      ) : (
        <p className="text-sm text-slate-500">Loading vocabulary...</p>
      )}
    </main>
  );
}
