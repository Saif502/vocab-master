"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowRight, CheckCheck, RotateCw, Trophy } from "lucide-react";

import { type AnswerStatus, QuizCard } from "@/components/quiz-card";
import { useProgress } from "@/hooks/use-progress";
import { buildQuizBatch, getPrimaryAnswer, isCorrectAnswer } from "@/lib/quiz";
import { CATEGORY_LABELS, type WordCategory } from "@/lib/words";
import { type StoredWord, toCategorizedWords } from "@/lib/vocab-storage";

const DEFAULT_QUIZ_SIZE = 10;

type StatusMap = Record<number, AnswerStatus>;
type AnswerMap = Record<number, string>;

type ResultItem = {
  id: number;
  bn: string;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
};

type QuizSessionProps = {
  wordsPool: StoredWord[];
  title?: string;
  description?: string;
  enableCategoryFilter?: boolean;
};

const getInitialStatusMap = (batchIds: number[]): StatusMap => {
  return batchIds.reduce<StatusMap>((acc, id) => {
    acc[id] = "idle";
    return acc;
  }, {});
};

const getInitialAnswerMap = (batchIds: number[]): AnswerMap => {
  return batchIds.reduce<AnswerMap>((acc, id) => {
    acc[id] = "";
    return acc;
  }, {});
};

