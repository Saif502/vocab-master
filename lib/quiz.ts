import type { CategorizedWord, WordCategory } from "@/lib/words";

const PARENS_REGEX = /\(.*?\)/g;

const normalize = (value: string): string => {
  return value
    .toLowerCase()
    .replace(PARENS_REGEX, " ")
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .replace(/\s+/g, " ")
    .trim();
};

const getAcceptedAnswers = (english: string): string[] => {
  const variants = english
    .split("/")
    .map((part) => normalize(part))
    .filter(Boolean);

  const normalizedFull = normalize(english);
  if (normalizedFull) {
    variants.push(normalizedFull);
  }

  return Array.from(new Set(variants));
};

const shuffle = <T,>(list: T[]): T[] => {
  const cloned = [...list];
  for (let i = cloned.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [cloned[i], cloned[j]] = [cloned[j], cloned[i]];
  }
  return cloned;
};

export const isCorrectAnswer = (input: string, english: string): boolean => {
  const normalizedInput = normalize(input);
  if (!normalizedInput) {
    return false;
  }

  return getAcceptedAnswers(english).includes(normalizedInput);
};

export const getPrimaryAnswer = (english: string): string => {
  return english.split("/")[0]?.trim() ?? english;
};

export const buildQuizBatch = (
  allWords: CategorizedWord[],
  mistakenIds: number[],
  category: WordCategory | "all" = "all",
  size = 10
): CategorizedWord[] => {
  const categoryPool =
    category === "all" ? allWords : allWords.filter((word) => word.category === category);

  const mistakenPool = categoryPool.filter((word) => mistakenIds.includes(word.id));
  const mistakenSelection = shuffle(mistakenPool).slice(0, size);

  const selectedIds = new Set(mistakenSelection.map((word) => word.id));
  const remainingPool = categoryPool.filter((word) => !selectedIds.has(word.id));
  const remainingSelection = shuffle(remainingPool).slice(0, Math.max(0, size - mistakenSelection.length));

  return shuffle([...mistakenSelection, ...remainingSelection]);
};
