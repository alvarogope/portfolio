import type { Metadata } from "next";
import { breakIn as p } from "@/content/games/break-in";
import Section from "@/components/layout/Section";
import SectionHeading from "@/components/layout/SectionHeading";
import ProjectHero from "@/components/project/ProjectHero";
import RoleCard from "@/components/project/RoleCard";
import ChallengeQuote from "@/components/project/ChallengeQuote";

export const metadata: Metadata = {
  title: `${p.title} | Álvaro Gómez`,
  description: p.systemsHook,
};

export default function BreakInPage() {
  return (
    <>
      <ProjectHero project={p} posterSrc="/images/break-in/poster.png" />

      <Section>
        {/* Vision */}
        <div style={{ maxWidth: "42rem" }}>
          <SectionHeading kicker="01 · Overview" title="The Vision" />
          <p style={{ marginTop: "1rem" }}>{p.vision}</p>
        </div>

        {/* The Four Roles — signature section */}
        {p.roles && (
          <div style={{ marginTop: "5rem" }}>
            <SectionHeading kicker="02 · Signature Systems" title="Four Roles, One Web" />
            <p style={{ color: "var(--color-mist)", maxWidth: "42rem", marginTop: "1.5rem", marginBottom: "1.5rem" }}>
              No role can finish the heist alone. Read across the four and the dependency forms a loop: each player holds a key another player needs.
            </p>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                gap: "1.25rem",
              }}
            >
              {p.roles.map((r) => (
                <RoleCard key={r.name} role={r} />
              ))}
            </div>
          </div>
        )}

        {/* Design Challenge */}
        {p.designChallenge && (
          <div style={{ marginTop: "5rem" }}>
            <SectionHeading kicker="03 · The Hard Part" title="Design Challenge" />
            <div style={{ marginTop: "1.5rem" }}>
              <ChallengeQuote challenge={p.designChallenge} />
            </div>
          </div>
        )}

        {/* Contributions */}
        <div style={{ marginTop: "5rem" }}>
          <SectionHeading kicker="04 · My Role" title="My Contribution" />
          <div style={{ display: "grid", gap: "1.5rem" }}>
            {p.contributions.map((c) => (
              <div key={c.label}>
                <span className="mono" style={{ fontSize: "0.75rem", color: "var(--color-silver)" }}>
                  {c.label}
                </span>
                <p style={{ marginTop: "0.4rem", maxWidth: "42rem" }}>{c.description}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>
    </>
  );
}