export const QuizSession = ({
  wordsPool,
  title = "Quiz Session",
  description = "Translate Bengali words into correct English spellings.",
  enableCategoryFilter = true
}: QuizSessionProps) => {
  const { progress, markCorrect, markIncorrect } = useProgress();

  const [selectedCategory, setSelectedCategory] = useState<WordCategory | "all">("all");
  const [batchIds, setBatchIds] = useState<number[]>([]);
  const [statusMap, setStatusMap] = useState<StatusMap>({});
  const [answerMap, setAnswerMap] = useState<AnswerMap>({});
  const [isResultOpen, setIsResultOpen] = useState(false);
  const [resultItems, setResultItems] = useState<ResultItem[]>([]);
  const [showAnswerConfetti, setShowAnswerConfetti] = useState(false);

  const categorizedWords = useMemo(() => toCategorizedWords(wordsPool), [wordsPool]);

  const batch = useMemo(() => {
    const idSet = new Set(batchIds);
    return categorizedWords.filter((word) => idSet.has(word.id));
  }, [categorizedWords, batchIds]);

  const allCorrect = useMemo(
    () => batch.length > 0 && batch.every((word) => statusMap[word.id] === "correct"),
    [batch, statusMap]
  );

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

  const startNewBatch = () => {
    const quizSize = Math.min(DEFAULT_QUIZ_SIZE, categorizedWords.length);
    const nextBatch = buildQuizBatch(
      categorizedWords,
      progress.mistakenIds,
      enableCategoryFilter ? selectedCategory : "all",
      quizSize
    );
    const ids = nextBatch.map((word) => word.id);
    setBatchIds(ids);
    setStatusMap(getInitialStatusMap(ids));
    setAnswerMap(getInitialAnswerMap(ids));
    setResultItems([]);
    setIsResultOpen(false);
  };

  useEffect(() => {
    if (categorizedWords.length === 0) {
      setBatchIds([]);
      return;
    }

    startNewBatch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categorizedWords.length]);

  useEffect(() => {
    if (!enableCategoryFilter || categorizedWords.length === 0) {
      return;
    }

    startNewBatch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory]);

  const handleInputChange = (id: number, value: string) => {
    if (statusMap[id] === "correct") {
      return;
    }

    setAnswerMap((prev) => ({ ...prev, [id]: value }));

    if (statusMap[id] === "incorrect") {
      setStatusMap((prev) => ({ ...prev, [id]: "idle" }));
    }
  };

  const handleCheckAnswers = () => {
    setShowAnswerConfetti(true);
    window.setTimeout(() => setShowAnswerConfetti(false), 900);

    const nextStatus: StatusMap = { ...statusMap };
    const nextResults: ResultItem[] = [];

    for (const word of batch) {
      const value = answerMap[word.id] ?? "";
      const correct = isCorrectAnswer(value, word.en);
      nextStatus[word.id] = correct ? "correct" : "incorrect";

      nextResults.push({
        id: word.id,
        bn: word.bn,
        userAnswer: value.trim(),
        correctAnswer: getPrimaryAnswer(word.en),
        isCorrect: correct
      });

      if (correct) {
        markCorrect(word.id);
      } else {
        markIncorrect(word.id);
      }
    }

    setStatusMap(nextStatus);
    setResultItems(nextResults);
    setIsResultOpen(true);
  };

  const wrongItems = resultItems.filter((item) => !item.isCorrect);
  const correctCount = resultItems.length - wrongItems.length;
  const scorePercent = resultItems.length > 0 ? Math.round((correctCount / resultItems.length) * 100) : 0;
  const donutGradient = {
    background: `conic-gradient(#10b981 0deg ${(scorePercent / 100) * 360}deg, #f43f5e ${(scorePercent / 100) * 360}deg 360deg)`
  };

  const handleRetryWrongWords = () => {
    if (wrongItems.length === 0) {
      setIsResultOpen(false);
      return;
    }

    const wrongIdSet = new Set(wrongItems.map((item) => item.id));
    const nextBatch = categorizedWords.filter((word) => wrongIdSet.has(word.id));
    const ids = nextBatch.map((word) => word.id);
    setBatchIds(ids);
    setStatusMap(getInitialStatusMap(ids));
    setAnswerMap(getInitialAnswerMap(ids));
    setResultItems([]);
    setIsResultOpen(false);
  };

  if (categorizedWords.length === 0) {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white/80 p-8 text-center shadow-soft">
        <p className="text-lg font-semibold text-slate-700">No words available.</p>
        <p className="mt-2 text-sm text-slate-500">Add vocabulary first to start practicing.</p>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-slate-200/80 bg-white/85 p-5 shadow-soft backdrop-blur md:p-8">
      {showAnswerConfetti && (
        <div className="answer-confetti-wrap" aria-hidden="true">
          {Array.from({ length: 36 }).map((_, index) => (
            <span
              key={`answer-burst-${index}`}
              className="answer-confetti"
              style={{
                left: `${(index + 1) * 2.7}%`,
                animationDelay: `${(index % 9) * 40}ms`
              }}
            />
          ))}
        </div>
      )}

      {isResultOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
          <div className="result-modal-pop w-full max-w-3xl rounded-2xl border border-slate-200 bg-white p-5 shadow-soft md:p-7">
            <h3 className="bg-gradient-to-r from-sky-600 to-fuchsia-600 bg-clip-text text-xl font-bold text-transparent">Quiz Result</h3>
            <p className="mt-2 text-sm text-slate-600">
              You got <span className="font-semibold text-ink">{correctCount}</span> out of <span className="font-semibold text-ink">{resultItems.length}</span> correct.
            </p>

            {correctCount === resultItems.length && resultItems.length > 0 && (
              <div className="mt-4 overflow-hidden rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                <div className="relative z-10 flex items-center gap-3 text-emerald-800">
                  <Trophy className="h-5 w-5" />
                  <p className="font-semibold">Congratulations! Perfect round.</p>
                </div>
                <div className="confetti-wrap" aria-hidden="true">
                  {Array.from({ length: 18 }).map((_, index) => (
                    <span
                      key={`modal-confetti-${index}`}
                      className="confetti"
                      style={{
                        left: `${(index + 1) * 5.2}%`,
                        animationDelay: `${(index % 6) * 90}ms`
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            <div className="mt-4 grid gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4 md:grid-cols-[180px_1fr]">
              <div className="flex flex-col items-center justify-center">
                <div className="chart-entrance relative h-36 w-36 rounded-full p-2" style={donutGradient}>
                  <div className="flex h-full w-full items-center justify-center rounded-full bg-white">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-ink">{scorePercent}%</p>
                      <p className="text-xs uppercase tracking-[0.12em] text-slate-500">Score</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                  <span>Performance Graph</span>
                  <span>{correctCount}/{resultItems.length}</span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-slate-200">
                  <span
                    className="score-fill block h-full rounded-full bg-gradient-to-r from-emerald-400 to-teal-500"
                    style={{ width: `${scorePercent}%` }}
                  />
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                  <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-emerald-800">
                    Correct: {correctCount}
                  </div>
                  <div className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-rose-800">
                    Wrong: {wrongItems.length}
                  </div>
                </div>
                <div className="mt-3 grid grid-cols-10 gap-1">
                  {resultItems.map((item, index) => (
                    <span
                      key={`segment-${item.id}-${index}`}
                      className={`h-2.5 rounded-full ${item.isCorrect ? "bg-emerald-400" : "bg-rose-400"}`}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-4 max-h-[320px] space-y-3 overflow-y-auto pr-1">
              {resultItems.map((item) => (
                <article
                  key={`result-${item.id}`}
                  className={`rounded-lg border p-3 ${item.isCorrect ? "border-emerald-200 bg-emerald-50" : "border-rose-200 bg-rose-50"}`}
                >
                  <p className="text-sm font-semibold text-slate-900" style={{ fontFamily: "var(--font-hind)" }}>
                    {item.bn}
                  </p>
                  <p className="mt-1 text-sm text-slate-700">
                    Your answer: <span className="font-medium">{item.userAnswer || "(blank)"}</span>
                  </p>
                  <p className="text-sm text-slate-700">
                    Correct answer: <span className="font-semibold text-emerald-700">{item.correctAnswer}</span>
                  </p>
                </article>
              ))}
            </div>

            <div className="mt-5 flex flex-wrap justify-end gap-2">
              {wrongItems.length > 0 && (
                <button
                  type="button"
                  onClick={handleRetryWrongWords}
                  className="rounded-lg bg-gradient-to-r from-rose-500 to-orange-500 px-4 py-2 text-sm font-semibold text-white transition hover:opacity-95"
                >
                  Retry Only Wrong Words
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsResultOpen(false)}
                className="rounded-lg bg-ink px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold text-ink">{title}</h2>
          <p className="text-sm text-slate-600">{description}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {enableCategoryFilter && (
            <>
              <label htmlFor="category" className="text-sm font-medium text-slate-600">
                Category
              </label>
              <select
                id="category"
                value={selectedCategory}
                onChange={(event) => setSelectedCategory(event.target.value as WordCategory | "all")}
                className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none ring-sky-100 focus:border-sky-400 focus:ring-2"
              >
                {categoryOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </>
          )}

          <button
            type="button"
            onClick={startNewBatch}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400"
          >
            <RotateCw className="h-4 w-4" />
            Shuffle Now
          </button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {batch.map((word) => (
          <QuizCard
            key={word.id}
            word={word}
            value={answerMap[word.id] ?? ""}
            status={statusMap[word.id] ?? "idle"}
            onChange={(value) => handleInputChange(word.id, value)}
          />
        ))}
      </div>

      <div className="mt-7 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={handleCheckAnswers}
          className="inline-flex items-center gap-2 rounded-lg bg-ink px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          <CheckCheck className="h-4 w-4" />
          Check Answers
        </button>

        {allCorrect && (
          <button
            type="button"
            onClick={startNewBatch}
            className="inline-flex items-center gap-2 rounded-lg bg-sunset px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-600"
          >
            Next 10 Random Words
            <ArrowRight className="h-4 w-4" />
          </button>
        )}

        {allCorrect && (
          <p className="inline-flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700">
            <Trophy className="h-4 w-4" />
            Perfect round
          </p>
        )}
      </div>
    </section>
  );
};
