import type { ReactNode } from "react";
import "./Section.css";

type Props = {
  id: string;
  title: string;
  lede?: ReactNode;
  children?: ReactNode;
};

/** Shared shell for every content section: heading, optional lede, body. */
export default function Section({ id, title, lede, children }: Props) {
  return (
    <section className="section" id={id}>
      <div className="section__inner">
        <header className="section__head">
          <h2 className="section__title">{title}</h2>
          {lede && <p className="section__lede">{lede}</p>}
        </header>
        {children}
      </div>
    </section>
  );
}
