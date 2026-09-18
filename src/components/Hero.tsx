import AppStoreBadge from "./AppStoreBadge";
import GitHubButton from "./GitHubButton";
import { useI18n } from "../i18n";
import "./Hero.css";

// Paint order, back to front. Charge sits on top because it is the default tab.
const CARDS = [
  { src: "/shots/health.png", rotation: "-13deg" },
  { src: "/shots/lifetime.png", rotation: "-4.5deg" },
  { src: "/shots/power.png", rotation: "4deg" },
  { src: "/shots/charge.png", rotation: "12.5deg" },
];

export default function Hero() {
  const { t } = useI18n();
  const badges = [
    { label: t.hero.badges.os, value: "macOS 14+" },
    { label: t.hero.badges.chip, value: "Apple Silicon" },
  ];

  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero__inner">
        <div className="hero__copy">
          <img
            className="hero__icon"
            src="/openbattery-icon.svg"
            alt=""
            width={1024}
            height={1024}
          />

          <div className="hero__titleblock">
            <h1 className="hero__name" id="hero-title">
              OpenBattery
              <span className="hero__led" aria-hidden="true" />
            </h1>
            <p className="hero__tagline">{t.hero.tagline}</p>
            <p className="hero__subtitle">{t.hero.subtitle}</p>
          </div>

          <div className="hero__readout" role="img" aria-label={t.hero.readoutAlt}>
            <span>97%</span>
            <hr />
            {/* is-charging stays on the signed watt value only — negative watts in green would lie */}
            <span className="is-charging">+8.6&nbsp;W</span>
            <hr />
            <span>4,991&nbsp;mAh</span>
          </div>

          <div className="hero__actions">
            <AppStoreBadge />
            <GitHubButton />
          </div>

          <ul className="hero__badges">
            {badges.map(({ label, value }) => (
              <li key={value}>
                <b>{label}</b>
                {value}
              </li>
            ))}
          </ul>
        </div>

        <div className="hero__panel">
          <div className="deck" role="img" aria-label={t.hero.deckAlt}>
            {CARDS.map(({ src, rotation }, i) => (
              <img
                key={src}
                className="deck__card"
                style={
                  {
                    "--i": i,
                    transform: `rotate(${rotation})`,
                  } as React.CSSProperties
                }
                src={src}
                alt=""
                width={993}
                height={787}
              />
            ))}
            <img
              className="deck__popover"
              src="/shots/menubar.png"
              alt=""
              width={346}
              height={457}
            />
          </div>
          <div className="hero__caption">
            <span>{t.hero.captionLeft}</span>
            <span>{t.hero.captionRight}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
