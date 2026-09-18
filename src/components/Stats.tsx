import { useI18n } from "../i18n";
import "./Stats.css";

const VALUES = [
  { id: "memory", value: "~18 MB" },
  { id: "cpu", value: "0 %" },
  { id: "accounts", value: "0" },
  { id: "local", value: "100 %" },
] as const;

export default function Stats() {
  const { t } = useI18n();

  return (
    <div className="stats">
      <dl className="stats__inner">
        {VALUES.map(({ id, value }) => (
          <div className="stats__item" key={id}>
            <dt className="stats__value">{value}</dt>
            <dd className="stats__label">{t.stats[id]}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
