"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ChevronLeft, Clock3 } from "lucide-react";

import { QuizSession } from "@/components/quiz-session";
import { ThemeToggle } from "@/components/theme-toggle";
import { useTheme } from "@/hooks/use-theme";
import { CATEGORY_LABELS, type WordCategory } from "@/lib/words";
import { type StoredWord, getWordCategory } from "@/lib/vocab-storage";
import { useVocabList } from "@/hooks/use-vocab-list";

type Mode = "setup" | "reading" | "finished" | "quiz";

const shuffle = <T,>(list: T[]): T[] => {
  const clone = [...list];
  for (let i = clone.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [clone[i], clone[j]] = [clone[j], clone[i]];
  }
  return clone;
};

export default function PracticePage() {
  const { words, hydrated } = useVocabList();
  const { themeMode, toggleTheme } = useTheme();

  const [mode, setMode] = useState<Mode>("setup");
  const [timeLimit, setTimeLimit] = useState(300);
  const [vocabCount, setVocabCount] = useState(15);
  const [category, setCategory] = useState<WordCategory | "all">("all");
  const [remainingSeconds, setRemainingSeconds] = useState(300);
  const [reviewWords, setReviewWords] = useState<StoredWord[]>([]);

  const categoryOptions = useMemo(
    () => [
      { value: "all" as const, label: "All Categories" },
      ...Object.entries(CATEGORY_LABELS).map(([value, label]) => ({
        value: value as WordCategory,
        label
      }))
    ],
    []
  );

  const filteredWords = useMemo(() => {
    if (category === "all") {
      return words;
    }

    return words.filter((word) => getWordCategory(word.id) === category);
  }, [words, category]);

  useEffect(() => {
    if (mode !== "reading") {
      return;
    }

    if (remainingSeconds <= 0) {
      setMode("finished");
      return;
    }

    const timer = window.setInterval(() => {
      setRemainingSeconds((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [mode, remainingSeconds]);

  const formattedTime = `${Math.floor(remainingSeconds / 60)
    .toString()
    .padStart(2, "0")}:${(remainingSeconds % 60).toString().padStart(2, "0")}`;

  const startReading = () => {
    const selection = shuffle(filteredWords).slice(0, Math.min(vocabCount, filteredWords.length));
    setReviewWords(selection);
    setRemainingSeconds(timeLimit);
    setMode("reading");
  };

  const resetPractice = () => {
    setMode("setup");
    setReviewWords([]);
  };

  return (
    <main className="mx-auto min-h-screen w-full max-w-6xl px-4 py-8 md:px-6 lg:py-10">
      <div className="mb-6 flex items-center justify-between">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900">
          <ChevronLeft className="h-4 w-4" />
          Back to Home
        </Link>
        <ThemeToggle themeMode={themeMode} onToggle={toggleTheme} />
      </div>

      {!hydrated && <p className="text-sm text-slate-500">Loading vocabulary...</p>}

      {hydrated && mode === "setup" && (
        <section className="rounded-2xl border border-slate-200 bg-white/85 p-6 shadow-soft">
          <h1 className="text-3xl font-bold text-ink">Practice Mode</h1>
          <p className="mt-2 text-sm text-slate-600">Select a timer and category, then start reading words before taking a focused quiz.</p>

          <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-600">Words to Read</span>
              <select
                value={vocabCount}
                onChange={(event) => setVocabCount(Number(event.target.value))}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
              >
                <option value={10}>10 words</option>
                <option value={15}>15 words</option>
                <option value={20}>20 words</option>
                <option value={30}>30 words</option>
              </select>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-600">Reading Time</span>
              <select
                value={timeLimit}
                onChange={(event) => setTimeLimit(Number(event.target.value))}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
              >
                <option value={300}>5 minutes</option>
                <option value={420}>7 minutes</option>
                <option value={600}>10 minutes</option>
                <option value={900}>15 minutes</option>
              </select>
            </label>

            <label className="block md:col-span-2 lg:col-span-2">
              <span className="mb-2 block text-sm font-semibold text-slate-600">Category</span>
              <select
                value={category}
                onChange={(event) => setCategory(event.target.value as WordCategory | "all")}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
              >
                {categoryOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <button
            type="button"
            onClick={startReading}
            disabled={filteredWords.length === 0}
            className="mt-6 rounded-lg bg-ink px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Start Reading
          </button>
        </section>
      )}

      {hydrated && mode === "reading" && (
        <section className="rounded-2xl border border-slate-200 bg-white/85 p-6 shadow-soft">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-2xl font-semibold text-ink">Reading Session</h2>
            <div className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700">
              <Clock3 className="h-4 w-4" />
              {formattedTime}
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            {reviewWords.map((word) => (
              <article key={word.id} className="rounded-xl border border-slate-200 bg-white p-4">
                <p className="text-lg font-semibold text-ink">{word.en}</p>
                <p className="mt-1 text-base text-slate-700" style={{ fontFamily: "var(--font-hind)" }}>
                  {word.bn}
                </p>
              </article>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setMode("finished")}
              className="rounded-lg bg-ink px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Finish
            </button>
          </div>
        </section>
      )}

      {hydrated && mode === "finished" && (
        <section className="rounded-2xl border border-slate-200 bg-white/85 p-6 shadow-soft">
          <h2 className="text-2xl font-semibold text-ink">Practice Complete</h2>
          <p className="mt-2 text-sm text-slate-600">Ready to test on the words you just reviewed?</p>

          <div className="mt-5 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setMode("quiz")}
              className="rounded-lg bg-sunset px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-600"
            >
              Take Quiz on these words
            </button>
            <button
              type="button"
              onClick={resetPractice}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400"
            >
              Start New Practice
            </button>
          </div>
        </section>
      )}

      {hydrated && mode === "quiz" && (
        <QuizSession
          wordsPool={reviewWords}
          title="Practice Quiz"
          description="This quiz uses only the words from your latest reading session."
          enableCategoryFilter={false}
        />
      )}
    </main>
  );
}
