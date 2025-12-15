import en from "../json/english.json";
import tr from "../json/turkish.json";

export type LanguageCode = "en" | "tr";

type Dictionary = Record<string, any>;

const dictionaries: Record<LanguageCode, Dictionary> = {
  en,
  tr,
};

let currentLang: LanguageCode = "en";

type Listener = (lang: LanguageCode) => void;
const listeners = new Set<Listener>();

export function getLanguage(): LanguageCode {
  return currentLang;
}

export function setLanguage(lang: LanguageCode) {
  if (lang === currentLang) return;
  currentLang = lang;
  listeners.forEach((fn) => fn(lang));
}

export function onLanguageChange(fn: Listener): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function getStrings(): Dictionary {
  return dictionaries[currentLang];
}


