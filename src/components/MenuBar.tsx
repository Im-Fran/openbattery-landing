import Section from "./Section";
import { useI18n } from "../i18n";
import "./MenuBar.css";

// The first three fields are the ones IOKit hands over for free, no timer involved.
const FREE_FIELDS = 3;

export default function MenuBar() {
  const { t } = useI18n();

  return (
    <Section
      id="menu-bar"
      title={t.menubar.title}
      lede={
        <>
          {t.menubar.ledeBefore}
          <kbd>⌘,</kbd>
          {t.menubar.ledeAfter}
        </>
      }
    >
      <div className="menubar__mock" role="img" aria-label={t.menubar.mockAlt}>
        <span className="menubar__icon" aria-hidden="true">
          🔋
        </span>
        <span>97%</span>
        <span className="menubar__sep" aria-hidden="true">
          ·
        </span>
        <span className="menubar__charging">+8.6 W</span>
        <span className="menubar__sep" aria-hidden="true">
          ·
        </span>
        <span>4,991 mAh</span>
      </div>

      <ul className="menubar__fields">
        {t.menubar.fields.map((field, i) => (
          <li key={field} className={i < FREE_FIELDS ? "is-free" : undefined}>
            {field}
            {i < FREE_FIELDS && <span className="sr-only"> ({t.menubar.freeTag})</span>}
          </li>
        ))}
      </ul>
      <p className="menubar__key">
        <span className="menubar__dot" aria-hidden="true" /> {t.menubar.freeNote}
      </p>

      <ul className="facts">
        {t.menubar.facts.map(({ lead, copy }) => (
          <li key={lead}>
            <b>{lead}</b>
            {copy}
          </li>
        ))}
      </ul>
    </Section>
  );
}
