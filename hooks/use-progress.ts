"use client";

import { useEffect, useMemo, useState } from "react";

type ProgressState = {
  masteredIds: number[];
  mistakenIds: number[];
  streak: number;
  lastPracticeDate: string | null;
  dailyCorrectIds: number[];
  dailyDate: string | null;
};

const STORAGE_KEY = "vocabmaster.progress.v1";

const defaultState: ProgressState = {
  masteredIds: [],
  mistakenIds: [],
  streak: 0,
  lastPracticeDate: null,
  dailyCorrectIds: [],
  dailyDate: null
};

const toISODate = (date: Date): string => {
  return date.toISOString().slice(0, 10);
};

const getYesterdayISO = (): string => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return toISODate(yesterday);
};

const normalizeForToday = (state: ProgressState): ProgressState => {
  const today = toISODate(new Date());
  if (state.dailyDate === today) {
    return state;
  }

  return {
    ...state,
    dailyDate: today,
    dailyCorrectIds: []
  };
};

export const useProgress = () => {
  const [progress, setProgress] = useState<ProgressState>(defaultState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as ProgressState;
        setProgress({
          masteredIds: parsed.masteredIds ?? [],
          mistakenIds: parsed.mistakenIds ?? [],
          streak: parsed.streak ?? 0,
          lastPracticeDate: parsed.lastPracticeDate ?? null,
          dailyCorrectIds: parsed.dailyCorrectIds ?? [],
          dailyDate: parsed.dailyDate ?? null
        });
      } catch {
        setProgress(defaultState);
      }
    }

    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }, [hydrated, progress]);

  const registerPractice = (state: ProgressState): ProgressState => {
    const today = toISODate(new Date());
    if (state.lastPracticeDate === today) {
      return state;
    }

    const nextStreak = state.lastPracticeDate === getYesterdayISO() ? state.streak + 1 : 1;
    return {
      ...state,
      streak: nextStreak,
      lastPracticeDate: today
    };
  };

  const markCorrect = (id: number) => {
    setProgress((prev) => {
      const withPractice = normalizeForToday(registerPractice(prev));
      const masteredSet = new Set(withPractice.masteredIds);
      masteredSet.add(id);
      const dailySet = new Set(withPractice.dailyCorrectIds);
      dailySet.add(id);

      return {
        ...withPractice,
        masteredIds: Array.from(masteredSet),
        mistakenIds: withPractice.mistakenIds.filter((wordId) => wordId !== id),
        dailyCorrectIds: Array.from(dailySet)
      };
    });
  };

  const markIncorrect = (id: number) => {
    setProgress((prev) => {
      const withPractice = normalizeForToday(registerPractice(prev));
      const mistakenSet = new Set(withPractice.mistakenIds);
      mistakenSet.add(id);

      return {
        ...withPractice,
        mistakenIds: Array.from(mistakenSet)
      };
    });
  };

  const masteredCount = useMemo(() => progress.masteredIds.length, [progress.masteredIds.length]);

  const resetProgress = () => {
    setProgress(defaultState);
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  };

  return {
    hydrated,
    progress,
    masteredCount,
    markCorrect,
    markIncorrect,
    resetProgress
  };
};
