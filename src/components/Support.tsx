import { useI18n } from "../i18n";
import { REPO_URL } from "./GitHubButton";
import "./Section.css";
import "./Support.css";

const EMAIL = "contact@openbattery.app";
const NEW_ISSUE = `${REPO_URL}/issues/new`;

export default function Support() {
  const { t } = useI18n();
  // built here, not as a module constant: the subject is a translated string
  const mailto = `mailto:${EMAIL}?subject=${encodeURIComponent(t.support.emailSubject)}`;

  return (
    <section className="section" id="support" aria-labelledby="support-title">
      <div className="section__inner">
        <header className="section__head">
          <a className="support__back" href="/">
            <span aria-hidden="true">←</span> {t.support.back}
          </a>
          <h1 className="section__title" id="support-title">
            {t.support.title}
          </h1>
          <p className="section__lede">{t.support.lede}</p>
        </header>

        <ul className="cards">
          <li>
            <h2>{t.support.emailTitle}</h2>
            <p>{t.support.emailCopy}</p>
            <a className="support__action" href={mailto}>
              {t.support.emailAction}
            </a>
          </li>
          <li>
            <h2>{t.support.issueTitle}</h2>
            <p>{t.support.issueCopy}</p>
            <a className="support__action" href={NEW_ISSUE} target="_blank" rel="noreferrer">
              {t.support.issueAction}
            </a>
          </li>
        </ul>

        <p className="support__note">{t.support.note}</p>
      </div>
    </section>
  );
}
