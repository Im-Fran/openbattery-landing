import Section from "./Section";
import AppStoreBadge from "./AppStoreBadge";
import GitHubButton from "./GitHubButton";
import { useI18n } from "../i18n";
import "./Get.css";

export default function Get() {
  const { t } = useI18n();

  return (
    <Section id="get" title={t.get.title} lede={t.get.lede}>
      <div className="get__actions">
        <AppStoreBadge />
        <GitHubButton />
      </div>
      <ul className="facts">
        {t.get.facts.map(({ lead, copy }) => (
          <li key={lead}>
            <b>{lead}</b>
            {copy}
          </li>
        ))}
      </ul>
    </Section>
  );
}
