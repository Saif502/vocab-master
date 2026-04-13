import { Flame, GraduationCap, Sparkles, Target } from "lucide-react";

type DashboardProps = {
  masteredCount: number;
  totalWords: number;
  streak: number;
  dailyCorrectCount: number;
  dailyGoal: number;
};

export const Dashboard = ({ masteredCount, totalWords, streak, dailyCorrectCount, dailyGoal }: DashboardProps) => {
  const progress = totalWords > 0 ? Math.round((masteredCount / totalWords) * 100) : 0;
  const dailyProgress = dailyGoal > 0 ? Math.min(100, Math.round((dailyCorrectCount / dailyGoal) * 100)) : 0;

  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <article className="rounded-2xl border border-sky-100 bg-white/80 p-6 shadow-soft backdrop-blur animate-fade-up">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Mastery</h2>
          <GraduationCap className="h-5 w-5 text-sky-500" />
        </div>
        <p className="text-3xl font-bold text-ink">{masteredCount}</p>
        <p className="mt-1 text-sm text-slate-600">out of {totalWords} words mastered</p>
        <div className="mt-4 h-2.5 w-full rounded-full bg-slate-200">
          <div
            className="h-2.5 rounded-full bg-gradient-to-r from-sky-400 to-mint transition-all duration-700"
            style={{ width: `${progress}%` }}
          />
        </div>
      </article>

      <article className="rounded-2xl border border-orange-100 bg-white/80 p-6 shadow-soft backdrop-blur animate-fade-up [animation-delay:120ms]">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Daily Streak</h2>
          <Flame className="h-5 w-5 text-sunset animate-pulse-glow rounded-full" />
        </div>
        <p className="text-3xl font-bold text-ink">{streak} day{streak === 1 ? "" : "s"}</p>
        <p className="mt-1 text-sm text-slate-600">Keep practicing to protect your streak.</p>
      </article>

      <article className="rounded-2xl border border-emerald-100 bg-white/80 p-6 shadow-soft backdrop-blur animate-fade-up [animation-delay:200ms]">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">VocabMaster</h2>
          <Sparkles className="h-5 w-5 text-mint" />
        </div>
        <p className="text-3xl font-bold text-ink">10-Word Quiz</p>
        <p className="mt-1 text-sm text-slate-600">Mistake-first spaced repetition built in.</p>
      </article>

      <article className="rounded-2xl border border-fuchsia-100 bg-white/80 p-6 shadow-soft backdrop-blur animate-fade-up [animation-delay:280ms]">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Daily Goal</h2>
          <Target className="h-5 w-5 text-fuchsia-500" />
        </div>
        <p className="text-3xl font-bold text-ink">
          {dailyCorrectCount}/{dailyGoal}
        </p>
        <p className="mt-1 text-sm text-slate-600">Correct words today</p>
        <div className="mt-4 h-2.5 w-full rounded-full bg-slate-200">
          <div
            className="h-2.5 rounded-full bg-gradient-to-r from-fuchsia-400 to-sky-500 transition-all duration-700"
            style={{ width: `${dailyProgress}%` }}
          />
        </div>
      </article>
    </section>
  );
};
