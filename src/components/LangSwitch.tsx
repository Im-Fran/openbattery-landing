import { LANGS, useI18n } from "../i18n";
import "./LangSwitch.css";

type Props = { variant?: "floating" | "inline" };

export default function LangSwitch({ variant = "floating" }: Props) {
  const { lang, setLang, t } = useI18n();

  return (
    <div className={`langswitch langswitch--${variant}`} role="group" aria-label={t.lang.label}>
      {LANGS.map((code) => (
        <button
          key={code}
          type="button"
          lang={code}
          className="langswitch__option"
          aria-pressed={code === lang}
          onClick={() => setLang(code)}
        >
          {t.lang[code]}
        </button>
      ))}
    </div>
  );
}
