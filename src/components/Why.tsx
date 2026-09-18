import Section from "./Section";
import { useI18n } from "../i18n";

export default function Why() {
  const { t } = useI18n();

  return (
    <Section id="why" title={t.why.title} lede={t.why.lede}>
      <ul className="cards">
        {t.why.reasons.map(({ title, copy }) => (
          <li key={title}>
            <h3>{title}</h3>
            <p>{copy}</p>
          </li>
        ))}
      </ul>
    </Section>
  );
}
