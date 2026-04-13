import { allWords } from "@/allWords";

export type Word = {
  id: number;
  en: string;
  bn: string;
};

export type WordCategory =
  | "time-money"
  | "academics"
  | "nature"
  | "animals-plants"
  | "countries-languages"
  | "tourism-verbs"
  | "adjectives-hobbies"
  | "weather-places"
  | "media-society"
  | "education-business-health"
  | "architecture-housing"
  | "city-work"
  | "sports"
  | "shapes-transport-materials-jobs"
  | "misc";

export type CategorizedWord = Word & {
  category: WordCategory;
};

export const CATEGORY_LABELS: Record<WordCategory, string> = {
  "time-money": "Time & Money",
  academics: "Academics",
  nature: "Nature & Environment",
  "animals-plants": "Animals & Plants",
  "countries-languages": "Countries & Languages",
  "tourism-verbs": "Tourism & Verbs",
  "adjectives-hobbies": "Adjectives & Hobbies",
  "weather-places": "Weather & Places",
  "media-society": "Media & Society",
  "education-business-health": "Education, Business & Health",
  "architecture-housing": "Architecture & Housing",
  "city-work": "City & Work",
  sports: "Sports",
  "shapes-transport-materials-jobs": "Shapes, Transport, Materials & Jobs",
  misc: "Mixed"
};

const getCategoryById = (id: number): WordCategory => {
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

export const words: CategorizedWord[] = (allWords as Word[]).map((word) => ({
  ...word,
  category: getCategoryById(word.id)
}));
