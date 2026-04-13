"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

import { ThemeToggle } from "@/components/theme-toggle";
import { useTheme } from "@/hooks/use-theme";
import { useVocabList } from "@/hooks/use-vocab-list";
import { CATEGORY_LABELS } from "@/lib/words";

export default function AddVocabPage() {
  const { words, addWord, hasWord, hydrated, getWordByEnglish, updateWord } = useVocabList();
  const { themeMode, toggleTheme } = useTheme();

  const [english, setEnglish] = useState("");
  const [bengali, setBengali] = useState("");
  const [category, setCategory] = useState<string>("misc");
  const [modifyMode, setModifyMode] = useState(false);
  const [modifyEnglish, setModifyEnglish] = useState("");
  const [modifyBengali, setModifyBengali] = useState("");
  const [modifyCategory, setModifyCategory] = useState<string>("misc");
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const duplicate = useMemo(() => hasWord(english), [english, hasWord]);
  const existingWord = useMemo(() => getWordByEnglish(english), [english, getWordByEnglish]);

  const handleSave = () => {
    const result = addWord(english, bengali, category);
    if (!result.ok) {
      setMessage({ type: "error", text: result.message });
      return;
    }

    setEnglish("");
    setBengali("");
    setCategory("misc");
    setMessage({ type: "success", text: result.message });
  };

  const handleEnableModify = () => {
    if (!existingWord) {
      return;
    }

    setModifyMode(true);
    setModifyEnglish(existingWord.en);
    setModifyBengali(existingWord.bn);
    setModifyCategory((existingWord.category as string) || "misc");
    setMessage(null);
  };

  const handleUpdate = () => {
    if (!existingWord) {
      setMessage({ type: "error", text: "No matching word found to update." });
      return;
    }

    const result = updateWord(existingWord.id, modifyEnglish, modifyBengali, modifyCategory);
    if (!result.ok) {
      setMessage({ type: "error", text: result.message });
      return;
    }

    setEnglish(modifyEnglish);
    setModifyMode(false);
    setMessage({ type: "success", text: result.message });
  };

  return (
    <main className="mx-auto min-h-screen w-full max-w-3xl px-4 py-8 md:px-6 lg:py-10">
      <div className="mb-6 flex items-center justify-between">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900">
          <ChevronLeft className="h-4 w-4" />
          Back to Home
        </Link>
        <ThemeToggle themeMode={themeMode} onToggle={toggleTheme} />
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-soft">
        <h1 className="text-3xl font-bold text-ink">Add Vocab</h1>
        <p className="mt-2 text-sm text-slate-600">Add custom words to your personal vocabulary list stored in localStorage.</p>

        <div className="mt-6 space-y-4">
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-600">English Word</span>
            <input
              type="text"
              value={english}
              onChange={(event) => {
                setEnglish(event.target.value);
                setMessage(null);
                setModifyMode(false);
              }}
              spellCheck={false}
              autoComplete="off"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
              placeholder="e.g. resilient"
            />
          </label>

          {english.trim() && duplicate && (
            <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
              <p className="font-medium">Word already exists in your vocabulary!</p>
              {!modifyMode && (
                <button
                  type="button"
                  onClick={handleEnableModify}
                  className="mt-2 rounded-md bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-900 transition hover:bg-amber-200"
                >
                  Do you want to modify?
                </button>
              )}
            </div>
          )}

          {modifyMode && existingWord && (
            <div className="space-y-4 rounded-xl border border-sky-200 bg-sky-50 p-4">
              <p className="text-sm font-semibold text-sky-800">Modify Existing Word</p>
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-700">English Word</span>
                <input
                  type="text"
                  value={modifyEnglish}
                  onChange={(event) => {
                    setModifyEnglish(event.target.value);
                    setMessage(null);
                  }}
                  spellCheck={false}
                  autoComplete="off"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-700">Bengali Meaning</span>
                <input
                  type="text"
                  value={modifyBengali}
                  onChange={(event) => {
                    setModifyBengali(event.target.value);
                    setMessage(null);
                  }}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-700">Category</span>
                <select
                  value={modifyCategory}
                  onChange={(event) => {
                    setModifyCategory(event.target.value);
                    setMessage(null);
                  }}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                >
                  {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </select>
              </label>

              <button
                type="button"
                onClick={handleUpdate}
                disabled={!modifyEnglish.trim() || !modifyBengali.trim()}
                className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Update Word
              </button>
            </div>
          )}

          {english.trim() && !duplicate && (
            <>
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-600">Bengali Meaning</span>
                <input
                  type="text"
                  value={bengali}
                  onChange={(event) => {
                    setBengali(event.target.value);
                    setMessage(null);
                  }}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                  placeholder="বাংলা অর্থ লিখুন"
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-600">Category</span>
                <select
                  value={category}
                  onChange={(event) => {
                    setCategory(event.target.value);
                    setMessage(null);
                  }}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                >
                  {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </select>
              </label>
            </>
          )}
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleSave}
            disabled={!hydrated || !english.trim() || duplicate || !bengali.trim()}
            className="rounded-lg bg-ink px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Save Word
          </button>
          <p className="text-sm text-slate-500">Current vocabulary size: {words.length}</p>
        </div>

        {message && (
          <p
            className={`mt-4 rounded-lg px-3 py-2 text-sm font-medium ${
              message.type === "success"
                ? "border border-emerald-200 bg-emerald-50 text-emerald-800"
                : "border border-rose-200 bg-rose-50 text-rose-800"
            }`}
          >
            {message.text}
          </p>
        )}
      </section>
    </main>
  );
}
