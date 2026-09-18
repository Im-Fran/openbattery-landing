import { useEffect, useState, type ReactNode } from "react";
import { DICTS, I18nContext, QUERY_KEY, STORAGE_KEY, initialLang, type Lang } from ".";

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(initialLang);
  // empty on first load: arriving in a language is not a status change
  const [announcement, setAnnouncement] = useState("");

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  /** Only a deliberate choice is remembered, and only a deliberate choice goes
      in the URL. Writing ?lang= on every load would mean anyone sharing the
      page pins their own language onto whoever opens it. */
  function choose(next: Lang) {
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // storage denied: the choice just won't survive a reload
    }

    // ...but once chosen it does belong in the URL, so the link is shareable
    const url = new URL(window.location.href);
    url.searchParams.set(QUERY_KEY, next);
    window.history.replaceState(null, "", url);

    setLang(next);
    setAnnouncement(DICTS[next].lang.changed);
  }

  return (
    <I18nContext value={{ lang, setLang: choose, t: DICTS[lang] }}>
      {children}
      {/* the whole page swaps silently otherwise. lang sits on the element
          itself, not only on <html>, which lags by an effect — otherwise the
          Spanish confirmation gets read by the English voice. */}
      <p role="status" lang={lang} className="sr-only">
        {announcement}
      </p>
    </I18nContext>
  );
}
