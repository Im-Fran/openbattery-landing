import { createContext, use } from "react";
import en from "./en.json";
import es from "./es.json";

export type Lang = "en" | "es";
export type Dict = typeof en;

/** `satisfies` is the type check: es.json must have the same shape as en.json. */
export const DICTS = { en, es } satisfies Record<Lang, Dict>;

export const LANGS = Object.keys(DICTS) as Lang[];

export const STORAGE_KEY = "ob-lang";
export const QUERY_KEY = "lang";

function isLang(value: string | null): value is Lang {
  return value === "en" || value === "es";
}

/** Reading storage throws where it is blocked outright, e.g. Safari's
    "Block all cookies" — and this runs during the provider's first render,
    so an unguarded throw blanks the page. */
function storedLang(): Lang | null {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return isLang(saved) ? saved : null;
  } catch {
    return null;
  }
}

/** A shared link wins over what this browser happens to remember: whoever sent
    the link chose the language on purpose. */
export function initialLang(): Lang {
  const asked = new URLSearchParams(window.location.search).get(QUERY_KEY);
  if (isLang(asked)) return asked;
  return storedLang() ?? ((navigator.language ?? "").toLowerCase().startsWith("es") ? "es" : "en");
}

type Value = { lang: Lang; setLang: (lang: Lang) => void; t: Dict };

export const I18nContext = createContext<Value | null>(null);

export function useI18n(): Value {
  const value = use(I18nContext);
  if (!value) throw new Error("useI18n must be used inside <I18nProvider>");
  return value;
}
