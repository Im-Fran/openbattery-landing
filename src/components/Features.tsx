import { useRef, useState } from "react";
import Section from "./Section";
import { useI18n } from "../i18n";
import "./Features.css";

// Screens in tab order; ids match the keys in the translation files.
const SCREENS = [
  { id: "charge", src: "/shots/charge.png", shortcut: "⌘1" },
  { id: "power", src: "/shots/power.png", shortcut: "⌘2" },
  { id: "health", src: "/shots/health.png", shortcut: "⌘3" },
  { id: "lifetime", src: "/shots/lifetime.png", shortcut: "⌘4" },
  { id: "menubar", src: "/shots/menubar.png", shortcut: null },
] as const;

export default function Features() {
  const { t } = useI18n();
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  // ARIA tabs keyboard pattern: arrows wrap, Home/End jump to the ends.
  function onKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    const last = SCREENS.length - 1;
    const next =
      event.key === "ArrowRight"
        ? active === last
          ? 0
          : active + 1
        : event.key === "ArrowLeft"
          ? active === 0
            ? last
            : active - 1
          : event.key === "Home"
            ? 0
            : event.key === "End"
              ? last
              : -1;
    if (next < 0) return;
    event.preventDefault();
    setActive(next);
    tabs.current[next]?.focus();
  }

  const screen = SCREENS[active];
  const copy = t.features.items[screen.id];

  return (
    <Section id="features" title={t.features.title} lede={t.features.lede}>
      <div className="features__tabs">
        <div
          className="features__tablist"
          role="tablist"
          aria-label={t.features.tablist}
          onKeyDown={onKeyDown}
        >
          {SCREENS.map(({ id, shortcut }, i) => (
            <button
              key={id}
              ref={(node) => {
                tabs.current[i] = node;
              }}
              type="button"
              role="tab"
              id={`tab-${id}`}
              className="features__tab"
              aria-label={
                shortcut
                  ? `${t.features.items[id].name} (${shortcut.replace("⌘", `${t.features.commandKey}-`)})`
                  : undefined
              }
              aria-selected={i === active}
              aria-controls={i === active ? `panel-${id}` : undefined}
              tabIndex={i === active ? 0 : -1}
              onClick={() => setActive(i)}
            >
              {t.features.items[id].name}
              <kbd className="features__kbd" aria-hidden="true">{shortcut ?? t.features.items.menubar.shortcut}</kbd>
            </button>
          ))}
        </div>

        <div
          className="features__panel"
          role="tabpanel"
          id={`panel-${screen.id}`}
          aria-labelledby={`tab-${screen.id}`}
          tabIndex={0}
        >
          {/* keyed on the shot so React swaps the node and the fade replays */}
          <div className="features__shot" key={screen.id}>
            <img src={screen.src} alt={copy.alt} />
          </div>
          <p className="features__copy">{copy.copy}</p>
        </div>
      </div>
    </Section>
  );
}
