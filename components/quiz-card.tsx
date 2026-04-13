"use client";

import { Volume2 } from "lucide-react";

import { CheckCircle2, CircleAlert } from "lucide-react";

import { getPrimaryAnswer } from "@/lib/quiz";
import type { Word } from "@/lib/words";

export type AnswerStatus = "idle" | "correct" | "incorrect";

type QuizCardProps = {
  word: Word;
  value: string;
  status: AnswerStatus;
  onChange: (value: string) => void;
};

export const QuizCard = ({ word, value, status, onChange }: QuizCardProps) => {
  const isCorrect = status === "correct";
  const isIncorrect = status === "incorrect";

  const speakWord = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      return;
    }

    const utterance = new SpeechSynthesisUtterance(getPrimaryAnswer(word.en));
    utterance.lang = "en-US";
    utterance.rate = 0.9;
    utterance.pitch = 1;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  return (
    <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">Word #{word.id}</p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={speakWord}
            className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:border-sky-300 hover:text-sky-600"
            aria-label={`Hear pronunciation for ${getPrimaryAnswer(word.en)}`}
            title="Hear pronunciation"
          >
            <Volume2 className="h-4 w-4" />
          </button>
          {isCorrect && <CheckCircle2 className="h-4 w-4 text-mint" />}
          {isIncorrect && <CircleAlert className="h-4 w-4 text-red-500" />}
        </div>
      </div>

      <p className="text-xl font-semibold text-ink" style={{ fontFamily: "var(--font-hind)" }}>
        {word.bn}
      </p>

      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        disabled={isCorrect}
        spellCheck={false}
        autoCorrect="off"
        autoCapitalize="none"
        autoComplete="off"
        placeholder="Type the English meaning"
        className={`mt-4 w-full rounded-lg border bg-white px-3 py-2 text-sm text-slate-800 outline-none transition ${
          isCorrect
            ? "border-mint ring-2 ring-mint/20"
            : isIncorrect
              ? "border-red-400 ring-2 ring-red-100"
              : "border-slate-300 focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
        }`}
      />

      {isIncorrect && (
        <p className="mt-2 text-sm text-red-600">
          Correct: <span className="font-semibold">{getPrimaryAnswer(word.en)}</span>
        </p>
      )}
    </article>
  );
};
