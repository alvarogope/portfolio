import type { Metadata } from "next";
import Image from "next/image";
import { about } from "@/content/about";
import Section from "@/components/layout/Section";
import SectionHeading from "@/components/layout/SectionHeading";
import Reveal from "@/components/layout/Reveal";
import DialogueTree from "@/components/project/DialogueTree";
import TechBadges from "@/components/project/TechBadges";

export const metadata: Metadata = {
  title: "About | Álvaro Gómez",
  description: "The story behind the work: how I came to design games, and why I build them myself.",
};

export default function AboutPage() {
  const cf = about.characterFile;

  return (
    <Section>
      {/* Character header: emblem + intro */}
      <Reveal>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 200px) minmax(0, 1fr)",
            gap: "clamp(1.5rem, 4vw, 3rem)",
            alignItems: "center",
            marginTop: "2rem",
          }}
          className="about-header"
        >
          {/* Emblem / logo */}
          <div
            style={{
              position: "relative",
              aspectRatio: "1 / 1",
              borderRadius: "50%",
              overflow: "hidden",
              border: "1px solid color-mix(in srgb, var(--color-gold) 40%, transparent)",
              background: "var(--color-nightfall)",
            }}
          >
            <Image src="/images/logo.png" alt="Álvaro Gómez emblem" fill style={{ objectFit: "cover" }} />
          </div>

          <div>
            <p className="mono" style={{ color: "var(--color-silver)", fontSize: "0.75rem", marginBottom: "0.75rem" }}>
              {about.role}
            </p>
            <h1 style={{ fontSize: "var(--text-hero)", margin: 0, lineHeight: 1.05, fontFamily: "var(--font-hero)" }}>
              {about.name}
            </h1>
          </div>
        </div>
      </Reveal>

      {/* Intro beside the character file. Two columns on desktop; the
          intro leads and the panel follows once they stack. */}
      <Reveal>
        <div className="about-intro-row">
          <p
            style={{
              fontSize: "var(--text-lg)",
              margin: 0,
              maxWidth: "44rem",
              lineHeight: 1.7,
            }}
          >
            {about.intro}
          </p>

          <div>
            <SectionHeading kicker="Character File" title="The Basics" />
            <div
              className="panel"
              style={{
                marginTop: "1.5rem",
                border: "1px solid color-mix(in srgb, var(--color-mist) 20%, transparent)",
                padding: "clamp(1.5rem, 4vw, 2.25rem)",
                display: "grid",
                gap: "1.75rem",
              }}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                <span className="mono" style={{ fontSize: "0.72rem", color: "var(--color-silver)" }}>
                  Class
                </span>
                <span style={{ fontSize: "0.98rem", lineHeight: 1.55 }}>{cf.role}</span>
              </div>

              <TechBadges groups={about.tech} />
            </div>
          </div>
        </div>
      </Reveal>

      {/* Dialogue — the signature interactive piece */}
      {about.dialogue && (
        <Reveal>
          <div style={{ marginTop: "3.5rem" }}>
            <SectionHeading kicker="Dialogue" title="Ask me" />
            <p style={{ color: "var(--color-mist)", maxWidth: "42rem", margin: "1rem 0 1.75rem" }}>
              Pick a line.
            </p>
            <DialogueTree lines={about.dialogue} />
          </div>
        </Reveal>
      )}
      
      {/* Story sections as lore entries */}
      <div style={{ marginTop: "1rem" }}>
        {about.sections.map((s, i) => (
          <Reveal key={s.title}>
            <div style={{ marginTop: "4rem", maxWidth: "44rem" }}>
              <SectionHeading kicker={`${String(i + 1).padStart(2, "0")} · ${s.kicker}`} title={s.title} />
              <p style={{ marginTop: "1rem", lineHeight: 1.75 }}>{s.body}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}