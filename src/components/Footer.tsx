import LangSwitch from "./LangSwitch";
import { useI18n } from "../i18n";
import "./Footer.css";

export default function Footer() {
  const { t } = useI18n();
  const links = [
    {
      href: "https://franciscosolis.cl/legal#terms-of-service",
      label: t.footer.terms,
    },
    {
      href: "https://franciscosolis.cl/legal#privacy-policy",
      label: t.footer.privacy,
    },
    { href: "https://github.com/Im-Fran/openbattery", label: t.footer.github },
  ];

  return (
    <footer className="footer">
      <div className="footer__inner">
        <p className="footer__copy">
          {t.footer.copy.replace("{year}", String(new Date().getFullYear()))}
        </p>
        <div className="footer__right">
          <nav className="footer__links" aria-label={t.footer.navLabel}>
            {links.map(({ href, label }) => (
              <a key={href} href={href} target="_blank" rel="noreferrer">
                {label}
              </a>
            ))}
          </nav>
          <LangSwitch variant="inline" />
        </div>
      </div>
    </footer>
  );
}
