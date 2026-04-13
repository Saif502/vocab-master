"use client";

import { useEffect } from "react";

import {
  CUSTOM_VOCAB_KEY,
  getSeedWords,
  readStoredWords,
  writeStoredWords
} from "@/lib/vocab-storage";

export const VocabProvider = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    const existing = window.localStorage.getItem(CUSTOM_VOCAB_KEY);

    if (!existing) {
      writeStoredWords(getSeedWords());
      return;
    }

    const parsed = readStoredWords();
    if (parsed.length === 0) {
      writeStoredWords(getSeedWords());
    }
  }, []);

  return <>{children}</>;
};
