import Section from "./Section";
import { useI18n } from "../i18n";

export function History() {
  const { t } = useI18n();

  return (
    <Section id="history" title={t.history.title} lede={t.history.lede}>
      <ul className="facts">
        {t.history.facts.map(({ lead, copy }) => (
          <li key={lead}>
            <b>{lead}</b>
            {copy}
          </li>
        ))}
      </ul>
    </Section>
  );
}

export function LimitCharging() {
  const { t } = useI18n();

  return (
    <Section id="limit-charging" title={t.limit.title}>
      <blockquote className="quote">{t.limit.quote}</blockquote>
      <p className="section__lede">{t.limit.lede}</p>
      <ol className="steps">
        <li>{t.limit.step1}</li>
        <li>
          {t.limit.step2Before}
          <kbd>ⓘ</kbd>
          {t.limit.step2Middle}
          <b>{t.limit.step2Bold}</b>
          {t.limit.step2After}
        </li>
        <li>
          {t.limit.step3Before}
          <b>{t.limit.step3Bold}</b>
          {t.limit.step3After}
        </li>
      </ol>
    </Section>
  );
}

export function Accessibility() {
  const { t } = useI18n();

  return (
    <Section id="accessibility" title={t.accessibility.title} lede={t.accessibility.lede}>
      <ul className="facts">
        {t.accessibility.facts.map(({ lead, copy }) => (
          <li key={lead}>
            <b>{lead}</b>
            {copy}
          </li>
        ))}
      </ul>
    </Section>
  );
}
