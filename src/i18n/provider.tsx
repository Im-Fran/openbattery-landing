import { useEffect, useState, type ReactNode } from "react";
import { DICTS, I18nContext, initialLang, STORAGE_KEY, type Lang } from ".";

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(initialLang);

  useEffect(() => {
    document.documentElement.lang = lang;
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // storage denied: the choice just won't survive a reload
    }
  }, [lang]);

  return <I18nContext value={{ lang, setLang, t: DICTS[lang] }}>{children}</I18nContext>;
}
