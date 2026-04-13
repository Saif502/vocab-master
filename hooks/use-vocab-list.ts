"use client";

import { useEffect, useMemo, useState } from "react";

import {
  type StoredWord,
  readStoredWords,
  writeStoredWords
} from "@/lib/vocab-storage";

const normalizeWord = (value: string) => value.trim().toLowerCase();

export const useVocabList = () => {
  const [words, setWords] = useState<StoredWord[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const syncFromStorage = () => {
      const nextWords = readStoredWords();
      setWords(nextWords);
    };

    syncFromStorage();
    setHydrated(true);

    window.addEventListener("storage", syncFromStorage);
    window.addEventListener("vocab-list-updated", syncFromStorage);

    return () => {
      window.removeEventListener("storage", syncFromStorage);
      window.removeEventListener("vocab-list-updated", syncFromStorage);
    };
  }, []);

  const addWord = (en: string, bn: string, category?: string) => {
    const normalizedEn = normalizeWord(en);
    const normalizedBn = bn.trim();

    if (!normalizedEn || !normalizedBn) {
      return { ok: false as const, message: "English and Bengali are required." };
    }

    const exists = words.some((word) => normalizeWord(word.en) === normalizedEn);
    if (exists) {
      return { ok: false as const, message: "Word already exists in your vocabulary!" };
    }

    const nextId = words.reduce((max, word) => Math.max(max, word.id), 0) + 1;
    const nextWord: StoredWord = { id: nextId, en: en.trim(), bn: normalizedBn, category };
    const nextWords = [...words, nextWord];
    writeStoredWords(nextWords);
    setWords(nextWords);

    return { ok: true as const, message: "Word saved successfully." };
  };

  const hasWord = (en: string) => {
    const normalizedEn = normalizeWord(en);
    if (!normalizedEn) {
      return false;
    }

    return words.some((word) => normalizeWord(word.en) === normalizedEn);
  };

  const getWordByEnglish = (en: string) => {
    const normalizedEn = normalizeWord(en);
    if (!normalizedEn) {
      return null;
    }

    return words.find((word) => normalizeWord(word.en) === normalizedEn) ?? null;
  };

  const updateWord = (id: number, en: string, bn: string, category?: string) => {
    const normalizedEn = normalizeWord(en);
    const normalizedBn = bn.trim();

    if (!normalizedEn || !normalizedBn) {
      return { ok: false as const, message: "English and Bengali are required." };
    }

    const conflict = words.some(
      (word) => word.id !== id && normalizeWord(word.en) === normalizedEn
    );
    if (conflict) {
      return { ok: false as const, message: "Another word already uses this English spelling." };
    }

    const nextWords = words.map((word) =>
      word.id === id
        ? {
            ...word,
            en: en.trim(),
            bn: normalizedBn,
            category
          }
        : word
    );

    writeStoredWords(nextWords);
    setWords(nextWords);

    return { ok: true as const, message: "Word updated successfully." };
  };

  const totalWords = useMemo(() => words.length, [words.length]);

  return {
    hydrated,
    words,
    totalWords,
    addWord,
    hasWord,
    getWordByEnglish,
    updateWord
  };
};
