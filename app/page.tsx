"use client";

import Link from "next/link";
import Image from "next/image";
import { BookOpenCheck, CirclePlus, PlayCircle, RotateCcw, Sparkles } from "lucide-react";

import { Dashboard } from "@/components/dashboard";
import { ThemeToggle } from "@/components/theme-toggle";
import { useProgress } from "@/hooks/use-progress";
import { useTheme } from "@/hooks/use-theme";
import { useVocabList } from "@/hooks/use-vocab-list";

const DAILY_GOAL = 30;

const navCards = [
  {
    title: "Start Quiz",
    subtitle: "Test yourself with 10-word mistake-priority quizzes",
    href: "/quiz",
    icon: PlayCircle,
    classes: "from-sky-500 to-cyan-500"
  },
  {
    title: "Practice Mode",
    subtitle: "Read word sets with timer, then take a focused quiz",
    href: "/practice",
    icon: BookOpenCheck,
    classes: "from-emerald-500 to-teal-500"
  },
  {
    title: "Add Vocab",
    subtitle: "Grow your custom local vocabulary list instantly",
    href: "/add-vocab",
    icon: CirclePlus,
    classes: "from-fuchsia-500 to-rose-500"
  }
];

export default function HomePage() {
  const { progress, masteredCount, resetProgress } = useProgress();
  const { totalWords, hydrated } = useVocabList();
  const { themeMode, toggleTheme } = useTheme();

  const handleResetStats = () => {
    const confirmed = window.confirm("Reset mastery, streak, and daily goal progress?");
    if (!confirmed) {
      return;
    }

    resetProgress();
  };

  return (
    <main className="mx-auto min-h-screen w-full max-w-6xl px-4 py-8 md:px-6 lg:py-10">
      <header className="mb-8 animate-fade-up">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-slate-600 dark:text-sky-100">IELTS Vocabulary Practice</p>
            <h1 className="mt-2 bg-gradient-to-r from-ink via-sky-600 to-fuchsia-600 bg-clip-text text-4xl font-bold tracking-tight text-transparent dark:bg-none dark:text-slate-100 dark:drop-shadow-[0_2px_10px_rgba(59,130,246,0.35)] md:text-5xl">
              VocabMaster
            </h1>
            <p className="mt-3 max-w-2xl text-slate-600 dark:text-slate-200">
              Build fluency with quiz practice, timed reading mode, and your own expanding vocabulary list.
            </p>
          </div>
          <ThemeToggle themeMode={themeMode} onToggle={toggleTheme} />
        </div>
      </header>

      <div className="mb-4 flex justify-end">
        <button
          type="button"
          onClick={handleResetStats}
          className="inline-flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700 transition hover:border-rose-300 hover:bg-rose-100"
        >
          <RotateCcw className="h-4 w-4" />
          Reset Stats
        </button>
      </div>

      <Dashboard
        masteredCount={masteredCount}
        totalWords={totalWords}
        streak={progress.streak}
        dailyCorrectCount={progress.dailyCorrectIds.length}
        dailyGoal={DAILY_GOAL}
      />

      <section className="mt-8 grid gap-4 md:grid-cols-3">
        {navCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.href}
              href={card.href}
              className="group rounded-2xl border border-slate-200 bg-white/85 p-5 shadow-soft transition hover:-translate-y-1 hover:shadow-xl"
              style={{ animationDelay: `${120 + index * 90}ms` }}
            >
              <div className={`mb-4 inline-flex rounded-xl bg-gradient-to-r p-2.5 text-white ${card.classes}`}>
                {card.title === "Start Quiz" ? (
                  <div className="relative h-8 w-8 rounded-lg p-0 flex items-center justify-center" style={{ backgroundColor: "#0dbfb0" }}>
                    <Image
                      src="/start-quiz-icon.svg"
                      alt="Start quiz icon"
                      width={32}
                      height={32}
                      className="h-8 w-8"
                    />
                  </div>
                ) : (
                  <Icon className="h-6 w-6" />
                )}
              </div>
              <h2 className="text-xl font-semibold text-ink">
                {card.title}
                {card.title === "Start Quiz" ? (
                  <span className="ml-2 inline-flex items-center rounded-full bg-sky-100 px-2 py-0.5 text-xs font-semibold text-sky-700">
                    <Sparkles className="mr-1 h-3 w-3" />
                    Ready
                  </span>
                ) : null}
              </h2>
              <p className="mt-2 text-sm text-slate-600">{card.subtitle}</p>
              <p className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-sky-700 transition group-hover:translate-x-1">
                {card.title === "Start Quiz" ? <Sparkles className="h-4 w-4" /> : null}
                Open {card.title}
              </p>
            </Link>
          );
        })}
      </section>

      {!hydrated && <p className="mt-4 text-sm text-slate-500">Loading your local vocabulary...</p>}
    </main>
  );
}
