import type { Metadata } from "next";
import Image from "next/image";
import { about } from "@/content/about";
import Section from "@/components/layout/Section";
import Reveal from "@/components/layout/Reveal";
import DialogueTree from "@/components/project/DialogueTree";
import TechBadges from "@/components/project/TechBadges";

export const metadata: Metadata = {
  title: "About | Álvaro Gómez",
  description: "The story behind the work: how I came to design games, and why I build them myself.",
};

export default function AboutPage() {
  const characterFile = about.characterFile;

  return (
    <Section>
      <main className="about-inspect" aria-labelledby="about-title">
        <Reveal>
          <header className="about-inspect__header">
            <div className="about-inspect__emblem">
              <Image src="/images/logo.png" alt="Álvaro Gómez emblem" fill sizes="76px" />
            </div>
            <p className="mono about-inspect__kicker">Character Inspect</p>
            <h1 id="about-title" className="about-inspect__title">
              {about.headline}
            </h1>
            <p className="about-inspect__intro">{about.intro}</p>
            <div className="about-inspect__gold-rule" aria-hidden />
          </header>
        </Reveal>

        <div className="about-inspect__content">
          <Reveal>
            <aside className="about-character-file" aria-labelledby="character-file-title">
              <p id="character-file-title" className="mono about-inspect__section-label">
                Character File
              </p>
              <div className="about-character-file__class">
                <span className="mono">Class</span>
                <h2>{characterFile.role}</h2>
                <p>{characterFile.focus}</p>
              </div>
              <div className="about-character-file__divider" aria-hidden />
              <TechBadges groups={about.tech} />
            </aside>
          </Reveal>

          {about.dialogue && (
            <Reveal delay={80}>
              <section className="about-dialogue" aria-labelledby="dialogue-title">
                <p id="dialogue-title" className="mono about-inspect__section-label">
                  Dialogue
                </p>
                <DialogueTree lines={about.dialogue} />
              </section>
            </Reveal>
          )}
        </div>

        <section className="about-lore" aria-labelledby="lore-title">
          <Reveal>
            <div className="about-lore__heading">
              <p id="lore-title" className="mono about-inspect__section-label">Lore</p>
              <div aria-hidden />
            </div>
          </Reveal>

          {about.sections.map((section, index) => (
            <Reveal key={section.title} delay={index * 50}>
              <article className="about-lore__entry">
                <span className="about-lore__number" aria-hidden>
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <p className="mono about-lore__kicker">{section.kicker}</p>
                  <h2>{section.title}</h2>
                  <p>{section.body}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </section>
      </main>
    </Section>
  );
}
