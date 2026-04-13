import { type CategorizedWord, type Word, type WordCategory, words, CATEGORY_LABELS } from "@/lib/words";

export const CUSTOM_VOCAB_KEY = "custom_vocab_list";

export type StoredWord = Word & {
  category?: WordCategory | string;
};

export const getSeedWords = (): StoredWord[] => {
  return words.map(({ id, en, bn }) => ({ id, en, bn }));
};

export const getWordCategory = (id: number): WordCategory => {
  if (id <= 59) return "time-money";
  if (id <= 82) return "academics";
  if (id <= 152) return "nature";
  if (id <= 189) return "animals-plants";
  if (id <= 237) return "countries-languages";
  if (id <= 276) return "tourism-verbs";
  if (id <= 346) return "adjectives-hobbies";
  if (id <= 376) return "weather-places";
  if (id <= 466) return "media-society";
  if (id <= 613) return "education-business-health";
  if (id <= 656) return "architecture-housing";
  if (id <= 705) return "city-work";
  if (id <= 757) return "sports";
  if (id <= 891) return "shapes-transport-materials-jobs";
  return "misc";
};

export const toCategorizedWords = (list: StoredWord[]): CategorizedWord[] => {
  return list.map((word) => ({ ...word, category: getWordCategory(word.id) }));
};

export const readStoredWords = (): StoredWord[] => {
  if (typeof window === "undefined") {
    return [];
  }

  const raw = window.localStorage.getItem(CUSTOM_VOCAB_KEY);
  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw) as StoredWord[];
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter(
      (item) =>
        typeof item?.id === "number" && typeof item?.en === "string" && typeof item?.bn === "string"
    );
  } catch {
    return [];
  }
};

export const writeStoredWords = (list: StoredWord[]) => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(CUSTOM_VOCAB_KEY, JSON.stringify(list));
  window.dispatchEvent(new CustomEvent("vocab-list-updated"));
};
