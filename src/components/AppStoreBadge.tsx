import { useI18n } from "../i18n";
import "./AppStoreBadge.css";

export const APP_STORE_URL = "https://apps.apple.com/app/id6813272713";

/** Apple's own lockup, one SVG per locale. Never recolored, never re-typeset. */
export default function AppStoreBadge() {
  const { lang, t } = useI18n();

  return (
    <a
      className="appstore"
      href={APP_STORE_URL}
      target="_blank"
      rel="noreferrer"
    >
      <img src={`/badges/mac-app-store-${lang}.svg`} alt={t.appStore.alt} width={156} height={40} />
    </a>
  );
}
